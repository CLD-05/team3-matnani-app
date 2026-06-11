package com.example.matnani.service;

import com.example.matnani.domain.entity.*;
import com.example.matnani.dto.response.*;
import com.example.matnani.repository.*;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
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
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        return UserResponse.from(user);
    }

    // 동네 변경
    @Transactional
    public UserResponse updateRegion(Long userId, Long regionId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        Region region = regionRepository.findById(regionId)
                .orElseThrow(() -> new RuntimeException("지역을 찾을 수 없습니다."));

        user.updateRegion(region);
        return UserResponse.from(user);
    }

    // 판매자 프로필 조회
    public SellerProfileResponse getSellerProfile(Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        List<ProductResponse> products = productRepository
                .findBySellerId(sellerId)
                .stream()
                .filter(p -> p.getStatus() == ProductStatus.ON_SALE)
                .map(p -> {
                    List<String> imageUrls = productImageRepository
                            .findByProductIdOrderBySortOrder(p.getId())
                            .stream()
                            .map(ProductImage::getImageUrl)
                            .collect(Collectors.toList());
                    return ProductResponse.from(p, imageUrls);
                })
                .collect(Collectors.toList());

        List<ReviewResponse> reviews = reservationRepository
                .findBySellerId(sellerId)
                .stream()
                .map(r -> reviewRepository.findByReservationId(r.getId()))
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .map(ReviewResponse::from)
                .collect(Collectors.toList());

        return SellerProfileResponse.from(seller, products, reviews);
    }
}