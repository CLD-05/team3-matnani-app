package com.example.matnani.scheduler;

import com.example.matnani.domain.entity.Product;
import com.example.matnani.domain.enums.Enums.ProductStatus;
import com.example.matnani.repository.ProductRepository;
import com.example.matnani.service.StockRedisService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class StockInitializer {

    private final ProductRepository productRepository;
    private final StockRedisService stockRedisService;

    @PostConstruct
    public void initStock() {
        List<Product> onSaleProducts = productRepository.findByStatus(ProductStatus.ON_SALE);
        for (Product product : onSaleProducts) {
            stockRedisService.set(product.getId(), product.getRemainingQuantity());
        }
        log.info("Redis 재고 초기화 완료: {}개 상품", onSaleProducts.size());
    }
}
