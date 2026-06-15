package com.example.matnani.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RegionSearchResponse {
    private Long id;
    private String name;
    private String districtName;
    private String cityName;
    private String label;
}
