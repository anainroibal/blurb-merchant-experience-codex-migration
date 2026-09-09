import React from "react";
import { Button, Select } from "@blurb/codex-react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import Faq from "./Faq.jsx";
import ShippingSection from "./ShippingSection.jsx";
import InstantStoreLane from "./InstantStoreLane.jsx";
import { FORMAT_CARDS } from "./FormatCards.jsx";
import { SHIPPING, PRINT_RANGE, shippingFor, money, BULK_MIN, arrivalWindow, formatDay } from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   /shipping — a calculator again, without a postcode or a date.

   REVISED 2026-09-01 (Ana): this page went informational-only on
   2026-08-27 because the real calculating lives on /getting-started and
   the profit calculator. Ana asked for a product + country picker back,
   so it calculates again — but it still can't hold what those two pages
   can: no postcode (this page doesn't know a street), and no calendar
   date (it doesn't know an order date). What it can honestly show is a
   cost and a business-day range for a single copy. Precise dates stay
   on the two pages that price a real order.

   Three things in Crometrics' mock are NOT rebuilt here, and the reason
   is a rule rather than a preference:

     · "Wholesale pricing" — /ingram already uses wholesale for the trade
       discount a retailer takes. One word, two meanings, one site.
     · "up to 70% below the retail maker price", and a price list showing
       retail struck through beside fulfilment.
     · "Retail price for reference" inside the calculator panel.

   The last two put retail and fulfilment side by side with the
   subtraction already done, which publishes Blurb's margin. Where this
   page has to explain the difference it uses the change of role —
   you're the customer, then we're your printer — and it carries no
   seller figures at all, because the estimator does.

   THE LIVE PAGE'S COPY IS KEPT WHERE IT STILL WORKS, as it was on the
   Sell page: the line about printing and binding and the FAQ's own
   question wording are blurb.com/shipping's, not ours (the "Good
   Things on the Way" heading itself is gone now — see 2026-09-10
   below). What we add is what the live page cannot say now that it no
   longer calculates: which of the two calculators to open, and the
   fact that a seller's buyer pays the delivery.

   One correction rather than a copy: the live page says "over 70
   countries and territories" above a list of 67. We print the count the
   list actually holds.

   Every rate here is a placeholder: Blurb publishes no shipping prices.
   The destinations and the print time are real, from blurb.com.

   REVISED AGAIN 2026-09-10 (Ana):
   - The standalone "How it works" section (print time + a per-speed
     card grid) dropped entirely — it just restated, in isolation, the
     same per-speed day ranges "What it costs, wherever it's going"
     already shows, now attached to a real quote instead of a bare
     range. Two sections making the same point once each is worse than
     one section making it with the price attached.
   - The "We deliver to X countries... rates are placeholders..."
     paragraph under that section dropped too — the placeholder caveat
     is already stated once, plainly, right here in this comment and in
     the file's own figures documentation; repeating it as reader-facing
     copy on every visit added a caveat nobody asked to read mid-quote.

   SIMPLIFIED FURTHER 2026-09-10 (Ana: "we don't need so many slogans,
   maybe just the what it costs one. good things on the way makes no
   sense"):
   - Hero H1 "Good things on the way" -> "Shipping rates and delivery
     times", the live page's own heading dropped in favor of one that
     just says what the page is. "What it costs, wherever it's going"
     is the one heading kept in that slogan-ish register, by name.
   - "See it for your own book" -> "Get an exact price and date", and
     its lede rewritten plainly: this page can only show a range, so
     say that and point at the two calculators that can do better,
     rather than a line built on "you'll find it where the book is"
     wordplay.

   SIMPLIFIED AGAIN 2026-09-10 (Ana: "we can remove all this ... and we
   should add a quantity dropdown ... we don't need another title for
   'What it costs, wherever it's going', just get to the dropdowns"):
   - The lede under "What it costs, wherever it's going" ("Pick a
     product and a country to see delivery priced and timed for a
     single copy. Order more than one and they travel together...")
     is gone. The heading goes straight into the pickers now.
   - A third picker, Quantity, replaces the single-copy assumption the
     dropped lede used to explain. `shippingFor` already accepted a qty
     argument (base + per-extra-copy, discounted for shipping
     together) — this was the one caller still hardcoding 1. Options
     stop at 50, one below BULK_MIN (100): "Ordering in volume" below
     already sends a triple-digit order to Large Order Services, so
     this dropdown never offers a quantity that section would contest.

   REVISED AGAIN 2026-09-10 (Ana: "What it costs, wherever it's going
   section should be white bg. if user picks 100 copies or more, show
   a banner to go to Bulk Printing Services"):
   - That section dropped `tinted`, so it's white like the section
     below it rather than gray50.
   - The Quantity dropdown now runs one option past where it used to
     stop — BULK_MIN itself, labelled "100+ copies" — so picking it is
     possible at all. At BULK_MIN or above, `BulkBanner` replaces the
     speed-rows grid outright rather than sitting beside it: a per-copy
     rate multiplied out to 100+ is exactly the number "Ordering in
     volume" already warns isn't the one to read, so showing it as a
     quote would contradict this page's own caveat. Named and linked
     the way Sell v2, Instant Store v2 and the nav already do — Bulk
     Printing Services, blurb.com/large-order-services — not "Large
     Order Services", which the caveat text below still uses; left that
     alone since renaming it wasn't asked for.

   REVISED AGAIN 2026-09-10 (Ana pasted a reference banner — info icon,
   "100 copies or more?", "Our team can help with planning and volume
   pricing.", a "Learn more" link — and asked to match its copy, align
   it to the current Bulk Printing Services name, and use "custom
   quote" the way Sell v2's own CTA does):
   - `BulkBanner` rewritten to that shape: an info glyph beside a plain
     (not uppercase-eyebrow) heading, one plain sentence naming Bulk
     Printing Services rather than "our team" so the banner is
     self-contained without a page's worth of context, and the CTA
     relabelled "Get a custom quote" to match Sell v2's own link text
     instead of "Get a bulk quote" or "Learn more".

   CORRECTED 2026-09-10 (Ana: "it should actually still give you a
   shipping quote, that banner is additional"): the 100+ branch had
   replaced the speed-rows grid with the banner outright. The quote
   still calculates fine at any quantity `shippingFor` accepts, so the
   grid stays for every quantity including 100+, and the banner now
   renders underneath it as an addition, not a swap. */

/* Runs one past BULK_MIN (100) rather than stopping short of it, so
   picking it is how the bulk banner below gets triggered at all. */
const QUANTITIES = [1, 2, 5, 10, 25, 50, BULK_MIN];

function Section({ title, lede, children, id, tinted }) {
  return (
    <section id={id} style={{
      padding: "clamp(48px, 6vw, 80px) 24px",
      background: tinted ? C.gray50 : "transparent",
      borderTop: tinted ? `1px solid ${T.border}` : 0,
    }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 28 }}>
        <div style={{ display: "grid", gap: 12, maxWidth: 720 }}>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, letterSpacing: "-0.01em",
            fontSize: "clamp(1.5rem, 3.2vw, 2rem)", lineHeight: 1.25, margin: 0,
          }}>
            {title}
          </h2>
          {lede && <p style={{ margin: 0, fontSize: TYPE.lg, lineHeight: 1.6, color: T.textSubtle }}>{lede}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

/* At BULK_MIN and past it, this is stock, not a calculator row — the
   same handoff SummaryPanel's BulkHandoff makes on the pricing side.
   Copy and layout follow a reference info banner Ana supplied (info
   icon inline with a plain question, one plain sentence, an
   underlined link with an external-open glyph — SellerLanding.jsx's
   own convention for a link that leaves the site) rather than
   BulkHandoff's uppercase-eyebrow treatment. Named and linked the way
   Sell v2, Instant Store v2 and the nav already do — Bulk Printing
   Services, blurb.com/large-order-services — and the CTA label matches
   Sell v2's own "Get a custom quote", not "Get a bulk quote". Sits
   under the speed rows as an addition, not a replacement — the quote
   still calculates fine at 100+, and hiding it would answer "what
   does this cost?" with a form instead of a number. */
function BulkBanner() {
  return (
    <div style={{
      background: C.blue50, borderRadius: R.md,
      padding: 20, display: "grid", gap: 6,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="ms" style={{ fontSize: 20, color: C.blue600 }}>info</span>
        <span style={{ fontSize: TYPE.base, fontWeight: 700, color: T.textNeutral }}>
          100 copies or more?
        </span>
      </div>
      <p style={{ margin: "0 0 0 28px", fontSize: TYPE.base, lineHeight: 1.6, color: T.textNeutral }}>
        Bulk Printing Services can help with planning and volume pricing.
      </p>
      <a
        href="https://www.blurb.com/large-order-services" target="_blank" rel="noopener noreferrer"
        style={{
          margin: "2px 0 0 28px", justifySelf: "start", fontSize: TYPE.base, fontWeight: 700, color: T.textBrand,
          display: "inline-flex", alignItems: "center", gap: 5,
          textDecoration: "underline", textUnderlineOffset: 4,
        }}
      >
        Get a custom quote
        <span className="ms" style={{ fontSize: 16 }}>open_in_new</span>
      </a>
    </div>
  );
}

/* One of the two places the calculation went. Deliberately a doorway and
   not a summary: a figure here would be a fourth place for the same
   number to disagree with itself. */
function Lane({ heading, body, action, onClick }) {
  return (
    <div style={{
      background: T.bgNeutral, border: `1px solid ${T.border}`, borderRadius: R.lg,
      padding: 24, display: "grid", gap: 10, alignContent: "start",
    }}>
      <span style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["4xl"], fontWeight: 500, lineHeight: 1.2 }}>
        {heading}
      </span>
      <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.65, color: T.textSubtle }}>{body}</p>
      <Button variant="outlined" onClick={onClick} style={{ justifySelf: "start", marginTop: 4 }}>
        {action}
      </Button>
    </div>
  );
}

export default function ShippingPage({ onGo, lean }) {
  const speeds = SHIPPING.speeds;
  /* The lean page keeps the calculator, so it needs a destination to
     price against. The recommended page has none: the calculating moved
     to the two pages that price a book. */
  const [ship, setShip] = React.useState({
    country: "US", postal: "", state: "California", speed: "economy", poBox: false,
  });
  const [format, setFormat] = React.useState("photo");
  const [qty, setQty] = React.useState(1);

  return (
    <div style={{ fontFamily: FONT_BODY, color: T.textNeutral }}>
      {/* The hero /pricing, /bookmaking-tools and the Sell page use. */}
      <section style={{
        background: "linear-gradient(100deg, #e9ecef 0%, #f6f3ef 45%, #ebebeb 100%)",
        padding: "clamp(56px, 8vw, 96px) 24px",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", display: "grid", gap: 20, justifyItems: "center" }}>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, letterSpacing: "-0.01em",
            fontSize: "clamp(2rem, 4.6vw, 2.75rem)", lineHeight: 1.2, margin: 0,
          }}>
            Shipping rates and delivery times
          </h1>
          <p style={{ fontSize: TYPE.xl, lineHeight: 1.55, margin: 0, maxWidth: 660 }}>
            Blurb ships to {SHIPPING.countries.length} countries and territories. Printing and binding take
            4 to 5 business days, then your order ships.
          </p>
        </div>
      </section>

      {/* ── The postcode calculator, in the LEAN scope only ──
          This is the heavier calculator: postcode, quantity and an exact
          arrival date, the same one /getting-started uses. The recommended
          scope below (product + country, no postcode, a day range instead
          of a date) is the lighter version that replaced it on 2026-08-27
          and was brought back on 2026-09-01 — this block stays lean-only
          so the two don't stack. */}
      {lean && (
        <section style={{ padding: "clamp(40px, 6vw, 72px) 24px 0" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <ShippingSection selling={false} ship={ship} setShip={setShip} qty={1} price={0} />
          </div>
        </section>
      )}

      {/* ── What it costs, for the book and the country you pick ──
          Was a static region-by-speed table; now a product and a country
          choose the row, so what's on screen is a real quote rather than
          a grid to scan. Still no postcode, because the print time
          doesn't change with it — only the country does.

          CALENDAR DATE ADDED BACK 2026-09-10 (Ana: "i'd like the
          shipping calculator to work by giving you an ETA too, so it
          works for people ordering for themselves. can we somehow show
          both things, a date range and an estimated arrival date (as a
          range too) if ordered today?"): this page had dropped the
          calendar date entirely on the grounds that it doesn't know
          when the order is placed — true for a browsing visitor, but
          not for someone here today deciding whether to order right
          now, who has exactly the one order date this page can assume:
          today. `arrivalWindow` (catalog.js) already does this
          calculation for ShippingSection.jsx's own postcode calculator;
          reused here with "if ordered today" stated in the label so the
          assumption is never silent. The business-day range stays
          rather than being replaced — that's the shape Ana asked for
          (both things), and it's also the number that still holds for
          a visitor who isn't ordering today.

          First pass gave the two facts their own columns (label,
          business-days, arrival date, price) — four columns fighting
          for the same row read as clutter (Ana: "it looks a mess").
          Collapsed to three: the business-day count folds into the
          "Arrives" caption as one sentence ("Arrives in 11-15 business
          days, if ordered today") sitting above the bold calendar date,
          the same subtle-label/bold-value shape ShippingSection.jsx's
          own "Arrives" block already uses — one fact stated, then the
          other explained in terms of it, instead of two facts
          competing side by side. */}
      <Section title="What it costs, wherever it's going">
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <Select
            label="Product"
            options={FORMAT_CARDS.map(f => ({ value: f.id, label: f.title }))}
            value={format}
            onValueChange={setFormat}
          />
          <Select
            label="Going to"
            options={SHIPPING.countries.map(c => ({ value: c.id, label: c.label }))}
            value={ship.country}
            onValueChange={v => setShip({ ...ship, country: v })}
          />
          <Select
            label="Quantity"
            options={QUANTITIES.map(n => ({
              value: String(n),
              label: n >= BULK_MIN ? `${n}+ copies` : `${n} ${n === 1 ? "copy" : "copies"}`,
            }))}
            value={String(qty)}
            onValueChange={v => setQty(Number(v))}
          />
        </div>

        <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>
          The date ranges below include {PRINT_RANGE[0]}–{PRINT_RANGE[1]} days of production time.
        </span>

        <div style={{ display: "grid", gap: 10 }}>
          {speeds.map(s => {
            const quote = shippingFor(ship.country, s.id, qty);
            const w = arrivalWindow(s);
            return (
              <div key={s.id} style={{
                background: "#fff", border: `1px solid ${C.charcoal200}`, borderRadius: R.md,
                padding: 16, display: "grid", gap: 10, alignItems: "center",
                gridTemplateColumns: "minmax(0,1fr) auto auto",
              }}>
                <span style={{ fontSize: TYPE.lg, fontWeight: 700 }}>{s.label}</span>
                <span style={{ display: "grid", gap: 2, justifyItems: "end", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>
                    Arrives in {s.days[0] + PRINT_RANGE[0]}–{s.days[1] + PRINT_RANGE[1]} business days, if ordered today
                  </span>
                  <span style={{ fontSize: TYPE.base, fontWeight: 700 }}>
                    {formatDay(w.earliest)} – {formatDay(w.latest)}
                  </span>
                </span>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 700, whiteSpace: "nowrap" }}>
                  {quote ? money(quote.cost) : "—"}
                </span>
              </div>
            );
          })}
        </div>

        {qty >= BULK_MIN && <BulkBanner />}
      </Section>

      {/* ── Where the calculating went ──
          This page used to be the calculator. Saying so plainly is the
          whole job of this section: two doors, named by which person is
          asking, and no figures on either. */}
      <Section
        title="Get an exact price and date"
        lede="This page can only show a range. For a real book and a real delivery date, use one of the calculators below."
        tinted
      >
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          <Lane
            heading="Ordering copies?"
            body="Price your book, add your postcode, and you'll see every speed with its cost and the day it would arrive, side by side. Choose a date, not a number of business days. Delivery joins your total."
            action="Open the pricing calculator"
            onClick={() => onGo("pricing")}
          />
          <Lane
            heading="Selling your book?"
            body="Your buyer pays the delivery, so it never comes out of your cost, your price or your profit. The Instant Store profit calculator can show you what a buyer would see at checkout, right beside your margin without ever touching it."
            action="Open the profit calculator"
            onClick={() => onGo("margin")}
          />
        </div>
      </Section>

      {/* ── The one change the lean scope makes here ──
          After the page's own content, as on the catalogue and the price
          list: someone reading about delivery is working out what an order
          costs, and selling is the second question. */}
      <section style={{ padding: "clamp(40px, 6vw, 72px) 24px 0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <InstantStoreLane
            title="Selling your book? We ship to your buyers"
            isNew
            onGo={() => onGo?.("instantstore")}
          >
            An Instant Store is one link you share, and every order is printed and posted to the buyer for
            you, wherever they are. They pay the delivery, so it never comes out of what you earn.
          </InstantStoreLane>
        </div>
      </section>

      {/* FOLDED IN 2026-09-10 — the standalone "What can change your
          date" section used to sit above this (four static caveats,
          same headline+body shape as a benefit grid). Ana: "i don't get
          the What can change your date section, like it's an FAQ rather
          than like a benefit... yes remove and Fold it into the Faq
          accordion below." Two of its four facts (P.O. Box, crossing a
          border) were already near-duplicates of existing questions
          here and were dropped rather than repeated; the other two
          (weekends/holidays, ordering in volume) became new questions
          below. The volume one also picked up "Large Order Services" ->
          "Bulk Printing Services" and a real link while it was being
          rewritten, matching the name and destination this same page's
          own 100+-copies banner already uses. */}
      <Faq
        heading={<>Have a question?<br />Here are answers.</>}
        items={[
          ["Who pays for shipping when I sell a book?",
           <p style={{ margin: 0 }}>
             Your buyer does, at checkout, on top of the price you set. It never comes out of your margin,
             which is why you earn the same whether they're across town or across the world.
           </p>],
          ["How long does it take to print a book?",
           <p style={{ margin: 0 }}>
             Printing and binding take 4 to 5 business days, and that happens before your order ships. It is
             the same however fast the delivery you choose.
           </p>],
          ["Can I expedite my order?",
           <p style={{ margin: 0 }}>
             You can choose a faster delivery, but not faster printing. Express moves your book once it is
             made; it does not make it any sooner.
           </p>],
          ["Do weekends or holidays affect my delivery?",
           <p style={{ margin: 0 }}>
             Every figure on this page counts business days, for the printing and for the journey. A
             weekend or a holiday adds a day to the count either way.
           </p>],
          ["Ship books to multiple addresses",
           <p style={{ margin: 0 }}>
             Copies ordered together are printed and sent together to one address, and cost less than the
             same copies sent one at a time. For more than one destination, place an order for each.
           </p>],
          ["Can it go to a P.O. Box?",
           <p style={{ margin: 0 }}>
             Economy and Standard can. Express can't, because couriers don't deliver to a P.O. Box, so you
             won't be offered it once we know that's where your book is going.
           </p>],
          ["Duties, taxes or import fees",
           <p style={{ margin: 0 }}>
             You might, on anything crossing a border. Duty is set by the destination country and paid by
             whoever receives the parcel, so it isn't part of the delivery cost we quote.
           </p>],
          ["What if I'm ordering 100 copies or more?",
           <p style={{ margin: 0 }}>
             Bulk Printing Services quotes the run and the delivery together, so the figures on this page
             aren't the ones to use.{" "}
             <a
               href="https://www.blurb.com/large-order-services" target="_blank" rel="noopener noreferrer"
               style={{ color: C.blue600, textDecoration: "underline" }}
             >
               Get a custom quote
             </a>{" "}
             instead.
           </p>],
          ["Where does Blurb ship?",
           <p style={{ margin: 0 }}>
             {SHIPPING.countries.length} countries and territories. Your book is printed at the facility
             closest to where it's headed, so it travels the shortest way it can.
           </p>],
        ]}
      />
    </div>
  );
}
