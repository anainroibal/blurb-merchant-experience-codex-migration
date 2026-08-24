import React from "react";
import { T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";

/* ── A modal, for the things that are not part of the decision ──
   The 8/21 pod's read of "one page, one goal": what you dip into and come
   back from belongs behind a layer, not in the column where the decision is
   being made. First use is shipping on the selling side — the buyer pays it,
   so it must never share space with the seller's margin.

   Deliberately small: backdrop click and Escape close it, and it is not
   focus-trapped. A prototype needs the separation to be legible, not a
   production dialog.

   TWO SHAPES, one component. `variant="center"` is the dialog above; the
   PDP's Details links open `variant="side"` — a tray against the right
   edge, full height, wide enough to hold the options again beside a
   photograph of the one you are reading about. Same scrim, same Escape,
   same backdrop click, because they are the same idea at different sizes:
   step aside, read, come back. */
export default function Modal({ open, title, onClose, children, variant = "center" }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const side = variant === "side";
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,0,0,0.4)",
        display: side ? "flex" : "grid",
        justifyContent: side ? "flex-end" : undefined,
        placeItems: side ? undefined : "center",
        padding: side ? 0 : 20,
      }}
    >
      <div
        className={side ? "tray-in" : "pop-in"}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={e => e.stopPropagation()}
        style={{
          background: T.bgNeutral, fontFamily: FONT_BODY,
          display: "grid", gap: 14, alignContent: "start",
          ...(side
            ? {
                width: "min(590px, 100%)", height: "100%", overflowY: "auto",
                padding: "28px 32px 40px", borderRadius: 0,
                boxShadow: "-8px 0 30px rgba(0,0,0,0.18)",
              }
            : {
                borderRadius: R.lg, maxWidth: 560, width: "100%",
                maxHeight: "85vh", overflowY: "auto", padding: 24,
                boxShadow: "0 24px 60px rgba(0,0,0,0.24)",
              }),
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16 }}>
          <span style={{
            fontFamily: side ? FONT_BODY : FONT_DISPLAY,
            fontSize: side ? TYPE["3xl"] : TYPE["4xl"],
            fontWeight: side ? 700 : 500, lineHeight: 1.2,
          }}>
            {title}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "transparent", border: 0, cursor: "pointer", padding: 0,
              color: side ? T.textBrand : T.textSubtle,
              font: "inherit", fontSize: TYPE.base, fontWeight: 500,
              display: "inline-flex", alignItems: "center", gap: 4, flex: "0 0 auto",
            }}
          >
            {side && "Close"}
            <span className="ms" style={{ fontSize: side ? 20 : 24 }}>close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

