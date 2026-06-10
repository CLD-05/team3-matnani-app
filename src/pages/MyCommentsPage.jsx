import React, { useMemo } from "react";
import { ChevronLeft, MessageSquareText, PackageCheck } from "lucide-react";

const legacySampleCommentIds = new Set([1, 2]);

function getCommentsStorageKey(productId) {
  return `matnaniComments:${productId}`;
}

function loadProductComments(product) {
  try {
    const savedComments = localStorage.getItem(getCommentsStorageKey(product.id));
    const parsedComments = savedComments ? JSON.parse(savedComments) : [];
    if (!Array.isArray(parsedComments)) return [];

    return parsedComments
      .filter((comment) => !legacySampleCommentIds.has(comment.id))
      .map((comment) => {
        const replies = Array.isArray(comment.replies) ? comment.replies : [];
        const lastReply = replies.at(-1);

        return {
          id: `${product.id}-${comment.id}`,
          productId: product.id,
          productTitle: product.title,
          sellerName: product.seller,
          writerName: comment.writerId || comment.writer,
          content: comment.content,
          createdAt: comment.createdAt || "",
          status: replies.length > 0 ? "답글 완료" : "답글 대기",
          lastReply: lastReply?.content || "",
        };
      });
  } catch {
    return [];
  }
}

export function MyCommentsPage({ currentUser, products = [], onNavigate }) {
  const comments = useMemo(() => {
    if (!currentUser) return [];

    return products
      .flatMap(loadProductComments)
      .filter(
        (comment) =>
          comment.writerName === currentUser.nickname ||
          comment.sellerName === currentUser.nickname,
      )
      .sort((a, b) => String(b.id).localeCompare(String(a.id)));
  }, [currentUser, products]);

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
