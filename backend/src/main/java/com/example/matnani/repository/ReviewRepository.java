package com.example.matnani.repository;

import com.example.matnani.domain.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByReservationId(Long reservationId);

    boolean existsByReservationId(Long reservationId);

    List<Review> findAllByOrderByCreatedAtDesc();

    List<Review> findByReservation_BuyerId(Long buyerId);

    @Query("SELECT COUNT(r) FROM Review r JOIN r.reservation res WHERE res.product.id = :productId")
    long countByProductId(@Param("productId") Long productId);

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r JOIN r.reservation res WHERE res.product.id = :productId")
    double findAverageRatingByProductId(@Param("productId") Long productId);

    @Modifying
    @Query("DELETE FROM Review r WHERE r.reservation.id IN :reservationIds")
    void deleteByReservationIdIn(@Param("reservationIds") List<Long> reservationIds);

    @Query("SELECT r FROM Review r JOIN r.reservation res WHERE res.seller.id = :sellerId")
    List<Review> findByReservationSellerId(@Param("sellerId") Long sellerId);
}