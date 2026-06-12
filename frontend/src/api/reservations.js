import client from "./client";

// 예약 상태에 따른 상품 상태 변경
const productStatusByReservation = {
  REQUESTED: { status: "예약중", statusTone: "reserved" },
  ACCEPTED: { status: "예약중", statusTone: "reserved" },
  CANCELED: { status: "판매중", statusTone: "sale" },
  COMPLETED: { status: "판매완료", statusTone: "soldout" },
};

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

function normalizeReservation(r, fallbackProduct = null) {
  const product = r.product || r.productResponse || r.productDto || fallbackProduct;
  const productId = r.productId || r.product_id || product?.id || fallbackProduct?.id;

  return {
    id: r.id,
    productId,
    productTitle: r.productTitle || r.title || product?.title || fallbackProduct?.title,
    product: product || fallbackProduct,
    buyerName: r.buyerNickname || r.buyerName,
    sellerName: r.sellerNickname || r.sellerName || product?.seller || fallbackProduct?.seller,
    requestedAt: formatRelativeTime(r.reservedAt),
    pickupTime: r.pickupTime || product?.pickupWindow || product?.pickup || fallbackProduct?.pickup || "-",
    status: r.status,
    finalPrice: r.finalPrice,
    quantity: r.quantity || 1,
  };
}

function getProductStatus(product, remainingQuantity) {
  if (remainingQuantity <= 0) {
    return { status: "판매완료", statusTone: "soldout", remainingQuantity: 0 };
  }

  return { status: "판매중", statusTone: "sale", remainingQuantity };
}

// 예약 생성
export async function createReservation({ product, quantity = 1 }) {
  const response = await client.post(`/api/products/${product.id}/reservations`, { quantity });
  const reservation = normalizeReservation(response.data.data, product);
  const remainingQuantity = Math.max(
    0,
    Number(product.remainingQuantity ?? product.totalQuantity ?? 1) - Number(reservation.quantity || quantity),
  );

  return {
    reservation,
    productStatus: getProductStatus(product, remainingQuantity),
  };
}

// 예약 상태 변경
export async function updateReservationStatus(reservation, nextStatus) {
  const response = await client.patch(`/api/reservations/${reservation.id}/status`, {
    status: nextStatus,
  });
  const updated = normalizeReservation(response.data.data, reservation.product);
  const productStatus = nextStatus === "CANCELED" && reservation.product
    ? getProductStatus(
      reservation.product,
      Number(reservation.product.remainingQuantity ?? 0) + Number(updated.quantity || reservation.quantity || 1),
    )
    : null;

  return {
    reservationId: updated.id,
    reservation: updated,
    nextStatus,
    productId: updated.productId || reservation.productId,
    productStatus,
  };
}

// 내 예약 내역 (구매자 - 내가 예약한 것들)
export async function fetchMyReservations() {
  const response = await client.get("/api/reservations/me");
  return (response.data.data || []).map(normalizeReservation);
}

// 내 판매 예약 내역 (판매자 - 내 상품에 들어온 예약들)
export async function fetchMySellerReservations() {
  const response = await client.get("/api/reservations/me/seller");
  return (response.data.data || []).map(normalizeReservation);
}
