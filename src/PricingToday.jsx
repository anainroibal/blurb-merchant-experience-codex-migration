import React from "react";
import { C, T, TYPE, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import FormatCards from "./FormatCards.jsx";
import PricingTables from "./PricingTables.jsx";
import { sellableSentence } from "./catalog.js";
import InstantStoreLane from "./InstantStoreLane.jsx";
import Faq from "./Faq.jsx";

/* ────────────────────────────────────────────────────────────────
   /pricing as it is today — the LEAN scope's version of this page.

   Ana, DES-482 #19: "do you think rebuilding this page is required for
   launch? To minimise scope I'd rather identify required changes to the
   existing pricing calculator, rather than a whole rebuild of the page,
   which feels like a nice to have."

   This is the answer in prototype form. The page keeps its shape — the
   live heading and lede, the format cards, the five price tables and the
   volume discounts, the live FAQ questions — and the ONE change is the
   Instant Store lane after the tables. That is the whole ask of
   engineering on this surface in the lean scope, and it is reviewable
   against the live page side by side.

   The recommended scope still swaps this page for the calculator
   (Estimator, mode=make). Both are in the prototype so the choice can be
   made by looking rather than by argument.

   The lane goes AFTER the tables for the same reason it goes after the
   grid on the catalogue: someone reading a price list is choosing a
   product, and selling is the second question. No figures on it.
   ──────────────────────────────────────────────────────────────── */

/* The live page's own questions, cut to what they answer. */
const FAQS = [
  ["How much will it cost to print my project?",
   <p style={{ margin: 0 }}>
     It depends on the format, the size, the paper and the page count. The tables above price every
     combination that can be made; pick a row and a column and that is the price of one copy.
   </p>],
  ["What is the most affordable format?",
   <p style={{ margin: 0 }}>
     Trade books. Black and white on economy paper is the cheapest way to print a lot of pages, which is
     why most novels are made that way.
   </p>],
  ["Can I order just one copy?",
   <p style={{ margin: 0 }}>
     Yes. Every price above is for a single copy, and there is no minimum order. Discounts start at ten.
   </p>],
  ["Does Blurb offer volume pricing?",
   <p style={{ margin: 0 }}>
     Yes, from ten copies, and the bands are in the volume table above. Past a hundred copies, Large Order
     Services quotes the run instead.
   </p>],
  ["Can I upgrade to a different paper later?",
   <p style={{ margin: 0 }}>
     Up to the moment you order. The paper is part of the book's specification, so changing it re-prices the
     book and cannot be done after a copy is printed.
   </p>],
];

export default function PricingToday({ onGo }) {
  return (
    <div style={{ fontFamily: FONT_BODY, color: T.textNeutral }}>
      {/* The live hero: the gradient band, the page's own heading and line. */}
      <section style={{
        background: "linear-gradient(100deg, #e9ecef 0%, #f6f3ef 45%, #ebebeb 100%)",
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(48px, 7vw, 88px) 20px", textAlign: "center" }}>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, letterSpacing: "-0.01em",
            fontSize: "clamp(2rem, 4.6vw, 2.75rem)", lineHeight: 1.16, margin: 0, color: C.gray950,
          }}>
            Compare products &amp; pricing
          </h1>
          <p style={{ fontSize: TYPE.base, color: C.gray950, lineHeight: 1.6, margin: "14px auto 0", maxWidth: 640 }}>
            Whatever your vision or budget, we have a format that fits.
          </p>
        </div>
      </section>

      <section style={{ padding: "clamp(32px, 5vw, 56px) 16px clamp(48px, 6vw, 72px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gap: 48 }}>
          {/* The cards as the live page has them: a way into the tables,
              not a control. Nothing is selected, so nothing is filtered. */}
          <FormatCards
            formatId={null}
            onPick={() => {}}
            note={
              <>
                Save more when you print in bulk. Learn about{" "}
                <span style={{ color: T.textBrand, textDecoration: "underline" }}>volume discounts</span>.
              </>
            }
          />

          <PricingTables />

          {/* ── The one change this page makes in the lean scope ── */}
          <InstantStoreLane
            title="Making it to sell? Open an Instant Store"
            isNew
            onGo={() => onGo?.("instantstore")}
          >
            {sellableSentence()} can be sold from one link you share. You set the price, we print and ship
            every order, and there is no shopfront to run.
          </InstantStoreLane>
        </div>
      </section>

      <Faq heading={<>Product and<br />pricing FAQs</>} items={FAQS} />
    </div>
  );
}
