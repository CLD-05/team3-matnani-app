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
    private Long reservationId;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public static NotificationResponse from(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.id = notification.getId();
        response.type = notification.getType();
        response.productId = notification.getProduct() != null
                ? notification.getProduct().getId() : null;
        response.reservationId = notification.getReservation() != null
                ? notification.getReservation().getId() : null;
        response.isRead = notification.getIsRead();
        response.createdAt = notification.getCreatedAt();
        return response;
    }
}