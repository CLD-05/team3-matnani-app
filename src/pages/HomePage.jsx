import React from "react";
import { HomeSection } from "../components/HomeSection";
import { ProductCard } from "../components/ProductCard";

function getNumericValue(value) {
  if (typeof value === "number") return value;
  return Number(String(value || "").replace(/[^0-9.-]/g, "")) || 0;
}

function getDeadlineMinutes(product) {
  const deadlineAt = product.pickupEndAt || product.pickupStartAt;

  if (deadlineAt) {
    const minutes = Math.round((new Date(deadlineAt).getTime() - Date.now()) / 60000);
    return Number.isFinite(minutes) ? Math.max(0, minutes) : Number.MAX_SAFE_INTEGER;
  }

  return getNumericValue(product.deadlineInMinutes ?? product.expiresInMinutes);
}

function isOnSale(product) {
  return product.statusTone === "sale";
}

export function HomePage({ products, onNavigate }) {
  const onSaleProducts = products.filter(isOnSale);
  const recommendedProducts = products
    .filter(isOnSale)
    .sort((a, b) => Number(b.rating) - Number(a.rating))
    .slice(0, 4);
  const urgentProducts = onSaleProducts
    .filter((product) => getDeadlineMinutes(product) > 0)
    .sort((a, b) => getDeadlineMinutes(a) - getDeadlineMinutes(b))
    .slice(0, 4);
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
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onNavigate(`/products/${product.id}`)}
            />
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
            <ProductCard
              key={product.id}
              product={product}
              compact
              onClick={() => onNavigate(`/products/${product.id}`)}
            />
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
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onNavigate(`/products/${product.id}`)}
            />
          ))}
        </div>
      </HomeSection>
    </>
  );
}
