import React from "react";
import { ChevronDown, Leaf, MapPin, Menu, ShoppingBasket, UserRound } from "lucide-react";

export function Header({ path, currentUser, onNavigate, onLogout }) {
  const navItems = [
    { label: "홈", path: "/" },
    { label: "못난이 장터", path: "/market" },
    { label: "상품 등록", path: "/products/new" },
  ];

  return (
    <header className="site-header">
      <a
        className="brand"
        href="/"
        onClick={(event) => {
          event.preventDefault();
          onNavigate("/");
        }}
      >
        <span className="brand-mark">
          <Leaf size={22} />
        </span>
        맛난이
      </a>
      <nav className="top-nav" aria-label="주요 메뉴">
        {navItems.map((item) => (
          <a
            key={item.path}
            className={path === item.path ? "active" : ""}
            href={item.path}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(item.path);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button className="location-button" type="button">
          <MapPin size={18} />
          성수동
          <ChevronDown size={16} />
        </button>
        <button
          className="icon-button"
          type="button"
          aria-label="예약 장바구니"
          onClick={() => onNavigate(currentUser ? "/mypage/reservations" : "/login")}
        >
          <ShoppingBasket size={21} />
        </button>
        {currentUser ? (
          <>
            <button
              className="login-button user-chip"
              type="button"
              onClick={() => onNavigate("/mypage")}
            >
              <UserRound size={17} />
              {currentUser.nickname}
            </button>
            <button className="logout-button" type="button" onClick={onLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <button
            className="login-button"
            type="button"
            onClick={() => onNavigate("/login")}
          >
            <UserRound size={17} />
            로그인·회원가입
          </button>
        )}
        <button className="menu-button" type="button" aria-label="메뉴 열기">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
