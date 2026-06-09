package com.example.matnani.controller;

import com.example.matnani.dto.response.ApiResponse;
import com.example.matnani.dto.response.NotificationResponse;
import com.example.matnani.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Collection;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(notificationService.getNotifications(userId)));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = Long.parseLong(userDetails.getUsername());
        notificationService.markAsRead(userId, id);
        return ResponseEntity.ok(ApiResponse.success(null, "읽음 처리 완료"));
    }

    // 전체 읽음
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success(null, "전체 읽음 처리 완료"));
    }

    // 단건 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = Long.parseLong(userDetails.getUsername());
        notificationService.deleteNotification(userId, id);
        return ResponseEntity.ok(ApiResponse.success(null, "알림 삭제 완료"));
    }

    // 선택 삭제
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteNotifications(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Collection<Long> ids) {
        Long userId = Long.parseLong(userDetails.getUsername());
        notificationService.deleteNotifications(userId, ids);
        return ResponseEntity.ok(ApiResponse.success(null, "알림 삭제 완료"));
    }

    // 전체 삭제
    @DeleteMapping("/all")
    public ResponseEntity<ApiResponse<Void>> deleteAllNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        notificationService.deleteAllNotifications(userId);
        return ResponseEntity.ok(ApiResponse.success(null, "전체 알림 삭제 완료"));
    }
}