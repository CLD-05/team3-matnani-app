import React from "react";
import { ChevronLeft, MessageSquareText, PackageCheck } from "lucide-react";
import { myComments } from "../data/activity";

export function MyCommentsPage({ currentUser, onNavigate }) {
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

  const comments = myComments.filter(
    (comment) =>
      comment.writerName === currentUser.nickname || comment.sellerName === currentUser.nickname,
  );

  return (
    <section className="activity-page">
      <button className="back-button" type="button" onClick={() => onNavigate("/mypage")}>
        <ChevronLeft size={20} />
        마이페이지로 돌아가기
      </button>

      <div className="activity-head">
        <div>
          <span className="eyebrow">내가 등록한 댓글</span>
          <h1>내 문의와 답글을 모아 확인하세요</h1>
          <p>비밀 댓글은 내가 작성했거나 내 상품에 달린 문의만 표시됩니다.</p>
        </div>
        <MessageSquareText size={44} />
      </div>

      <div className="comment-history-list">
        {comments.length === 0 && (
          <div className="reservation-empty">
            <PackageCheck size={38} />
            <strong>아직 등록한 댓글이 없습니다.</strong>
            <p>상품 상세에서 비밀 댓글을 남기면 이곳에 표시됩니다.</p>
            <button className="auth-link-button" type="button" onClick={() => onNavigate("/market")}>
              장터 둘러보기
            </button>
          </div>
        )}
        {comments.map((comment) => (
          <article className="comment-history-card" key={comment.id}>
            <div>
              <span className={comment.status === "답글 완료" ? "comment-state done" : "comment-state"}>
                {comment.status}
              </span>
              <h2>{comment.productTitle}</h2>
              <p>{comment.content}</p>
              {comment.lastReply && <blockquote>{comment.lastReply}</blockquote>}
            </div>
            <div className="comment-history-meta">
              <span>{comment.createdAt}</span>
              <button type="button" onClick={() => onNavigate(`/products/${comment.productId}`)}>
                상품 상세
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
