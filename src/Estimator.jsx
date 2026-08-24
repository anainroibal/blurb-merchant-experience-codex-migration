import React, { useState } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";
import SummaryPanel from "./SummaryPanel.jsx";
import ProductOptions from "./ProductOptions.jsx";
import CreateActions from "./CreateActions.jsx";
import {
  CATALOG, PROJECT_KINDS, fromPrice, sizeCount,
  seedFor, priceFor, sellerCost, minSellPrice, defaultSelection,
  availableFor, reconcile, pageLimit, derivedSteps, money,
  SHIPPING, US_STATES, shippingFor, speedDays, arrivalWindow, formatDay, PRINT_RANGE,
} from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   Two calculators, not one.

   They answer different questions and the answers barely overlap:

     MAKE — "what will this cost me?"  One total, copies included,
            shipping in it, no margin anywhere. This is what
            blurb.com/pricing already does.
     SELL — "what would I keep?"       Cost, price, profit, and the
            channel that changes all three.

   Splitting them is what lets each one lead with the right control.
   A maker wants SIZES AND FORMATS immediately — asking "what kind of
   book are you writing?" before showing a price is an obstacle when
   the person already knows they want an 8×10 hardback. A seller is
   better served by the project kind, because the recommendation is
   most of the value there.

   So the kind picker is not gone from the maker's side; it is behind
   "Help me decide", for the person who wants it. Ask what someone is
   doing, never who they are — and never make them answer a question
   they did not need.

   Landing in the wrong one is expected, so each says what the other
   is for and hands over without losing the specification.
   ──────────────────────────────────────────────────────────────── */

const MODES = {
  make: {
    id: "make",
    tab: "Pricing calculator",
    sub: "What it costs to make",
    h1: "Compare products & pricing",
    lede: "Whatever your vision or budget, we have a format that fits.",
    cta: "Estimate cost",
    other: "sell",
    swap: "Looking to sell, and want to see what it would earn you?",
    swapBody: "The margin estimator shows what a copy costs you, what to charge, and what you keep through each route to market.",
  },
  sell: {
    id: "sell",
    tab: "Margin estimator",
    sub: "What you'd earn selling it",
    h1: "Compare what you would keep",
    lede: "Whatever you charge, see what a copy costs you and what is left after each route to market.",
    cta: "Estimate your margin",
    other: "make",
    swap: "Just making it for yourself?",
    swapBody: "The pricing calculator gives you the price, your copies, and when it would arrive — no margin, nothing to set up.",
  },
};

/* ── The format cards, as /pricing opens with them ──
   "Select a format to see size and paper options" — products first, then
   the controls that price one. Same principle the rest of the prototype
   runs on: a maker who already knows they want an 8×10 hardback must not
   be asked what kind of book they are writing first.

   Everything here except the numbers is the live page's, read out of the
   PricingTableSection island's own props rather than retyped: the heading,
   the subheading, the descriptions, the badge text, the alt text, and the
   product photographs themselves, served from assets.blurb.com.

   THE NUMBERS ARE STILL COMPUTED. sizeCount() and fromPrice() keep the
   "3 sizes — from US $2.99" line honest against the matrix, where the live
   page types $3.99 for the same book, $12.00 for notebooks the matrix
   prices at $14.67, and $65.00 for wall art that starts at $10.11. Same
   sentence shape, same position, real figures — the gap is ticket T7 and
   showing it is the point. Swap `fromPrice(id)` for `card.price` if the
   live strings are ever wanted verbatim.

   PDFs are absent because /pricing does not offer one. They are still in
   the catalogue, and still priced, for the pages that do. */
const IMG = "https://assets.blurb.com/_astro/";

const FORMAT_CARDS = [
  { id: "photo", title: "Photo Book", badge: "Most Popular",
    desc: "Premium books made for visual storytelling.",
    img: IMG + "photo-book.GsE6vVn8.png",
    alt: "Stack of two ImageWrap hardcover photo books with a scene of Paris on the front cover." },
  { id: "trade", title: "Paperback & Hardcover Books", badge: "Budget-friendly",
    desc: "Ideal for projects that pair text and imagery.",
    img: IMG + "trade-book.XYVh8a5K.png",
    alt: "Imagewrap hardcover book with colorful fruit and vegetable photography on dark background cover." },
  { id: "magazine", title: "Magazine",
    desc: "Great for serial content or volume printing. Think lookbooks and zines.",
    img: IMG + "magazines.DBPIwly6.png",
    alt: "Stack of pink design magazines titled ‘Tonal’ featuring colorful ceramic bowls and pottery on cover." },
  { id: "notebook", title: "Notebooks & Journals",
    desc: "Blank, lined, dotted or grid pages made for sketching, planning, and day-dreaming.",
    img: IMG + "notebooks-and-journals.BGE8TXbz.png",
    alt: "Dark green ImageWrap hardcover notebook with yellow 'Today is the Day' text on cover." },
  { id: "wallart", title: "Wall Art",
    desc: "Gallery-quality wall décor, featuring your favorite photos or custom designs.",
    img: IMG + "wall-art.BcVC7rDx.png",
    alt: "Three examples of wall art featuring landscape imagery of mountains, and waterways" },
];

function FormatCards({ formatId, onPick }) {
  return (
    <div style={{ display: "grid", gap: 28 }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 600, letterSpacing: "-0.01em",
          fontSize: "clamp(1.5rem, 3.2vw, 2rem)", lineHeight: 1.25, margin: 0,
        }}>
          Select a format to see size and paper options
        </h2>
        <p style={{ margin: "12px 0 0", fontSize: TYPE.base, color: T.textNeutral }}>
          Save more when you print in bulk. Learn about{" "}
          <span style={{ color: T.textBrand, textDecoration: "underline" }}>volume discounts</span>.
        </p>
      </div>

      <div style={{ display: "grid", gap: 28, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", alignItems: "start" }}>
        {FORMAT_CARDS.map(card => {
          const on = card.id === formatId;
          const from = fromPrice(card.id);
          const count = sizeCount(card.id);
          return (
            <button
              key={card.id}
              onClick={() => onPick(card.id)}
              aria-pressed={on}
              style={{
                /* No frame unless it is chosen. The border is transparent
                   rather than absent so selecting one cannot shift the row
                   by two pixels. The image runs to the card's edges and the
                   card clips it, which is what gives the rounded top; only
                   the text below is inset. */
                textAlign: "left", font: "inherit", cursor: "pointer", minWidth: 0,
                background: "transparent", padding: 0, overflow: "hidden",
                borderRadius: 10,
                border: on ? `2px solid ${C.gray950}` : "2px solid transparent",
                display: "block",
                transition: "border-color var(--nav-hover) var(--nav-ease)",
              }}
            >
              <span style={{ position: "relative", display: "block" }}>
                <img
                  src={card.img}
                  alt={card.alt}
                  width={700}
                  height={700}
                  loading="lazy"
                  style={{ display: "block", width: "100%", height: "auto" }}
                />
                {card.badge && (
                  <span style={{
                    position: "absolute", top: 12, left: 12, background: "#fff",
                    borderRadius: 4, padding: "4px 10px",
                    fontSize: TYPE.sm, fontWeight: 600, color: C.gray950,
                  }}>
                    {card.badge}
                  </span>
                )}
              </span>

              <span style={{ display: "block", padding: "18px 12px 20px" }}>
                <span style={{
                  display: "block", fontFamily: FONT_DISPLAY,
                  fontSize: TYPE["3xl"], fontWeight: 600, lineHeight: 1.2, color: C.gray950,
                }}>
                  {card.title}
                </span>
                <span style={{
                  display: "block", marginTop: 10, fontSize: TYPE.sm,
                  color: T.textSubtle, lineHeight: 1.5,
                }}>
                  {card.desc}
                </span>
                <span style={{
                  display: "block", marginTop: 12, fontSize: TYPE.sm, fontWeight: 700, color: C.gray950,
                }}>
                  {count} {count === 1 ? "size" : "sizes"} - {from == null ? "price on request" : `From ${money(from)}`}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const control = {
  height: 40, width: "100%", minWidth: 0,
  border: `1px solid ${T.borderStrong}`, borderRadius: 4, background: T.bgNeutral,
  padding: "0 10px", fontFamily: FONT_BODY, fontSize: TYPE.base, color: T.textNeutral,
};

function Field({ label, hint, children }) {
  return (
    <label style={{ display: "grid", gap: 6, minWidth: 0 }}>
      <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>
          {label}
        </span>
        {hint && <span style={{ fontSize: TYPE.sm, color: T.textSubtle, whiteSpace: "nowrap" }}>{hint}</span>}
      </span>
      {children}
    </label>
  );
}

/* The kind picker, offered rather than imposed. */
function HelpMeDecide({ open, onToggle, kindId, onKind, why }) {
  return (
    <div style={{
      background: C.blue50, border: `1px solid ${C.blue100}`, borderRadius: R.md,
      padding: open ? 18 : "12px 18px", display: "grid", gap: 12,
    }}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
          background: "transparent", border: 0, padding: 0, width: "100%",
          fontFamily: FONT_BODY, textAlign: "left", color: C.blue950,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span className="ms" style={{ fontSize: 20 }}>lightbulb</span>
          <span style={{ fontSize: TYPE.base, fontWeight: 700 }}>
            Not sure which product? Tell us what you're making
          </span>
        </span>
        <span className="ms turn" style={{ fontSize: 22, transform: open ? "rotate(180deg)" : "none" }}>
          expand_more
        </span>
      </button>

      {open && (
        <div className="fade-in" style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
            <Field label="I'm making a">
              <select style={control} value={kindId ?? ""} onChange={e => onKind(e.target.value || null)}>
                <option value="">—</option>
                {PROJECT_KINDS.map(k => <option key={k.id} value={k.id}>{k.label}</option>)}
              </select>
            </Field>
          </div>
          {why && (
            <p style={{ margin: 0, fontSize: TYPE.sm, lineHeight: 1.6, color: T.textNeutral }}>{why}</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Two destinations, two questions ──
   The maker is receiving the box, so the calculator asks precisely where
   — a ZIP or postcode — and puts the shipping in the total, because it
   is money they will actually pay.

   The seller is not receiving anything. Their buyers are many and
   everywhere, so a street-level destination is meaningless; what they
   need is an illustration of what a buyer SOMEWHERE pays, kept firmly
   outside the margin. Country, then. The state is there because a seller
   pictures people, not parcels — it changes who the sentence is about.
   It does not change the rate, and the panel says so rather than
   implying a precision the placeholder data does not have. */
function ShipTo({ selling, shipping, ship, setShip }) {
  const country = SHIPPING.countries.find(c => c.id === ship.country);
  return (
    <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
      <Field label={selling ? "Your buyer is in" : "Ship to"}>
        <select
          style={control}
          value={ship.country}
          onChange={e => setShip({ ...ship, country: e.target.value, postal: "", state: "California" })}
        >
          {SHIPPING.countries.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </Field>

      {selling ? (
        ship.country === "US" && (
          <Field label="State" hint="tax varies">
            <select style={control} value={ship.state} onChange={e => setShip({ ...ship, state: e.target.value })}>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        )
      ) : (
        <Field label={country?.postal ?? "Postal code"}>
          <input
            style={control}
            value={ship.postal}
            placeholder={country?.example}
            onChange={e => setShip({ ...ship, postal: e.target.value })}
          />
        </Field>
      )}

      {!shipping && (
        <Field label="Speed">
          <select style={control} value={ship.speed} onChange={e => setShip({ ...ship, speed: e.target.value })}>
            {SHIPPING.speeds.map(s => <option key={s.id} value={s.id}>{s.label} — {speedDays(s)}</option>)}
          </select>
        </Field>
      )}

      {shipping && (
        /* A real constraint, and the reason express can vanish below. */
        <Field label="Delivery point">
          <label style={{ ...control, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={ship.poBox}
              onChange={e => setShip({ ...ship, poBox: e.target.checked })}
            />
            <span style={{ fontSize: TYPE.base }}>This is a P.O. Box</span>
          </label>
        </Field>
      )}
    </div>
  );
}

/* ── The shipping answer: dates, not day-counts ──
   The live /shipping page tells you printing takes "4-5 business days"
   in a paragraph, then quotes speeds in more business days, and leaves
   the arithmetic — and the weekends — to you. Nobody plans around
   "7–10 business days"; they plan around whether it arrives before the
   wedding. So every speed is priced AND dated, side by side, and the
   print time is shown as the leading segment it actually is.

   Express disappears for a P.O. Box rather than being quoted and
   refused later, because couriers do not deliver to one. */
function DeliveryTable({ qty, country, poBox, chosen, onChoose }) {
  const speeds = SHIPPING.speeds.filter(s => !poBox || s.poBox);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {speeds.map(s => {
        const quote = shippingFor(country, s.id, qty);
        const w = arrivalWindow(s);
        const on = chosen === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onChoose(s.id)}
            aria-pressed={on}
            className="card-move"
            style={{
              textAlign: "left", width: "100%", padding: 16, borderRadius: R.md,
              background: T.bgNeutral,
              border: on ? `2px solid ${T.borderBrand}` : `1px solid ${T.border}`,
              margin: on ? 0 : 1,
              display: "grid", gap: 10, alignItems: "center",
              gridTemplateColumns: "minmax(0,1fr) auto auto", fontFamily: FONT_BODY,
            }}
          >
            <span style={{ display: "grid", gap: 2, minWidth: 0 }}>
              <span style={{ fontSize: TYPE.lg, fontWeight: 700, color: on ? C.blue950 : T.textNeutral }}>
                {s.label}
              </span>
              <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>
                {PRINT_RANGE[0]}–{PRINT_RANGE[1]} days printing, then {speedDays(s)}
              </span>
            </span>

            <span style={{ display: "grid", gap: 2, justifyItems: "end", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>Arrives</span>
              <span style={{ fontSize: TYPE.base, fontWeight: 700 }}>
                {formatDay(w.earliest)} – {formatDay(w.latest)}
              </span>
            </span>

            <span style={{
              fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 700,
              color: on ? C.blue600 : T.textNeutral, whiteSpace: "nowrap", paddingLeft: 8,
            }}>
              {quote ? money(quote.cost) : "—"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Rung({ label, value, loud }) {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <span style={{
        fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
        color: loud ? C.blue600 : T.textSubtle,
      }}>{label}</span>
      <span style={{
        fontFamily: FONT_DISPLAY, fontWeight: 700, lineHeight: 1,
        fontSize: loud ? TYPE["7xl"] : TYPE["4xl"],
        color: loud ? C.blue600 : T.textNeutral,
      }}>{value}</span>
    </div>
  );
}

/* `seed` is a specification handed over by another screen — a product page
   sending a seller here to see what this exact book leaves them. Arriving
   with the book already configured is the whole value of the handover: the
   alternative is asking someone who was just looking at an 8×10 ImageWrap
   to describe it again. */
export default function Estimator({ mode = "make", onGo, seed = null }) {

  const [formatId, setFormatId] = useState(seed?.formatId ?? "photo");
  const [state, setState] = useState(() =>
    seed ? { ...defaultSelection(seed.formatId), ...seed.sel } : defaultSelection("photo"));
  const [price, setPrice] = useState(24);
  const [kindId, setKindId] = useState(null);
  const [why, setWhy] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  /* Shipping lives in a modal on the selling side. See the note beside the
     link that opens it. */
  const [buyerOpen, setBuyerOpen] = useState(false);
  const [ship, setShip] = useState({ country: "US", postal: "", state: "California", speed: "economy", poBox: false });

  const m = MODES[mode];
  const selling = mode === "sell";
  const f = CATALOG[formatId];

  const p = priceFor(formatId, state);
  const cost = sellerCost(formatId, state);
  const floor = minSellPrice(formatId, state);
  const shown = Math.max(price, floor);
  const profit = Math.max(0, shown - cost);
  const margin = shown > 0 ? Math.round((profit / shown) * 100) : 0;
  const limit = pageLimit(formatId, state);

  /* The maker's quote waits for a postal code, because it is a real
     delivery. The seller's is an illustration, so a country is enough
     and it is always shown — and it is priced for ONE copy, since that
     is what a buyer orders. */
  const hasDestination = ship.postal.trim().length > 1;
  const makerShip = hasDestination
    ? shippingFor(ship.country, ship.speed, state.qty)
    : null;
  const buyerShip = shippingFor(ship.country, ship.speed, 1);
  /* The shipping calculator prices every speed at once, so it needs no
     single quote — the table does the work. */
  const shipSpeed = SHIPPING.speeds.find(s => s.id === ship.speed);

  const changeFormat = id => {
    setFormatId(id);
    setState(defaultSelection(id));
    setKindId(null);
    setWhy(null);
  };

  /* The kind seeds a whole specification, exactly as it does on
     /getting-started — same function, so the two can never disagree. */
  const changeKind = id => {
    setKindId(id);
    if (!id) { setWhy(null); return; }
    const seed = seedFor(id, selling ? "sell" : "keep");
    setFormatId(seed.formatId);
    setState(seed.sel);
    setWhy([seed.why, seed.note].filter(Boolean).join(" "));
    const nextFloor = minSellPrice(seed.formatId, seed.sel);
    setPrice(Math.max(nextFloor, Math.round(nextFloor * 2.4 * 2) / 2));
  };

  return (
    <div style={{ fontFamily: FONT_BODY, color: T.textNeutral }}>

      {/* ── The hero, as /pricing has it ──
          A banded intro over a soft gradient: heading, one line, and a
          single filled button. Both calculators use it — the pattern is the
          page's, the words are the mode's. The button jumps to the
          calculator rather than opening a modal, because here the
          calculator is the page rather than something layered over it. */}
      <section style={{
        background: "linear-gradient(100deg, #e9ecef 0%, #f6f3ef 45%, #ebebeb 100%)",
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{
          maxWidth: 900, margin: "0 auto", padding: "clamp(48px, 7vw, 88px) 20px",
          textAlign: "center",
        }}>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, letterSpacing: "-0.01em",
            fontSize: "clamp(2rem, 4.6vw, 2.75rem)", lineHeight: 1.16, margin: 0, color: C.gray950,
          }}>
            {m.h1}
          </h1>
          <p style={{ fontSize: TYPE.base, color: C.gray950, lineHeight: 1.6, margin: "14px auto 0", maxWidth: 640 }}>
            {m.lede}
          </p>
          <button
            onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            style={{
              marginTop: 28, height: 44, padding: "0 22px", borderRadius: R.md, border: 0,
              background: C.blue600, color: "#fff", cursor: "pointer",
              fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 600,
            }}
          >
            {m.cta}
          </button>
        </div>
      </section>

      <section style={{ padding: "24px 16px 72px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gap: 18 }}>

          {/* ── Formats first, then the controls that price one ── */}
          <span id="calculator" aria-hidden style={{ display: "block", scrollMarginTop: 90 }} />
          <FormatCards formatId={formatId} onPick={changeFormat} />

          {/* ── The get-started layout: choices on one side, the running
                 total on the other ──
                 Same grid and the same two classes, so the responsive rules
                 written for that screen apply here without a second set:
                 cfg-grid collapses to one column on a narrow viewport, and
                 cfg-aside stops being sticky and caps its height so it
                 cannot swallow the page. The panel is sticky again, which is
                 the point of it — the number stays on screen while the
                 options are changed rather than being scrolled back to. ── */}
          <div
            className="fade-in cfg-grid"
            style={{
              display: "grid", gap: 40, alignItems: "start",
              gridTemplateColumns: "minmax(340px, 1.55fr) minmax(310px, 0.85fr)",
            }}
          >
            <div className="cfg-steps" style={{ minWidth: 0, display: "grid", gap: 18 }}>

          {/* ── Product options first. Always. ── */}
          <div style={{
            background: T.bgNeutral, border: `1px solid ${T.border}`, borderRadius: R.lg,
            padding: 24, display: "grid", gap: 18,
          }}>
            {/* The PDP's own option component, not a row of selects. Same
                questions, same treatment, and the size modifiers are
                visible where a dropdown hid them. */}
            <ProductOptions formatId={formatId} state={state} onChange={setState} />

            {/* ── Only for the person who wants it ── */}
            <HelpMeDecide
              open={helpOpen} onToggle={() => setHelpOpen(o => !o)}
              kindId={kindId} onKind={changeKind} why={why}
            />
          </div>

          {/* ── Shipping, in the main column ──
              The destination lives out here, not in the panel: it needs the
              width for arrival dates beside it, and the panel's job is the
              calculation. The panel's opt-in reads this state, so turning
              "include shipping" on there uses whatever is chosen here. */}
          <div style={{
            background: T.bgNeutral, border: `1px solid ${T.border}`, borderRadius: R.lg,
            padding: 24, display: "grid", gap: 16,
          }}>
            <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>
              Shipping
            </span>

            <ShipTo selling={selling} shipping={!selling} ship={ship} setShip={setShip} />

            {/* Arrival dates wait for a postcode. Rates and speeds mean
                nothing without a destination, and a table of dates that
                cannot be right yet is worse than no table: it invites
                someone to plan around figures that will move the moment
                they type. The same test the quote uses, so the panel's
                "include shipping" switch and this section appear together. */}
            {!selling && hasDestination && (
              <div className="fade-in" style={{ display: "grid", gap: 10, borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
                <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>
                  When it would arrive
                </span>
                <DeliveryTable
                  qty={state.qty} country={ship.country} poBox={ship.poBox}
                  chosen={ship.speed} onChoose={id => setShip({ ...ship, speed: id })}
                />
              </div>
            )}
          </div>

          {/* ── Once a product is priced, the next step is to make it ──
              The same component the product page uses. It sits at the foot
              of the choices column rather than in the panel: the panel is
              the arithmetic, and an action is not a number. */}
          <div style={{
            background: T.bgNeutral, border: `1px solid ${T.border}`, borderRadius: R.lg,
            padding: 24,
          }}>
            <CreateActions
              formatId={formatId}
              sel={state}
              onGo={onGo}
              heading={selling ? "Ready to make the book you would sell?" : "Ready to make it?"}
            />
          </div>

          {/* The channel comparison used to sit here. It belongs on the
              seller landing page and only there — that page's one goal is
              "which route is mine?", and answering the same question in
              three places is how a prototype starts contradicting itself.
              Removed 2026-08-24. Note this supersedes the board's
              "comparison before commitment — the channel comparison belongs
              on the estimator": still comparison before commitment, but the
              comparison has its own page now. */}

            </div>

            {/* ── The answer, sticky beside the choices ──
                The same panel /getting-started uses. The estimator had its
                own doing the same job with different parts, which is two
                places to fix a rule and two chances to disagree about it. */}
            <SummaryPanel
              formatId={formatId}
              state={state}
              onChange={setState}
              mode={mode}
              sellPrice={shown}
              onSellPrice={setPrice}
              ship={ship}
              setShip={setShip}
            />
          </div>



          {/* ── The other page ──
              Two pages, not two tabs: the maker's price lives under
              Pricing, the seller's margin under Sell & Self-Publish. Each
              names the other plainly, because arriving at the wrong one is
              the most likely mistake either page invites. */}
          <div
            className="stack-md"
            style={{
              background: C.blue50, border: `1px solid ${C.blue100}`, borderRadius: R.lg, padding: 24,
              display: "grid", gap: 16, gridTemplateColumns: "1fr auto", alignItems: "center",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["4xl"], fontWeight: 500, lineHeight: 1.25, color: C.blue950 }}>
                {m.swap}
              </div>
              <p style={{ fontSize: TYPE.base, lineHeight: 1.65, color: T.textNeutral, margin: "6px 0 0", maxWidth: 660 }}>
                {m.swapBody}
              </p>
            </div>
            <button
              onClick={() => onGo && onGo(m.other === "sell" ? "margin" : "pricing")}
              style={{
                height: BUTTON_HEIGHT, padding: "0 22px", borderRadius: R.md,
                background: T.bgBrand, color: T.textInverse, border: "1px solid transparent",
                fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 700,
                letterSpacing: 0.6, textTransform: "uppercase", whiteSpace: "nowrap",
              }}
            >
              {MODES[m.other].tab}
            </button>
          </div>

          <p style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.6, margin: 0 }}>
            Sizes, papers, page rates and volume tiers are real, from blurb.com/pricing.
            {selling && " Cost and margin are placeholders — Blurb publishes no fulfilment pricing."}
            {" "}Nothing on this page creates a project.
          </p>
        </div>
      </section>
    </div>
  );
}
