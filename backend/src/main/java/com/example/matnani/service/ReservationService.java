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
        if (quantity < 1) {
            throw new RuntimeException("예약 수량은 1개 이상이어야 합니다.");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        if (!product.getStatus().equals(ProductStatus.ON_SALE)) {
            throw new DuplicateReservationException("이미 예약 중이거나 판매 완료된 상품입니다.");
        }

        if (product.getSeller().getId().equals(buyerId)) {
            throw new RuntimeException("본인 상품은 예약할 수 없습니다.");
        }

        // 인당 구매 한도 초과 여부 확인
        int alreadyReserved = reservationRepository
                .findByProductIdAndBuyerIdAndStatusIn(
                        productId,
                        buyerId,
                        List.of(ReservationStatus.REQUESTED, ReservationStatus.ACCEPTED))
                .stream().mapToInt(Reservation::getQuantity).sum();
        if (alreadyReserved + quantity > product.getPerPersonLimit()) {
            throw new RuntimeException("인당 구매 한도(" + product.getPerPersonLimit() + "개)를 초과할 수 없습니다.");
        }

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 재고 차감 (재고 소진 시 자동 SOLD_OUT)
        if (buyer.isPurchaseRestricted()) {
            throw new RuntimeException("노쇼 패널티로 구매가 일시 제한된 계정입니다.");
        }

        product.deductQuantity(quantity);

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
        boolean isBuyer  = reservation.getBuyer().getId().equals(userId);

        // 구매자는 REQUESTED 상태일 때만 취소 가능
        if (isBuyer && status == ReservationStatus.CANCELED
                && reservation.getStatus() == ReservationStatus.REQUESTED) {
            // 허용 - 아래 로직으로 계속 진행
        } else if (!isSeller) {
            throw new RuntimeException("권한이 없습니다.");
        }

        reservation.updateStatus(status);

        // 재고 기반 상품 상태 동기화
        Product product = reservation.getProduct();
        if (status == ReservationStatus.CANCELED) {
            // 취소 시 재고 복구 (재고 > 0 이면 자동 ON_SALE)
            product.restoreQuantity(reservation.getQuantity());
        } else if (status == ReservationStatus.COMPLETED) {
            // 완료 시: 잔여 재고가 없으면 SOLD_OUT, 있으면 그대로
            if (product.getRemainingQuantity() == 0) {
                product.updateStatus(ProductStatus.SOLD_OUT);
            }
        } else if (status == ReservationStatus.NO_SHOW) {
            reservation.getBuyer().addNoShowPenalty();
            product.updateStatus(ProductStatus.SOLD_OUT);
        }

        // STATUS_CHANGE 알림 - 행위자의 상대방에게 전송
        User notifyTarget = isBuyer ? reservation.getSeller() : reservation.getBuyer();
        notificationService.createNotification(
                notifyTarget,
                status == ReservationStatus.NO_SHOW ? NotificationType.NO_SHOW : NotificationType.STATUS_CHANGE,
                null,
                reservation
        );

        return ReservationResponse.from(reservation);
    }

    // 구매 내역 (완료된 것만)
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
}
