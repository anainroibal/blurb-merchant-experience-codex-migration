import React from "react";
import { Button, Select } from "@blurb/codex-react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import Faq from "./Faq.jsx";
import ShippingSection from "./ShippingSection.jsx";
import InstantStoreLane from "./InstantStoreLane.jsx";
import { FORMAT_CARDS } from "./FormatCards.jsx";
import { SHIPPING, PRINT_DAYS, PRINT_RANGE, shippingFor, speedDays, money } from "./catalog.js";

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
   Sell page: the "Good Things on the Way" heading, the line about
   printing and binding, the how-it-works sentences and the FAQ's own
   question wording are blurb.com/shipping's, not ours. What we add is
   what the live page cannot say now that it no longer calculates: which
   of the two calculators to open, and the fact that a seller's buyer
   pays the delivery.

   One correction rather than a copy: the live page says "over 70
   countries and territories" above a list of 67. We print the count the
   list actually holds.

   Every rate here is a placeholder: Blurb publishes no shipping prices.
   The destinations and the print time are real, from blurb.com.
   ──────────────────────────────────────────────────────────────── */

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
            Good things on the way
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

      {/* ── Print time first, because it is the part nobody counts ── */}
      <Section
        title="How it works"
        lede="Once you've uploaded and ordered your custom project, the printing process begins right away. Printing and binding requires 4 to 5 business days, and expedited printing is not available. You choose your delivery speed when placing your order."
      >
        <p style={{ margin: 0, fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.55 }}>
          Printing takes {PRINT_DAYS.label} for every order — the same whichever speed you choose below.
        </p>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {speeds.map(s => (
            <div key={s.id} style={{
              background: T.bgNeutral, border: `1px solid ${T.border}`, borderRadius: R.lg,
              padding: 20, display: "grid", gap: 6,
            }}>
              <span style={{ fontSize: TYPE.lg, fontWeight: 700 }}>{s.label}</span>
              <span style={{ fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.5 }}>
                {speedDays(s)} once it ships — {s.days[0] + PRINT_RANGE[0]}–{s.days[1] + PRINT_RANGE[1]} days total
              </span>
              {!s.poBox && (
                <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>
                  Not available to a P.O. Box, as couriers don't deliver to one.
                </span>
              )}
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.55 }}>
          All the figures here are business days, so weekends don't count.
        </p>
      </Section>

      {/* ── What it costs, for the book and the country you pick ──
          Was a static region-by-speed table; now a product and a country
          choose the row, so what's on screen is a real quote rather than
          a grid to scan. No postcode, because the print time doesn't
          change with it — only the country does — and no calendar date,
          because this page doesn't know when the order is placed.
          A range in business days is what it can honestly say. */}
      <Section
        title="What it costs, wherever it's going"
        lede="Pick a product and a country to see delivery priced and timed for a single copy. Order more than one and they travel together, which costs less than sending them one at a time."
        tinted
      >
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
        </div>

        <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>
          Printing takes {PRINT_RANGE[0]}–{PRINT_RANGE[1]} days, whichever speed you choose below — then:
        </span>

        <div style={{ display: "grid", gap: 10 }}>
          {speeds.map(s => {
            const quote = shippingFor(ship.country, s.id, 1);
            return (
              <div key={s.id} style={{
                background: "#fff", border: `1px solid ${C.charcoal200}`, borderRadius: R.md,
                padding: 16, display: "grid", gap: 10, alignItems: "center",
                gridTemplateColumns: "minmax(0,1fr) auto auto",
              }}>
                <span style={{ fontSize: TYPE.lg, fontWeight: 700 }}>{s.label}</span>
                <span style={{ fontSize: TYPE.base, color: T.textSubtle, whiteSpace: "nowrap" }}>
                  {s.days[0] + PRINT_RANGE[0]}–{s.days[1] + PRINT_RANGE[1]} business days
                </span>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 700, whiteSpace: "nowrap" }}>
                  {quote ? money(quote.cost) : "—"}
                </span>
              </div>
            );
          })}
        </div>

        <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.55 }}>
          We deliver to {SHIPPING.countries.length} countries and territories. The rates on this page are
          placeholders: Blurb publishes no shipping prices, so read the shape as real and the figures as an
          illustration. For a calendar date rather than a range, price the book itself — that's where the
          order date joins in.
        </p>
      </Section>

      {/* ── The honest caveats, in one place ── */}
      <Section title="What can change your date">
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {[
            ["Sending to a P.O. Box", "Economy and Standard both deliver to a P.O. Box. Express doesn't, so we take it off the list rather than let you choose it and turn it down later."],
            ["Crossing a border", "Anything going overseas can be held for inspection, and any duty is paid by whoever receives it. Neither is counted in the days above."],
            ["Weekends and holidays", "Every figure on this page counts business days, for the printing and for the journey."],
            ["Ordering in volume", "For a hundred copies or more, Large Order Services quotes the run and the delivery together, so this table isn't the one to read."],
          ].map(([h, b]) => (
            <div key={h} style={{ display: "grid", gap: 6, alignContent: "start" }}>
              <span style={{ fontSize: TYPE.lg, fontWeight: 700 }}>{h}</span>
              <span style={{ fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.65 }}>{b}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Where the calculating went ──
          This page used to be the calculator. Saying so plainly is the
          whole job of this section: two doors, named by which person is
          asking, and no figures on either. */}
      <Section
        title="See it for your own book"
        lede="Delivery is priced against a real book going to a real place, so you'll find it where the book is."
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
