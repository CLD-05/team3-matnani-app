import React, { useState } from "react";
import { ChevronLeft, Star } from "lucide-react";

export function ReviewNewPage({
  reservationId,
  currentUser,
  products,
  reservations,
  reviews,
  onNavigate,
  onAddReview,
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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

  const reservation = reservations.find((item) => item.id === reservationId);
  const product = reservation
    ? products.find((item) => item.id === reservation.productId)
    : null;
  const alreadyReviewed = reviews.some((review) => review.reservationId === reservationId);

  if (!reservation || reservation.status !== "COMPLETED") {
    return (
      <section className="detail-empty">
        <h1>후기를 작성할 수 없는 예약입니다.</h1>
        <p>거래 완료된 예약에만 후기를 작성할 수 있습니다.</p>
        <button
          className="auth-link-button"
          type="button"
          onClick={() => onNavigate("/mypage/purchases")}
        >
          구매 내역으로 돌아가기
        </button>
      </section>
    );
  }

  if (reservation.buyerName !== currentUser.nickname) {
    return (
      <section className="detail-empty">
        <h1>후기 작성 권한이 없습니다.</h1>
        <button className="auth-link-button" type="button" onClick={() => onNavigate("/mypage")}>
          마이페이지로 돌아가기
        </button>
      </section>
    );
  }

  if (alreadyReviewed) {
    return (
      <section className="detail-empty">
        <h1>이미 후기를 작성한 거래입니다.</h1>
        <button
          className="auth-link-button"
          type="button"
          onClick={() => onNavigate("/mypage/reviews")}
        >
          내가 쓴 후기 보기
        </button>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className="review-submitted">
        <div className="review-submitted-inner">
          <span className="review-submitted-icon">⭐</span>
          <h1>후기가 등록되었습니다!</h1>
          <p>소중한 후기 감사합니다.</p>
          <div className="review-submitted-actions">
            <button
              className="reservation-ghost-button"
              type="button"
              onClick={() => onNavigate("/mypage/reviews")}
            >
              내가 쓴 후기 보기
            </button>
            <button
              className="auth-submit"
              type="button"
              onClick={() => onNavigate("/mypage/purchases")}
            >
              구매 내역으로
            </button>
          </div>
        </div>
      </section>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (rating === 0) {
      setError("별점을 선택해주세요.");
      return;
    }
    if (content.trim().length < 5) {
      setError("후기 내용을 5자 이상 입력해주세요.");
      return;
    }
    setError("");
    onAddReview({
      id: Date.now(),
      reservationId,
      productId: reservation.productId,
      productTitle: product?.title || "삭제된 상품",
      sellerName: reservation.sellerName,
      buyerName: currentUser.nickname,
      rating,
      content: content.trim(),
      createdAt: "방금 전",
    });
    setSubmitted(true);
  };

  const ratingLabels = ["", "별로예요", "그저 그래요", "괜찮아요", "좋아요", "최고예요!"];

  return (
    <section className="review-page">
      <button
        className="back-button"
        type="button"
        onClick={() => onNavigate("/mypage/purchases")}
      >
        <ChevronLeft size={20} />
        구매 내역으로 돌아가기
      </button>

      <div className="review-head">
        <div>
          <span className="eyebrow">후기 작성</span>
          <h1>거래는 어떠셨나요?</h1>
          <p>솔직한 후기가 다른 구매자에게 큰 도움이 됩니다.</p>
        </div>
        <Star size={46} fill="currentColor" />
      </div>

      {product && (
        <div className="review-product-preview">
          <div className="review-product-image">
            <img src={product.image} alt={product.title} />
          </div>
          <div className="review-product-info">
            <p className="seller">{reservation.sellerName} 판매</p>
            <strong>{product.title}</strong>
            <span>거래 금액 {product.price}</span>
          </div>
        </div>
      )}

      <form className="review-form" onSubmit={handleSubmit}>
        <div className="review-rating-section">
          <span className="review-section-label">별점</span>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-button ${star <= (hovered || rating) ? "active" : ""}`}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                aria-label={`${star}점`}
              >
                <Star size={36} fill={star <= (hovered || rating) ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          {(hovered || rating) > 0 && (
            <p className="rating-label">{ratingLabels[hovered || rating]}</p>
          )}
        </div>

        <label className="review-content-label">
          <span className="review-section-label">후기 내용</span>
          <textarea
            className="review-textarea"
            placeholder="상품 상태, 픽업 경험 등을 자유롭게 적어주세요. (5자 이상)"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={500}
          />
          <span className="review-char-count">{content.length} / 500</span>
        </label>

        {error && <p className="form-message">{error}</p>}

        <button className="auth-submit" type="submit">
          후기 등록하기
        </button>
      </form>
    </section>
  );
}
