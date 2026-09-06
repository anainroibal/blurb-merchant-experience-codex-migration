import React from "react";
import { Button, CardList, Card, ComparisonTable, HeroCenter } from "@blurb/codex-react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import { FORMAT_CARDS } from "./FormatCards.jsx";
import Faq from "./Faq.jsx";

/* ────────────────────────────────────────────────────────────────
   Sell — v2 (2026-09-06)

   A rebuild of `SellerLanding.jsx` off a Figma content outline
   (BLURB-Master, "Content Outline - Seller Hub", node 5115-1250 /
   5131-4617). Kept as its own stage (`sellv2`) rather than replacing
   v1 — several sections are still marked in-flux by open Figma
   comments (the showcase/stats section, "Trusted by" wording), and
   this is a content-outline-level rebuild (wireframe structure and
   copy, not a pixel spec), so it's reviewed side by side with v1.

   ── The real change: four cards, not four routes ──
   v1's "Choose how to sell your book" cards Instant Store, Bookstore,
   Amazon and Ingram individually — each a distinct product-facing
   channel. This outline groups Bookstore/Amazon/Ingram into one
   "Retail Distribution" card and gives Large Order Services and RPI
   Print API — which v1's table already described in text-only rows,
   with no card of their own — full card-level billing alongside
   Instant Store. That's a real IA change, not a restyle, so it's
   built here rather than folded into v1's four cards.

   Illustrations are reused from the existing Sell page per open Figma
   comment #66 (Natalie Nicholas: "Reuse same illustrations from
   existing sell pages"). There's no existing Blurb illustration for
   "RPI Print API" specifically — that card uses a Material Symbol
   icon on the same tile treatment instead of forcing a mismatched
   illustration; swap in the real one once it exists.

   The showcase/testimonial section keeps the outline's own lorem-ipsum
   — inventing testimonial copy or stats here would be worse than a
   visible placeholder. Same for "Trusted by": the brand names are
   real (confirmed by Figma comment #63), the wordmarks are plain text
   pending real logo assets. */

const QUALITY = [
  ["shuffle", "Mix & Match", "Combine formats, sizes and papers across a single project."],
  ["print", "Print-On-Demand", "Every copy prints only once it's ordered — nothing to stock up front."],
  ["workspace_premium", "Unmatched Quality", "Twenty years of in-house printing and full production control."],
  ["precision_manufacturing", "Powered by RPI Print", "Our own presses and fulfilment network, not an outsourced printer."],
];

/* Blurb's own illustrations, reused from SellerLanding.jsx rather than
   re-hosted or re-described. RPI Print API has no illustration of its
   own yet — see the file header note. */
const ILLUS = "https://assets.blurb.com/_astro/";

const SELL_PATHS = [
  {
    id: "link", name: "Instant Store",
    img: ILLUS + "blurb-dashboard.YPDjPrK8_Z1bvCol.webp",
    alt: "An illustration of a person setting up a book listing.",
    line: "Share one link — a newsletter, a bio, a talk, a stall — and we print and ship every order.",
    facts: ["You set the price", "Nothing to run, and no listing fees"],
    stage: "instantstorev2", cta: "Get Started",
  },
  {
    id: "retail", name: "Retail Distribution",
    img: ILLUS + "reach-bookstores.BYbE8YXC_Z1XIS6H.webp",
    alt: "An illustration of a person riding an open book past a globe.",
    line: "List your book where readers already shop — Blurb's own Bookstore, Amazon, and Ingram's global network.",
    facts: ["Reach readers you'd never find on your own", "Photo books, paperback & hardcover"],
    href: "https://www.blurb.com/sell-through-blurb", cta: "Get Started",
  },
  {
    id: "los", name: "Large Order Services",
    img: ILLUS + "large-order.Dolls1H4_A7dqn.webp",
    alt: "A press roller running colour on a large print job.",
    line: "Past a hundred copies, our print team quotes the job and handles the logistics with you.",
    facts: ["Quoted by our print team", "For bulk stock, not per-order"],
    href: "https://www.blurb.com/large-order-services", cta: "Get Started",
  },
  {
    id: "api", name: "RPI Print API",
    icon: "integration_instructions",
    line: "Already have a storefront? RPI's print network can produce and ship behind it.",
    facts: ["Print and fulfilment via API", "For your own storefront or app"],
    href: "https://www.rpiprint.com", cta: "Get Started",
  },
];

const SHOWCASE = [
  ["Product Name", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.", "Reviewer Name"],
  ["Product Name", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.", "Reviewer Name"],
  ["Product Name", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.", "Reviewer Name"],
];

const TRUSTED_BY = ["Canva", "minted", "Treering", "Storyworth"];

const FAQS = [
  ["What are the different ways to sell a self-published book with Blurb?",
   "Four: your own Instant Store, Blurb's Bookstore, Amazon, Ingram's retail network, Large Order Services for bulk stock, or RPI's print API for your own storefront."],
  ["Which distribution channels does Blurb support?",
   "Blurb's own Bookstore, Amazon, and Ingram — which reaches bookshops, libraries and the retailers among them."],
  ["Can I sell books without holding inventory or paying upfront?",
   "Yes. Every print-on-demand route — Instant Store, Bookstore, Amazon, Ingram — prints a copy only once it's ordered. Nothing to buy or store in advance."],
  ["How does international book selling work?",
   "Your book is orderable by readers anywhere those channels reach, and each order prints at the facility nearest the buyer."],
  ["Do I need an ISBN or barcode to sell my book?",
   "Only for the routes that require retail listing — Amazon and Ingram. Your Instant Store link and Blurb's own Bookstore don't require one."],
  ["What's the difference between selling directly to readers vs. through Amazon or Ingram?",
   "On your Instant Store, you bring the buyer and set the price, so what's left after your printing cost is yours. On Amazon or Ingram, the channel brings the buyer and takes its own cut."],
  ["Can I sell more than books — magazines, notebooks, or other formats?",
   "Yes — magazines and notebooks & journals are sellable through most of these routes. Availability varies by channel; the product page for each route lists what it takes."],
];

export default function SellLandingV2({ onGo }) {
  return (
    <div style={{ fontFamily: FONT_BODY, color: C.gray950 }}>

      {/* ── Hero ── the gradient the seller pages share. */}
      <HeroCenter
        className="hero-gradient-seller"
        heading="Sell With Blurb"
        subheading="From a solo storefront to global distribution and custom order APIs, Blurb has a selling solution for every seller."
        ctas={[{ as: "a", href: "#paths", children: "Explore Our Selling Tools" }]}
      />

      {/* ── Built-in quality ── */}
      <section style={{ padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <CardList
            heading="Built-In Quality, Flexibility, and Support"
            headingAlign="center"
            layout={{ mobile: 1, tablet: 2, desktop: 4 }}
          >
            {QUALITY.map(([icon, title, body]) => (
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

      {/* ── Four ways to sell, and the same four side by side ──
          One section, not two — same reasoning SellerLanding's own
          comment gives: the cards and the table are one question asked
          twice, once skimmed and once read across. */}
      <section
        id="paths"
        style={{
          background: T.bgSubtle, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`,
          padding: "clamp(56px, 7vw, 80px) 24px", scrollMarginTop: 140,
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 48 }}>
          <div style={{ textAlign: "center", display: "grid", gap: 12, justifyItems: "center" }}>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
              lineHeight: 1.25, margin: 0,
            }}>
              Four Ways to Sell
            </h2>
            <p style={{ fontSize: TYPE.lg, color: T.textSubtle, margin: 0, maxWidth: 680, lineHeight: 1.6 }}>
              Sell directly, through retail distribution, in bulk, or behind your own storefront.
            </p>
          </div>

          <CardList layout={{ mobile: 1, tablet: 2, desktop: 4 }}>
            {SELL_PATHS.map(card => (
              <Card
                key={card.id}
                icon={
                  <div style={{
                    position: "relative", width: "100%", background: "#f5f0ea", borderRadius: R.lg,
                    aspectRatio: "4 / 3", display: "grid", placeItems: "center", overflow: "hidden",
                  }}>
                    {card.img ? (
                      <img
                        src={card.img}
                        alt={card.alt}
                        loading="lazy"
                        style={{ width: "78%", height: "auto", display: "block", mixBlendMode: "multiply" }}
                      />
                    ) : (
                      /* No Blurb illustration exists yet for this route —
                         see file header note. */
                      <span className="ms" aria-hidden style={{ fontSize: 56, color: C.blue600 }}>{card.icon}</span>
                    )}
                  </div>
                }
                title={card.name}
                description={`${card.line}\n\n${card.facts.map(f => `- ${f}`).join("\n")}`}
                {...(card.stage
                  ? { cta: { onClick: () => onGo?.(card.stage), children: card.cta } }
                  : { link: { href: card.href, openInNewTab: true, children: card.cta } })}
              />
            ))}
          </CardList>

          <div style={{ display: "grid", gap: 20, marginTop: 8 }}>
            <h3 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.25rem, 2.4vw, 1.5rem)",
              lineHeight: 1.25, margin: 0, textAlign: "center",
            }}>
              Which Selling Path is Right For You?
            </h3>

            <ComparisonTable
              columnHeaders={["", "Instant Store", "Retail Distribution", "Large Order Services", "RPI Print API"]}
              rows={[
                { header: "Best for", cells: [
                  "Selling directly to your own audience",
                  "Reaching readers browsing a store",
                  "Bulk stock for an event or resale",
                  "Powering your own storefront or app",
                ] },
                { header: "Profit margin", cells: [
                  "You set it — highest when you bring the buyer",
                  "Set by the channel's trade terms",
                  "Quoted per job",
                  "Set by your own pricing",
                ] },
                { header: "Turnaround", cells: [
                  "Printed as ordered, one at a time",
                  "Printed as ordered, one at a time",
                  "Quoted with your order",
                  "Printed as your system orders",
                ] },
                { header: "Audience", cells: [
                  "Yours — wherever you share the link",
                  "The channel's readers",
                  "Yours, in hand",
                  "Your own platform's users",
                ] },
                { header: "Inventory risk", cells: [
                  "None",
                  "None",
                  "You hold the stock",
                  "Depends on your own model",
                ] },
                { header: "Get started", cells: [
                  "[Get Started](?stage=instantstorev2)",
                  "[Get Started](https://www.blurb.com/sell-through-blurb)",
                  "[Get Started](https://www.blurb.com/large-order-services)",
                  "[Get Started](https://www.rpiprint.com)",
                ] },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── What can you sell ── the same four product-type cards used
          elsewhere, not retyped. */}
      <section style={{ padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <CardList heading="What Can You Sell with Blurb" headingAlign="center" layout={{ mobile: 1, tablet: 2, desktop: 4 }}>
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

      {/* ── Showcase ── still lorem-ipsum in the outline itself (Figma
          comments #61/#74 mark this section as still being reworked) —
          kept as a visible placeholder rather than invented copy. */}
      <section style={{ background: C.gray50, padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "grid", gap: 8 }}>
              <h2 style={{
                fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
                lineHeight: 1.25, margin: 0,
              }}>
                Showcase Title
              </h2>
              <p style={{ margin: 0, fontSize: TYPE.base, color: T.textSubtle, maxWidth: 620 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
              </p>
            </div>
            <Button variant="outlined">Browse Now</Button>
          </div>

          <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {SHOWCASE.map(([name, quote, reviewer], i) => (
              <div key={i} style={{ display: "grid", gap: 12 }}>
                <div style={{ borderRadius: R.lg, aspectRatio: "4 / 3", background: "#e8e8e8" }} />
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE.lg, fontWeight: 500 }}>{name}</div>
                <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.6 }}>“{quote}”</p>
                <div style={{ fontSize: TYPE.sm, color: T.textSubtle }}>{reviewer}</div>
              </div>
            ))}
          </div>

          <div style={{
            display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            borderTop: `1px solid ${T.border}`, paddingTop: 24, textAlign: "center",
          }}>
            {[["XX+", "Years"], ["XX+", "Countries"], ["XXM+", "Books Printed"]].map(([n, label]) => (
              <div key={label}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["6xl"], fontWeight: 500 }}>{n}</div>
                <div style={{ fontSize: TYPE.sm, color: T.textSubtle }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trusted by ──
          Names confirmed by Figma comment #63; wordmarks are plain
          text pending real logo assets. */}
      <section style={{ padding: "clamp(40px, 5vw, 56px) 24px" }}>
        <div style={{
          maxWidth: 1240, margin: "0 auto", display: "grid", gap: 24, justifyItems: "center", textAlign: "center",
        }}>
          <p style={{ margin: 0, fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: T.textSubtle }}>
            Trusted by
          </p>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
            {TRUSTED_BY.map(name => (
              <span key={name} style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], color: C.gray400 }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Faq heading={<>Common Questions<br />About Selling with Blurb</>} items={FAQS} />

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
            Ready to bring your project to life?
          </h2>
          <Button onClick={() => onGo?.("getstarted")}>Start Creating</Button>
        </div>
      </section>
    </div>
  );
}
