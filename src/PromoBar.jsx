import React, { useState } from "react";
import { PROMO } from "./promo.js";
import PromoModal from "./PromoModal.jsx";
import { TYPE } from "./tokens.js";

/* The blue bar above the nav on blurb.com. The code is in it, and "Details"
   opens the modal with the terms. It scrolls away; it is not part of the
   sticky header. Wraps onto lines on a phone. */
export default function PromoBar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div role="region" aria-label="Promotional information" style={{
        background: PROMO.barColor, color: "#fff", fontSize: TYPE.sm, lineHeight: 1.5, padding: "12px 16px",
        display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "0 8px", textAlign: "center",
      }}>
        <span>{PROMO.barText}</span>
        <span aria-hidden>|</span>
        <span>Code: <strong>{PROMO.code}</strong></span>
        <span aria-hidden>|</span>
        <button onClick={() => setOpen(true)} aria-haspopup="dialog" style={{
          background: "none", border: 0, padding: 0, font: "inherit", color: "inherit", textDecoration: "underline", cursor: "pointer",
        }}>
          Details
        </button>
      </div>
      <PromoModal open={open} onOpenChange={setOpen} />
    </>
  );
}
