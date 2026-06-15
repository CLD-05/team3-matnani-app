import React, { useState } from "react";

export function LoginPage({ onNavigate, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await onLogin({ email, password });
    } catch {
      setMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">다시 만나서 반가워요</span>
          <h1>로그인</h1>
          <p>동네 못난이 식품 특가와 예약 내역을 확인해보세요.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            이메일
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            비밀번호
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {message && <p className="form-message">{message}</p>}
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
          <button
            className="auth-link-button"
            type="button"
            onClick={() => onNavigate("/signup")}
          >
            아직 계정이 없나요? 회원가입
          </button>
        </form>
      </div>
    </section>
  );
}
