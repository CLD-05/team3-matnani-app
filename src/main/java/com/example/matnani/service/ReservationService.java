package com.example.matnani.service;

import com.example.matnani.config.DuplicateReservationException;
import com.example.matnani.domain.entity.*;
import com.example.matnani.dto.response.ReservationResponse;
import com.example.matnani.repository.*;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // 예약 생성
    @Transactional
    public ReservationResponse createReservation(Long buyerId, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        if (!product.getStatus().equals(ProductStatus.ON_SALE)) {
            throw new DuplicateReservationException("이미 예약 중이거나 판매 완료된 상품입니다.");
        }

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        Reservation reservation = Reservation.builder()
                .product(product)
                .buyer(buyer)
                .seller(product.getSeller())
                .finalPrice(product.getDiscountPrice())
                .status(ReservationStatus.REQUESTED)
                .build();

        reservationRepository.save(reservation);
        product.updateStatus(ProductStatus.RESERVED);

        // RESERVATION 알림 - product_id NULL
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

        Reservation updated = Reservation.builder()
                .id(reservation.getId())
                .product(reservation.getProduct())
                .buyer(reservation.getBuyer())
                .seller(reservation.getSeller())
                .finalPrice(reservation.getFinalPrice())
                .status(status)
                .reservedAt(reservation.getReservedAt())
                .completedAt(status == ReservationStatus.COMPLETED ? LocalDateTime.now() : null)
                .build();

        reservationRepository.save(updated);

        Product product = reservation.getProduct();
        if (status == ReservationStatus.CANCELED) {
            product.updateStatus(ProductStatus.ON_SALE);
        } else if (status == ReservationStatus.COMPLETED) {
            product.updateStatus(ProductStatus.SOLD_OUT);
        }

        // STATUS_CHANGE 알림 - 행위자의 상대방에게 전송
        // 구매자가 취소 → 판매자에게 알림 / 판매자가 변경 → 구매자에게 알림
        User notifyTarget = isBuyer ? reservation.getSeller() : reservation.getBuyer();
        notificationService.createNotification(
                notifyTarget,
                NotificationType.STATUS_CHANGE,
                null,
                updated
        );

        return ReservationResponse.from(updated);
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