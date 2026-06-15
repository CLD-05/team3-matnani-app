package com.example.matnani;

import com.example.matnani.domain.entity.*;
import com.example.matnani.repository.*;
import static com.example.matnani.domain.enums.Enums.*;

import com.example.matnani.service.DiscountQueueService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class DiscountQueueServiceTest {

    @Autowired
    DiscountQueueService discountQueueService;
    @Autowired ProductRepository productRepository;
    @Autowired UserRepository userRepository;
    @Autowired RegionRepository regionRepository;

    @Test
    void 할인_큐_등록_및_적용_테스트() throws InterruptedException {
        // 1. 테스트용 Region, User 직접 생성
        Region region = Region.builder()
                .name("서울시")
                .regionType(RegionType.CITY)
                .build();
        regionRepository.save(region);

        User seller = User.builder()
                .email("test@test.com")
                .passwordHash("test1234")
                .nickname("테스트판매자")
                .role(UserRole.BUSINESS)
                .region(region)
                .build();
        userRepository.save(seller);

        // 2. 테스트용 상품 저장
        Product product = Product.builder()
                .seller(seller)
                .region(region)
                .title("테스트 상품")
                .category(ProductCategory.BAKERY_DESSERT)
                .originalPrice(10000)
                .discountPrice(7000)
                .discountRate(BigDecimal.valueOf(30.00))
                .totalQuantity(5)
                .perPersonLimit(2)
                .remainingQuantity(5)
                .timedDiscountRate(10)
                .pickupEndAt(LocalDateTime.now().plusMinutes(30))
                .build();
        productRepository.save(product);

        int originalPrice = product.getDiscountPrice();

        // 3. 큐 등록 및 실행
        discountQueueService.scheduleDiscount(product.getId(), product.getPickupEndAt());
        Thread.sleep(2000);
        discountQueueService.processQueue();

        // 4. 결과 확인
        Product updated = productRepository.findById(product.getId()).orElseThrow();
        System.out.println("원래 할인가: " + originalPrice);
        System.out.println("적용 후 할인가: " + updated.getDiscountPrice());
        System.out.println("discountLevel: " + updated.getDiscountLevel());

        assertThat(updated.getDiscountPrice()).isLessThan(originalPrice);
        assertThat(updated.getDiscountLevel()).isGreaterThan(0);
    }}