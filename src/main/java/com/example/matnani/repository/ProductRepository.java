package com.example.matnani.repository;

import com.example.matnani.domain.entity.Product;
import static com.example.matnani.domain.enums.Enums.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.time.LocalDateTime;

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
            "p.status = 'ON_SALE' AND " +
            "p.expiresAt BETWEEN :from AND :to AND " +
            "p.discountLevel < :maxLevel")
    List<Product> findTimedDiscountTargets(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("maxLevel") int maxLevel);

}