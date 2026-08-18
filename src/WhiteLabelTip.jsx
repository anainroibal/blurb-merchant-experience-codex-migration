import React, { useState, useRef, useEffect } from "react";
import { C, T, TYPE, R, FONT_BODY } from "./tokens.js";

/* ────────────────────────────────────────────────────────────────
   What "white label" actually removes.

   Every Blurb book carries a small Blurb mark on the last page. Most
   people never notice it; a seller shipping to their own customers
   usually does. Rather than say "remove our logo" — which draws
   attention to something they hadn't thought about — the option is
   sold as branding, and this explains the detail on demand.

   The sample is a drawn diagram, not a photograph. It shows position
   and relative size honestly without pretending to be the real thing.
   ──────────────────────────────────────────────────────────────── */

function BackPageSample() {
  return (
    <svg viewBox="0 0 260 150" width="100%" role="img" aria-label="Diagram of a book's last page, with a small Blurb mark centred near the foot of the page">
      <title>Where the mark sits today</title>
      {/* spread */}
      <rect x="8" y="8" width="244" height="134" rx="4" fill={C.gray100} />
      <rect x="12" y="12" width="118" height="126" rx="3" fill="#fff" stroke={C.gray200} />
      <rect x="130" y="12" width="118" height="126" rx="3" fill="#fff" stroke={C.gray200} />
      <line x1="130" y1="12" x2="130" y2="138" stroke={C.gray200} />

      {/* body text on the left page */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <rect key={i} x="24" y={30 + i * 12} width={i === 5 ? 52 : 94} height="4" rx="2" fill={C.gray200} />
      ))}

      {/* the mark, on the last page */}
      <g>
        <rect x="164" y="112" width="50" height="9" rx="2" fill={C.gray400} />
        <circle cx="221" cy="116.5" r="4.5" fill={C.gray400} />
      </g>

      {/* callout */}
      <line x1="189" y1="108" x2="189" y2="86" stroke={C.blue600} strokeWidth="1.5" />
      <circle cx="189" cy="84" r="3" fill={C.blue600} />
      <rect x="140" y="60" width="98" height="20" rx="4" fill={C.blue600} />
      <text x="189" y="74" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">
        Blurb mark
      </text>
    </svg>
  );
}

export default function WhiteLabelTip() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = e => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex", flex: "0 0 auto" }}>
      <span
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label="What white label changes"
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); setOpen(o => !o); } }}
        style={{ display: "inline-grid", placeItems: "center", cursor: "pointer", color: open ? C.blue600 : C.gray400 }}
      >
        <span className="ms" style={{ fontSize: 16 }}>info</span>
      </span>

      {open && (
        <span
          onClick={e => e.stopPropagation()}
          style={{
            position: "absolute", bottom: "calc(100% + 10px)", right: -8, zIndex: 40,
            width: 268, background: T.bgNeutral, border: `1px solid ${T.border}`,
            borderRadius: R.lg, boxShadow: "0 14px 34px rgba(0,0,0,0.16)",
            padding: 14, display: "grid", gap: 10,
            fontFamily: FONT_BODY, textAlign: "left", cursor: "default",
          }}
        >
          <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>
            White label
          </span>
          <span style={{ fontSize: TYPE.sm, lineHeight: 1.55, color: T.textSubtle, display: "block" }}>
            Every Blurb book carries a small Blurb mark on its last page. Choose white label and the book
            ships without it, so what your buyer holds is entirely yours.
          </span>
          <span style={{ display: "block", border: `1px solid ${T.border}`, borderRadius: R.sm, overflow: "hidden" }}>
            <BackPageSample />
          </span>
          <span style={{ fontSize: TYPE.sm, color: T.textSubtle, display: "block", lineHeight: 1.45 }}>
            Diagram, not to scale.
          </span>
        </span>
      )}
    </span>
  );
}
