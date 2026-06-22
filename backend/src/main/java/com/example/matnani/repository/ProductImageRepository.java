package com.example.matnani.repository;

import com.example.matnani.domain.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductIdOrderBySortOrder(Long productId);
    void deleteByProductId(Long productId);

    // 판매자 프로필용 (기존)
    @Query("SELECT pi FROM ProductImage pi WHERE pi.product.seller.id = :sellerId ORDER BY pi.product.id, pi.sortOrder")
    List<ProductImage> findByProductSellerIdOrderBySortOrder(@Param("sellerId") Long sellerId);

    // 배치 조회용 — 홈 피드 목록 N+1 해소
    @Query("SELECT pi FROM ProductImage pi WHERE pi.product.id IN :productIds ORDER BY pi.product.id, pi.sortOrder")
    List<ProductImage> findByProductIdInOrderBySortOrder(@Param("productIds") List<Long> productIds);
}