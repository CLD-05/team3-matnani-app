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

function matchesRegion(product, selectedRegion) {
  if (!selectedRegion || selectedRegion.id === null) return true;
  if (product.regionId && String(product.regionId) === String(selectedRegion.id)) return true;
  const name = selectedRegion.name;
  return [product.region, product.regionName, product.regionLabel]
    .filter(Boolean)
    .some((r) => r === name || String(r).includes(name));
}

export function HomePage({ products, selectedRegion, onNavigate }) {
  const regionName = selectedRegion?.id !== null && selectedRegion?.name
    ? selectedRegion.name
    : null;

  const regionProducts = products.filter((p) => matchesRegion(p, selectedRegion));
  const onSaleProducts = regionProducts.filter(isOnSale);

  const recommendedProducts = regionProducts
    .filter(
      (product) =>
        Number(product.remainingQuantity ?? 0) > 0 &&
        (Number(product.reservedQuantity || 0) > 0 || Number(product.completedQuantity || 0) > 0),
    )
    .sort((a, b) => {
      const bActivity = Number(b.reservedQuantity || 0) + Number(b.completedQuantity || 0);
      const aActivity = Number(a.reservedQuantity || 0) + Number(a.completedQuantity || 0);
      return bActivity - aActivity || Number(b.rating) - Number(a.rating);
    })
    .slice(0, 4);

  const urgentProducts = onSaleProducts
    .filter((product) => getDeadlineMinutes(product) > 0)
    .sort((a, b) => getDeadlineMinutes(a) - getDeadlineMinutes(b))
    .slice(0, 4);

  const timeSaleProducts = onSaleProducts
    .filter((product) => product.timeSale)
    .sort((a, b) => getDeadlineMinutes(a) - getDeadlineMinutes(b))
    .slice(0, 6);

  const previewProducts = regionProducts.slice(0, 4);

  const heroKicker = regionName ? `${regionName} 픽업 장터` : "내 동네 픽업 장터";
  const heroTitle = regionName
    ? `${regionName}에서 만나는 못난이 식품 특가`
    : "내 동네에서 만나는 못난이 식품 특가";

  return (
    <>
      <section className="hero" aria-label="맛난이 소개">
        <div className="hero-copy">
          <span className="eyebrow">{heroKicker}</span>
          <h1>{heroTitle}</h1>
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

      {timeSaleProducts.length > 0 && (
        <HomeSection
          kicker="타임특가"
          title="지금 안사면 후회하는 진짜 타임특가"
          actionLabel="타임특가 보러가기"
          onAction={() => onNavigate("/market")}
        >
          <div className="product-grid">
            {timeSaleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onNavigate(`/products/${product.id}`)}
              />
            ))}
          </div>
        </HomeSection>
      )}

      {recommendedProducts.length > 0 && (
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
      )}

      <HomeSection
        kicker="마감 임박 상품"
        title="오늘 안에 픽업하면 더 좋아요"
        actionLabel="마감임박순 보기"
        onAction={() => onNavigate("/market")}
      >
        <div className="urgent-strip">
          {urgentProducts.length > 0 ? (
            urgentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                compact
                onClick={() => onNavigate(`/products/${product.id}`)}
              />
            ))
          ) : (
            <p style={{ color: "#9ba49b", fontWeight: 800 }}>
              {regionName ? `${regionName}의 마감 임박 상품이 없습니다.` : "마감 임박 상품이 없습니다."}
            </p>
          )}
        </div>
      </HomeSection>

      <HomeSection
        kicker="상품 미리보기"
        title={regionName ? `${regionName} 장터에 올라온 상품` : "맛난이 장터에 올라온 상품"}
        actionLabel="전체 상품 보기"
        onAction={() => onNavigate("/market")}
      >
        <div className="product-grid">
          {previewProducts.length > 0 ? (
            previewProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onNavigate(`/products/${product.id}`)}
              />
            ))
          ) : (
            <p style={{ color: "#9ba49b", fontWeight: 800 }}>
              {regionName ? `${regionName}에 등록된 상품이 없습니다.` : "등록된 상품이 없습니다."}
            </p>
          )}
        </div>
      </HomeSection>
    </>
  );
}
