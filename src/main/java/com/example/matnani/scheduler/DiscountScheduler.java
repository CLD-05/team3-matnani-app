package com.example.matnani.scheduler;

import com.example.matnani.domain.entity.Product;
import com.example.matnani.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DiscountScheduler {

    private final ProductRepository productRepository;

    @Scheduled(fixedRate = 300000)
    @Transactional
    public void autoIncreaseDiscount() {
        LocalDateTime now = LocalDateTime.now();

        // 1시간 이내 폐기 예정
        List<Product> oneHourTargets = productRepository.findTimedDiscountTargets(
                now, now.plusHours(1), 2);

        // 2시간 이내 폐기 예정
        List<Product> twoHourTargets = productRepository.findTimedDiscountTargets(
                now.plusHours(1), now.plusHours(2), 1);

        for (Product product : oneHourTargets) {
            applyDiscount(product);
        }
        for (Product product : twoHourTargets) {
            applyDiscount(product);
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

        log.info("할인 적용 - 상품: {}, 추가할인율: {}%, 할인가: {}원",
                product.getTitle(), product.getTimedDiscountRate(), newPrice);
    }
}