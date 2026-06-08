import React, { useMemo } from "react";
import {
  CalendarCheck,
  ChevronLeft,
  Clock3,
  MapPin,
  PackageCheck,
  ReceiptText,
  XCircle,
} from "lucide-react";
import { reservationStatuses } from "../data/reservations";

const pageCopy = {
  purchases: {
    kicker: "구매 내역",
    title: "거래 완료된 구매 상품을 확인하세요",
    description: "예약이 거래 완료 상태가 되면 구매 내역으로 이동합니다.",
    emptyTitle: "아직 완료된 구매 내역이 없습니다.",
    emptyDescription: "예약한 상품이 거래 완료되면 이곳에서 확인할 수 있습니다.",
    emptyAction: "장터 둘러보기",
    emptyPath: "/market",
    counterLabel: "완료 구매",
  },
  sales: {
    kicker: "판매 내역",
    title: "판매 예약과 완료 내역을 관리하세요",
    description: "내 상품에 들어온 예약 요청부터 거래 완료까지 판매 내역에서 관리합니다.",
    emptyTitle: "아직 판매 예약 내역이 없습니다.",
    emptyDescription: "등록한 상품에 예약 요청이 들어오면 이곳에서 수락하거나 완료 처리할 수 있습니다.",
    emptyAction: "상품 등록하기",
    emptyPath: "/products/new",
    counterLabel: "판매 예약",
  },
};

export function TransactionHistoryPage({
  type,
  currentUser,
  products,
  reservations,
  onNavigate,
  onUpdateReservation,
}) {
  const copy = pageCopy[type];

  const transactions = useMemo(
    () =>
      reservations
        .filter((reservation) =>
          type === "purchases"
            ? reservation.status === "COMPLETED" &&
              reservation.buyerName === currentUser?.nickname
            : reservation.sellerName === currentUser?.nickname,
        )
        .map((reservation) => ({
          ...reservation,
          product: products.find((product) => product.id === reservation.productId),
        })),
    [currentUser?.nickname, products, reservations, type],
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

  return (
    <section className="history-page">
      <button className="back-button" type="button" onClick={() => onNavigate("/mypage")}>
        <ChevronLeft size={20} />
        마이페이지로 돌아가기
      </button>

      <div className="history-head">
        <div>
          <span className="eyebrow">{copy.kicker}</span>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </div>
        <div className="history-counter">
          <strong>{transactions.length}</strong>
          <span>{copy.counterLabel}</span>
        </div>
      </div>

      <div className="history-list">
        {transactions.length === 0 && (
          <div className="reservation-empty">
            <PackageCheck size={38} />
            <strong>{copy.emptyTitle}</strong>
            <p>{copy.emptyDescription}</p>
            <button
              className="auth-link-button"
              type="button"
              onClick={() => onNavigate(copy.emptyPath)}
            >
              {copy.emptyAction}
            </button>
          </div>
        )}
        {transactions.map((transaction) => (
          <HistoryCard
            key={transaction.id}
            type={type}
            transaction={transaction}
            onNavigate={onNavigate}
            onUpdateReservation={onUpdateReservation}
          />
        ))}
      </div>
    </section>
  );
}

function HistoryCard({ type, transaction, onNavigate, onUpdateReservation }) {
  const product = transaction.product;
  const status = reservationStatuses[transaction.status];
  const isSales = type === "sales";
  const canSellerRespond = isSales && transaction.status === "REQUESTED";
  const canSellerComplete = isSales && transaction.status === "ACCEPTED";

  return (
    <article className="history-card">
      <div className="history-image">
        {product ? <img src={product.image} alt={product.title} /> : <ReceiptText size={38} />}
      </div>
      <div className="history-content">
        <div className="reservation-title-row">
          <div>
            <p className="seller">
              {type === "purchases"
                ? `${transaction.sellerName} 판매`
                : `${transaction.buyerName} 구매`}
            </p>
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
            픽업 {transaction.pickupTime}
          </span>
          <span>
            <CalendarCheck size={16} />
            요청 {transaction.requestedAt}
          </span>
        </div>

        <div className="history-price-row">
          <div>
            <span>거래 금액</span>
            <strong>{product?.price || "-"}</strong>
          </div>
          <div>
            <span>{type === "purchases" ? "판매자" : "구매자"}</span>
            <strong>{type === "purchases" ? transaction.sellerName : transaction.buyerName}</strong>
          </div>
        </div>

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
          {type === "purchases" && (
            <button className="reservation-ghost-button" type="button">
              후기 작성
            </button>
          )}
          {canSellerRespond && (
            <>
              <button
                className="reservation-danger-button"
                type="button"
                onClick={() => onUpdateReservation(transaction.id, "CANCELED")}
              >
                <XCircle size={17} />
                거절
              </button>
              <button
                className="reservation-primary-button"
                type="button"
                onClick={() => onUpdateReservation(transaction.id, "ACCEPTED")}
              >
                수락
              </button>
            </>
          )}
          {canSellerComplete && (
            <button
              className="reservation-primary-button"
              type="button"
              onClick={() => onUpdateReservation(transaction.id, "COMPLETED")}
            >
              거래 완료
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
