import { Button, CardList, Card, ComparisonTable, HeroCenter } from "@blurb/codex-react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import { FORMAT_CARDS } from "./FormatCards.jsx";
import Faq from "./Faq.jsx";

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
   rule out. Anain okayed shipping it as designed (2026-09-06). Figures
   stay at the "$X" placeholder this app already uses rather than
   invented ones (the outline's own cells are already "$X.XX"/"X%"
   placeholders, not real numbers). The "50%" in the caption above the
   table IS the outline's literal text, not a placeholder — it has no
   visible source in the board's provenance panel, so it's worth
   confirming with Anain before this ships anywhere real.

   Reworked 2026-09-06 (Ana): dropped the qualitative "alternative"
   table that used to sit under this one — with a real table on the
   page already (design-review-approved), a second one arguing the
   opposite case read as hedging rather than adding information, and
   Ana called it out directly ("we can break the rule in this case").
   Expanded instead: Ingram and "Other print-on-demand solutions"
   columns, so the table compares every route this page's own six-route
   sibling on Sell v2 does, not just three of them. Setup fees dropped —
   nobody in this market charges one, so a row of identical "$0"s across
   every column proved nothing. A new "Other fees" row does the
   differentiating work instead: Blurb charges none of the payment-
   processing, platform, or hosting fees a generic POD/storefront
   stack often does, which is a real, checkable difference, unlike a
   shared zero. Amazon's and Ingram's Commission cells carry real
   figures rather than "X%" — Amazon's $1.35-plus-15% fee is already
   sourced in CLAUDE.md's own figures section; Ingram has no fixed
   commission at all, since it works off a wholesale discount the
   seller sets, so its cell explains the mechanism instead of quoting
   a number that doesn't exist for it.

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
  ["Set your price", "Upload your book and set your selling price. Our [new seller pricing](?stage=margin) means you keep up to 50% more of every sale."],
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
   "Your Instant Store works for photo books, magazines, notebooks, and wall art."],
  ["all_inclusive", "No minimums, ever",
   "Sell one copy or one thousand — seller pricing applies from your very first sale."],
  /* This one really is "Lorem ipsum dolor sit amet" in the Figma frame
     itself — kept as-is rather than drafted, same as the Showcase
     section on Sell v2. */
  ["share", "Share anywhere",
   "Lorem ipsum dolor sit amet"],
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
        /* "Set up an online store" oversold it (Ana) — an Instant Store
           is one product page behind one link, not a multi-book
           storefront to browse. Rewritten around what it actually is,
           matching the "product page" language Sell v2's own Instant
           Store card already uses rather than introducing a third way
           to describe the same thing. */
        subheading="Turn your book into a shareable product page and start selling directly to your audience. Live in minutes, with no tech skills or third-party platform required."
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
            heading="Create your Instant Store in three simple steps"
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

      {/* ── Keep More of What You Earn ── */}
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
              {/* The outline's own literal text — see the file header
                  note on why this specific number is worth confirming
                  before this ships anywhere real. */}
              <p style={{ margin: 0, fontSize: TYPE.base, color: T.textSubtle }}>
                *Earn up to 50% higher margins compared to other distribution channels.
              </p>
            </div>
            <Button variant="outlined" onClick={() => onGo?.("margin")}>Calculate your margin</Button>
          </div>

          <ComparisonTable
            columnHeaders={["", "Instant Store", "Blurb Bookstore", "Amazon", "Ingram", "Other print-on-demand solutions"]}
            rows={[
              { header: "Print cost", cells: ["$X.XX", "$X.XX", "$X.XX", "$X.XX", "Varies by provider"] },
              { header: "Commission", cells: [
                "0%", "0%",
                "Amazon's distribution fee ($1.35 per book + 15% of your list price)",
                "No fixed commission — you set a wholesale discount off your own list price",
                "Varies by provider",
              ] },
              /* The point of this row (Ana): every Blurb route charges
                 none of these, which a shared "$0" Setup fees row (since
                 dropped — nobody in this market has one) couldn't show. */
              { header: "Other fees", cells: [
                "None", "None", "None", "None",
                "Payment processing fees, platform fees, hosting fees",
              ] },
              { header: "Est. margin on a $20 sale", cells: ["$X.XX", "$X.XX", "$X.XX", "$X.XX", "Varies by provider"] },
            ]}
          />
        </div>
      </section>

      {/* ── What can you sell ── the same four product-type cards used
          elsewhere, not retyped. */}
      <section style={{ background: C.gray50, padding: "clamp(56px, 7vw, 80px) 24px" }}>
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
