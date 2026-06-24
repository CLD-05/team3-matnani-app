package com.example.matnani.service;

import com.example.matnani.domain.entity.*;
import com.example.matnani.dto.response.NotificationResponse;
import com.example.matnani.repository.*;
import static com.example.matnani.domain.enums.Enums.*;
import com.example.matnani.exception.ForbiddenException;
import com.example.matnani.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
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
    // [수정] @Async 추가 — 예약/댓글 트랜잭션과 분리하여 별도 스레드에서 실행
    //        예약 응답시간에서 알림 INSERT 시간 제거 (부하 시 병목 해소)
    // [주의] 호출부 트랜잭션이 커밋된 뒤 별도 스레드에서 실행되므로
    //        연관 엔티티(user, product, reservation)는 이미 DB에 존재 → 안전
    @Async
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
                .orElseThrow(() -> new NotFoundException("알림을 찾을 수 없습니다."));

        if (!notification.getUser().getId().equals(userId)) {
            throw new ForbiddenException("권한이 없습니다.");
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
                .orElseThrow(() -> new NotFoundException("알림을 찾을 수 없습니다."));

        if (!notification.getUser().getId().equals(userId)) {
            throw new ForbiddenException("권한이 없습니다.");
        }

        notificationRepository.delete(notification);
    }

    // 선택 삭제
    @Transactional
    public void deleteNotifications(Long userId, Collection<Long> ids) {
        notificationRepository.deleteByIdInAndUserId(ids, userId);
    }

    // 전체 삭제
    @Transactional
    public void deleteAllNotifications(Long userId) {
        notificationRepository.deleteByUserId(userId);
    }
}