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
                .map(product -> {
                    List<String> imageUrls = productImageRepository
                            .findByProductIdOrderBySortOrder(product.getId())
                            .stream().map(ProductImage::getImageUrl).collect(Collectors.toList());
                    return ProductResponse.from(product, imageUrls);
                })
                .collect(Collectors.toList());
    }

    // 타임세일
    public List<ProductResponse> getTimeSaleProducts(Long regionId) {
        return productRepository
                .findByRegionIdAndStatus(regionId, ProductStatus.ON_SALE)
                .stream()
                .filter(p -> p.getExpiresAt() != null)
                .sorted((a, b) -> a.getExpiresAt().compareTo(b.getExpiresAt()))
                .map(product -> {
                    List<String> imageUrls = productImageRepository
                            .findByProductIdOrderBySortOrder(product.getId())
                            .stream().map(ProductImage::getImageUrl).collect(Collectors.toList());
                    return ProductResponse.from(product, imageUrls);
                })
                .collect(Collectors.toList());
    }

    // 상품 상세
    public ProductResponse getProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        List<String> imageUrls = productImageRepository
                .findByProductIdOrderBySortOrder(productId)
                .stream().map(ProductImage::getImageUrl).collect(Collectors.toList());

        return ProductResponse.from(product, imageUrls);
    }

    // 상품 등록 - 사업자만 가능
    @Transactional
    public ProductResponse createProduct(Long userId, ProductRequest request) {
        User seller = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 사업자만 판매 가능
        if (seller.getRole() != UserRole.BUSINESS) {
            throw new RuntimeException("사업자 회원만 상품을 등록할 수 있습니다.");
        }

        Region region = regionRepository.findById(request.getRegionId())
                .orElseThrow(() -> new RuntimeException("지역을 찾을 수 없습니다."));

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

        List<String> imageUrls = request.getImageUrls() != null ? request.getImageUrls() : List.of();
        return ProductResponse.from(product, imageUrls);
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

        List<String> imageUrls = productImageRepository
                .findByProductIdOrderBySortOrder(productId)
                .stream().map(ProductImage::getImageUrl).collect(Collectors.toList());

        return ProductResponse.from(product, imageUrls);
    }

    // 상품 검색
    public List<ProductResponse> searchProducts(String keyword) {
        return productRepository.searchByKeyword(keyword)
                .stream()
                .map(product -> {
                    List<String> imageUrls = productImageRepository
                            .findByProductIdOrderBySortOrder(product.getId())
                            .stream().map(ProductImage::getImageUrl).collect(Collectors.toList());
                    return ProductResponse.from(product, imageUrls);
                })
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

        if (product.getStatus().equals(ProductStatus.SOLD_OUT)) {
            throw new RuntimeException("재고 소진된 상품은 상태를 변경할 수 없습니다.");
        }

        product.updateStatus(status);
    }

    // 상품 삭제 - RESERVED 상태만 삭제 불가
    @Transactional
    public void deleteProduct(Long userId, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        if (!product.getSeller().getId().equals(userId)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        // 재고 기반 시스템 - RESERVED 상태는 없으므로 항상 삭제 가능
        productImageRepository.deleteByProductId(productId);
        productRepository.delete(product);
    }
}