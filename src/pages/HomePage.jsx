import React from "react";
import { HomeSection } from "../components/HomeSection";
import { ProductCard } from "../components/ProductCard";

export function HomePage({ products, onNavigate }) {
  const recommendedProducts = products
    .filter((product) => product.status === "판매중")
    .sort((a, b) => Number(b.rating) - Number(a.rating))
    .slice(0, 4);
  const urgentProducts = products
    .filter((product) => product.expiresInMinutes <= 180)
    .sort((a, b) => a.expiresInMinutes - b.expiresInMinutes);
  const previewProducts = products.slice(0, 4);

  return (
    <>
      <section className="hero" aria-label="맛난이 소개">
        <div className="hero-copy">
          <span className="eyebrow">서울 동네 픽업 장터</span>
          <h1>서울 동네에서 만나는 못난이 식품 특가</h1>
          <p>오늘 픽업 가능한 신선한 상품을 가까운 동네에서 예약하세요.</p>
          <div className="hero-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => onNavigate("/market")}
            >
              장터 둘러보기
            </button>
            <span className="discount-badge">최대 60% 할인</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80"
            alt=""
          />
        </div>
      </section>

      <HomeSection
        kicker="추천 상품"
        title="동네에서 반응 좋은 상품"
        actionLabel="장터 보기"
        onAction={() => onNavigate("/market")}
      >
        <div className="product-grid">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </HomeSection>

      <HomeSection
        kicker="마감 임박 상품"
        title="오늘 안에 픽업하면 더 좋아요"
        actionLabel="마감임박순 보기"
        onAction={() => onNavigate("/market")}
      >
        <div className="urgent-strip">
          {urgentProducts.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </HomeSection>

      <HomeSection
        kicker="상품 미리보기"
        title="맛난이 장터에 올라온 상품"
        actionLabel="전체 상품 보기"
        onAction={() => onNavigate("/market")}
      >
        <div className="product-grid">
          {previewProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </HomeSection>
    </>
  );
}
