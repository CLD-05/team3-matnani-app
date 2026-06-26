package com.example.matnani.repository;

import com.example.matnani.domain.entity.Product;
import static com.example.matnani.domain.enums.Enums.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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
            "(:regionId IS NULL OR p.region.id = :regionId) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:category IS NULL OR p.category = :category)")
    Page<Product> findWithFiltersPageable(
            @Param("regionId") Long regionId,
            @Param("status") ProductStatus status,
            @Param("category") ProductCategory category,
            Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
            "(:regionId IS NULL OR p.region.id = :regionId) AND " +
            "p.status = :status AND " +
            "p.timeSale = true " +
            "ORDER BY p.expiresAt ASC NULLS LAST")
    List<Product> findTimeSaleProducts(
            @Param("regionId") Long regionId,
            @Param("status") ProductStatus status);

    @Query("SELECT p FROM Product p WHERE " +
            "(p.title LIKE :keywordPrefix OR p.description LIKE :keywordAny) " +
            "AND p.status = 'ON_SALE'")
    List<Product> searchByKeyword(
            @Param("keywordPrefix") String keywordPrefix,
            @Param("keywordAny") String keywordAny);

    @Query("SELECT p FROM Product p WHERE " +
            "p.pickupEndAt IS NOT NULL AND p.pickupEndAt < :now AND " +
            "p.status IN (com.example.matnani.domain.enums.Enums.ProductStatus.ON_SALE, " +
            "com.example.matnani.domain.enums.Enums.ProductStatus.RESERVED, " +
            "com.example.matnani.domain.enums.Enums.ProductStatus.SOLD_OUT)")
    List<Product> findExpiredProducts(@Param("now") LocalDateTime now);

    // Lua 방식 DB 동기화 — UPDATE로 직접 차감 (동시성 안전)
    @Modifying
    @Query("UPDATE Product p SET p.remainingQuantity = p.remainingQuantity - :quantity WHERE p.id = :productId")
    void decrementRemainingQuantity(@Param("productId") Long productId, @Param("quantity") int quantity);

    // 재고 0이면 SOLD_OUT으로 상태 변경
    @Modifying
    @Query("UPDATE Product p SET p.status = 'SOLD_OUT' WHERE p.id = :productId AND p.remainingQuantity = 0")
    void updateStatusIfSoldOut(@Param("productId") Long productId);
}