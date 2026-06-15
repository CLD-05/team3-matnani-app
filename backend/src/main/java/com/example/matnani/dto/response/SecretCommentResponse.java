package com.example.matnani.dto.response;

import com.example.matnani.domain.entity.SecretComment;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class SecretCommentResponse {
    private Long id;
    private Long writerId;
    private String writerNickname;
    private Long parentCommentId;
    private boolean isSeller;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static SecretCommentResponse from(SecretComment comment) {
        SecretCommentResponse response = new SecretCommentResponse();
        response.id = comment.getId();
        response.writerId = comment.getWriter().getId();
        response.writerNickname = comment.getWriter().getNickname();
        response.parentCommentId = comment.getParent() != null ? comment.getParent().getId() : null;
        response.isSeller = comment.getWriter().getId()
                .equals(comment.getProduct().getSeller().getId());
        response.content = comment.getContent();
        response.createdAt = comment.getCreatedAt();
        response.updatedAt = comment.getUpdatedAt();
        return response;
    }
}
