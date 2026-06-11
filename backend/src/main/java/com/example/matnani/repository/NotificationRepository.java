package com.example.matnani.repository;

import com.example.matnani.domain.entity.Notification;
import static com.example.matnani.domain.enums.Enums.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Notification> findByUserIdAndIsRead(Long userId, Boolean isRead);
    boolean existsByUserIdAndTypeAndReservationId(Long userId, NotificationType type, Long reservationId);
    void deleteByUserId(Long userId);
    void deleteByProductId(Long productId);
    void deleteByReservationIdIn(List<Long> reservationIds);
}
