package com.example.matnani.service;

import com.example.matnani.domain.entity.Product;
import com.example.matnani.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RQueue;
import org.redisson.api.RDelayedQueue;
import org.redisson.api.RedissonClient;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class DiscountQueueService {

    private final RedissonClient redissonClient;
    private final ProductRepository productRepository;

    private static final String QUEUE_NAME = "matnani:discount-queue";

    public void scheduleDiscount(Long productId, LocalDateTime pickupEndAt) {
        RQueue<String> queue = redissonClient.getQueue(QUEUE_NAME);
        RDelayedQueue<String> delayedQueue = redissonClient.getDelayedQueue(queue);

        LocalDateTime now = LocalDateTime.now();

        if (!pickupEndAt.isAfter(now)) return; // 이미 픽업 마감된 상품 제외

        // 픽업 마감 2시간 전 → 1차 할인 (과거면 즉시)
        long delay1 = Math.max(0, Duration.between(now, pickupEndAt.minusHours(2)).getSeconds());
        delayedQueue.offer(productId + ":1", delay1, TimeUnit.SECONDS);
        log.info("1차 할인 예약 - 상품ID: {}, delay: {}초", productId, delay1);

        // 픽업 마감 1시간 전 → 2차 할인 (과거면 즉시)
        long delay2 = Math.max(0, Duration.between(now, pickupEndAt.minusHours(1)).getSeconds());
        delayedQueue.offer(productId + ":2", delay2, TimeUnit.SECONDS);
        log.info("2차 할인 예약 - 상품ID: {}, delay: {}초", productId, delay2);
    }

    @Scheduled(fixedRate = 10000)
    @Transactional
    public void processQueue() {
        RQueue<String> queue = redissonClient.getQueue(QUEUE_NAME);

        String item;
        while ((item = queue.poll()) != null) {
            String[] parts = item.split(":");
            Long productId = Long.parseLong(parts[0]);
            int targetLevel = Integer.parseInt(parts[1]);

            productRepository.findById(productId).ifPresent(product -> {
                if (product.getDiscountLevel() < targetLevel
                        && product.getTimedDiscountRate() > 0
                        && product.getStatus().name().equals("ON_SALE")) {
                    applyDiscount(product);
                    log.info("할인 적용 - 상품: {}, {}차 할인, 할인가: {}원",
                            product.getTitle(), targetLevel, product.getDiscountPrice());
                }
            });
        }
    }

    private void applyDiscount(Product product) {
        double rate = 1.0 - (product.getTimedDiscountRate() / 100.0);
        int newPrice = (int) (product.getDiscountPrice() * rate);
        BigDecimal newRate = BigDecimal.valueOf(
                (product.getOriginalPrice() - newPrice) * 100.0 / product.getOriginalPrice()
        ).setScale(2, RoundingMode.HALF_UP);

        product.setDiscountPrice(newPrice);
        product.setDiscountRate(newRate);
        product.setDiscountLevel(product.getDiscountLevel() + 1);
    }
}