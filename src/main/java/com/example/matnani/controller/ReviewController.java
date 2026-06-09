package com.example.matnani.controller;

import com.example.matnani.dto.request.ReviewRequest;
import com.example.matnani.dto.response.ApiResponse;
import com.example.matnani.dto.response.ReviewResponse;
import com.example.matnani.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 전체 후기 목록
    @GetMapping("/api/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getAllReviews() {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getAllReviews()));
    }

    // 내가 쓴 후기 목록 (구매자)
    @GetMapping("/api/reviews/me")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyReviews(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(reviewService.getMyReviews(userId)));
    }

    // 내가 받은 후기 목록 (판매자)
    @GetMapping("/api/reviews/me/received")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyReceivedReviews(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(reviewService.getReviewsBySeller(userId)));
    }

    // 특정 판매자 후기 목록 (닉네임 기반 - 판매자 프로필 페이지용)
    @GetMapping("/api/reviews/seller/{nickname}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviewsBySellerNickname(
            @PathVariable String nickname) {
        return ResponseEntity.ok(ApiResponse.success(
                reviewService.getReviewsBySellerNickname(nickname)));
    }

    // 후기 작성 (스펙: POST /api/reservations/{reservationId}/reviews)
    @PostMapping("/api/reservations/{reservationId}/reviews")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long reservationId,
            @RequestBody ReviewRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(
                reviewService.createReview(userId, reservationId, request), "후기 작성 완료"));
    }

    // 후기 수정
    @PatchMapping("/api/reviews/{reviewId}")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long reviewId,
            @RequestBody ReviewRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(reviewService.updateReview(userId, reviewId, request)));
    }

    // 후기 삭제
    @DeleteMapping("/api/reviews/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long reviewId) {
        Long userId = Long.parseLong(userDetails.getUsername());
        reviewService.deleteReview(userId, reviewId);
        return ResponseEntity.ok(ApiResponse.success(null, "후기 삭제 완료"));
    }
}