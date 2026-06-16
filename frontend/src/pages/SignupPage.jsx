import React, { useState } from "react";
import { RegionSearchPanel } from "../components/RegionSearchPanel";
import client from "../api/client";

export function SignupPage({ onNavigate, onLogin }) {
    const [form, setForm] = useState({
        email: "",
        password: "",
        nickname: "",
        phone: "",
    });
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [regionSearchOpen, setRegionSearchOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

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
                regionId: selectedRegion?.id || null,
            });
            setMessage("회원가입이 완료됐습니다!");
            setTimeout(() => onNavigate("/login"), 1500);
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
                            {selectedRegion?.label || "동네를 선택하세요"}
                        </button>
                    </div>
                    {regionSearchOpen && (
                        <RegionSearchPanel
                            onSelect={(region) => {
                                setSelectedRegion(region);
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