import React, { useState } from "react";
import { ChevronLeft, PackageCheck, Pencil, Star, Trash2 } from "lucide-react";

export function MyReviewsPage({
  currentUser,
  reviews,
  onNavigate,
  onUpdateReview,
  onDeleteReview,
}) {
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

  const myReviews = reviews.filter((review) => review.buyerName === currentUser.nickname);

  return (
    <section className="review-list-page">
      <button className="back-button" type="button" onClick={() => onNavigate("/mypage")}>
        <ChevronLeft size={20} />
        마이페이지로 돌아가기
      </button>

      <div className="review-list-head">
        <div>
          <span className="eyebrow">내가 쓴 후기</span>
          <h1>작성한 후기를 확인하세요</h1>
          <p>거래 후 작성한 후기를 수정하거나 삭제할 수 있습니다.</p>
        </div>
        <div className="history-counter">
          <strong>{myReviews.length}</strong>
          <span>작성한 후기</span>
        </div>
      </div>

      <div className="review-list">
        {myReviews.length === 0 ? (
          <div className="reservation-empty">
            <PackageCheck size={38} />
            <strong>아직 작성한 후기가 없습니다.</strong>
            <p>거래 완료 후 구매 내역에서 후기를 작성할 수 있습니다.</p>
            <button
              className="auth-link-button"
              type="button"
              onClick={() => onNavigate("/mypage/purchases")}
            >
              구매 내역 보기
            </button>
          </div>
        ) : (
          myReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onUpdateReview={onUpdateReview}
              onDeleteReview={onDeleteReview}
            />
          ))
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review, onUpdateReview, onDeleteReview }) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(review.content);
  const [editRating, setEditRating] = useState(review.rating);
  const [hovered, setHovered] = useState(0);

  const handleSave = () => {
    if (editContent.trim().length < 5) return;
    onUpdateReview(review.id, { rating: editRating, content: editContent.trim() });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditContent(review.content);
    setEditRating(review.rating);
    setEditing(false);
  };

  return (
    <article className="review-card">
      <div className="review-card-header">
        <div>
          <p className="seller">{review.sellerName} 판매</p>
          <strong className="review-product-title">{review.productTitle}</strong>
        </div>
        <div className="review-card-actions">
          <button
            className="review-icon-button"
            type="button"
            title="후기 수정"
            onClick={() => setEditing((value) => !value)}
          >
            <Pencil size={16} />
          </button>
          <button
            className="review-icon-button danger"
            type="button"
            title="후기 삭제"
            onClick={() => onDeleteReview(review.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="review-edit-form">
          <div className="star-rating small">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-button ${star <= (hovered || editRating) ? "active" : ""}`}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setEditRating(star)}
                aria-label={`${star}점`}
              >
                <Star size={24} fill={star <= (hovered || editRating) ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          <textarea
            className="review-textarea"
            value={editContent}
            onChange={(event) => setEditContent(event.target.value)}
            maxLength={500}
          />
          <div className="review-edit-buttons">
            <button className="reservation-ghost-button" type="button" onClick={handleCancel}>
              취소
            </button>
            <button className="reservation-primary-button" type="button" onClick={handleSave}>
              저장
            </button>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </article>
  );
}
