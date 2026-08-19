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

   The star returns for a different job. Once someone has said what they
   are MAKING, this step stops being a question and becomes an answer:
   the recommended product leads the row, wears the star, and carries the
   reason it was chosen. The alternatives stay — all of them, in full.
   A star with a reason is help; a star on its own is decoration, which
   is the complaint the audit raised against the live page.
   ──────────────────────────────────────────────────────────────── */

/* Stand-ins until the real product photography goes in. */
const ICONS = {
  pdf: "tablet_mac",
  magazine: "auto_stories",
  notebook: "edit_note",
  wallart: "image",
};

/* "a art book". Every kind in the list starts with a hard consonant or a
   plain vowel, so the letter is enough — no need for a pronunciation table. */
const article = word => ("aeiou".includes(word[0].toLowerCase()) ? "an" : "a");

function TypeCard({ id, selected, onSelect, recommended, kindLabel }) {
  const f = CATALOG[id];
  return (
    <button
      onClick={() => onSelect(id)}
      aria-pressed={selected}
      className="card-move"
      style={{
        position: "relative",
        textAlign: "center", height: "100%",
        background: selected ? T.bgNeutral : "transparent",
        border: selected ? `1px solid ${T.border}` : "1px solid transparent",
        borderBottom: selected ? `4px solid ${T.bgBrand}` : "1px solid transparent",
        borderRadius: `${R.lg}px ${R.lg}px 0 0`,
        boxShadow: selected ? "0 8px 28px rgba(0,0,0,0.09)" : "none",
        padding: "28px 20px 24px",
        /* chip · thumbnail · title · description — fixed rows keep the row
           aligned however long the descriptions run */
        display: "grid", gridTemplateRows: "auto auto auto 1fr",
        justifyItems: "center", gap: 12,
        fontFamily: FONT_BODY, minWidth: 0,
      }}
    >
      {/* Always rendered, so every card in the row keeps the same rows and
          the thumbnails stay on one line. The chip says only "Recommended":
          naming the kind here — BEST FOR A CHILDREN'S BOOK — ran wider than
          the card at every size. That sentence belongs under the row, where
          there is room to give the reason with it. */}
      <span style={{ minHeight: 24, display: "grid", placeItems: "center" }}>
        {recommended && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
            padding: "3px 12px", borderRadius: 999,
            background: C.blue600, color: "#fff",
            fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
          }}>
            <span className="ms" style={{ fontSize: 14 }}>star</span>
            Recommended
          </span>
        )}
      </span>

      <div
        style={{
          width: "100%", maxWidth: 190, aspectRatio: "4 / 3",
          background: selected ? C.blue50 : C.gray100,
          borderRadius: R.md, display: "grid", placeItems: "center",
        }}
      >
        <span className="ms" style={{ fontSize: 46, color: selected ? C.blue600 : C.gray400 }}>
          {ICONS[id] ?? "menu_book"}
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

export default function ProductTypes({ format, route, use, onSelect, recommended, why, kindLabel }) {
  const all = formatsFor(route, use);
  /* The recommendation leads the row. Nothing is removed — refusing it is
     one click, and the reason for it is stated rather than implied. */
  const ids = recommended && all.includes(recommended)
    ? [recommended, ...all.filter(id => id !== recommended)]
    : all;

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
            recommended={id === recommended}
            kindLabel={kindLabel}
          />
        ))}
      </div>

      {why && (
        <p style={{
          fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.6,
          textAlign: "center", maxWidth: 660, margin: "18px auto 0",
        }}>
          {kindLabel && (
            <strong style={{ color: T.textNeutral, fontWeight: 600 }}>
              Recommended for {article(kindLabel)} {kindLabel.toLowerCase()} —{" "}
            </strong>
          )}
          {why}{" "}
          {format !== recommended && (
            <span style={{ color: T.textNeutral, fontWeight: 600 }}>
              You've chosen {CATALOG[format]?.label.toLowerCase()} instead — everything below follows that.
            </span>
          )}
        </p>
      )}
    </div>
  );
}
