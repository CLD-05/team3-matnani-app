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
    private String sellerNickname;
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
    private List<String> imageUrls;
    private LocalDateTime createdAt;

    public static ProductResponse from(Product product, List<String> imageUrls) {
        ProductResponse response = new ProductResponse();
        response.id = product.getId();
        response.sellerNickname = product.getSeller().getNickname();
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
        response.imageUrls = imageUrls;
        response.createdAt = product.getCreatedAt();
        return response;
    }
}