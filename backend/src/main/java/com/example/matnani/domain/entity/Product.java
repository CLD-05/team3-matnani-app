package com.example.matnani.domain.entity;

import com.example.matnani.domain.enums.Enums.*;
import com.example.matnani.dto.request.ProductRequest;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCategory category;

    @Enumerated(EnumType.STRING)
    private DefectReason defectReason;

    @Column(nullable = false)
    private Integer originalPrice;

    @Column(nullable = false)
    private Integer discountPrice;

    private BigDecimal discountRate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProductStatus status = ProductStatus.ON_SALE; // SELLING → ON_SALE

    private String pickupPlace;

    private LocalDateTime pickupStartAt;

    private LocalDateTime pickupEndAt;

    private LocalDateTime expiresAt;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    @Builder.Default
    private Boolean timeSale = false;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 1")
    @Builder.Default
    private Integer totalQuantity = 1;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 1")
    @Builder.Default
    private Integer perPersonLimit = 1;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 1")
    @Builder.Default
    private Integer remainingQuantity = 1;

    @Builder.Default
    private int discountLevel = 0;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Builder.Default
    private int timedDiscountRate = 0;

    @Builder.Default
    private int timedDiscountRate1 = 0;

    @Builder.Default
    private int timedDiscountRate2 = 0;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void updateStatus(ProductStatus status) {
        this.status = status;
    }

    public void setRemainingQuantity(int quantity) {
        this.remainingQuantity = quantity;
    }

    public void setDiscountPrice(Integer price) {
        this.discountPrice = price;
    }

    public void setDiscountRate(BigDecimal rate) {
        this.discountRate = rate;
    }

    public void setDiscountLevel(int level) {
        this.discountLevel = level;
    }

    public void setTimedDiscountRate1(int rate) {
        this.timedDiscountRate1 = rate;
    }

    public void setTimedDiscountRate2(int rate) {
        this.timedDiscountRate2 = rate;
    }

    // 재고 차감 - 재고 소진 시 SOLD_OUT 자동 전환
    public void deductQuantity(int quantity) {
        if (this.remainingQuantity < quantity) {
            throw new RuntimeException("재고가 부족합니다.");
        }
        this.remainingQuantity -= quantity;
        if (this.remainingQuantity == 0) {
            this.status = ProductStatus.SOLD_OUT;
        }
    }

    // 재고 복구 (예약 취소 시)
    public void restoreQuantity(int quantity) {
        this.remainingQuantity += quantity;
        if (this.status == ProductStatus.SOLD_OUT && this.remainingQuantity > 0) {
            this.status = ProductStatus.ON_SALE;
        }
    }

    public void update(ProductRequest request, Region region) {
        this.region = region;
        this.title = request.getTitle();
        this.description = request.getDescription();
        this.category = request.getCategory();
        this.defectReason = request.getDefectReason();
        this.originalPrice = request.getOriginalPrice();
        this.pickupPlace = request.getPickupPlace();
        this.pickupStartAt = request.getPickupStartAt();
        this.pickupEndAt = request.getPickupEndAt();
        this.expiresAt = request.getExpiresAt();
        this.timeSale = request.getTimeSale() != null && request.getTimeSale();
        if (request.getTotalQuantity() != null) {
            this.totalQuantity = request.getTotalQuantity();
            this.perPersonLimit = request.getPerPersonLimit() != null ? request.getPerPersonLimit()
                    : request.getTotalQuantity();
        }
        if (request.getTimedDiscountRate1() != null) {
            this.timedDiscountRate1 = request.getTimedDiscountRate1();
        }
        if (request.getTimedDiscountRate2() != null) {
            this.timedDiscountRate2 = request.getTimedDiscountRate2();
        }
    }
}