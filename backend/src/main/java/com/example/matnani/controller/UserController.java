package com.example.matnani.controller;

import com.example.matnani.dto.response.*;
import com.example.matnani.service.ReviewService;
import com.example.matnani.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ReviewService reviewService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMyInfo(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(userService.getMyInfo(userId)));
    }

    @PatchMapping("/me/region")
    public ResponseEntity<ApiResponse<UserResponse>> updateRegion(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody RegionUpdateRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(userService.updateRegion(userId, request.getRegionId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SellerProfileResponse>> getSellerProfile(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getSellerProfile(id)));
    }

    // 판매자 후기 목록
    @GetMapping("/{userId}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getSellerReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getReviewsBySeller(userId)));
    }

    @lombok.Getter
    static class RegionUpdateRequest {
        private Long regionId;
    }
}