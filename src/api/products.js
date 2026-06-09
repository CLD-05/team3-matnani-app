import client from "./client";

// ─── 상수 매핑 ───────────────────────────────────────────────

const STATUS_LABEL = {
  ON_SALE: "판매중",
  RESERVED: "예약중",
  SOLD_OUT: "판매완료",
};

const STATUS_TONE = {
  ON_SALE: "sale",
  RESERVED: "reserved",
  SOLD_OUT: "soldout",
};

const CATEGORY_LABEL = {
  BAKERY_DESSERT: "베이커리",
  PRODUCE_SEAFOOD: "농수산물",
  PROCESSED_FOOD: "가공식품",
  ETC: "기타",
};

const CATEGORY_TO_ENUM = {
  "베이커리": "BAKERY_DESSERT",
  "농수산물": "PRODUCE_SEAFOOD",
  "가공식품": "PROCESSED_FOOD",
  "기타": "ETC",
};

const REGION_ID_MAP = {
  "서울": 1, "부산": 2, "대구": 3, "인천": 4, "광주": 5,
  "대전": 6, "울산": 7, "세종": 8, "경기": 9, "강원": 10,
  "충청북": 11, "충북": 11, "충청남": 12, "충남": 12,
  "전북": 13, "전라북": 13, "전라남": 14, "전남": 14,
  "경상북": 15, "경북": 15, "경상남": 16, "경남": 16, "제주": 17,
};

function getRegionId(regionLabel = "") {
  for (const [key, id] of Object.entries(REGION_ID_MAP)) {
    if (regionLabel.includes(key)) return id;
  }
  return 1;
}

function formatPrice(value) {
  if (!value && value !== 0) return "-";
  return `${Number(value).toLocaleString()}원`;
}

function formatPickup(startAt, endAt) {
  if (!startAt) return "픽업 시간 미정";
  const fmt = (iso) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };
  return endAt ? `${fmt(startAt)} - ${fmt(endAt)} 픽업` : `${fmt(startAt)} 픽업`;
}

// ─── API 응답 → 프론트 포맷 변환 ────────────────────────────

export function normalizeProduct(p) {
  return {
    id: p.id,
    seller: p.sellerNickname,
    sellerId: p.sellerId,
    title: p.title,
    description: p.description,
    category: CATEGORY_LABEL[p.category] || p.category,
    defectReason: p.defectReason,
    price: formatPrice(p.discountPrice),
    priceValue: p.discountPrice,
    originalPrice: formatPrice(p.originalPrice),
    originalPriceValue: p.originalPrice,
    discount: p.discountRate ? `${Math.round(p.discountRate)}%` : null,
    image: p.imageUrls?.[0] || "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=900&q=80",
    imageUrls: p.imageUrls || [],
    status: STATUS_LABEL[p.status] || p.status,
    statusTone: STATUS_TONE[p.status] || "sale",
    region: p.regionName,
    regionName: p.regionName,
    pickup: formatPickup(p.pickupStartAt, p.pickupEndAt),
    pickupPlace: p.pickupPlace,
    pickupStartAt: p.pickupStartAt,
    pickupEndAt: p.pickupEndAt,
    expiresAt: p.expiresAt,
    expiresInMinutes: p.expiresAt
      ? Math.max(0, Math.round((new Date(p.expiresAt) - Date.now()) / 60000))
      : 0,
    activeReservation: p.activeReservation || null,
    createdAt: p.createdAt,
    createdMinutes: 0,
    rating: p.averageRating ? p.averageRating.toFixed(1) : "0.0",
    reviews: p.reviewCount || 0,
  };
}

// ─── API 함수 ────────────────────────────────────────────────

export async function fetchProducts(params = {}) {
  const response = await client.get("/api/products", { params });
  return (response.data.data || []).map(normalizeProduct);
}

export async function fetchProduct(id) {
  const response = await client.get(`/api/products/${id}`);
  return normalizeProduct(response.data.data);
}

export async function createProduct(payload) {
  const request = {
    regionId: getRegionId(payload.regionLabel),
    title: payload.title,
    description: payload.description,
    category: CATEGORY_TO_ENUM[payload.category] || "ETC",
    defectReason: payload.defectReason || "ETC",
    originalPrice: payload.originalPriceValue,
    discountPrice: payload.priceValue,
    discountRate: payload.originalPriceValue
      ? ((1 - payload.priceValue / payload.originalPriceValue) * 100).toFixed(1)
      : 0,
    pickupPlace: payload.pickupPlace,
    pickupStartAt: payload.pickupStartAt,
    pickupEndAt: payload.pickupEndAt,
    expiresAt: payload.expiresAt,
    imageUrls: payload.imageUrls || [payload.image].filter(Boolean),
  };
  const response = await client.post("/api/products", request);
  return normalizeProduct(response.data.data);
}

export async function updateProduct(productId, updates) {
  const request = {
    regionId: updates.regionLabel ? getRegionId(updates.regionLabel) : undefined,
    title: updates.title,
    description: updates.description,
    category: updates.category ? (CATEGORY_TO_ENUM[updates.category] || "ETC") : undefined,
    defectReason: updates.defectReason,
    originalPrice: updates.originalPriceValue,
    discountPrice: updates.priceValue,
    pickupPlace: updates.pickupPlace,
    pickupStartAt: updates.pickupStartAt,
    pickupEndAt: updates.pickupEndAt,
    expiresAt: updates.expiresAt,
    imageUrls: updates.imageUrls,
  };
  const response = await client.patch(`/api/products/${productId}`, request);
  return {
    productId,
    updates: normalizeProduct(response.data.data),
  };
}

export async function deleteProduct(productId) {
  await client.delete(`/api/products/${productId}`);
  return { productId };
}
