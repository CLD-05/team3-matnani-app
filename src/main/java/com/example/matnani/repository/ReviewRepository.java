package com.example.matnani.repository;

import com.example.matnani.domain.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByReservationId(Long reservationId);
    boolean existsByReservationId(Long reservationId);
    List<Review> findAllByOrderByCreatedAtDesc();
    List<Review> findByReservation_BuyerId(Long buyerId);
}