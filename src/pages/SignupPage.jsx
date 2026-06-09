import React, { useState } from "react";
import { RegionSearchPanel } from "../components/RegionSearchPanel";
import { regionOptions } from "../data/constants";

export function SignupPage({ onNavigate, onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
    phone: "",
    region: "서울 성동구 성수동",
  });
  const [regionSearchOpen, setRegionSearchOpen] = useState(false);
  const [regionKeyword, setRegionKeyword] = useState("");

  const regionResults = regionOptions.filter((region) => {
    const keyword = regionKeyword.trim();
    if (!keyword) return true;
    return (
      region.label.includes(keyword) ||
      region.city.includes(keyword) ||
      region.district.includes(keyword) ||
      region.dong.includes(keyword)
    );
  });

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin({
      email: form.email || "new-user@test.com",
      nickname: form.nickname || "새 맛난이회원",
      region: form.region,
      role: "NORMAL",
    });
  };

  return (
    <section className="auth-page">
      <div className="auth-card signup-card">
        <div className="auth-copy">
          <span className="eyebrow">맛난이 시작하기</span>
          <h1>회원가입</h1>
          <p>내 동네를 선택하고 오늘 픽업 가능한 상품을 찾아보세요.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field-grid">
            <label>
              이메일
              <input
                type="email"
                placeholder="user@example.com"
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
              />
            </label>
            <label>
              비밀번호
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={form.password}
                onChange={(event) => updateForm("password", event.target.value)}
              />
            </label>
            <label>
              닉네임
              <input
                type="text"
                placeholder="닉네임을 입력하세요"
                value={form.nickname}
                onChange={(event) => updateForm("nickname", event.target.value)}
              />
            </label>
            <label>
              전화번호
              <input
                type="tel"
                placeholder="010-1234-5678"
                value={form.phone}
                onChange={(event) => updateForm("phone", event.target.value)}
              />
            </label>
          </div>
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
                updateForm("region", regionLabel);
                setRegionSearchOpen(false);
              }}
            />
          )}
          <button className="auth-submit" type="submit">
            일반 회원가입
          </button>
          <button
            className="auth-link-button"
            type="button"
            onClick={() => onNavigate("/signup/business")}
          >
            사업자 회원가입으로 이동
          </button>
        </form>
      </div>
    </section>
  );
}
