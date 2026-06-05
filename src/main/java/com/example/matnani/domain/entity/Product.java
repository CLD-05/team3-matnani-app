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
    private ProductStatus status = ProductStatus.ON_SALE;  // SELLING → ON_SALE

    private String pickupPlace;

    private LocalDateTime pickupStartAt;

    private LocalDateTime pickupEndAt;

    private LocalDateTime expiresAt;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

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

    public void update(ProductRequest request, Region region) {
        this.region = region;
        this.title = request.getTitle();
        this.description = request.getDescription();
        this.category = request.getCategory();
        this.defectReason = request.getDefectReason();
        this.originalPrice = request.getOriginalPrice();
        this.discountPrice = request.getDiscountPrice();
        this.discountRate = request.getDiscountRate();
        this.pickupPlace = request.getPickupPlace();
        this.pickupStartAt = request.getPickupStartAt();
        this.pickupEndAt = request.getPickupEndAt();
        this.expiresAt = request.getExpiresAt();
    }
}