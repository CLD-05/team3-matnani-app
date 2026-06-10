import React from "react";
import {
  Bell,
  ClipboardList,
  MessageSquareText,
  ShoppingBag,
  Star,
  Store,
  UserRound,
} from "lucide-react";

export function MyPage({ currentUser, products, reservations = [], onNavigate, onNavigateToSales }) {
  if (!currentUser) {
    return (
      <section className="detail-empty">
        <h1>로그인이 필요한 화면입니다.</h1>
        <button className="auth-submit" type="button" onClick={() => onNavigate("/login")}>
          로그인하러 가기
        </button>
      </section>
    );
  }

  const myProducts = products.filter((product) => product.seller === currentUser.nickname);
  const sellingCount = myProducts.filter(
    (product) => product.statusTone === "sale" || product.status === "판매중",
  ).length;
  const reservedCount = reservations.filter(
    (reservation) =>
      reservation.buyerName === currentUser.nickname &&
      ["REQUESTED", "ACCEPTED"].includes(reservation.status),
  ).length;
  const soldOutCount = myProducts.filter(
    (product) => product.statusTone === "soldout" || product.status === "판매완료",
  ).length;

  return (
    <section className="mypage">
      <div className="mypage-profile">
        <div className="profile-avatar">
          <UserRound size={48} />
        </div>
        <div>
          <span className="eyebrow">나의 맛난이</span>
          <h1>{currentUser.nickname}</h1>
          <p>
            {currentUser.role === "BUSINESS" ? "사업자 회원" : "일반 회원"} ·{" "}
            {currentUser.region}
          </p>
        </div>
        {currentUser.verifyStatus && <span className="profile-badge">사업자 인증 완료</span>}
      </div>

      <div className="mypage-stats">
        <button
          className="mypage-stat-btn"
          type="button"
          onClick={() => onNavigateToSales("open")}
        >
          <strong>{sellingCount}</strong>
          <span>판매중</span>
        </button>
        <button
          className="mypage-stat-btn"
          type="button"
          onClick={() => onNavigate("/mypage/reservations")}
        >
          <strong>{reservedCount}</strong>
          <span>예약중</span>
        </button>
        <button
          className="mypage-stat-btn"
          type="button"
          onClick={() => onNavigateToSales("completed")}
        >
          <strong>{soldOutCount}</strong>
          <span>판매완료</span>
        </button>
        <button
          className="mypage-stat-btn"
          type="button"
          onClick={() => onNavigateToSales("all")}
        >
          <strong>{myProducts.length}</strong>
          <span>내 등록 상품</span>
        </button>
      </div>

      <div className="mypage-grid">
        <MyPageMenuItem
          icon={<ClipboardList size={22} />}
          title="예약 내역"
          description="내가 예약한 상품 상태를 확인합니다."
          onClick={() => onNavigate("/mypage/reservations")}
        />
        <MyPageMenuItem
          icon={<ShoppingBag size={22} />}
          title="구매 내역"
          description="거래 완료된 구매 상품을 확인합니다."
          onClick={() => onNavigate("/mypage/purchases")}
        />
        <MyPageMenuItem
          icon={<Store size={22} />}
          title="판매 내역"
          description="내 상품의 예약 요청과 판매 상태를 관리합니다."
          onClick={() => onNavigate("/mypage/sales")}
        />
        <MyPageMenuItem
          icon={<Star size={22} />}
          title="내가 쓴 후기"
          description="거래 후 작성한 후기를 확인합니다."
          onClick={() => onNavigate("/mypage/reviews")}
        />
        <MyPageMenuItem
          icon={<Star size={22} />}
          title="내게 달린 후기"
          description="내 판매 상품에 남겨진 후기를 확인합니다."
          onClick={() => onNavigate("/mypage/received-reviews")}
        />
        <MyPageMenuItem
          icon={<Bell size={22} />}
          title="알림"
          description="댓글, 예약, 상태 변경 알림을 확인합니다."
          onClick={() => onNavigate("/mypage/notifications")}
        />
        <MyPageMenuItem
          icon={<MessageSquareText size={22} />}
          title="내가 등록한 댓글"
          description="내 문의와 답글 상태를 확인합니다."
          onClick={() => onNavigate("/mypage/comments")}
        />
      </div>

    </section>
  );
}

function MyPageMenuItem({ icon, title, description, onClick }) {
  return (
    <button className="mypage-menu-item" type="button" onClick={onClick}>
      <span>{icon}</span>
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </button>
  );
}
