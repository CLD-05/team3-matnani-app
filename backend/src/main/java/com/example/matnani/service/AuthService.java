package com.example.matnani.service;

import com.example.matnani.domain.entity.BusinessProfile;
import com.example.matnani.domain.entity.Region;
import com.example.matnani.domain.entity.User;
import com.example.matnani.dto.request.BusinessSignupRequest;
import com.example.matnani.dto.request.LoginRequest;
import com.example.matnani.dto.request.SignupRequest;
import com.example.matnani.dto.response.LoginResponse;
import com.example.matnani.repository.BusinessProfileRepository;
import com.example.matnani.repository.RegionRepository;
import com.example.matnani.repository.UserRepository;
import static com.example.matnani.domain.enums.Enums.*;
import com.example.matnani.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final RegionRepository regionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final BusinessNumberService businessNumberService;
    private final TokenRedisService tokenRedisService;

    // 일반 회원가입
    @Transactional
    public void signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        Region region = regionRepository.findById(request.getRegionId())
                .orElseThrow(() -> new RuntimeException("지역을 찾을 수 없습니다."));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .phone(request.getPhone())
                .role(UserRole.NORMAL) // 버그 수정
                .region(region)
                .build();

        userRepository.save(user);
    }

    // 사업자 회원가입
    @Transactional
    public void businessSignup(BusinessSignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }
        if (businessProfileRepository.existsByBusinessNumber(request.getBusinessNumber())) {
            throw new RuntimeException("이미 등록된 사업자번호입니다.");
        }
        if (!businessNumberService.verify(request.getBusinessNumber(), request.getOwnerName(),
                request.getStartDate())) {
            throw new RuntimeException("사업자등록정보가 일치하지 않습니다. 사업자번호, 대표자성명, 개업일자를 확인해주세요.");
        }

        Region region = regionRepository.findById(request.getRegionId())
                .orElseThrow(() -> new RuntimeException("지역을 찾을 수 없습니다."));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .phone(request.getPhone())
                .role(UserRole.BUSINESS)
                .region(region)
                .build();

        userRepository.save(user);

        BusinessProfile profile = BusinessProfile.builder()
                .user(user)
                .businessNumber(request.getBusinessNumber())
                .businessName(request.getBusinessName())
                .ownerName(request.getOwnerName())
                .verifyStatus(VerifyStatus.VERIFIED)
                .build();

        businessProfileRepository.save(profile);
    }

    // 로그인 - refresh token Redis에 저장
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        // refresh token Redis에 저장 (7일 TTL)
        tokenRedisService.saveRefreshToken(user.getId(), refreshToken, jwtService.getRefreshExpiration());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .nickname(user.getNickname())
                .role(user.getRole().name())
                .build();
    }

    // 로그아웃 - access token 블랙리스트 등록 + refresh token 삭제
    public void logout(String accessToken) {
        if (!jwtService.isValid(accessToken))
            return;

        long remaining = jwtService.getRemainingExpiration(accessToken);
        tokenRedisService.blacklistAccessToken(accessToken, remaining);

        Long userId = jwtService.getUserId(accessToken);
        tokenRedisService.deleteRefreshToken(userId);
    }

    // 토큰 재발급 - Redis 검증 + rotation
    public LoginResponse refresh(String refreshToken) {
        if (!jwtService.isValid(refreshToken) || !jwtService.isRefreshToken(refreshToken)) {
            throw new RuntimeException("유효하지 않은 refresh token입니다.");
        }

        Long userId = jwtService.getUserId(refreshToken);

        // Redis에 저장된 토큰과 일치하는지 검증
        if (!tokenRedisService.isValidRefreshToken(userId, refreshToken)) {
            throw new RuntimeException("만료되거나 이미 사용된 refresh token입니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 기존 refresh token 삭제 후 새로운 토큰 발급 (rotation)
        tokenRedisService.deleteRefreshToken(userId);

        String newAccessToken = jwtService.generateToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);
        tokenRedisService.saveRefreshToken(userId, newRefreshToken, jwtService.getRefreshExpiration());

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .nickname(user.getNickname())
                .role(user.getRole().name())
                .build();
    }
}