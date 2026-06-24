package com.example.matnani.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StockRedisService {

    private final StringRedisTemplate stringRedisTemplate;

    private String key(Long productId) {
        return "stock:product:" + productId;
    }

    public void set(Long productId, int quantity) {
        stringRedisTemplate.opsForValue().set(key(productId), String.valueOf(quantity));
    }

    public Long decrement(Long productId, int quantity) {
        return stringRedisTemplate.opsForValue().decrement(key(productId), quantity);
    }

    public void increment(Long productId, int quantity) {
        stringRedisTemplate.opsForValue().increment(key(productId), quantity);
    }

    public Long getStock(Long productId) {
        String value = stringRedisTemplate.opsForValue().get(key(productId));
        return value != null ? Long.parseLong(value) : null;
    }
}
