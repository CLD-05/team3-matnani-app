package com.example.matnani.repository;

import com.example.matnani.domain.entity.Product;
import static com.example.matnani.domain.enums.Enums.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByRegionIdAndStatus(Long regionId, ProductStatus status);
    List<Product> findBySellerId(Long sellerId);

    @Query("SELECT p FROM Product p WHERE " +
            "(:regionId IS NULL OR p.region.id = :regionId) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:category IS NULL OR p.category = :category)")
    List<Product> findWithFilters(
            @Param("regionId") Long regionId,
            @Param("status") ProductStatus status,
            @Param("category") ProductCategory category);

    @Query("SELECT p FROM Product p WHERE " +
            "(p.title LIKE %:keyword% OR p.description LIKE %:keyword%) " +
            "AND p.status = 'ON_SALE'")
    List<Product> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT p FROM Product p WHERE " +
            "p.pickupEndAt IS NOT NULL AND p.pickupEndAt < :now AND " +
            "p.status IN (com.example.matnani.domain.enums.Enums.ProductStatus.ON_SALE, " +
            "com.example.matnani.domain.enums.Enums.ProductStatus.RESERVED, " +
            "com.example.matnani.domain.enums.Enums.ProductStatus.SOLD_OUT)")
    List<Product> findExpiredProducts(@Param("now") LocalDateTime now);
}