import { Button, CardList, Card, ComparisonTable } from "@blurb/codex-react";
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
   Price is a round $30 (Ana) rather than the margin table's own $60.80 —
   this mockup is illustrating the page, not the table, so it doesn't
   need to carry that exact figure. */
const MOCKUP_COVER = FORMAT_CARDS.find(c => c.id === "photo");

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
          blurb.com/c/coastal-mornings
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
          placeholder (Ana: "add the preview image too"). No real interior
          page photography exists for this placeholder book, so the same
          cover photo stands in — an honest reuse rather than a fabricated
          page spread, cropped differently (wider, off-center) so it
          doesn't just repeat the cover thumbnail above it. */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: "16px 24px", display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: TYPE.sm }}>Book preview</div>
            <div style={{ fontSize: 11, color: T.textSubtle }}>First 15 pages</div>
          </div>
          <span style={{ fontSize: 11, color: C.blue600, fontWeight: 600 }}>View fullscreen</span>
        </div>
        <img
          src={MOCKUP_COVER.img}
          alt=""
          aria-hidden
          loading="lazy"
          style={{
            width: "100%", aspectRatio: "16 / 9", objectFit: "cover", objectPosition: "50% 30%",
            borderRadius: R.md, border: `1px solid ${T.border}`, display: "block",
          }}
        />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, fontSize: 11, color: T.textSubtle }}>
          <span className="ms" aria-hidden style={{ fontSize: 16 }}>chevron_left</span>
          Page 5 of 15
          <span className="ms" aria-hidden style={{ fontSize: 16 }}>chevron_right</span>
        </div>
      </div>

      {/* More by this author — the real PDP's own feature, missing from
          every earlier pass of this mockup (Ana: "we're missing the fact
          we show other books by the author, like in the original
          figma"). Same cover photo reused per thumbnail, since no second
          placeholder book exists — an honest reuse, same spirit as Book
          preview above reusing the cover for its own placeholder. */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: "16px 24px", display: "grid", gap: 10 }}>
        <div style={{ fontWeight: 600, fontSize: TYPE.sm }}>More by Jamie Reyes</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[1, 2, 3].map(i => (
            <img
              key={i}
              src={MOCKUP_COVER.img}
              alt=""
              aria-hidden
              loading="lazy"
              style={{ width: 64, aspectRatio: "3 / 4", objectFit: "cover", borderRadius: R.sm, border: `1px solid ${T.border}`, display: "block" }}
            />
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
   buyer sees" fact, not two separate steps. The merge also picks up a
   fact the mockup itself was missing (Ana: "we're missing the fact we
   show other books by the author, like in the original figma"), now
   added to both the copy here and the mockup's own "More by this
   author" section below. */
const WALKTHROUGH = [
  ["Showcase your work", "Cover, description, and pricing, plus an interactive preview so buyers can flip through real pages, and other books by the author to discover next: everything a buyer needs to feel confident before they purchase."],
  ["One click to buy", "A single 'Buy now' takes buyers straight to checkout, including Apple Pay, Google Pay, and PayPal. No cart to build, no plugins to configure."],
  ["Blurb prints and ships it", "No inventory to buy upfront: every order triggers a fresh print run, and you only pay for what ships. Your buyer gets a tracked delivery, and you never touch a box."],
];

const FULFILMENT_POINTS = [
  ["inventory_2", "Print on demand", "Every order triggers a fresh print run. No inventory to manage, no stock to buy upfront."],
  ["local_shipping", "Ships in days", "Blurb packs and ships every order directly to your buyer. You never touch a box."],
  ["verified", "Tracking on every order", "Buyers get a tracking number automatically, so there's no support email asking where an order is."],
  ["schedule", "No setup required", "No warehouse, no carrier accounts, no fulfilment integrations. It works the moment you share your link."],
];

/* The same POC that inspired InstantStoreMockup also had a tiny
   "your price / print cost / you keep" widget for its own setup-steps
   section — much more digestible at a glance than a table row, so it's
   reused here as a companion to the comparison table rather than a
   replacement for it (Ana wasn't sure the table alone was landing).
   Same $60.80 / $21.28 / $39.52 the table already uses for this spec,
   not a second set of numbers. Labels corrected against the CRO brief's
   confirmed pricing terminology (Section 3.1): "Listing price" is the
   named term for the price a seller sets, not a bare "Your price" that
   relies on context to mean anything; "Your profit" is the confirmed
   headline term in place of "margin". */
function MiniProfitWidget() {
  const ROWS = [["Your listing price", "$60.80"], ["Print cost", "$21.28"]];
  return (
    <div style={{
      border: `1px solid ${T.border}`, borderRadius: R.lg, padding: 20,
      display: "grid", gap: 12, maxWidth: 300, width: "100%",
    }}>
      {ROWS.map(([label, value]) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: TYPE.sm, color: T.textSubtle }}>
          <span>{label}</span>
          <span>{value}</span>
        </div>
      ))}
      <div style={{ height: 1, background: T.border }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 600 }}>Your profit</span>
        <span style={{
          background: "#d7f4e0", color: "#166640", padding: "4px 12px", borderRadius: 999,
          fontWeight: 700, fontSize: TYPE.sm,
        }}>
          $39.52
        </span>
      </div>
    </div>
  );
}

/* The outline writes its own copy for this section rather than reusing
   FormatCards.jsx's sitewide descriptions (they read differently) —
   real Blurb photography stays, via FORMAT_CARDS' img/alt, matched by id.
   Same shape as Sell v2's own version of this section now (Ana): the
   formats/papers/sizes counts, read off blurb.com/pricing (2026-09-06),
   not the local catalog matrix — see SellLandingV2.jsx's own note on
   what each count means and why it's sourced from the live page. */
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

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
   actually read, so it's now pinned to one real spec: an 8×10 ImageWrap
   Hardcover photo book, 80 pages. Blurb still publishes no fulfilment
   pricing, so print cost is *estimated*, the same way every other
   margin figure in this app is (Configurator.jsx, ProductOptions.jsx,
   SellerLanding.jsx): this spec's own retail unit price from
   catalog.js/pricing.data.js ($41 base at 20 pages + 60 extra pages at
   $0.33/page = $60.80) times FULFILMENT_FACTOR (0.35) = $21.28. "Est.
   margin" assumes a $60.80 sale — the same figure, so every channel is
   priced against what Blurb itself would charge for the book at retail,
   not an arbitrary sale price. Ingram is dropped for this specific
   product — it's trade-only per catalog.js, so it doesn't carry photo
   books — and RPI Print API takes its place, carrying Instant Store's
   own cost structure (same infrastructure, same 0% Blurb-side
   commission). Amazon's Commission cell keeps its real, already-sourced
   figure (CLAUDE.md's own figures section: $1.35 + 15% of list price).
   The 50% margin claim in the caption above the table is now 70% (Ana) —
   still the outline's own unsourced figure otherwise, worth confirming
   with Anain before this ships anywhere real. The "Other print-on-demand
   solutions" column is styled distinctly (see the scoped
   `.keep-more-table` rule in index.html) since it's the one column of
   five that isn't Blurb.

   ── Corrected 2026-09-06 ──
   An earlier pass of this file invented body copy for the 3-step and
   8-tile sections instead of reading it off the Figma frame — wrong,
   and not disclosed as invented at the time either. Re-extracted from
   the frame's own Properties panel and canvas text below; the only
   two lines that are genuinely placeholder IN THE OUTLINE ITSELF are
   "Share anywhere"'s lorem ipsum and the FAQ answers (the outline has
   questions only, no answers — those stay drafted, and are flagged as
   such below). */

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
     price so it's not a good name for it". */
  ["Set your price", "Upload your book and set your selling price. Our [new Instant Store pricing](?stage=margin) means up to 3x more profit than selling through our other retail distribution channels."],
  ["Create your product page", "Our AI helps you draft your title, description, and keywords. Your customizable product page is ready in minutes."],
  ["Share & sell", "Share your unique link or QR code on your bio, newsletter, or social media. We handle the printing, shipping, and sales tax."],
];

const FEATURES = [
  ["payments", "Maximum profit, zero fees",
   "With print costs up to 70% lower than retail, you maximize your earnings on every sale."],
  ["auto_awesome", "AI-powered listings",
   "Save time and optimize your page. Our AI assistant drafts your product title, description, and keywords."],
  ["storefront", "Your custom product page",
   "Showcase your work with an interactive preview, author bio, and seamless checkout."],
  ["local_shipping", "Effortless fulfillment",
   "We handle printing, white-label packaging, global shipping, and order tracking directly to your customer."],
  ["receipt_long", "Automated sales tax",
   "Sales tax is automatically collected and remitted, so you don't have to manage it."],
  ["auto_stories", "Sell books, magazines & more",
   "Your Instant Store works for photo books, magazines, notebooks, and journals."],
  ["all_inclusive", "No minimums, ever",
   "Sell one copy or one thousand. Instant Store pricing applies from your very first sale."],
  /* Was literally "Lorem ipsum dolor sit amet" in the Figma frame
     itself (kept as-is for a while, same spirit as the Showcase section
     on Sell v2 staying placeholder) — now drafted, in the same
     "post it anywhere" language the CRO brief itself uses for this
     value prop (see SellLandingV2.jsx's own note on the Instant Store
     card). */
  ["share", "Share anywhere",
   "Post your link in a bio, a newsletter, a story, or a DM. However your audience finds you, they can buy there too."],
];

const FAQS = [
  ["How do I set up an online store for my book?",
   "Pick a project already in your account (or start one), set your price, and your Instant Store page is ready to share, with no separate sign-up."],
  ["Is there a minimum order to sell through my Instant Store?",
   "No. Sell one copy or a thousand; there is no minimum."],
  ["How much does Blurb take from each sale?",
   "Nothing off the top. You set the price, we charge you our printing cost to fulfil the order, and what's left is yours."],
  ["How do I get paid for my sales?",
   "Payouts follow the same US $25 minimum and cadence as the rest of Blurb's print-on-demand routes: by PayPal or check once that threshold is reached."],
  ["Who handles sales tax and shipping on each order?",
   "We calculate and collect sales tax automatically. Your buyer pays shipping at checkout, so it's never taken out of what you keep."],
  ["Can I sell books to readers internationally?",
   "Yes. Your Instant Store link works for any buyer, and each order prints at the facility nearest them."],
  ["How do I share my Instant Store?",
   "Anywhere a link goes: a social bio, a newsletter, a QR code on a stall, or behind a button on a site you already run."],
  ["Is Instant Store pricing available on every order?",
   "Yes. The price you set is the price your buyer pays on every order, with no separate wholesale or retail tiers to track."],
  ["Can I buy my own book through my Instant Store link?",
   "Yes. The same link works for you, at the price you set."],
  ["Can I turn my Instant Store link off?",
   "Yes, any time. Turning it off stops new orders; anything already placed still ships."],
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
            <h1 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 400, letterSpacing: "-0.01em",
              fontSize: "clamp(2rem, 4.6vw, 2.75rem)", lineHeight: 1.2, margin: 0,
            }}>
              Your book, your audience, your profit
            </h1>
            {/* "Set up an online store" oversold it (Ana) — an Instant
                Store is one product page behind one link, not a
                multi-book storefront to browse. Rewritten around what it
                actually is, matching the "product page" language Sell
                v2's own Instant Store card already uses. "Third-party
                platform" corrected next (Ana: "i don't know what 3rd
                party means") — plain language, no separate site to go
                build. Ana's own line, verbatim, replaces an earlier pass
                of this sentence. */}
            <p style={{ fontSize: TYPE.lg, lineHeight: 1.55, color: T.textSubtle, margin: 0, maxWidth: 520 }}>
              Turn your book into a shareable product page and sell directly to your audience. Live in minutes, no hidden fees, and no website or tech skills needed.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button>Create your Instant Store</Button>
              <Button as="a" href="#demo" variant="outlined">See a store in action</Button>
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
                for it") — renamed everywhere on this page. */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="ms" aria-hidden style={{ fontSize: 20, color: C.blue600 }}>trending_up</span>
              <span style={{ fontSize: TYPE.sm, fontWeight: 600 }}>
                Instant Store pricing: access up to 70% lower print costs
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
          view of setting it up, complementary, not overlapping. */}
      <section style={{ padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{
          maxWidth: 1160, margin: "0 auto", display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 48, alignItems: "center",
        }}>
          <div style={{ display: "grid", gap: 24 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <h2 style={{
                fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
                lineHeight: 1.25, margin: 0,
              }}>
                One link, a real product page.
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

      {/* ── Three simple steps ── */}
      <section style={{ padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <CardList
            heading="Create your Instant Store in three steps"
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
            heading="Everything you need to sell your book online"
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

      {/* ── Keep More of What You Earn ── */}
      <section style={{ padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 20 }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24, alignItems: "center",
          }}>
            <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
              <h2 style={{
                fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
                lineHeight: 1.25, margin: 0,
              }}>
                Keep more of what you earn
              </h2>
              {/* Moved down from the "What buyers see" walkthrough
                  (Ana): that section's own "Set your own price" point was
                  redundant with this one, but she wanted this exact line
                  kept rather than lost along with it. */}
              <p style={{ margin: 0, fontSize: TYPE.base, color: T.textNeutral }}>
                You choose what to charge. What's left after your printing cost is yours, with no listing or platform fees.
              </p>
              {/* The outline's own literal text, corrected (Ana: it's
                  actually 70%, not 50%) — see the file header note on
                  why this figure is still worth confirming before this
                  ships anywhere real. No asterisk (Ana: "makes no
                  sense") — it pointed at nothing, since the outline
                  never carried a footnote to land on. "Margins" ->
                  "profit" per the CRO brief's confirmed terminology.

                  "70% higher profit" carried the same accuracy problem
                  flagged elsewhere on this page and on Sell v2 (70% is
                  the print-cost discount, not a profit multiple) —
                  brought in line with the same calculated "3x" claim
                  the hero callout and STEPS now make, not left as the
                  odd one out once those were fixed. Not explicitly
                  asked for this pass; flagged to Ana in case narrower
                  scope was intended. */}
              <p style={{ margin: 0, fontSize: TYPE.base, color: T.textSubtle }}>
                Earn up to 3x more profit than selling through other distribution channels.
              </p>
              <div>
                <Button variant="outlined" onClick={() => onGo?.("margin")}>Calculate your profit</Button>
              </div>
            </div>
            <MiniProfitWidget />
          </div>

          {/* Figures below assume one real spec (Ana) rather than "$X.XX"
              placeholders, so the table can actually be read: an 8×10
              ImageWrap Hardcover photo book, 80 pages. Blurb publishes no
              fulfilment pricing, so — same as every other margin figure
              in this app (Configurator.jsx, ProductOptions.jsx,
              SellerLanding.jsx) — the retail unit price is estimated from
              catalog.js ($41 base at 20 pages + 60 extra pages at $0.33
              = $60.80), used as "Est. margin"'s assumed sale price on
              every channel: the seller sets their own price everywhere
              here (Ana), Instant Store and Bookstore/Amazon alike, so
              $60.80 stands in for whatever a seller might charge, not a
              price only Blurb controls.

              Print cost is where channels actually differ (Ana,
              correcting an earlier pass that gave every channel the same
              cost): Instant Store and RPI Print API get the discounted
              "seller pricing" rate this app already uses everywhere
              else — retail price × FULFILMENT_FACTOR (0.35) = $21.28.
              Blurb Bookstore and Amazon don't get that rate, and there's
              no existing figure anywhere in this codebase for what they
              pay instead, so $37.50 is a placeholder Ana explicitly
              okayed guessing at, picked so Instant Store's margin lands
              close to the page's own "up to 70% higher" claim rather
              than an arbitrary number. Worth a real figure before this
              ships anywhere real — everything else on this row chain is
              at least traceable to a source; this one number isn't.

              RPI Print API replaces Ingram (Ana: Ingram is trade-only,
              per catalog.js — it doesn't carry photo books at all) and
              carries Instant Store's own cost structure: same
              infrastructure, same discounted print cost, same 0%
              Blurb-side commission.

              The spec itself is now stated on the page, not just here
              in a comment (Ana: "you need to somehow say this is based
              on a photobook") — a reader comparing five numbers has to
              know what book they're pricing. */}
          <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle }}>
            Figures below are for an 8×10 ImageWrap Hardcover photo book, 80 pages. Actual costs vary by format, size, and page count.
          </p>

          <ComparisonTable
            className="keep-more-table"
            columnHeaders={["", "Instant Store", "Blurb Bookstore", "Amazon", "RPI Print API", "Other print-on-demand solutions"]}
            rows={[
              { header: "Print cost", cells: ["$21.28", "$37.50", "$37.50", "$21.28", "Varies by provider"] },
              { header: "Commission", cells: [
                "0%", "0%",
                "Amazon's distribution fee ($1.35 per book + 15% of your list price)",
                "0%",
                "Varies by provider",
              ] },
              /* The point of this row (Ana): every Blurb route charges
                 none of these, which a shared "$0" Setup fees row (since
                 dropped — nobody in this market has one) couldn't show. */
              { header: "Other fees", cells: [
                "None", "None", "None", "None",
                "Payment processing fees, platform fees, hosting fees",
              ] },
              { header: "Est. profit on a $60.80 sale", cells: ["$39.52", "$23.30", "$12.83", "$39.52", "Varies by provider"] },
            ]}
          />
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
          Plain background, not gray50 — "What you can sell" right after
          it already is gray50, and back-to-back would merge the two
          into one block with no visible seam. */}
      <section style={{ padding: "clamp(48px, 6vw, 64px) 24px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gap: 32 }}>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
            lineHeight: 1.25, margin: 0,
          }}>
            Blurb handles everything after the sale.
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

      {/* ── What can you sell ── the same four product-type cards used
          elsewhere, not retyped. Padding cut roughly in half (Ana: too
          large) — same clamp(32px,4vw,48px) Sell v2's own "Included with
          every way you sell" section uses for the same reason: it sits
          between two dense sections and doesn't need that much air. */}
      <section style={{ background: C.gray50, padding: "clamp(32px, 4vw, 48px) 24px" }}>
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
