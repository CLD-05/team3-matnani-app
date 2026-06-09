import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, PackageCheck, Star, Store, UserRound } from "lucide-react";
import { fetchSellerReviews } from "../api/reviews";

const fallbackReviewSeeds = [
  {
    buyerName: "믿음",
    buyerRegion: "동림동",
    createdAt: "2달 전",
    content: "상품 상태가 설명과 같고 픽업 시간도 잘 맞춰주셨어요.",
  },
  {
    buyerName: "나팔",
    buyerRegion: "성수동",
    createdAt: "5달 전",
    content: "이른 시간에도 약속 장소까지 와주셔서 감사했어요.",
  },
  {
    buyerName: "호날두FAN",
    buyerRegion: "망원동",
    createdAt: "5달 전",
    content: "제가 잠시 연락이 늦었는데도 기다려주셔서 감사했습니다!",
  },
  {
    buyerName: "메시",
    buyerRegion: "연남동",
    createdAt: "7달 전",
    content: "친절하게 설명해주셔서 안심하고 거래할 수 있었어요.",
  },
];

export function SellerProfilePage({ sellerName, products, onNavigate }) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [reviewTab, setReviewTab] = useState("all");
  const [sellerReviews, setSellerReviews] = useState([]);

  useEffect(() => {
    if (!sellerName) return;
    fetchSellerReviews(sellerName)
      .then((data) =>
        setSellerReviews(
          data.map((review) => ({
            id: review.id,
            buyerName: review.buyerName,
            buyerRegion: "맛난이 동네",
            createdAt: review.createdAt,
            content: review.content,
            rating: review.rating,
            type: "seller",
          })),
        ),
      )
      .catch(() => {});
  }, [sellerName]);

  const sellerProducts = useMemo(
    () => products.filter((product) => product.seller === sellerName),
    [products, sellerName],
  );

  const visibleProducts = showAllProducts ? sellerProducts : sellerProducts.slice(0, 3);
  const visibleReviews = reviewTab === "buyer" ? [] : sellerReviews;

  return (
    <section className="seller-profile-page">
      <button className="back-button" type="button" onClick={() => onNavigate("/market")}>
        <ChevronLeft size={20} />
        장터로 돌아가기
      </button>

      <div className="seller-profile-card">
        <div className="seller-profile-avatar">
          <UserRound size={44} />
        </div>
        <div>
          <span className="eyebrow">판매자 프로필</span>
          <h1>{sellerName}</h1>
          <p>
            판매물품 {sellerProducts.length}개 · 받은 후기 {sellerReviews.length}개
          </p>
        </div>
        <span className="seller-profile-rating">
          <Star size={15} fill="currentColor" />
          {getAverageRating(sellerReviews)}
        </span>
      </div>

      <section className="seller-section">
        <div className="seller-section-head">
          <div>
            <span className="eyebrow">판매물품</span>
            <h2>{sellerProducts.length}개</h2>
          </div>
          {sellerProducts.length > 3 && (
            <button type="button" onClick={() => setShowAllProducts((prev) => !prev)}>
              {showAllProducts ? "대표만 보기" : "전체 판매 목록 보기"}
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        {sellerProducts.length === 0 ? (
          <div className="seller-empty">
            <PackageCheck size={34} />
            <strong>등록된 판매물품이 없습니다.</strong>
          </div>
        ) : (
          <div className={showAllProducts ? "seller-product-list full" : "seller-product-list"}>
            {visibleProducts.map((product) => (
              <button
                className="seller-product-tile"
                type="button"
                key={product.id}
                onClick={() => onNavigate(`/products/${product.id}`)}
              >
                <span className={`status-badge ${product.statusTone}`}>{product.status}</span>
                <img src={product.image} alt={product.title} />
                <strong>{product.title}</strong>
                <small>{product.price}</small>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="seller-review-section">
        <div className="seller-review-title">
          <Store size={28} />
          <h2>거래 후기 상세</h2>
        </div>

        <div className="seller-review-tabs" aria-label="후기 유형">
          <button
            className={reviewTab === "all" ? "active" : ""}
            type="button"
            onClick={() => setReviewTab("all")}
          >
            전체 후기
          </button>
          <button
            className={reviewTab === "seller" ? "active" : ""}
            type="button"
            onClick={() => setReviewTab("seller")}
          >
            판매자 후기
          </button>
          <button
            className={reviewTab === "buyer" ? "active" : ""}
            type="button"
            onClick={() => setReviewTab("buyer")}
          >
            구매자 후기
          </button>
        </div>

        <div className="seller-review-count">후기 {visibleReviews.length}개</div>
        <div className="seller-review-list">
          {visibleReviews.length === 0 && (
            <div className="seller-empty">
              <PackageCheck size={34} />
              <strong>아직 표시할 후기가 없습니다.</strong>
            </div>
          )}
          {visibleReviews.map((review) => (
            <article className="seller-review-item" key={review.id}>
              <span className="reviewer-avatar">
                <UserRound size={30} />
              </span>
              <div>
                <strong>{review.buyerName}</strong>
                <span>
                  {review.buyerRegion} · {review.createdAt}
                </span>
                <p>{review.content}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function getAverageRating(reviews) {
  if (reviews.length === 0) return "0.0";
  const avg = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length;
  return avg.toFixed(1);
}
