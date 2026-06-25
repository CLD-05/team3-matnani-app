package com.example.matnani.service;

import com.example.matnani.exception.DuplicateReservationException;
import com.example.matnani.domain.entity.*;
import com.example.matnani.dto.response.ReservationResponse;
import com.example.matnani.repository.*;
import static com.example.matnani.domain.enums.Enums.*;
import com.example.matnani.exception.BadRequestException;
import com.example.matnani.exception.ForbiddenException;
import com.example.matnani.exception.NotFoundException;
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
            throw new BadRequestException("예약 수량은 1개 이상이어야 합니다.");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("상품을 찾을 수 없습니다."));

        if (!product.getStatus().equals(ProductStatus.ON_SALE)) {
            throw new DuplicateReservationException("이미 예약 중이거나 판매 완료된 상품입니다.");
        }

        if (product.getSeller().getId().equals(buyerId)) {
            throw new BadRequestException("본인 상품은 예약할 수 없습니다.");
        }

        int alreadyReserved = reservationRepository
                .findByProductIdAndBuyerIdAndStatusIn(
                        productId,
                        buyerId,
                        List.of(ReservationStatus.REQUESTED, ReservationStatus.ACCEPTED))
                .stream().mapToInt(Reservation::getQuantity).sum();
        if (alreadyReserved + quantity > product.getPerPersonLimit()) {
            throw new BadRequestException("인당 구매 한도(" + product.getPerPersonLimit() + "개)를 초과할 수 없습니다.");
        }

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new NotFoundException("유저를 찾을 수 없습니다."));

        if (buyer.isPurchaseRestricted()) {
            throw new ForbiddenException("노쇼 패널티로 구매가 일시 제한된 계정입니다.");
        }

        // [수정] DB UPDATE로 직접 차감 — 동시성 안전
        // Redis Lua에서 이미 재고 선점 완료, DB는 UPDATE로만 동기화
        productRepository.decrementRemainingQuantity(productId, quantity);
        product.setRemainingQuantity(product.getRemainingQuantity() - quantity);
        if (product.getRemainingQuantity() == 0) {
            product.updateStatus(ProductStatus.SOLD_OUT);
        }

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