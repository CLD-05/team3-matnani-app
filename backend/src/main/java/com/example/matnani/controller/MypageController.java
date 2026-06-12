package com.example.matnani.controller;

import com.example.matnani.dto.response.*;
import com.example.matnani.service.ReservationService;
import com.example.matnani.service.ReviewService;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MypageController {

    private final ReservationService reservationService;
    private final ReviewService reviewService;

    // 구매 내역
    @GetMapping("/purchases")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getPurchases(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(reservationService.getPurchaseHistory(userId)));
    }

    // 판매 내역
    @GetMapping("/sales")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getSales(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(reservationService.getSalesHistory(userId)));
    }

    // 예약 내역 (status/role 필터)
    @GetMapping("/reservations")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getReservations(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) ReservationStatus status,
            @RequestParam(required = false) String role) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(
                reservationService.getReservationHistory(userId, status, role)));
    }

    // 내가 쓴 후기
    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyReviews(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(reviewService.getMyReviews(userId)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<MypageStatsResponse>> getStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        MypageStatsResponse stats = MypageStatsResponse.builder()
                .totalSavings(reservationService.getTotalSavings(userId))
                .rescueCount(reservationService.getRescueCount(userId))
                .build();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

}