import React, { useEffect, useMemo, useState } from "react";
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

const salesTabs = [
  { value: "all", label: "내 등록 상품 전체" },
  { value: "reserved", label: "예약 들어온 상품" },
  { value: "completed", label: "거래 완료된 상품" },
  { value: "open", label: "예약 안 된 상품" },
];

const productOnlyStatus = {
  label: "예약 없음",
  tone: "sale",
  sellerText: "아직 예약 요청이 없는 판매중 상품입니다.",
};

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
  reviews,
  initialFilter,
  onNavigate,
  onUpdateReservation,
}) {
  const copy = pageCopy[type];
  const [salesTab, setSalesTab] = useState(initialFilter || "all");

  useEffect(() => {
    if (type === "sales" && initialFilter) {
      setSalesTab(initialFilter);
    }
  }, [initialFilter, type]);

  const transactions = useMemo(() => {
    if (type === "purchases") {
      return reservations
        .filter(
          (reservation) =>
            reservation.status === "COMPLETED" &&
            reservation.buyerName === currentUser?.nickname,
        )
        .map((reservation) => ({
          ...reservation,
          product:
            products.find((product) => String(product.id) === String(reservation.productId)) ||
            reservation.product,
          hasReservation: true,
        }));
    }

    const productTransactions = products
      .filter((product) => product.seller === currentUser?.nickname)
      .map((product) => {
        const reservation = reservations.find(
          (item) =>
            String(item.productId) === String(product.id) &&
            item.sellerName === currentUser?.nickname &&
            item.status !== "CANCELED",
        );

        return {
          id: reservation?.id || `product-${product.id}`,
          productId: product.id,
          buyerName: reservation?.buyerName || "",
          sellerName: product.seller,
          requestedAt: reservation?.requestedAt || "-",
          pickupTime: reservation?.pickupTime || product.pickup.replace(" 픽업", ""),
          status: reservation?.status || "NO_RESERVATION",
          product,
          hasReservation: Boolean(reservation),
        };
      });

    const seenProductIds = new Set(
      productTransactions.map((transaction) => String(transaction.productId)),
    );
    const reservationOnlyTransactions = reservations
      .filter(
        (reservation) =>
          reservation.sellerName === currentUser?.nickname &&
          reservation.status !== "CANCELED" &&
          !seenProductIds.has(String(reservation.productId)),
      )
      .map((reservation) => ({
        ...reservation,
        product:
          products.find((product) => String(product.id) === String(reservation.productId)) ||
          reservation.product,
        hasReservation: true,
      }));

    return [...productTransactions, ...reservationOnlyTransactions];
  },
    [currentUser?.nickname, products, reservations, type],
  );
  const visibleTransactions =
    type === "sales"
      ? transactions.filter((transaction) => {
        if (salesTab === "reserved") {
          return transaction.hasReservation && transaction.status !== "COMPLETED";
        }
        if (salesTab === "completed") return transaction.status === "COMPLETED";
        if (salesTab === "open") return !transaction.hasReservation;
        return true;
      })
      : transactions;

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
          <strong>{visibleTransactions.length}</strong>
          <span>{copy.counterLabel}</span>
        </div>
      </div>

      {type === "sales" && (
        <div className="history-tabs" aria-label="판매 내역 필터">
          {salesTabs.map((tab) => (
            <button
              key={tab.value}
              className={salesTab === tab.value ? "active" : ""}
              type="button"
              onClick={() => setSalesTab(tab.value)}
            >
              {tab.label}
              <strong>
                {
                  transactions.filter((transaction) => {
                    if (tab.value === "reserved") {
                      return transaction.hasReservation && transaction.status !== "COMPLETED";
                    }
                    if (tab.value === "completed") return transaction.status === "COMPLETED";
                    if (tab.value === "open") return !transaction.hasReservation;
                    return true;
                  }).length
                }
              </strong>
            </button>
          ))}
        </div>
      )}

      <div className="history-list">
        {visibleTransactions.length === 0 && (
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
        {visibleTransactions.map((transaction) => (
          <HistoryCard
            key={transaction.id}
            type={type}
            transaction={transaction}
            reviews={reviews}
            onNavigate={onNavigate}
            onUpdateReservation={onUpdateReservation}
          />
        ))}
      </div>
    </section>
  );
}

function HistoryCard({ type, transaction, reviews, onNavigate, onUpdateReservation }) {
  const product = transaction.product;
  const status =
    transaction.status === "NO_RESERVATION"
      ? productOnlyStatus
      : reservationStatuses[transaction.status];
  const isSales = type === "sales";
  const canSellerRespond = isSales && transaction.status === "REQUESTED";
  const canSellerCancel = isSales && transaction.status === "ACCEPTED";
  const canSellerComplete = isSales && transaction.status === "ACCEPTED";
  const canWriteReview =
    !isSales &&
    transaction.status === "COMPLETED" &&
    !(reviews || []).some((review) => review.reservationId === transaction.id);

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
                : transaction.hasReservation
                  ? `${transaction.buyerName} 예약`
                  : "예약 대기중"}
            </p>
            <h2>{product?.title || transaction.productTitle || "삭제된 상품"}</h2>
          </div>
          <span className={`reservation-status ${status.tone}`}>{status.label}</span>
        </div>

        <div className="reservation-meta">
          <span>
            <MapPin size={16} />
            {product?.region || product?.regionName || "지역 정보 없음"}
          </span>
          <span>
            <Clock3 size={16} />
            픽업 {transaction.pickupTime}
          </span>
          <span>
            <CalendarCheck size={16} />
            {transaction.hasReservation ? `요청 ${transaction.requestedAt}` : "예약 요청 없음"}
          </span>
        </div>

        {isSales && <p className="reservation-guide">{status.sellerText}</p>}

        <div className="history-price-row">
          <div>
            <span>거래 금액</span>
            <strong>{product?.price || "-"}</strong>
          </div>
          <div>
            <span>{type === "purchases" ? "판매자" : "구매자"}</span>
            <strong>
              {type === "purchases"
                ? transaction.sellerName
                : transaction.buyerName || "예약 없음"}
            </strong>
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
          {canWriteReview && (
            <button
              className="reservation-primary-button"
              type="button"
              onClick={() => onNavigate(`/reviews/new/${transaction.id}`)}
            >
              후기 작성
            </button>
          )}
          {!isSales && transaction.status === "COMPLETED" && !canWriteReview && (
            <button
              className="reservation-ghost-button"
              type="button"
              onClick={() => onNavigate("/mypage/reviews")}
            >
              후기 보기
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
          {canSellerCancel && (
            <button
              className="reservation-danger-button"
              type="button"
              onClick={() => onUpdateReservation(transaction.id, "CANCELED")}
            >
              <XCircle size={17} />
              취소
            </button>
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
