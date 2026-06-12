package com.example.matnani.controller;

import com.example.matnani.dto.request.*;
import com.example.matnani.dto.response.ApiResponse;
import com.example.matnani.dto.response.LoginResponse;
import com.example.matnani.service.AuthService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signup(@RequestBody SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok(ApiResponse.success(null, "회원가입 성공"));
    }

    @PostMapping("/signup/business")
    public ResponseEntity<ApiResponse<Void>> businessSignup(@RequestBody BusinessSignupRequest request) {
        authService.businessSignup(request);
        return ResponseEntity.ok(ApiResponse.success(null, "사업자 회원가입 성공"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.login(request), "로그인 성공"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            authService.logout(authHeader.substring(7));
        }
        return ResponseEntity.ok(ApiResponse.success(null, "로그아웃 성공"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(@RequestBody RefreshRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                authService.refresh(request.getRefreshToken()), "토큰 재발급 성공"));
    }

    @Getter
    static class RefreshRequest {
        private String refreshToken;
    }
}