package com.example.matnani.dto.response;

import com.example.matnani.domain.entity.Product;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.Getter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
public class ProductResponse {
    private Long id;
    private Long sellerId;
    private String sellerNickname;
    private String sellerRegionName;
    private String regionName;
    private String title;
    private String description;
    private ProductCategory category;
    private DefectReason defectReason;
    private Integer originalPrice;
    private Integer discountPrice;
    private BigDecimal discountRate;
    private ProductStatus status;
    private String pickupPlace;
    private LocalDateTime pickupStartAt;
    private LocalDateTime pickupEndAt;
    private LocalDateTime expiresAt;
    private Boolean timeSale;
    private List<String> imageUrls;
    private Integer totalQuantity;
    private Integer perPersonLimit;
    private Integer remainingQuantity;
    private LocalDateTime createdAt;
    private ActiveReservationDto activeReservation;
    private long reviewCount;
    private double averageRating;
    // 픽업 임박 할인
    private int timedDiscountRate;
    private int discountLevel;

    public static ProductResponse from(Product product, List<String> imageUrls) {
        ProductResponse response = new ProductResponse();
        response.id = product.getId();
        response.sellerId = product.getSeller().getId();
        response.sellerNickname = product.getSeller().getNickname();
        response.sellerRegionName = product.getSeller().getRegion() != null
                ? product.getSeller().getRegion().getName()
                : null;
        response.regionName = product.getRegion().getName();
        response.title = product.getTitle();
        response.description = product.getDescription();
        response.category = product.getCategory();
        response.defectReason = product.getDefectReason();
        response.originalPrice = product.getOriginalPrice();
        response.discountPrice = product.getDiscountPrice();
        response.discountRate = product.getDiscountRate();
        response.status = product.getStatus();
        response.pickupPlace = product.getPickupPlace();
        response.pickupStartAt = product.getPickupStartAt();
        response.pickupEndAt = product.getPickupEndAt();
        response.expiresAt = product.getExpiresAt();
        response.timeSale = product.getTimeSale();
        response.imageUrls = imageUrls;
        response.totalQuantity = product.getTotalQuantity();
        response.perPersonLimit = product.getPerPersonLimit();
        response.remainingQuantity = product.getRemainingQuantity();
        response.createdAt = product.getCreatedAt();
        response.totalQuantity = product.getTotalQuantity();
        response.perPersonLimit = product.getPerPersonLimit();
        response.remainingQuantity = product.getRemainingQuantity();
        response.timedDiscountRate = product.getTimedDiscountRate();
        response.discountLevel = product.getDiscountLevel();
        return response;
    }

    public void setActiveReservation(ActiveReservationDto activeReservation) {
        this.activeReservation = activeReservation;
    }

    public void setReviewStats(long reviewCount, double averageRating) {
        this.reviewCount = reviewCount;
        this.averageRating = averageRating;
    }
}
