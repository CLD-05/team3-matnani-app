package com.example.matnani.service;

import com.example.matnani.config.DuplicateReservationException;
import com.example.matnani.domain.entity.*;
import com.example.matnani.dto.response.ReservationResponse;
import com.example.matnani.repository.*;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationInternalService {

    private final ReservationRepository reservationRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public ReservationResponse createReservationInternal(Long buyerId, Long productId, int quantity) {
        if (quantity < 1) {
            throw new RuntimeException("예약 수량은 1개 이상이어야 합니다.");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        if (!product.getStatus().equals(ProductStatus.ON_SALE)) {
            throw new DuplicateReservationException("이미 예약 중이거나 판매 완료된 상품입니다.");
        }

        if (product.getSeller().getId().equals(buyerId)) {
            throw new RuntimeException("본인 상품은 예약할 수 없습니다.");
        }

        // 인당 구매 한도 초과 여부 확인
        int alreadyReserved = reservationRepository
                .findByProductIdAndBuyerIdAndStatusIn(
                        productId,
                        buyerId,
                        List.of(ReservationStatus.REQUESTED, ReservationStatus.ACCEPTED))
                .stream().mapToInt(Reservation::getQuantity).sum();
        if (alreadyReserved + quantity > product.getPerPersonLimit()) {
            throw new RuntimeException("인당 구매 한도(" + product.getPerPersonLimit() + "개)를 초과할 수 없습니다.");
        }

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        if (buyer.isPurchaseRestricted()) {
            throw new RuntimeException("노쇼 패널티로 구매가 일시 제한된 계정입니다.");
        }

        product.deductQuantity(quantity);

        Reservation reservation = Reservation.builder()
                .product(product)
                .buyer(buyer)
                .seller(product.getSeller())
                .finalPrice(product.getDiscountPrice() * quantity)
                .quantity(quantity)
                .status(ReservationStatus.REQUESTED)
                .build();

        reservationRepository.save(reservation);

        notificationService.createNotification(
                product.getSeller(),
                NotificationType.RESERVATION,
                null,
                reservation);

        return ReservationResponse.from(reservation);
    }
}