package com.example.matnani.dto.response;

import com.example.matnani.domain.entity.SecretComment;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class SecretCommentResponse {
    private Long id;
    private String writerNickname;
    private String content;
    private LocalDateTime createdAt;

    public static SecretCommentResponse from(SecretComment comment) {
        SecretCommentResponse response = new SecretCommentResponse();
        response.id = comment.getId();
        response.writerNickname = comment.getWriter().getNickname();
        response.content = comment.getContent();
        response.createdAt = comment.getCreatedAt();
        return response;
    }
}