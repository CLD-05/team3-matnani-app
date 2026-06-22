package com.example.matnani.repository;

import com.example.matnani.domain.entity.Product;
import static com.example.matnani.domain.enums.Enums.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByRegionIdAndStatus(Long regionId, ProductStatus status);
    List<Product> findBySellerId(Long sellerId);

    // 스케줄러 내부용 (전체 조회)
    @Query("SELECT p FROM Product p WHERE " +
            "(:regionId IS NULL OR p.region.id = :regionId) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:category IS NULL OR p.category = :category)")
    List<Product> findWithFilters(
            @Param("regionId") Long regionId,
            @Param("status") ProductStatus status,
            @Param("category") ProductCategory category);

    // 홈 피드용 — DB 레벨 정렬 + 페이징
    @Query("SELECT p FROM Product p WHERE " +
            "(:regionId IS NULL OR p.region.id = :regionId) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:category IS NULL OR p.category = :category)")
    Page<Product> findWithFiltersPageable(
            @Param("regionId") Long regionId,
            @Param("status") ProductStatus status,
            @Param("category") ProductCategory category,
            Pageable pageable);

    // 타임세일 전용 — DB에서 필터 + 정렬
    @Query("SELECT p FROM Product p WHERE " +
            "(:regionId IS NULL OR p.region.id = :regionId) AND " +
            "p.status = :status AND " +
            "p.timeSale = true " +
            "ORDER BY p.expiresAt ASC NULLS LAST")
    List<Product> findTimeSaleProducts(
            @Param("regionId") Long regionId,
            @Param("status") ProductStatus status);

    // 검색 — title은 앞 와일드카드 제거(인덱스 활용), description은 포함 검색
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
}