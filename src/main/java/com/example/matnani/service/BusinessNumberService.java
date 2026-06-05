package com.example.matnani.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BusinessNumberService {

    private final RestTemplate restTemplate;

    @Value("${business.api.key}")
    private String apiKey;

    public boolean verify(String businessNumber) {
        // 테스트용: 10자리 숫자면 통과
        if (businessNumber == null || !businessNumber.matches("\\d{10}")) {
            return false;
        }

        try {
            String url = "https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=" + apiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = Map.of("b_no", new String[]{businessNumber});
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return true;
            }
        } catch (Exception e) {
            // API 호출 실패 시 형식만 검증
            return businessNumber.matches("\\d{10}");
        }

        return false;
    }
}