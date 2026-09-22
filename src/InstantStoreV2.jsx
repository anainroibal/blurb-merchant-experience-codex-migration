import React, { useState } from "react";
import { Button, CardList, Card, RadioCard, RadioCardGroup } from "@blurb/codex-react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import { FORMAT_CARDS } from "./FormatCards.jsx";
import { CATALOG, defaultSelection, minSellPrice } from "./catalog.js";
import ProductOptions from "./ProductOptions.jsx";
import SummaryPanel from "./SummaryPanel.jsx";
import CreateActions from "./CreateActions.jsx";
import Faq from "./Faq.jsx";

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
/* RESYNCED to the Cro-Seller-LP Figma canvas (Anain, 2026-09-22) — Figma
   is now the source of truth for this page's copy AND layout. This section
   is Figma's "Switchback" component: four alternating image/text lanes,
   no numbered badges (hidden in the desktop instance), each image a real
   PDP screenshot exported straight off the frame (node 250:24548) — not
   the hand-built InstantStoreMockup/"Coastal Mornings" placeholder this
   section used to render instead. Order matches WALKTHROUGH 1:1. */
const WALKTHROUGH = [
  ["Showcase your work", "Cover, description, and price, plus an interactive book preview so buyers can flip through real pages before they buy.", "/assets/switchback-lane1-showcase.png"],
  ["All your books in one place", "Every other book you sell shows up right on the page, so buyers can find your full catalog.", "/assets/switchback-lane2-morebooks.png"],
  ["One click to buy", "A single tap on 'Buy now' takes buyers straight to secure checkout, where they can pay with Apple Pay, Google Pay, and PayPal. You don't need to build or maintain anything yourself.", "/assets/switchback-lane3-buynow.png"],
  ["Blurb prints and ships your book", "Don't buy your inventory upfront.  Every order triggers a fresh print run, and you only pay for what ships. Your buyer gets a tracked delivery, and you never touch a box.", "/assets/switchback-lane4-shipping.png"],
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
   new one on sell v2") once that page's real Figma icon was confirmed.

   The other three icons were guesses too, never checked against this
   section's own Figma reference until now (Ana: "grab the new icons
   for the Blurb handles everything after the sale from the figma" —
   node 21-3585, "they're on the left"). Drilled into each icon
   instance's own layer name: "Print on demand" is auto_stories (an
   open book, not inventory_2), "Ships in days" was already right
   (local_shipping, confirmed rather than assumed this time), and
   "Tracking on every order" is where_to_vote — a location pin with a
   checkmark, not the generic "verified" badge shape. */
/* RESYNCED to Figma (Anain, 2026-09-22) — see WALKTHROUGH's note above. */
const FULFILMENT_POINTS = [
  ["auto_stories", "Print on demand", "Every order triggers a fresh print run, so there's no need to buy books upfront or maintain inventory."],
  ["local_shipping", "Ships in days", "Blurb packs and ships every order directly to your buyer. You never touch a box."],
  ["where_to_vote", "Tracking on every order", "Buyers can estimate shipping times and will get a tracking number automatically at the checkout."],
  ["source_environment", "Powered by RPI Print", "Our in-house fulfillment, backed by RPI Print's 45+ years of print experience, ensures quality control and reliability at scale, trusted by brands like Canva and Minted."],
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
/* Each card links to its real blurb.com category page (2026-09-10,
   Ana: "have each one link to each of Blurb's category listing pages,
   on both isv2 and selling overview") — confirmed live URLs by reading
   them off blurb.com's own nav rather than guessing at the slug.
   "Paperback & Hardcover" -> "Paperbacks & Hardcovers" 2026-09-10 (Ana,
   both pages) — plural to match the other three titles. */
/* RESYNCED to Figma (Anain, 2026-09-22) — see WALKTHROUGH's note above.
   "Paperback & Hardcover Books" restored (was "Paperbacks & Hardcovers"),
   photo book format count restored to 4 (matching blurb.com/pricing, was
   trimmed to 3), and all four descriptions rewritten to the desktop
   frame's current copy. */
const SELL_FORMATS = [
  { id: "photo", title: "Photo Books", formats: 4, papers: 7, sizes: 6,
    desc: "Sell photo books online, including travel and portrait photography books and layflat photo books, in premium papers and formats.",
    img: "https://assets.blurb.com/_astro/linen-hardcover-dustjacket-optimized.DNuztDk1.webp",
    alt: "Stack of linen hardcover with dust jacket photo books with a red scooter on the cover and the title “Life in Italy.”",
    href: "https://www.blurb.com/photo-books" },
  { id: "trade", title: "Paperback & Hardcover Books", formats: 3, papers: 3, sizes: 3,
    desc: "Sell paperback and hardcover books online: novels, cookbooks, children's books, poetry, and art books.",
    href: "https://www.blurb.com/hardcover-and-paperback-books" },
  { id: "magazine", title: "Magazines", formats: 1, papers: 1, sizes: 1,
    desc: "Sell magazines and zines online with newsstand-quality printing, perfect for lookbooks or serial content.",
    href: "https://www.blurb.com/magazines" },
  { id: "notebook", title: "Notebooks & Journals", formats: 4, papers: 1, sizes: 3,
    desc: "Sell notebooks and journals online in blank, lined, or dot-grid formats, a natural companion to your books.",
    img: "https://assets.blurb.com/_astro/linen-hardcover-with-dustjacket-notebook-optimized.CQRJ330f.webp",
    alt: "Open linen hardcover notebook with dust jacket showing travel photography of Greece on one side, and blank lined paper on the other.",
    href: "https://www.blurb.com/custom-notebooks-journals" },
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
     best case (Amazon, at 3x) and not uniformly across all three.

     Amazon and Ingram dropped, Blurb Bookstore only (2026-09-10, Ana) —
     the same benchmark call already made on this page's own lede and on
     Sell Overview's matching claim, now applied here too so all three
     don't disagree with each other. "selling price" -> "listing price"
     in the same edit, matching the "Listing price (you set this)" label
     already used in the table below rather than a second term for the
     same number. */
  /* RESYNCED to Figma (Anain, 2026-09-22) — restores "set your own
     price" and the Amazon/Ingram comparison the 2026-09-10 pass above
     had deliberately narrowed to Blurb Bookstore only; Figma's canvas
     text is the source of truth again. */
  ["Set your price", "Upload your book and set your own price. Our [new Instant Store pricing](?stage=margin) means up to 3x more profit than selling through the Blurb Bookstore, Amazon, or Ingram."],
  ["Create the product page", "Our AI helps you draft your title, description, and keywords. Your customizable product page is ready in minutes."],
  /* Proof requirement folded into this step (2026-09-10, Ana) — the
     first place in these three steps that says a proof is needed at
     all; it was previously only in this page's own FAQ ("Do I need to
     order a proof before I can sell through my Instant Store?"), which
     someone doing the 1-2-3 read might never open. "Once you ordered" ->
     "Once you've ordered" (grammar). "your bio" -> "your Instagram bio",
     narrowing the example rather than genericizing it. */
  ["Share & sell", "Once you've ordered a proof, share your link or QR code on your Instagram bio, newsletter, or social media. We handle the printing, shipping, and sales tax."],
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
/* RESYNCED to Figma (Anain, 2026-09-22) — see WALKTHROUGH's note above.
   Four of eight bodies rewritten to the desktop frame's current copy
   ("Your custom product page" and "Industry-leading quality" already
   matched, so left as-is). */
const FEATURES = [
  ["payments", "Maximum profit, zero fees",
   "With print costs up to 70% lower than Blurb retail pricing and no page setup, subscription, or platform fees, you keep more of every sale."],
  ["auto_awesome", "AI-powered listings",
   "Our AI drafts your title, description, and keywords, so you're never starting from a blank page."],
  ["storefront", "Your custom product page",
   "Showcase your work with an interactive preview, author bio, and one-tap checkout via Apple Pay, Google Pay, or PayPal, no buyer account needed."],
  ["diamond", "Industry-leading quality",
   "Give your audience access to Blurb's superior print quality, vast catalog of formats, and premium paper types."],
  ["receipt_long", "Automated sales tax",
   "Sales tax is calculated, collected, and remitted automatically on every sale, so you never have to manage it."],
  ["auto_stories", "Sell books, magazines & more",
   "Your Instant Store is a product page built for authors and creators: profit, simplicity, and reach, all through one direct checkout link."],
  ["all_inclusive", "No minimums, ever",
   "Sell one book at a time, or a thousand, with no order minimums or print run volume threshold. [Instant Store pricing](?stage=margin) applies from your very first book sale."],
  ["share", "Share anywhere",
   "Get your custom checkout link and QR code to post on your own website or social media, send in a newsletter or DM. However your audience finds you, they can buy your book there too."],
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
     "Share anywhere" in the FEATURES grid above already answers it.

   `lean` added 2026-09-11 once "shipping" left the minimum-effort scope
   (Ana: "remove shipping page from minimum effort") — this page itself
   is shared by both scopes, so the international-shipping answer below
   only linked "shipping page" outside lean; in lean it was plain text,
   since there was nowhere for it to go. Removed again 2026-09-14 once
   "shipping" came back to that scope (Ana: "add shipping page to the
   reduced scope too") — the link is unconditional again, and `lean`
   is gone from this file's own props/signature along with it.

   Proof question trimmed 2026-09-14 (Ana) — "Do I need to order a
   proof..." -> "Do I need to order a book proof...", and the answer
   dropped "either a discounted physical copy or a free PDF": both
   still true (see catalog.js's proof-requirement rules), just no
   longer spelled out here.

   "Where can I see reporting on my sales?" -> "How do I track my book
   sales and earnings?" (2026-09-14, Ana) — asks it the way a seller
   would rather than naming the dashboard pages first.

   International-shipping answer reworded the same day (Ana: "works for
   any buyer" -> "works for buyers worldwide", "and each order prints"
   -> "with each order printed") — same facts, and per her explicit
   instruction the "shipping page" text stays linked to the shipping
   stage, which it already was.

   "How much does Blurb take from each sale?" rewritten again the same
   day (Ana) — "book sale" in the question, and the answer now leads
   with the print-on-demand fact in the seller's own terms ("add your
   markup and keep 100% of what's left after the print cost") rather
   than "nothing off the top". Normalized her "set-up fee" to "setup
   fee" to match this page's own spelling everywhere else, and added
   "of" to "keep 100% what's left" for the sentence to parse. */
/* RESYNCED to Figma (Anain, 2026-09-22) — the Cro-Seller-LP accordion
   is now the source of truth for this page's FAQ, so the 10-question
   list above (itself a careful, documented consolidation of the SEO
   team's 10 required questions plus a checkout-link FAQ doc — see the
   file's own history above) is superseded by the 13 questions/answers
   now on the desktop accordion, in its order. This drops the earlier
   trim-to-10 pass; if any of those cut questions (refund policy, "how
   do I share my Instant Store," "how fast does an order ship") need to
   come back, that's a Figma edit first, then another resync. */
const FAQS = onGo => [
  ["How do I set up an online store to sell my book?",
   "Open the Instant Store page in your Blurb dashboard, choose the project you want to sell, and set your listing details and price. You can preview your page before it goes live. There's no separate sign-up, so you can set up your Blurb Instant Store with the account you already have."],
  ["Where can I share my Blurb Instant Store link?",
   "Share it anywhere your readers already are: social media posts and profiles, email newsletters, or your own website. You can also turn your link into a QR code and print it on business cards, bookmarks, event signage, or holiday cards."],
  ["How much does Blurb take from each book sale?",
   "Blurb takes only the print cost of each book. There are no setup, seller, platform, or distribution fees. When a buyer orders through your Instant Store, the print cost comes out of their payment, and you keep 100% of the rest. Because every book is printed on demand, you never pay anything upfront."],
  ["Is there a minimum print run or book order before I can start selling?",
   "No. There's no minimum print run or order quantity. Sell one book or a thousand, whenever you're ready."],
  ["Do I need to order a proof before I can sell through my Instant Store?",
   "Yes. You need to order and review a printed proof copy of your book before your Instant Store can go live. It's the same quality check every Blurb book goes through, so you'll know exactly what your buyers will receive."],
  ["What happens after someone buys my book through my Instant Store?",
   "We print your book, ship it to your buyer, and send them tracking updates along the way. You don't need to handle packing, shipping, or order follow-up."],
  ["Who helps my buyers if they have questions about their order?",
   "Blurb customer service answers your buyers' questions about ordering, payment, and shipping. If a question needs your input, we'll reach out to you."],
  ["Who handles sales tax and shipping on Instant Store orders?",
   "We handle sales tax, and your buyer pays shipping at checkout. Neither comes out of your earnings."],
  ["Can I sell books internationally, and how long does delivery take?",
   <>
     Yes. Your Instant Store link works for buyers worldwide, and each order is printed at the facility nearest to them. Delivery times and rates depend on your buyer's country and the shipping method they choose. See our{" "}
     <a href="#" onClick={e => { e.preventDefault(); onGo?.("shipping"); }} style={{ color: C.blue600, textDecoration: "underline" }}>
       shipping page
     </a>{" "}
     for delivery times and rates by country.
   </>],
  ["How do I get paid for my Instant Store sales?",
   "We pay you monthly by check or PayPal once your earnings reach $25. It's the same payout schedule as sales through the Blurb Bookstore."],
  ["How do I track my book sales and earnings?",
   "The Earnings and Monthly Profit Reports pages in your dashboard show what you've made from every sales channel, including your Instant Store."],
  ["Is Instant Store pricing available if I sell through the Blurb Bookstore, Amazon, or Ingram?",
   <>
     <p style={{ margin: "0 0 12px" }}>
       No. Instant Store pricing applies only to orders your buyers place through your Instant Store link. Pricing on the Blurb Bookstore, Amazon, and Ingram is unchanged, and so is pricing on orders you place for yourself. The Instant Store pricing is a separate, stable print cost available only on orders your buyers place directly through your Instant Store link.
     </p>
     <p style={{ margin: 0 }}>
       If you're ordering 100 or more book copies for an event, inventory, or your own use,{" "}
       <a href="https://www.blurb.com/large-order-services" target="_blank" rel="noopener noreferrer" style={{ color: C.blue600, textDecoration: "underline" }}>
         Blurb volume discounts
       </a>{" "}
       on bulk book printing apply instead.
     </p>
   </>],
  ["Can I buy my own book through my Instant Store link?",
   <>
     No. Your Instant Store link is for your buyers only. To order copies for yourself, order directly from Blurb at retail pricing. For 100 or more copies, use{" "}
     <a href="https://www.blurb.com/large-order-services" target="_blank" rel="noopener noreferrer" style={{ color: C.blue600, textDecoration: "underline" }}>
       Blurb volume discounts
     </a>.
   </>],
];

/* Figma's own "Calculate your profit" product picker (node 104:5039),
   labelled to match that row exactly rather than reusing each format's
   internal catalog label (e.g. CATALOG.trade.label is "Trade Books",
   not "Paperback & Hardcover Books" — the Figma-facing name). */
const CALCULATOR_FORMATS = [
  { id: "photo", label: "Photo Book" },
  { id: "trade", label: "Paperback & Hardcover Books" },
  { id: "magazine", label: "Magazine" },
  { id: "notebook", label: "Notebooks & Journals" },
];

export default function InstantStoreV2({ onGo }) {
  /* RESYNCED to Figma (Anain, 2026-09-22) — "Calculate your profit" is a
     live, embedded instance of the same Instant Store profit calculator
     the ?stage=margin page uses (ProductOptions + SummaryPanel), not the
     hand-built 4-column KEEP_MORE_* table this section used to render —
     see that section's own note below for what it replaced. */
  const [calcFormatId, setCalcFormatId] = useState("photo");
  /* Figma's own example spec (node 104:5039): 8×10 in, Soft Cover,
     Premium Lustre — defaultSelection() alone lands on Mini Square
     instead (the first available combination, not the frame's own
     example), so the size is pinned to match here. */
  const [calcSel, setCalcSel] = useState(() => ({ ...defaultSelection("photo"), size: "standard_portrait" }));
  const [calcPrice, setCalcPrice] = useState(24);
  const [calcShip, setCalcShip] = useState({ open: false, country: "US", postal: "", speed: "economy" });
  const changeCalcFormat = id => {
    setCalcFormatId(id);
    const sel = id === "photo" ? { ...defaultSelection(id), size: "standard_portrait" } : defaultSelection(id);
    setCalcSel(sel);
    setCalcPrice(minSellPrice(id, sel));
  };

  return (
    <div style={{ fontFamily: FONT_BODY, color: C.gray950 }}>

      {/* ── Hero ── RESYNCED to Figma layout, not just copy (Anain,
          2026-09-22; node 104:4846) — flat #f9f6f3 background, not the
          hero-gradient-seller class the other seller pages share (this
          page's own frame uses a plain fill, confirmed against the
          canvas rather than assumed to match its siblings). */}
      <section style={{ background: "#f9f6f3", padding: "clamp(56px, 8vw, 96px) 24px" }}>
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
              Blurb Instant Store. Sell books directly to readers and maximize your profits
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
                "and" don't need it, only a list of three or more would.

                REVISED 2026-09-10 (Ana): "no website" -> "no inventory,"
                dropped to a three-item list ("no hidden fees, no
                inventory, and no tech skills needed") — which is
                exactly the three-or-more case the comment above says
                wants its comma back, so it's restored here. Ana's own
                message dropped the "no" before "tech skills needed"
                ("and tech skills needed"), which reads as the opposite
                of the intended claim (tech skills ARE needed) and
                contradicts every other "no tech skills required" line
                on this page — read as a typo and corrected rather than
                implemented literally; flagging it here rather than
                silently guessing. */}
            <p style={{ fontSize: TYPE.lg, lineHeight: 1.55, color: T.textSubtle, margin: 0, maxWidth: 520 }}>
              A product page for your book, live in minutes, with a direct checkout link to sell to your audience and 0 hidden fees. No website or tech skills needed to start selling direct today.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button>Create Your Instant Store</Button>
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

          {/* RESYNCED to Figma (Anain, 2026-09-22) — was an honest
              checkerboard placeholder ("no real demo video exists yet");
              Figma's own frame turns out to carry a real poster image (a
              press photo of a book printing on-press), not a
              placeholder, so this is no longer invented content —
              exported straight off node 104:4846. Still just a poster
              behind a play icon, not an actual video embed, since no
              video file exists in this codebase to point it at. */}
          <div id="demo" style={{
            position: "relative", borderRadius: R.lg, overflow: "hidden", aspectRatio: "707 / 474",
            border: `1px solid ${T.border}`, display: "grid", placeItems: "center",
          }}>
            <img
              src="/assets/hero-video-poster-overlay.png"
              alt="A book printing on a Blurb press"
              loading="lazy"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            <img
              src="/assets/hero-play-icon.svg"
              alt=""
              aria-hidden
              style={{ position: "relative", width: 80, height: 80 }}
            />
          </div>
        </div>
      </section>

      {/* ── Switchback ── RESYNCED to Figma layout, not just copy
          (Anain, 2026-09-22; node 250:24548) — four alternating
          image/text lanes, a real PDP screenshot on every lane, no
          numbered badges (hidden in Figma's own desktop instance). This
          replaces the numbered-list-plus-InstantStoreMockup layout the
          section used before, which didn't match the frame's actual
          design — see WALKTHROUGH's own note above. Lane order
          alternates image-right/image-left, matching Figma exactly. */}
      <section style={{ padding: "clamp(40px, 5vw, 56px) 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gap: "clamp(40px, 5vw, 56px)" }}>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)",
            lineHeight: 1.2, margin: 0, textAlign: "center",
          }}>
            One link, a real product page for your book
          </h2>
          {WALKTHROUGH.map(([title, body, img], i) => {
            const imageFirst = i % 2 === 1;
            const imageEl = (
              <div style={{
                flex: "1 1 0", minWidth: 280, border: `1px solid ${T.border}`, borderRadius: R.lg,
                boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)", overflow: "hidden", aspectRatio: "650 / 564",
              }}>
                <img src={img} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            );
            const textEl = (
              <div style={{ flex: "1 1 0", minWidth: 280, display: "grid", gap: 16 }}>
                <h3 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "2rem", lineHeight: 1.2 }}>{title}</h3>
                <p style={{ margin: 0, fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.4 }}>{body}</p>
              </div>
            );
            return (
              <div key={title} style={{ display: "flex", gap: "clamp(24px, 5vw, 80px)", alignItems: "center", flexWrap: "wrap" }}>
                {imageFirst ? <>{imageEl}{textEl}</> : <>{textEl}{imageEl}</>}
              </div>
            );
          })}
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
            heading="Create your Instant Store in three steps"
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
          back at 1280, matching the table exactly.

          gray50 -> #f5f0ea (2026-09-10, Ana: "change the light grey
          bg... to the beige bg in the figma") — confirmed directly
          against this section's own real, assembled instance inside
          ISV2's Figma frame (not a loose reference component): its
          "Value Props" Card List sits on an explicit cream backdrop
          there, same tone this codebase already uses everywhere else
          (ProductCatalog, Home, SellerLanding). */}
      <section style={{ background: "#f5f0ea", padding: "clamp(40px, 5vw, 56px) 24px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <CardList
            heading="Everything you need to sell books directly to your audience"
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
      {/* ── Calculate your profit ── RESYNCED to Figma layout, not just
          copy (Anain, 2026-09-22; node 104:5039). Figma's own canvas
          shows this section as a LIVE embedded instance of the Instant
          Store profit calculator — the same ProductOptions + SummaryPanel
          pairing the ?stage=margin page uses (Product/Book Size/Cover/
          Paper pickers on the left, Print cost + listing-price/profit/
          margin steppers on the right) — not a static 4-column comparison
          table. The hand-built KEEP_MORE_* table this section used to
          render (Instant Store vs Blurb Bookstore vs Amazon vs RPI Print
          API, with a fixed $80/$27.90/$62.78 example) was a real, heavily
          -reviewed design in its own right, but it isn't what the current
          frame shows, so it's replaced here rather than kept alongside a
          second, different-looking calculator. That comparison still
          lives on Sell Overview's own table, linked below exactly as
          before. */}
      <section id="keep-more" style={{ padding: "clamp(40px, 5vw, 56px) 24px", scrollMarginTop: "calc(var(--nav-h, 124px) + 16px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gap: 24 }}>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
            lineHeight: 1.25, margin: 0,
          }}>
            Calculate your profit
          </h2>

          {/* Compact product-type row, matching Figma's own "Product"
              control here (Photo Book / Paperback & Hardcover Books /
              Magazine / Notebooks & Journals) — not FormatCards' big
              photo-card picker, which is a different control used
              elsewhere (the format catalogue, /getting-started). */}
          <RadioCardGroup
            value={calcFormatId}
            onValueChange={changeCalcFormat}
            aria-label="Product"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}
          >
            {CALCULATOR_FORMATS.map(f => (
              <RadioCard key={f.id} value={f.id}>{f.label}</RadioCard>
            ))}
          </RadioCardGroup>

          <div
            className="fade-in cfg-grid"
            style={{ display: "grid", gap: 40, alignItems: "start", gridTemplateColumns: "minmax(340px, 1.55fr) minmax(310px, 0.85fr)" }}
          >
            <div className="cfg-steps" style={{ minWidth: 0 }}>
              <ProductOptions formatId={calcFormatId} state={calcSel} onChange={setCalcSel} mode="sell" />
            </div>
            <SummaryPanel
              formatId={calcFormatId}
              state={calcSel}
              onChange={setCalcSel}
              mode="sell"
              sellPrice={calcPrice}
              onSellPrice={setCalcPrice}
              ship={calcShip}
              setShip={setCalcShip}
              onGo={onGo}
              actions={
                <CreateActions
                  formatId={calcFormatId}
                  sel={calcSel}
                  onGo={onGo}
                  heading="Ready to make it?"
                  hideHint
                />
              }
            />
          </div>
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
          that job instead.

          gray50 -> #f5f0ea (2026-09-10, Ana: "change the light grey bg
          on the Everything you need to sell your book online and
          Blurb handles everything after the sale to the beige bg in
          the figma") — same cream already used for the FEATURES grid
          right above it. Worth a flag: this section's own Figma
          component (a loose top-level "Card List," not embedded in
          either page's assembled frame) carries an explicit white
          "Bg/Surface" fill, not beige — checked directly rather than
          assumed. Implementing Ana's instruction as given since it's a
          direct, confident read of the source, but noting the
          discrepancy rather than claiming false certainty either way. */}
      <section style={{ background: "#f5f0ea", padding: "clamp(40px, 5vw, 56px) 24px" }}>
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
            {/* Only the image links out to its real blurb.com category
                page 2026-09-10 (Ana: "make just the images be clickable
                not the whole card plz") — reverses the same-day whole-
                card-link pass. Plain <a> around just the image rather
                than Card's own `link`/`cta` slot: Codex's Link component
                can only open in a new tab via `openInNewTab`, and that
                prop is what appends its "open in new" icon (confirmed in
                Link's own d.ts) — unwanted clutter, and this app has
                already pulled that icon off other links for the same
                reason (SellLandingV2 "remove the open in a new link
                icons"). A native anchor gets the new-tab behavior
                without it. */}
            {SELL_FORMATS.map(f => {
              const photo = f.img ? f : FORMAT_CARDS.find(c => c.id === f.id);
              return (
                <Card
                  key={f.id}
                  icon={
                    <a href={f.href} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%" }}>
                      <img
                        src={photo.img}
                        alt={photo.alt}
                        loading="lazy"
                        style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block", borderRadius: R.lg }}
                      />
                    </a>
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

      {/* ── Close ── RESYNCED to Figma (Anain, 2026-09-22; node 284:24960)
          — solid light-blue fill (#eff9ff), not the gray/beige gradient
          this section used before; single button only, matching the
          desktop frame exactly (its own second "Calculate your profit"
          button exists in the component but is hidden there too). */}
      <section
        className="curve-cta"
        style={{
          background: "#eff9ff",
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
            It only takes a few minutes to get started.
          </p>
          <Button>Create your Instant Store</Button>
        </div>
      </section>
    </div>
  );
}
