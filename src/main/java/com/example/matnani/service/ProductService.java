// ProductService.java
package com.example.matnani.service;

import com.example.matnani.domain.entity.*;
import com.example.matnani.dto.request.ProductRequest;
import com.example.matnani.dto.response.ProductResponse;
import com.example.matnani.repository.*;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final RegionRepository regionRepository;
    private final UserRepository userRepository;

    // 홈 피드 - 지역 기반 상품 목록
    public List<ProductResponse> getProductsByRegion(Long regionId) {
        return productRepository
                .findByRegionIdAndStatus(regionId, ProductStatus.ON_SALE)
                .stream()
                .map(product -> {
                    List<String> imageUrls = productImageRepository
                            .findByProductIdOrderBySortOrder(product.getId())
                            .stream()
                            .map(ProductImage::getImageUrl)
                            .collect(Collectors.toList());
                    return ProductResponse.from(product, imageUrls);
                })
                .collect(Collectors.toList());
    }

    // 타임세일 - expires_at 임박 상품
    public List<ProductResponse> getTimeSaleProducts(Long regionId) {
        return productRepository
                .findByRegionIdAndStatus(regionId, ProductStatus.ON_SALE)
                .stream()
                .filter(p -> p.getExpiresAt() != null)
                .sorted((a, b) -> a.getExpiresAt().compareTo(b.getExpiresAt()))
                .map(product -> {
                    List<String> imageUrls = productImageRepository
                            .findByProductIdOrderBySortOrder(product.getId())
                            .stream()
                            .map(ProductImage::getImageUrl)
                            .collect(Collectors.toList());
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
                .stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());
        return ProductResponse.from(product, imageUrls);
    }

    // 상품 등록
    @Transactional
    public ProductResponse createProduct(Long userId, ProductRequest request) {
        User seller = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        Region region = regionRepository.findById(request.getRegionId())
                .orElseThrow(() -> new RuntimeException("지역을 찾을 수 없습니다."));

        Product product = Product.builder()
                .seller(seller)
                .region(region)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .defectReason(request.getDefectReason())
                .originalPrice(request.getOriginalPrice())
                .discountPrice(request.getDiscountPrice())
                .discountRate(request.getDiscountRate())
                .pickupPlace(request.getPickupPlace())
                .pickupStartAt(request.getPickupStartAt())
                .pickupEndAt(request.getPickupEndAt())
                .expiresAt(request.getExpiresAt())
                .build();

        productRepository.save(product);
        return ProductResponse.from(product, List.of());
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
                .stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        return ProductResponse.from(product, imageUrls);
    }

    // 상품 검색
    public List<ProductResponse> searchProducts(String keyword) {
        return productRepository.searchByKeyword(keyword)
                .stream()
                .map(product -> {
                    List<String> imageUrls = productImageRepository
                            .findByProductIdOrderBySortOrder(product.getId())
                            .stream()
                            .map(ProductImage::getImageUrl)
                            .collect(Collectors.toList());
                    return ProductResponse.from(product, imageUrls);
                })
                .collect(Collectors.toList());
    }

    // 상품 삭제
    @Transactional
    public void deleteProduct(Long userId, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        if (!product.getSeller().getId().equals(userId)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        productImageRepository.deleteByProductId(productId);
        productRepository.delete(product);
    }
}