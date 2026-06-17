package com.example.matnani.scheduler;

import com.example.matnani.domain.entity.Product;
import com.example.matnani.domain.entity.Reservation;
import com.example.matnani.repository.ProductRepository;
import com.example.matnani.repository.ReservationRepository;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProductExpiryScheduler {

    private final ProductRepository productRepository;
    private final ReservationRepository reservationRepository;

    // 1분마다 실행
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void expireProducts() {
        LocalDateTime now = LocalDateTime.now();
        List<Product> expiredProducts = productRepository.findExpiredProducts(now);

        for (Product product : expiredProducts) {
            // 진행 중인 예약(REQUESTED, ACCEPTED) 자동 취소
            List<Reservation> activeReservations = reservationRepository
                    .findByProductAndStatusIn(product,
                            List.of(ReservationStatus.REQUESTED, ReservationStatus.ACCEPTED));

            for (Reservation reservation : activeReservations) {
                reservation.setStatus(ReservationStatus.CANCELED);
                log.info("마감 만료로 예약 취소 - 예약ID: {}, 상품: {}",
                        reservation.getId(), product.getTitle());
            }

            product.updateStatus(ProductStatus.EXPIRED);
            log.info("상품 만료 처리 - 상품ID: {}, 제목: {}", product.getId(), product.getTitle());
        }
    }
}