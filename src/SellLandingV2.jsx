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
   "Retail Distribution" card and gives Bulk Printing Services and RPI
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

/* Icons, not illustrations, for all four (Ana: "inconsistent sized
   images" — the real problem was style, not size: two hand-drawn
   illustrations, one real photograph (large-order.Dolls1H4_A7dqn.webp),
   and one bare icon, side by side. No illustration exists for the API
   card at all, so icon-only is the one treatment every card can share
   without fabricating new art. Links are `[label, url]` pairs — every
   card gets the same shape, one entry for the three that have a single
   destination, three for Retail Distribution — rendered by the same
   plain-anchor code below rather than Card's `link` slot (see the note
   there on why). */
/* Ticks and "Best for" are from the CRO brief's own per-tool "Value"
   sections (New landing pages - CRO Brief.docx), trimmed to short
   scannable phrases rather than the brief's full sentences — Ana's own
   reference mock made the same point ("wayyy too wordy but this is the
   concept"). Skipped anything the brief itself flags as unverified
   ("Claims that compare the margin... are SKU-based and need explicit
   verification") or that's already said once in "Included with every
   way you sell" below (print-on-demand, Blurb's quality) rather than
   repeating it per card. */
const SELL_PATHS = [
  {
    id: "link", name: "Instant Store", icon: "storefront", isNew: true,
    bestFor: "Getting started fast",
    line: "Sell directly to your audience in minutes with a product page that fully showcases your book. No extra fees, no tech skills required.",
    /* Down to 3 ticks (Ana). First tick turned into a real margin claim
       (Ana: "help turn the 70% lower print cost into a margin claim...
       compare it to amazon"), calculated rather than guessed: same
       $60.80/8x10 ImageWrap Hardcover spec and figures the "Keep more
       of what you earn" table (InstantStoreV2.jsx) already uses — $21.28
       print cost via seller pricing, 0% commission, so $39.52 profit;
       Amazon pays the standard $37.50 print-cost tier (seller pricing
       is Instant Store/RPI Print API only, confirmed by both the brief
       and Ana directly) plus its real $1.35 + 15% commission, so $12.83
       profit. $39.52 / $12.83 = 3.08x. Same caveat as the table itself:
       Amazon's $37.50 print cost is Ana's own guess, not a verified
       rate, so this number moves if that one does. "AI-drafted listing"
       swapped for the link/no-store point (Ana: not the strongest value
       here) — closer to how the brief itself pitches it ("post it
       anywhere: bio, story, newsletter, DM", "no additional storefront
       to build"). Payment methods tick cut to make room within 3. First
       tick links to the profit calculator — a tick object with
       `linkStage` instead of a plain string, same pattern the
       comparison table's Profit row already uses. `suffix` keeps the
       link scoped to "Up to 3x more profit" itself (Ana), not the
       whole sentence — the rest is context for the claim, not part of
       what's clickable.

       "than selling through Amazon" -> "than selling through our
       retail distribution channels" (Ana) broadens the comparison from
       Amazon specifically to the whole Retail Distribution card
       (Amazon, Ingram, Blurb Bookstore) — worth flagging that the 3.08x
       figure above is Amazon's math only. Blurb Bookstore's own numbers
       in the "Keep more of what you earn" table ($39.52 vs $23.30) work
       out to about 1.7x, not 3x, since it charges no commission the way
       Amazon does; Ingram isn't costed anywhere in this app at all. The
       claim as worded now overstates the Bookstore/Ingram case. */
    ticks: [
      { text: "Up to 3x more profit", suffix: " than selling through our retail distribution channels", linkStage: "margin" },
      "No subscription, no additional fees",
      "One link to share, no store required",
    ],
    links: [["Create your Instant Store", { stage: "instantstorev2" }]],
  },
  {
    id: "retail", name: "Retail Distribution", icon: "public",
    bestFor: "Maximum reach",
    /* "Self-publish" added (Ana: "i'm missing the term") — it was
       nowhere in this card despite being Blurb's own name for the
       whole activity this page is about. */
    line: "Self-publish and reach new readers by listing your book where they already shop.",
    /* Back to 2 ticks (Ana) — the third ("Get discovered by readers who
       don't know you yet") made this card 3 ticks plus 3 CTAs, more
       than any other card carries. */
    ticks: [
      "Sell on Amazon, access Ingram's 40,000+ retailers, or list on the Blurb Bookstore",
      "ISBN support included",
    ],
    /* Link labels are action-based (Ana), not just the channel name. */
    links: [
      ["Sell on Amazon", { href: "https://www.amazon.com" }],
      ["Sell on Blurb Bookstore", { href: "https://www.blurb.com/sell-through-blurb" }],
      ["Sell through Ingram", { href: "https://www.blurb.com/ingram" }],
    ],
  },
  {
    id: "los", name: "Bulk Printing Services", icon: "local_shipping",
    bestFor: "High-touch support",
    line: "Get concierge service and volume discounts for orders of 100+ copies, perfect for events, clients, or resale.",
    /* "Dedicated account team" -> "concierge service" (Ana) — matches
       the brief's own contrast for this route ("concierge service
       rather than self-service"). */
    ticks: [
      "Concierge service, start to finish",
      "Dropshipping to multiple addresses",
      "Custom quotes tailored to your project",
    ],
    links: [["Get a custom quote", { href: "https://www.blurb.com/large-order-services" }]],
  },
  {
    id: "api", name: "RPI Print API", icon: "integration_instructions",
    bestFor: "Developers & platforms",
    /* Ana: "too bold" was about the nav mention specifically, not this
       page — the CRO brief actually confirms this as a real value prop
       for the API ("Direct API access to the same manufacturing and
       fulfilment infrastructure that already powers Blurb, Canva, and
       Minted"), so it stays here. Nav keeps the plainer line. */
    line: "Integrate the API infrastructure trusted by Blurb, Canva and Minted, directly into your app or website.",
    ticks: [
      "Same infrastructure that powers Blurb, Canva, Minted",
      "White-label packaging",
      "No fees, no minimums",
    ],
    links: [["Learn more about RPI Print API", { href: "https://www.rpiprint.com" }]],
  },
];

/* One tile treatment for all four cards — same size, same icon-on-cream
   style, nothing left to read as inconsistent. "Best for" badge added
   (Ana's own reference mock) — a light outline pill, not a solid chip,
   so it doesn't compete with the solid-blue "New" marker Instant Store
   already carries. */
function PathTile({ card }) {
  return (
    <div style={{
      position: "relative", width: "100%", background: "#f5f0ea", borderRadius: R.lg,
      aspectRatio: "4 / 3", display: "grid", placeItems: "center", overflow: "hidden",
    }}>
      {card.bestFor && (
        <span style={{
          position: "absolute", top: 12, right: 12,
          padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
          background: "#fff", border: `1px solid ${C.blue600}`, color: C.blue600,
        }}>
          Best for: {card.bestFor}
        </span>
      )}
      <span className="ms" aria-hidden style={{ fontSize: 56, color: C.blue600 }}>{card.icon}</span>
    </div>
  );
}

/* Plain anchors, not Codex's <Link>, for every path card's CTA(s) (Ana:
   "remove the 'open in a new link' icons on those links"). Link's
   `openInNewTab` is the only way to get target="_blank" out of it, and
   that prop is what appends the icon — the two aren't separable, so
   there's no way to keep correct new-tab behavior through that
   component without the icon it was bundled with. A plain anchor gets
   both: target/rel for external links (so clicking one doesn't
   navigate the prototype itself away, the bug fixed earlier), onGo for
   the one internal link, no icon either way. Styled to match Link's own
   look (Codex's real blue, inherited size) so nothing looks demoted for
   being hand-built. */
function PathLink({ label, dest, onGo }) {
  const style = { color: C.blue600, textDecoration: "underline", fontSize: "inherit" };
  if (dest.stage) {
    return (
      <a href="#" onClick={e => { e.preventDefault(); onGo?.(dest.stage); }} style={style}>
        {label}
      </a>
    );
  }
  return (
    <a href={dest.href} target="_blank" rel="noopener noreferrer" style={style}>
      {label}
    </a>
  );
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

/* Codex's own success/warning/danger primitives (read from its compiled
   CSS), one step lighter than the semantic -text/-icon tokens
   (#166640/#8e4412/#bd1818). Those are tuned for text-on-white contrast,
   which makes all three read as similarly dark, low-saturation blobs at
   dot size — hard to tell apart at a glance. Same ramps, same hues,
   picked instead for how distinct they read that small. */
const STATUS_COLOR = { success: "#1e8c55", warning: "#eda113", danger: "#e22c2c" };

/* Same solid-blue "New" marker as SellerLanding.jsx and the nav's own
   Instant Store entries — Badge's fixed 7-color API has no solid-blue
   treatment, so it stays a small custom chip rather than losing that
   visual weight. */
function Chip({ children }) {
  return (
    <span style={{
      padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700,
      letterSpacing: 0.4, textTransform: "uppercase", whiteSpace: "nowrap",
      background: C.blue600, color: "#fff",
    }}>
      {children}
    </span>
  );
}

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

const COMPARE_COLUMNS = ["Instant Store", "Retail Distribution", "Bulk Printing Services", "RPI Print API"];

const COMPARE_ROWS = [
  { label: "Best for", cells: [
    { status: "success", text: "Sellers with their own audience: followers, a newsletter, no store yet" },
    { status: "success", text: "Reaching new readers who don't know you yet" },
    { status: "success", text: "Bulk printing for an event, gift, or resale" },
    { status: "success", text: "Developers building print into their own product" },
  ] },
  { label: "Setup", cells: [
    { status: "success", text: "AI-assisted, live in minutes" },
    { status: "success", text: "Simple via Blurb" },
    { status: "warning", text: "Custom quote required" },
    { status: "danger", text: "Developer integration required" },
  ] },
  /* Renamed from "Hands-off selling" (too close a copy of Lulu's own
     row name and Yes/No shape), then from "Ongoing involvement" (Ana:
     didn't like it). Asks what's required of the seller day to day
     instead of scoring the route pass/fail. */
  { label: "Day-to-day management", cells: [
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
    { status: "success", text: "None: print on demand" },
    { status: "success", text: "None: print on demand" },
    { status: "danger", text: "You hold the stock" },
    { status: "success", text: "None: print on demand" },
  ] },
  { label: "Profit", cells: [
    { status: "success", linkStage: "margin", linkLabel: "Instant Store pricing", text: ", no additional fees" },
    { status: "warning", text: "Retail pricing; fees vary by retailer" },
    { status: "warning", text: "Custom quote, bulk discounting" },
    { status: "success", text: "Same pricing as Instant Store, no additional fees" },
  ] },
  { label: "Storefront", cells: [
    { status: "success", text: "Provided, customizable in minutes" },
    { status: "danger", text: "Not provided: lists on the retailer's own page" },
    { status: "danger", text: "Not applicable" },
    { status: "danger", text: "You build it" },
  ] },
  { label: "Packaging", cells: [
    { status: "success", text: "White-label packaging" },
    { status: "warning", text: "Blurb-branded packaging" },
    { status: "warning", text: "Custom, including multi-address dropship" },
    { status: "success", text: "White-label packaging" },
  ] },
  { label: "Tech required", cells: [
    { status: "success", text: "None" },
    { status: "success", text: "None" },
    { status: "success", text: "None: handled by your account team" },
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

/* Real stories, images and quotes lifted from blurb.com/stories-that-bind
   (Ana: "use the imagery and copy on this page as placeholder") — this
   section's own outline was still lorem-ipsum (Figma comments #61/#74
   marked it as unfinished), so this replaces invented placeholder text
   with the company's own real, published customer stories instead.
   Quotes are copied verbatim, ellipses and bracketed insertions
   included — that's how blurb.com itself presents them, not a
   transcription artifact. */
const SHOWCASE = [
  {
    img: "https://assets.blurb.com/_astro/sonder.CCg793-X_ZXcnk.webp",
    alt: "Sonder, a poetry book by Diane Saint",
    title: "Poetry as resistance, refuge and freedom",
    quote: "In Sonder, I explore the profound complexity of...nonbinary and Two-Spirit experiences through poetry. [Blurb gives me] creative freedom. I was able to keep my book's personality as I wanted it.",
    attribution: "Diane Saint",
    cta: "Read Sonder", href: "https://www.blurb.com/b/12245117-sonder",
  },
  {
    img: "https://assets.blurb.com/_astro/rafid.B2xZ7pre_Zgdf0g.webp",
    alt: "Rafid Naeem behind the camera",
    title: "The world, captured through his lens",
    quote: "Creating books used to be complicated and inaccessible, but Blurb has truly revolutionized the self-publishing space. It has empowered artists by giving them an easy...way to share their stories.",
    attribution: "Rafid Naeem",
    cta: "Watch Rafid at work", href: "https://www.youtube.com/rafidn",
  },
  {
    img: "https://assets.blurb.com/_astro/explore.ByuDNTlG_Z2ceXPa.webp",
    alt: "What a Day, a book by Michele DeVries and Mark Sprague",
    title: "Life on the road, stories in print",
    quote: "When we decided to pursue self-publishing, Blurb felt like a natural choice given the quality of their products and all the...tools [that help] turning an idea into a sellable product. We're huge fans.",
    attribution: "Michele DeVries & Mark Sprague",
    cta: "Explore What a Day", href: "https://www.blurb.com/b/12026231-what-a-day",
  },
];

const STATS = [
  ["verified_user", "20+ years",
   "Backed by 20 years of in-house expertise and full production control, Blurb ensures consistent quality from start to finish. No outsourcing, no compromises."],
  ["public", "70+ countries",
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
   "Four: your own Instant Store, Retail Distribution through Blurb's Bookstore, Amazon and Ingram, Bulk Printing Services for large-quantity orders, or the RPI Print API for your own storefront."],
  ["Where's the best place to sell my books online?",
   "It depends on your audience. An Instant Store is best if you already have followers to sell to directly; Retail Distribution reaches readers who are browsing rather than looking for you specifically."],
  ["Can I sell books without holding inventory or paying upfront?",
   "Yes. Instant Store and Retail Distribution both print a copy only once it's ordered, so there's nothing to buy or store in advance."],
  ["How does print-on-demand work for authors and creators?",
   "Your book prints only when a buyer orders it. There's no minimum run, no warehouse, and no upfront printing cost to cover before you make a sale."],
  ["Do I need an ISBN or barcode to sell my book?",
   "Only Amazon and Ingram, both under Retail Distribution, require retail listing. Your Instant Store link doesn't need one."],
  ["What's the difference between selling directly to readers and selling through Amazon or Ingram?",
   "On your Instant Store, you bring the buyer and set the price, so what's left after your printing cost is yours. Through Amazon or Ingram, the retailer brings the buyer and takes its own cut."],
  ["Can I sell more than books, like magazines or notebooks, the same way?",
   "Yes. Magazines and notebooks & journals are sellable through most of these routes; wall art isn't sellable through any of them yet. Availability varies by channel, so check each route's product page for specifics."],
  ["How do I decide which of Blurb's selling options is right for me?",
   "Start with the comparison table above. It lines up best-for, profit, storefront and audience across all four routes so you can compare at a glance."],
];

export default function SellLandingV2({ onGo }) {
  return (
    <div style={{ fontFamily: FONT_BODY, color: C.gray950 }}>

      {/* ── Hero ──
          "Sell with Blurb" read as sell THROUGH Blurb — a marketplace
          you list on, not a production partner behind whatever you
          build (your own store, a retailer listing, your own app).
          "However you sell, it's still your book" didn't land either
          (Ana).

          "You sell it. We print it." was the next attempt, and it
          carried the same problem the subheading did (Ana, on a later
          pass): splitting the work as "you handle selling, we only
          print" undersells the four routes themselves, which ARE
          Blurb's selling tools (an Instant Store included, not just
          fulfillment behind whatever the seller already built).
          Rewritten so the headline states that division correctly —
          seller creates, Blurb helps sell AND prints — which also
          means the subheading no longer has to carry that point itself
          via an added clause ("each with the tools to sell built in"
          read awkwardly, Ana's second pass). It goes back to plainly
          describing the four routes plus fulfillment.

          Custom rather than HeroCenter: it originally carried a tick row
          too (the brief's "Overall benefits applicable to all seller
          tools"), tried both above and below the button — Ana called
          both placements "off", and two of the three ticks already
          duplicate "Included with every way you sell" below, so they're
          cut rather than relocated a third time. What's left (heading,
          subheading, one CTA) matches HeroCenter's own shape closely
          enough that it could probably move back to that component; kept
          hand-built for now since nothing here needs its slot. */}
      <section className="hero-gradient-seller" style={{ padding: "clamp(56px, 8vw, 96px) 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "grid", gap: 20, justifyItems: "center" }}>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 400, letterSpacing: "-0.01em",
            fontSize: "clamp(2rem, 4.6vw, 2.75rem)", lineHeight: 1.2, margin: 0,
          }}>
            You made it. We help you sell it.
          </h1>
          <p style={{ fontSize: TYPE.lg, lineHeight: 1.55, color: T.textSubtle, margin: 0, maxWidth: 640 }}>
            Four ways to reach readers: an Instant Store we build for you, global retail distribution, bulk printing, or your own platform. We print and ship every order, so you can focus on creating.
          </p>
          <Button as="a" href="#paths" style={{ marginTop: 8 }}>Explore our selling tools</Button>
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
            {/* All four hand-built, not just Retail Distribution (Ana:
                "keep it closer... consistent card layouts") — Card's
                `link` slot only ever renders one anchor through Codex's
                own <Link>, which is where the unwanted "open in new tab"
                icon was coming from (see PathLink above). Retail's three
                destinations couldn't fit through that slot at all, so it
                was already hand-built; the other three now use the exact
                same structure — same tile, same title class, same
                description tokens, same PathLink — so nothing about one
                card's layout can drift from another's the way title
                size, tile treatment, and link style all had before. */}
            {SELL_PATHS.map(card => (
              <div key={card.id} style={{
                display: "flex", flexDirection: "column", alignItems: "flex-start",
                width: "100%", gap: "var(--codex-spacing-3)",
              }}>
                <PathTile card={card} />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 className="path-card-title" style={{
                    fontFamily: "var(--codex-font-family-heading)", fontWeight: "var(--codex-font-weight-normal)",
                    color: "var(--codex-color-semantic-text-bold)",
                    lineHeight: "var(--codex-font-line-height-tight)", margin: 0,
                  }}>
                    {card.name}
                  </h3>
                  {card.isNew && <Chip>New</Chip>}
                </div>
                <p style={{
                  lineHeight: "var(--codex-font-line-height-snug)",
                  color: "var(--codex-color-semantic-text-bold)", margin: 0,
                }}>
                  {card.line}
                </p>
                {/* Ticks beef up what used to be just the description
                    (Ana, working from her own reference mock) — short
                    scannable value props from the CRO brief rather than
                    the mock's own full sentences. */}
                <ul style={{ display: "grid", gap: 6, margin: 0, padding: 0, listStyle: "none", width: "100%" }}>
                  {card.ticks.map(tick => {
                    const { text, linkStage, suffix } = typeof tick === "string" ? { text: tick, linkStage: null, suffix: "" } : tick;
                    return (
                      <li key={text} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span className="ms" aria-hidden style={{ fontSize: 18, color: C.blue600, flex: "0 0 auto", lineHeight: "var(--codex-font-line-height-snug)" }}>
                          check_circle
                        </span>
                        <span style={{ fontSize: TYPE.sm, color: "var(--codex-color-semantic-text-bold)", lineHeight: 1.4 }}>
                          {linkStage ? (
                            <a
                              href="#"
                              onClick={e => { e.preventDefault(); onGo?.(linkStage); }}
                              style={{ color: C.blue600, textDecoration: "underline" }}
                            >
                              {text}
                            </a>
                          ) : text}
                          {suffix}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
                  {card.links.map(([label, dest]) => (
                    <PathLink key={label} label={label} dest={dest} onGo={onGo} />
                  ))}
                </div>
              </div>
            ))}
          </CardList>

          {/* Own panel, not just a heading dropped on the section's own
              gray50 — the cards above already sit on that background, so
              the table needs a background of its own to read as a
              distinct part of the section rather than a continuation of
              the same surface (Ana: "needs a diff bg colour to the 4 ways
              to sell section"). White reads as the lift here since the
              section itself is T.bgSubtle. */}
          <div style={{
            display: "grid", gap: 20, marginTop: 8, background: T.bgNeutral,
            border: `1px solid ${T.border}`, borderRadius: R.lg,
            padding: "clamp(24px, 4vw, 40px) clamp(16px, 3vw, 32px)",
          }}>
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
                additional fees" (now relabeled "Instant Store pricing",
                see below) and "Same pricing as Instant Store" are both
                lines the brief states directly, not comparisons.

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
                      display: "flex", alignItems: "center", gap: 8,
                    }}
                  >
                    {col}
                    {col === "Instant Store" && <Chip>New</Chip>}
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

      {/* ── Showcase ── the outline's own lorem-ipsum (Figma comments
          #61/#74 marked this section as still unfinished) replaced with
          blurb.com/stories-that-bind's own real customer stories (Ana),
          not invented testimonials — see the SHOWCASE note above. No
          header button any more: the outline's own was an unsourced
          "Button text" placeholder, and each story now has its own real
          link, so a generic top-level CTA had nothing left to point at. */}
      <section style={{ background: C.gray50, padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 40 }}>
          <div style={{ display: "grid", gap: 8, textAlign: "center" }}>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
              lineHeight: 1.25, margin: 0,
            }}>
              Real books by real creators, just like you
            </h2>
            <p style={{ margin: "0 auto", fontSize: TYPE.base, color: T.textSubtle, maxWidth: 620 }}>
              Books build connections across time, space, and community. Yours will, too.
            </p>
          </div>

          <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {SHOWCASE.map(story => (
              <div key={story.title} style={{ display: "grid", gap: 8 }}>
                <img
                  src={story.img}
                  alt={story.alt}
                  loading="lazy"
                  style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: R.lg, display: "block" }}
                />
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE.lg, fontWeight: 500, marginTop: 4 }}>{story.title}</div>
                <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.6 }}>“{story.quote}”</p>
                <div style={{ fontSize: TYPE.sm, color: T.textSubtle }}>—{story.attribution}</div>
                <a
                  href={story.href} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: TYPE.sm, color: C.blue600, textDecoration: "underline", marginTop: 4 }}
                >
                  {story.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── a light blue tint (Ana: this and Trusted By were
          both plain white, back to back, with nothing separating them).
          Not gray50 — Showcase right above it already uses that, and
          two grays in a row would just move the "both look the same"
          problem rather than fix it. Trusted By below is back to white
          now (see its own note) — this tint is what gives that section
          something to contrast against. */}
      <section style={{ padding: "clamp(40px, 5vw, 56px) 24px", borderTop: `1px solid ${T.border}`, background: T.bgAccentSubtle }}>
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
          instead of a guess at their wordmarks. White, not gray50 (Ana:
          it and Stats' light blue tint sit back to back and read as two
          near-identical washed-out tones rather than two distinct
          sections) — white gives Stats' tint something to actually
          contrast against. */}
      <section style={{ padding: "clamp(40px, 5vw, 56px) 24px", background: T.bgNeutral }}>
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
            Ready to share your book with the world?
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
