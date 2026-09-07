import React from "react";
import { Button, CardList, Card } from "@blurb/codex-react";
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
  ["print", "Print on demand, no inventory",
   "No upfront costs and no need to store an inventory. We print and ship only when you make a sale."],
  ["workspace_premium", "Unmatched quality",
   "Give your audience access to Blurb's superior print quality, vast catalog of formats, and premium paper types."],
  ["precision_manufacturing", "Powered by RPI Print",
   "Our in-house fulfillment ensures quality control and reliability at scale, trusted by brands like Canva and Minted."],
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
    stage: "instantstorev2", cta: "Create your Instant Store",
  },
  {
    id: "retail", name: "Retail Distribution",
    img: ILLUS + "reach-bookstores.BYbE8YXC_Z1XIS6H.webp",
    alt: "An illustration of a person riding an open book past a globe.",
    /* No single "Retail Distribution" page exists to send a CTA to —
       it's a bucket over three actual channels — so the plain-text
       sentence and the one link/icon it had are replaced with three
       real destination links instead. Card has no multi-link slot, so
       these live as trailing Markdown links in `description`, same
       mechanism the inline links used before, just moved out of the
       sentence and into their own line. */
    line: "Reach new readers by listing your book where readers already shop.",
    links: [
      ["Amazon", "https://www.amazon.com"],
      ["Blurb Bookstore", "https://www.blurb.com/sell-through-blurb"],
      ["Ingram", "https://www.blurb.com/ingram"],
    ],
  },
  {
    id: "los", name: "Large Order Services",
    img: ILLUS + "large-order.Dolls1H4_A7dqn.webp",
    alt: "A press roller running colour on a large print job.",
    line: "Get dedicated support and volume discounts for orders of 100+ copies, perfect for events, clients, or resale.",
    href: "https://www.blurb.com/large-order-services", cta: "Get a custom quote",
  },
  {
    id: "api", name: "RPI Print API",
    icon: "integration_instructions",
    /* Ana: "too bold" was about the nav mention specifically, not this
       page — the CRO brief actually confirms this as a real value prop
       for the API ("Direct API access to the same manufacturing and
       fulfilment infrastructure that already powers Blurb, Canva, and
       Minted"), so it stays here. Nav keeps the plainer line. */
    line: "Integrate the API infrastructure trusted by Blurb, Canva and Minted, directly into your app or website.",
    href: "https://www.rpiprint.com", cta: "Learn more about RPI Print API",
  },
];

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

/* Codex's own semantic status colors, read from its compiled CSS
   (--codex-color-semantic-bg-success / -warning / -danger). tokens.js
   has no success/warning/danger aliases, so these are the real hex
   values rather than an invented palette. */
const STATUS_COLOR = { success: "#166640", warning: "#8e4412", danger: "#bd1818" };

function StatusDot({ status }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block", width: 8, height: 8, borderRadius: "50%",
        background: STATUS_COLOR[status], margin: "6px 10px 0 0", flex: "0 0 auto",
      }}
    />
  );
}

const COMPARE_COLUMNS = ["Instant Store", "Retail Distribution", "Large Order Services", "RPI Print API"];

const COMPARE_ROWS = [
  { label: "Best for", cells: [
    { status: "success", text: "Sellers with their own audience — followers, a newsletter, no store yet" },
    { status: "success", text: "Reaching new readers who don't know you yet" },
    { status: "success", text: "Bulk orders for an event, gift, or resale" },
    { status: "success", text: "Developers building print into their own product" },
  ] },
  { label: "Setup", cells: [
    { status: "success", text: "AI-assisted, live in minutes" },
    { status: "success", text: "Simple via Blurb" },
    { status: "warning", text: "Custom quote required" },
    { status: "danger", text: "Developer integration required" },
  ] },
  /* Renamed from "Hands-off selling" — too close a copy of Lulu's own
     row name and Yes/No shape. Asks what's required of the seller
     instead of scoring the route pass/fail. */
  { label: "Ongoing involvement", cells: [
    { status: "success", text: "None needed" },
    { status: "success", text: "None needed" },
    { status: "warning", text: "Project-managed with an account team" },
    { status: "success", text: "None needed" },
  ] },
  { label: "Order fulfillment", cells: [
    { status: "success", text: "Automated" },
    { status: "success", text: "Automated" },
    { status: "warning", text: "White-glove, project-managed" },
    { status: "success", text: "Automated" },
  ] },
  { label: "Inventory", cells: [
    { status: "success", text: "None — print on demand" },
    { status: "success", text: "None — print on demand" },
    { status: "danger", text: "You hold the stock" },
    { status: "success", text: "None — print on demand" },
  ] },
  { label: "Profit", cells: [
    { status: "success", linkStage: "margin", linkLabel: "Seller pricing", text: ", no additional fees" },
    { status: "warning", text: "Retail pricing; fees vary by retailer" },
    { status: "warning", text: "Custom quote, bulk discounting" },
    { status: "success", text: "Same pricing as Instant Store, no additional fees" },
  ] },
  { label: "Storefront", cells: [
    { status: "success", text: "Provided, customizable in minutes" },
    { status: "danger", text: "Not provided — lists on the retailer's own page" },
    { status: "danger", text: "Not applicable" },
    { status: "danger", text: "You build it" },
  ] },
  { label: "Packaging", cells: [
    { status: "success", text: "White-labeled — your brand, not Blurb's" },
    { status: "warning", text: "Set by the retailer" },
    { status: "warning", text: "Custom, including multi-address dropship" },
    { status: "success", text: "White-labeled — your brand, not Blurb's" },
  ] },
  { label: "Tech required", cells: [
    { status: "success", text: "None" },
    { status: "success", text: "None" },
    { status: "success", text: "None — handled by your account team" },
    { status: "danger", text: "Developer resources" },
  ] },
];

const GET_STARTED = [
  { stage: "instantstorev2" },
  { href: "https://www.blurb.com/sell-through-blurb" },
  { href: "https://www.blurb.com/large-order-services" },
  { href: "https://www.rpiprint.com" },
];

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
  ["verified_user", "20+ Years",
   "Backed by 20 years of in-house expertise and full production control, Blurb ensures consistent quality from start to finish. No outsourcing, no compromises."],
  ["public", "70+ Countries",
   "Shipped to a global network of buyers and readers, with over 20M unique books and products created and sold."],
  ["eco", "Sustainable papers & practices",
   "Our photo books are crafted in the US with Forest Stewardship Council-certified papers and printed at the facility nearest you."],
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

      {/* ── Hero ──
          "Sell with Blurb" read as sell THROUGH Blurb — a marketplace
          you list on, not a production partner behind whatever you
          build (your own store, a retailer listing, your own app).
          "However you sell, it's still your book" didn't land either
          (Ana). Rewritten shorter and more direct: seller as the
          subject/verb, Blurb as what happens after — same shape as
          the API section's own short pitch in the brief ("We print,
          we ship, you scale").

          Custom rather than HeroCenter: the tick row is the brief's
          "Overall benefits applicable to all seller tools", and it
          needs to read as PART of the hero, not a second section
          bolted underneath it (Ana: "sitting awkwardly"). HeroCenter
          has no slot for extra content, so this hero is hand-built —
          same padding/heading/subheading sizing HeroCenter itself
          uses (--codex-spacing-24/32, --codex-font-size-9xl/lg), so
          it still reads like the same hero pattern as its siblings. */}
      <section className="hero-gradient-seller" style={{ padding: "clamp(56px, 8vw, 96px) 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "grid", gap: 20, justifyItems: "center" }}>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 400, letterSpacing: "-0.01em",
            fontSize: "clamp(2rem, 4.6vw, 2.75rem)", lineHeight: 1.2, margin: 0,
          }}>
            You sell it. We print it.
          </h1>
          <p style={{ fontSize: TYPE.lg, lineHeight: 1.55, color: T.textSubtle, margin: 0, maxWidth: 640 }}>
            Four ways to reach readers — a store that's fully yours, global retail distribution, bulk orders, or your own platform. You choose how; we handle the printing, shipping, and production behind it.
          </p>
          <Button as="a" href="#paths">Explore our selling tools</Button>

          {/* Third tick was "your brand on every order, not ours" —
              true of Instant Store and the API, but not Retail
              Distribution (ships in the retailer's own packaging) or
              Large Order Services (custom/dropship). Swapped for the
              brief's other universal benefit instead, which does hold
              across all four. */}
          <div style={{
            marginTop: 12, display: "grid", gap: 12, width: "100%", maxWidth: 780,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", textAlign: "left",
          }}>
            {[
              "Choice and optionality — mix and match ways to sell",
              "Print on demand — no inventory, no stock risk",
              "Blurb's superior print quality, papers, and formats",
            ].map(text => (
              <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span className="ms" aria-hidden style={{ fontSize: 20, color: C.blue600, flex: "0 0 auto" }}>check_circle</span>
                <span style={{ fontSize: TYPE.sm, color: T.textNeutral, lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Included with every way you sell ──
          Was "Built-in quality, flexibility, and support" — a heading
          that describes itself rather than saying what's in the
          section (Ana: "I don't know what that means"). These three
          are the CRO brief's own "Overall benefits applicable to all
          seller tools", so the heading says exactly that now. Padding
          cut roughly in half (was clamp(56px,7vw,80px), matching the
          page's heavier hero-adjacent sections) — this one sits
          between two dense sections and doesn't need that much air. */}
      <section style={{ padding: "clamp(32px, 4vw, 48px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <CardList
            heading="Included with every way you sell"
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
          {/* Heading passed to CardList itself, not a separate div above
             it — CardList's own layout already reserves top padding for
             a heading area whether or not one is given, so a manual
             heading here on top of this outer grid's own `gap` stacked
             two spacings and left a much bigger gap than every other
             CardList-heading section on this page. */}
          <CardList
            heading="Four ways to sell"
            subheading="Start with one channel and add more as your business grows. Each option works independently, or together."
            headingAlign="center"
            layout={{ mobile: 1, tablet: 2, desktop: 4 }}
          >
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
                description={card.links
                  ? `${card.line}\n\n${card.links.map(([label, url]) => `[${label}](${url})`).join(" · ")}`
                  : card.line}
                {...(!card.links && (card.stage
                  /* Same `link` treatment as the other three cards —
                     underlined text, no button chrome. No openInNewTab
                     (and so no external-open icon) since this goes to
                     another page in this app, not a new tab; Codex's
                     Link has no separate "same page" icon to swap in,
                     so it's a plain link, matching how other in-app
                     links style themselves elsewhere in this codebase. */
                  ? { link: { href: "#", onClick: e => { e.preventDefault(); onGo?.(card.stage); }, children: card.cta } }
                  : { link: { href: card.href, openInNewTab: true, children: card.cta } }))}
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

            {/* ── Beefed up, Lulu-style (Ana wanted this as inspiration) ──
                Lulu's own comparison table (lulu.com/sell) uses a status
                dot per cell — green/yellow/red — plus a legend, across
                nine features. Same shape here. Cell content is the CRO
                brief's own value props and FAQ answers for each path, not
                invented — the one place the brief itself flags as
                unverified (SKU-based margin comparisons like "30% more
                than the Bookstore") is left out; "Seller pricing, no
                additional fees" and "Same pricing as Instant Store" are
                both lines the brief states directly, not comparisons.

                Hand-built rather than Codex's ComparisonTable: that
                component's cells are Markdown strings run through
                react-markdown + remark-gfm with no rehype-raw plugin
                (confirmed in its own Markdown.js), so a styled span is
                impossible inside a cell — an emoji was the only "dot"
                reachable that way. This grid uses Codex's own semantic
                status colors instead (--codex-color-semantic-bg-success
                / -warning / -danger, read from its compiled CSS), same
                zebra rows / rule color / sticky label column / 16px
                cells as the tool comparison on /bookmaking-tools. */}
            <div style={{
              overflowX: "auto", WebkitOverflowScrolling: "touch",
              border: `1px solid ${C.charcoal200}`, borderRadius: R.md,
            }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "160px repeat(4, minmax(180px, 1fr))",
                minWidth: 860,
              }}>
                {["", ...COMPARE_COLUMNS].map((col, ci) => (
                  <div
                    key={col || "row-label"}
                    style={{
                      position: ci === 0 ? "sticky" : "static", left: 0, zIndex: 2,
                      background: "#fff", borderBottom: `1px solid ${C.charcoal200}`,
                      borderRight: ci < 4 ? `1px solid ${C.charcoal200}` : "none",
                      padding: 16, fontFamily: FONT_DISPLAY, fontWeight: 500,
                      fontSize: TYPE.sm, color: T.textNeutral,
                    }}
                  >
                    {col}
                  </div>
                ))}

                {COMPARE_ROWS.map((row, ri) => {
                  const rowBg = ri % 2 === 1 ? C.gray50 : "#fff";
                  return (
                    <React.Fragment key={row.label}>
                      <div style={{
                        position: "sticky", left: 0, zIndex: 1, background: rowBg,
                        borderBottom: `1px solid ${C.charcoal200}`, borderRight: `1px solid ${C.charcoal200}`,
                        padding: 16, fontSize: TYPE.sm, fontWeight: 500, color: T.textNeutral,
                      }}>
                        {row.label}
                      </div>
                      {row.cells.map((cell, ci) => (
                        <div key={ci} style={{
                          background: rowBg, borderBottom: `1px solid ${C.charcoal200}`,
                          borderRight: ci < 3 ? `1px solid ${C.charcoal200}` : "none",
                          padding: 16, display: "flex", alignItems: "flex-start", gap: 0,
                          fontSize: TYPE.sm, color: T.textNeutral, lineHeight: 1.5,
                        }}>
                          <StatusDot status={cell.status} />
                          <span>
                            {cell.linkStage && (
                              <>
                                <a
                                  href="#"
                                  onClick={e => { e.preventDefault(); onGo?.(cell.linkStage); }}
                                  style={{ color: C.blue600 }}
                                >
                                  {cell.linkLabel}
                                </a>
                                {cell.text}
                              </>
                            )}
                            {!cell.linkStage && cell.text}
                          </span>
                        </div>
                      ))}
                    </React.Fragment>
                  );
                })}

                {/* Same grid as the rows above, so the CTAs land exactly
                    under their own column — the trick SellerLanding.jsx's
                    six-route table uses with Markdown links, done here
                    with real elements since the table is hand-built anyway. */}
                <div style={{ position: "sticky", left: 0, zIndex: 1, background: "#fff", borderRight: `1px solid ${C.charcoal200}`, padding: 16 }} />
                {GET_STARTED.map((item, i) => (
                  <div key={i} style={{
                    background: "#fff", borderRight: i < 3 ? `1px solid ${C.charcoal200}` : "none",
                    padding: 16,
                  }}>
                    {item.stage ? (
                      <Button
                        variant="text"
                        onClick={() => onGo?.(item.stage)}
                      >
                        Get started
                      </Button>
                    ) : (
                      <Button as="a" variant="text" href={item.href} target="_blank" rel="noopener noreferrer">
                        Get started
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle, textAlign: "center", display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center" }}><StatusDot status="success" /> Included / easy</span>
              <span style={{ display: "inline-flex", alignItems: "center" }}><StatusDot status="warning" /> Limited / requires extra effort</span>
              <span style={{ display: "inline-flex", alignItems: "center" }}><StatusDot status="danger" /> Not included</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── What can you sell ── same copy as Instant Store v2's version
          of this section, not retyped. */}
      <section style={{ padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <CardList heading="What you can sell with Blurb" headingAlign="center" layout={{ mobile: 1, tablet: 2, desktop: 4 }}>
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
                  eyebrow={`${plural(f.formats, "format")} · ${plural(f.papers, "paper")} · ${plural(f.sizes, "size")}`}
                  title={f.title}
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
        </div>
      </section>

      {/* ── Stats ── its own section, no grey background — the grey
          panel belongs to the Showcase placeholder above it, not to
          these three facts. */}
      <section style={{ padding: "clamp(40px, 5vw, 56px) 24px", borderTop: `1px solid ${T.border}` }}>
        <div style={{
          maxWidth: 1240, margin: "0 auto", display: "grid", gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}>
          {STATS.map(([icon, stat, caption]) => (
            <div key={stat} style={{ display: "grid", gap: 8 }}>
              <span className="ms" aria-hidden style={{ fontSize: 28, color: C.blue600 }}>{icon}</span>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 500, color: T.textNeutral }}>{stat}</div>
              <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle }}>{caption}</p>
            </div>
          ))}
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
            Create your book, magazine, notebook or journal today and unlock your selling potential.
          </p>
          <Button onClick={() => onGo?.("getstarted")}>Get started</Button>
        </div>
      </section>
    </div>
  );
}
