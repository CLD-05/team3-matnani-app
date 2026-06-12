package com.example.matnani.controller;

import com.example.matnani.dto.request.ReservationRequest;
import com.example.matnani.dto.response.ApiResponse;
import com.example.matnani.dto.response.ReservationResponse;
import com.example.matnani.service.ReservationService;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    // 예약 생성 (스펙: POST /api/products/{productId}/reservations)
    @PostMapping("/api/products/{productId}/reservations")
    public ResponseEntity<ApiResponse<ReservationResponse>> createReservation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId,
            @RequestBody(required = false) ReservationRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        int quantity = (request != null && request.getQuantity() != null) ? request.getQuantity() : 1;
        return ResponseEntity.ok(ApiResponse.success(
                reservationService.createReservation(userId, productId, quantity), "예약 요청 완료"));
    }

    // 예약 상태 변경
    @PatchMapping("/api/reservations/{id}/status")
    public ResponseEntity<ApiResponse<ReservationResponse>> updateStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(
                reservationService.updateStatus(userId, id, request.getStatus())));
    }

    // 내 예약 내역 (구매자 - 내가 예약한 것들)
    @GetMapping("/api/reservations/me")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getMyReservations(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(
                reservationService.getReservationHistory(userId, null, "buyer")));
    }

    // 내 판매 예약 내역 (판매자 - 내 상품에 들어온 예약들)
    @GetMapping("/api/reservations/me/seller")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getMySellerReservations(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(
                reservationService.getReservationHistory(userId, null, "seller")));
    }

    @Getter
    static class StatusUpdateRequest {
        private ReservationStatus status;
    }
}