import React from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import { CATALOG, formatsFor } from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   Step one — pick the type of product.

   This is the row the live page shows before any configuring: a card
   per product type, an illustration, the name, a line of Blurb's own
   copy. The selected card lifts and points down at the configurator.

   The live page stars the types that suit selling. We narrow the set
   instead: under "to Sell" a PDF card is simply absent, because a PDF
   cannot be sold through a checkout link. Withdrawing the option says
   it more plainly than decorating the ones that remain, and it leaves
   the row uniform. See `sellChannels` in catalog.js.
   ──────────────────────────────────────────────────────────────── */

function TypeCard({ id, selected, onSelect }) {
  const f = CATALOG[id];
  return (
    <button
      onClick={() => onSelect(id)}
      aria-pressed={selected}
      style={{
        textAlign: "center", height: "100%",
        background: selected ? T.bgNeutral : "transparent",
        border: selected ? `1px solid ${T.border}` : "1px solid transparent",
        borderBottom: selected ? `4px solid ${T.bgBrand}` : "1px solid transparent",
        borderRadius: `${R.lg}px ${R.lg}px 0 0`,
        boxShadow: selected ? "0 8px 28px rgba(0,0,0,0.09)" : "none",
        padding: "28px 20px 24px",
        /* thumbnail · title · description — fixed rows keep the row aligned
           however long the descriptions run */
        display: "grid", gridTemplateRows: "auto auto 1fr",
        justifyItems: "center", gap: 12,
        fontFamily: FONT_BODY, minWidth: 0,
      }}
    >
      <div
        style={{
          width: "100%", maxWidth: 190, aspectRatio: "4 / 3",
          background: selected ? C.blue50 : C.gray100,
          borderRadius: R.md, display: "grid", placeItems: "center",
        }}
      >
        <span className="ms" style={{ fontSize: 46, color: selected ? C.blue600 : C.gray400 }}>
          {id === "pdf" ? "tablet_mac" : id === "magazine" ? "auto_stories" : "menu_book"}
        </span>
      </div>

      <div style={{
        fontFamily: FONT_DISPLAY, fontSize: TYPE["4xl"], fontWeight: 500,
        color: selected ? C.blue600 : T.textNeutral, lineHeight: 1.2,
      }}>
        {f.label}
      </div>

      <div style={{ fontSize: TYPE.sm, lineHeight: 1.55, color: T.textSubtle, maxWidth: 280 }}>
        {f.blurb}
      </div>
    </button>
  );
}

export default function ProductTypes({ format, intention, onSelect }) {
  const ids = formatsFor(intention);
  return (
    <div>
      <div
        style={{
          display: "grid", gap: 16, alignItems: "stretch",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
        }}
      >
        {ids.map(id => (
          <TypeCard
            key={id}
            id={id}
            selected={format === id}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* the pointer the live page draws from the chosen card down into the configurator */}
      {format && (
        <div style={{ position: "relative", height: 0 }}>
          <div
            aria-hidden
            style={{
              position: "absolute", top: 0,
              left: `calc(${(ids.indexOf(format) + 0.5) * (100 / ids.length)}% - 11px)`,
              width: 0, height: 0,
              borderLeft: "11px solid transparent",
              borderRight: "11px solid transparent",
              borderTop: `11px solid ${T.bgBrand}`,
            }}
          />
        </div>
      )}
    </div>
  );
}
