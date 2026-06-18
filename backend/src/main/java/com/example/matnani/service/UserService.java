package com.example.matnani.service;

import com.example.matnani.domain.entity.*;
import com.example.matnani.dto.response.*;
import com.example.matnani.repository.*;
import static com.example.matnani.domain.enums.Enums.*;
import com.example.matnani.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RegionRepository regionRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;

    // 내 정보 조회
    public UserResponse getMyInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("유저를 찾을 수 없습니다."));
        return UserResponse.from(user);
    }

    // 동네 변경
    @Transactional
    public UserResponse updateRegion(Long userId, Long regionId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("유저를 찾을 수 없습니다."));
        Region region = regionRepository.findById(regionId)
                .orElseThrow(() -> new NotFoundException("지역을 찾을 수 없습니다."));

        user.updateRegion(region);
        return UserResponse.from(user);
    }

    // 판매자 프로필 조회
    public SellerProfileResponse getSellerProfile(Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new NotFoundException("유저를 찾을 수 없습니다."));

        // 상품 목록 한 번 조회
        List<Product> sellerProducts = productRepository.findBySellerId(sellerId)
                .stream()
                .filter(p -> p.getStatus() == ProductStatus.ON_SALE)
                .collect(Collectors.toList());

        // 이미지 한 번에 조회 후 상품별로 그룹핑
        Map<Long, List<String>> imageMap = productImageRepository
                .findByProductSellerIdOrderBySortOrder(sellerId)
                .stream()
                .collect(Collectors.groupingBy(
                        pi -> pi.getProduct().getId(),
                        Collectors.mapping(ProductImage::getImageUrl, Collectors.toList())
                ));

        List<ProductResponse> products = sellerProducts.stream()
                .map(p -> ProductResponse.from(p, imageMap.getOrDefault(p.getId(), List.of())))
                .collect(Collectors.toList());

        // 후기 한 번에 조회
        List<ReviewResponse> reviews = reviewRepository.findByReservationSellerId(sellerId)
                .stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());

        return SellerProfileResponse.from(seller, products, reviews);
    }
}