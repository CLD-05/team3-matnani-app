// RegionRepository.java
package com.example.matnani.repository;

import com.example.matnani.domain.entity.Region;
import com.example.matnani.domain.enums.Enums.*;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;


public interface RegionRepository extends JpaRepository<Region, Long> {
    List<Region> findByRegionType(RegionType regionType);
    List<Region> findByParentId(Long parentId);

    @Query("SELECT r.id, r.name, p.name, gp.name FROM Region r JOIN r.parent p JOIN p.parent gp WHERE r.regionType = :type AND r.name LIKE %:keyword%")
    List<Object[]> searchDongDetails(@Param("type") RegionType type, @Param("keyword") String keyword, Pageable pageable);
}