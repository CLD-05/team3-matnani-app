package com.example.matnani.scheduler;

import com.example.matnani.domain.entity.Reservation;
import com.example.matnani.repository.NotificationRepository;
import com.example.matnani.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.example.matnani.service.NotificationService;
import java.time.LocalDateTime;
import java.util.List;

import static com.example.matnani.domain.enums.Enums.*;

@Component
@RequiredArgsConstructor
public class ReservationReminderScheduler {

    private final ReservationRepository reservationRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void sendPickupReminders() {
        LocalDateTime now = LocalDateTime.now();

        // 1시간 전 알림
        List<Reservation> oneHourTargets = reservationRepository.findPickupReminderTargets(
                List.of(ReservationStatus.REQUESTED, ReservationStatus.ACCEPTED),
                now,
                now.plusHours(1)
        );
        for (Reservation reservation : oneHourTargets) {
            Long buyerId = reservation.getBuyer().getId();
            if (notificationRepository.existsByUserIdAndTypeAndReservationId(
                    buyerId, NotificationType.PICKUP_REMINDER, reservation.getId())) continue;
            notificationService.createNotification(
                    reservation.getBuyer(), NotificationType.PICKUP_REMINDER, null, reservation);
        }

        // 30분 전 알림
        List<Reservation> thirtyMinTargets = reservationRepository.findPickupReminderTargets(
                List.of(ReservationStatus.REQUESTED, ReservationStatus.ACCEPTED),
                now,
                now.plusMinutes(30)
        );
        for (Reservation reservation : thirtyMinTargets) {
            Long buyerId = reservation.getBuyer().getId();
            if (notificationRepository.existsByUserIdAndTypeAndReservationId(
                    buyerId, NotificationType.PICKUP_REMINDER_30, reservation.getId())) continue;
            notificationService.createNotification(
                    reservation.getBuyer(), NotificationType.PICKUP_REMINDER_30, null, reservation);
        }

        // 10분 전 알림
        List<Reservation> tenMinTargets = reservationRepository.findPickupReminderTargets(
                List.of(ReservationStatus.REQUESTED, ReservationStatus.ACCEPTED),
                now,
                now.plusMinutes(10)
        );
        for (Reservation reservation : tenMinTargets) {
            Long buyerId = reservation.getBuyer().getId();
            if (notificationRepository.existsByUserIdAndTypeAndReservationId(
                    buyerId, NotificationType.PICKUP_REMINDER_10, reservation.getId())) continue;
            notificationService.createNotification(
                    reservation.getBuyer(), NotificationType.PICKUP_REMINDER_10, null, reservation);
        }
    }
}