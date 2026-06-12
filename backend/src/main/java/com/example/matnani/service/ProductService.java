package com.example.matnani.service;

import com.example.matnani.domain.entity.*;
import com.example.matnani.dto.request.ProductRequest;
import com.example.matnani.dto.response.ProductResponse;
import com.example.matnani.repository.*;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final RegionRepository regionRepository;
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;
    private final ReviewRepository reviewRepository;
    private final NotificationRepository notificationRepository;
    private final SecretCommentRepository secretCommentRepository;

    // 홈 피드 - 필터/정렬/페이징
    public List<ProductResponse> getProducts(Long regionId, ProductCategory category,
                                             String sort, ProductStatus status,
                                             int page, int size) {
        ProductStatus filterStatus = status != null ? status : ProductStatus.ON_SALE;

        List<Product> products = productRepository.findWithFilters(regionId, filterStatus, category);

        switch (sort) {
            case "near_expiry" -> products.sort((a, b) -> {
                if (a.getExpiresAt() == null) return 1;
                if (b.getExpiresAt() == null) return -1;
                return a.getExpiresAt().compareTo(b.getExpiresAt());
            });
            case "discount_high" -> products.sort((a, b) -> {
                if (a.getDiscountRate() == null) return 1;
                if (b.getDiscountRate() == null) return -1;
                return b.getDiscountRate().compareTo(a.getDiscountRate());
            });
            default -> products.sort((a, b) -> {
                if (a.getCreatedAt() == null) return 1;
                if (b.getCreatedAt() == null) return -1;
                return b.getCreatedAt().compareTo(a.getCreatedAt());
            });
        }

        int fromIndex = page * size;
        if (fromIndex >= products.size()) return List.of();
        int toIndex = Math.min(fromIndex + size, products.size());
        products = products.subList(fromIndex, toIndex);

        return products.stream()
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    // 타임세일
    public List<ProductResponse> getTimeSaleProducts(Long regionId) {
        return productRepository
                .findByRegionIdAndStatus(regionId, ProductStatus.ON_SALE)
                .stream()
                .filter(p -> p.getExpiresAt() != null)
                .sorted((a, b) -> a.getExpiresAt().compareTo(b.getExpiresAt()))
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    // 상품 상세 - activeReservation 포함
    public ProductResponse getProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        ProductResponse response = buildResponse(product);

        if (product.getStatus() == ProductStatus.RESERVED) {
            reservationRepository.findByProductIdAndStatusIn(
                            productId, List.of(ReservationStatus.REQUESTED, ReservationStatus.ACCEPTED))
                    .ifPresent(r -> response.setActiveReservation(
                            ProductResponse.ActiveReservationDto.of(
                                    r.getId(), r.getStatus(), r.getBuyer().getId())));
        }

        return response;
    }

    // 상품 등록
    @Transactional
    public ProductResponse createProduct(Long userId, ProductRequest request) {
        User seller = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        Region region = regionRepository.findById(request.getRegionId())
                .orElseThrow(() -> new RuntimeException("지역을 찾을 수 없습니다."));

        // discount_rate 서버에서 자동 계산
        BigDecimal discountRate = BigDecimal.valueOf(
                (request.getOriginalPrice() - request.getDiscountPrice()) * 100.0
                        / request.getOriginalPrice()
        ).setScale(2, RoundingMode.HALF_UP);

        int totalQty = request.getTotalQuantity() != null ? request.getTotalQuantity() : 1;
        int perPersonLmt = request.getPerPersonLimit() != null ? request.getPerPersonLimit() : totalQty;

        Product product = Product.builder()
                .seller(seller)
                .region(region)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .defectReason(request.getDefectReason())
                .originalPrice(request.getOriginalPrice())
                .discountPrice(request.getDiscountPrice())
                .discountRate(discountRate)
                .pickupPlace(request.getPickupPlace())
                .pickupStartAt(request.getPickupStartAt())
                .pickupEndAt(request.getPickupEndAt())
                .expiresAt(request.getExpiresAt())
                .totalQuantity(totalQty)
                .perPersonLimit(perPersonLmt)
                .remainingQuantity(totalQty)
                .build();

        productRepository.save(product);

        if (request.getImageUrls() != null) {
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ProductImage image = ProductImage.builder()
                        .product(product)
                        .imageUrl(request.getImageUrls().get(i))
                        .sortOrder(i)
                        .build();
                productImageRepository.save(image);
            }
        }

        return buildResponse(product);
    }

    // 상품 수정
    @Transactional
    public ProductResponse updateProduct(Long userId, Long productId, ProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        if (!product.getSeller().getId().equals(userId)) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }

        Region region = regionRepository.findById(request.getRegionId())
                .orElseThrow(() -> new RuntimeException("지역을 찾을 수 없습니다."));

        product.update(request, region);
        return buildResponse(product);
    }

    // ─── 공통 헬퍼: 이미지 + 후기 통계 포함 응답 생성 ───────────────
    private ProductResponse buildResponse(Product product) {
        List<String> imageUrls = productImageRepository
                .findByProductIdOrderBySortOrder(product.getId())
                .stream().map(ProductImage::getImageUrl).collect(Collectors.toList());
        ProductResponse response = ProductResponse.from(product, imageUrls);
        response.setReviewStats(
                reviewRepository.countByProductId(product.getId()),
                reviewRepository.findAverageRatingByProductId(product.getId())
        );
        return response;
    }

    // 상품 검색
    public List<ProductResponse> searchProducts(String keyword) {
        return productRepository.searchByKeyword(keyword)
                .stream()
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    // 상품 상태 변경
    @Transactional
    public void updateProductStatus(Long userId, Long productId, ProductStatus status) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        if (!product.getSeller().getId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }

        if (product.getStatus().equals(ProductStatus.RESERVED)) {
            throw new RuntimeException("예약 중인 상품은 상태를 변경할 수 없습니다.");
        }
        if (product.getStatus().equals(ProductStatus.SOLD_OUT)) {
            throw new RuntimeException("판매 완료된 상품은 상태를 변경할 수 없습니다.");
        }

        product.updateStatus(status);
    }

    // 상품 삭제
    @Transactional
    public void deleteProduct(Long userId, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        if (!product.getSeller().getId().equals(userId)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        if (product.getStatus().equals(ProductStatus.RESERVED)) {
            throw new RuntimeException("예약 중인 상품은 삭제할 수 없습니다.");
        }

        // 연관 데이터 삭제 순서 (FK 제약 위반 방지)
        // 1. 이 상품의 예약에 달린 알림 삭제
        List<Long> reservationIds = reservationRepository.findByProductId(productId)
                .stream().map(Reservation::getId).collect(Collectors.toList());
        if (!reservationIds.isEmpty()) {
            notificationRepository.deleteByReservationIdIn(reservationIds);
            reviewRepository.deleteByReservationIdIn(reservationIds);
        }

        // 2. 이 상품에 직접 달린 알림 삭제
        notificationRepository.deleteByProductId(productId);

        // 3. 예약 삭제
        reservationRepository.deleteAll(reservationRepository.findByProductId(productId));

        // 4. 비밀 댓글 삭제
        secretCommentRepository.deleteByProductId(productId);

        // 5. 이미지 삭제
        productImageRepository.deleteByProductId(productId);

        // 6. 상품 삭제
        productRepository.delete(product);
    }
}