import React, { useState } from "react";
import { TEST_ACCOUNT } from "../data/constants";

export function LoginPage({ onNavigate, onLogin }) {
  const [email, setEmail] = useState(TEST_ACCOUNT.email);
  const [password, setPassword] = useState(TEST_ACCOUNT.password);
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (email === TEST_ACCOUNT.email && password === TEST_ACCOUNT.password) {
      onLogin({
        email: TEST_ACCOUNT.email,
        nickname: TEST_ACCOUNT.nickname,
        region: TEST_ACCOUNT.region,
        role: "NORMAL",
      });
      return;
    }

    setMessage("테스트 계정은 user@test.com / 1234 입니다.");
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
          <div className="test-account-box">
            테스트 계정: <strong>user@test.com</strong> / <strong>1234</strong>
          </div>
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
          <button className="auth-submit" type="submit">
            로그인
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
