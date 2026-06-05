package com.example.matnani.repository;

import com.example.matnani.domain.entity.Reservation;
import com.example.matnani.domain.enums.Enums.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByBuyerIdAndStatus(Long buyerId, ReservationStatus status);
    List<Reservation> findBySellerId(Long sellerId);
    List<Reservation> findByBuyerId(Long buyerId);

}