import React from "react";
import { Button, CardList, Card, ComparisonTable, HeroCenter } from "@blurb/codex-react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import { FORMAT_CARDS } from "./FormatCards.jsx";
import Faq from "./Faq.jsx";

/* ────────────────────────────────────────────────────────────────
   Instant Store — v2 (2026-09-06)

   A rebuild of `InstantStorePage.jsx` off a Figma content outline
   (BLURB-Master, "Content Outline - Instant Store Hub", node 5133-8952 /
   5133-8964). Kept as its own stage (`instantstorev2`) rather than
   replacing v1 — several sections are still marked in-flux by open
   Figma comments (the testimonial/stats section, exact "Trusted by"
   wording), and this is a content-outline-level rebuild (wireframe
   structure and copy, not a pixel spec), so it's reviewed side by side
   with v1 rather than swapped in for it.

   Sections follow the outline's own order. Copy for the 8-tile feature
   grid and the FAQ answers is drafted here (the outline only had
   questions, not answers) — same spirit as the Sell page's route cards:
   a sentence to react to rather than a blank.

   ── The "Keep More of What You Earn" table ──
   The outline pairs Instant Store against Blurb Bookstore and Amazon on
   Print cost / Setup fees / Commission / Est. margin — which is real
   money set beside a per-channel breakdown, the shape CLAUDE.md's
   "never put retail and fulfilment side by side" / "the fulfilment
   price is a line in a calculation, never a price tag" rules exist to
   rule out. Anain okayed shipping it as designed (2026-09-06), so it's
   built as-designed below — figures kept at the "$X" placeholder this
   app already uses rather than invented ones, same reasoning as the
   ladder elsewhere. Directly under it is an alternative that keeps
   those two rules: the same cost → price → profit ladder used
   everywhere else on this page, plus a qualitative-only comparison (no
   dollar figures) with a door to the Sell page's real one. */

const STEPS = [
  ["Set your price", "Decide what your buyer pays. Whatever is left after your printing cost is yours."],
  ["Create your product page", "Add your book, a description and a cover photo — your store page is ready in minutes."],
  ["Share & sell", "Post your link anywhere — a bio, a newsletter, a stall — and start taking orders."],
];

const FEATURES = [
  ["payments", "Maximum profit, zero fees",
   "No listing fees and no monthly cost — you keep everything above your printing cost."],
  ["auto_awesome", "AI-powered listings",
   "Draft your product title, description and keywords in seconds, then edit to make it yours."],
  ["storefront", "Your custom product page",
   "A real page for your book — cover, description, your bio and your other work, not a bare payment box."],
  ["local_shipping", "Effortless fulfillment",
   "We print, pack and ship every order, with tracking, straight to your buyer."],
  ["receipt_long", "Automated sales tax",
   "Sales tax is calculated and collected automatically, wherever your buyer orders from."],
  ["auto_stories", "Sell books, magazines & more",
   "Photo books, paperback and hardcover, magazines, notebooks and journals — your call."],
  ["all_inclusive", "No minimums, ever",
   "Sell one copy or a thousand. There is no order minimum on an Instant Store."],
  ["share", "Share anywhere",
   "Your link works in a bio, a newsletter, a QR code on a stall — anywhere a link goes."],
];

const FAQS = [
  ["How do I set up an online store for my book?",
   "Pick a project already in your account (or start one), set your price, and your Instant Store page is ready to share — no separate sign-up."],
  ["Is there a minimum order to sell through my Instant Store?",
   "No. Sell one copy or a thousand; there is no minimum."],
  ["How much does Blurb take from each sale?",
   "Nothing off the top. You set the price, we charge you our printing cost to fulfil the order, and what's left is yours."],
  ["How do I get paid for my sales?",
   "Payouts follow the same US $25 minimum and cadence as the rest of Blurb's print-on-demand routes — by PayPal or check once that threshold is reached."],
  ["Who handles sales tax and shipping on each order?",
   "We calculate and collect sales tax automatically. Your buyer pays shipping at checkout, so it's never taken out of what you keep."],
  ["Can I sell books to readers internationally?",
   "Yes — your Instant Store link works for any buyer, and each order prints at the facility nearest them."],
  ["How do I share my Instant Store?",
   "Anywhere a link goes: a social bio, a newsletter, a QR code on a stall, or behind a button on a site you already run."],
  ["Is seller pricing available on every order?",
   "Yes. The price you set is the price your buyer pays on every order, with no separate wholesale or retail tiers to track."],
  ["Can I buy my own book through my Instant Store link?",
   "Yes — the same link works for you, at the price you set."],
  ["Can I turn my Instant Store link off?",
   "Yes, any time. Turning it off stops new orders; anything already placed still ships."],
];

export default function InstantStoreV2({ onGo }) {
  return (
    <div style={{ fontFamily: FONT_BODY, color: C.gray950 }}>

      {/* ── Hero ── the gradient the seller pages share. */}
      <HeroCenter
        className="hero-gradient-seller"
        heading="Your book, your audience, your profit"
        subheading="Set up an online store and start selling books directly to your audience. In minutes — no third-party platform or tech skills required."
        ctas={[
          { children: "Create your Instant Store" },
          { as: "a", href: "#demo", variant: "outlined", children: "See a store in action" },
        ]}
      />

      {/* ── Demo placeholder ──
          The outline has a checkered box with a play icon here — no real
          demo video exists yet, so this stays an honest placeholder
          rather than a fabricated embed. */}
      <section id="demo" style={{ padding: "0 24px clamp(48px, 7vw, 72px)" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div style={{
            borderRadius: R.lg, overflow: "hidden", aspectRatio: "16 / 9",
            background: "repeating-conic-gradient(#f2f2f2 0% 25%, #fafafa 0% 50%) 50% / 32px 32px",
            border: `1px solid ${T.border}`, display: "grid", placeItems: "center",
          }}>
            <span className="ms" aria-hidden style={{ fontSize: 56, color: C.gray400 }}>play_circle</span>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: TYPE.sm, color: T.textSubtle, textAlign: "center" }}>
            Placeholder — a short walkthrough of setting up and sharing an Instant Store goes here.
          </p>
        </div>
      </section>

      {/* ── Three simple steps ── */}
      <section style={{ padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <CardList
            heading="Create your online bookstore in three simple steps"
            headingAlign="center"
            layout={{ mobile: 1, tablet: 3, desktop: 3 }}
          >
            {STEPS.map(([title, body], i) => (
              <Card
                key={title}
                icon={
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 500, lineHeight: 1, color: C.blue600 }}>
                    {i + 1}
                  </span>
                }
                title={title}
                description={body}
              />
            ))}
          </CardList>
        </div>
      </section>

      {/* ── Everything you need — 8-tile feature grid ── */}
      <section style={{ background: C.gray50, padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <CardList
            heading="Everything you need to create an online bookstore"
            headingAlign="center"
            layout={{ mobile: 1, tablet: 2, desktop: 4 }}
          >
            {FEATURES.map(([icon, title, body]) => (
              <Card
                key={title}
                icon={<span className="ms" aria-hidden style={{ fontSize: 40, color: C.blue600 }}>{icon}</span>}
                title={title}
                description={body}
              />
            ))}
          </CardList>
        </div>
      </section>

      {/* ── Keep More of What You Earn ── as designed, then an alternative ── */}
      <section style={{ padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 20 }}>
          <div style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
          }}>
            <div style={{ display: "grid", gap: 8 }}>
              <h2 style={{
                fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
                lineHeight: 1.25, margin: 0,
              }}>
                Keep more of what you earn
              </h2>
              {/* "XX%" rather than a typed figure — the outline has a
                  number here but it isn't sourced anywhere in the board's
                  provenance panel, so it stays a placeholder like every
                  other unsourced figure in this app. */}
              <p style={{ margin: 0, fontSize: TYPE.base, color: T.textSubtle }}>
                Earn up to XX% higher margins compared to other distribution channels.
              </p>
            </div>
            <Button variant="outlined" onClick={() => onGo?.("margin")}>Calculate your margin</Button>
          </div>

          <ComparisonTable
            columnHeaders={["", "Instant Store", "Blurb Bookstore", "Amazon"]}
            rows={[
              { header: "Print cost", cells: ["$X.XX", "$X.XX", "$X.XX"] },
              { header: "Setup fees", cells: ["$0", "$0", "$0"] },
              { header: "Commission", cells: ["0%", "0%", "X%"] },
              { header: "Est. margin on a $20 sale", cells: ["$X.XX", "$X.XX", "$X.XX"] },
            ]}
          />

          {/* ── An alternative, that keeps the fulfilment-price rule ──
              Same "your cost → your price → your profit" ladder every
              other Instant Store surface uses, plus a comparison with no
              dollar figures in it at all — and a door to the Sell page's
              real six-route table, which is where CLAUDE.md says a
              cross-channel comparison belongs. */}
          <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 12, paddingTop: 32, display: "grid", gap: 20 }}>
            <p style={{
              margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
              color: T.textSubtle,
            }}>
              An alternative, without a fulfilment price standing next to a channel's
            </p>

            <div style={{
              border: `1px solid ${T.border}`, borderRadius: R.lg, padding: 24,
              display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
            }}>
              {[
                ["Your cost", "$X", "What we charge to print it"],
                ["Your price", "$X", "You set this"],
                ["Your profit", "$X", "What is left, and it is yours"],
              ].map(([label, figure, hint], i) => (
                <React.Fragment key={label}>
                  {i > 0 && (
                    <span className="ms" aria-hidden style={{ fontSize: 24, color: T.textSubtle }}>arrow_forward</span>
                  )}
                  <div style={{ display: "grid", gap: 2 }}>
                    <div style={{ fontSize: TYPE.sm, fontWeight: 700, color: T.textSubtle }}>{label}</div>
                    <div style={{
                      fontFamily: FONT_DISPLAY, fontSize: "1.75rem", fontWeight: 500, lineHeight: 1.1,
                      color: i === 2 ? C.blue600 : C.gray950,
                    }}>
                      {figure}
                    </div>
                    <div style={{ fontSize: TYPE.sm, color: T.textSubtle }}>{hint}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            <ComparisonTable
              columnHeaders={["", "Instant Store", "Blurb Bookstore", "Amazon"]}
              rows={[
                { header: "You set the price", cells: ["Yes", "No", "No"] },
                { header: "Commission cap", cells: ["None — nothing is taken off", "None — nothing is taken off", "Set by Amazon"] },
                { header: "Inventory required", cells: ["No", "No", "No"] },
                { header: "When you're paid", cells: ["Standard payout schedule", "Standard payout schedule", "Held through Amazon's returns window"] },
              ]}
            />

            <div>
              <Button variant="outlined" onClick={() => onGo?.("sellv2")}>
                Compare all four ways to sell in detail
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── What can you sell ── the same four product-type cards used
          elsewhere, not retyped. */}
      <section style={{ background: C.gray50, padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <CardList heading="What can you sell with Blurb" headingAlign="center" layout={{ mobile: 1, tablet: 2, desktop: 4 }}>
            {FORMAT_CARDS.map(f => (
              <Card
                key={f.id}
                icon={
                  <img
                    src={f.img}
                    alt={f.alt}
                    loading="lazy"
                    style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block", borderRadius: R.lg }}
                  />
                }
                title={f.title}
                description={f.desc}
              />
            ))}
          </CardList>
        </div>
      </section>

      <Faq heading={<>Your Blurb Instant Store<br />questions, answered</>} items={FAQS} />

      {/* ── Close ── */}
      <section
        className="curve-cta"
        style={{
          background: "linear-gradient(71deg, #e2e8f0 -0.95%, #f5f0ea 45.34%, #e2e8f0 98.72%)",
          padding: "clamp(72px, 9vw, 120px) 24px clamp(56px, 7vw, 80px)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", display: "grid", gap: 20, justifyItems: "center" }}>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
            lineHeight: 1.25, margin: 0,
          }}>
            Ready to share your work and maximize your profit?
          </h2>
          <p style={{ margin: 0, fontSize: TYPE.lg, color: T.textSubtle, lineHeight: 1.6 }}>
            It takes just a few minutes to get started.
          </p>
          <Button>Create your Instant Store</Button>
        </div>
      </section>
    </div>
  );
}
