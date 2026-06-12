package com.example.matnani.service;

import com.example.matnani.domain.entity.Reservation;
import com.example.matnani.repository.NotificationRepository;
import com.example.matnani.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
        LocalDateTime oneHourLater = now.plusHours(1);

        List<Reservation> reservations = reservationRepository.findPickupReminderTargets(
                List.of(ReservationStatus.REQUESTED, ReservationStatus.ACCEPTED),
                now,
                oneHourLater
        );

        for (Reservation reservation : reservations) {
            Long buyerId = reservation.getBuyer().getId();
            if (notificationRepository.existsByUserIdAndTypeAndReservationId(
                    buyerId,
                    NotificationType.PICKUP_REMINDER,
                    reservation.getId())) {
                continue;
            }

            notificationService.createNotification(
                    reservation.getBuyer(),
                    NotificationType.PICKUP_REMINDER,
                    null,
                    reservation
            );
        }
    }
}
