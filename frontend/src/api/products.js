import client from "./client";
import {
  getRegionDong,
  getRegionId,
  getRegionLabelById,
  normalizeRegionLabel,
} from "../utils/regions";

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

const PRODUCT_REGION_OVERRIDES_KEY = "matnaniProductRegionOverrides";

function loadProductRegionOverrides() {
  try {
    const saved = localStorage.getItem(PRODUCT_REGION_OVERRIDES_KEY);
    const parsed = saved ? JSON.parse(saved) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function getProductRegionOverride(productId) {
  if (!productId) return "";
  return loadProductRegionOverrides()[String(productId)] || "";
}

function rememberProductRegion(productId, regionLabel) {
  if (!productId || !regionLabel) return;

  try {
    const overrides = loadProductRegionOverrides();
    overrides[String(productId)] = normalizeRegionLabel(regionLabel);
    localStorage.setItem(PRODUCT_REGION_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch {
    // localStorage가 막힌 환경에서는 API 응답 값만 사용합니다.
  }
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

export function normalizeProduct(p, fallback = {}) {
  const productId = p.id ?? fallback.id;
  const savedRegionLabel = getProductRegionOverride(productId);
  const regionLabel = normalizeRegionLabel(
    savedRegionLabel ||
    fallback.regionName ||
    fallback.regionLabel ||
    fallback.region ||
    p.regionName ||
    p.regionLabel ||
    p.region ||
    (p.regionId ? getRegionLabelById(p.regionId) : "") ||
    (fallback.regionId ? getRegionLabelById(fallback.regionId) : ""),
  );

  return {
    id: productId,
    seller: p.sellerNickname || p.seller || fallback.sellerNickname || fallback.seller,
    sellerId: p.sellerId ?? fallback.sellerId,
    title: p.title ?? fallback.title,
    description: p.description ?? fallback.description,
    category: CATEGORY_LABEL[p.category] || p.category || fallback.category,
    defectReason: p.defectReason || fallback.defectReason,
    price: formatPrice(p.discountPrice ?? fallback.priceValue ?? fallback.discountPrice),
    priceValue: p.discountPrice ?? fallback.priceValue ?? fallback.discountPrice,
    originalPrice: formatPrice(p.originalPrice ?? fallback.originalPriceValue ?? fallback.originalPrice),
    originalPriceValue: p.originalPrice ?? fallback.originalPriceValue ?? fallback.originalPrice,
    discount: p.discountRate
      ? Math.round(p.discountRate)
      : fallback.discount
        ? Math.round(fallback.discount)
        : 0,
    image:
      p.imageUrls?.[0] ||
      p.image ||
      fallback.imageUrls?.[0] ||
      fallback.image ||
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=900&q=80",
    imageUrls: p.imageUrls || fallback.imageUrls || [],
    status: STATUS_LABEL[p.status] || p.status || fallback.status,
    statusTone: STATUS_TONE[p.status] || fallback.statusTone || "sale",
    region: getRegionDong(regionLabel),
    regionLabel,
    regionName: regionLabel,
    pickup: p.pickup || fallback.pickup || formatPickup(p.pickupStartAt, p.pickupEndAt),
    pickupPlace: p.pickupPlace ?? fallback.pickupPlace,
    pickupStartAt: p.pickupStartAt ?? fallback.pickupStartAt,
    pickupEndAt: p.pickupEndAt ?? fallback.pickupEndAt,
    expiresAt: p.expiresAt ?? fallback.expiresAt,
    expiresInMinutes: (p.expiresAt ?? fallback.expiresAt)
      ? Math.max(0, Math.round((new Date(p.expiresAt ?? fallback.expiresAt) - Date.now()) / 60000))
      : fallback.expiresInMinutes || 0,
    activeReservation: p.activeReservation || fallback.activeReservation || null,
    createdAt: p.createdAt ?? fallback.createdAt,
    createdMinutes: fallback.createdMinutes || 0,
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
  const createdProduct = normalizeProduct(response.data.data || {}, { ...payload, regionId: request.regionId });
  rememberProductRegion(createdProduct.id, payload.regionLabel);
  return { ...createdProduct, regionLabel: normalizeRegionLabel(payload.regionLabel), regionName: normalizeRegionLabel(payload.regionLabel), region: getRegionDong(payload.regionLabel) };
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
  const normalizedUpdates = normalizeProduct(response.data.data || {}, { ...updates, id: productId, regionId: request.regionId });
  if (updates.regionLabel) {
    rememberProductRegion(productId, updates.regionLabel);
    normalizedUpdates.regionLabel = normalizeRegionLabel(updates.regionLabel);
    normalizedUpdates.regionName = normalizeRegionLabel(updates.regionLabel);
    normalizedUpdates.region = getRegionDong(updates.regionLabel);
  }

  return {
    productId,
    updates: normalizedUpdates,
  };
}

export async function deleteProduct(productId) {
  await client.delete(`/api/products/${productId}`);
  return { productId };
}
