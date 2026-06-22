package com.example.matnani.repository;

import com.example.matnani.domain.entity.SecretComment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SecretCommentRepository extends JpaRepository<SecretComment, Long> {

    @EntityGraph(attributePaths = {"writer", "parent", "parent.writer"})
    List<SecretComment> findByProductId(Long productId);

    void deleteByProductId(Long productId);

    // 판매자가 댓글 달 때 알림 대상 조회용
    // [수정] 기존: findByProductId()로 전체 댓글 엔티티 로딩 후 Java에서 writer ID 추출
    // [수정] 변경: writer ID만 DB에서 바로 SELECT → 엔티티 로딩 비용 제거
    @Query("SELECT DISTINCT c.writer.id FROM SecretComment c " +
            "WHERE c.product.id = :productId AND c.writer.id <> :excludeUserId")
    List<Long> findDistinctWriterIdsByProductId(
            @Param("productId") Long productId,
            @Param("excludeUserId") Long excludeUserId);
}