import React, { useMemo } from "react";
import {
  CalendarCheck,
  ChevronLeft,
  Clock3,
  MapPin,
  PackageCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { reservationStatuses } from "../data/reservations";

export function ReservationsPage({
  currentUser,
  products,
  reservations,
  onNavigate,
  onUpdateReservation,
}) {
  const enrichedReservations = useMemo(
    () =>
      reservations.map((reservation) => ({
        ...reservation,
        product: products.find((product) => product.id === reservation.productId),
      })),
    [products, reservations],
  );
  const activeReservations = enrichedReservations.filter(
    (reservation) => reservation.status !== "COMPLETED",
  );

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

  const buyerReservations = activeReservations.filter(
    (reservation) => reservation.buyerName === currentUser.nickname,
  );

  return (
    <section className="reservations-page">
      <button className="back-button" type="button" onClick={() => onNavigate("/mypage")}>
        <ChevronLeft size={20} />
        마이페이지로 돌아가기
      </button>

      <div className="reservation-head">
        <div>
          <span className="eyebrow">예약 내역</span>
          <h1>내가 예약한 상품 상태를 확인하세요</h1>
          <p>판매자에게 보낸 예약 요청과 확정 상태를 구매자 관점에서 확인합니다.</p>
        </div>
        <CalendarCheck size={46} />
      </div>

      <div className="reservation-tabs single" aria-label="예약 내역 유형">
        <div>
          <UserRound size={18} />
          구매자 예약
          <strong>{buyerReservations.length}</strong>
        </div>
      </div>

      <div className="reservation-list">
        {buyerReservations.length === 0 && (
          <ReservationEmpty onNavigate={onNavigate} />
        )}
        {buyerReservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            onNavigate={onNavigate}
            onUpdateReservation={onUpdateReservation}
          />
        ))}
      </div>
    </section>
  );
}

function ReservationCard({ reservation, onNavigate, onUpdateReservation }) {
  const status = reservationStatuses[reservation.status];
  const product = reservation.product;
  const canBuyerCancel =
    reservation.status === "REQUESTED" || reservation.status === "ACCEPTED";

  return (
    <article className="reservation-card">
      <div className="reservation-image">
        {product ? (
          <img src={product.image} alt={product.title} />
        ) : (
          <PackageCheck size={38} />
        )}
      </div>
      <div className="reservation-content">
        <div className="reservation-title-row">
          <div>
            <p className="seller">{reservation.sellerName} 판매</p>
            <h2>{product?.title || "삭제된 상품"}</h2>
          </div>
          <span className={`reservation-status ${status.tone}`}>{status.label}</span>
        </div>

        <div className="reservation-meta">
          <span>
            <MapPin size={16} />
            {product?.region || "지역 정보 없음"}
          </span>
          <span>
            <Clock3 size={16} />
            픽업 {reservation.pickupTime}
          </span>
          <span>
            <CalendarCheck size={16} />
            요청 {reservation.requestedAt}
          </span>
        </div>

        <p className="reservation-guide">{status.buyerText}</p>

        <div className="reservation-actions">
          {product && (
            <button
              className="reservation-ghost-button"
              type="button"
              onClick={() => onNavigate(`/products/${product.id}`)}
            >
              상품 상세
            </button>
          )}
          {canBuyerCancel && (
            <button
              className="reservation-danger-button"
              type="button"
              onClick={() => onUpdateReservation(reservation.id, "CANCELED")}
            >
              <XCircle size={17} />
              예약 취소
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function ReservationEmpty({ onNavigate }) {
  return (
    <div className="reservation-empty">
      <PackageCheck size={38} />
      <strong>아직 구매 예약 내역이 없습니다.</strong>
      <p>장터에서 상품을 예약하면 이곳에 상태가 표시됩니다.</p>
      <button
        className="auth-link-button"
        type="button"
        onClick={() => onNavigate("/market")}
      >
        장터 둘러보기
      </button>
    </div>
  );
}
