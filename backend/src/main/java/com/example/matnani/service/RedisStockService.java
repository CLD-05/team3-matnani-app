package com.example.matnani.service;

import com.example.matnani.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RScript;
import org.redisson.api.RedissonClient;
import org.redisson.client.codec.LongCodec;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisStockService {

    private final RedissonClient redissonClient;
    private final ProductRepository productRepository;

    // Redis 재고 키
    public static String stockKey(Long productId) {
        return "stock:product:" + productId;
    }

    // 서버 시작 시 DB 재고를 Redis에 동기화
    @EventListener(ApplicationReadyEvent.class)
    public void syncStockToRedis() {
        log.info("Redis 재고 동기화 시작...");
        productRepository.findAll().forEach(product -> {
            String key = stockKey(product.getId());
            redissonClient.getBucket(key, LongCodec.INSTANCE)
                    .set((long) product.getRemainingQuantity());
        });
        log.info("Redis 재고 동기화 완료");
    }

    // Lua 스크립트로 재고 원자 차감
    // 재고 > 0 이면 차감하고 남은 재고 반환
    // 재고 <= 0 이면 -1 반환
    private static final String DEDUCT_STOCK_SCRIPT =
            "local stock = redis.call('GET', KEYS[1]) " +
                    "if stock == false then return -2 end " +  // 키 없음
                    "stock = tonumber(stock) " +
                    "if stock < tonumber(ARGV[1]) then return -1 end " +  // 재고 부족
                    "redis.call('DECRBY', KEYS[1], ARGV[1]) " +
                    "return stock - tonumber(ARGV[1])";  // 차감 후 남은 재고

    // Lua 스크립트로 재고 복구
    private static final String RESTORE_STOCK_SCRIPT =
            "redis.call('INCRBY', KEYS[1], ARGV[1]) " +
                    "return redis.call('GET', KEYS[1])";

    /**
     * 재고 차감 시도
     * @return 차감 후 남은 재고 (음수면 실패)
     */
    public long deductStock(Long productId, int quantity) {
        String key = stockKey(productId);
        Object result = redissonClient.getScript(LongCodec.INSTANCE).eval(
                RScript.Mode.READ_WRITE,
                DEDUCT_STOCK_SCRIPT,
                RScript.ReturnType.INTEGER,
                Collections.singletonList(key),
                (long) quantity
        );
        return result != null ? (long) result : -1L;
    }

    /**
     * 재고 복구 (예약 취소/실패 시)
     */
    public void restoreStock(Long productId, int quantity) {
        String key = stockKey(productId);
        redissonClient.getScript(LongCodec.INSTANCE).eval(
                RScript.Mode.READ_WRITE,
                RESTORE_STOCK_SCRIPT,
                RScript.ReturnType.INTEGER,
                Collections.singletonList(key),
                (long) quantity
        );
    }

    /**
     * 현재 Redis 재고 조회
     */
    public long getStock(Long productId) {
        Object val = redissonClient.getBucket(stockKey(productId), LongCodec.INSTANCE).get();
        return val != null ? (long) val : 0L;
    }
}