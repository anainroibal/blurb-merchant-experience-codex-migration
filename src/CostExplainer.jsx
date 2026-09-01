import React, { useState } from "react";
import { C, T, TYPE, R, FONT_BODY } from "./tokens.js";

/* ────────────────────────────────────────────────────────────────
   "Why the margin is yours"

   A seller sees a cost far below what a copy sells for, and two wrong
   conclusions are sitting right there: that makers are overcharged, or
   that selling gets a discount they are passing on.

   The real answer is about WORK, not roles or kinds of number. A retail
   price pays for more than printing: it covers running the shop —
   marketing, the site, the traffic. A seller doing their own promotion
   carries that cost themselves, so the margin it would have paid for is
   handed to them.

   Stated in general, never as a per-sale condition. An earlier version
   read "when we find the buyer / when you find the buyer", which implied
   the split could flip case by case. It cannot: in an Instant Store the
   seller always brings the buyer. Conditional phrasing invented a
   variable that does not exist.

   That reframes the whole thing. It is not a discount off a price, it is
   payment for the part of the job the seller did. It also says the true
   thing about who an Instant Store is for: someone with an audience they
   brought themselves.

   ⚠️ NO FIGURES HERE. Not the retail price, and not the print cost
   either. The seller's cost is already on screen in the ladder, where it
   belongs — repeating it inside an explanation of the margin turns the
   panel into a worked example of Blurb's markup. The explanation is about
   what the money is FOR; the numbers live in the calculation.

   ⚠️ IT DOES NOT QUOTE THE RETAIL PRICE. An earlier version set retail
   and fulfilment side by side and explained the gap between them, which
   is Blurb's own margin, published, with the arithmetic done for the
   reader. The seller can look up a retail price whenever they like; what
   this panel must not do is put the two numbers together and narrate the
   difference. Hence the role explanation without the second figure.

   Same reason the repo rule says the fulfilment price is a line in a
   calculation and never a price tag.

   ⚠️ IT NAMES THE OTHER ROUTES, AND COMPARES NONE OF THEM (Ana,
   DES-482). The ladder above it prices an Instant Store sale and nothing
   else, so an explanation of why the seller keeps the margin has to say
   where that stops being true: through the Bookstore, Amazon or Ingram
   the buyer's price is not the seller's to set and the channel takes its
   cut. One sentence, then a door to the Sell page, which is the one
   place the four routes are compared. Rebuilding any part of that table
   here would be a third answer to a question already answered twice.

   Closed by default: it should not lecture anyone who never wondered.
   ──────────────────────────────────────────────────────────────── */
export default function CostExplainer({ compact }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      background: compact ? "transparent" : C.gray50,
      border: compact ? 0 : `1px solid ${T.border}`,
      borderTop: compact ? `1px solid ${T.border}` : undefined,
      borderRadius: compact ? 0 : R.md,
      padding: compact ? "12px 0 0" : 16,
      display: "grid", gap: 10, fontFamily: FONT_BODY,
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
          background: "transparent", border: 0, padding: 0, width: "100%",
          fontFamily: FONT_BODY, textAlign: "left", color: T.textBrand,
        }}
      >
        <span style={{ fontSize: TYPE.sm, fontWeight: 700, lineHeight: 1.4 }}>
          Why you pay less on your Instant Store
        </span>
        <span className="ms turn" style={{ fontSize: 20, transform: open ? "rotate(180deg)" : "none" }}>
          expand_more
        </span>
      </button>

      {open && (
        <div className="fade-in" style={{ display: "grid", gap: 12 }}>
          <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.5, color: T.textNeutral, fontWeight: 700 }}>
            You do the selling, so you keep the margin.
          </p>

          <p style={{ margin: 0, fontSize: TYPE.sm, lineHeight: 1.65, color: T.textNeutral }}>
            A retail price covers more than printing. It pays for the shopfront — the marketing, the site,
            the traffic that brings buyers in.
          </p>
          <p style={{ margin: 0, fontSize: TYPE.sm, lineHeight: 1.65, color: T.textNeutral }}>
            You bring your own buyers, so that part is your work. You pay for printing, set your own price,
            and the margin is yours.
          </p>

          <p style={{ margin: 0, fontSize: TYPE.sm, lineHeight: 1.6, color: T.textSubtle }}>
            We print. You publish. Nobody takes a cut of your audience.
          </p>

          {/* Where this stops being true. The other three routes find the
              buyer for you, which is the work the margin pays for, so they
              price the other way round: the channel sets what the buyer
              pays and takes its cut from it. */}
          <p style={{ margin: 0, fontSize: TYPE.sm, lineHeight: 1.65, color: T.textNeutral }}>
            It works this way in your Instant Store, where you bring the buyer. Sell through the Blurb
            Bookstore, Amazon or Ingram and they bring the buyer instead, so your price sits on top of a
            base price and the channel takes its cut of the sale.
          </p>
        </div>
      )}
    </div>
  );
}
