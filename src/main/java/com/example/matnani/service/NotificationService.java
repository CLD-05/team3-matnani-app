package com.example.matnani.service;

import com.example.matnani.domain.entity.*;
import com.example.matnani.dto.response.NotificationResponse;
import com.example.matnani.repository.*;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Collection;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // 알림 목록
    public List<NotificationResponse> getNotifications(Long userId) {
        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationResponse::from)
                .collect(Collectors.toList());
    }

    // 알림 생성
    @Transactional
    public void createNotification(User user, NotificationType type,
                                   Product product, Reservation reservation) {
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .product(product)
                .reservation(reservation)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    // 단건 읽음 처리
    @Transactional
    public void markAsRead(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("알림을 찾을 수 없습니다."));

        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }

        notification.markAsRead();
    }

    // 전체 읽음 처리
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository
                .findByUserIdAndIsRead(userId, false)
                .forEach(Notification::markAsRead);
    }

    // 단건 삭제
    @Transactional
    public void deleteNotification(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("알림을 찾을 수 없습니다."));

        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }

        notificationRepository.delete(notification);
    }

    // 선택 삭제
    @Transactional
    public void deleteNotifications(Long userId, Collection<Long> ids) {
        ids.forEach(id -> deleteNotification(userId, id));
    }

    // 전체 삭제
    @Transactional
    public void deleteAllNotifications(Long userId) {
        notificationRepository.deleteByUserId(userId);
    }
}