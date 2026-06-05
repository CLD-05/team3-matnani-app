import React, { useState } from "react";
import { ImagePlus, Upload } from "lucide-react";
import { categories, regionOptions } from "../data/constants";
import { PageIntro } from "../components/PageIntro";
import { RegionSearchPanel } from "../components/RegionSearchPanel";

export function ProductCreatePage({ onAddProduct }) {
  const [form, setForm] = useState({
    title: "못난이 당근 1kg",
    category: "농수산물",
    defectReason: "SHAPE_BAD",
    description:
      "모양은 조금 휘었지만 신선한 당근입니다. 오늘 수확했고 흙만 가볍게 털어 포장해둘게요.",
    originalPrice: "5000",
    discountPrice: "3000",
    regionLabel: "서울 성동구 성수동",
    pickupPlace: "성수동 주민센터 앞",
    pickupStartAt: "2026-06-05T17:00",
    pickupEndAt: "2026-06-05T20:00",
    expiresAt: "2026-06-06T12:00",
  });
  const [message, setMessage] = useState("");
  const [regionSearchOpen, setRegionSearchOpen] = useState(false);
  const [regionKeyword, setRegionKeyword] = useState("");

  const regionResults = regionOptions.filter((region) => {
    const keyword = regionKeyword.trim();
    if (!keyword) return true;
    return region.label.includes(keyword) || region.dong.includes(keyword);
  });

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const discountRate = Math.max(
    0,
    Math.round(
      ((Number(form.originalPrice) - Number(form.discountPrice)) /
        Number(form.originalPrice)) *
        100,
    ) || 0,
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (Number(form.discountPrice) >= Number(form.originalPrice)) {
      setMessage("할인가는 원가보다 낮아야 합니다.");
      return;
    }

    onAddProduct({
      id: Date.now(),
      title: form.title,
      seller: "맛난이회원",
      region: regionOptions.find((region) => region.label === form.regionLabel)?.dong || "성수동",
      category: form.category,
      pickup: "오늘 17:00 픽업",
      originalPrice: `${Number(form.originalPrice).toLocaleString()}원`,
      originalPriceValue: Number(form.originalPrice),
      discount: discountRate,
      price: `${Number(form.discountPrice).toLocaleString()}원`,
      priceValue: Number(form.discountPrice),
      status: "판매중",
      statusTone: "sale",
      rating: "0.0",
      reviews: 0,
      expiresInMinutes: 180,
      createdMinutes: 0,
      image:
        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=900&q=80",
    });
    setMessage("상품이 등록되었습니다.");
  };

  return (
    <>
      <PageIntro
        kicker="상품 등록"
        title="판매할 못난이 상품을 등록하세요"
        description="이미지, 가격, 픽업 정보를 입력하면 장터에 상품이 노출됩니다."
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
                value={form.pickupStartAt}
                onChange={(event) => updateForm("pickupStartAt", event.target.value)}
              />
            </label>
            <label>
              픽업 종료
              <input
                type="datetime-local"
                value={form.pickupEndAt}
                onChange={(event) => updateForm("pickupEndAt", event.target.value)}
              />
            </label>
          </div>
          <label>
            유통기한
            <input
              type="datetime-local"
              value={form.expiresAt}
              onChange={(event) => updateForm("expiresAt", event.target.value)}
            />
          </label>
          {message && <p className="form-success">{message}</p>}
          <button className="auth-submit" type="submit">
            상품 등록
          </button>
        </form>
      </section>
    </>
  );
}
