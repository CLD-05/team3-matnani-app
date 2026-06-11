import React, { useEffect, useState } from "react";
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
import { createSecretComment, fetchSecretComments } from "../api/comments";
import { fetchProduct } from "../api/products";
import { fetchSellerReviews } from "../api/reviews";
import { formatTimeLeft } from "../utils/time";

const defectReasonLabels = {
  SHAPE_BAD: "모양 이상",
  NEAR_EXPIRY: "유통기한 임박",
  SCRATCH: "흠집",
  ETC: "기타",
};

const legacySampleCommentIds = new Set([1, 2]);

function getCommentsStorageKey(productId) {
  return `matnaniComments:${productId}`;
}

function loadSavedComments(productId) {
  try {
    const savedComments = localStorage.getItem(getCommentsStorageKey(productId));
    const parsedComments = savedComments ? JSON.parse(savedComments) : [];
    if (!Array.isArray(parsedComments)) return [];
    return parsedComments.filter((comment) => !legacySampleCommentIds.has(comment.id));
  } catch {
    return [];
  }
}

function formatDiscount(discount) {
  const numericDiscount = Number(String(discount ?? 0).replace(/[^0-9.-]/g, ""));
  return `${Number.isFinite(numericDiscount) ? numericDiscount : 0}%`;
}

function getMinutesUntil(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 0;
  return Math.max(0, Math.round((date.getTime() - Date.now()) / 60000));
}

function getCommentSortValue(comment) {
  if (comment.rawCreatedAt) {
    const time = new Date(comment.rawCreatedAt).getTime();
    if (Number.isFinite(time)) return time;
  }

  return Number(comment.id) || 0;
}

function isSellerComment(comment, product) {
  return Boolean(comment.isSeller) || comment.writer === "판매자" || comment.writer === product?.seller;
}

function buildCommentThreads(comments, product, isSellerView, currentNickname) {
  const threads = [];
  const threadById = new Map();
  const sortedComments = [...comments].sort(
    (a, b) => getCommentSortValue(a) - getCommentSortValue(b),
  );

  sortedComments.forEach((comment) => {
    if (comment.parentCommentId) {
      const targetThread = threadById.get(comment.parentCommentId);
      if (targetThread) {
        targetThread.replies.push({
          id: comment.id,
          writer: comment.writer,
          writerId: comment.writerId,
          content: comment.content,
          createdAt: comment.createdAt,
        });
      }
      return;
    }

    if (isSellerComment(comment, product)) {
      const targetThread = threads[threads.length - 1];
      if (targetThread) {
        targetThread.replies.push({
          id: comment.id,
          writer: comment.writer,
          writerId: comment.writerId,
          content: comment.content,
          createdAt: comment.createdAt,
        });
      }
      return;
    }

    const thread = {
      ...comment,
      replies: Array.isArray(comment.replies) ? [...comment.replies] : [],
    };
    threads.push(thread);
    threadById.set(comment.id, thread);
  });

  return threads
    .filter((comment) => isSellerView || comment.writerId === currentNickname)
    .reverse();
}

export function ProductDetailPage({
  productId,
  product: initialProduct,
  currentUser,
  onNavigate,
  onReserve,
  onDeleteProduct,
}) {
  const [product, setProduct] = useState(initialProduct);
  const [sellerReviews, setSellerReviews] = useState([]);
  const [message, setMessage] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [replyInput, setReplyInput] = useState("");
  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState(() => loadSavedComments(productId));
  const [reserveQuantity, setReserveQuantity] = useState(1);
  const [myReservedQuantity, setMyReservedQuantity] = useState(0);
  const [nowTick, setNowTick] = useState(Date.now());

  // URL의 ID로 항상 최신 상품 데이터를 가져옴
  useEffect(() => {
    if (!productId) return;
    fetchProduct(productId)
      .then((fetchedProduct) =>
        setProduct((prev) => ({
          ...fetchedProduct,
          reservedQuantity: prev?.reservedQuantity ?? initialProduct?.reservedQuantity ?? 0,
          completedQuantity: prev?.completedQuantity ?? initialProduct?.completedQuantity ?? 0,
        })),
      )
      .catch(() => {});
  }, [initialProduct?.completedQuantity, initialProduct?.reservedQuantity, productId]);

  useEffect(() => {
    if (initialProduct) {
      setProduct((prev) => ({ ...prev, ...initialProduct }));
    }
  }, [initialProduct]);

  useEffect(() => {
    setComments(loadSavedComments(productId));
    if (!currentUser || !productId) return;
    fetchSecretComments(productId)
      .then(setComments)
      .catch(() => {});
  }, [currentUser, productId]);

  useEffect(() => {
    if (!productId) return;
    localStorage.setItem(getCommentsStorageKey(productId), JSON.stringify(comments));
  }, [comments, productId]);

  useEffect(() => {
    const timer = window.setInterval(() => setNowTick(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  // 판매자 전체 후기/별점 가져오기
  useEffect(() => {
    if (!product?.seller) return;
    fetchSellerReviews(product.seller)
      .then(setSellerReviews)
      .catch(() => {});
  }, [product?.seller]);

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

  const isOnSale = product.statusTone === "sale" || product.status === "판매중";
  const isReserved = product.statusTone === "reserved" || product.status === "예약중";
  const isSoldOut = product.statusTone === "soldout" || product.status === "판매완료";
  const isSeller = currentUser?.nickname === product.seller;
  const title = product.timeSale && !String(product.title || "").startsWith("[타임세일]")
    ? `[타임세일] ${product.title}`
    : product.title;
  const maxReserveQuantity = Math.max(
    1,
    Math.min(product.remainingQuantity || 1, product.perPersonLimit || product.remainingQuantity || 1),
  );
  const reservedQuantity = Number(product.reservedQuantity || 0);
  const completedQuantity = Number(product.completedQuantity || 0);
  const statusLabel = reservedQuantity > 0 ? `${reservedQuantity}개 예약중` : product.status;
  const statusTone = reservedQuantity > 0 ? "reserved" : product.statusTone;
  const stockLabel = `${product.remainingQuantity || 0}개 보유중${
    reservedQuantity > 0 ? ` · ${reservedQuantity}개 예약중` : ""
  }${completedQuantity > 0 ? ` · ${completedQuantity}개 판매완료` : ""}`;
  const expiresInMinutes = product.expiresAt ? getMinutesUntil(product.expiresAt) : product.expiresInMinutes;

  // 판매자 전체 통계 (개별 상품 후기가 아닌 판매자 누적 후기/별점)
  const sellerReviewCount = sellerReviews.length;
  const sellerAvgRating =
    sellerReviewCount === 0
      ? "0.0"
      : (sellerReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / sellerReviewCount).toFixed(1);
  const canUseSecretComments = Boolean(currentUser);
  const currentNickname = currentUser?.nickname || "";
  const visibleCommentThreads = buildCommentThreads(comments, product, isSeller, currentNickname);
  const defectReason = product.defectReason
    ? defectReasonLabels[product.defectReason]
    : product.title.includes("김치") || product.title.includes("빵")
      ? "유통기한 임박"
      : "모양 이상";

  const handleReserve = async () => {
    if (!currentUser) {
      onNavigate("/login");
      return;
    }
    if (isSeller) {
      setMessage("본인이 등록한 상품은 예약할 수 없습니다.");
      return;
    }
    if (!isOnSale) return;
    try {
      const result = await onReserve(product.id, currentUser, reserveQuantity);
      if (result?.productStatus) {
        setProduct((prev) => ({
          ...prev,
          ...result.productStatus,
          reservedQuantity: Number(prev?.reservedQuantity || 0) + Number(result.reservation?.quantity || reserveQuantity),
        }));
      }
      if (result?.reservation?.quantity) {
        setMyReservedQuantity(result.reservation.quantity);
      }
      setMessage("예약 요청이 완료되었습니다.");
    } catch (error) {
      setMessage("예약 요청에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleDeleteProduct = async () => {
    if (!isOnSale) {
      setMessage("판매중 상태인 상품만 삭제할 수 있습니다.");
      return;
    }

    if (!window.confirm("이 상품을 삭제할까요?")) return;

    await onDeleteProduct(product.id);
    window.alert("삭제가 완료되었습니다.");
    onNavigate("/");
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!commentInput.trim()) return;
    const content = commentInput.trim();
    setComments((prev) => [
      {
        id: Date.now(),
        writer: currentNickname,
        writerId: currentNickname,
        content,
        createdAt: "방금 전",
        replies: [],
      },
      ...prev,
    ]);
    setCommentInput("");
    try {
      const savedComment = await createSecretComment(product.id, content);
      setComments((prev) => [savedComment, ...prev.filter((comment) => comment.content !== content)]);
    } catch {
      setMessage("댓글은 임시 저장됐지만 알림 전송에 실패했습니다.");
    }
  };

  const handleReplySubmit = async (event, commentId) => {
    event.preventDefault();
    const targetComment = comments.find((comment) => comment.id === commentId);
    const canReply =
      isSeller || (targetComment && targetComment.writerId === currentNickname);

    if (!canReply || !replyInput.trim()) return;
    const content = replyInput.trim();

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
                  writerId: currentNickname,
                  content,
                  createdAt: "방금 전",
                },
              ],
            }
          : comment,
      ),
    );
    setReplyInput("");
    setActiveReplyCommentId(null);
    try {
      await createSecretComment(product.id, content, commentId);
    } catch {
      setMessage("답글은 임시 저장됐지만 알림 전송에 실패했습니다.");
    }
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
          <span className={`status-badge ${statusTone}`}>{statusLabel}</span>
        </div>

        <div className="detail-summary">
          <p className="seller">{product.seller}</p>
          <h1>{title}</h1>
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
              {formatTimeLeft(expiresInMinutes)}
            </span>
          </div>

          <div className="detail-price-box">
            <span className="original">{product.originalPrice}</span>
            <div>
              <span className="discount">{formatDiscount(product.discount)}</span>
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
              <dd>{formatTimeLeft(expiresInMinutes)} 남음</dd>
            </div>
            <div>
              <dt>구매 제한</dt>
              <dd>{stockLabel} · 1인 {product.perPersonLimit || 1}개</dd>
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
              <span>{product.region} · 후기 {sellerReviewCount}개</span>
            </div>
            <span className="rating">
              <Star size={15} fill="currentColor" />
              {sellerAvgRating}
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
            {!isSeller && isOnSale && (
              <label className="quantity-picker">
                수량
                <input
                  type="number"
                  min="1"
                  max={maxReserveQuantity}
                  value={reserveQuantity}
                  onChange={(event) => {
                    const next = Number(event.target.value) || 1;
                    setReserveQuantity(Math.max(1, Math.min(maxReserveQuantity, next)));
                  }}
                />
              </label>
            )}
            <button
              className="reserve-button"
              type="button"
              disabled={!isOnSale || myReservedQuantity > 0}
              onClick={handleReserve}
            >
              {isOnSale && (myReservedQuantity > 0 ? `${myReservedQuantity}개 예약중` : "예약하기")}
              {isReserved && `${reservedQuantity || reserveQuantity}개 예약중`}
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
              <strong>{visibleCommentThreads.length}</strong>
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
                <span>{visibleCommentThreads.length}개</span>
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
                    {visibleCommentThreads.length === 0 && (
                      <p className="comment-empty">아직 내가 남긴 비밀 문의가 없습니다.</p>
                    )}
                    {visibleCommentThreads.map((comment) => (
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
