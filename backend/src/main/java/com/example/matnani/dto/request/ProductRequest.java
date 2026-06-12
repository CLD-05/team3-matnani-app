package com.example.matnani.dto.request;


import static com.example.matnani.domain.enums.Enums.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
public class ProductRequest {
    private Long regionId;
    private String title;
    private String description;
    private ProductCategory category;
    private DefectReason defectReason;
    private Integer originalPrice;
    private Integer discountPrice;
    private BigDecimal discountRate;
    private String pickupPlace;
    private LocalDateTime pickupStartAt;
    private LocalDateTime pickupEndAt;
    private LocalDateTime expiresAt;
    private List<String> imageUrls;
    private Integer totalQuantity;
    private Integer perPersonLimit;
}