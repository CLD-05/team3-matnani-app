package com.example.matnani.service;

import com.example.matnani.exception.DuplicateReservationException;
import com.example.matnani.domain.entity.*;
import com.example.matnani.dto.response.ReservationResponse;
import com.example.matnani.repository.*;
import static com.example.matnani.domain.enums.Enums.*;
import com.example.matnani.exception.BadRequestException;
import com.example.matnani.exception.ForbiddenException;
import com.example.matnani.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    private final ReservationInternalService reservationInternalService;
    private final StockRedisService stockRedisService;

    // 예약 생성 (Redis DECR 원자적 재고 감소)
    public ReservationResponse createReservation(Long buyerId, Long productId, int quantity) {
        Long remaining = stockRedisService.decrement(productId, quantity);

        if (remaining < 0) {
            stockRedisService.increment(productId, quantity);
            throw new BadRequestException("재고가 없습니다.");
        }

        try {
            return reservationInternalService.createReservationInternal(buyerId, productId, quantity);
        } catch (Exception e) {
            stockRedisService.increment(productId, quantity);
            throw e;
        }
    }

    // 예약 상태 변경
    @Transactional
    public ReservationResponse updateStatus(Long userId, Long reservationId, ReservationStatus status) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new NotFoundException("예약을 찾을 수 없습니다."));

        boolean isSeller = reservation.getSeller().getId().equals(userId);
        boolean isBuyer = reservation.getBuyer().getId().equals(userId);

        // 구매자는 REQUESTED 상태일 때만 취소 가능
        if (isBuyer && status == ReservationStatus.CANCELED
                && reservation.getStatus() == ReservationStatus.REQUESTED) {
            // 허용 - 아래 로직으로 계속 진행
        } else if (!isSeller) {
            throw new ForbiddenException("권한이 없습니다.");
        }

        reservation.updateStatus(status);

        // 재고 기반 상품 상태 동기화
        Product product = reservation.getProduct();
        if (status == ReservationStatus.CANCELED) {
            product.restoreQuantity(reservation.getQuantity());
            stockRedisService.increment(product.getId(), reservation.getQuantity());
        } else if (status == ReservationStatus.COMPLETED) {
            if (product.getRemainingQuantity() == 0) {
                product.updateStatus(ProductStatus.SOLD_OUT);
            }
        } else if (status == ReservationStatus.NO_SHOW) {
            reservation.getBuyer().addNoShowPenalty();
            product.restoreQuantity(reservation.getQuantity());
            stockRedisService.increment(product.getId(), reservation.getQuantity());
        }

        // STATUS_CHANGE 알림 - 행위자의 상대방에게 전송
        User notifyTarget = isBuyer ? reservation.getSeller() : reservation.getBuyer();
        notificationService.createNotification(
                notifyTarget,
                status == ReservationStatus.NO_SHOW ? NotificationType.NO_SHOW
                        : NotificationType.STATUS_CHANGE,
                null,
                reservation);

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
    // [수정] 기존: 완료 예약 전체 로딩 후 Java stream 합산 → 이력 증가 시 선형 악화
    // [수정] 변경: DB SUM() 1쿼리로 해결
    public int getTotalSavings(Long buyerId) {
        return reservationRepository.sumSavingsByBuyerId(buyerId);
    }

    // 마이페이지 - 구출 횟수
    // [수정] 기존: 완료 예약 전체 로딩 후 Java stream 합산
    // [수정] 변경: DB SUM() 1쿼리로 해결
    public int getRescueCount(Long buyerId) {
        return reservationRepository.sumRescueCountByBuyerId(buyerId);
    }
}