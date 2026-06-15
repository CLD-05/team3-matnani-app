package com.example.matnani.service;

import lombok.RequiredArgsConstructor;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TokenRedisService {

    private final RedissonClient redissonClient;

    // refresh token 저장 (로그인 시)
    public void saveRefreshToken(Long userId, String token, long ttlMs) {
        RBucket<String> bucket = redissonClient.getBucket("refresh:" + userId);
        bucket.set(token, ttlMs, TimeUnit.MILLISECONDS);
    }

    // refresh token 유효성 검증 (Redis에 저장된 값과 일치 여부)
    public boolean isValidRefreshToken(Long userId, String token) {
        RBucket<String> bucket = redissonClient.getBucket("refresh:" + userId);
        String stored = bucket.get();
        return token.equals(stored);
    }

    // refresh token 삭제 (로그아웃 or 토큰 재발급 시)
    public void deleteRefreshToken(Long userId) {
        redissonClient.getBucket("refresh:" + userId).delete();
    }

    // access token 블랙리스트 등록 (로그아웃 시, 남은 만료 시간만큼 유지)
    public void blacklistAccessToken(String token, long ttlMs) {
        if (ttlMs <= 0) return;
        RBucket<String> bucket = redissonClient.getBucket("blacklist:" + token);
        bucket.set("true", ttlMs, TimeUnit.MILLISECONDS);
    }

    // access token 블랙리스트 확인
    public boolean isBlacklisted(String token) {
        return redissonClient.getBucket("blacklist:" + token).isExists();
    }
}
