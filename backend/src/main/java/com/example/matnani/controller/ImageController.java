package com.example.matnani.controller;

import com.example.matnani.dto.response.ApiResponse;
import com.example.matnani.service.S3Service;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final S3Service s3Service;

    @PostMapping("/presigned-url")
    public ResponseEntity<ApiResponse<Map<String, String>>> getPresignedUrl(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PresignedUrlRequest request) {
        Map<String, String> result = s3Service.generatePresignedUrl(request.getFilename(), request.getContentType());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @Getter
    static class PresignedUrlRequest {
        private String filename;
        private String contentType;
    }
}