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

    // ── 단건 조회 (상품 상세용) ────────────────────────────────────────
    @Query("SELECT COUNT(r) FROM Review r JOIN r.reservation res WHERE res.product.id = :productId")
    long countByProductId(@Param("productId") Long productId);

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r JOIN r.reservation res WHERE res.product.id = :productId")
    double findAverageRatingByProductId(@Param("productId") Long productId);

    // ── 배치 조회 (홈 피드 목록용 — N+1 해소) ────────────────────────
    // productId 목록을 한 번에 넘겨 COUNT를 가져옴
    // 반환: Object[]{productId(Long), count(Long)}
    @Query("SELECT res.product.id, COUNT(r) " +
            "FROM Review r JOIN r.reservation res " +
            "WHERE res.product.id IN :productIds " +
            "GROUP BY res.product.id")
    List<Object[]> countByProductIdIn(@Param("productIds") List<Long> productIds);

    // productId 목록을 한 번에 넘겨 AVG를 가져옴
    // 반환: Object[]{productId(Long), avg(Double)}
    @Query("SELECT res.product.id, COALESCE(AVG(r.rating), 0) " +
            "FROM Review r JOIN r.reservation res " +
            "WHERE res.product.id IN :productIds " +
            "GROUP BY res.product.id")
    List<Object[]> findAverageRatingByProductIdIn(@Param("productIds") List<Long> productIds);

    @Modifying
    @Query("DELETE FROM Review r WHERE r.reservation.id IN :reservationIds")
    void deleteByReservationIdIn(@Param("reservationIds") List<Long> reservationIds);

    @Query("SELECT r FROM Review r JOIN r.reservation res WHERE res.seller.id = :sellerId")
    List<Review> findByReservationSellerId(@Param("sellerId") Long sellerId);
}