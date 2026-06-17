package com.example.matnani.repository;

import com.example.matnani.domain.entity.SecretComment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SecretCommentRepository extends JpaRepository<SecretComment, Long> {

    @EntityGraph(attributePaths = {"writer", "parent", "parent.writer"})
    List<SecretComment> findByProductId(Long productId);

    void deleteByProductId(Long productId);
}