package com.example.matnani.dto.response;

import com.example.matnani.domain.entity.Notification;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class NotificationResponse {
    private Long id;
    private NotificationType type;
    private Long productId;
    private String productTitle;
    private Long reservationId;
    private String reservationStatus;
    private String actorNickname;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public static NotificationResponse from(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.id = notification.getId();
        response.type = notification.getType();
        response.isRead = notification.getIsRead();
        response.createdAt = notification.getCreatedAt();

        // 상품 정보
        if (notification.getProduct() != null) {
            response.productId = notification.getProduct().getId();
            response.productTitle = notification.getProduct().getTitle();
        }

        // 예약 컨텍스트
        if (notification.getReservation() != null) {
            var reservation = notification.getReservation();
            response.reservationId = reservation.getId();
            response.reservationStatus = reservation.getStatus().name();
            if (notification.getProduct() == null) {
                response.productId = reservation.getProduct().getId();
                response.productTitle = reservation.getProduct().getTitle();
            }
            // RESERVATION 알림: 구매자가 행위자 / STATUS_CHANGE 알림: 판매자가 행위자
            response.actorNickname = notification.getType() == NotificationType.RESERVATION
                    ? reservation.getBuyer().getNickname()
                    : reservation.getSeller().getNickname();
        }

        return response;
    }
}