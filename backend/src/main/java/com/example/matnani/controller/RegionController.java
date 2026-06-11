package com.example.matnani.controller;

import com.example.matnani.domain.entity.Region;
import com.example.matnani.dto.response.ApiResponse;
import com.example.matnani.repository.RegionRepository;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
}