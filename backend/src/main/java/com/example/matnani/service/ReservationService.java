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
import org.redisson.api.RedissonClient;
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
    private final RedissonClient redissonClient;
    private final ReservationInternalService reservationInternalService;
    private final RedisStockService redisStockService;

    // 예약 생성 (Lua 스크립트 기반 재고 차감)
    // [수정] 기존: Redisson 분산락 → DB 재고 확인 → DB 차감 (직렬 처리)
    //             200명 동시 요청 시 락 대기 큐 → p95 6초, 타임아웃 742건
    // [변경]: Lua 스크립트로 Redis 재고 원자 차감 → 성공 시 DB 저장 (병렬 처리)
    //             락 없이 처리 → 타임아웃 제거, 응답시간 대폭 개선 예상
    public ReservationResponse createReservation(Long buyerId, Long productId, int quantity) {

        // Step 1: Lua 스크립트로 Redis 재고 원자 차감 (락 없음)
        long remaining = redisStockService.deductStock(productId, quantity);

        // [수정] -2(Redis 키 없음) 재시도 로직 제거
        // 동시에 여러 요청이 -2 받고 syncStockToRedis() 동시 호출 → 레이스 컨디션 발생
        // 서버 시작 시 syncStockToRedis()로 항상 세팅되므로 정상 운영 중엔 -2 없음
        if (remaining < 0) {
            throw new BadRequestException("재고가 부족합니다.");
        }

        // Step 2: Redis 재고 차감 성공 → DB 트랜잭션으로 예약 저장
        try {
            return reservationInternalService.createReservationInternal(buyerId, productId, quantity);
        } catch (Exception e) {
            // DB 저장 실패 시 Redis 재고 복구
            redisStockService.restoreStock(productId, quantity);
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

        if (isBuyer && status == ReservationStatus.CANCELED
                && reservation.getStatus() == ReservationStatus.REQUESTED) {
            // 허용
        } else if (!isSeller) {
            throw new ForbiddenException("권한이 없습니다.");
        }

        reservation.updateStatus(status);

        Product product = reservation.getProduct();
        if (status == ReservationStatus.CANCELED) {
            product.restoreQuantity(reservation.getQuantity());
            // Redis 재고도 복구
            redisStockService.restoreStock(product.getId(), reservation.getQuantity());
        } else if (status == ReservationStatus.COMPLETED) {
            if (product.getRemainingQuantity() == 0) {
                product.updateStatus(ProductStatus.SOLD_OUT);
            }
        } else if (status == ReservationStatus.NO_SHOW) {
            reservation.getBuyer().addNoShowPenalty();
            product.restoreQuantity(reservation.getQuantity());
            // Redis 재고도 복구
            redisStockService.restoreStock(product.getId(), reservation.getQuantity());
        }

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
    public int getTotalSavings(Long buyerId) {
        return reservationRepository.sumSavingsByBuyerId(buyerId);
    }

    // 마이페이지 - 구출 횟수
    public int getRescueCount(Long buyerId) {
        return reservationRepository.sumRescueCountByBuyerId(buyerId);
    }
}