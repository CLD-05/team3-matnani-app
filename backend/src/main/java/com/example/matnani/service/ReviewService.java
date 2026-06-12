package com.example.matnani.service;

import com.example.matnani.domain.entity.*;
import com.example.matnani.dto.request.ReviewRequest;
import com.example.matnani.dto.response.ReviewResponse;
import com.example.matnani.repository.*;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;

    // 후기 작성
    @Transactional
    public ReviewResponse createReview(Long userId, Long reservationId, ReviewRequest request) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));

        if (!reservation.getBuyer().getId().equals(userId)) {
            throw new RuntimeException("후기 작성 권한이 없습니다.");
        }

        if (!reservation.getStatus().equals(ReservationStatus.COMPLETED)) {
            throw new RuntimeException("거래 완료 후 후기를 작성할 수 있습니다.");
        }

        if (reviewRepository.existsByReservationId(reservationId)) {
            throw new RuntimeException("이미 후기를 작성했습니다.");
        }

        Review review = Review.builder()
                .reservation(reservation)
                .rating(request.getRating())
                .content(request.getContent())
                .build();

        reviewRepository.save(review);
        return ReviewResponse.from(review);
    }

    // 전체 후기 목록
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
    }

    // 판매자별 후기 목록
    public List<ReviewResponse> getReviewsBySeller(Long sellerId) {
        return reservationRepository.findBySellerId(sellerId)
                .stream()
                .map(reservation -> reviewRepository.findByReservationId(reservation.getId()))
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
    }

    // 내가 쓴 후기
    public List<ReviewResponse> getMyReviews(Long userId) {
        return reviewRepository.findByReservation_BuyerId(userId)
                .stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
    }

    // 후기 수정
    @Transactional
    public ReviewResponse updateReview(Long userId, Long reviewId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("후기를 찾을 수 없습니다."));

        if (!review.getReservation().getBuyer().getId().equals(userId)) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }

        review.update(request.getRating(), request.getContent());
        return ReviewResponse.from(review);
    }

    // 후기 삭제
    @Transactional
    public void deleteReview(Long userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("후기를 찾을 수 없습니다."));

        if (!review.getReservation().getBuyer().getId().equals(userId)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        reviewRepository.delete(review);
    }
}