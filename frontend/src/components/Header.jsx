import React, { useState } from "react";
import { Bell, ChevronDown, Leaf, MapPin, Menu, ShoppingBasket, UserRound } from "lucide-react";
import { RegionSearchPanel } from "./RegionSearchPanel";

export function Header({
  path,
  currentUser,
  selectedRegion,
  unreadNotificationCount,
  onNavigate,
  onLogout,
  onRegionChange,
}) {
  const navItems = [
    { label: "홈", path: "/" },
    { label: "맛난이 장터", path: "/market" },
    { label: "상품 등록", path: "/products/new", businessOnly: true },
  ];
  const [regionPickerOpen, setRegionPickerOpen] = useState(false);
  const unreadCount = currentUser ? unreadNotificationCount : 0;
  const displayName = selectedRegion?.name || "전체";

  const handleRegionSelect = (region) => {
    onRegionChange(region);
    setRegionPickerOpen(false);
  };

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
              if (item.businessOnly && currentUser && currentUser.role !== "BUSINESS") {
                window.alert("사업자 회원만 가능합니다.");
                return;
              }
              onNavigate(item.path);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <div className="header-location-picker">
          <button
            className={regionPickerOpen ? "location-button active" : "location-button"}
            type="button"
            aria-expanded={regionPickerOpen}
            onClick={() => setRegionPickerOpen((prev) => !prev)}
          >
            <MapPin size={18} />
            {displayName}
            <ChevronDown size={16} />
          </button>
          {regionPickerOpen && (
            <div className="location-popover" role="dialog" aria-label="우리 동네 설정">
              <div className="location-popover-head">
                <strong>우리 동네 설정</strong>
                <button type="button" onClick={() => setRegionPickerOpen(false)}>
                  닫기
                </button>
              </div>
              <RegionSearchPanel
                includeAll
                onSelect={handleRegionSelect}
              />
            </div>
          )}
        </div>
        <button
          className="icon-button"
          type="button"
          aria-label="예약 장바구니"
          onClick={() => onNavigate(currentUser ? "/mypage/reservations" : "/login")}
        >
          <ShoppingBasket size={21} />
        </button>
        <button
          className="icon-button notification-icon-button"
          type="button"
          aria-label={`알림 ${unreadCount}개`}
          onClick={() => onNavigate(currentUser ? "/mypage/notifications" : "/login")}
        >
          <Bell size={21} />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
          )}
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
