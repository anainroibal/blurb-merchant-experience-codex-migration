import React from "react";
import { Button, CardList, Card } from "@blurb/codex-react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import { FORMAT_CARDS } from "./FormatCards.jsx";
import Faq from "./Faq.jsx";

/* ── InstantStoreMockup ──
   Originally modeled on a Figma Make POC's own product-page screenshot
   (260824-POC — Instant Store LP); corrected against the real Instant
   Store demo's actual PDP once Ana shared a screenshot of it. No format
   picker — only one format ships at launch, so a Hardcover/Softcover
   toggle overclaimed. No "Printed and shipped by Blurb" badge either —
   the real PDP doesn't carry one. Preview added, since it's on the real
   page and Ana called it out as worth showing. Used once, not twice
   (Ana: showing it in both the hero and the walkthrough read as the
   same image repeated) — it lives in the walkthrough section only; the
   hero goes back to a plain hero with the demo video restored beside
   it. Real Blurb product photography (FORMAT_CARDS' own photo book
   image) stands in for the cover; title/author/description are a
   placeholder in the same spirit as this file's other honest
   placeholders (the Showcase section, "Share anywhere"'s lorem ipsum).
   Price is a round $30 (Ana) rather than the margin table's own $50.00 —
   this mockup is illustrating the page, not the table, so it doesn't
   need to carry that exact figure. */
const MOCKUP_COVER = FORMAT_CARDS.find(c => c.id === "photo");

/* Jamie Reyes' other (fictional) books, for the "More by this author"
   section below — see that section's own comment. `pos` crops the
   one real cover photo to a different focal point per card so the
   three don't look like the exact same crop repeated. */
const MORE_BOOKS = [
  { title: "Harbor Light", price: "$28.00", pos: "20% 60%" },
  { title: "Windward", price: "$32.00", pos: "80% 30%" },
  { title: "Low Tide", price: "$26.00", pos: "50% 80%" },
];

function InstantStoreMockup() {
  return (
    <div style={{
      borderRadius: R.lg, overflow: "hidden", border: `1px solid ${T.border}`,
      background: "#fff", boxShadow: "0 24px 60px -24px rgba(13, 47, 68, 0.35)",
    }}>
      {/* Browser chrome — signals "this is a real page", not a book cover. */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "10px 14px", borderBottom: `1px solid ${T.border}`, background: C.gray50,
      }}>
        {["#ff5f57", "#febc2e", "#28c840"].map(c => (
          <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
        <div style={{
          marginLeft: 8, flex: 1, background: "#fff", border: `1px solid ${T.border}`, borderRadius: 6,
          padding: "3px 10px", fontSize: 11, color: T.textSubtle, fontFamily: "monospace",
        }}>
          blurb.com/c/123/coastal-mornings
        </div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 24, padding: 24,
      }}>
        <img
          src={MOCKUP_COVER.img}
          alt={MOCKUP_COVER.alt}
          loading="lazy"
          style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: R.md, display: "block" }}
        />
        <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
          <h3 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "1.25rem", lineHeight: 1.25 }}>
            Coastal Mornings
          </h3>
          <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle }}>by Jamie Reyes</p>
          <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>
            A year of early tides and empty beaches, shot along the Pacific coast.
          </p>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: "1.5rem", fontWeight: 500, marginTop: 4 }}>
            $30.00
          </div>
          <Button size="small">Buy now</Button>
        </div>
      </div>

      {/* Book preview — the real PDP's own standout feature (Ana), missing
          from the first pass of this mockup entirely, then an icon
          placeholder (Ana: "add the preview image too"), then a single
          reused cover photo (Ana: "use this other screenshot" — a real
          open two-page spread, not a cropped cover). Rebuilt as an
          actual spread: two facing pages with placeholder body text (not
          real book content, same honest-placeholder spirit as this
          file's other invented copy) and a folded-corner cue on the
          right page suggesting more pages to turn. "View fullscreen" is
          now a bordered button with an icon, matching the reference
          rather than a bare text link. Given more room (Ana: "the
          preview can be bigger") now that More by Jamie Reyes below is
          simplified down to make space — a fixed aspect ratio on the
          spread itself, not just bigger type, so it reads as a real
          page size rather than a text box that happens to be tall. */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: "16px 24px", display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: TYPE.lg }}>Book preview</div>
            <div style={{ fontSize: 11, color: T.textSubtle }}>First 15 pages</div>
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
            border: `1px solid ${T.border}`, borderRadius: R.md, background: "#fff",
            fontSize: 11, fontWeight: 600, color: T.textNeutral, cursor: "pointer",
          }}>
            <span className="ms" aria-hidden style={{ fontSize: 14 }}>open_in_full</span>
            View fullscreen
          </button>
        </div>

        <div style={{
          position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr",
          border: `1px solid ${T.border}`, borderRadius: R.md, overflow: "hidden",
          boxShadow: "0 12px 30px -18px rgba(13, 47, 68, 0.4)", background: "#fff",
          aspectRatio: "5 / 3",
        }}>
          <div style={{ padding: "28px 24px", borderRight: `1px solid ${T.border}`, display: "grid", gap: 14, justifyItems: "center", alignContent: "start" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: "1.4rem", fontWeight: 600 }}>1</div>
            <p style={{ margin: 0, fontSize: 11, lineHeight: 1.8, color: T.textNeutral, textAlign: "left" }}>
              The tide had already turned by the time she reached the shoreline, the morning light catching on wet sand still dark from the night before.
            </p>
          </div>
          <div style={{ position: "relative", padding: "28px 24px", display: "grid", gap: 14, alignContent: "start" }}>
            <p style={{ margin: 0, fontSize: 11, lineHeight: 1.8, color: T.textNeutral, textAlign: "left" }}>
              She'd made this walk a hundred times, but the quiet never felt routine. Somewhere past the rocks a gull called out, once, then again.
            </p>
            {/* Folded corner — a simple diagonal cue that the page turns,
                not a real interactivity affordance. */}
            <div style={{
              position: "absolute", bottom: 0, right: 0, width: 36, height: 36,
              background: "linear-gradient(135deg, transparent 50%, #f0f0f0 50%)",
              borderLeft: `1px solid ${T.border}`, borderTop: `1px solid ${T.border}`,
            }} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, fontSize: 11, color: T.textSubtle }}>
          <span className="ms" aria-hidden style={{ fontSize: 16 }}>chevron_left</span>
          Page 1 of 15
          <span className="ms" aria-hidden style={{ fontSize: 16 }}>chevron_right</span>
        </div>
      </div>

      {/* More by this author — the real PDP's own feature, missing from
          every earlier pass of this mockup (Ana: "we're missing the fact
          we show other books by the author, like in the original
          figma"), then a bare row of thumbnails (Ana: "use this image
          for the more from the author bit" — full cards matching a
          reference screenshot), then simplified back down (Ana: "very
          awkward size atm" — this section was competing with Book
          preview above for visual weight, so both cover and text shrink
          to make it read as a secondary strip rather than an equal
          section). Dropped the per-card author line (redundant — the
          section heading already says whose books these are) and the
          description line. Three more fictional Jamie Reyes titles,
          same invented-placeholder spirit as "Coastal Mornings" itself
          — not real Blurb books. Same cover photo reused per card
          (cropped to a different focal point each time, same honest-
          reuse trick as elsewhere in this mockup), since no second
          placeholder cover exists. */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: "16px 24px", display: "grid", gap: 10 }}>
        <div style={{ fontWeight: 600, fontSize: TYPE.sm }}>More by Jamie Reyes</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {MORE_BOOKS.map(book => (
            <div key={book.title} style={{ display: "grid", gap: 3 }}>
              <img
                src={MOCKUP_COVER.img}
                alt=""
                aria-hidden
                loading="lazy"
                style={{
                  width: "100%", aspectRatio: "3 / 4", objectFit: "cover", objectPosition: book.pos,
                  borderRadius: R.sm, border: `1px solid ${T.border}`, display: "block",
                }}
              />
              <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3 }}>{book.title}</div>
              <div style={{ fontSize: 10, color: T.textSubtle }}>{book.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* "Set your own price" dropped (Ana: it's redundant with "Keep more of
   what you earn" below) — its copy moves down to that section instead
   of being lost, since Ana specifically wanted to keep the line. A
   preview point takes its place, since the mockup now shows the
   feature. First bullet's "format options" mention cut too, matching
   the mockup's own dropped format picker. Point 3 now names the
   mockup's own "Buy now" button specifically rather than describing
   checkout in the abstract (Ana). Point 4 folds in the no-inventory /
   pay-only-for-what-ships point (Ana) — the same fact FULFILMENT_POINTS'
   own "Print on demand" card makes further down, restated here since
   it belongs with "Blurb prints and ships it," not as a separate claim.

   Points 1 and 2 merged into one (Ana: too many points) — the product
   page and the page preview are both part of the same "here's what a
   buyer sees" fact, not two separate steps. The cross-sell point — a
   fact the mockup itself was missing (Ana: "we're missing the fact we
   show other books by the author, like in the original figma") — was
   first folded into that same merged point, then pulled back out into
   its own line (Ana: "i didn't want you to merge the 'more from the
   author' i do think that warrants a separate line"). Net result is 4
   points again, same count as before the 1+2 merge, just redistributed
   rather than shortened. Titled "Browse your other books" rather than
   "More from the author" (Ana didn't like that title) — matches
   "Showcase your work"'s own verb-first, second-person shape.

   RETITLED 2026-09-10 (Ana: "'browse your other books' still doesn't
   work because the seller isn't browsing, it's the buyer"): every
   other point here is a fact stated at the seller ("your work," "your
   buyer gets a tracked delivery"), so a bare imperative verb read as
   an instruction to the seller — "go browse" — when browsing is what
   the *buyer* does on the page. "All your books in one place" sidesteps
   it by naming the fact instead of commanding an action. Its own body
   text dropped "in one place" (now the title's line) so the two don't
   repeat the same phrase back to back — then trimmed further (Ana) to
   drop the redundant "without leaving": the point is already made by
   "right on the page," so it doesn't need restating. */
const WALKTHROUGH = [
  ["Showcase your work", "Cover, description, and pricing, plus an interactive preview so buyers can flip through real pages before they buy."],
  ["All your books in one place", "Every other book you sell shows up right on the page, so buyers can find your full catalog."],
  ["One click to buy", "A single 'Buy now' takes buyers straight to checkout, including Apple Pay, Google Pay, and PayPal. No cart to build, no plugins to configure."],
  ["Blurb prints and ships it", "No inventory to buy upfront: every order triggers a fresh print run, and you only pay for what ships. Your buyer gets a tracked delivery, and you never touch a box."],
];

/* REVISED 2026-09-10 (Ana). "Tracking on every order"'s body invented a
   support-email scenario to justify the fact — "it's weird to talk
   about support emails" — rewritten to just state what tracking does.
   "No setup required" dropped outright ("i don't know what that
   means") rather than reworded, since its own three examples
   (warehouse, carrier accounts, fulfilment integrations) are all
   things a book seller, unlike a general e-commerce seller, was never
   going to need in the first place — the claim wasn't wrong, just
   answering a question nobody here was asking.

   Its slot goes to the fact this section was missing entirely (Ana:
   "something that's missing in isv2 is the notion of quality; quality
   is a big differentiator as we have inhouse fulfilment as we talk
   about in sell v2") — Sell v2's own QUALITY array makes this exact
   claim for its "Powered by RPI Print" card; reused verbatim rather
   than redrafted; the "no outsourcing" quality story belongs here as
   much as it does on the Sell page. Icon was "precision_manufacturing"
   (a guess, same as Sell v2's own was) — updated to "source_environment"
   2026-09-10 (Ana: "change the powered by RPI print icon to match the
   new one on sell v2") once that page's real Figma icon was confirmed. */
const FULFILMENT_POINTS = [
  ["inventory_2", "Print on demand", "Every order triggers a fresh print run. No inventory to manage, no stock to buy upfront."],
  ["local_shipping", "Ships in days", "Blurb packs and ships every order directly to your buyer. You never touch a box."],
  ["verified", "Tracking on every order", "Buyers get a tracking number automatically, from checkout to delivery."],
  ["source_environment", "Powered by RPI Print", "Our in-house fulfillment ensures quality control and reliability at scale, trusted by brands like Canva and Minted."],
];

/* Revised (Ana, working from a reference mock) — new imagery for Photo
   Books and Notebooks & Journals, and revised copy, same reasoning as
   SellLandingV2.jsx's own SELL_FORMATS. No `bestFor` field here, though
   (Ana, on reflection: "i actually think 'best for' makes sense on
   sell v2 not in isv2") — Sell v2 is comparing four different ways to
   sell, so "who's this format best for" fits there; this page is a
   single Instant Store, so its own version of this section keeps the
   formats/papers/sizes count line and the description, no Best-for
   line. Counts are read directly off blurb.com/pricing (2026-09-06),
   not the local catalog matrix — see SellLandingV2.jsx's own note on
   what each count means and why it's sourced from the live page. */
const SELL_FORMATS = [
  { id: "photo", title: "Photo Books", formats: 3, papers: 7, sizes: 6,
    desc: "Sell photo books, wedding albums, and layflat photo books in premium papers and formats.",
    img: "https://assets.blurb.com/_astro/linen-hardcover-dustjacket-optimized.DNuztDk1.webp",
    alt: "Stack of linen hardcover with dust jacket photo books with a red scooter on the cover and the title “Life in Italy.”" },
  { id: "trade", title: "Paperback & Hardcover", formats: 3, papers: 3, sizes: 3,
    desc: "Create hardcover and paperback books, novels, cookbooks, children's books, and more." },
  { id: "magazine", title: "Magazines", formats: 1, papers: 1, sizes: 1,
    desc: "Sell magazines with newsstand-quality printing, perfect for lookbooks, zines, or serial content." },
  { id: "notebook", title: "Notebooks & Journals", formats: 4, papers: 1, sizes: 3,
    desc: "Sell notebooks and journals in blank, lined, or dot-grid formats, a natural companion to your books.",
    img: "https://assets.blurb.com/_astro/linen-hardcover-with-dustjacket-notebook-optimized.CQRJ330f.webp",
    alt: "Open linen hardcover notebook with dust jacket showing travel photography of Greece on one side, and blank lined paper on the other." },
];

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

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
   rule out. Anain okayed shipping it as designed (2026-09-06).

   Reworked 2026-09-06 (Ana), twice over:

   First pass — dropped the qualitative "alternative" table that used to
   sit under this one. With a real table on the page already
   (design-review-approved), a second one arguing the opposite case read
   as hedging rather than adding information, and Ana called it out
   directly ("we can break the rule in this case"). Expanded the
   remaining table with Ingram and "Other print-on-demand solutions"
   columns, and a new "Other fees" row in place of Setup fees (nobody in
   this market charges one, so a row of identical "$0"s proved nothing;
   Blurb charging none of the payment-processing/platform/hosting fees a
   generic POD stack does is a real, checkable difference instead).

   Second pass — the "$X.XX" placeholders made the table impossible to
   actually read, so it was pinned to one real spec: an 8×10 ImageWrap
   Hardcover photo book, 80 pages, with a $60.80 list price computed
   from catalog.js/pricing.data.js ($41 base at 20 pages + 60 extra
   pages at $0.33/page). Ingram is dropped for this specific product —
   it's trade-only per catalog.js, so it doesn't carry photo books —
   and RPI Print API takes its place, carrying Instant Store's own cost
   structure (same infrastructure, same 0% Blurb-side commission).
   Amazon's Commission cell keeps its real, already-sourced figure
   (CLAUDE.md's own figures section: $1.35 + 15% of list price).

   Third pass (Ana) — $60.80 "makes no sense" as the headline number on
   a page meant to sell the idea, so the list price is now a round
   $50.00 instead of a mechanically-derived one. Every other figure
   still follows the same conventions as before: print cost for
   Instant Store and RPI Print API is retail price × FULFILMENT_FACTOR
   (0.35, catalog.js) = $17.50; Blurb Bookstore and Amazon's standard
   print cost is still Ana's own guess (no real figure exists in this
   codebase for it), re-picked at $31.00 so the "up to 3x" profit claim
   used elsewhere on this page and on Sell v2 still holds ($32.50 /
   $10.15 Amazon profit = 3.2x). Same table also absorbs the standalone
   "your price / print cost / profit" widget that used to sit beside it
   (Ana: "it should be incorporated in the table") — Listing price and
   Print cost are now rows in the table itself rather than a separate
   card repeating the same two numbers. Hand-built now instead of
   Codex's ComparisonTable (Ana: "it doesn't sell it, it needs colour,
   highlights, pills") — that component's cells are plain Markdown
   strings with no way to render a colored pill inside one (confirmed
   in its own Markdown.js, no rehype-raw plugin), so a styled grid was
   needed anyway; same status-dot/zebra-row visual language Sell v2's
   own hand-built comparison table already uses, adapted with a
   highlighted Instant Store column and pill-styled profit figures
   rather than dots, since every row here is a number, not a
   included/limited/not-included judgment. The `.keep-more-table` CSS
   rule in index.html targeted Codex's ComparisonTable DOM specifically
   and no longer applies — removed rather than left as dead CSS.

   ── Corrected 2026-09-06 ──
   An earlier pass of this file invented body copy for the 3-step and
   8-tile sections instead of reading it off the Figma frame — wrong,
   and not disclosed as invented at the time either. Re-extracted from
   the frame's own Properties panel and canvas text below; the only
   two lines that are genuinely placeholder IN THE OUTLINE ITSELF are
   "Share anywhere"'s lorem ipsum and the FAQ answers (the outline has
   questions only, no answers — those stay drafted, and are flagged as
   such below). */

/* "Keep more of what you earn" table data — see the file header note
   above for where every figure comes from. Instant Store and RPI Print
   API share seller pricing, so they share every cell.

   DROPPED 2026-09-10 (Ana: "Other print-on-demand solutions doesn't
   quite live there... calling out no other fees that other competitors
   do have is key but can be done outside the table"): the column
   couldn't actually be priced — every cell but the listing price itself
   was "Varies by provider," which is exactly the kind of row-of-
   identical-nothing the original "Other fees" row (see the file header
   note) replaced Setup fees for being. Removing the column took the
   "Other fees" row with it, since without a column that actually
   charges one, four "None"s in a row proved nothing either — the real
   point (Blurb doesn't charge a separate processing/platform/
   subscription fee the way generic print-on-demand platforms do) now
   lives in a caption under the table instead, where it can say the
   comparison without needing a whole unpriceable column to hold it. */
const KEEP_MORE_COLUMNS = ["Instant Store", "Blurb Bookstore", "Amazon", "RPI Print API"];

/* "(example)" dropped from this row's own label 2026-09-10, then
   restored the same day (Ana: "revert to Your listing price
   (example)") once the in-table example row moved and got a real
   product spec of its own instead of repeating "$50 list price" —
   with the label row itself no longer next to that exact phrase, it
   reads as a plain instruction rather than an example without its own
   qualifier back on it.

   Print cost updated 2026-09-10 (Ana: "i checked the costs; it's
   $27.90 for Instant Store and RPA, and 62.78 for Bookstore and
   Amazon") — real figures in place of the earlier $17.50/$31.00
   guesses. At that point the row's own listing price was still the old
   $50.00, which put Blurb Bookstore and Amazon's profit at -$12.78 —
   this app's own documented rule is that the seller's price floors at
   their cost and can never show a loss, so the profit/margin figures
   were deliberately left stale and flagged rather than publishing a
   negative number.

   RESOLVED same day (Ana: "make the listing price be $80 across all,
   and recalculate the your profit row accordingly") — $80 clears
   Amazon's $62.78 print cost plus its own commission with room to
   spare, so nothing floors at zero any more. Profit = listing price -
   print cost - commission; Amazon's commission is $1.35 + 15% of the
   (now $80) list price = $1.35 + $12.00 = $13.35, same formula as
   before, just recomputed against the new list price:
     Instant Store / RPI Print API: 80 - 27.90 = $52.10
     Blurb Bookstore:                80 - 62.78 = $17.22
     Amazon:                80 - 62.78 - 13.35 = $3.87 */
const KEEP_MORE_ROWS = [
  { label: "Your listing price (example)", cells: ["$80.00", "$80.00", "$80.00", "$80.00"] },
  { label: "Print cost", cells: ["$27.90", "$62.78", "$62.78", "$27.90"] },
  { label: "Commission", cells: ["0%", "0%", "$1.35 + 15% of list price", "0%"] },
];

const KEEP_MORE_PROFIT = ["$52.10", "$17.22", "$3.87", "$52.10"];

/* Added 2026-09-10 (Ana: "add profit margin as well as profit on the
   earnings table. not sure if as a line or alongside, see what you
   think"). Alongside, in the same "Your profit" pill, rather than a
   fifth row: a margin row would just be this same list price divided
   into every profit figure already above it, so it repeats the row
   directly overhead rather than adding a fact. Labelled "profit"
   rather than "margin" or "profit margin" (Ana: "margin > profit
   margin or just profit" -> "do you think just profit is fine? like
   65% profit") — plainer language than the accounting term.

   Recalculated 2026-09-10 against the new $80.00 listing price and
   print costs: profit ÷ $80.00, rounded to a whole percent —
   $52.10 -> 65.1% -> 65%, $17.22 -> 21.5% -> 22%,
   $3.87 -> 4.8% -> 5%. Instant Store and RPI Print API's 65% is
   unchanged from before purely by coincidence (both the list price and
   their print cost scaled together in a way that landed on the same
   round number), not because nothing moved. */
const KEEP_MORE_MARGIN = ["65%", "22%", "5%", "65%"];

const STEPS = [
  /* "70% more of every sale" -> the calculated "3x more profit than
     selling through Amazon" claim (Ana: align it to the 3x we agreed) —
     same figure and caveats as Sell v2's Instant Store card and the
     "Keep more of what you earn" table below. Then "than selling
     through Amazon" -> "than selling through our other retail
     distribution channels" (Ana) — broadens the comparison from Amazon
     specifically to the whole Retail Distribution card. Worth flagging,
     same as Sell v2's own tick: the 3x figure is Amazon's math
     specifically (0% Instant Store commission vs Amazon's $1.35 + 15%);
     Blurb Bookstore's own numbers in the table below work out closer to
     1.7x, since it charges no commission the way Amazon does. "Seller
     pricing" -> "Instant Store pricing" (Ana), renamed everywhere on
     this page — "you're a seller on retail distro but not getting the
     price so it's not a good name for it".

     "our other retail distribution channels" -> named channels
     (2026-09-10, Ana: this page already says "Blurb retail pricing"
     elsewhere for the print-cost comparison, and having "retail" modify
     two unrelated things — a price benchmark and a channel category —
     within a few lines of each other read as term overload. Option
     considered: rename the pricing term instead; Ana picked naming the
     channels here, which is also just more concrete). Same "up to"
     qualifier as before, so the claim still only has to hold for the
     best case (Amazon, at 3x) and not uniformly across all three. */
  ["Set your price", "Upload your book and set your selling price. Our [new Instant Store pricing](?stage=margin) means up to 3x more profit than selling through the Blurb Bookstore, Amazon, or Ingram."],
  ["Create your product page", "Our AI helps you draft your title, description, and keywords. Your customizable product page is ready in minutes."],
  ["Share & sell", "Share your unique link or QR code on your bio, newsletter, or social media. We handle the printing, shipping, and sales tax."],
];

/* Illustrations added 2026-09-10 (Ana: "can you add these illustrations
   to the 1 2 3, as in the figma attached"), exported directly off the
   named Figma file (Cro Seller LP, node "Steps" > "Frame 238718" >
   "Card - Steps" 1/2/3 > "Image") rather than redrawn or approximated —
   same "no fabricated art" rule this codebase has followed for every
   other illustration (see SellLandingV2.jsx's own PathTile note).
   Order matches STEPS above 1:1. Hosted the same way this app already
   hosts its other exported-from-Figma assets (public/assets/
   instant-store-lane.png, trusted-by-logos.png). */
const STEP_ILLUSTRATIONS = [
  { src: "/assets/step-1-set-your-price.png", alt: "Illustration of a seller holding up a large price tag" },
  { src: "/assets/step-2-create-product-page.png", alt: "Illustration of a seller arranging the elements of a product page" },
  { src: "/assets/step-3-share-and-sell.png", alt: "Illustration of three people holding up books, celebrating a sale" },
];

/* Revised (Ana: "give the benefits a whirl, based on the SEO brief and
   the CRO brief") — same 8 topics as before, since between them they
   already map cleanly onto the CRO brief's own "Value" bullets for
   Instant Store (a few of that list's other bullets — no tech
   knowledge required, inventory risk, payout reporting — are covered
   elsewhere on this page instead: the hero subhead, the fulfilment
   strip further down, and the FAQ, respectively, so repeating them
   here would just be redundant with copy this page already has).
   Wording tightened to state specific facts from the brief that
   weren't in this grid at all before:
   - "Maximum profit" now says "no subscription" (brief: "No
     subscription to pay, no platform fees") — this grid's own "no
     fees" claim didn't actually say what kind before.
   - "AI-powered listings" picks up the brief's own "not starting from
     a blank page" phrase.
   - "Your custom product page" now names the actual checkout methods
     and "no buyer account needed" (brief: "checkout in a few taps,
     with no account needed via Apple Pay, Google Pay and Paypal") —
     the SEO doc separately flags "secure checkout for books" as a
     trust signal worth stating concretely, not just "seamless".
   - "No minimums, ever" adds "no volume threshold" (brief: "no
     minimums, no volume threshold") and "Instant Store pricing" is
     now a real link to the profit calculator (Ana), matching the
     STEPS card's own [text](?stage=margin) pattern.
   - "Share anywhere" now names the brief's own mechanism (a
     customizable URL and a QR code), not just the destinations.

   QUALITY ADDED 2026-09-10 (Ana: "i think we need the quality point in
   'everything you need to sell' benefits too. maybe swap it out for
   the sales tax one. OR wrap it into effortless fulfilment one.
   Blurb's industry leading quality"). Wrapped into "Effortless
   fulfillment" rather than swapped for "Automated sales tax": tax
   automation is a distinct, concrete fact stated nowhere else on this
   page, while fulfillment already restates fact also covered in "Blurb
   handles everything after the sale" below — so quality has a natural
   home right where printing itself is described, and nothing gets
   dropped to make room for it.

   TITLE UPDATED 2026-09-10 (Ana: "ok but effortless fulfilment doesn't
   sell it no?") — the quality claim landed in the body text, but a
   grid of 8 tiles gets scanned by title first, and "Effortless
   fulfillment" alone doesn't hint that quality is in this one at all.
   Quality moved into the title itself, leading (it's the stronger,
   less commodity claim); "effortless" stays as the second half rather
   than getting cut, so the ease-of-use fact isn't lost. Body drops its
   own "Backed by Blurb's industry leading quality" clause now that the
   title says it, rather than stating it twice.

   SHORTENED 2026-09-10 (Ana: "that title is 3 lines now, it's too long
   sorry") — "Industry-leading quality, effortless fulfillment" at 50
   characters ran nearly double every other title in this grid (the
   next longest, "Sell books, magazines & more," is 29). Cut back to
   just "Industry-leading quality": the claim itself is what needed to
   be visible at a glance, and "effortless" already comes through in
   the body's own list of everything Blurb handles without a separate
   word for it.

   BODY CORRECTED 2026-09-10 (Ana: "but now the title doesn't match the
   subtitle - quality is not fulfilment") — shortening the title didn't
   touch the body, which was still the fulfilment-logistics sentence
   the title used to justify with its own second half ("...effortless
   fulfillment"). Once that half was cut, "Industry-leading quality"
   sat over a sentence about packaging and shipping, not quality.
   Rewritten to actually be about quality, reusing Sell v2's own
   "Unmatched quality" card body verbatim (QUALITY array,
   SellLandingV2.jsx) rather than redrafting — same claim, same words,
   both pages. Icon swapped from local_shipping (fulfilment) to
   workspace_premium, matching that same Sell v2 card's icon, since
   this tile is no longer about shipping at all. The fulfilment facts
   this body used to carry are still stated properly in "Blurb handles
   everything after the sale" further down this page, not lost.

   ICON CORRECTED 2026-09-10 (Ana: "Industry-leading quality icon on
   isv2 can it be the diamond icon plz") — workspace_premium was itself
   a guess made before Sell v2's own "Unmatched quality" icon was
   confirmed against Figma (it turned out to be "diamond," not
   workspace_premium — see QUALITY's own comment in SellLandingV2.jsx).
   Matched here now that the real one is known, same reasoning as
   before: same claim, same body, same icon, both pages. */
const FEATURES = [
  ["payments", "Maximum profit, zero fees",
   "With print costs up to 70% lower than Blurb retail pricing and no subscription or platform fees, you keep more of every sale."],
  ["auto_awesome", "AI-powered listings",
   "Our AI drafts your title, description, and keywords, so you're never starting from a blank page."],
  ["storefront", "Your custom product page",
   "Showcase your work with an interactive preview, author bio, and one-tap checkout via Apple Pay, Google Pay, or PayPal, no buyer account needed."],
  ["diamond", "Industry-leading quality",
   "Give your audience access to Blurb's superior print quality, vast catalog of formats, and premium paper types."],
  ["receipt_long", "Automated sales tax",
   "Sales tax is automatically collected and remitted, so you don't have to manage it."],
  ["auto_stories", "Sell books, magazines & more",
   "Your Instant Store works for photo books, paperback and hardcover books, magazines, notebooks, and journals."],
  ["all_inclusive", "No minimums, ever",
   "Sell one copy or a thousand, with no minimums and no volume threshold. [Instant Store pricing](?stage=margin) applies from your very first sale."],
  /* Was literally "Lorem ipsum dolor sit amet" in the Figma frame
     itself (kept as-is for a while, same spirit as the Showcase section
     on Sell v2 staying placeholder) — now drafted, in the same
     "post it anywhere" language the CRO brief itself uses for this
     value prop (see SellLandingV2.jsx's own note on the Instant Store
     card). Names the brief's own mechanism now too (a customizable URL
     and a QR code — "Create with a URL that you can customize and a
     QR code"), not just the destinations to post it. */
  ["share", "Share anywhere",
   "Get a shareable URL and QR code to post in a bio, a newsletter, a story, or a DM. However your audience finds you, they can buy there too."],
];

/* Ana (2026-09-10), round two: "add all the actual icons that are on
   the figma. our head of design confirmed those are the right ones."
   The first pass (below, superseded) swapped in the nearest-sounding
   icon from @blurb/codex-react's ~60-icon Material-based product set —
   a reasonable guess, but a guess. Drilling into the Figma "Value
   Props" cards themselves (each icon is a variant of a component
   literally named "Custom Icons", a marketing-only icon family that
   isn't in that npm package at all) showed the real per-tile choice,
   read straight off each instance's "Icon" property:
     Maximum profit, zero fees   -> Sell
     AI-powered listings         -> Code
     Your custom product page    -> Customization
     Automated sales tax         -> Order
     Sell books, magazines...    -> Book
     No minimums, ever           -> Rocket
     Share anywhere              -> Connect
   None of those are @blurb/codex-react exports, so there's no
   component to import — extracted each as a real PNG straight from
   Figma instead (select the icon instance, Export panel, trigger the
   real "Export Custom Icons" download, which Figma renders at full
   fidelity), same "use the real asset, not a redraw" rule this file
   already applies to the three step illustrations. Files live in
   public/assets/icons/.
   "Industry-leading quality" (icon corrected to "diamond" 2026-09-10,
   matching Sell v2's own confirmed icon for the equivalent card) is
   still the one content exception: that tile doesn't exist in Figma's
   row at all. Figma's 4th tile there is "Effortless fulfillment"
   (icon: Printer, now sitting extracted and unused at
   public/assets/icons/printer.png) with fulfillment/shipping copy,
   not a quality claim — flagged last pass, still unresolved, still
   not mine to silently change. Left on Material Symbols until that's
   settled. */
const FEATURE_ICONS = {
  payments: "sell",
  auto_awesome: "code",
  storefront: "customization",
  receipt_long: "order",
  auto_stories: "book",
  all_inclusive: "rocket",
  share: "connect",
};

/* Consolidated from two sources (Ana): the SEO team's 10 required
   questions (verbatim, including their exact wording and the "no
   minimum order" keyword note on #6) and a set of already-drafted
   answers from elsewhere (a checkout-link FAQ doc), reworded into this
   page's own voice and terminology — "checkout link" -> "Instant
   Store", "seller pricing" -> "Instant Store pricing" (this session's
   own rename). Overlapping questions merged into one rather than kept
   as near-duplicates (Ana: "do your best to consolidate") — the setup-
   fees question folded into "how much does Blurb take", and "what
   happens once an order is placed" dropped since FULFILMENT_POINTS
   below already covers it as its own section, not just an FAQ line.
   Two more pulled in from that same doc for their own value even
   though the SEO list didn't ask for them: the proof requirement
   (ties to CLAUDE.md's own Quality Gate rule, not invented here) and
   the full pricing-scope answer (matches the CRO brief's confirmed
   "seller pricing is Instant Store/RPI Print API only" rule already
   used elsewhere on this page). The refund-policy answer is the one
   exception — no refund policy exists anywhere in this codebase to
   draw from, so it's deliberately generic rather than inventing terms;
   worth Legal/CS supplying real language before this ships anywhere
   real.

   Cross-checked against the actual "SEO Recommendations for Seller Hub
   & Instant Store" doc once Ana shared it (same 10 questions, so no
   list changes needed) — two wording fixes came out of that pass. The
   payout answer now leads with the actual fact ("By check or PayPal at
   the end of each month...") rather than a comparison clause, per the
   doc's own AEO/GEO note that the first sentence should be the one
   liftable verbatim into an AI Overview. And the pricing-scope answer's
   "author and personal-use orders" became "orders you place for
   yourself" — the CRO brief is explicit that "author" is an internal
   segment name only, never customer-facing ("buy your own book" / "order
   copies for yourself" is what a seller should actually read).

   "Can I buy my own book through my Instant Store link?" had the wrong
   answer (Ana: "no the answer is no, its only for DTC sales") — the CRO
   brief's own FAQ for this exact question is explicit: "No, checkout
   links are for your buyers. Order copies for yourself at standard
   pricing." Fixed to match; the old "Yes... at the price you set" had
   it backwards.

   Trimmed and corrected again (Ana):
   - "How much does Blurb take from each sale?" now leads with the
     print-on-demand fact itself (you only pay to print what actually
     sells) rather than just "no setup fee", which was true but wasn't
     the actual answer to "how much does Blurb take".
   - "How do I take payments from my book?" dropped — payment methods
     are already covered in the walkthrough ("A single 'Buy now' takes
     buyers straight to checkout, including Apple Pay, Google Pay, and
     PayPal"), so this FAQ was answering a question the page had
     already answered above the fold.
   - The payout answer's "...the same schedule as the rest of Blurb's
     print-on-demand routes" was flagged as untrue (Ana: "ingram is
     diff") and checked against SellerLanding.jsx's own more careful
     FAQ answer, which is explicit that it isn't: "Instant Store and
     Bookstore sales pay out by PayPal or check on a set cadence;
     Amazon holds payment through its returns window, and Ingram can
     take up to four months." Dropped the comparison rather than
     generalize past what's actually true; the $25/monthly/check-or-
     PayPal facts themselves are real, shared with Bookstore.
   - "How fast does an order ship after someone purchases my book?"
     dropped — Blurb publishes no shipping-time commitment this app
     can quote, so the honest answer was always "it depends, go check
     the shipping page," which isn't worth its own FAQ line when that
     same link now lives on the international-shipping question below.
   - "Can I sell books to readers internationally?" now links to the
     shipping page (`onGo("shipping")`) for delivery times and rates by
     country, in place of the dropped shipping-speed FAQ.
   - Pricing-scope answer split into two paragraphs and "not a volume
     discount" cut as redundant with the sentence right after it, which
     already says what applies instead. "Bulk Printing Services" is now
     a real link to blurb.com/large-order-services, the same URL Sell
     v2's own card already uses.
   - Refund-policy answer briefly linked to blurb.com/returns, then
     the question was dropped entirely (Ana) rather than kept as a
     link-only answer.
   - "Can I turn my Instant Store link off?" dropped too (Ana) — down
     to 13 questions, then 11.
   - "How do I share my Instant Store?" dropped (Ana) — down to 10;
     "Share anywhere" in the FEATURES grid above already answers it. */
const FAQS = onGo => [
  ["How do I set up an online store for my book?",
   "Open the Instant Store page from your dashboard, choose the project you want to sell, and set your listing details and price. You can preview your page before it goes live, and there's no separate sign-up."],
  ["How much does Blurb take from each sale?",
   "Nothing off the top. It's print on demand, so you only pay to print the copies that actually sell, no setup fee and nothing upfront. What's left after that is yours."],
  ["How do I get paid for my sales?",
   "By check or PayPal at the end of each month, once you've reached the $25 minimum payment threshold."],
  ["Who handles sales tax and shipping on each order?",
   "We calculate and collect sales tax automatically. Your buyer pays shipping at checkout, so it's never taken out of what you keep."],
  ["Is there a minimum order?",
   "No minimum order. Sell one copy or a thousand, whenever you're ready."],
  ["Do I need to order a proof before I can sell through my Instant Store?",
   "Yes. Ordering and reviewing a proof, either a discounted physical copy or a free PDF, is required before your Instant Store can go live. It's the same quality check every Blurb book goes through before it's offered for sale."],
  ["Can I sell books to readers internationally?",
   <>
     Yes. Your Instant Store link works for any buyer, and each order prints at the facility nearest them. See our{" "}
     <a href="#" onClick={e => { e.preventDefault(); onGo?.("shipping"); }} style={{ color: C.blue600, textDecoration: "underline" }}>
       shipping page
     </a>{" "}
     for delivery times and rates by country.
   </>],
  ["Is Instant Store pricing also available if I sell through the Blurb Bookstore, Amazon, or Ingram?",
   <>
     <p style={{ margin: "0 0 12px" }}>
       No. Pricing on the Blurb Bookstore, Amazon, and Ingram is unchanged, and so are orders you place for yourself. Instant Store pricing is a separate, stable print cost available only on orders your buyers place directly through your Instant Store link.
     </p>
     <p style={{ margin: 0 }}>
       If you're ordering 100 or more copies for an event, inventory, or your own use,{" "}
       <a href="https://www.blurb.com/large-order-services" target="_blank" rel="noopener noreferrer" style={{ color: C.blue600, textDecoration: "underline" }}>
         Bulk Printing Services
       </a>' existing volume discounts will apply instead.
     </p>
   </>],
  ["Where can I see reporting on my sales?",
   "Your dashboard's Earnings and Monthly Profit Reports pages show what you've made from every route, Instant Store included."],
  ["Can I buy my own book through my Instant Store link?",
   "No. Your Instant Store link is for direct-to-consumer sales to your buyers, the ones your listing price and profit are built around. Order copies for yourself separately, at Blurb retail pricing."],
];

export default function InstantStoreV2({ onGo }) {
  return (
    <div style={{ fontFamily: FONT_BODY, color: C.gray950 }}>

      {/* ── Hero ── the gradient the seller pages share, two columns again
          (Ana liked the video beside the copy) — but the video demo, not
          InstantStoreMockup, sits on the right this time, so the mockup
          still appears exactly once (in "What buyers see" below)
          rather than being shown twice. */}
      <section className="hero-gradient-seller" style={{ padding: "clamp(56px, 8vw, 96px) 24px" }}>
        <div style={{
          maxWidth: 1160, margin: "0 auto", display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 48, alignItems: "center",
        }}>
          <div style={{ display: "grid", gap: 20 }}>
            {/* Third pass at this headline. First, "Your book, your
                audience, your profit" didn't sell it (Ana) — "audience"
                was the weak beat, since an Instant Store doesn't give
                you an audience, you already have one regardless of
                channel. Second, "Your book. Your price. Your profit."
                swapped in the real differentiator (price control) but
                Ana still didn't like it ("i don't know, like what does
                that mean") — three bare nouns in a row read as abstract
                without a verb tying them together, whichever nouns they
                are.

                Third pass names the product directly instead (Ana,
                after reviewing options: "how about incorporating
                instant store"), and gives it an actual verb-led clause
                rather than another noun-only fragment. Still
                deliberately not "your own online bookstore" for the
                product name itself, despite that being the SEO doc's
                own primary keyword for this page — "online store" got
                cut once already for overselling an Instant Store as a
                browsable multi-book storefront rather than the one
                product page behind one link that it actually is.

                Fourth pass (2026-09-10): the VP of marketing flagged
                that the page never says, above the fold, that an
                Instant Store makes a seller more money — that fact
                lives in "Keep more of what you earn," well below where
                someone decides whether to keep scrolling. "keep the
                profit" gestured at it but read as neutral (keeping
                what's already yours) rather than a reason to read on.
                Considered leading with the page's own "up to 3x more
                profit" figure directly, but Ana was nervous about
                putting a specific multiple in the headline itself — so
                this pivots to a plain money-forward verb instead of a
                number. First landed on "maximize your earnings," then
                Ana swapped the noun back to "maximize your profit" —
                same active shape, the word this page's own facts
                actually pay off ("profit" is what the rest of the page
                calculates; "earnings" never appears again after the
                hero). The real 3x still lives in "Set your price" and
                on Sell v2's comparison, where a specific claim belongs. */}
            <h1 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 400, letterSpacing: "-0.01em",
              fontSize: "clamp(2rem, 4.6vw, 2.75rem)", lineHeight: 1.2, margin: 0,
            }}>
              Your Instant Store. Sell direct, maximize your profit.
            </h1>
            {/* "Set up an online store" oversold it (Ana) — an Instant
                Store is one product page behind one link, not a
                multi-book storefront to browse. Rewritten around what it
                actually is, matching the "product page" language Sell
                v2's own Instant Store card already uses. "Third-party
                platform" corrected next (Ana: "i don't know what 3rd
                party means") — plain language, no separate site to go
                build. Ana's own line, verbatim, replaces an earlier pass
                of this sentence. "Your audience" -> "your readers": the
                SEO doc marks "sell books directly to readers" as this
                page's own primary phrase (not Sell v2's), so the lede
                carries it in close to that exact form.

                "Instant Store" itself named here now (Ana: "it's odd we
                don't say 'instant store' on the hero anywhere"), back
                when the H1 didn't name it either. The H1 has since
                picked up the name too ("Your Instant Store. Sell
                directly, keep the profit.") — so this line dropped
                "Instant Store" and "directly" itself to avoid saying
                both twice in the same breath, pivoting instead to the
                specifics the H1 has no room for: what it actually is
                (a product page), and the speed/no-fees/no-tech-skills
                facts that back up the H1's claim.

                "It's a..." dropped (Ana didn't like the opener) — a
                bare noun phrase reads more like a lede than a sentence
                explaining itself. Comma before "and" also dropped
                (Ana's own draft had one) — two short items joined by
                "and" don't need it, only a list of three or more would. */}
            <p style={{ fontSize: TYPE.lg, lineHeight: 1.55, color: T.textSubtle, margin: 0, maxWidth: 520 }}>
              A shareable product page for your book, live in minutes. No hidden fees and no website or tech skills needed.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button>Create your Instant Store</Button>
              {/* Was "See a store in action" -> #demo, the checkerboard
                  placeholder beside this copy. Ana, following the "how
                  do we call out max profit" conversation: "See what
                  you'd earn and scroll down to earnings table" — the
                  same jump-link idea floated there (option 1 of 2), now
                  actually placed on the one button here that wasn't
                  pointing at anything real yet. Points at the "Keep
                  more of what you earn" table instead of the demo
                  video, since that's this route's real differentiator,
                  not a placeholder. */}
              <Button as="a" href="#keep-more" variant="outlined">See what you'd earn</Button>
            </div>
            {/* The margin story is this route's biggest differentiator,
                and nothing above the fold said so directly (Ana) — the
                H1's "your profit" hints at it, but a reader has to reach
                "Keep more of what you earn" much further down the page
                to see the actual number.

                Was "earn up to 70% more than other distribution
                channels" — a profit claim under the same accuracy
                problem flagged on Sell v2's own tick (70% is the print-
                cost discount, not a profit multiple). Corrected the
                same way (Ana): this line now makes the print-cost claim
                it can actually back up, same 70% figure the FEATURES
                grid's own "Maximum profit" tile already uses, rather
                than the profit claim "Keep more of what you earn" below
                makes properly (as 3x, calculated). "Seller pricing" ->
                "Instant Store pricing" (Ana: "you're a seller on retail
                distro but not getting the price so it's not a good name
                for it") — renamed everywhere on this page, though this
                one line dropped the label again (Ana) in favor of
                naming what the 70% is actually relative to.

                "Standard Blurb pricing" -> "Blurb retail pricing"
                (Ana: "we want to use the term Blurb retail pricing
                instead of standard Blurb pricing, everywhere") —
                renamed here, in the FEATURES grid's "Maximum profit"
                tile (same 70% claim), and in the "buy my own book" FAQ
                answer, which said "standard pricing" without "Blurb"
                but meant the same thing. */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="ms" aria-hidden style={{ fontSize: 20, color: C.blue600 }}>trending_up</span>
              <span style={{ fontSize: TYPE.sm, fontWeight: 600 }}>
                Access up to 70% lower print costs than Blurb retail pricing
              </span>
            </div>
          </div>

          {/* No real demo video exists yet, so this stays an honest
              checkerboard placeholder rather than a fabricated embed —
              same treatment as before, just moved back beside the hero
              copy instead of sitting in its own full-width section. No
              caption under it any more (Ana) — it wasn't adding anything
              the CTA above it doesn't already say. */}
          <div id="demo" style={{
            position: "relative", borderRadius: R.lg, overflow: "hidden", aspectRatio: "16 / 9",
            border: `1px solid ${T.border}`,
            background: "repeating-conic-gradient(#f2f2f2 0% 25%, #fafafa 0% 50%) 50% / 32px 32px",
          }}>
            <span
              className="ms" aria-hidden
              style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                fontSize: 56, color: C.gray400,
              }}
            >
              play_circle
            </span>
          </div>
        </div>
      </section>

      {/* ── What buyers see ──
          Was "More than a checkout. A whole store in one link." — "a
          whole store" oversold it the same way "online store"/"online
          bookstore" did elsewhere on this page (Ana), and "more than a
          checkout" read as too close to Lulu's own positioning to keep.
          Rewritten to just describe what the section shows rather than
          make a comparative claim. Walks a buyer through the product-
          page mockup with numbered annotations rather than describing it
          in the abstract — the one place InstantStoreMockup appears
          (Ana: not duplicated with the hero any more). This is the
          buyer's view of the page; "Three steps" below is the seller's
          view of setting it up, complementary, not overlapping.

          Order history: shown first originally, then moved after
          "Three simple steps" (Ana: "swap the two," reasoning setup
          before payoff), now moved back here (Ana: "i meant the
          order again") — back to payoff before setup.

          TIGHTENED 2026-09-10 (Ana: "section paddings are still too
          large"): this and the next three sections (Three simple steps,
          Everything you need, Keep more of what you earn) dropped from
          clamp(56,7,80) to clamp(40,5,56), and the fulfilment band
          below from clamp(48,6,64) to the same clamp(40,5,56) so nothing
          mid-page reads bigger than its neighbors. The hero and the
          closing band are untouched — both share their padding scale
          with Sell v2 (56,8,96 and 72,9,120/56,7,80), so shrinking them
          here alone would break that consistency rather than fix a
          page-specific problem. */}
      <section style={{ padding: "clamp(40px, 5vw, 56px) 24px" }}>
        <div style={{
          maxWidth: 1160, margin: "0 auto", display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 48, alignItems: "center",
        }}>
          <div style={{ display: "grid", gap: 24 }}>
            <div style={{ display: "grid", gap: 8 }}>
              {/* Full stop dropped 2026-09-10 (Ana: "in general, we
                  don't do full stops in titles, unless there's 2
                  sentences") — this is one sentence. */}
              <h2 style={{
                fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
                lineHeight: 1.25, margin: 0,
              }}>
                One link, a real product page
              </h2>
            </div>
            {WALKTHROUGH.map(([title, body], i) => (
              <div key={title} style={{ display: "flex", gap: 16 }}>
                <span style={{
                  flex: "0 0 auto", width: 28, height: 28, borderRadius: "50%",
                  background: C.blue600, color: "#fff", display: "grid", placeItems: "center",
                  fontSize: TYPE.sm, fontWeight: 700,
                }}>
                  {i + 1}
                </span>
                <div style={{ display: "grid", gap: 4 }}>
                  <h3 style={{ margin: 0, fontSize: TYPE.lg, fontWeight: 600 }}>{title}</h3>
                  <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
          <InstantStoreMockup />
        </div>
      </section>

      {/* ── Three simple steps ──
          The seller's view of setting it up, now shown after "What
          buyers see" again (Ana: "i meant the order again") — payoff
          before setup, the page's original order. */}
      {/* "Instant Store" -> "Blurb Instant Store" 2026-09-10 (Ana: "we
          want Blurb Instant Store in some places to anchor to brand
          name"), named example: this heading specifically. Left every
          other "Instant Store" mention on this page as-is — the brand
          name has already been established once above the fold (the H1
          itself says "Your Instant Store"), and repeating "Blurb"
          before every instance would be a bigger change than the one
          spot named. */}
      <section style={{ padding: "clamp(40px, 5vw, 56px) 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <CardList
            heading="Create your Blurb Instant Store in three steps"
            headingAlign="center"
            layout={{ mobile: 1, tablet: 3, desktop: 3 }}
          >
            {STEPS.map(([title, body], i) => (
              <Card
                key={title}
                icon={
                  <img
                    src={STEP_ILLUSTRATIONS[i].src}
                    alt={STEP_ILLUSTRATIONS[i].alt}
                    loading="lazy"
                    style={{ width: 210, height: 210, objectFit: "contain", display: "block" }}
                  />
                }
                eyebrow={`Step ${i + 1}`}
                title={title}
                description={body}
              />
            ))}
          </CardList>
        </div>
      </section>

      {/* ── Everything you need — 8-tile feature grid ── */}
      {/* Wrapper widened to 1440 (2026-09-10, Ana: "make it wider so
          that they're not so crammed... the section below with the
          table runs wider so align to that") — Codex's own CardList
          adds 80px of padding-inline on each side at desktop width
          (--codex-spacing-20, read from its compiled CSS) inside
          whatever wrapper it's given, so at the same 1280 every other
          section here uses, its actual card grid rendered ~160px
          narrower than the plain-div "Keep more of what you earn"
          table right below it — not a difference in the two sections'
          own widths, but CardList quietly eating some of its own. 1440
          minus that 160px of internal padding lands the visible grid
          back at 1280, matching the table exactly. */}
      <section style={{ background: C.gray50, padding: "clamp(40px, 5vw, 56px) 24px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <CardList
            heading="Everything you need to sell your book online"
            headingAlign="center"
            layout={{ mobile: 1, tablet: 2, desktop: 4 }}
          >
            {FEATURES.map(([icon, title, body]) => {
              const realIcon = FEATURE_ICONS[icon];
              return (
                <Card
                  key={title}
                  icon={
                    realIcon ? (
                      <img
                        src={`/assets/icons/${realIcon}.png`}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        style={{ width: 40, height: 40, objectFit: "contain", display: "block" }}
                      />
                    ) : (
                      <span
                        className="ms"
                        aria-hidden
                        style={{
                          fontSize: 40, color: C.blue600,
                          /* "diamond" 2026-09-10 (Ana: "the diamond icon
                             thickness is too thick compared to the rest
                             of icons on that page") — Material Symbols'
                             own default-weight diamond glyph is a solid
                             faceted shape with much less negative space
                             than this row's other line icons, so it
                             reads heavier at the same nominal weight.
                             Dialed the variable font's own wght axis
                             down (400 -> 300) for this one glyph rather
                             than the whole row, since every other icon
                             here already matches at the default. */
                          ...(icon === "diamond" ? { fontVariationSettings: "'wght' 300" } : {}),
                        }}
                      >
                        {icon}
                      </span>
                    )
                  }
                  title={title}
                  description={body}
                />
              );
            })}
          </CardList>
        </div>
      </section>

      {/* ── Keep More of What You Earn ── */}
      {/* scrollMarginTop 2026-09-10 (Ana: "make the what you'd earn
          scroll stop at the top of the section rather than in the
          middle, like i want to see the title") — the sticky nav+demo
          bar (App.jsx, --nav-h) was covering this section's own H2 when
          the anchor scrolled it flush to the viewport top. Same
          var(--nav-h) + 16px offset SummaryPanel.jsx already uses for
          its own sticky positioning against this header, so the number
          stays right if the header's height ever changes (it does, per
          App.jsx's own note, when the demo bar wraps). */}
      <section id="keep-more" style={{ padding: "clamp(40px, 5vw, 56px) 24px", scrollMarginTop: "calc(var(--nav-h, 124px) + 16px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gap: 24 }}>
          {/* Button moved back up here and back to filled/blue (2026-09-10,
              Ana: "'calculate your profit' should be main CTA colour (blue
              bg) with placement on the top right of the table, like the
              figma") — reverses the head-of-design placement from the
              NINTH PASS note below (button at the very bottom, outlined).
              That call was reasoned through carefully at the time; this
              one is Ana's own explicit read of the Figma source overriding
              it, not an oversight, so it stands without re-litigating the
              earlier note — left in place below for the history.
              alignItems flex-start -> flex-end (2026-09-10, Ana:
              "calculate your profit, align to the button of the
              subtitle") — the button now sits on the subtitle's own
              baseline instead of level with the H2 above it. */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
            <div style={{ display: "grid", gap: 12, flex: "1 1 480px" }}>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
              lineHeight: 1.25, margin: 0,
            }}>
              Keep more of what you earn
            </h2>
            {/* Two paragraphs collapsed into one (Ana: "lots of words but
                looks off") — same two facts (you set the price with no
                extra fees; that's worth up to 3x more) in one sentence
                rather than two lines of near-equal visual weight fighting
                each other. The standalone "listing price / print cost /
                profit" card that used to sit beside this text is gone too
                (Ana: "it should be incorporated in the table") — those
                three numbers are now rows in the table itself.

                "other distribution channels" -> named channels
                (2026-09-10, Ana), same reasoning and same "up to"
                qualifier as STEPS' own version of this line above.

                maxWidth:720 dropped from this block 2026-09-10 (Ana:
                "it's still two lines each so hasn't improved, make it
                one line each") — that cap, not the CTA's position, was
                what forced this sentence onto two lines; at this
                section's full 1240px width it fits on one.

                Trimmed further 2026-09-10 (Ana: drop the leading "You
                set the price, and what's left after your print cost is
                yours" clause, keep just the claim) — the H2 and the
                table itself already establish "you set the price," so
                the lede's only job left is the number.
                NOTE: the "up to 3x" figure itself is NOT recalculated
                yet — see the KEEP_MORE_ROWS comment below on the new
                $27.90 / $62.78 print costs Ana provided. At the
                table's current $50.00 example price those costs put
                Blurb Bookstore and Amazon's profit below zero, which
                this app's own documented rule forbids ("the seller's
                price floors at their cost, so the ladder can never
                show negative profit"). Flagging rather than guessing a
                new list price to paper over it. */}
            <p style={{ margin: 0, fontSize: TYPE.base, color: T.textNeutral }}>
              Up to 3x more profit than selling through the Blurb Bookstore, Amazon, or Ingram.
            </p>
            </div>
            <Button onClick={() => onGo?.("margin")} style={{ flex: "0 0 auto" }}>Calculate your profit</Button>
          </div>

          {/* NINTH PASS 2026-09-10 — head of design's review of this whole
              section, verbatim:

              "Title and subhead stay as-is. Table comes next, no text
              before it. Let the comparison land at full strength. Add a
              small in-table label ('Example: 8×10 hardcover, $50 list
              price') so it's still marked as an example, without a
              paragraph in front of it... A short note goes below the
              table, combining the example disclaimer and the fee
              reassurance — the right moment to reassure, after the
              number has landed... Button moves to the very bottom, after
              that note — the last thing on the page. Why: this page's
              job is to persuade a prospect, not document policy, and
              this section's job within that is proof. The number needs
              to land and do its persuasive work first; the caveat and
              fee reassurance exist to support that persuasion by
              handling objections after interest is created, not to
              precede or qualify the claim before it's had a chance to
              work."

              Reordered top-to-bottom: table immediately after the lede
              (the button and the "$50.00 list price" caption that used
              to sit here are both gone from this spot); an in-table
              example row now carries what that caption said; a single
              combined note (example caveat + fee reassurance, the two
              paragraphs that used to bookend this section) sits under
              the table; the button is last. $50.00 itself is still
              Ana's own round, memorable number (see the file header
              note for the full pricing arithmetic) — only where it's
              stated moved, not the figure itself. */}

          {/* Hand-built, not Codex's ComparisonTable (Ana: "it doesn't
              sell it, it needs colour, highlights, pills" — see the file
              header note on why that component can't render one anyway).
              Same status-dot-table visual language as Sell v2's own
              comparison table (zebra rows, sticky label column, charcoal
              rules), but the "dot" language doesn't fit a table that's
              all numbers — Instant Store gets a highlighted column
              instead (light blue tint + a "Best value" badge), and the
              profit row is pills rather than plain text so the one row
              this table exists to make is the one row that looks
              different from a plain spec sheet. */}
          <div style={{
            overflowX: "auto", WebkitOverflowScrolling: "touch",
            border: `1px solid ${C.charcoal200}`, borderRadius: R.md,
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "160px repeat(4, minmax(160px, 1fr))",
              minWidth: 800,
            }}>
              {["", ...KEEP_MORE_COLUMNS].map((col, ci) => (
                <div
                  key={col || "row-label"}
                  style={{
                    position: ci === 0 ? "sticky" : "static", left: 0, zIndex: 2,
                    background: ci === 1 ? T.bgAccentSubtle : "#fff",
                    borderBottom: `1px solid ${C.charcoal200}`,
                    borderRight: ci < 4 ? `1px solid ${C.charcoal200}` : "none",
                    padding: 16, fontFamily: FONT_DISPLAY, fontWeight: 500,
                    fontSize: TYPE.sm, color: T.textNeutral,
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  {col}
                  {ci === 1 && (
                    <span style={{
                      padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                      letterSpacing: 0.4, textTransform: "uppercase", whiteSpace: "nowrap",
                      background: C.blue600, color: "#fff",
                    }}>
                      Best value
                    </span>
                  )}
                </div>
              ))}

              {/* Example label, moved back under the column headers
                  2026-09-10 (Ana: "example for a ... row, but it below
                  the titles row") — reverses the previous pass's move
                  to right-after-"Your listing price"; back to
                  annotating the table as a whole from the top, before
                  any numbers start. Spec text unchanged: "Example for a
                  10×8 Photo Book Standard ImageWrap, Hardcover, 85
                  pages." Still gray50, not the accent-blue Instant
                  Store column, since it's about the whole table. */}
              <div style={{
                gridColumn: "1 / -1", background: C.gray50,
                borderBottom: `1px solid ${C.charcoal200}`,
                padding: "10px 16px", fontSize: TYPE.sm, color: T.textSubtle,
              }}>
                Example for a 10×8 Photo Book Standard ImageWrap, Hardcover, 85 pages
              </div>

              {KEEP_MORE_ROWS.map((row, ri) => {
                /* Print cost stays plain white, not zebra-grey
                   (2026-09-10, Ana: "the print cost row doesn't have
                   to be grey") — no reason given beyond the row
                   reading busier than it needs to; there's no other
                   row this table singles out for a treatment, so
                   leaving it off is the simplest way to satisfy that
                   without inventing a new rule for why every OTHER
                   odd row still gets it. */
                const rowBg = ri % 2 === 1 && row.label !== "Print cost" ? C.gray50 : "#fff";
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
                        background: ci === 0 ? T.bgAccentSubtle : rowBg,
                        borderBottom: `1px solid ${C.charcoal200}`,
                        borderRight: ci < 3 ? `1px solid ${C.charcoal200}` : "none",
                        padding: 16, fontSize: TYPE.sm, color: T.textNeutral, lineHeight: 1.5,
                        fontWeight: ci === 0 ? 600 : 400,
                      }}>
                        {cell}
                      </div>
                    ))}
                  </React.Fragment>
                );
              })}

              {/* COLOR FIXED 2026-09-10 — head of design: "Fix the
                  profit row colors. In Codex, this type of treatment
                  are labels and status. Orange signals a warning,
                  green signals success. Applying that here flags 38%
                  and 20% profit as errors when they're just lower
                  numbers. It also styles Blurb Bookstore, our own
                  channel, as a warning. Suggest: green only for the
                  winning option(s) (Instant Store, RPI Print API),
                  neutral gray for the rest." The previous green/amber
                  split borrowed Codex's real success/warning colors to
                  mean "high number/low number," which is exactly the
                  status meaning those colors already carry elsewhere —
                  Bookstore and Amazon aren't failing at anything, they
                  just aren't the two routes with 0% commission. Amber
                  -> neutral gray (C.gray100 / T.textNeutral); green
                  stays for Instant Store and RPI Print API, the two
                  actually-winning options. */}
              <div style={{
                position: "sticky", left: 0, zIndex: 1, background: "#fff",
                borderRight: `1px solid ${C.charcoal200}`, padding: 16,
                fontSize: TYPE.sm, fontWeight: 700, color: T.textNeutral,
              }}>
                Your profit
              </div>
              {KEEP_MORE_PROFIT.map((value, ci) => {
                const strong = ci === 0 || ci === 3; // Instant Store, RPI Print API
                const priced = value !== "Varies";
                return (
                  <div key={ci} style={{
                    background: ci === 0 ? T.bgAccentSubtle : "#fff",
                    borderRight: ci < 3 ? `1px solid ${C.charcoal200}` : "none",
                    padding: 16, display: "flex", alignItems: "center",
                  }}>
                    {priced ? (
                      <span style={{
                        padding: "4px 12px", borderRadius: 999, fontSize: TYPE.sm,
                        background: strong ? "#d7f4e0" : C.gray100,
                        color: strong ? "#166640" : T.textNeutral,
                      }}>
                        <span style={{ fontWeight: 700 }}>{value}</span>
                        <span style={{ fontWeight: 500 }}> ({KEEP_MORE_MARGIN[ci]} profit)</span>
                      </span>
                    ) : (
                      <span style={{ fontSize: TYPE.sm, color: T.textSubtle, fontStyle: "italic" }}>{value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Combined note, per design's review: "A short note goes
              below the table, combining the example disclaimer and the
              fee reassurance — the right moment to reassure, after the
              number has landed." Two facts that used to bookend this
              section (the "$50.00 list price" caveat above the table,
              the "no processing/platform/subscription fee" line below
              it) now live here as one note, in the order design's own
              suggested fee line implies: the disclaimer first, then the
              reassurance. Fee line is design's own wording verbatim.
              "Actual costs" -> "Costs" (2026-09-10, Ana) — "actual" was
              doing no work the note doesn't already do by being a
              caveat in the first place. */}
          <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle }}>
            Costs vary by format, size, and page count. Unlike many print-on-demand companies, none
            of the options above charge extra processing, platform, or subscription fees.
          </p>
        </div>
      </section>

      {/* ── Blurb handles everything after the sale ──
          The 8-tile grid above already lists "Effortless fulfillment" as
          one of eight items; this gives the same claim its own moment
          right where it matters most — straight after the cost numbers,
          answering "what does that print cost actually buy me?" before
          moving on to what's sellable. Adapted from the same POC (Ana),
          not copied: these four facts are already established elsewhere
          on this page (the FEATURES grid's own fulfillment/tax copy),
          restated here as a standalone strip rather than new claims.

          BACKGROUND SWAPPED 2026-09-10 (Ana: "make the sell photo
          books, magazines... white bg, which means 'Blurb handles
          everything after the sale' needs to be the light grey
          instead") — this section takes the gray50 "What you can sell"
          used to carry, and that section goes white in exchange (see
          its own note below). The top border added earlier to seam this
          section off from "Keep more of what you earn" above (also
          white) is dropped now that a real background difference does
          that job instead. */}
      <section style={{ background: C.gray50, padding: "clamp(40px, 5vw, 56px) 24px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gap: 32 }}>
          {/* Full stop dropped 2026-09-10, same rule Ana stated for "One
              link, a real product page" just above on this page ("we
              don't do full stops in titles, unless there's 2
              sentences") — this is one sentence too. */}
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
            lineHeight: 1.25, margin: 0,
          }}>
            Blurb handles everything after the sale
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
            {FULFILMENT_POINTS.map(([icon, title, body]) => (
              <div key={title} style={{ display: "grid", gap: 8 }}>
                <span className="ms" aria-hidden style={{ fontSize: 28, color: C.blue600 }}>{icon}</span>
                <h3 style={{ margin: 0, fontSize: TYPE.base, fontWeight: 600 }}>{title}</h3>
                <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What can you sell ── heading and copy revised from a
          reference mock (Ana); see SELL_FORMATS' own note above for the
          copy and imagery reasoning, and for why this page's version
          has no "Best for" line. Subheading rewritten for this page
          specifically (Ana: the Sell v2 line "matches better in sell
          v2, not in isv2") — "a selling path to match" is about
          choosing among four routes, which is Sell v2's own framing,
          not a fit for a page that's already inside one Instant Store.
          Back to Codex's own Card (no hand-built block needed) now that
          there's no Best-for paragraph to style — eyebrow + title +
          description is exactly the shape Card already renders. Padding
          cut roughly in half (Ana: too large) — same
          clamp(32px,4vw,48px) Sell v2's own "Included with every way
          you sell" section uses for the same reason: it sits between
          two dense sections and doesn't need that much air. */}
      {/* Subheading picks up "industry-leading quality" 2026-09-10
          (Ana: "maybe [make] this subtitle a hint to quality?") — same
          exact phrase as the FEATURES tile above, a second, later
          reinforcement of the one claim Ana flagged as missing from
          this page, rather than a new claim invented for this spot.

          BACKGROUND SWAPPED 2026-09-10 (Ana: "make the sell photo
          books, magazines... white bg") — gray50 moves to "Blurb
          handles everything after the sale" right above instead (see
          its own note), so the two sections still contrast with each
          other rather than both going white. */}
      <section style={{ padding: "clamp(28px, 4vw, 40px) 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <CardList
            className="format-heading-fit"
            heading="Sell photo books, magazines, notebooks & more"
            subheading="Whatever you create, your Instant Store is ready to sell it, backed by industry-leading quality."
            headingAlign="center"
            layout={{ mobile: 1, tablet: 2, desktop: 4 }}
          >
            {SELL_FORMATS.map(f => {
              const photo = f.img ? f : FORMAT_CARDS.find(c => c.id === f.id);
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

      <Faq heading={<>Your Blurb Instant Store<br />questions, answered</>} items={FAQS(onGo)} />

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
          {/* Secondary CTA added alongside the primary one (Ana) — a
              reader who isn't ready to commit yet still has somewhere to
              go rather than a dead end, same "Calculate your profit"
              destination the hero and "Keep more of what you earn"
              already point to. */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Button>Create your Instant Store</Button>
            <Button variant="outlined" onClick={() => onGo?.("margin")}>Calculate your profit</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
