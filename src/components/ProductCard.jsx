import React from "react";
import { CalendarClock, MapPin, Star, Timer } from "lucide-react";
import { formatTimeLeft } from "../utils/time";

export function ProductCard({ product, compact = false, onClick }) {
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
        <span className={`status-badge ${product.statusTone}`}>{product.status}</span>
      </div>
      <div className="product-body">
        <p className="seller">{product.seller}</p>
        <h3>{product.title}</h3>
        <div className="meta">
          <MapPin size={15} />
          {product.region}
          <span>·</span>
          <CalendarClock size={15} />
          {product.pickup}
        </div>
        <div className="price-row">
          <span className="discount">{product.discount}%</span>
          <span className="original">{product.originalPrice}</span>
        </div>
        <strong className="price">{product.price}</strong>
        <div className="card-foot">
          <span className="rating">
            <Star size={15} fill="currentColor" />
            {product.rating}({product.reviews})
          </span>
          <span className="deadline">
            <Timer size={15} />
            {formatTimeLeft(product.expiresInMinutes)}
          </span>
        </div>
      </div>
    </article>
  );
}
