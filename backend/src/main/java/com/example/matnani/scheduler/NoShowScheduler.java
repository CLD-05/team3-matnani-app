package com.example.matnani.scheduler;

import com.example.matnani.domain.entity.*;
import com.example.matnani.repository.*;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class NoShowScheduler {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    @Scheduled(fixedRate = 600000)
    @Transactional
    public void detectNoShow() {
        List<Reservation> targets = reservationRepository
                .findNoShowTargets(LocalDateTime.now());

        for (Reservation reservation : targets) {
            reservation.setStatus(ReservationStatus.CANCELED);

            // restoreQuantity()로 통일 (재고 복구 + 상태 동기화)
            Product product = reservation.getProduct();
            product.restoreQuantity(reservation.getQuantity());

            // 노쇼 카운트 + 패널티
            User buyer = reservation.getBuyer();
            buyer.addNoShowPenalty();

            log.info("노쇼 처리 - 예약ID: {}, 구매자: {}, 누적횟수: {}",
                    reservation.getId(), buyer.getNickname(), buyer.getNoShowCount());
        }
    }
}