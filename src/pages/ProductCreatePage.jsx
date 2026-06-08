import React, { useEffect, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";
import { categories, regionOptions } from "../data/constants";
import { PageIntro } from "../components/PageIntro";
import { RegionSearchPanel } from "../components/RegionSearchPanel";

function toDateTimeLocal(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-") + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function createInitialForm() {
  const now = new Date();
  const pickupStart = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const pickupEnd = new Date(now.getTime() + 5 * 60 * 60 * 1000);
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return {
    title: "못난이 당근 1kg",
    category: "농수산물",
    defectReason: "SHAPE_BAD",
    description:
      "모양은 조금 휘었지만 신선한 당근입니다. 오늘 수확했고 흙만 가볍게 털어 포장해둘게요.",
    originalPrice: "5000",
    discountPrice: "3000",
    regionLabel: "서울 성동구 성수동",
    pickupPlace: "성수동 주민센터 앞",
    pickupStartAt: toDateTimeLocal(pickupStart),
    pickupEndAt: toDateTimeLocal(pickupEnd),
    expiresAt: toDateTimeLocal(expiresAt),
  };
}

function getNumericPrice(value) {
  if (typeof value === "number") return value;
  return Number(String(value || "").replace(/[^0-9]/g, ""));
}

function createEditForm(product) {
  const fallback = createInitialForm();
  const matchedRegion = regionOptions.find(
    (region) => region.dong === product?.region || region.label === product?.region,
  );

  return {
    ...fallback,
    title: product?.title || fallback.title,
    category: product?.category || fallback.category,
    defectReason: product?.defectReason || fallback.defectReason,
    description: product?.description || fallback.description,
    originalPrice: String(product?.originalPriceValue || getNumericPrice(product?.originalPrice) || ""),
    discountPrice: String(product?.priceValue || getNumericPrice(product?.price) || ""),
    regionLabel: matchedRegion?.label || product?.region || fallback.regionLabel,
    pickupPlace: product?.pickupPlace || fallback.pickupPlace,
    pickupStartAt: product?.pickupStartAt || fallback.pickupStartAt,
    pickupEndAt: product?.pickupEndAt || fallback.pickupEndAt,
    expiresAt: product?.expiresAt || fallback.expiresAt,
  };
}

function formatDateTimeLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const targetStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDiff = Math.round((targetStart - todayStart) / (24 * 60 * 60 * 1000));
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const dayLabel =
    dayDiff === 0
      ? "오늘"
      : dayDiff === 1
        ? "내일"
        : `${date.getMonth() + 1}월 ${date.getDate()}일`;

  return `${dayLabel} ${hours}:${minutes}`;
}

function getMinutesUntil(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 0;
  return Math.max(0, Math.round((date.getTime() - Date.now()) / (60 * 1000)));
}

function isBeforeDateTime(value, minValue) {
  if (!value || !minValue) return false;
  return new Date(value).getTime() < new Date(minValue).getTime();
}

function latestDateTimeLocal(...values) {
  return values
    .filter(Boolean)
    .reduce((latest, value) => {
      if (!latest) return value;
      return new Date(value).getTime() > new Date(latest).getTime() ? value : latest;
    }, "");
}

export function ProductCreatePage({
  currentUser,
  productToEdit,
  onAddProduct,
  onUpdateProduct,
  onNavigate,
}) {
  const isEditMode = Boolean(productToEdit);
  const [form, setForm] = useState(() =>
    productToEdit ? createEditForm(productToEdit) : createInitialForm(),
  );
  const [message, setMessage] = useState("");
  const [regionSearchOpen, setRegionSearchOpen] = useState(false);
  const [regionKeyword, setRegionKeyword] = useState("");

  useEffect(() => {
    setForm(productToEdit ? createEditForm(productToEdit) : createInitialForm());
    setMessage("");
  }, [productToEdit]);

  const regionResults = regionOptions.filter((region) => {
    const keyword = regionKeyword.trim();
    if (!keyword) return true;
    return region.label.includes(keyword) || region.dong.includes(keyword);
  });

  const updateForm = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "pickupStartAt") {
        if (isBeforeDateTime(next.pickupEndAt, value)) {
          next.pickupEndAt = value;
        }

        const expiresMin = latestDateTimeLocal(value, next.pickupEndAt);
        if (isBeforeDateTime(next.expiresAt, expiresMin)) {
          next.expiresAt = expiresMin;
        }
      }

      if (key === "pickupEndAt") {
        const expiresMin = latestDateTimeLocal(next.pickupStartAt, value);
        if (isBeforeDateTime(next.expiresAt, expiresMin)) {
          next.expiresAt = expiresMin;
        }
      }

      return next;
    });
  };

  const minDateTime = toDateTimeLocal(new Date());
  const pickupEndMin = latestDateTimeLocal(minDateTime, form.pickupStartAt);
  const expiresMin = latestDateTimeLocal(minDateTime, form.pickupStartAt, form.pickupEndAt);

  const discountRate = Math.max(
    0,
    Math.round(
      ((Number(form.originalPrice) - Number(form.discountPrice)) /
        Number(form.originalPrice)) *
        100,
    ) || 0,
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (Number(form.discountPrice) >= Number(form.originalPrice)) {
      setMessage("할인가는 원가보다 낮아야 합니다.");
      return;
    }

    if (
      isBeforeDateTime(form.pickupStartAt, minDateTime) ||
      isBeforeDateTime(form.pickupEndAt, minDateTime) ||
      isBeforeDateTime(form.expiresAt, minDateTime)
    ) {
      setMessage("이전 날짜는 선택할 수 없습니다.");
      return;
    }

    if (isBeforeDateTime(form.pickupEndAt, form.pickupStartAt)) {
      setMessage("픽업 종료 시간은 픽업 시작 이후로 선택해주세요.");
      return;
    }

    if (isBeforeDateTime(form.expiresAt, latestDateTimeLocal(form.pickupStartAt, form.pickupEndAt))) {
      setMessage("유통기한은 픽업 시작/종료 시간보다 빠를 수 없습니다.");
      return;
    }

    const selectedRegion = regionOptions.find((region) => region.label === form.regionLabel);
    const pickupLabel = formatDateTimeLabel(form.pickupStartAt);
    const pickupEndLabel = formatDateTimeLabel(form.pickupEndAt);
    const shouldKeepOriginalPickup = isEditMode && !productToEdit?.pickupStartAt;
    const shouldKeepOriginalExpiration = isEditMode && !productToEdit?.expiresAt;

    const productPayload = {
      title: form.title.trim(),
      region: selectedRegion?.dong || "성수동",
      category: form.category,
      defectReason: form.defectReason,
      description: form.description.trim(),
      pickup: shouldKeepOriginalPickup
        ? productToEdit.pickup
        : pickupLabel
          ? `${pickupLabel}${pickupEndLabel ? ` - ${pickupEndLabel}` : ""} 픽업`
          : "픽업 시간 미정",
      pickupPlace: form.pickupPlace.trim(),
      pickupStartAt: form.pickupStartAt,
      pickupEndAt: form.pickupEndAt,
      pickupWindow: pickupEndLabel ? `${pickupLabel} - ${pickupEndLabel}` : pickupLabel,
      expiresAt: form.expiresAt,
      originalPrice: `${Number(form.originalPrice).toLocaleString()}원`,
      originalPriceValue: Number(form.originalPrice),
      discount: discountRate,
      price: `${Number(form.discountPrice).toLocaleString()}원`,
      priceValue: Number(form.discountPrice),
      expiresInMinutes: shouldKeepOriginalExpiration
        ? productToEdit.expiresInMinutes
        : getMinutesUntil(form.expiresAt),
    };

    if (isEditMode) {
      await onUpdateProduct(productToEdit.id, productPayload);
      setMessage("상품 정보가 수정되었습니다.");
      onNavigate?.(`/products/${productToEdit.id}`);
      return;
    }

    await onAddProduct({
      id: Date.now(),
      ...productPayload,
      seller: currentUser?.nickname || "맛난이회원",
      status: "판매중",
      statusTone: "sale",
      rating: "0.0",
      reviews: 0,
      createdMinutes: 0,
      image:
        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=900&q=80",
    });
    setMessage("상품이 등록되었습니다.");
  };

  return (
    <>
      <PageIntro
        kicker={isEditMode ? "상품 수정" : "상품 등록"}
        title={isEditMode ? "등록한 상품 정보를 수정하세요" : "판매할 못난이 상품을 등록하세요"}
        description={
          isEditMode
            ? "기존에 입력한 내용을 유지한 상태에서 필요한 정보만 바꿀 수 있습니다."
            : "이미지, 가격, 픽업 정보를 입력하면 장터에 상품이 노출됩니다."
        }
      />
      <section className="create-layout">
        <div className="upload-panel">
          <div className="upload-box">
            <ImagePlus size={42} />
            <strong>상품 이미지</strong>
            <span>최대 5장까지 등록</span>
          </div>
          <button className="auth-link-button" type="button">
            <Upload size={17} />
            이미지 선택
          </button>
        </div>

        <form className="create-form" onSubmit={handleSubmit}>
          <label>
            상품명
            <input
              type="text"
              placeholder="예: 못난이 당근 1kg"
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
            />
          </label>
          <div className="field-grid">
            <label>
              카테고리
              <select
                value={form.category}
                onChange={(event) => updateForm("category", event.target.value)}
              >
                {categories
                  .filter((item) => item !== "전체")
                  .map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              못난이 사유
              <select
                value={form.defectReason}
                onChange={(event) => updateForm("defectReason", event.target.value)}
              >
                <option value="SHAPE_BAD">모양 이상</option>
                <option value="NEAR_EXPIRY">유통기한 임박</option>
                <option value="SCRATCH">흠집</option>
                <option value="ETC">기타</option>
              </select>
            </label>
          </div>
          <label>
            상세 설명
            <textarea
              placeholder="상품 상태, 보관 방법, 픽업 안내를 적어주세요."
              value={form.description}
              onChange={(event) => updateForm("description", event.target.value)}
            />
          </label>
          <div className="field-grid">
            <label>
              원가
              <input
                type="number"
                placeholder="5000"
                value={form.originalPrice}
                onChange={(event) => updateForm("originalPrice", event.target.value)}
              />
            </label>
            <label>
              할인가
              <input
                type="number"
                placeholder="3000"
                max={Number(form.originalPrice) - 1 || undefined}
                value={form.discountPrice}
                onChange={(event) => updateForm("discountPrice", event.target.value)}
              />
            </label>
          </div>
          <div className="discount-preview">
            자동 계산 할인율 <strong>{discountRate}%</strong>
          </div>
          <div className="create-region-field">
            <span>동네 선택</span>
            <button
              className="region-toggle"
              type="button"
              onClick={() => setRegionSearchOpen((prev) => !prev)}
            >
              {form.regionLabel}
            </button>
          </div>
          {regionSearchOpen && (
            <RegionSearchPanel
              keyword={regionKeyword}
              results={regionResults}
              onKeywordChange={setRegionKeyword}
              onSelect={(regionLabel) => {
                updateForm("regionLabel", regionLabel);
                setRegionSearchOpen(false);
              }}
            />
          )}
          <label>
            픽업 장소
            <input
              type="text"
              placeholder="성수동 주민센터 앞"
              value={form.pickupPlace}
              onChange={(event) => updateForm("pickupPlace", event.target.value)}
            />
          </label>
          <div className="field-grid">
            <label>
              픽업 시작
              <input
                type="datetime-local"
                min={minDateTime}
                value={form.pickupStartAt}
                onChange={(event) => updateForm("pickupStartAt", event.target.value)}
              />
            </label>
            <label>
              픽업 종료
              <input
                type="datetime-local"
                min={pickupEndMin}
                value={form.pickupEndAt}
                onChange={(event) => updateForm("pickupEndAt", event.target.value)}
              />
            </label>
          </div>
          <label>
            유통기한
            <input
              type="datetime-local"
              min={expiresMin}
              value={form.expiresAt}
              onChange={(event) => updateForm("expiresAt", event.target.value)}
            />
          </label>
          {message && <p className="form-success">{message}</p>}
          <button className="auth-submit" type="submit">
            {isEditMode ? "수정 완료" : "상품 등록"}
          </button>
        </form>
      </section>
    </>
  );
}
