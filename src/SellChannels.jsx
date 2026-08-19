import React, { useState } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";
import { SELL_CHANNELS, money, channelsFor, channelBlockedBecause } from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   Sell and distribute — comparing the routes to market.

   The page has been answering "what will this book earn me?" with one
   number, as though there were one way to sell it. There are five, and
   the channel moves the margin more than any choice above it does: the
   same book at the same price keeps its full margin through a checkout
   link and loses $1.35 + 15% of list through Amazon.

   So the comparison is here, against the book actually configured,
   rather than as a table of percentages somewhere else. Comparison
   before commitment: pick the route, THEN set the link up.

   The route with the best margin is not automatically the right one —
   Amazon costs the most and reaches people who would never come to
   Blurb. So this ranks nothing. It shows what each one pays, what it
   asks, and who it suits, and lets the seller decide.

   NOTE: this overlaps the estimator screen, where the audit put the
   channel comparison. If the estimator gets built as a separate public
   page, one of the two should own this and the other should link to it.
   ──────────────────────────────────────────────────────────────── */

/* Three ways a book leaves Blurb. The first is not here because it is not
   selling — it is the "For yourself" half of the intention at the top of
   the page, and naming it in the intro keeps the model whole rather than
   letting these two look like the only options that exist. */
const MODES = [
  {
    id: "pod",
    label: "Print on demand",
    blurb: "Someone else buys, we print and ship each copy. No stock, nothing paid up front — and each channel takes a different cut.",
  },
  {
    id: "bulk",
    label: "Buy in bulk and distribute yourself",
    blurb: "You buy the copies and sell them on your own terms. You pay up front and carry the stock; nobody takes a cut, because Blurb is not part of the sale.",
  },
];

function ChannelRow({ ch, price, cost, selected, onSelect, blocked }) {
  const net = ch.net(price, cost);
  const known = net !== null && Number.isFinite(net);

  return (
    <button
      onClick={() => onSelect(ch.id)}
      aria-pressed={selected}
      className="card-move"
      style={{
        textAlign: "left", width: "100%", borderRadius: R.md,
        background: blocked ? C.gray50 : T.bgNeutral,
        opacity: blocked ? 0.75 : 1,
        border: selected && !blocked ? `2px solid ${T.borderBrand}` : `1px solid ${T.border}`,
        margin: selected ? 0 : 1, padding: 16,
        display: "grid", gap: 12, alignItems: "center",
        gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1.5fr) auto",
        fontFamily: FONT_BODY, minWidth: 0,
      }}
    >
      <span style={{ display: "grid", gap: 4, minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 500, lineHeight: 1.2,
            color: selected ? C.blue950 : T.textNeutral,
          }}>
            {ch.name}
          </span>
          {ch.isNew && (
            <span style={{
              padding: "2px 8px", borderRadius: 999, background: C.blue600, color: "#fff",
              fontSize: 11, fontWeight: 700, letterSpacing: 0.3, textTransform: "uppercase",
            }}>New</span>
          )}
        </span>
        <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>
          {blocked ?? ch.suits}
        </span>
      </span>

      <span style={{ display: "grid", gap: 3, fontSize: TYPE.sm, color: T.textSubtle, minWidth: 0 }}>
        <span><strong style={{ color: T.textNeutral }}>Buyer pays:</strong> {ch.buyerPays}</span>
        <span><strong style={{ color: T.textNeutral }}>Takes:</strong> {ch.takes}</span>
        <span><strong style={{ color: T.textNeutral }}>Paid:</strong> {ch.paid}</span>
      </span>

      <span style={{ display: "grid", gap: 4, justifyItems: "end", flex: "0 0 auto" }}>
        <span style={{ fontSize: TYPE.sm, color: T.textSubtle, whiteSpace: "nowrap" }}>You keep</span>
        <span style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700, lineHeight: 1,
          fontSize: blocked ? TYPE.base : TYPE["4xl"],
          color: blocked ? T.textSubtle : known ? (net > 0 ? C.blue600 : "#b3261e") : T.textSubtle,
          whiteSpace: "nowrap",
        }}>
          {blocked ? "Not for this book" : known ? money(Math.max(0, net)) : "You set it"}
        </span>
      </span>
    </button>
  );
}

export default function SellChannels({ price, cost, formatId, sel }) {
  /* A channel this book cannot use is shown and struck through, not
     hidden. Absence looks like an oversight; a stated reason is help —
     "Amazon does not take layflat books" tells a seller what to change. */
  const allowed = formatId ? channelsFor(formatId, sel) : null;
  const [picked, setPicked] = useState("link");
  const chosen = SELL_CHANNELS.find(c => c.id === picked);

  return (
    <section style={{ marginTop: 32, fontFamily: FONT_BODY }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["5xl"], fontWeight: 500, margin: 0, lineHeight: 1.2 }}>
          Sell and distribute
        </h3>
        <p style={{
          fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.65,
          maxWidth: 660, margin: "10px auto 0",
        }}>
          Two ways to sell it, and they work differently enough that the route changes what you keep more
          than anything you chose above it. Here is the same book at {money(price)} through each.
          {" "}<span style={{ color: T.textNeutral }}>
            Buying copies for yourself is the third way — switch the intention at the top of the page.
          </span>
        </p>
      </div>

      {MODES.map(mode => (
        <div key={mode.id} style={{ marginBottom: 22 }}>
          <div style={{ display: "grid", gap: 2, margin: "0 0 10px" }}>
            <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>
              {mode.label}
            </span>
            <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.55 }}>{mode.blurb}</span>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {SELL_CHANNELS.filter(c => c.mode === mode.id).map(ch => (
              <ChannelRow
                key={ch.id} ch={ch} price={price} cost={cost}
                selected={picked === ch.id} onSelect={setPicked}
                blocked={
                  allowed && ch.mode === "pod" && ch.id !== "link" && ch.id !== "api"
                    ? (allowed.includes(ch.id) ? null : channelBlockedBecause(ch.id, formatId, sel))
                    : null
                }
              />
            ))}
          </div>
        </div>
      ))}

      <div style={{
        marginTop: 14, background: C.gray50, border: `1px solid ${T.border}`, borderRadius: R.md,
        padding: 18, display: "grid", gap: 14, gridTemplateColumns: "1fr auto", alignItems: "center",
      }} className="stack-md">
        <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.65, color: T.textNeutral }}>
          <strong>{chosen.name}</strong> — {chosen.suits} You are paid {chosen.paid.toLowerCase()}.
        </p>
        <span style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={{
            height: BUTTON_HEIGHT, padding: "0 20px", borderRadius: R.md,
            background: "transparent", color: T.textBrand, border: `1px solid ${T.border}`,
            fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 700,
            letterSpacing: 0.6, textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            Learn more
          </button>
          <button style={{
            height: BUTTON_HEIGHT, padding: "0 20px", borderRadius: R.md,
            background: T.bgBrand, color: T.textInverse, border: "1px solid transparent",
            fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 700,
            letterSpacing: 0.6, textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            Sell with {chosen.name.replace(/s$/, "")}
          </button>
        </span>
      </div>

      <div style={{
        marginTop: 14, padding: "10px 14px", borderRadius: R.md,
        background: "#fdf6ec", border: "1px solid #e6c9a0", color: "#7a4b12",
        fontSize: TYPE.sm, lineHeight: 1.55,
      }}>
        <strong>Prototype note.</strong> Blurb publishes Amazon's fee ($1.35 + 15% of list) and Ingram's
        wholesale discount (55% for the widest reach). Everything else here — what a copy costs you, and so
        every profit figure — is a placeholder, because Blurb publishes no fulfilment pricing.
        Shipping is excluded throughout: your buyer pays it.
      </div>
    </section>
  );
}
