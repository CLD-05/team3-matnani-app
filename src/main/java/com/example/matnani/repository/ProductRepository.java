package com.example.matnani.repository;

import com.example.matnani.domain.entity.Product;
import static com.example.matnani.domain.enums.Enums.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByRegionIdAndStatus(Long regionId, ProductStatus status);
    List<Product> findBySellerId(Long sellerId);

    @Query("SELECT p FROM Product p WHERE " +
            "(p.title LIKE %:keyword% OR p.description LIKE %:keyword%) " +
            "AND p.status = 'ON_SALE'")   // SELLING → ON_SALE
    List<Product> searchByKeyword(@Param("keyword") String keyword);
}