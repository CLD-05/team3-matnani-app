export const reservationStatuses = {
  REQUESTED: {
    label: "예약 요청",
    tone: "requested",
    buyerText: "판매자 수락을 기다리고 있어요.",
    sellerText: "구매자의 예약 요청을 확인해주세요.",
  },
  ACCEPTED: {
    label: "예약 수락",
    tone: "accepted",
    buyerText: "예약이 확정되었습니다. 픽업 시간에 방문해주세요.",
    sellerText: "예약을 수락했습니다. 픽업 준비를 진행해주세요.",
  },
  CANCELED: {
    label: "예약 취소",
    tone: "canceled",
    buyerText: "예약이 취소되었습니다.",
    sellerText: "취소된 예약입니다.",
  },
  COMPLETED: {
    label: "거래 완료",
    tone: "completed",
    buyerText: "거래가 완료되었습니다.",
    sellerText: "거래가 완료되었습니다.",
  },
  NO_SHOW: {
    label: "노쇼",
    tone: "canceled",
    buyerText: "노쇼로 처리되어 일정 기간 구매가 제한될 수 있습니다.",
    sellerText: "노쇼 처리된 예약입니다.",
  },
};

export const initialReservations = [
  {
    id: 1001,
    productId: 2,
    buyerName: "맛난이회원",
    sellerName: "연남 베이커리",
    requestedAt: "오늘 14:20",
    pickupTime: "오늘 18:00",
    status: "REQUESTED",
  },
  {
    id: 1002,
    productId: 8,
    buyerName: "맛난이회원",
    sellerName: "망원 빵집",
    requestedAt: "어제 19:10",
    pickupTime: "어제 20:00",
    status: "COMPLETED",
  },
  {
    id: 1003,
    productId: 9,
    buyerName: "성수이웃",
    sellerName: "맛난이회원",
    requestedAt: "어제 15:40",
    pickupTime: "어제 17:30",
    status: "COMPLETED",
  },
  {
    id: 1004,
    productId: 10,
    buyerName: "성수직장인",
    sellerName: "맛난이회원",
    requestedAt: "오늘 12:10",
    pickupTime: "오늘 18:30",
    status: "REQUESTED",
  },
];
