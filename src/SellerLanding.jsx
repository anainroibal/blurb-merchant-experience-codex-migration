import React, { useState } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import {
  CATALOG, SELL_CHANNELS, channelsFor, channelBlockedBecause,
  defaultSelection, sellerCost, minSellPrice, money,
} from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   The seller landing page.

   This was "Ways to sell" until 2026-08-24. Same page, renamed and
   given a job: it is the light option's first piece — where someone who
   wants to sell arrives, works out which route is theirs, and leaves
   with one action. The five-channel comparison is what it is FOR, so it
   stays here rather than moving into the estimator.

   The card set and its structure are ours; the value proposition on
   each card is Ana's (meeting item 1), and she is the last reviewer
   DES-482 is waiting on. So every card carries the same four facts in
   the same order, and one line at the top that is hers to write.

   Those lines are DRAFTED rather than left blank — second person, plain
   words, one idea each, no exclamation marks, the voice the rest of
   blurb.com uses. Reacting to a sentence is faster than starting at an
   empty slot, and a draft shows how long the line can run before the
   card breaks. Every one of them is Ana's to overwrite.

   The four facts are the ones a seller actually decides on:
     · who it suits
     · what the buyer pays
     · what you earn
     · when you get paid

   ── API printing came off this page, 2026-08-24 ──
   The 8/21 pod said "API printing is not included in the selling tool"
   and it is now decided: it is not a route to market on this page. That
   REVERSES the 2026-08-18 note, which argued it was — a business's own
   store is where the selling happens and Blurb only prints behind it.
   Both readings are defensible; the room chose. What made the difference
   is nav option D: API printing is a SERVICE, and a page whose one goal
   is "which route is mine?" should not answer with an engineering
   integration.

   The 8/18 reasoning is kept beside the api channel in catalog.js rather
   than deleted, because the argument is still the argument if this ever
   comes back. Large Order Services was never on this page for the same
   reason: you buy the stock and distribute it yourself.

   So four routes, not five. Store integrations — Shopify, Etsy — would be
   the fifth when they exist, which is why they are named under the cards
   rather than compared beside them: a card here promises four facts, and
   we cannot fill them in for something unbuilt.

   ONE PAGE, ONE GOAL (8/21 rule): the goal is "which route is mine?".
   Everything here serves the comparison, and the page ends with the one
   step that follows from having chosen — nothing else.

   ── A table, not four cards, 2026-08-24 ──
   Each card carried five labelled facts, which meant the labels were
   printed four times and the eye had to travel down one card and back up
   the next to compare anything. A table prints each label once and puts
   the four answers side by side, which is the whole job of this page. It
   is also the compact form: the same information in about a third of the
   height.

   ── And a worked example at the top ──
   "What you earn" as a sentence is unreadable across four routes — "list
   price minus the wholesale discount you set, minus print cost" is true
   and useless. So the page opens with one product at one price, and every
   route answers in money. Change either and the row moves. This is the
   section that came off the calculators: it belongs here, where choosing
   the route is the job.

   Fee structures are sourced from blurb.com. The seller's cost is not —
   Blurb publishes no fulfilment pricing, so FULFILMENT_FACTOR stands in
   for it and every figure below inherits that.
   ──────────────────────────────────────────────────────────────── */


function Chip({ children, solid }) {
  return (
    <span style={{
      padding: "2px 8px", borderRadius: 999, fontSize: TYPE.sm, fontWeight: 700,
      letterSpacing: 0.4, textTransform: "uppercase", whiteSpace: "nowrap",
      background: solid ? C.blue600 : C.blue50,
      color: solid ? "#fff" : C.blue950,
    }}>
      {children}
    </span>
  );
}


/* Ana's line for each route — hers to overwrite. No dashed box around them
   any more: the box marked them as unfinished, and they are finished enough
   to read. If they change, they change. */
const PROPS = {
  link: "One link, one book — share it anywhere you can paste a link.",
  bookstore: "Put your book somewhere readers are already browsing.",
  amazon: "Reach the readers who would never think to look for you.",
  ingram: "Get your book onto the shelves of bookshops and libraries.",
};

/* The four routes, in the order a seller meets them: the one they control
   entirely, then the two Blurb runs, then the one that reaches everyone
   else. API printing and Large Order Services are not here — they are
   services, not routes.

   The two id sets do not match, and that is a real trap: SELL_CHANNELS
   calls it `link` while a product's `sellChannels` calls it
   `checkout_link`. Comparing them directly silently reports every channel
   as unavailable, which is exactly what it did on first run. Mapped here
   rather than papered over, because the mismatch is worth seeing. */
const ROUTE_IDS = ["link", "bookstore", "amazon", "ingram"];
const CATALOG_ID = { link: "checkout_link", bookstore: "bookstore", amazon: "amazon", ingram: "ingram" };

const ROWS = [
  { key: "keep",      label: "You keep, per copy", strong: true },
  { key: "buyerPays", label: "Your buyer pays" },
  { key: "takes",     label: "What the channel takes" },
  { key: "paid",      label: "When you are paid" },
  { key: "suits",     label: "Who it suits" },
];

const control = {
  height: 40, minWidth: 0, border: `1px solid ${T.borderStrong}`, borderRadius: 4,
  background: T.bgNeutral, padding: "0 10px",
  fontFamily: FONT_BODY, fontSize: TYPE.base, color: T.textNeutral,
};

export default function SellerLanding({ onGo }) {
  /* One worked example for the whole table. A photo book at a round price,
     because the point is the comparison rather than the book. */
  const [formatId, setFormatId] = useState("photo");
  const [price, setPrice] = useState(24);

  const sel = defaultSelection(formatId);
  const cost = sellerCost(formatId, sel);
  const floor = minSellPrice(formatId, sel);
  const shown = Math.max(price, floor);
  const allowed = channelsFor(formatId, sel);

  const routes = ROUTE_IDS
    .map(id => SELL_CHANNELS.find(c => c.id === id))
    .filter(Boolean);

  const allows = route => allowed.includes(CATALOG_ID[route.id]);

  const cellFor = (route, row) => {
    if (row.key !== "keep") return route[row.key];
    const ok = allows(route);
    if (!ok) return null;
    const net = route.net(shown, cost);
    return net == null ? null : money(Math.max(0, net));
  };

  return (
    <div style={{ fontFamily: FONT_BODY, color: T.textNeutral }}>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 24px 8px", textAlign: "center" }}>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: "clamp(2rem, 4.5vw, 3rem)", lineHeight: 1.15, margin: 0 }}>
          Four ways to sell your book
        </h1>
        <p style={{ fontSize: TYPE.xl, lineHeight: 1.55, color: T.textSubtle, maxWidth: 680, margin: "16px auto 0" }}>
          Same book, four routes to a buyer. They differ in who finds it, what your buyer pays, and how much of
          it you keep.
        </p>
      </section>

      <section style={{ background: T.bgSubtle, borderTop: `1px solid ${T.border}`, marginTop: 32, padding: "28px 24px 72px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 20 }}>

          {/* ── The example that makes the table numeric ── */}
          <div style={{
            background: "#fff", border: `1px solid ${T.border}`, borderRadius: R.lg, padding: "16px 20px",
            display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
          }}>
            <span style={{ fontSize: TYPE.base, fontWeight: 700 }}>Comparing</span>

            <label style={{ display: "grid", gap: 4 }}>
              <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>Product</span>
              <select
                style={control}
                value={formatId}
                onChange={e => { setFormatId(e.target.value); }}
              >
                {["photo", "trade", "magazine", "notebook"].map(id => (
                  <option key={id} value={id}>{CATALOG[id].label}</option>
                ))}
              </select>
            </label>

            <label style={{ display: "grid", gap: 4 }}>
              <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>Your price</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: TYPE.base, color: T.textSubtle }}>US $</span>
                <input
                  type="number" min={floor} step={1} value={shown}
                  onChange={e => setPrice(Math.max(floor, Number(e.target.value) || floor))}
                  style={{ ...control, width: 96 }}
                />
              </span>
            </label>

            <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5, maxWidth: 420 }}>
              A copy costs you <strong style={{ color: T.textNeutral }}>{money(cost)}</strong> to print, so
              your price cannot go below it. Shipping is not here: your buyer pays it, wherever they are.
            </span>
          </div>

          {/* ── The comparison ── */}
          <div style={{
            background: "#fff", border: `1px solid ${T.border}`, borderRadius: R.lg,
            overflowX: "auto",
          }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 860 }}>
              <thead>
                <tr>
                  <th style={{
                    textAlign: "left", verticalAlign: "bottom", padding: "20px 16px 14px",
                    borderBottom: `1px solid ${T.border}`, width: 190,
                  }} />
                  {routes.map(r => {
                    const blocked = !allows(r);
                    return (
                      <th key={r.id} style={{
                        textAlign: "left", verticalAlign: "top", padding: "20px 16px 14px",
                        borderBottom: `1px solid ${T.border}`,
                        borderLeft: `1px solid ${T.border}`,
                        opacity: blocked ? 0.55 : 1, minWidth: 180,
                      }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 500 }}>
                            {r.name}
                          </span>
                          {r.isNew && <Chip solid>New</Chip>}
                        </span>
                        <span style={{
                          display: "block", marginTop: 6, fontSize: TYPE.sm,
                          color: T.textSubtle, lineHeight: 1.5, fontWeight: 400,
                        }}>
                          {PROPS[r.id]}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(row => (
                  <tr key={row.key}>
                    <th style={{
                      textAlign: "left", verticalAlign: "top", padding: "14px 16px",
                      borderBottom: `1px solid ${T.border}`,
                      fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
                      color: T.textSubtle,
                    }}>
                      {row.label}
                    </th>
                    {routes.map(r => {
                      const value = cellFor(r, row);
                      const blocked = !allows(r);
                      return (
                        <td key={r.id} style={{
                          verticalAlign: "top", padding: "14px 16px",
                          borderBottom: `1px solid ${T.border}`,
                          borderLeft: `1px solid ${T.border}`,
                          fontSize: row.strong ? TYPE.xl : TYPE.base,
                          fontWeight: row.strong ? 700 : 400,
                          color: blocked ? T.textSubtle : T.textNeutral,
                          lineHeight: 1.5,
                        }}>
                          {value ?? (
                            <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>
                              {blocked
                                ? channelBlockedBecause(CATALOG_ID[r.id], formatId, sel) ?? "Not this product"
                                : "You set the retailer's discount, so this is yours to decide"}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── What is true of all of them, and what is not here yet ── */}
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            <div style={{
              background: "#fff", border: `1px solid ${T.border}`, borderRadius: R.lg,
              padding: 20, display: "grid", gap: 8,
            }}>
              <div style={{ fontSize: TYPE.base, fontWeight: 700 }}>True of every route</div>
              <div style={{ fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.65 }}>
                A US $25 minimum before any payout is released. Volume discounts are retail-only and never
                apply to fulfilment pricing. And every book needs a proof — order and review one copy before it
                goes on sale, whichever route you choose.
              </div>
            </div>

            <div style={{
              background: "#fff", border: `1px solid ${T.border}`, borderRadius: R.lg,
              padding: 20, display: "grid", gap: 8,
            }}>
              <div style={{ fontSize: TYPE.base, fontWeight: 700 }}>Coming, and not compared yet</div>
              <div style={{ fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.65 }}>
                <strong style={{ color: T.textNeutral }}>Store integrations</strong> — connecting a shop you
                already run on Shopify or Etsy — would be the fifth route. It is named rather than compared
                because the table asks five things of a channel and none of them can be answered for something
                unbuilt. API printing and Large Order Services are not routes to market: they are services,
                and they live under Services in the nav.
              </div>
            </div>
          </div>

          {/* ── The way out ──
              Comparison before commitment: the route is chosen here, so the
              step that acts on it belongs here too — once, at the end. */}
          <div style={{
            background: "#fff", border: `1px solid ${T.border}`, borderRadius: R.lg, padding: 24,
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
