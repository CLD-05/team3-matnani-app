// RegionRepository.java
package com.example.matnani.repository;

import com.example.matnani.domain.entity.Region;
import com.example.matnani.domain.enums.Enums.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface RegionRepository extends JpaRepository<Region, Long> {
    List<Region> findByRegionType(RegionType regionType);
    List<Region> findByParentId(Long parentId);
}