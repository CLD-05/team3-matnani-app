import React from "react";

export function FilterGroup({ label, children }) {
  return (
    <div className="filter-group">
      <span>{label}</span>
      <div className="filter-chips">{children}</div>
    </div>
  );
}
