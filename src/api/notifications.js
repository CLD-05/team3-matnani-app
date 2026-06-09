import client from "./client";

// 알림 타입 → 한국어 라벨
const TYPE_LABEL = {
  RESERVATION:   "예약",
  STATUS_CHANGE: "예약상태",
};

// 예약 상태 → 알림 메시지
const STATUS_MESSAGE = {
  ACCEPTED:  "예약이 수락되었습니다.",
  CANCELED:  "예약이 취소되었습니다.",
  COMPLETED: "거래가 완료되었습니다.",
  REQUESTED: "새 예약 요청이 들어왔습니다.",
};

function buildContent(type, productTitle, reservationStatus) {
  const title = productTitle ? `[${productTitle}] ` : "";
  if (type === "RESERVATION") {
    return `${title}새 예약 요청이 들어왔습니다.`;
  }
  const statusMsg = STATUS_MESSAGE[reservationStatus] || "예약 상태가 변경되었습니다.";
  return `${title}${statusMsg}`;
}

function buildTargetPath(type, reservationStatus) {
  if (type === "RESERVATION") return "/mypage/sales";
  if (type === "STATUS_CHANGE" && reservationStatus === "COMPLETED") return "/mypage/purchases";
  return "/mypage/reservations";
}

// 알림 클릭 시 이동할 탭 (판매 내역용)
function buildTargetTab(type) {
  if (type === "RESERVATION") return "reserved";
  return null;
}

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

function normalizeNotification(n) {
  const typeStr = typeof n.type === "string" ? n.type : String(n.type);
  return {
    id: n.id,
    type: TYPE_LABEL[typeStr] || typeStr,
    actorName: n.actorNickname || "",
    actorAvatar: "",
    receivedAt: formatRelativeTime(n.createdAt),
    content: buildContent(typeStr, n.productTitle, n.reservationStatus),
    targetPath: buildTargetPath(typeStr, n.reservationStatus),
    targetTab: buildTargetTab(typeStr),
    unread: !n.isRead,
    reservationId: n.reservationId,
    productId: n.productId,
  };
}

// 내 알림 목록 조회
export async function fetchMyNotifications() {
  const response = await client.get("/api/notifications");
  return (response.data.data || []).map(normalizeNotification);
}

// 알림 설정 (프론트 전용 - 백엔드 없음)
export async function updateNotificationSetting(enabled) {
  return enabled;
}

// 단건 읽음
export async function markNotificationAsRead(notificationId) {
  await client.patch(`/api/notifications/${notificationId}/read`);
  return { notificationId };
}

// 전체 읽음
export async function markAllNotificationsAsRead() {
  await client.patch("/api/notifications/read-all");
  return true;
}

// 선택 삭제
export async function deleteNotifications(notificationIds) {
  await client.delete("/api/notifications", { data: notificationIds });
  return [...notificationIds];
}

// 전체 삭제
export async function deleteAllNotifications() {
  await client.delete("/api/notifications/all");
  return true;
}
