import React from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import { CATALOG, SELL_CHANNELS } from "./catalog.js";

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

   ── NO MONEY ON THIS PAGE, 2026-08-24 ──
   It had a worked example: one product, one price, and "you keep" per
   route. It read as precision and could not be. What a route pays depends
   on the whole specification — size, cover, paper, page count — and this
   page holds none of it, so the figure was either a guess dressed as an
   answer or a demand that someone configure a book twice.

   The fix is not a smaller form. It is to stop asking this page to do two
   jobs: here you choose a ROUTE, on the margin estimator you price a
   BOOK. So the table compares what the routes actually differ on —
   who they reach, what they take, when they pay, what they ask of you —
   and the page hands over to the estimator for the number, where the
   specification already exists and nothing has to be typed again.

   "Pick this if" is the row that does the work. A seller is not choosing
   between fee structures, they are choosing between situations.

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

/* The decisive line for each route, written as a situation rather than a
   feature. This is the row a seller actually reads. */
const PICK_IF = {
  link: "You already have people listening — a newsletter, a talk, a stall, a bio link — and no shop to send them to.",
  bookstore: "You want a listing you do not have to run, and you are happy for readers to find it by browsing.",
  amazon: "Reach matters more than margin, and the book is a photo book you are happy to sell at Amazon's terms.",
  ingram: "You want the book orderable anywhere books are — bookshops, libraries, and the retailers Amazon among them.",
};

const ROWS = [
  { key: "pick",      label: "Pick this if", strong: true },
  { key: "products",  label: "Products it takes" },
  { key: "buyerPays", label: "Your buyer pays" },
  { key: "takes",     label: "What the channel takes" },
  { key: "paid",      label: "When you are paid" },
];

/* Which products each route takes, read off the catalogue rather than
   typed — so this can never claim a channel a product does not have.
   Family level on purpose: the exceptions are per configuration (Amazon
   excludes layflat and the 5×5) and they belong in the caveat under the
   table, not in a cell. */
const productsFor = channelId =>
  Object.values(CATALOG)
    .filter(f => (f.sellChannels || []).includes(channelId))
    .map(f => f.label)
    .join(", ");

export default function SellerLanding({ onGo }) {
  const routes = ROUTE_IDS.map(id => SELL_CHANNELS.find(c => c.id === id)).filter(Boolean);

  const cellFor = (route, row) => {
    if (row.key === "pick") return PICK_IF[route.id];
    if (row.key === "products") return productsFor(CATALOG_ID[route.id]);
    return route[row.key];
  };

  return (
    <div style={{ fontFamily: FONT_BODY, color: T.textNeutral }}>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 24px 8px", textAlign: "center" }}>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: "clamp(2rem, 4.5vw, 3rem)", lineHeight: 1.15, margin: 0 }}>
          Four ways to sell your book
        </h1>
        <p style={{ fontSize: TYPE.xl, lineHeight: 1.55, color: T.textSubtle, maxWidth: 680, margin: "16px auto 0" }}>
          Same book, four routes to a buyer. They differ in who finds it, what they ask of you, and what the
          channel takes on the way through.
        </p>
      </section>

      <section style={{ background: T.bgSubtle, borderTop: `1px solid ${T.border}`, marginTop: 32, padding: "28px 24px 72px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 20 }}>

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
                    return (
                      <th key={r.id} style={{
                        textAlign: "left", verticalAlign: "top", padding: "20px 16px 14px",
                        borderBottom: `1px solid ${T.border}`,
                        borderLeft: `1px solid ${T.border}`, minWidth: 180,
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
                      return (
                        <td key={r.id} style={{
                          verticalAlign: "top", padding: "14px 16px",
                          borderBottom: `1px solid ${T.border}`,
                          borderLeft: `1px solid ${T.border}`,
                          fontSize: TYPE.base,
                          fontWeight: row.strong ? 600 : 400,
                          color: T.textNeutral, lineHeight: 1.55,
                        }}>
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── The number lives on the estimator ──
              Said immediately under the table, because "what would I keep"
              is the next question and this page deliberately does not
              answer it: the answer depends on the size, cover, paper and
              page count, and those live on the calculator. */}
          <div style={{
            background: "#fff", border: `1px solid ${T.border}`, borderRadius: R.lg, padding: 20,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap",
          }}>
            <div style={{ minWidth: 0, maxWidth: 720 }}>
              <div style={{ fontSize: TYPE.base, fontWeight: 700 }}>What you keep depends on the book</div>
              <p style={{ margin: "6px 0 0", fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.65 }}>
                Not on the route alone — the size, the cover, the paper and the page count all move your cost,
                and Amazon's fee is a share of your price. The margin estimator has all of that in one place,
                so you set a price against a real book once and see what each route leaves you.
              </p>
            </div>
            <button
              onClick={() => onGo?.("margin")}
              style={{
                fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 600, minHeight: 44, padding: "0 20px",
                borderRadius: R.md, cursor: "pointer", whiteSpace: "nowrap",
                background: "transparent", color: T.textBrand, border: `1px solid ${T.borderBrand}`,
              }}
            >
              Open the margin estimator
            </button>
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
                apply to fulfilment pricing. Every book needs a proof — order and review one copy before it
                goes on sale. And some products drop out on configuration rather than on format: Amazon takes
                photo books but not layflat ones and not the 5×5 Mini Square, so the estimator is where
                eligibility is settled for a particular book.
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
