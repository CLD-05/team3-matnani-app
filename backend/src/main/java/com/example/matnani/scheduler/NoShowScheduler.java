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

            // 재고 복구
            Product product = reservation.getProduct();
            int restored = product.getRemainingQuantity() + reservation.getQuantity();
            product.setRemainingQuantity(restored);
            if (product.getStatus() == ProductStatus.SOLD_OUT) {
                product.updateStatus(ProductStatus.ON_SALE);
            }

            // 노쇼 카운트 + 패널티
            User buyer = reservation.getBuyer();
            int newCount = buyer.getNoShowCount() + 1;
            buyer.setNoShowCount(newCount);
            if (newCount >= 3) {
                buyer.setBannedUntil(LocalDateTime.now().plusDays(7));
                log.info("구매 제한 적용 - 구매자: {}, 해제일: {}",
                        buyer.getNickname(), buyer.getBannedUntil());
            }

            log.info("노쇼 처리 - 예약ID: {}, 구매자: {}, 누적횟수: {}",
                    reservation.getId(), buyer.getNickname(), newCount);
        }
    }
}