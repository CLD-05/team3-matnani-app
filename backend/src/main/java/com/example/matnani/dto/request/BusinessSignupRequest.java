package com.example.matnani.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BusinessSignupRequest {
    private String email;
    private String password;
    private String nickname;
    private String phone;
    private Long regionId;
    private String businessNumber;
    private String businessName;
    private String ownerName;
}