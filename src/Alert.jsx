import React from "react";
import { C, T, TYPE, FONT_BODY } from "./tokens.js";

/* ────────────────────────────────────────────────────────────────
   Codex Foundation, Alert L (component set key f57f121f…6728).

   Read off the library rather than eyeballed: a 4px box with 16px of
   padding, a 24px icon at the left with 8px beside it, the title at
   20/120% in #292929, the message at 14/140%, and an optional action
   under the message with 8px above it. Dismissible adds a 20px close at
   the right. The four Types differ only in ground colour and icon:

     Info     #e2f3fc   info
     Success  #d7f4e0   done
     Warning  #fcf3c9   warning
     Error    #ffe1e1   error

   Two departures, both to keep it consistent with this prototype rather
   than to restyle it. The library sets Inter because that is what the
   Figma library uses; the site sets proxima-nova, so the type comes from
   our tokens at the library's sizes. And the icons are Material Symbols,
   which is what the whole prototype draws icons with.

   INFO IS NOT A WARNING. It is the neutral member of the set.

   NOT CURRENTLY ON A SCREEN. It was built for the profit calculator's
   scope line and then taken off it: an alert is for state, and that line
   is standing copy that never changes. Kept because the surfaces that DO
   have state are specified and coming — the proof requirement's banners
   (Stacey's Proof Requirement file) are non-dismissible, they clear
   themselves while a buyer has the page open, and they are the shape this
   component exists for.
   ──────────────────────────────────────────────────────────────── */
const TYPES = {
  info:    { bg: "#e2f3fc", icon: "info" },
  success: { bg: "#d7f4e0", icon: "done" },
  warning: { bg: "#fcf3c9", icon: "warning" },
  error:   { bg: "#ffe1e1", icon: "error" },
};

export default function Alert({ type = "info", title, children, action, onAction, onDismiss }) {
  const t = TYPES[type] ?? TYPES.info;

  return (
    <div style={{
      background: t.bg, borderRadius: 4, padding: 16,
      display: "flex", alignItems: "flex-start", gap: 4, fontFamily: FONT_BODY,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flex: "1 1 auto", minWidth: 0 }}>
        <span className="ms" style={{ fontSize: 24, color: C.gray950, flex: "0 0 auto" }}>{t.icon}</span>

        <div style={{ minWidth: 0, display: "grid" }}>
          {title && (
            <div style={{ fontSize: TYPE.xl, fontWeight: 500, lineHeight: 1.2, color: C.gray950 }}>
              {title}
            </div>
          )}
          {children && (
            <div style={{ fontSize: TYPE.sm, lineHeight: 1.4, color: C.gray950, marginTop: title ? 4 : 0 }}>
              {children}
            </div>
          )}
          {action && (
            <div style={{ paddingTop: 8 }}>
              <button
                onClick={onAction}
                style={{
                  font: "inherit", fontSize: TYPE.sm, fontWeight: 700, color: T.textBrand,
                  background: "transparent", border: 0, padding: 0, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 4,
                }}
              >
                {action}
                <span className="ms" style={{ fontSize: 18 }}>arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{
            background: "transparent", border: 0, padding: 0, cursor: "pointer",
            flex: "0 0 auto", color: C.gray950, lineHeight: 0,
          }}
        >
          <span className="ms" style={{ fontSize: 20 }}>close</span>
        </button>
      )}
    </div>
  );
}
