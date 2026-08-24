import React from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";

/* ────────────────────────────────────────────────────────────────
   The Instant Store product page — a PLACEHOLDER, on purpose.

   Crometrics is building this page (Anain, 2026-08-24). It is not ours
   to design, and a prototype that guessed at it would be the worst
   outcome of all: a screen that looks finished, gets screenshotted into
   a deck, and quietly becomes the spec for somebody else's work.

   So this stands in. It exists because three surfaces now point at it —
   the catalogue's selling lane, the Sell page and the nav — and a link
   that goes nowhere is harder to review than a link that arrives
   somewhere honest. It says who owns the page, what belongs on it, and
   where the parts that DO exist already live.

   When the real page lands, this file goes; the routes into it do not
   have to change.
   ──────────────────────────────────────────────────────────────── */

const OWNED_BY = "Crometrics";

/* What a reader arriving here needs, so whoever builds it can see what
   this prototype already answers and what it does not. */
const EXPECTED = [
  ["What it is", "One link, shared anywhere, that sells a printed book. We print and ship every order.",
   "Said on the Sell page and the home page's Selling tab."],
  ["What you keep", "You set the price; the margin is the difference between it and your cost.",
   "In the recommended scope the margin estimator prices this route, and only this route."],
  ["What you can sell", "Printed books and magazines. A PDF cannot be sold through an Instant Store.",
   "Held in the catalogue as `sellChannels`, and stated on /getting-started."],
  ["Setting one up", "Agent-led, with variants rather than the book as the unit.",
   "Stacey's Checkout Link file. Deliberately not prototyped here."],
  ["The proof rule", "A seller can go live with no proof; buyers cannot buy until one exists.",
   "Stacey's Proof Requirement file, and the quality-gate decision."],
];

export default function InstantStorePage({ onGo, lean = false }) {
  return (
    <div style={{ fontFamily: FONT_BODY, color: C.gray950 }}>
      <section style={{
        background: "linear-gradient(100deg, #e9ecef 0%, #f6f3ef 45%, #ebebeb 100%)",
        padding: "clamp(56px, 8vw, 96px) 24px",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", display: "grid", gap: 20, justifyItems: "center" }}>
          <span style={{
            padding: "4px 12px", borderRadius: 999, background: C.gray950, color: "#fff",
            fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
          }}>
            Placeholder
          </span>

          <h1 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, letterSpacing: "-0.01em",
            fontSize: "clamp(2rem, 4.6vw, 2.75rem)", lineHeight: 1.2, margin: 0,
          }}>
            The Instant Store page
          </h1>

          <p style={{ fontSize: TYPE.xl, lineHeight: 1.55, color: T.textNeutral, margin: 0, maxWidth: 640 }}>
            {OWNED_BY} is building this one. It is not prototyped here — the links that point at it are, so
            the journey can be reviewed end to end without anyone mistaking a sketch for the design.
          </p>
        </div>
      </section>

      <section style={{ padding: "clamp(48px, 6vw, 72px) 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gap: 32 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.375rem, 2.6vw, 1.75rem)",
              lineHeight: 1.25, margin: 0,
            }}>
              What this page has to answer
            </h2>
            <p style={{ margin: 0, fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.65 }}>
              Every line below is already decided somewhere in this project. Whoever builds the page should
              not have to rediscover any of it — and where a surface here already says it, that is the
              wording to match.
            </p>
          </div>

          <div style={{ display: "grid", gap: 0 }}>
            {EXPECTED.map(([title, what, where]) => (
              <div key={title} style={{
                borderTop: `1px solid ${T.border}`, padding: "20px 0",
                display: "grid", gap: 6, gridTemplateColumns: "minmax(140px, 200px) 1fr", alignItems: "start",
              }}>
                <div style={{ fontSize: TYPE.base, fontWeight: 700 }}>{title}</div>
                <div style={{ display: "grid", gap: 4, minWidth: 0 }}>
                  <div style={{ fontSize: TYPE.base, lineHeight: 1.6 }}>{what}</div>
                  <div style={{ fontSize: TYPE.sm, lineHeight: 1.5, color: T.textSubtle }}>{where}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: C.blue50, border: `1px solid ${C.blue100}`, borderRadius: R.lg, padding: 20,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
          }}>
            <div style={{ minWidth: 0, maxWidth: 620 }}>
              <div style={{ fontSize: TYPE.base, fontWeight: 700 }}>The parts that do exist</div>
              <p style={{ margin: "6px 0 0", fontSize: TYPE.base, lineHeight: 1.65, color: T.textNeutral }}>
                {lean
                  ? "The Sell page compares this route against the other three — who each one reaches, what it takes, and when it pays."
                  : "The Sell page compares this route against the other three, and the margin estimator prices a sale through it — cost, price, profit, against a real specification."}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={() => onGo?.("seller")}
                style={{
                  fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 600, minHeight: 44, padding: "0 18px",
                  borderRadius: R.md, cursor: "pointer", whiteSpace: "nowrap",
                  background: "#fff", color: T.textBrand, border: `1px solid ${T.borderBrand}`,
                }}
              >
                The Sell page
              </button>
              {!lean && (
                <button
                  onClick={() => onGo?.("margin")}
                  style={{
                    fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 600, minHeight: 44, padding: "0 18px",
                    borderRadius: R.md, border: 0, cursor: "pointer", whiteSpace: "nowrap",
                    background: T.bgBrand, color: T.textInverse,
                  }}
                >
                  Margin estimator
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
