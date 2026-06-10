package com.example.matnani.repository;

import com.example.matnani.domain.entity.Reservation;
import static com.example.matnani.domain.enums.Enums.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByBuyerIdAndStatus(Long buyerId, ReservationStatus status);
    List<Reservation> findBySellerId(Long sellerId);
    List<Reservation> findByProductId(Long productId);
    List<Reservation> findByBuyerId(Long buyerId);
    List<Reservation> findBySellerIdAndStatus(Long sellerId, ReservationStatus status);
    Optional<Reservation> findByProductIdAndStatusIn(Long productId, List<ReservationStatus> statuses);
    List<Reservation> findByProductIdAndBuyerIdAndStatus(Long productId, Long buyerId, ReservationStatus status);
}