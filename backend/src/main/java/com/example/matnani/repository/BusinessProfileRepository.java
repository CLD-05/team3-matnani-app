// BusinessProfileRepository.java
package com.example.matnani.repository;
import com.example.matnani.domain.entity.BusinessProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BusinessProfileRepository extends JpaRepository<BusinessProfile, Long> {
    Optional<BusinessProfile> findByUserId(Long userId);
    boolean existsByBusinessNumber(String businessNumber);
}