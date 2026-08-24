import React, { useState } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";

/* ────────────────────────────────────────────────────────────────
   The ways to sell.

   The card set and its structure are ours; the value proposition on
   each card is Ana's (meeting item 1). So every card here carries the
   same four facts in the same order, and one line at the top that is
   hers to write.

   Those lines are now DRAFTED rather than left blank — second person,
   plain words, one idea each, no exclamation marks, the voice the rest
   of blurb.com uses. Reacting to a sentence is faster than starting at
   an empty slot, and a draft shows how long the line can run before the
   card breaks. Every one of them is Ana's to overwrite.

   The four facts are the ones a seller actually decides on:
     · who it suits
     · what the buyer pays
     · what you earn
     · when you get paid

   Fee structures are sourced from blurb.com. Margins are not — Blurb
   publishes no fulfilment pricing, so anything resembling a margin
   figure is deliberately absent rather than invented.
   ──────────────────────────────────────────────────────────────── */

const BASIS = {
  fulfilment: { label: "Fulfilment price", tone: "brand" },
  list:       { label: "List price",       tone: "neutral" },
  quoted:     { label: "Quoted",           tone: "neutral" },
};

const CHANNELS = [
  {
    id: "link",
    name: "Checkout links",
    isNew: true,
    prop: "One link, one book — share it anywhere you can paste a link.",
    suits: "Anyone with an audience and no shop — a newsletter, a talk, a stall, a bio link.",
    basis: "fulfilment",
    buyerPays: "Your price, plus Blurb shipping",
    youEarn: "Your price minus the fulfilment price. You set the price.",
    paid: "PayPal, at a set cadence",
    setup: "Lowest of any channel — one link per project",
    sourced: false,
  },
  {
    id: "bookstore",
    name: "Blurb Bookstore",
    prop: "Put your book somewhere readers are already browsing.",
    suits: "Sellers who want a listing without running anything themselves.",
    basis: "list",
    buyerPays: "Your list price, plus shipping",
    youEarn: "List price minus print cost. No listing fees, and you keep 100% of the profit.",
    paid: "Monthly",
    setup: "List it and you are done",
    sourced: true,
  },
  {
    id: "amazon",
    name: "Amazon",
    prop: "Reach the readers who would never think to look for you.",
    suits: "Reach over margin — buyers who would never come to Blurb.",
    basis: "list",
    buyerPays: "Your list price. Shipping depends on the buyer's Prime status.",
    youEarn: "List price minus print cost, minus Amazon's fee of $1.35 + 15% of list.",
    paid: "Up to 60 days after the sale",
    setup: "Distribution setup, then Amazon's own review",
    sourced: true,
  },
  {
    id: "ingram",
    name: "Ingram",
    prop: "Get your book onto the shelves of bookshops and libraries.",
    suits: "Getting into bookshops and libraries, where a trade discount is expected.",
    basis: "list",
    buyerPays: "Whatever the retailer decides. Not set by you.",
    youEarn: "List price minus the wholesale discount you set for retailers, minus print cost.",
    paid: "Up to four months",
    setup: "Trade metadata, and a discount decision",
    sourced: true,
  },
  {
    id: "api",
    name: "API printing",
    prop: "Your storefront, your brand — our presses behind it.",
    /* SETTLED 2026-08-18: API printing is a way to sell, not a candidate
       for one. It is how a business connects its own store to Blurb's
       print service. Large Order Services is a separate route — you buy
       the stock and distribute it — and the two were never alternatives
       for the same slot. */
    suits: "Businesses with their own store, connecting it to our print service.",
    basis: "quoted",
    buyerPays: "Whatever your own store charges",
    youEarn: "Your price minus what you pay Blurb. No setup fees, no minimums.",
    paid: "Through your own store",
    setup: "Engineering — an API integration",
    sourced: true,
  },
];

function Chip({ children, tone = "neutral", solid }) {
  const brand = tone === "brand";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 999, whiteSpace: "nowrap",
      fontSize: TYPE.sm, fontWeight: 700,
      background: solid ? C.blue600 : brand ? C.blue50 : C.gray100,
      color: solid ? "#fff" : brand ? C.blue950 : T.textSubtle,
      border: `1px solid ${solid ? "transparent" : brand ? C.blue100 : T.border}`,
    }}>
      {children}
    </span>
  );
}

function Fact({ label, children }) {
  return (
    <div style={{ display: "grid", gap: 3 }}>
      <div style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: T.textSubtle }}>
        {label}
      </div>
      <div style={{ fontSize: TYPE.base, lineHeight: 1.55, color: T.textNeutral }}>{children}</div>
    </div>
  );
}

function Card({ c }) {
  const basis = BASIS[c.basis];
  return (
    <div
      style={{
        background: T.bgNeutral, borderRadius: R.lg, padding: 24,
        border: c.isNew ? `2px solid ${T.borderBrand}` : `1px solid ${T.border}`,
        margin: c.isNew ? 0 : 1,
        display: "grid", gap: 16, alignContent: "start", minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["5xl"], fontWeight: 500, lineHeight: 1.15 }}>
          {c.name}
        </span>
        {c.isNew && <Chip solid>New</Chip>}
      </div>

      <div style={{
        fontSize: TYPE.lg, lineHeight: 1.5, color: T.textSubtle, fontStyle: "italic",
        background: C.gray50, border: `1px dashed ${T.borderStrong}`, borderRadius: R.md, padding: "12px 14px",
      }}>
        {c.prop}
      </div>

      <Chip tone={basis.tone}>{basis.label}</Chip>

      <div style={{ display: "grid", gap: 14, borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
        <Fact label="Who it suits">{c.suits}</Fact>
        <Fact label="What your buyer pays">{c.buyerPays}</Fact>
        <Fact label="What you earn">{c.youEarn}</Fact>
        <Fact label="When you are paid">{c.paid}</Fact>
        <Fact label="Setup">{c.setup}</Fact>
      </div>

    </div>
  );
}

export default function WaysToSell({ onGo }) {
  const [showProps, setShowProps] = useState(true);
  return (
    <div style={{ fontFamily: FONT_BODY, color: T.textNeutral }}>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 24px 24px", textAlign: "center" }}>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: "clamp(2rem, 4.5vw, 3rem)", lineHeight: 1.15, margin: 0 }}>
          Five ways to sell your book
        </h1>
        <p style={{ fontSize: TYPE.xl, lineHeight: 1.55, color: T.textSubtle, maxWidth: 680, margin: "16px auto 0" }}>
          Same book, five routes to a buyer. They differ in who finds it, what your buyer pays, and how much
          of it you keep.
        </p>
      </section>

      <section style={{ background: T.bgSubtle, borderTop: `1px solid ${T.border}`, padding: "36px 24px 72px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 16, flexWrap: "wrap", marginBottom: 20,
          }}>
            <div style={{ fontSize: TYPE.sm, color: T.textSubtle, maxWidth: 720, lineHeight: 1.55 }}>
              Every card carries the same four facts in the same order, so they can be compared down the column
              rather than read one at a time. Fee structures are from blurb.com; no margin figures appear, because
              Blurb publishes no fulfilment pricing.
            </div>
            <button
              onClick={() => setShowProps(s => !s)}
              style={{
                height: 32, padding: "0 14px", borderRadius: 999, fontFamily: FONT_BODY,
                fontSize: TYPE.sm, fontWeight: 700, background: "#fff",
                border: `1px solid ${T.border}`, color: T.textBrand, whiteSpace: "nowrap",
              }}
            >
              {showProps ? "Hide copy slots" : "Show copy slots"}
            </button>
          </div>

          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {CHANNELS.map(c => (
              <Card key={c.id} c={showProps ? c : { ...c, prop: null }} />
            ))}
          </div>

          <div style={{
            marginTop: 24, background: "#fff", border: `1px solid ${T.border}`,
            borderRadius: R.lg, padding: 20, display: "grid", gap: 8, maxWidth: 900,
          }}>
            <div style={{ fontSize: TYPE.base, fontWeight: 700 }}>Applies to every channel</div>
            <div style={{ fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.65 }}>
              A US $25 minimum before any payout is released. Volume discounts are retail-only and never apply
              to fulfilment pricing. And every book needs a proof — order and review one copy before it goes on
              sale, whichever route you choose.
            </div>
          </div>

          {/* ── The way out ──
              This page ended nowhere, which made the home page's Sell card
              carry two actions to make up for it. Comparison before
              commitment is the rule: the choice of route is made here, so
              the step that acts on it belongs here too — once, at the end,
              after the facts that justify it. */}
          <div style={{
            marginTop: 24, background: "#fff", border: `1px solid ${T.border}`,
            borderRadius: R.lg, padding: 24, maxWidth: 900,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap",
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["4xl"], fontWeight: 500, lineHeight: 1.2 }}>
                Picked your route?
              </div>
              <p style={{ margin: "6px 0 0", fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.6 }}>
                Every one of them starts with a book. Choose the product, set your price, and see what you keep
                before you commit to any of this.
              </p>
            </div>
            <button
              onClick={() => onGo?.("getstarted", { route: "sell" })}
              style={{
                fontFamily: FONT_BODY, fontSize: TYPE.lg, fontWeight: 600, minHeight: 48, padding: "0 26px",
                borderRadius: R.md, border: 0, cursor: "pointer",
                background: T.bgBrand, color: T.textInverse, whiteSpace: "nowrap",
              }}
            >
              Start a book to sell
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
