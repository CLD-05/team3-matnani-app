import React from "react";

export function PageIntro({ kicker, title, description }) {
  return (
    <section className="page-intro">
      <span className="eyebrow">{kicker}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}
