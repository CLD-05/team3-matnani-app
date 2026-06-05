package com.example.matnani.service;

import com.example.matnani.domain.entity.*;
import com.example.matnani.dto.response.ReservationResponse;
import com.example.matnani.repository.*;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
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
            throw new RuntimeException("예약 가능한 상품이 아닙니다.");
        }

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        Reservation reservation = Reservation.builder()
                .product(product)
                .buyer(buyer)
                .seller(product.getSeller())
                .finalPrice(product.getDiscountPrice())  // 서버에서 자동 세팅
                .status(ReservationStatus.REQUESTED)
                .build();

        reservationRepository.save(reservation);

        // 상품 상태 즉시 RESERVED로 변경
        product.updateStatus(ProductStatus.RESERVED);

        notificationService.createNotification(
                product.getSeller(),
                NotificationType.RESERVATION,
                product,
                reservation
        );

        return ReservationResponse.from(reservation);
    }

    // 예약 상태 변경
    @Transactional
    public ReservationResponse updateStatus(Long sellerId, Long reservationId, ReservationStatus status) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));

        if (!reservation.getSeller().getId().equals(sellerId)) {
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

        // 상태에 따라 상품 status 변경
        Product product = reservation.getProduct();
        if (status == ReservationStatus.CANCELED) {
            product.updateStatus(ProductStatus.ON_SALE);  // 취소 시 복구
        } else if (status == ReservationStatus.COMPLETED) {
            product.updateStatus(ProductStatus.SOLD_OUT);  // 완료 시 판매종료
        }

        notificationService.createNotification(
                reservation.getBuyer(),
                NotificationType.STATUS_CHANGE,
                reservation.getProduct(),
                reservation
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

    // 예약 내역 (전체)
    public List<ReservationResponse> getReservationHistory(Long userId) {
        return reservationRepository
                .findByBuyerId(userId)
                .stream()
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