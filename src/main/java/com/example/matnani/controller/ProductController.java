package com.example.matnani.controller;

import com.example.matnani.dto.request.ProductRequest;
import com.example.matnani.dto.response.ApiResponse;
import com.example.matnani.dto.response.ProductResponse;
import com.example.matnani.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // 홈 피드
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProducts(@RequestParam Long regionId) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductsByRegion(regionId)));
    }

    // 타임세일
    @GetMapping("/time-sale")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getTimeSale(@RequestParam Long regionId) {
        return ResponseEntity.ok(ApiResponse.success(productService.getTimeSaleProducts(regionId)));
    }

    // 상품 상세
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProduct(id)));
    }

    // 상품 등록
    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ProductRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(productService.createProduct(userId, request), "상품 등록 성공"));
    }

    // 상품 수정
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody ProductRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(productService.updateProduct(userId, id, request)));
    }

    // 상품 검색
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> searchProducts(@RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.success(productService.searchProducts(q)));
    }

    // 상품 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = Long.parseLong(userDetails.getUsername());
        productService.deleteProduct(userId, id);
        return ResponseEntity.ok(ApiResponse.success(null, "삭제 완료"));
    }
}