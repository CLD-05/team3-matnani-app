package com.example.matnani.dto.response;

import com.example.matnani.domain.entity.User;
import lombok.Getter;
import java.util.List;

@Getter
public class SellerProfileResponse {
    private Long id;
    private String nickname;
    private String regionName;
    private List<ProductResponse> products;
    private List<ReviewResponse> reviews;
    private int reviewCount;

    public static SellerProfileResponse from(User seller,
                                             List<ProductResponse> products,
                                             List<ReviewResponse> reviews) {
        SellerProfileResponse res = new SellerProfileResponse();
        res.id = seller.getId();
        res.nickname = seller.getNickname();
        res.regionName = seller.getRegion() != null ? seller.getRegion().getName() : null;
        res.products = products;
        res.reviews = reviews;
        res.reviewCount = reviews.size();
        return res;
    }
}
