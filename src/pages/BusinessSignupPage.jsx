import React, { useState } from "react";
import { RegionSearchPanel } from "../components/RegionSearchPanel";
import {
  DEFAULT_REGION_LABEL,
  filterRegions,
  normalizeRegionLabel,
} from "../utils/regions";

export function BusinessSignupPage({ onNavigate, onLogin }) {
  const [form, setForm] = useState({
    businessNumber: "",
    businessName: "",
    ownerName: "",
    region: DEFAULT_REGION_LABEL,
  });
  const [regionSearchOpen, setRegionSearchOpen] = useState(false);
  const [regionKeyword, setRegionKeyword] = useState("");

  const regionResults = filterRegions(regionKeyword);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin({
      email: "business@test.com",
      nickname: form.businessName || "맛난이 사업자",
      region: normalizeRegionLabel(form.region),
      role: "BUSINESS",
      verifyStatus: "VERIFIED",
    });
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">사업자 회원가입</span>
          <h1>사업자 정보 입력</h1>
          <p>사업자 인증이 완료되면 모든 카테고리 상품을 등록할 수 있습니다.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            사업자번호
            <input
              type="text"
              placeholder="1234567890"
              value={form.businessNumber}
              onChange={(event) => updateForm("businessNumber", event.target.value)}
            />
          </label>
          <label>
            상호명
            <input
              type="text"
              placeholder="맛난 베이커리"
              value={form.businessName}
              onChange={(event) => updateForm("businessName", event.target.value)}
            />
          </label>
          <label>
            대표자명
            <input
              type="text"
              placeholder="홍길동"
              value={form.ownerName}
              onChange={(event) => updateForm("ownerName", event.target.value)}
            />
          </label>
          <div className="signup-region-field">
            <span>동네 선택</span>
            <button
              className="region-toggle"
              type="button"
              onClick={() => setRegionSearchOpen((prev) => !prev)}
            >
              {form.region}
            </button>
          </div>
          {regionSearchOpen && (
            <RegionSearchPanel
              keyword={regionKeyword}
              results={regionResults}
              onKeywordChange={setRegionKeyword}
              onSelect={(regionLabel) => {
                updateForm("region", normalizeRegionLabel(regionLabel));
                setRegionSearchOpen(false);
              }}
            />
          )}
          <button className="auth-submit" type="submit">
            사업자 회원가입
          </button>
          <button
            className="auth-link-button"
            type="button"
            onClick={() => onNavigate("/signup")}
          >
            일반 회원가입으로 돌아가기
          </button>
        </form>
      </div>
    </section>
  );
}
