import React from "react";
import { ChevronLeft, PackageCheck, Star } from "lucide-react";

export function ReceivedReviewsPage({ currentUser, reviews, onNavigate }) {
  if (!currentUser) {
    return (
      <section className="detail-empty">
        <h1>로그인이 필요한 화면입니다.</h1>
        <button className="auth-submit" type="button" onClick={() => onNavigate("/login")}>
          로그인하러 가기
        </button>
      </section>
    );
  }

  const receivedReviews = reviews.filter((review) => review.sellerName === currentUser.nickname);

  return (
    <section className="review-list-page">
      <button className="back-button" type="button" onClick={() => onNavigate("/mypage")}>
        <ChevronLeft size={20} />
        마이페이지로 돌아가기
      </button>

      <div className="review-list-head">
        <div>
          <span className="eyebrow">내게 달린 후기</span>
          <h1>구매자가 남긴 후기를 확인하세요</h1>
          <p>내 판매 상품 거래 후 받은 후기와 별점을 모아봅니다.</p>
        </div>
        <div className="history-counter">
          <strong>{receivedReviews.length}</strong>
          <span>받은 후기</span>
        </div>
      </div>

      <div className="review-list">
        {receivedReviews.length === 0 ? (
          <div className="reservation-empty">
            <PackageCheck size={38} />
            <strong>아직 받은 후기가 없습니다.</strong>
            <p>판매 거래가 완료되고 구매자가 후기를 작성하면 이곳에 표시됩니다.</p>
            <button
              className="auth-link-button"
              type="button"
              onClick={() => onNavigate("/mypage/sales")}
            >
              판매 내역 보기
            </button>
          </div>
        ) : (
          receivedReviews.map((review) => (
            <ReceivedReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
    </section>
  );
}

function ReceivedReviewCard({ review }) {
  return (
    <article className="review-card">
      <div className="review-card-header">
        <div>
          <p className="seller">{review.buyerName} 구매자</p>
          <strong className="review-product-title">{review.productTitle}</strong>
        </div>
      </div>

      <div className="review-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            fill={star <= review.rating ? "currentColor" : "none"}
            className={star <= review.rating ? "star-filled" : "star-empty"}
          />
        ))}
        <span className="review-rating-text">{review.rating}.0</span>
      </div>
      <p className="review-content">{review.content}</p>
      <span className="review-date">{review.createdAt}</span>
    </article>
  );
}
