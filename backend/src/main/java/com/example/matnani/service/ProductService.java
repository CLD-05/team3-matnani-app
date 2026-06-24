package com.example.matnani.service;

import com.example.matnani.domain.entity.*;
import com.example.matnani.dto.request.ProductRequest;
import com.example.matnani.dto.response.ProductResponse;
import com.example.matnani.repository.*;
import static com.example.matnani.domain.enums.Enums.*;
import com.example.matnani.exception.BadRequestException;
import com.example.matnani.exception.ForbiddenException;
import com.example.matnani.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    private final DiscountQueueService discountQueueService;

    // 홈 피드 - DB 레벨 정렬/페이징 + 배치 N+1 해소
    public List<ProductResponse> getProducts(Long regionId, ProductCategory category,
                                             String sort, ProductStatus status,
                                             int page, int size) {
        ProductStatus filterStatus = status != null ? status : ProductStatus.ON_SALE;

        Sort dbSort = switch (sort) {
            case "near_expiry"   -> Sort.by(Sort.Order.asc("expiresAt").nullsLast());
            case "discount_high" -> Sort.by(Sort.Order.desc("discountRate").nullsLast());
            default              -> Sort.by(Sort.Order.desc("createdAt").nullsLast());
        };

        Page<Product> productPage = productRepository.findWithFiltersPageable(
                regionId, filterStatus, category,
                PageRequest.of(page, size, dbSort)
        );

        return buildResponses(productPage.getContent());
    }

    // 타임세일 - DB 필터+정렬 + 배치 N+1 해소
    public List<ProductResponse> getTimeSaleProducts(Long regionId) {
        List<Product> products = productRepository
                .findTimeSaleProducts(regionId, ProductStatus.ON_SALE);
        return buildResponses(products);
    }

    // 상품 상세
    public ProductResponse getProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("상품을 찾을 수 없습니다."));

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

    // 상품 등록 - 사업자만 가능
    @Transactional
    public ProductResponse createProduct(Long userId, ProductRequest request) {
        User seller = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("유저를 찾을 수 없습니다."));
        if (seller.getRole() != UserRole.BUSINESS) {
            throw new ForbiddenException("사업자 회원만 상품을 등록할 수 있습니다.");
        }
        Region region = regionRepository.findById(request.getRegionId())
                .orElseThrow(() -> new NotFoundException("지역을 찾을 수 없습니다."));

        BigDecimal discountRate = request.getDiscountRate() != null
                ? request.getDiscountRate().setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        int calculatedDiscountPrice = (int) Math.round(
                request.getOriginalPrice() * (1 - discountRate.doubleValue() / 100));

        int totalQty = request.getTotalQuantity() != null ? request.getTotalQuantity() : 1;
        int perPersonLmt = request.getPerPersonLimit() != null ? request.getPerPersonLimit() : totalQty;
        if (totalQty < 1) {
            throw new BadRequestException("총 판매 수량은 1개 이상이어야 합니다.");
        }
        if (perPersonLmt < 1 || perPersonLmt > totalQty) {
            throw new BadRequestException("1인당 구매 제한은 1개 이상, 총 판매 수량 이하로 설정해주세요.");
        }

        Product product = Product.builder()
                .seller(seller)
                .region(region)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .defectReason(request.getDefectReason())
                .originalPrice(request.getOriginalPrice())
                .discountPrice(calculatedDiscountPrice)
                .discountRate(discountRate)
                .pickupPlace(request.getPickupPlace())
                .pickupStartAt(request.getPickupStartAt())
                .pickupEndAt(request.getPickupEndAt())
                .expiresAt(request.getExpiresAt())
                .timeSale(request.getTimeSale() != null && request.getTimeSale())
                .totalQuantity(totalQty)
                .perPersonLimit(perPersonLmt)
                .remainingQuantity(totalQty)
                .timedDiscountRate1(request.getTimedDiscountRate1() != null ? request.getTimedDiscountRate1() : 0)
                .timedDiscountRate2(request.getTimedDiscountRate2() != null ? request.getTimedDiscountRate2() : 0)
                .build();

        productRepository.save(product);

        if (request.getPickupEndAt() != null
                && (request.getTimedDiscountRate1() != null && request.getTimedDiscountRate1() > 0
                || request.getTimedDiscountRate2() != null && request.getTimedDiscountRate2() > 0)) {
            discountQueueService.scheduleDiscount(product.getId(), request.getPickupEndAt());
        }

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
                .orElseThrow(() -> new NotFoundException("상품을 찾을 수 없습니다."));

        if (!product.getSeller().getId().equals(userId)) {
            throw new ForbiddenException("수정 권한이 없습니다.");
        }
        Region region = request.getRegionId() != null
                ? regionRepository.findById(request.getRegionId())
                .orElseThrow(() -> new NotFoundException("지역을 찾을 수 없습니다."))
                : product.getRegion();

        BigDecimal updateDiscountRate = request.getDiscountRate() != null
                ? request.getDiscountRate().setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        int updateDiscountPrice = (int) Math.round(
                request.getOriginalPrice() * (1 - updateDiscountRate.doubleValue() / 100));

        product.update(request, region);
        product.setDiscountPrice(updateDiscountPrice);
        product.setDiscountRate(updateDiscountRate);
        return buildResponse(product);
    }

    // 단건: 상품 상세용
    private ProductResponse buildResponse(Product product) {
        List<String> imageUrls = productImageRepository
                .findByProductIdOrderBySortOrder(product.getId())
                .stream().map(ProductImage::getImageUrl).collect(Collectors.toList());
        ProductResponse response = ProductResponse.from(product, imageUrls);
        response.setReviewStats(
                reviewRepository.countByProductId(product.getId()),
                reviewRepository.findAverageRatingByProductId(product.getId()));
        return response;
    }

    // 배치: 목록용 N+1 해소
    private List<ProductResponse> buildResponses(List<Product> products) {
        if (products.isEmpty()) return List.of();

        List<Long> ids = products.stream().map(Product::getId).collect(Collectors.toList());

        Map<Long, List<String>> imageMap = productImageRepository
                .findByProductIdInOrderBySortOrder(ids)
                .stream()
                .collect(Collectors.groupingBy(
                        pi -> pi.getProduct().getId(),
                        Collectors.mapping(ProductImage::getImageUrl, Collectors.toList())
                ));

        Map<Long, Long> countMap = new HashMap<>();
        reviewRepository.countByProductIdIn(ids)
                .forEach(row -> countMap.put((Long) row[0], (Long) row[1]));

        Map<Long, Double> avgMap = new HashMap<>();
        reviewRepository.findAverageRatingByProductIdIn(ids)
                .forEach(row -> avgMap.put((Long) row[0], (Double) row[1]));

        return products.stream().map(p -> {
            ProductResponse res = ProductResponse.from(
                    p, imageMap.getOrDefault(p.getId(), List.of()));
            res.setReviewStats(
                    countMap.getOrDefault(p.getId(), 0L),
                    avgMap.getOrDefault(p.getId(), 0.0));
            return res;
        }).collect(Collectors.toList());
    }

    // 상품 검색
    public List<ProductResponse> searchProducts(String keyword) {
        List<Product> products = productRepository.searchByKeyword(
                keyword + "%",
                "%" + keyword + "%"
        );
        return buildResponses(products);
    }

    // 상품 상태 변경
    @Transactional
    public void updateProductStatus(Long userId, Long productId, ProductStatus status) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("상품을 찾을 수 없습니다."));

        if (!product.getSeller().getId().equals(userId)) {
            throw new ForbiddenException("권한이 없습니다.");
        }

        if (product.getStatus().equals(ProductStatus.SOLD_OUT)) {
            throw new BadRequestException("재고 소진된 상품은 상태를 변경할 수 없습니다.");
        }

        product.updateStatus(status);
    }

    // 상품 삭제 - RESERVED 상태만 삭제 불가
    @Transactional
    public void deleteProduct(Long userId, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("상품을 찾을 수 없습니다."));

        if (!product.getSeller().getId().equals(userId)) {
            throw new ForbiddenException("삭제 권한이 없습니다.");
        }

        if (product.getStatus().equals(ProductStatus.RESERVED)) {
            throw new BadRequestException("예약 중인 상품은 삭제할 수 없습니다.");
        }

        // 연관 데이터 삭제 순서 (FK 제약 위반 방지)
        // 1. 이 상품의 예약에 달린 알림 삭제
        List<Reservation> reservations = reservationRepository.findByProductId(productId);
        List<Long> reservationIds = reservations.stream().map(Reservation::getId).collect(Collectors.toList());
        if (!reservationIds.isEmpty()) {
            notificationRepository.deleteByReservationIdIn(reservationIds);
            reviewRepository.deleteByReservationIdIn(reservationIds);
        }

        // 2. 이 상품에 직접 달린 알림 삭제
        notificationRepository.deleteByProductId(productId);

        // 3. 예약 삭제
        reservationRepository.deleteAll(reservations);

        // 4. 비밀 댓글 삭제
        secretCommentRepository.deleteByProductId(productId);

        // 5. 이미지 삭제
        productImageRepository.deleteByProductId(productId);

        // 6. 상품 삭제
        productRepository.delete(product);
    }
}