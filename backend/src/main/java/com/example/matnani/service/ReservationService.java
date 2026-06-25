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
    private final ReservationInternalService reservationInternalService;

    // 예약 생성 (Redis 분산락 + 재고 기반)
    public ReservationResponse createReservation(Long buyerId, Long productId, int quantity) {
        String lockKey = "reservation:product:" + productId;
        RLock lock = redissonClient.getLock(lockKey);

        try {
            boolean acquired = lock.tryLock(2, 10, TimeUnit.SECONDS);
            if (!acquired) {
                throw new BadRequestException("현재 예약 요청이 많습니다. 잠시 후 다시 시도해주세요.");
            }
            return reservationInternalService.createReservationInternal(buyerId, productId, quantity);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new BadRequestException("예약 처리 중 오류가 발생했습니다.");
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
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
            // 취소 시 재고 복구 (재고 > 0 이면 자동 ON_SALE)
            product.restoreQuantity(reservation.getQuantity());
        } else if (status == ReservationStatus.COMPLETED) {
            // 완료 시: 잔여 재고가 없으면 SOLD_OUT, 있으면 그대로
            if (product.getRemainingQuantity() == 0) {
                product.updateStatus(ProductStatus.SOLD_OUT);
            }
        } else if (status == ReservationStatus.NO_SHOW) {
            reservation.getBuyer().addNoShowPenalty();
            // [수정] 기존: product.updateStatus(SOLD_OUT) — 재고가 남아있어도 강제 SOLD_OUT
            // [수정] 변경: restoreQuantity()로 재고 복구 후 상태는 재고에 따라 자동 결정
            //             (재고 0이면 SOLD_OUT 유지, 재고 > 0이면 ON_SALE 복귀)
            product.restoreQuantity(reservation.getQuantity());
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