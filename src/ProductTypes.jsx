import React from "react";
import { T, TYPE, FONT_BODY } from "./tokens.js";
import { CATALOG, formatsFor } from "./catalog.js";
import { FormatRow } from "./FormatCards.jsx";

/* ────────────────────────────────────────────────────────────────
   Step one — pick the type of product.

   The card is the /pricing card, shared from FormatCards.jsx rather
   than re-drawn here: photograph to the edges, no frame until it is
   chosen, one pattern for choosing a product across the whole
   prototype. An earlier version of this step had its own — a bordered
   box, a padded icon tile, a blue rule under the selection — which
   made the same choice look like two different controls.

   The live page stars the types that suit selling. We narrow the set
   instead: under "to Sell" a PDF card is simply absent, because a PDF
   cannot be sold through an Instant Store. Withdrawing the option says
   it more plainly than decorating the ones that remain, and it leaves
   the row uniform. See `sellChannels` in catalog.js.

   The star returns for a different job. Once someone has said what they
   are MAKING, this step stops being a question and becomes an answer:
   the recommended product leads the row, wears the chip, and carries the
   reason it was chosen. The alternatives stay — all of them, in full.
   A star with a reason is help; a star on its own is decoration, which
   is the complaint the audit raised against the live page.

   The chip is the card's own badge slot, so RECOMMENDED sits exactly
   where MOST POPULAR sits on /pricing. The reason it was recommended
   runs under the row, where there is room for a sentence — inside the
   chip it ran wider than the card at every size.
   ──────────────────────────────────────────────────────────────── */

/* "a art book". Every kind in the list starts with a hard consonant or a
   plain vowel, so the letter is enough — no need for a pronunciation table. */
const article = word => ("aeiou".includes(word[0].toLowerCase()) ? "an" : "a");

export default function ProductTypes({ format, route, use, onSelect, recommended, why, kindLabel }) {
  const all = formatsFor(route, use);
  /* The recommendation leads the row. Nothing is removed — refusing it is
     one click, and the reason for it is stated rather than implied. */
  const ids = recommended && all.includes(recommended)
    ? [recommended, ...all.filter(id => id !== recommended)]
    : all;

  return (
    <div style={{ fontFamily: FONT_BODY }}>
      <FormatRow
        ids={ids}
        formatId={format}
        onPick={onSelect}
        badgeFor={id => (id === recommended ? "Recommended" : null)}
      />

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
