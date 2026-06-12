import React, { useState } from "react";
import { RegionSearchPanel } from "../components/RegionSearchPanel";
import {
  DEFAULT_REGION_LABEL,
  filterRegions,
  normalizeRegionLabel,
  getRegionId,
} from "../utils/regions";
import { businessSignupUser } from "../api/auth";

export function BusinessSignupPage({ onNavigate, onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
    phone: "",
    businessNumber: "",
    businessName: "",
    ownerName: "",
    startDate: "",
    region: DEFAULT_REGION_LABEL,
  });
  const [regionSearchOpen, setRegionSearchOpen] = useState(false);
  const [regionKeyword, setRegionKeyword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const regionResults = filterRegions(regionKeyword);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // 클라이언트 기본 검증
    if (!form.businessNumber.match(/^\d{10}$/)) {
      setError("사업자번호는 하이픈 없이 10자리 숫자로 입력해주세요.");
      return;
    }
    if (!form.startDate.match(/^\d{8}$/)) {
      setError("개업일자는 YYYYMMDD 형식 8자리 숫자로 입력해주세요. (예: 20200315)");
      return;
    }

    setLoading(true);
    try {
      const user = await businessSignupUser({
        email: form.email,
        password: form.password,
        nickname: form.nickname,
        phone: form.phone,
        regionId: getRegionId(form.region),
        businessNumber: form.businessNumber,
        businessName: form.businessName,
        ownerName: form.ownerName,
        startDate: form.startDate,
      });
      onLogin(user);
    } catch (e) {
      const msg = e.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
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
            이메일
            <input
              type="email"
              placeholder="business@example.com"
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
              required
            />
          </label>
          <label>
            비밀번호
            <input
              type="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={(e) => updateForm("password", e.target.value)}
              required
            />
          </label>
          <label>
            닉네임
            <input
              type="text"
              placeholder="닉네임"
              value={form.nickname}
              onChange={(e) => updateForm("nickname", e.target.value)}
              required
            />
          </label>
          <label>
            전화번호
            <input
              type="text"
              placeholder="010-0000-0000"
              value={form.phone}
              onChange={(e) => updateForm("phone", e.target.value)}
              required
            />
          </label>
          <label>
            사업자번호 <span style={{ color: "#888", fontSize: "0.85em" }}>(하이픈 없이 10자리)</span>
            <input
              type="text"
              placeholder="1234567890"
              maxLength={10}
              value={form.businessNumber}
              onChange={(e) => updateForm("businessNumber", e.target.value.replace(/\D/g, ""))}
              required
            />
          </label>
          <label>
            상호명
            <input
              type="text"
              placeholder="맛난 베이커리"
              value={form.businessName}
              onChange={(e) => updateForm("businessName", e.target.value)}
              required
            />
          </label>
          <label>
            대표자명
            <input
              type="text"
              placeholder="홍길동"
              value={form.ownerName}
              onChange={(e) => updateForm("ownerName", e.target.value)}
              required
            />
          </label>
          <label>
            개업일자 <span style={{ color: "#888", fontSize: "0.85em" }}>(YYYYMMDD, 예: 20200315)</span>
            <input
              type="text"
              placeholder="20200315"
              maxLength={8}
              value={form.startDate}
              onChange={(e) => updateForm("startDate", e.target.value.replace(/\D/g, ""))}
              required
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
          {error && (
            <p style={{ color: "#e53e3e", fontSize: "0.9em", margin: "0" }}>{error}</p>
          )}
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "인증 중..." : "사업자 회원가입"}
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
