package com.example.matnani.service;

import static com.example.matnani.domain.enums.Enums.*;
import com.example.matnani.domain.entity.*;
import com.example.matnani.dto.request.SecretCommentRequest;
import com.example.matnani.dto.response.SecretCommentResponse;
import com.example.matnani.repository.*;
import com.example.matnani.exception.BadRequestException;
import com.example.matnani.exception.ForbiddenException;
import com.example.matnani.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SecretCommentService {

    private final SecretCommentRepository secretCommentRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public SecretCommentResponse createComment(Long userId, Long productId, SecretCommentRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("상품을 찾을 수 없습니다."));
        User writer = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("유저를 찾을 수 없습니다."));
        SecretComment parent = null;
        if (request.getParentCommentId() != null) {
            parent = secretCommentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new NotFoundException("원댓글을 찾을 수 없습니다."));
            if (!parent.getProduct().getId().equals(productId)) {
                throw new BadRequestException("다른 상품의 댓글에는 답글을 달 수 없습니다.");
            }
        }

        SecretComment comment = SecretComment.builder()
                .product(product)
                .writer(writer)
                .parent(parent)
                .content(request.getContent())
                .build();

        secretCommentRepository.save(comment);

        if (parent != null) {
            User target = parent.getWriter().getId().equals(userId)
                    ? product.getSeller()
                    : parent.getWriter();
            notificationService.createNotification(target, NotificationType.COMMENT, product, null);
        } else if (!product.getSeller().getId().equals(userId)) {
            notificationService.createNotification(product.getSeller(), NotificationType.COMMENT, product,
                    null);
        } else {
            // 판매자가 직접 댓글 다는 경우 — 해당 상품에 댓글 단 다른 사용자들에게 알림
            // [수정] 기존: findByProductId()로 전체 댓글 엔티티 로딩 → Java stream으로 ID 추출
            //             댓글 많을수록 불필요한 엔티티 로딩 증가
            // [수정] 변경: writerIds 전용 쿼리로 ID만 조회 → 엔티티 로딩 없음
            List<Long> writerIds = secretCommentRepository
                    .findDistinctWriterIdsByProductId(productId, userId);
            for (Long targetUserId : writerIds) {
                userRepository.findById(targetUserId)
                        .ifPresent(target -> notificationService.createNotification(
                                target, NotificationType.COMMENT, product, null));
            }
        }

        return SecretCommentResponse.from(comment);
    }

    @Transactional(readOnly = true)
    public List<SecretCommentResponse> getComments(Long userId, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("상품을 찾을 수 없습니다."));

        return secretCommentRepository.findByProductId(productId)
                .stream()
                .filter(comment -> comment.getWriter().getId().equals(userId) ||
                        (comment.getParent() != null && comment.getParent().getWriter().getId()
                                .equals(userId))
                        ||
                        product.getSeller().getId().equals(userId))
                .map(SecretCommentResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public SecretCommentResponse updateComment(Long userId, Long commentId, SecretCommentRequest request) {
        SecretComment comment = secretCommentRepository.findById(commentId)
                .orElseThrow(() -> new NotFoundException("댓글을 찾을 수 없습니다."));
        if (!comment.getWriter().getId().equals(userId)) {
            throw new ForbiddenException("수정 권한이 없습니다.");
        }
        comment.updateContent(request.getContent());
        return SecretCommentResponse.from(comment);
    }

    @Transactional
    public void deleteComment(Long userId, Long commentId) {
        SecretComment comment = secretCommentRepository.findById(commentId)
                .orElseThrow(() -> new NotFoundException("댓글을 찾을 수 없습니다."));
        if (!comment.getWriter().getId().equals(userId)) {
            throw new ForbiddenException("삭제 권한이 없습니다.");
        }
        secretCommentRepository.delete(comment);
    }
}