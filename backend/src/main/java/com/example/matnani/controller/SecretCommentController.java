package com.example.matnani.controller;

import com.example.matnani.dto.request.SecretCommentRequest;
import com.example.matnani.dto.response.ApiResponse;
import com.example.matnani.dto.response.SecretCommentResponse;
import com.example.matnani.service.SecretCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class SecretCommentController {

    private final SecretCommentService secretCommentService;

    // 댓글 작성
    @PostMapping("/api/products/{productId}/comments")
    public ResponseEntity<ApiResponse<SecretCommentResponse>> createComment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId,
            @RequestBody SecretCommentRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(
                secretCommentService.createComment(userId, productId, request), "댓글 작성 완료"));
    }

    // 댓글 목록
    @GetMapping("/api/products/{productId}/comments")
    public ResponseEntity<ApiResponse<List<SecretCommentResponse>>> getComments(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(secretCommentService.getComments(userId, productId)));
    }

    // 댓글 수정
    @PatchMapping("/api/comments/{commentId}")
    public ResponseEntity<ApiResponse<SecretCommentResponse>> updateComment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long commentId,
            @RequestBody SecretCommentRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(secretCommentService.updateComment(userId, commentId, request)));
    }

    // 댓글 삭제
    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long commentId) {
        Long userId = Long.parseLong(userDetails.getUsername());
        secretCommentService.deleteComment(userId, commentId);
        return ResponseEntity.ok(ApiResponse.success(null, "댓글 삭제 완료"));
    }
}