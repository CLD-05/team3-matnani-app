import client from "./client";

function formatRelativeTime(isoString) {
  if (!isoString) return "-";
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "어제";
  return `${days}일 전`;
}

function normalizeReview(r) {
  return {
    id: r.id,
    reservationId: r.reservationId,
    productId: r.productId,
    productTitle: r.productTitle,
    buyerName: r.buyerNickname,
    sellerName: r.sellerNickname,
    rating: r.rating,
    content: r.content,
    createdAt: formatRelativeTime(r.createdAt),
  };
}

// 내가 쓴 후기 + 내가 받은 후기 (중복 제거 후 합산)
export async function fetchMyReviews() {
  const [written, received] = await Promise.all([
    client.get("/api/reviews/me"),
    client.get("/api/reviews/me/received"),
  ]);
  const seen = new Set();
  return [
    ...(written.data.data || []),
    ...(received.data.data || []),
  ]
    .filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    })
    .map(normalizeReview);
}

// 특정 판매자 후기 목록 (판매자 프로필 페이지용)
export async function fetchSellerReviews(nickname) {
  const response = await client.get(`/api/reviews/seller/${encodeURIComponent(nickname)}`);
  return (response.data.data || []).map(normalizeReview);
}

// 후기 작성
export async function createReview({ reservationId, rating, content }) {
  const response = await client.post(`/api/reservations/${reservationId}/reviews`, {
    rating,
    content,
  });
  return normalizeReview(response.data.data);
}

// 후기 수정
export async function updateReview(reviewId, updates) {
  const response = await client.patch(`/api/reviews/${reviewId}`, {
    rating: updates.rating,
    content: updates.content,
  });
  return {
    reviewId,
    updates: normalizeReview(response.data.data),
  };
}

// 후기 삭제
export async function deleteReview(reviewId) {
  await client.delete(`/api/reviews/${reviewId}`);
  return { reviewId };
}
