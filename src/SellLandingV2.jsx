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
   visible placeholder. Same for its button ("Button text" is the
   outline's own placeholder label). "Trusted by" is the frame's own
   logo lockup, exported as `public/assets/trusted-by-logos.png`
   (Figma node 5161-15434) rather than reproduced as styled text.

   ── Corrected 2026-09-06 ──
   An earlier pass of this file invented body copy for the quality
   section, the four path cards, the comparison table and the FAQ
   questions instead of reading them off the Figma frame — wrong, and
   not disclosed as invented at the time either (the Showcase/Trusted-by
   sections *were* correctly flagged as placeholder; the rest wasn't).
   Everything below except the FAQ *answers* (the outline has questions
   only) is now the frame's own text, read off its Properties panel and
   canvas, not drafted. */

/* Ana, 2026-09-XX: dropped to 3 cards — Mix & Match removed, Print-on-
   demand renamed/rewritten to lead with "no inventory risk". */
const QUALITY = [
  ["print", "Print on demand, no inventory risk",
   "No need to hold an inventory or have upfront costs. We print and ship only when you make a sale."],
  ["workspace_premium", "Unmatched quality",
   "Give your audience access to Blurb's superior print quality, vast catalog of formats, and premium paper types."],
  ["precision_manufacturing", "Powered by RPI Print",
   "Our in-house fulfillment network ensures quality control and reliability at scale trusted by brands like Canva and Minted."],
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
    line: "Sell directly to your audience in minutes with a product page that fully showcases your book — no extra fees, no tech skills required.",
    stage: "instantstorev2", cta: "Create Your Instant Store",
  },
  {
    id: "retail", name: "Retail Distribution",
    img: ILLUS + "reach-bookstores.BYbE8YXC_Z1XIS6H.webp",
    alt: "An illustration of a person riding an open book past a globe.",
    /* Inline links in the outline's own text (Amazon / Blurb Bookstore /
       Ingram), rendered via Card's Markdown-capable description. */
    line: "Reach new readers by listing your book on [Amazon](https://www.amazon.com), the [Blurb Bookstore](https://www.blurb.com/sell-through-blurb), and in [Ingram's](https://www.blurb.com/ingram) global network.",
    href: "https://www.blurb.com/sell-through-blurb", cta: "Explore Retail Distribution",
  },
  {
    id: "los", name: "Large Order Services",
    img: ILLUS + "large-order.Dolls1H4_A7dqn.webp",
    alt: "A press roller running colour on a large print job.",
    line: "Get dedicated support and volume discounts for orders of 100+ copies, perfect for events, clients, or resale.",
    href: "https://www.blurb.com/large-order-services", cta: "Get a Custom Quote",
  },
  {
    id: "api", name: "RPI Print API",
    icon: "integration_instructions",
    line: "Integrate the API infrastructure trusted by Blurb, Canva and Minted, directly into your app or website.",
    href: "https://www.rpiprint.com", cta: "Learn more about RPI Print API",
  },
];

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

/* Same product-type copy as Instant Store v2's "What can you sell"
   section — the outline writes its own descriptions rather than
   reusing FormatCards.jsx's sitewide ones; real Blurb photography
   stays, via FORMAT_CARDS' img/alt, matched by id.

   `formats`/`papers`/`sizes` are read directly off blurb.com/pricing
   (2026-09-06), not the local catalog matrix — CLAUDE.md already
   documents several gaps between the two (the "T7" price gaps), and
   the live page is what a seller actually reads.
     formats = distinct binding rows (Paperback / Imagewrap Hardcover /
       Dust Jacket Hardcover / Wire-O Softcover)
     papers  = distinct paper/finish sections (Standard, Premium,
       Mohawk Superfine, layflat variants, etc. each count once)
     sizes   = the count /pricing itself states in each card's own
       "X sizes" line */
const SELL_FORMATS = [
  { id: "photo", title: "Photo Books", formats: 3, papers: 7, sizes: 6,
    desc: "From high-end photography albums to keepsake family books, photo books are our most premium format with multiple trim sizes and paper types." },
  { id: "trade", title: "Paperback & Hardcover", formats: 3, papers: 3, sizes: 3,
    desc: "Ideal for books that combine art with text or just text alone like portfolios, cookbooks, novels, children's books and the like." },
  { id: "magazine", title: "Magazines", formats: 1, papers: 1, sizes: 1,
    desc: "Great for a series or one-off custom projects. Impressive newsstand quality and easy distribution." },
  { id: "notebook", title: "Notebooks & Journals", formats: 4, papers: 1, sizes: 3,
    desc: "Choose from blank, lined, square, or dot-grid notebook pages, plus easily add photos or illustrations within the pages." },
];

const SHOWCASE = [
  ["Product Name", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.", "Reviewer Name"],
  ["Product Name", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.", "Reviewer Name"],
  ["Product Name", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.", "Reviewer Name"],
];

const STATS = [
  ["verified_user", "XX+ Years", "Empowering sellers with industry-leading print quality."],
  ["public", "XX+ Countries", "Shipped to a global network of buyers and readers."],
  ["auto_stories", "20M+", "Unique books and products created and sold."],
];

const TRUSTED_BY = ["Canva", "minted", "Treering", "Storyworth", "We Can Books"];

/* Questions are the outline's own (Accordion Block, 8 sections); it
   carries no answer text (every section is closed, title only), so
   the answers below are drafted — a sentence to react to, same as the
   route cards on v1's Sell page were before Ana had copy to react to. */
const FAQS = [
  ["What are the different ways to sell a self-published book with Blurb?",
   "Four: your own Instant Store, Retail Distribution through Blurb's Bookstore, Amazon and Ingram, Large Order Services for bulk stock, or the RPI Print API for your own storefront."],
  ["Where's the best place to sell my books online?",
   "It depends on your audience. An Instant Store is best if you already have followers to sell to directly; Retail Distribution reaches readers who are browsing rather than looking for you specifically."],
  ["Can I sell books without holding inventory or paying upfront?",
   "Yes. Every print-on-demand route — Instant Store, Retail Distribution — prints a copy only once it's ordered. Nothing to buy or store in advance."],
  ["How does print-on-demand work for authors and creators?",
   "Your book prints only when a buyer orders it. There's no minimum run, no warehouse, and no upfront printing cost to cover before you make a sale."],
  ["Do I need an ISBN or barcode to sell my book?",
   "Only for the routes that require retail listing — Amazon and Ingram, under Retail Distribution. Your Instant Store link doesn't require one."],
  ["What's the difference between selling directly to readers and selling through Amazon or Ingram?",
   "On your Instant Store, you bring the buyer and set the price, so what's left after your printing cost is yours. Through Amazon or Ingram, the retailer brings the buyer and takes its own cut."],
  ["Can I sell more than books, like magazines, notebooks, or wall art, the same way?",
   "Yes — magazines and notebooks & journals are sellable through most of these routes. Availability varies by channel; the product page for each route lists what it takes."],
  ["How do I decide which of Blurb's selling options is right for me?",
   "Start with the comparison table above — it lines up best-for, profit margin, storefront and audience across all four routes so you can compare at a glance."],
];

export default function SellLandingV2({ onGo }) {
  return (
    <div style={{ fontFamily: FONT_BODY, color: C.gray950 }}>

      {/* ── Hero ── the gradient the seller pages share. */}
      <HeroCenter
        className="hero-gradient-seller"
        heading="Sell with Blurb"
        subheading="From a simple storefront to retail distribution and APIs, Blurb has a selling solution for every seller."
        ctas={[{ as: "a", href: "#paths", children: "Explore our selling tools" }]}
      />

      {/* ── Built-in quality ── */}
      <section style={{ padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <CardList
            heading="Built-in quality, flexibility, and support"
            headingAlign="center"
            layout={{ mobile: 1, tablet: 3, desktop: 3 }}
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
              Four ways to sell
            </h2>
            <p style={{ fontSize: TYPE.lg, color: T.textSubtle, margin: 0, maxWidth: 680, lineHeight: 1.6 }}>
              Start with one channel and add more as your business grows. Each option works independently, or together.
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
                description={card.line}
                {...(card.stage
                  /* Same `link` treatment as the other three cards —
                     underlined text, no button chrome. No openInNewTab
                     (and so no external-open icon) since this goes to
                     another page in this app, not a new tab; Codex's
                     Link has no separate "same page" icon to swap in,
                     so it's a plain link, matching how other in-app
                     links style themselves elsewhere in this codebase. */
                  ? { link: { href: "#", onClick: e => { e.preventDefault(); onGo?.(card.stage); }, children: card.cta } }
                  : { link: { href: card.href, openInNewTab: true, children: card.cta } })}
              />
            ))}
          </CardList>

          <div style={{ display: "grid", gap: 20, marginTop: 8 }}>
            <h3 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.25rem, 2.4vw, 1.5rem)",
              lineHeight: 1.25, margin: 0, textAlign: "center",
            }}>
              Which selling path is right for you?
            </h3>

            <ComparisonTable
              columnHeaders={["", "Instant Store", "Retail Distribution", "Large Order Services", "RPI Print API"]}
              rows={[
                { header: "Best for", cells: [
                  "Direct sales to your existing audience",
                  "Discoverability & reaching new readers",
                  "Bulk orders for events or resale",
                  "Integrating print-on-demand",
                ] },
                { header: "Profit margin", cells: [
                  "Highest",
                  "Varies by retailer",
                  "Custom quote",
                  "Highest",
                ] },
                { header: "Storefront", cells: [
                  "Provided",
                  "Not required",
                  "Not required",
                  "You build it",
                ] },
                { header: "Audience", cells: [
                  "You bring it",
                  "Retailer's audience",
                  "You bring it",
                  "You build it",
                ] },
                { header: "Inventory risk", cells: [
                  "None (Print-on-Demand)",
                  "None (Print-on-Demand)",
                  "Yes (You hold stock)",
                  "None (Print-on-demand)",
                ] },
                /* The outline renders these as real buttons, one per
                   column, not a text row — but ComparisonTable's own
                   column widths (responsive, sticky label column) can't
                   be mirrored by a separate element, so a standalone
                   button row never lines up under its column. A row of
                   Markdown links, inside the same table, lines up
                   exactly because it's the same grid — same trick
                   SellerLanding.jsx's six-route table uses for its own
                   "Learn more" links. */
                { header: "", cells: [
                  "[Get started](?stage=instantstorev2)",
                  "[Get started](https://www.blurb.com/sell-through-blurb)",
                  "[Get started](https://www.blurb.com/large-order-services)",
                  "[Get started](https://www.rpiprint.com)",
                ] },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── What can you sell ── same copy as Instant Store v2's version
          of this section, not retyped. */}
      <section style={{ padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <CardList heading="What can you sell with Blurb" headingAlign="center" layout={{ mobile: 1, tablet: 2, desktop: 4 }}>
            {SELL_FORMATS.map(f => {
              const photo = FORMAT_CARDS.find(c => c.id === f.id);
              return (
                <Card
                  key={f.id}
                  icon={
                    <img
                      src={photo.img}
                      alt={photo.alt}
                      loading="lazy"
                      style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block", borderRadius: R.lg }}
                    />
                  }
                  title={`${f.title} · ${plural(f.formats, "format")} · ${plural(f.papers, "paper")} · ${plural(f.sizes, "size")}`}
                  description={f.desc}
                />
              );
            })}
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
                Showcase title
              </h2>
              <p style={{ margin: 0, fontSize: TYPE.base, color: T.textSubtle, maxWidth: 620 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
              </p>
            </div>
            <Button variant="outlined">Button text</Button>
          </div>

          <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {SHOWCASE.map(([name, quote, reviewer], i) => (
              <div key={i} style={{ display: "grid", gap: 8 }}>
                <div style={{ borderRadius: R.lg, aspectRatio: "4 / 3", background: "#e8e8e8" }} />
                <div style={{ fontSize: TYPE.sm, color: T.textSubtle, marginTop: 4 }}>Sold with</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE.lg, fontWeight: 500 }}>{name}</div>
                <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.6 }}>“{quote}”</p>
                <div style={{ fontSize: TYPE.sm, color: T.textSubtle }}>{reviewer}</div>
              </div>
            ))}
          </div>

          <div style={{
            display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            borderTop: `1px solid ${T.border}`, paddingTop: 24,
          }}>
            {STATS.map(([icon, stat, caption]) => (
              <div key={stat} style={{ display: "grid", gap: 8 }}>
                <span className="ms" aria-hidden style={{ fontSize: 28, color: C.blue600 }}>{icon}</span>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 500 }}>{stat}</div>
                <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle }}>{caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trusted by ── the outline's actual logo lockup (Canva,
          Minted, Treering, Storyworth, We Can Books — names confirmed
          by Figma comment #63), exported straight off the frame rather
          than reproduced as styled text, so the real marks show up
          instead of a guess at their wordmarks. */}
      <section style={{ padding: "clamp(40px, 5vw, 56px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <img
            src="/assets/trusted-by-logos.png"
            alt={`Trusted by ${TRUSTED_BY.join(", ")}`}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </section>

      <Faq heading={<>Common questions<br />about selling with Blurb</>} items={FAQS} />

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
            Ready to share your project with the world?
          </h2>
          <p style={{ margin: 0, fontSize: TYPE.lg, color: T.textSubtle, lineHeight: 1.6 }}>
            Create your book, magazine, or wall art today and unlock your selling potential.
          </p>
          <Button onClick={() => onGo?.("getstarted")}>Get started</Button>
        </div>
      </section>
    </div>
  );
}
