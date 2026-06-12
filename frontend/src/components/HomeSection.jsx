import React from "react";
import { ChevronDown } from "lucide-react";

export function HomeSection({ kicker, title, actionLabel, onAction, children }) {
  return (
    <section className="content home-section">
      <div className="section-head">
        <div>
          <span className="section-kicker">{kicker}</span>
          <h2>{title}</h2>
        </div>
        <button className="sort-button" type="button" onClick={onAction}>
          {actionLabel}
          <ChevronDown size={17} />
        </button>
      </div>
      {children}
    </section>
  );
}
