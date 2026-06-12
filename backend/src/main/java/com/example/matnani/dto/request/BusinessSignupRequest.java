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
    private String businessNumber; // 사업자등록번호 10자리 숫자 (하이픈 제거)
    private String businessName;
    private String ownerName;      // 대표자성명
    private String startDate;      // 개업일자 YYYYMMDD
}