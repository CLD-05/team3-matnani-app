package com.example.matnani.service;

import static com.example.matnani.domain.enums.Enums.*;
import com.example.matnani.domain.entity.*;
import com.example.matnani.dto.request.SecretCommentRequest;
import com.example.matnani.dto.response.SecretCommentResponse;
import com.example.matnani.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Set;

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
                                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));
                User writer = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
                SecretComment parent = null;
                if (request.getParentCommentId() != null) {
                        parent = secretCommentRepository.findById(request.getParentCommentId())
                                        .orElseThrow(() -> new RuntimeException("원댓글을 찾을 수 없습니다."));
                        if (!parent.getProduct().getId().equals(productId)) {
                                throw new RuntimeException("다른 상품의 댓글에는 답글을 달 수 없습니다.");
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
                        Set<Long> notifiedUserIds = secretCommentRepository.findByProductId(productId)
                                        .stream()
                                        .map(c -> c.getWriter().getId())
                                        .filter(id -> !id.equals(userId))
                                        .collect(Collectors.toSet());
                        for (Long targetUserId : notifiedUserIds) {
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
                                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

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
                                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
                if (!comment.getWriter().getId().equals(userId)) {
                        throw new RuntimeException("수정 권한이 없습니다.");
                }
                comment.updateContent(request.getContent());
                return SecretCommentResponse.from(comment);
        }

        @Transactional
        public void deleteComment(Long userId, Long commentId) {
                SecretComment comment = secretCommentRepository.findById(commentId)
                                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
                if (!comment.getWriter().getId().equals(userId)) {
                        throw new RuntimeException("삭제 권한이 없습니다.");
                }
                secretCommentRepository.delete(comment);
        }
}
