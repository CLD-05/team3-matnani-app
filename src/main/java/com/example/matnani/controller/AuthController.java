package com.example.matnani.controller;

import com.example.matnani.dto.request.*;
import com.example.matnani.dto.response.ApiResponse;
import com.example.matnani.dto.response.LoginResponse;
import com.example.matnani.service.AuthService;
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
}