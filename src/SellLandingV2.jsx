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
/* Ana (2026-09-10): "add all the actual icons that are on the figma."
   Unlike ISV2's grid (a "Custom Icons" marketing component with no
   npm equivalent), these three are raw Material Symbol vectors traced
   straight into the Figma frame — checked by drilling into each icon
   instance and reading its literal layer name off the canvas. Figma's
   own choices are auto_stories, diamond, and source_environment, not
   the print/workspace_premium/precision_manufacturing guesses these
   were before (nobody had actually opened the frame to check); all
   three are real Material Symbols names, so this is a straight
   <span className="ms"> swap, no new asset needed. */
const QUALITY = [
  ["auto_stories", "Print on demand, no inventory",
   "No upfront costs and no need to store an inventory. We print and ship only when you make a sale."],
  ["diamond", "Unmatched quality",
   "Give your audience access to Blurb's superior print quality, vast catalog of formats, and premium paper types."],
  ["source_environment", "Powered by RPI Print",
   "Our in-house fulfillment ensures quality control and reliability at scale, trusted by brands like Canva and Minted."],
];

/* Blurb's own illustrations, reused from SellerLanding.jsx rather than
   re-hosted or re-described. RPI Print API now has one too (see below). */
const ILLUS = "https://assets.blurb.com/_astro/";

/* Icons for all four, not illustrations (Ana: "inconsistent sized
   images" — the real problem was style, not size: two hand-drawn
   illustrations, one real photograph (large-order.Dolls1H4_A7dqn.webp),
   and one bare icon, side by side. No illustration existed for the API
   card at all at the time, so icon-only was the one treatment every
   card could share without fabricating new art.

   Ana later shared a reference mock with a matching illustration for
   all four cards — Instant Store, Retail Distribution, Bulk Printing
   Services, and RPI Print API — in one consistent style. RPI Print
   API's had a confirmed real source early on: the exact illustration
   blurb.com/print-api-software already uses ("code editor interface,
   books, and print mechanics"), added below as `illus`. PathTile
   rendered `illus` in place of the icon when a card had one, so the
   other three stayed icons until their own real illustrations were
   available — no fabricated art in the meantime.
   All four now have one (2026-09-10, Ana: "add in the illustrations
   for 'Four ways to sell your books' from the figma"): the other
   three extracted straight from the Figma frame's own "Category
   Tiles" nodes — Category Tiles > Card - Categories > Image, one PNG
   download per card — the same real-asset-over-redraw rule this
   project applies everywhere else, just satisfied for real this time
   instead of waiting on it. `icon` stays on each entry as PathTile's
   fallback if an `illus` path ever 404s, not because any card still
   needs it day to day. */
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
    illus: "/assets/illustrations/way-instant-store.png",
    bestFor: "Getting started fast",
    line: "Sell directly to your audience in minutes with a product page that fully showcases your book.",
    /* Down to 3 ticks (Ana). First tick turned into a real margin claim
       (Ana: "help turn the 70% lower print cost into a margin claim...
       compare it to amazon"), calculated rather than guessed: same
       $50.00 illustrative list price and figures the "Keep more of what
       you earn" table (InstantStoreV2.jsx) already uses — $17.50 print
       cost via seller pricing, 0% commission, so $32.50 profit; Amazon
       pays the standard $31.00 print-cost tier (seller pricing is
       Instant Store/RPI Print API only, confirmed by both the brief and
       Ana directly) plus its real $1.35 + 15% commission, so $10.15
       profit. $32.50 / $10.15 = 3.2x. Same caveat as the table itself:
       Amazon's $31.00 print cost is Ana's own guess, not a verified
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
       retail distribution channels" (Ana) broadened the comparison from
       Amazon specifically to the whole Retail Distribution card, then
       Ana settled the benchmark to the Blurb Bookstore alone (matching
       the same call made on the ISV2 lede) — its own numbers in the
       "See how the Blurb Instant Store compares" table ($80 listing,
       $27.90 print cost, no commission) come out to ~3.03x against
       Blurb Bookstore, which is where the "up to 3x" figure now points;
       Amazon's math above is no longer what this line claims. Ana also
       narrowed the clickable span to just "3x more profit" rather than
       "Up to 3x more profit" — the shared tick renderer had no slot for
       plain text before the link (only `text`, linked, then `suffix`,
       trailing), so it now also takes a `prefix` (plain, before the
       link) instead of folding this into a one-off `node`. */
    ticks: [
      { key: "profit", prefix: "Up to ", text: "3x more profit", suffix: " than selling through the Blurb bookstore", linkStage: "margin" },
      "No subscription, no additional fees",
      "One link to share, no store required",
    ],
    links: [["Create your Instant Store", { stage: "instantstorev2" }]],
  },
  {
    id: "retail", name: "Retail Distribution", icon: "public",
    illus: "/assets/illustrations/way-retail-distribution.png",
    bestFor: "Maximum reach",
    /* "Self-publish" added (Ana: "i'm missing the term") — it was
       nowhere in this card despite being Blurb's own name for the
       whole activity this page is about.
       REVISED 2026-09-10 (Ana): led with "self-publish" before; now
       leads with the reader-facing action ("list your book where
       readers already shop") and names the mechanism ("global book
       distribution") as the payoff instead — closer to the SEO doc's
       own phrasing for this card. */
    line: "List your book where readers already shop and reach new audiences through global book distribution.",
    /* Back to 2 ticks (Ana) — the third ("Get discovered by readers who
       don't know you yet") made this card 3 ticks plus 3 CTAs, more
       than any other card carries.

       First tick's channel names are now real inline links (Ana:
       "actually hyperlink Amazon, Ingram and Blurb Bookstore
       respectively") — same three destinations the card's own CTAs
       used to carry one-per-line below. A tick object with a `node`
       instead of `text`, since this is the one tick with more than one
       link in it; the render code below falls back to rendering `node`
       directly when present.

       Back to 3 ticks 2026-09-10 (Ana: "add a new tick under isbn to
       say 'Reach bookstores and libraries through Ingram's network'")
       — Ingram's trade-distribution reach (libraries and bookstores,
       not just online retailers) wasn't stated anywhere on this card
       before. Shortened same day to "...through Ingram" (Ana) — "'s
       network" wasn't adding a fact the rest of the sentence didn't
       already carry.

       First tick's own text shortened 2026-09-10 (Ana: "shorten... so
       it fits on 3 lines") — "access" and "list on the" trimmed to
       "the"; kept the 40,000+ retailers figure and all three real
       links, since neither was what was making the line run long. */
    ticks: [
      { key: "retail-channels", node: (
        <>
          Sell on <a href="https://www.amazon.com" target="_blank" rel="noopener noreferrer" style={{ color: C.blue600, textDecoration: "underline" }}>Amazon</a>,{" "}
          <a href="https://www.blurb.com/ingram" target="_blank" rel="noopener noreferrer" style={{ color: C.blue600, textDecoration: "underline" }}>Ingram</a>'s 40,000+ retailers, or the{" "}
          <a href="https://www.blurb.com/sell-through-blurb" target="_blank" rel="noopener noreferrer" style={{ color: C.blue600, textDecoration: "underline" }}>Blurb Bookstore</a>
        </>
      ) },
      "ISBN support included",
      "Reach bookstores and libraries through Ingram",
    ],
    /* Down from three separate per-retailer CTAs to one (Ana) — now that
       the channels are linked inline in the tick above, three more
       identical links below just repeated them. One main CTA also
       brings this card in line with the other three, which each carry
       exactly one link. No dedicated retail-distribution page exists in
       this app, so it points at the real live page that covers all
       three channels together. */
    links: [["Explore Retail Distribution", { href: "https://www.blurb.com/self-publish" }]],
  },
  {
    id: "los", name: "Bulk Printing Services", icon: "local_shipping",
    illus: "/assets/illustrations/way-bulk-printing.png",
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
    illus: "https://assets.blurb.com/_astro/switchback-image.DCOjS4vy.png",
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
   already carries.

   REVISED 2026-09-10 (Ana): "add in the illustrations for 'Four ways to
   sell your books' from the figma. make sure the pills don't conflict
   with the illustration, maybe they need to be above them. respect the
   sizing of the current figma." All four cards now carry a real
   illustration (Instant Store, Retail Distribution and Bulk Printing
   Services extracted fresh from Figma's own "Category Tiles" nodes —
   same export-a-real-PNG approach already used for ISV2's step
   illustrations and icons; RPI Print API keeps the illustration it
   already had, confirmed against the live rpiprint.com/print-api-
   software page). Two changes fall out of that:
     - The "Best for" pill used to sit absolute, floated on top of the
       tile's icon — fine over a plain icon, but a busy illustration
       under it made the pill hard to read and the pairing look
       accidental. It's a normal block now, stacked above the
       illustration instead of layered over it.
     - The tile's shape was an invented 4:3 — the real "Category Tiles"
       frame in Figma is a square (302×302), which is what these
       illustrations were actually drawn against, so the tile is 1:1
       now instead of guessing a ratio that cropped them oddly.
   The Instant Store illustration ships its own "NEW" badge baked into
   the Figma frame; cropped out of the exported asset since this page
   already marks that card "New" with its own Chip next to the title,
   and two different NEW markers on one card would read as a mistake,
   not emphasis.

   Tile background flipped cream -> white the same day (Ana: "the bg of
   the four ways to sell illustration needs to be white, as per the
   figma") — the section around these tiles briefly went cream, then
   back to white the same day once checked directly against Figma's
   own Fill property (see the section's own comment). Tile stays white
   either way; on a white section it now reads as one continuous
   surface rather than a card with a boundary, which matches what
   Figma's own "Category Tiles" frame does — no separate card fill
   behind the image there either.

   Illustration size bumped 80% -> 100% (2026-09-10, Ana: "make them
   bigger too, like in the figma") — the Image layer inside Figma's own
   Category Tiles frame fills the tile exactly (302x302 image in a
   302x302 frame), not 80% of it with a margin around it. */
function PathTile({ card }) {
  return (
    <div style={{
      width: "100%", background: "#fff", borderRadius: R.lg,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {card.bestFor && (
        /* Blue -> charcoal 2026-09-10 (Ana: "have the pills be
           black-on-white or charcoal-on-white pill to differentiate
           from hyperlinks and reduce blue treatment") — blue on this
           page already means "link" (the ticks below, the CTAs); a
           blue pill on every card competed with that meaning instead
           of just being a label. */
        <span style={{
          alignSelf: "flex-start", margin: 12,
          padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
          background: "#fff", border: `1px solid ${C.gray950}`, color: C.gray950,
        }}>
          Best for: {card.bestFor}
        </span>
      )}
      <div style={{
        aspectRatio: "1 / 1", display: "grid", placeItems: "center",
        marginTop: card.bestFor ? -12 : 0,
      }}>
        {card.illus ? (
          <img src={card.illus} alt="" aria-hidden loading="lazy" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
        ) : (
          <span className="ms" aria-hidden style={{ fontSize: 56, color: C.blue600 }}>{card.icon}</span>
        )}
      </div>
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

/* No dot when a row has no status (Ana: "Best for" isn't comparing
   anything, so a green dot on all four cells implied a judgment that
   isn't there). First pass kept the dot's reserved space so the row's
   text lined up with the dot-carrying rows below — wrong call (Ana:
   "indentation is still there, should be aligned to the start of the
   bullet points"): she wants this row's text flush with where the
   dots themselves start, not with where dotted rows' text happens to
   land once indented past them. Renders nothing at all now, so the
   cell's flex layout collapses that space and the text starts at the
   cell's own left edge. */
function StatusDot({ status }) {
  if (!status) return null;
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
  /* No status on this row (Ana: "remove the green dots on the first
     row as that doesn't make sense there, it's not comparing") — every
     other row scores the four routes against each other; this one just
     says who each is for, which isn't a green/yellow/red judgment. */
  { label: "Best for", cells: [
    { text: "Sellers with their own audience: followers, a newsletter, no store yet" },
    { text: "Reaching new readers who don't know you yet" },
    { text: "Bulk printing for an event, gift, or resale" },
    { text: "Developers building print into their own product" },
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

/* Revised (Ana, working from a reference mock): "Best for" per format,
   same convention the SELL_PATHS cards above and /self-publish's own
   "Choose how to sell your book" cards already use, alongside the
   formats/papers/sizes count line rather than replacing it (Ana: "i
   also still liked the format/sizes thing, can you bring it back").
   Rendered by hand (see below) as a bold "Best for:" line plus the
   sell-what-you-can sentence. Copy follows the reference's own "Best
   for" lines closely, but the longer sentence is freshly written
   rather than echoing it back verbatim — the reference repeated its
   "Best for" text as the description too on two of its four cards,
   which reads as unfinished placeholder rather than real copy.

   "Best for" stays a Sell v2 thing only (Ana, on reflection: "i
   actually think 'best for' makes sense on sell v2 not in isv2") —
   this page is comparing four different ways to sell, so "who's this
   format best for" fits; ISV2 is a single Instant Store, so its own
   version of this section keeps the eyebrow and description only, no
   `bestFor` field. `formats`/`papers`/`sizes` are read directly off
   blurb.com/pricing (2026-09-06), not the local catalog matrix —
   CLAUDE.md already documents several gaps between the two (the "T7"
   price gaps), and the live page is what a seller actually reads.
     formats = distinct binding rows (Paperback / Imagewrap Hardcover /
       Dust Jacket Hardcover / Wire-O Softcover)
     papers  = distinct paper/finish sections (Standard, Premium,
       Mohawk Superfine, layflat variants, etc. each count once)
     sizes   = the count /pricing itself states in each card's own
       "X sizes" line

   Photo Books and Notebooks & Journals get their own photography
   instead of FORMAT_CARDS' shared images (Ana: "and imagery") — real
   Blurb photos from blurb.com/photo-books and blurb.com/notebooks, a
   travel-themed hardcover and an open notebook shot, picked to read
   as distinct from the Paris café / closed-cover shots FORMAT_CARDS
   already uses everywhere else in this app. Paperback & Hardcover and
   Magazines keep FORMAT_CARDS' own images (matched by id, below) —
   they already match the reference mock's own photography closely
   enough that swapping them would just be work for its own sake. */
/* Each card links to its real blurb.com category page (2026-09-10,
   Ana: "have each one link to each of Blurb's category listing pages,
   on both isv2 and selling overview") — confirmed live URLs by reading
   them off blurb.com's own nav rather than guessing at the slug.
   "Paperback & Hardcover" -> "Paperbacks & Hardcovers" 2026-09-10 (Ana,
   both pages) — plural to match the other three titles, all of which
   already read as categories rather than single items. */
const SELL_FORMATS = [
  { id: "photo", title: "Photo Books", formats: 3, papers: 7, sizes: 6,
    bestFor: "Photographers and visual storytellers building their audience.",
    desc: "Sell photo books, wedding albums, and layflat photo books in premium papers and formats.",
    img: "https://assets.blurb.com/_astro/linen-hardcover-dustjacket-optimized.DNuztDk1.webp",
    alt: "Stack of linen hardcover with dust jacket photo books with a red scooter on the cover and the title “Life in Italy.”",
    href: "https://www.blurb.com/photo-books" },
  { id: "trade", title: "Paperbacks & Hardcovers", formats: 3, papers: 3, sizes: 3,
    bestFor: "Selling directly to your audience or through retail distribution.",
    desc: "Create hardcover and paperback books, novels, cookbooks, children's books, and more.",
    href: "https://www.blurb.com/hardcover-and-paperback-books" },
  { id: "magazine", title: "Magazines", formats: 1, papers: 1, sizes: 1,
    bestFor: "Ongoing series, zines, and one-off editorial projects.",
    desc: "Sell magazines with newsstand-quality printing, perfect for lookbooks, zines, or serial content.",
    href: "https://www.blurb.com/magazines" },
  { id: "notebook", title: "Notebooks & Journals", formats: 4, papers: 1, sizes: 3,
    bestFor: "Creators building a branded product line alongside their books.",
    desc: "Sell notebooks and journals in blank, lined, or dot-grid formats, a natural companion to your books.",
    img: "https://assets.blurb.com/_astro/linen-hardcover-with-dustjacket-notebook-optimized.CQRJ330f.webp",
    alt: "Open linen hardcover notebook with dust jacket showing travel photography of Greece on one side, and blank lined paper on the other.",
    href: "https://www.blurb.com/custom-notebooks-journals" },
];

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

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

/* Updated to 4 (Ana, from a reference screenshot: "21 years / 140
   countries / 11M+"): the third stat splits out of the countries
   caption's own "20M unique books" clause into a card of its own,
   sustainability stays as the fourth. Existing captions kept verbatim
   as asked ("keep the current subtitle copy") rather than rewritten to
   match the new headline numbers — worth flagging that this leaves two
   small inconsistencies: the years caption still says "20 years" under
   a "21 years" headline, and the countries caption still says "20M"
   inline while the new books card headlines "11M+" for what reads like
   the same fact. Neither figure (21 years, 140 countries, 11M+) is
   sourced or verified against blurb.com; they're Ana's own numbers from
   the reference.

   Back to 3 (2026-09-10, Ana: "can you remove 'Sustainable papers &
   practices' entirely"). Worth noting: Figma's own version of this
   section never had it either — checked while pulling the illustrated
   numbers below, and its "Stats" row only ever carried these three.
   The fourth card was this file's own addition, not something being
   walked back from the source.

   Icon name swapped for a real illustrated numeral (same request:
   "add in the illustrated numbers on the figma for 21 years, 140,
   11m etc."). These aren't a display font — each one is a literal
   hand-inked digit graphic (Figma's own "Number_N_md_ink" asset,
   composed per stat as "21"/"140"/"11"), extracted the same way as
   every other real Figma asset this session: select the composed
   group, Export panel, the real download button, not a screenshot.
   Files live in public/assets/numbers/. The word that used to sit
   inline with the number ("21 years") now renders on its own line
   below the image, matching how Figma actually stacks them — a
   plain word, not part of the illustration. */
/* Countries caption revised 2026-09-10 (Ana): "with over 20M unique
   books and products created and sold" dropped for "with over 1B
   pages printed" — a new figure of Ana's own, distinct from the "11M+"
   books-and-products count the third card already states, so the two
   no longer read as the same fact worded two ways. */
const STATS = [
  ["/assets/numbers/stat-21.png", "years",
   "Backed by 20 years of in-house expertise and full production control, Blurb ensures consistent quality from start to finish. No outsourcing, no compromises."],
  ["/assets/numbers/stat-140.png", "countries",
   "Shipped to a global network of buyers and readers, with over 1B pages printed."],
  ["/assets/numbers/stat-11.png", "million",
   "Unique books and products created and sold, and counting."],
];

const TRUSTED_BY = ["Canva", "minted", "Treering", "Storyworth", "We Can Books"];

/* Questions are the outline's own (Accordion Block, 8 sections); it
   carries no answer text (every section is closed, title only), so
   the answers below are drafted — a sentence to react to, same as the
   route cards on v1's Sell page were before Ana had copy to react to. */
/* Aligned to the SEO team's own "Seller Hub" FAQ list ("SEO Recommendations
   for Seller Hub & Instant Store" — Allison Wollman: "Let's tighten them up
   to max. 8"), question wording kept verbatim where they gave it. Only two
   real changes from the previous list: "Where's the best place to sell my
   books online?" dropped for their "How do I start selling my book
   online?" (the "which route fits me" ground it covered is already owned
   by the last question here), and their own "Can I sell more than books,
   like calendars, journals, magazines, or notebooks?" drops "calendars" —
   Blurb doesn't sell calendars anywhere in this catalog, so it's not a
   real answer here even though it's a real search phrase; worth flagging
   to the SEO team rather than answering "yes" to a product that doesn't
   exist. Answers lead with the direct fact first per their AEO/GEO note
   ("the first sentence... should directly state the fact... since that's
   the sentence most likely to get lifted verbatim into an AI Overview or
   chatbot answer") — already true of every answer here, so no rewording
   needed beyond the two question swaps. */
const FAQS = [
  ["What are the different ways to sell a self-published book?",
   "Four: your own Instant Store, Retail Distribution through Blurb's Bookstore, Amazon and Ingram, Bulk Printing Services for large-quantity orders, or the RPI Print API for your own storefront."],
  ["How do I start selling my book online?",
   "Pick a project you've already created, then choose a route above and follow its own setup. Most sellers start with an Instant Store, since it's live in minutes with no separate sign-up."],
  ["Can I sell books without holding inventory or paying anything upfront?",
   "Yes. Instant Store and Retail Distribution both print a copy only once it's ordered, so there's nothing to buy or store in advance."],
  ["How does print-on-demand work for authors and creators?",
   "Your book prints only when a buyer orders it. There's no minimum run, no warehouse, and no upfront printing cost to cover before you make a sale."],
  ["Do I need an ISBN or barcode to sell my book?",
   "Only Amazon and Ingram, both under Retail Distribution, require retail listing. Your Instant Store link doesn't need one."],
  ["What's the difference between selling directly to readers and selling through Amazon or Ingram?",
   "On your Instant Store, you bring the buyer and set the price, so what's left after your printing cost is yours. Through Amazon or Ingram, the retailer brings the buyer and takes its own cut."],
  ["Can I sell more than books, like magazines, journals, or notebooks, the same way?",
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
          {/* "You made it. We help you sell it." -> "Sell your book
              online with Blurb" 2026-09-10 (Ana) — plainer and closer to
              the SEO doc's own H1 ("Sell your books online with Blurb"),
              singular "book" per Ana's own wording rather than the doc's
              plural. */}
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 400, letterSpacing: "-0.01em",
            fontSize: "clamp(2rem, 4.6vw, 2.75rem)", lineHeight: 1.2, margin: 0,
          }}>
            Sell your book online with Blurb
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
          between two dense sections and doesn't need that much air.

          Order reshuffled three times in one day (2026-09-10), each
          time on Ana's own direct instruction rather than a re-read of
          Figma: first after "Four ways to sell" (matching Figma's own
          section order), then back before it plus above the selling
          path table (Ana: "included with every way you sell needs to
          go above the selling path table"), then explicitly after it
          again once the table was split into its own section (Ana:
          "swap the order: 4 ways to sell your books, then included
          with every way you sell, then the selling path table"), and
          now first again (Ana: "i think we do included with every way
          you sell first, then 4 ways to sell") — no reasoning given
          for reversing again, so not re-litigated here either. */}
      <section style={{ padding: "clamp(32px, 4vw, 48px) 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <CardList
            heading="Included with every way you sell"
            headingAlign="center"
            layout={{ mobile: 1, tablet: 3, desktop: 3 }}
          >
            {QUALITY.map(([icon, title, body]) => (
              <Card
                key={title}
                icon={
                  <span
                    className="ms"
                    aria-hidden
                    style={{
                      fontSize: 40, color: C.blue600,
                      /* "diamond" 2026-09-10 (Ana: "the diamond icon
                         thickness is too thick compared to the rest of
                         icons on that page," flagged on ISV2's matching
                         tile) — same glyph, same fix here for
                         consistency: dial the variable font's wght axis
                         down for this one icon rather than the row. */
                      ...(icon === "diamond" ? { fontVariationSettings: "'wght' 300" } : {}),
                    }}
                  >
                    {icon}
                  </span>
                }
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
          twice, once skimmed and once read across.
          Background swapped gray50 -> #f5f0ea -> white, twice in one
          day. First pass (Ana: "on the figma, we're using beige bg
          rather than the grey") went off a visual read of the canvas.
          Reverted same day (Ana: "make the four ways to sell have
          white bg, like the figma") once checked directly against this
          section's own Figma node: its Fill is explicitly "Bg/Surface"
          (#FFFFFF), not beige — the earlier beige read was a mistake,
          not a change of direction. Lesson for next time: check a
          layer's actual Fill property, not just how a screenshot looks
          next to a warm-toned neighbor.
          Padding cut clamp(56,7vw,80) -> clamp(40,5vw,56) 2026-09-10
          (Ana: "reduce padding above four ways to sell and all section
          titles, it's too much, follow the figma") — same reduction
          applied to every other section on this page still carrying
          the old heavier value ("Sell photo books..." and "Showcase"),
          so the page reads as one consistent rhythm rather than this
          one section standing out. */}
      <section
        id="paths"
        style={{
          background: "#fff", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`,
          padding: "clamp(40px, 5vw, 56px) 24px", scrollMarginTop: 140,
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gap: 48 }}>
          {/* Heading passed to CardList itself, not a separate div above
             it — CardList's own layout already reserves top padding for
             a heading area whether or not one is given, so a manual
             heading here on top of this outer grid's own `gap` stacked
             two spacings and left a much bigger gap than every other
             CardList-heading section on this page. */}
          {/* "Four ways to sell" -> "Four ways to sell your books" — the
              SEO doc's own general direction ("include keywords... if not
              feasible, still beneficial to consider adding 'books'"),
              modeled on its own example heading, "One platform, five ways
              to sell books".
              Subheading dropped 2026-09-10 (Ana: "too complicated") — the
              four cards below already show, not tell, that each option
              stands on its own. Brought back 2026-09-14 (Ana: "there used
              to be a subheading... about adding more channels or
              something. can you bring that back?"), same wording as
              before. */}
          <CardList
            heading="Four ways to sell your books"
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
                    the mock's own full sentences. First pass at "too
                    much blue" de-styled the one clickable tick itself
                    (Instant Store's profit claim) to plain text —
                    wrong fix (Ana: "up to 3x more profit still should
                    have the hyperlink treatment... i meant the ticks
                    with the circle should be in font colour"). The
                    actual source of the blue overload is the
                    check_circle icon repeated on every tick of every
                    card — four cards, up to three ticks each, all in
                    C.blue600 — not the one real link, which reverts to
                    looking like a link again.
                    check_circle -> check (2026-09-10, Ana: "i still
                    don't like the ticks on the section -- do we have a
                    tick without a circle, so it's less busy") — same
                    Material Symbol family, just the bare glyph instead
                    of the ringed variant. */}
                <ul style={{ display: "grid", gap: 6, margin: 0, padding: 0, listStyle: "none", width: "100%" }}>
                  {card.ticks.map(tick => {
                    const { text, linkStage, prefix, suffix, node, key } =
                      typeof tick === "string" ? { text: tick, linkStage: null, prefix: "", suffix: "", node: null, key: tick } : tick;
                    return (
                      <li key={key || text} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span className="ms" aria-hidden style={{ fontSize: 18, color: "var(--codex-color-semantic-text-bold)", flex: "0 0 auto", lineHeight: "var(--codex-font-line-height-snug)" }}>
                          check
                        </span>
                        <span style={{ fontSize: TYPE.sm, color: "var(--codex-color-semantic-text-bold)", lineHeight: 1.4 }}>
                          {node ? node : (
                            <>
                              {prefix}
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
                            </>
                          )}
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
        </div>
      </section>

      {/* ── Which selling path is right for you? ── split out of the
          combined "Four ways to sell" section 2026-09-10, once Ana
          wanted "Included with every way you sell" to sit as its own
          section rather than folded into this one — the cards and the
          table used to be one section ("the cards and the table are
          one question asked twice"); that reasoning still holds for
          keeping the table right after the cards, only "Included..."
          moved out from between them. Which of the three sections
          comes first has changed several times since (see the comment
          on "Included with every way you sell" above) — this one has
          stayed last throughout. The table's own panel (border, white
          fill, radius) still gives it a defined edge on its own, so
          this wrapper stays plain rather than re-adding the
          colored/bordered treatment the combined section used to
          carry. */}
      <section style={{ padding: "clamp(40px, 5vw, 56px) 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
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


      {/* ── What can you sell ── heading, subheading and "Best for" cards
          revised from a reference mock (Ana); see SELL_FORMATS' own note
          above for the copy and imagery reasoning. Heading also picks up
          the SEO doc's own general direction (naming "photo books,
          magazines, notebooks" rather than the generic "product"). */}
      <section style={{ padding: "clamp(40px, 5vw, 56px) 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <CardList
            className="format-heading-fit"
            heading="Sell photo books, magazines, notebooks & more"
            subheading="Whatever you create, Blurb has a print-on-demand format and a selling path to match."
            headingAlign="center"
            layout={{ mobile: 1, tablet: 2, desktop: 4 }}
          >
            {/* Hand-built, not Codex's Card (Ana: "style the best for text
                a bit better, it looks like the same paragraph") — Card's
                own CSS reset zeroes every <p> margin inside it
                ([data-codex-component] p { margin: 0 }), and its
                Markdown description has no way to style one paragraph
                differently from the next, so "Best for: X" and the
                sentence after it rendered flush together as one block
                with no visual break. This gives "Best for:" its own
                bold, brand-blue label distinct from the value after it,
                real spacing before the description, and a lighter,
                subtler color on the description so the two read as two
                different things rather than one paragraph split by a
                bolded word. */}
            {/* Only the image links out to its real blurb.com category
                page 2026-09-10 (Ana: "make just the images be clickable
                not the whole card plz") — reverses the same-day whole-
                card-link pass; title/best-for/description are plain
                text again. */}
            {SELL_FORMATS.map(f => {
              const photo = f.img ? f : FORMAT_CARDS.find(c => c.id === f.id);
              return (
                <div key={f.id} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", gap: "var(--codex-spacing-3)" }}>
                  <a href={f.href} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%" }}>
                    <img
                      src={photo.img}
                      alt={photo.alt}
                      loading="lazy"
                      style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block", borderRadius: R.lg }}
                    />
                  </a>
                  <p style={{ margin: 0, fontSize: "var(--codex-font-size-xs)", color: "var(--codex-color-semantic-text-subtle)", lineHeight: "var(--codex-font-line-height-snug)" }}>
                    {plural(f.formats, "format")} · {plural(f.papers, "paper")} · {plural(f.sizes, "size")}
                  </p>
                  <h3 style={{
                    fontFamily: "var(--codex-font-family-heading)", fontWeight: "var(--codex-font-weight-normal)",
                    color: "var(--codex-color-semantic-text-bold)", fontSize: "var(--codex-font-size-3xl)",
                    lineHeight: "var(--codex-font-line-height-tight)", margin: 0,
                  }}>
                    {f.title}
                  </h3>
                  <div style={{ display: "grid", gap: 6 }}>
                    <p style={{ margin: 0, fontSize: TYPE.sm, lineHeight: "var(--codex-font-line-height-snug)" }}>
                      <span style={{ fontWeight: 700, color: C.blue600 }}>Best for:</span>{" "}
                      <span style={{ color: "var(--codex-color-semantic-text-bold)" }}>{f.bestFor}</span>
                    </p>
                    <p style={{ margin: 0, fontSize: TYPE.sm, color: "var(--codex-color-semantic-text-subtle)", lineHeight: "var(--codex-font-line-height-snug)" }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
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
          link, so a generic top-level CTA had nothing left to point at.

          SUBHEAD REVISED 2026-09-10 (Ana: "needs to be clear these are
          sellers / using our selling tools on the title or subtitle plz
          without calling them sellers"): this section sits on the Sell
          page, but its own copy never said these creators sold anything
          — "real creators, just like you" reads as true of any Blurb
          customer on any page. Kept the title (it's the emotional hook,
          and two of the three stories link straight to a real Bookstore
          product page, so "real books" already checks out); rewrote the
          subhead to name the selling fact directly, with "sold" as a
          verb rather than "seller" as a label for the people.

          gray50 -> #f5f0ea 2026-09-10 (Ana: "Real books by real
          creators, just like you bg needs to be beige too") — same
          cream tone this page now uses throughout. */}
      <section style={{ background: "#f5f0ea", padding: "clamp(40px, 5vw, 56px) 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gap: 40 }}>
          <div style={{ display: "grid", gap: 8, textAlign: "center" }}>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
              lineHeight: 1.25, margin: 0,
            }}>
              Real books by real creators, just like you
            </h2>
            <p style={{ margin: "0 auto", fontSize: TYPE.base, color: T.textSubtle, maxWidth: 620 }}>
              They used Blurb's tools to sell their work. Yours can too.
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

      {/* ── Stats ── white again (Ana, reversing the earlier call): this
          section carries a lot of numbers now (four, up from three) and
          reads more like a proof strip on a clean background than a
          tinted callout. Trusted By below picks up the light blue tint
          instead, so the two still contrast with each other rather than
          both reading as the same washed-out white.
          Back to three cards and a hand-inked number image per card
          (see the STATS comment above) — the icon-plus-text-headline
          treatment is gone, replaced by the illustration with its own
          word underneath, tight against it the way Figma stacks them.
          Padding widened and the numbers sized up 2026-09-10 (Ana:
          "the stats numbers look smaller than on figma" / "stats bar
          is wider height on the figma which i think looks nicer") —
          56px was matched to Trusted By below; the two now read as
          deliberately different weights (this section carries the
          proof, Trusted By is a quieter logo strip) instead of two
          bars of the same height back to back. Number height (56px)
          matches "140"'s own native rendered height in Figma at 100%
          zoom — the tallest of the three real assets — rather than
          the smaller shared value used before. */}
      <section style={{ padding: "clamp(56px, 7vw, 88px) 24px", borderTop: `1px solid ${T.border}`, background: T.bgNeutral }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", display: "grid", gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}>
          {/* marginTop -4 -> 8 (2026-09-10, Ana: "in the figma there's
              more padding between number and label") — was pulling the
              word tight against the illustrated number; Figma gives the
              two real air between them instead of stacking them flush. */}
          {STATS.map(([img, word, caption]) => (
            <div key={word} style={{ display: "grid", gap: 8 }}>
              <div>
                <img src={img} alt="" aria-hidden loading="lazy" style={{ height: 56, width: "auto", display: "block" }} />
                <div style={{
                  fontFamily: FONT_DISPLAY, fontSize: TYPE["2xl"], fontWeight: 600,
                  color: T.textNeutral, marginTop: 8,
                }}>
                  {word}
                </div>
              </div>
              <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle }}>{caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trusted by ── the outline's actual logo lockup (Canva,
          Minted, Treering, Storyworth, We Can Books — names confirmed
          by Figma comment #63), exported straight off the frame rather
          than reproduced as styled text, so the real marks show up
          instead of a guess at their wordmarks.
          Padding cut 2026-09-10 (Ana: "trusted by is lower height...
          on the figma which i think looks nicer") — a logo strip
          doesn't carry the same weight as the proof numbers above it,
          so it shouldn't claim the same amount of vertical space.

          Blue -> light grey, later the same day (Ana: "the trusted by
          blue bg is weird, can you revise?"). Blue was picked over
          grey originally because Showcase right above Stats used
          gray50 at the time and a second gray two sections down felt
          repetitive — but Showcase is cream now (a separate change
          since), so that reasoning no longer holds and grey, the other
          option Ana offered at the time, is the one left standing. */}
      <section style={{ padding: "clamp(24px, 3vw, 32px) 24px", background: C.gray50 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <img
            src="/assets/trusted-by-logos.png"
            alt={`Trusted by ${TRUSTED_BY.join(", ")}`}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </section>

      {/* "Common questions about selling with Blurb" -> "Selling books
          with Blurb FAQ" 2026-09-10 (Ana) — matches the SEO doc's own
          H2 for this section exactly. */}
      <Faq heading="Selling books with Blurb FAQ" items={FAQS} />

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
