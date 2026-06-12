package com.example.matnani.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class BusinessNumberService {

    private final RestTemplate restTemplate;

    @Value("${business.api.key}")
    private String apiKey;

    @Value("${business.test-mode:false}")
    private boolean testMode;

    // 테스트용 번호 - 개발 환경에서만 통과
    private static final String TEST_BUSINESS_NUMBER = "0000000000";

    public boolean verify(String businessNumber, String ownerName, String startDate) {
        if (businessNumber == null || !businessNumber.matches("\\d{10}")) {
            throw new RuntimeException("사업자등록번호는 하이픈 없이 10자리 숫자여야 합니다.");
        }
        if (ownerName == null || ownerName.isBlank()) {
            throw new RuntimeException("대표자성명을 입력해주세요.");
        }
        if (startDate == null || !startDate.matches("\\d{8}")) {
            throw new RuntimeException("개업일자는 YYYYMMDD 형식 8자리 숫자여야 합니다.");
        }

        // 개발 테스트용 번호 - test-mode 활성화 시 국세청 API 호출 없이 통과
        if (testMode && TEST_BUSINESS_NUMBER.equals(businessNumber)) {
            log.info("[테스트모드] 사업자번호 {} 검증 통과", businessNumber);
            return true;
        }

        try {
            String url = "https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=" + apiKey + "&returnType=JSON";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> businessInfo = Map.of(
                    "b_no", businessNumber,
                    "p_nm", ownerName,
                    "start_dt", startDate,
                    "b_nm", "",
                    "p_nm2", ""
            );
            Map<String, Object> body = Map.of("businesses", List.of(businessInfo));
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                log.warn("사업자 진위확인 API 응답 이상: status={}", response.getStatusCode());
                return false;
            }

            // 응답 구조: { "data": [ { "valid": "01" or "02", ... } ] }
            List<Map<String, Object>> data = (List<Map<String, Object>>) response.getBody().get("data");
            if (data == null || data.isEmpty()) {
                return false;
            }

            String valid = String.valueOf(data.get(0).get("valid"));
            // "01" = 확인됨, "02" = 확인할 수 없음
            return "01".equals(valid);

        } catch (Exception e) {
            log.error("사업자 진위확인 API 호출 실패: {}", e.getMessage());
            throw new RuntimeException("사업자 진위확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }
}
