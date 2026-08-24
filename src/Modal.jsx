import React from "react";
import { T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";

/* ── A modal, for the things that are not part of the decision ──
   The 8/21 pod's read of "one page, one goal": what you dip into and come
   back from belongs behind a layer, not in the column where the decision is
   being made. First use is shipping on the selling side — the buyer pays it,
   so it must never share space with the seller's margin.

   Deliberately small: backdrop click and Escape close it, and it is not
   focus-trapped. A prototype needs the separation to be legible, not a
   production dialog. */
export default function Modal({ open, title, onClose, children }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,0,0,0.4)",
        display: "grid", placeItems: "center", padding: 20,
      }}
    >
      <div
        className="pop-in"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={e => e.stopPropagation()}
        style={{
          background: T.bgNeutral, borderRadius: R.lg, maxWidth: 560, width: "100%",
          maxHeight: "85vh", overflowY: "auto", padding: 24,
          display: "grid", gap: 14, fontFamily: FONT_BODY,
          boxShadow: "0 24px 60px rgba(0,0,0,0.24)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["4xl"], fontWeight: 500, lineHeight: 1.2 }}>
            {title}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: "transparent", border: 0, cursor: "pointer", color: T.textSubtle, padding: 0 }}
          >
            <span className="ms" style={{ fontSize: 24 }}>close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

