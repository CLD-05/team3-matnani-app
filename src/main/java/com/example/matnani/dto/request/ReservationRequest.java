package com.example.matnani.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReservationRequest {
    private Long productId;
    private Integer finalPrice;
}