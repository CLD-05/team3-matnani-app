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
                .role(UserRole.NORMAL)
                .role(UserRole.BUSINESS)
                .region(region)
                .build();

        userRepository.save(user);
    }

    @Transactional
    public void businessSignup(BusinessSignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }
        if (businessProfileRepository.existsByBusinessNumber(request.getBusinessNumber())) {
            throw new RuntimeException("이미 등록된 사업자번호입니다.");


            // 사업자번호 검증
        }
        if (!businessNumberService.verify(request.getBusinessNumber())) {
            throw new RuntimeException("유효하지 않은 사업자번호입니다.");
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
                .verifyStatus(VerifyStatus.PENDING)
                .build();

        businessProfileRepository.save(profile);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("이메일 또는 비밀번호가 틀렸습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("이메일 또는 비밀번호가 틀렸습니다.");
        }

        String token = jwtService.generateToken(user);
        return new LoginResponse(token, "Bearer", user.getNickname(), user.getRole().name());
    }
}