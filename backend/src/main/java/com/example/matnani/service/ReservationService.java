package com.example.matnani.service;

import com.example.matnani.config.DuplicateReservationException;
import com.example.matnani.domain.entity.*;
import com.example.matnani.dto.response.ReservationResponse;
import com.example.matnani.repository.*;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.RequiredArgsConstructor;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final RedissonClient redissonClient;

    // 예약 생성 (Redis 분산락 + 재고 기반)
    public ReservationResponse createReservation(Long buyerId, Long productId, int quantity) {
        String lockKey = "reservation:product:" + productId;
        RLock lock = redissonClient.getLock(lockKey);

        try {
            boolean acquired = lock.tryLock(5, 10, TimeUnit.SECONDS);
            if (!acquired) {
                throw new RuntimeException("현재 예약 요청이 많습니다. 잠시 후 다시 시도해주세요.");
            }
            return createReservationInternal(buyerId, productId, quantity);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("예약 처리 중 오류가 발생했습니다.");
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    @Transactional
    protected ReservationResponse createReservationInternal(Long buyerId, Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        if (!product.getStatus().equals(ProductStatus.ON_SALE)) {
            throw new DuplicateReservationException("이미 예약 중이거나 판매 완료된 상품입니다.");
        }

        if (product.getSeller().getId().equals(buyerId)) {
            throw new RuntimeException("본인 상품은 예약할 수 없습니다.");
        }

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 밴 체크
        if (buyer.getBannedUntil() != null && buyer.getBannedUntil().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("노쇼 패널티로 " +
                    buyer.getBannedUntil().toLocalDate() + "까지 구매가 제한됩니다.");
        }

        // 인당 구매 한도 체크
        int alreadyReserved = reservationRepository
                .findByProductIdAndBuyerIdAndStatus(productId, buyerId, ReservationStatus.REQUESTED)
                .stream().mapToInt(Reservation::getQuantity).sum();
        if (alreadyReserved + quantity > product.getPerPersonLimit()) {
            throw new RuntimeException("인당 구매 한도(" + product.getPerPersonLimit() + "개)를 초과할 수 없습니다.");
        }

        // 재고 차감
        int newQty = product.getRemainingQuantity() - quantity;
        if (newQty < 0) throw new RuntimeException("재고가 부족합니다.");
        product.setRemainingQuantity(newQty);
        if (newQty == 0) product.updateStatus(ProductStatus.SOLD_OUT);

        Reservation reservation = Reservation.builder()
                .product(product)
                .buyer(buyer)
                .seller(product.getSeller())
                .finalPrice(product.getDiscountPrice() * quantity)
                .quantity(quantity)
                .status(ReservationStatus.REQUESTED)
                .build();

        reservationRepository.save(reservation);

        notificationService.createNotification(
                product.getSeller(),
                NotificationType.RESERVATION,
                null,
                reservation
        );

        return ReservationResponse.from(reservation);
    }

    // 예약 상태 변경
    @Transactional
    public ReservationResponse updateStatus(Long userId, Long reservationId, ReservationStatus status) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));

        boolean isSeller = reservation.getSeller().getId().equals(userId);
        boolean isBuyer = reservation.getBuyer().getId().equals(userId);

        if (!isSeller && !isBuyer) throw new RuntimeException("권한이 없습니다.");
        if (isBuyer && status != ReservationStatus.CANCELED) throw new RuntimeException("구매자는 취소만 가능합니다.");

        reservation.setStatus(status);

        Product product = reservation.getProduct();
        if (status == ReservationStatus.CANCELED) {
            int restored = product.getRemainingQuantity() + reservation.getQuantity();
            product.setRemainingQuantity(restored);
            if (product.getStatus() == ProductStatus.SOLD_OUT) {
                product.updateStatus(ProductStatus.ON_SALE);
            }
        } else if (status == ReservationStatus.COMPLETED) {
            product.updateStatus(ProductStatus.SOLD_OUT);
        }

        notificationService.createNotification(
                isSeller ? reservation.getBuyer() : reservation.getSeller(),
                NotificationType.STATUS_CHANGE,
                null,
                reservation
        );

        return ReservationResponse.from(reservation);
    }

    // 구매 내역
    public List<ReservationResponse> getPurchaseHistory(Long buyerId) {
        return reservationRepository
                .findByBuyerIdAndStatus(buyerId, ReservationStatus.COMPLETED)
                .stream()
                .map(ReservationResponse::from)
                .collect(Collectors.toList());
    }

    // 예약 내역 (status/role 필터)
    public List<ReservationResponse> getReservationHistory(Long userId,
                                                           ReservationStatus status,
                                                           String role) {
        List<Reservation> reservations;

        if ("seller".equals(role)) {
            reservations = status != null
                    ? reservationRepository.findBySellerIdAndStatus(userId, status)
                    : reservationRepository.findBySellerId(userId);
        } else if ("buyer".equals(role)) {
            reservations = status != null
                    ? reservationRepository.findByBuyerIdAndStatus(userId, status)
                    : reservationRepository.findByBuyerId(userId);
        } else {
            List<Reservation> asBuyer = status != null
                    ? reservationRepository.findByBuyerIdAndStatus(userId, status)
                    : reservationRepository.findByBuyerId(userId);
            List<Reservation> asSeller = status != null
                    ? reservationRepository.findBySellerIdAndStatus(userId, status)
                    : reservationRepository.findBySellerId(userId);
            reservations = new ArrayList<>();
            reservations.addAll(asBuyer);
            reservations.addAll(asSeller);
        }

        return reservations.stream()
                .map(ReservationResponse::from)
                .collect(Collectors.toList());
    }

    // 판매 내역
    public List<ReservationResponse> getSalesHistory(Long sellerId) {
        return reservationRepository.findBySellerId(sellerId)
                .stream()
                .map(ReservationResponse::from)
                .collect(Collectors.toList());
    }

    // 마이페이지 - 절약 금액
    public int getTotalSavings(Long buyerId) {
        return reservationRepository
                .findByBuyerIdAndStatus(buyerId, ReservationStatus.COMPLETED)
                .stream()
                .mapToInt(r -> (r.getProduct().getOriginalPrice() - r.getFinalPrice()) * r.getQuantity())
                .sum();
    }

    // 마이페이지 - 구출 횟수
    public int getRescueCount(Long buyerId) {
        return (int) reservationRepository
                .findByBuyerIdAndStatus(buyerId, ReservationStatus.COMPLETED)
                .stream()
                .mapToInt(Reservation::getQuantity)
                .sum();
    }
}