package com.example.matnani.service;

import com.example.matnani.domain.entity.*;
import com.example.matnani.dto.request.ReviewRequest;
import com.example.matnani.dto.response.ReviewResponse;
import com.example.matnani.repository.*;
import static com.example.matnani.domain.enums.Enums.*;
import com.example.matnani.exception.BadRequestException;
import com.example.matnani.exception.ForbiddenException;
import com.example.matnani.exception.NotFoundException;
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
    private final UserRepository userRepository;

    // 후기 작성
    @Transactional
    public ReviewResponse createReview(Long userId, Long reservationId, ReviewRequest request) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new NotFoundException("예약을 찾을 수 없습니다."));

        if (!reservation.getBuyer().getId().equals(userId)) {
            throw new ForbiddenException("후기 작성 권한이 없습니다.");
        }

        if (!reservation.getStatus().equals(ReservationStatus.COMPLETED)) {
            throw new BadRequestException("거래 완료 후 후기를 작성할 수 있습니다.");
        }

        if (reviewRepository.existsByReservationId(reservationId)) {
            throw new BadRequestException("이미 후기를 작성했습니다.");
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

    // 판매자별 후기 목록 (ID 기반)
    public List<ReviewResponse> getReviewsBySeller(Long sellerId) {
        return reviewRepository.findByReservationSellerId(sellerId)
                .stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
    }

    // 판매자별 후기 목록 (닉네임 기반)
    public List<ReviewResponse> getReviewsBySellerNickname(String nickname) {
        User seller = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new NotFoundException("판매자를 찾을 수 없습니다."));
        return getReviewsBySeller(seller.getId());
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
                .orElseThrow(() -> new NotFoundException("후기를 찾을 수 없습니다."));

        if (!review.getReservation().getBuyer().getId().equals(userId)) {
            throw new ForbiddenException("수정 권한이 없습니다.");
        }

        review.update(request.getRating(), request.getContent());
        return ReviewResponse.from(review);
    }

    // 후기 삭제
    @Transactional
    public void deleteReview(Long userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new NotFoundException("후기를 찾을 수 없습니다."));

        if (!review.getReservation().getBuyer().getId().equals(userId)) {
            throw new ForbiddenException("삭제 권한이 없습니다.");
        }

        reviewRepository.delete(review);
    }
}