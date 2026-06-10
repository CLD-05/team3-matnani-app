package com.example.matnani.dto.response;

import com.example.matnani.domain.entity.Reservation;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class ReservationResponse {
    private Long id;
    private Long productId;
    private String productTitle;
    private String buyerNickname;
    private String sellerNickname;
    private Integer finalPrice;
    private Integer quantity;
    private ReservationStatus status;
    private LocalDateTime reservedAt;
    private LocalDateTime completedAt;

    public static ReservationResponse from(Reservation reservation) {
        ReservationResponse response = new ReservationResponse();
        response.id = reservation.getId();
        response.productId = reservation.getProduct().getId();
        response.productTitle = reservation.getProduct().getTitle();
        response.buyerNickname = reservation.getBuyer().getNickname();
        response.sellerNickname = reservation.getSeller().getNickname();
        response.finalPrice = reservation.getFinalPrice();
        response.quantity = reservation.getQuantity();
        response.status = reservation.getStatus();
        response.reservedAt = reservation.getReservedAt();
        response.completedAt = reservation.getCompletedAt();
        return response;
    }
}