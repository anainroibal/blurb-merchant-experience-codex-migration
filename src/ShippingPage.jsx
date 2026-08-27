import React from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import Faq from "./Faq.jsx";
import ShippingSection from "./ShippingSection.jsx";
import InstantStoreLane from "./InstantStoreLane.jsx";
import { SHIPPING, PRINT_DAYS, PRINT_RANGE, shippingFor, speedDays, money } from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   /shipping — informational, not a calculator.

   DECIDED 2026-08-27 (Anain), answering Ana's question on DES-482 and
   agreeing with Crometrics' direction: the calculating moved to where
   the book is being priced. A maker gets a postcode, dated speeds and a
   total on /getting-started and the pricing calculator; a seller gets
   what their buyer pays inside the profit calculator, beside the margin
   without entering it. What is left for this page is what neither of
   those can hold: how long it takes, what it costs where, and what
   moves a date.

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

/* The four zones the rate table bands by, named as a reader would name
   them rather than by the ids the data uses. One country stands for each
   so the figures come from `shippingFor` and not from a second copy of
   the rate card. */
const ZONES = [
  ["United States", "US"],
  ["Canada, Mexico and the Caribbean", "CA"],
  ["Europe", "DE"],
  ["Rest of the world", "AU"],
];

const ROW_BG = i => (i % 2 === 0 ? "#fff" : C.gray50);

const cellBase = {
  padding: 16, fontSize: TYPE.base, lineHeight: 1.4,
  color: C.gray950, textAlign: "left", verticalAlign: "top", background: "inherit",
};
const labelCell = { ...cellBase, fontWeight: 700, width: 260, minWidth: 180 };
const stickyCell = { position: "sticky", left: 0, zIndex: 1, boxShadow: `inset -1px 0 0 0 ${C.charcoal200}` };
const lastCol = (i, n) => (i === n - 1 ? { borderRight: 0 } : null);
const dataCell = { ...cellBase, minWidth: 180, borderRight: `1px solid ${C.charcoal200}`, scrollSnapAlign: "end" };

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
      <button
        onClick={onClick}
        style={{
          justifySelf: "start", marginTop: 4, font: "inherit", fontSize: TYPE.base, fontWeight: 600,
          minHeight: 44, padding: "0 18px", borderRadius: R.md, cursor: "pointer",
          background: "transparent", color: T.textBrand, border: `1px solid ${T.borderBrand}`,
        }}
      >
        {action}
      </button>
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

      {/* ── The calculator, in the LEAN scope only ──
          Minimum effort means this page is not rebuilt: it keeps the
          shipping calculator it has today, and the one change is the
          Instant Store lane at the foot of it (Anain, 2026-08-27). The
          recommended scope takes the calculator out, because by then both
          the pricing calculator and the profit calculator price delivery
          where the book is — and a third copy of the same sum is a third
          place for it to disagree. */}
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
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {speeds.map(s => (
            <div key={s.id} style={{
              background: T.bgNeutral, border: `1px solid ${T.border}`, borderRadius: R.lg,
              padding: 20, display: "grid", gap: 6,
            }}>
              <span style={{ fontSize: TYPE.lg, fontWeight: 700 }}>{s.label}</span>
              <span style={{ fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.5 }}>
                {speedDays(s)} once it's on its way
              </span>
              <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>
                Add {PRINT_RANGE[0]}–{PRINT_RANGE[1]} days to print it, so {s.days[0] + PRINT_RANGE[0]}–
                {s.days[1] + PRINT_RANGE[1]} days from order to doorstep
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
          Printing takes {PRINT_DAYS.label}. All the figures here are business days, so weekends don't count.
        </p>
      </Section>

      {/* ── The rate table ──
          The one thing worth keeping from Crometrics' proposal: a region
          by speed grid. Built like the comparison table on the Sell page,
          which is the site's own pattern for reading one fact across
          several columns. Priced for a single copy, because that is the
          unit a reader can scale in their head. */}
      <Section
        title="What it costs, wherever it's going"
        lede="For a single copy to a home address. Order more than one and they travel together, which costs less than sending them one at a time."
        tinted
      >
        <div style={{
          overflowX: "auto", scrollSnapType: "x proximity",
          border: `1px solid ${C.charcoal200}`, borderRadius: R.md, background: "#fff",
        }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 260 + speeds.length * 180 }}>
            <tbody>
              <tr style={{ background: ROW_BG(0), borderBottom: `1px solid ${C.charcoal200}` }}>
                <th style={{ ...labelCell, ...stickyCell }}>Going to</th>
                {speeds.map((s, i) => (
                  <th key={s.id} style={{ ...dataCell, ...lastCol(i, speeds.length), fontWeight: 700 }}>
                    {s.label}
                    <span style={{ display: "block", marginTop: 6, fontSize: TYPE.sm, color: T.textSubtle, fontWeight: 400 }}>
                      {speedDays(s)}
                    </span>
                  </th>
                ))}
              </tr>

              {ZONES.map(([label, id], row) => (
                <tr key={id} style={{ background: ROW_BG(row + 1), borderBottom: row === ZONES.length - 1 ? 0 : `1px solid ${C.charcoal200}` }}>
                  <th style={{ ...labelCell, ...stickyCell }}>{label}</th>
                  {speeds.map((s, i) => {
                    const quote = shippingFor(id, s.id, 1);
                    return (
                      <td key={s.id} style={{ ...dataCell, ...lastCol(i, speeds.length) }}>
                        {quote ? money(quote.cost) : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.55 }}>
          We deliver to {SHIPPING.countries.length} countries and territories. The rates on this page are
          placeholders: Blurb publishes no shipping prices, so read the shape as real and the figures as an
          illustration.
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
