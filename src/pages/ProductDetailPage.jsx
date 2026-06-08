import React, { useState } from "react";
import {
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Star,
  Timer,
  UserRound,
} from "lucide-react";
import { formatTimeLeft } from "../utils/time";

const defectReasonLabels = {
  SHAPE_BAD: "모양 이상",
  NEAR_EXPIRY: "유통기한 임박",
  SCRATCH: "흠집",
  ETC: "기타",
};

const sampleComments = [
  {
    id: 1,
    writer: "맛난이회원",
    writerId: "맛난이회원",
    content: "오늘 저녁 7시에 픽업 가능할까요?",
    createdAt: "방금 전",
    replies: [
      {
        id: 101,
        writer: "판매자",
        content: "네, 7시 픽업 가능합니다. 예약 후 방문해주세요.",
        createdAt: "1분 전",
      },
    ],
  },
  {
    id: 2,
    writer: "문의한사람2",
    writerId: "문의한사람2",
    content: "당근 크기가 많이 작은 편인가요?",
    createdAt: "5분 전",
    replies: [
      {
        id: 102,
        writer: "판매자",
        content: "일반 상품보다 조금 작지만 조리용으로 쓰기 좋습니다.",
        createdAt: "3분 전",
      },
    ],
  },
];

export function ProductDetailPage({
  product,
  currentUser,
  onNavigate,
  onReserve,
  onDeleteProduct,
}) {
  const [message, setMessage] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [replyInput, setReplyInput] = useState("");
  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState(sampleComments);

  if (!product) {
    return (
      <section className="detail-empty">
        <h1>상품을 찾을 수 없습니다.</h1>
        <button className="auth-submit" type="button" onClick={() => onNavigate("/market")}>
          장터로 돌아가기
        </button>
      </section>
    );
  }

  const isOnSale = product.status === "판매중";
  const isReserved = product.status === "예약중";
  const isSoldOut = product.status === "판매완료";
  const isSeller = currentUser?.nickname === product.seller;
  const canUseSecretComments = Boolean(currentUser);
  const currentNickname = currentUser?.nickname || "";
  const visibleComments = comments.filter(
    (comment) => isSeller || comment.writerId === currentNickname,
  );
  const defectReason = product.defectReason
    ? defectReasonLabels[product.defectReason]
    : product.title.includes("김치") || product.title.includes("빵")
      ? "유통기한 임박"
      : "모양 이상";

  const handleReserve = () => {
    if (!currentUser) {
      onNavigate("/login");
      return;
    }
    if (isSeller) {
      setMessage("본인이 등록한 상품은 예약할 수 없습니다.");
      return;
    }
    if (!isOnSale) return;
    onReserve(product.id, currentUser);
    setMessage("예약 요청이 완료되었습니다.");
  };

  const handleDeleteProduct = () => {
    if (!isOnSale) {
      setMessage("판매중 상태인 상품만 삭제할 수 있습니다.");
      return;
    }

    if (!window.confirm("이 상품을 삭제할까요?")) return;

    onDeleteProduct(product.id);
    onNavigate("/market");
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (!commentInput.trim()) return;
    setComments((prev) => [
      {
        id: Date.now(),
        writer: currentNickname,
        writerId: currentNickname,
        content: commentInput.trim(),
        createdAt: "방금 전",
        replies: [],
      },
      ...prev,
    ]);
    setCommentInput("");
  };

  const handleReplySubmit = (event, commentId) => {
    event.preventDefault();
    const targetComment = comments.find((comment) => comment.id === commentId);
    const canReply =
      isSeller || (targetComment && targetComment.writerId === currentNickname);

    if (!canReply || !replyInput.trim()) return;

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: Date.now(),
                  writer: isSeller ? "판매자" : currentNickname,
                  content: replyInput.trim(),
                  createdAt: "방금 전",
                },
              ],
            }
          : comment,
      ),
    );
    setReplyInput("");
    setActiveReplyCommentId(null);
  };

  return (
    <section className="detail-page">
      <button className="back-button" type="button" onClick={() => onNavigate("/market")}>
        <ChevronLeft size={20} />
        장터로 돌아가기
      </button>

      <div className="detail-layout">
        <div className="detail-gallery">
          <img src={product.image} alt={product.title} />
          <span className={`status-badge ${product.statusTone}`}>{product.status}</span>
        </div>

        <div className="detail-summary">
          <p className="seller">{product.seller}</p>
          <h1>{product.title}</h1>
          <div className="detail-meta">
            <span>
              <MapPin size={16} />
              {product.region}
            </span>
            <span>
              <CalendarClock size={16} />
              {product.pickup}
            </span>
            <span>
              <Timer size={16} />
              {formatTimeLeft(product.expiresInMinutes)}
            </span>
          </div>

          <div className="detail-price-box">
            <span className="original">{product.originalPrice}</span>
            <div>
              <span className="discount">{product.discount}%</span>
              <strong>{product.price}</strong>
            </div>
          </div>

          <dl className="detail-info-grid">
            <div>
              <dt>카테고리</dt>
              <dd>{product.category}</dd>
            </div>
            <div>
              <dt>못난이 사유</dt>
              <dd>{defectReason}</dd>
            </div>
            <div>
              <dt>픽업 장소</dt>
              <dd>{product.pickupPlace || `${product.region} 주민센터 앞`}</dd>
            </div>
            <div>
              <dt>유통기한</dt>
              <dd>{formatTimeLeft(product.expiresInMinutes)} 남음</dd>
            </div>
          </dl>

          <button
            className="seller-card seller-card-button"
            type="button"
            onClick={() => onNavigate(`/sellers/${encodeURIComponent(product.seller)}`)}
          >
            <UserRound size={34} />
            <div>
              <strong>{product.seller}</strong>
              <span>{product.region} · 후기 {product.reviews}개</span>
            </div>
            <span className="rating">
              <Star size={15} fill="currentColor" />
              {product.rating}
            </span>
          </button>

          {isSeller && (
            <div className="seller-management">
              <div className="seller-management-actions">
                <button
                  className="reservation-ghost-button"
                  type="button"
                  onClick={() => onNavigate(`/products/${product.id}/edit`)}
                >
                  상품 수정
                </button>
                <button
                  className="reservation-danger-button"
                  type="button"
                  disabled={!isOnSale}
                  onClick={handleDeleteProduct}
                >
                  상품 삭제
                </button>
              </div>
              {!isOnSale && (
                <p className="seller-management-guide">
                  예약중이거나 판매완료된 상품은 삭제할 수 없습니다.
                </p>
              )}
            </div>
          )}

          {message && <p className="form-success">{message}</p>}

          <div className="detail-actions">
            <button
              className="reserve-button"
              type="button"
              disabled={!isOnSale}
              onClick={handleReserve}
            >
              {isOnSale && "예약하기"}
              {isReserved && "예약중"}
              {isSoldOut && "판매완료"}
            </button>
          </div>
        </div>
      </div>

      <div className="detail-sections">
        <section className="detail-card">
          <h2>상품 설명</h2>
          <p>
            {product.description ||
              "외형은 조금 아쉽지만 품질에는 문제가 없는 상품입니다. 픽업 가능 시간을 확인한 뒤 예약해주세요."}
          </p>
          <div className="safe-note">
            <ShieldCheck size={18} />
            예약 후 판매자와 픽업 시간을 다시 확인하면 더 안전합니다.
          </div>

          <button
            className={commentsOpen ? "secret-comment-toggle open" : "secret-comment-toggle"}
            type="button"
            aria-expanded={commentsOpen}
            onClick={() => setCommentsOpen((prev) => !prev)}
          >
            <span>
              <MessageSquareText size={18} />
              비밀 댓글
              <strong>{visibleComments.length}</strong>
            </span>
            <ChevronDown size={18} />
          </button>

          {commentsOpen && (
            <div className="secret-comment-panel">
              <div className="secret-comment-head">
                <div>
                  <h3>비밀 댓글</h3>
                  <p>작성자 본인과 상품 판매자만 볼 수 있습니다.</p>
                </div>
                <span>{visibleComments.length}개</span>
              </div>
              {!currentUser && (
                <div className="secret-locked">
                  <ShieldCheck size={20} />
                  <div>
                    <strong>로그인 후 문의할 수 있습니다.</strong>
                    <span>다른 사용자의 비밀 댓글 내용은 공개되지 않습니다.</span>
                  </div>
                  <button type="button" onClick={() => onNavigate("/login")}>
                    로그인
                  </button>
                </div>
              )}
              {canUseSecretComments && (
                <>
                  {!isSeller && (
                    <form className="comment-form" onSubmit={handleCommentSubmit}>
                      <input
                        type="text"
                        placeholder="픽업 시간이나 상품 상태를 문의해보세요."
                        value={commentInput}
                        onChange={(event) => setCommentInput(event.target.value)}
                      />
                      <button type="submit">문의</button>
                    </form>
                  )}
                  <div className="secret-scope">
                    {isSeller
                      ? "판매자 화면: 이 상품에 달린 구매자 문의를 확인하고 답글을 남길 수 있습니다."
                      : "구매자 화면: 내가 남긴 문의와 판매자 답글만 확인할 수 있습니다."}
                  </div>
                  {isSeller && (
                    <div className="seller-reply-guide">
                      구매자 문의의 답글 달기 버튼을 눌러 판매자 답글을 작성하세요.
                    </div>
                  )}
                  <div className="comment-list">
                    {visibleComments.length === 0 && (
                      <p className="comment-empty">아직 내가 남긴 비밀 문의가 없습니다.</p>
                    )}
                    {visibleComments.map((comment) => (
                      <article className="comment-thread" key={comment.id}>
                        <div className="comment-item">
                          <div>
                            <strong>{comment.writer}</strong>
                            <span>{comment.createdAt}</span>
                          </div>
                          <p>{comment.content}</p>
                          {(isSeller || comment.writerId === currentNickname) && (
                            <div className="comment-toolbar">
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveReplyCommentId((prev) =>
                                    prev === comment.id ? null : comment.id,
                                  )
                                }
                              >
                                답글
                              </button>
                            </div>
                          )}
                        </div>
                        {(isSeller || comment.writerId === currentNickname) &&
                          activeReplyCommentId === comment.id && (
                          <form
                            className="reply-form"
                            onSubmit={(event) => handleReplySubmit(event, comment.id)}
                          >
                            <input
                              type="text"
                              placeholder={
                                isSeller
                                  ? `${comment.writer}님에게 답글을 남겨보세요.`
                                  : "내 문의에 추가 내용을 남겨보세요."
                              }
                              value={replyInput}
                              onChange={(event) => setReplyInput(event.target.value)}
                            />
                            <button type="submit">등록</button>
                          </form>
                        )}
                        {comment.replies.map((reply) => (
                          <div className="comment-reply" key={reply.id}>
                            <div>
                              <strong>{reply.writer} 답글</strong>
                              <span>{reply.createdAt}</span>
                            </div>
                            <p>{reply.content}</p>
                          </div>
                        ))}
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
