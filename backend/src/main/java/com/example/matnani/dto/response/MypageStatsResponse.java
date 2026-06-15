package com.example.matnani.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MypageStatsResponse {
    private int totalSavings;  // 총 절약 금액
    private int rescueCount;   // 총 구출 횟수
}