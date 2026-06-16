package com.example.matnani.repository;

import com.example.matnani.domain.entity.Product;
import com.example.matnani.domain.entity.Reservation;
import static com.example.matnani.domain.enums.Enums.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
        List<Reservation> findByBuyerIdAndStatus(Long buyerId, ReservationStatus status);

        List<Reservation> findBySellerId(Long sellerId);

        List<Reservation> findByProductId(Long productId);

        List<Reservation> findByBuyerId(Long buyerId);

        List<Reservation> findBySellerIdAndStatus(Long sellerId, ReservationStatus status);

        Optional<Reservation> findByProductIdAndStatusIn(Long productId, List<ReservationStatus> statuses);

        List<Reservation> findByProductAndStatusIn(Product product, List<ReservationStatus> statuses);

        List<Reservation> findByProductIdAndBuyerIdAndStatus(Long productId, Long buyerId, ReservationStatus status);

        List<Reservation> findByProductIdAndBuyerIdAndStatusIn(Long productId, Long buyerId,
                        List<ReservationStatus> statuses);

        @Query("SELECT r FROM Reservation r WHERE r.status IN :statuses " +
                        "AND r.product.pickupStartAt BETWEEN :from AND :to")
        List<Reservation> findPickupReminderTargets(@Param("statuses") List<ReservationStatus> statuses,
                        @Param("from") LocalDateTime from,
                        @Param("to") LocalDateTime to);

        @Query("SELECT r FROM Reservation r WHERE " +
                        "r.product.pickupStartAt BETWEEN :now AND :oneHourLater " +
                        "AND r.status = 'ACCEPTED' " +
                        "AND r.pickupAlertSent = false")
        List<Reservation> findPickupAlertTargets(
                        @Param("now") LocalDateTime now,
                        @Param("oneHourLater") LocalDateTime oneHourLater);

        @Query("SELECT r FROM Reservation r WHERE " +
                        "r.product.pickupEndAt < :now " +
                        "AND r.status = 'ACCEPTED'")
        List<Reservation> findNoShowTargets(@Param("now") LocalDateTime now);
}
