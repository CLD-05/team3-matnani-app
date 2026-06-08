const productStatusByReservation = {
  ACCEPTED: { status: "예약중", statusTone: "reserved" },
  CANCELED: { status: "판매중", statusTone: "sale" },
  COMPLETED: { status: "판매완료", statusTone: "soldout" },
};

export async function createReservation({ product, buyer }) {
  return {
    reservation: {
      id: Date.now(),
      productId: product.id,
      buyerName: buyer.nickname,
      sellerName: product.seller,
      requestedAt: "방금 전",
      pickupTime: product.pickup.replace(" 픽업", ""),
      status: "REQUESTED",
    },
    productStatus: { status: "예약중", statusTone: "reserved" },
  };
}

export async function updateReservationStatus(reservation, nextStatus) {
  return {
    reservationId: reservation.id,
    nextStatus,
    productId: reservation.productId,
    productStatus: productStatusByReservation[nextStatus] || null,
  };
}
