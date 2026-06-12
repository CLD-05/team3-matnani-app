package com.example.matnani.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SecretCommentRequest {
    private Long productId;
    private String content;
}