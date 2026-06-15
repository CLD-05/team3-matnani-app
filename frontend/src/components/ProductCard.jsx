import React, { useEffect, useState } from "react";
import { CalendarClock, MapPin, Star, Timer } from "lucide-react";
import { formatTimeLeft } from "../utils/time";

function getDeadlineMinutes(product, now = Date.now()) {
    const deadlineAt = product.pickupEndAt || product.pickupStartAt;

    if (deadlineAt) {
        const minutes = Math.round((new Date(deadlineAt).getTime() - now) / 60000);
        return Number.isFinite(minutes) ? Math.max(0, minutes) : 0;
    }

    return product.deadlineInMinutes ?? product.expiresInMinutes ?? 0;
}

function formatDiscountPrice(originalPrice, discountPrice) {
    const orig = Number(String(originalPrice ?? "").replace(/[^0-9]/g, ""));
    const disc = Number(String(discountPrice ?? "").replace(/[^0-9]/g, ""));
    if (!orig || !disc || orig <= disc) return null;
    const saved = orig - disc;
    return `${saved.toLocaleString()}원 할인`;
}

function getQuantityLabel(product) {
    const remaining = Number(product.remainingQuantity ?? product.availableQuantity ?? 0);
    const reserved = Number(product.reservedQuantity || 0);
    const completed = Number(product.completedQuantity || 0);
    const parts = [`${remaining}개 보유중`];

    if (reserved > 0) parts.push(`${reserved}개 예약중`);
    if (completed > 0) parts.push(`${completed}개 판매완료`);

    return parts.join(" · ");
}

export function ProductCard({ product, compact = false, onClick }) {
    const [now, setNow] = useState(Date.now());
    const deadlineMinutes = getDeadlineMinutes(product, now);
    const title = product.title;
    const reservedQuantity = Number(product.reservedQuantity || 0);
    const statusLabel = reservedQuantity > 0 ? `${reservedQuantity}개 예약중` : product.status;

    useEffect(() => {
        const timer = window.setInterval(() => setNow(Date.now()), 60000);
        return () => window.clearInterval(timer);
    }, []);

    return (
        <article
            className={`product-card ${compact ? "compact-card" : ""}`}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onClick={onClick}
            onKeyDown={(event) => {
                if (onClick && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    onClick();
                }
            }}
        >
            <div className="image-wrap">
                <img src={product.image} alt={product.title} />
                <span className={`status-badge ${reservedQuantity > 0 ? "reserved" : product.statusTone}`}>
          {statusLabel}
        </span>
            </div>
            <div className="product-body">
                <p className="seller">{product.seller}</p>
                <h3>{title}</h3>
                <div className="meta">
                    <MapPin size={15} />
                    {product.region}
                    <span>·</span>
                    <CalendarClock size={15} />
                    {product.pickup}
                </div>
                <p className="quantity-summary">{getQuantityLabel(product)}</p>
                <div className="price-row">
                    <span className="original">{product.originalPrice}</span>
                    {formatDiscountPrice(product.originalPrice, product.price) && (
                        <span className="discount">{formatDiscountPrice(product.originalPrice, product.price)}</span>
                    )}
                </div>
                <strong className="price">{product.price}</strong>
                <div className="card-foot">
          <span className="rating">
            <Star size={15} fill="currentColor" />
              {product.rating}({product.reviews})
          </span>
                    <span className="deadline">
            <Timer size={15} />
                        {formatTimeLeft(deadlineMinutes)}
          </span>
                </div>
            </div>
        </article>
    );
}
