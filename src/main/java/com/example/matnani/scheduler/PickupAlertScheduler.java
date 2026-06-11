package com.example.matnani.scheduler;

import com.example.matnani.domain.entity.Reservation;
import com.example.matnani.repository.ReservationRepository;
import com.example.matnani.service.NotificationService;
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
public class PickupAlertScheduler {

    private final ReservationRepository reservationRepository;
    private final NotificationService notificationService;

    // 5분마다 실행
    @Scheduled(fixedRate = 300000)
    @Transactional
    public void sendPickupAlerts() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneHourLater = now.plusHours(1);

        List<Reservation> targets = reservationRepository
                .findPickupAlertTargets(now, oneHourLater);

        for (Reservation reservation : targets) {
            notificationService.createNotification(
                    reservation.getBuyer(),
                    NotificationType.STATUS_CHANGE,
                    reservation.getProduct(),
                    reservation
            );
            reservation.setPickupAlertSent(true);
            log.info("픽업 알림 발송 - 예약ID: {}, 구매자: {}",
                    reservation.getId(), reservation.getBuyer().getNickname());
        }
    }
}