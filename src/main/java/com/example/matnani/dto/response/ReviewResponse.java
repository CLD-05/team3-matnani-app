package com.example.matnani.dto.response;

import com.example.matnani.domain.entity.Review;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class ReviewResponse {
    private Long id;
    private String buyerNickname;
    private Byte rating;
    private String content;
    private LocalDateTime createdAt;

    public static ReviewResponse from(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.id = review.getId();
        response.buyerNickname = review.getReservation().getBuyer().getNickname();
        response.rating = review.getRating();
        response.content = review.getContent();
        response.createdAt = review.getCreatedAt();
        return response;
    }
}