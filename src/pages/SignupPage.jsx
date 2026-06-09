import React, { useState } from "react";
import { RegionSearchPanel } from "../components/RegionSearchPanel";
import { regionOptions } from "../data/constants";
import client from "../api/client";

// 백엔드 지역 ID 매핑 (시/도 단위)
const REGION_ID_MAP = {
  "서울": 1, "부산": 2, "대구": 3, "인천": 4, "광주": 5,
  "대전": 6, "울산": 7, "세종": 8, "경기": 9, "강원": 10,
  "충청북": 11, "충북": 11, "충청남": 12, "충남": 12,
  "전북": 13, "전라북": 13, "전라남": 14, "전남": 14,
  "경상북": 15, "경북": 15, "경상남": 16, "경남": 16, "제주": 17,
};

function getRegionId(regionLabel) {
  for (const [key, id] of Object.entries(REGION_ID_MAP)) {
    if (regionLabel.includes(key)) return id;
  }
  return 1; // 기본값: 서울
}

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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password || !form.nickname) {
      setMessage("이메일, 비밀번호, 닉네임은 필수입니다.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await client.post("/api/auth/signup", {
        email: form.email,
        password: form.password,
        nickname: form.nickname,
        phone: form.phone || null,
        regionId: getRegionId(form.region),
      });
      await onLogin({ email: form.email, password: form.password });
    } catch (error) {
      const msg = error.response?.data?.message;
      setMessage(msg || "회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
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
          {message && <p className="form-message">{message}</p>}
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "가입 중..." : "일반 회원가입"}
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
