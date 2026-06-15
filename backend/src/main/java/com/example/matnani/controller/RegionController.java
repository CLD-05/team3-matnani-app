package com.example.matnani.controller;

import com.example.matnani.domain.entity.Region;
import com.example.matnani.dto.response.ApiResponse;
import com.example.matnani.dto.response.RegionSearchResponse;
import com.example.matnani.repository.RegionRepository;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/regions")
@RequiredArgsConstructor
public class RegionController {

    private final RegionRepository regionRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Region>>> getRegions(
            @RequestParam(required = false) Long parentId) {
        List<Region> regions = parentId != null
                ? regionRepository.findByParentId(parentId)
                : regionRepository.findByRegionType(RegionType.CITY);
        return ResponseEntity.ok(ApiResponse.success(regions));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<RegionSearchResponse>>> searchRegions(
            @RequestParam String q) {
        if (q == null || q.trim().length() < 1) {
            return ResponseEntity.ok(ApiResponse.success(List.of()));
        }
        List<Object[]> rows = regionRepository.searchDongDetails(
                RegionType.DONG, q.trim(), PageRequest.of(0, 20));
        List<RegionSearchResponse> results = rows.stream()
                .map(row -> new RegionSearchResponse(
                        (Long) row[0],
                        (String) row[1],
                        (String) row[2],
                        (String) row[3],
                        row[3] + " " + row[2] + " " + row[1]
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(results));
    }
}
