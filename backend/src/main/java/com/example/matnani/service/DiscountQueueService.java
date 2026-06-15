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
                int rate = targetLevel == 1 ? product.getTimedDiscountRate1() : product.getTimedDiscountRate2();
                if (product.getDiscountLevel() < targetLevel
                        && rate > 0
                        && product.getStatus().name().equals("ON_SALE")) {
                    applyDiscount(product, targetLevel, rate);
                    log.info("할인 적용 - 상품: {}, {}차 할인 ({}%), 할인가: {}원",
                            product.getTitle(), targetLevel, rate, product.getDiscountPrice());
                }
            });
        }
    }

    private void applyDiscount(Product product, int level, int rate) {
        // 기본 할인가(discountPrice) 기준으로 각 차수 할인율 적용
        // 1차, 2차 모두 등록 시점의 기본 할인가 기준
        // → 2차 적용 시 1차로 이미 바뀐 가격에서 역산하여 원래 기본 할인가 복원
        int basePrice = product.getDiscountPrice();
        if (level == 2 && product.getTimedDiscountRate1() > 0) {
            double prevRate = 1.0 - (product.getTimedDiscountRate1() / 100.0);
            basePrice = (int) Math.round(product.getDiscountPrice() / prevRate);
        }
        int newPrice = (int) Math.round(basePrice * (1.0 - (rate / 100.0)));
        BigDecimal newRate = BigDecimal.valueOf(
                (product.getOriginalPrice() - newPrice) * 100.0 / product.getOriginalPrice()
        ).setScale(2, RoundingMode.HALF_UP);

        product.setDiscountPrice(newPrice);
        product.setDiscountRate(newRate);
        product.setDiscountLevel(level);
    }
}