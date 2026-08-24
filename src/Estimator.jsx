import React, { useState } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";
import SellChannels from "./SellChannels.jsx";
import SummaryPanel from "./SummaryPanel.jsx";
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
    h1: "What will your book cost?",
    lede: "Pick a product and a size and see the price, including however many copies you need.",
    other: "sell",
    swap: "Looking to sell, and want to see what it would earn you?",
    swapBody: "The margin estimator shows what a copy costs you, what to charge, and what you keep through each route to market.",
  },
  sell: {
    id: "sell",
    tab: "Margin estimator",
    sub: "What you'd earn selling it",
    h1: "What would you keep on every copy?",
    lede: "Set a price against what a copy costs you, and see what's left through each route to market.",
    other: "make",
    swap: "Just making it for yourself?",
    swapBody: "The pricing calculator gives you the price, your copies, and when it would arrive — no margin, nothing to set up.",
  },
};

/* ── The format cards, as /pricing opens with them ──
   "Select a format to see size and paper options" — the products first,
   then the controls that price one. It is the same principle the whole
   prototype runs on: a maker who already knows they want an 8×10 hardback
   must not be asked what kind of book they are writing first.

   Descriptions and badges are the live page's. The size counts and the
   from-prices are computed — sizeCount() and fromPrice() — so a card can
   never advertise a size the matrix does not hold. Expect the trade,
   notebook and wall-art figures to differ from the live page: it types
   $3.99, $12.00 and $65.00 where the matrix says $2.99, $14.67 and
   $10.11. That gap is ticket T7, and showing the computed number is the
   point rather than an oversight.

   PDFs are not here, because /pricing does not offer one. They are still
   in the catalogue, and still priced, for the pages that do. */
const FORMAT_CARDS = [
  ["photo",    "Photo Book",             "Premium books made for visual storytelling.", "Most Popular"],
  ["trade",    "Paperback & Hardcover Books", "Ideal for projects that pair text and imagery.", "Budget-friendly"],
  ["magazine", "Magazine",               "Great for serial content or volume printing. Think lookbooks and zines."],
  ["notebook", "Notebooks & Journals",   "Blank, lined, dotted or grid pages made for sketching, planning, and day-dreaming."],
  ["wallart",  "Wall Art",               "Gallery-quality wall décor, featuring your favorite photos or custom designs."],
];

function FormatCards({ formatId, onPick }) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 500, letterSpacing: "-0.01em",
          fontSize: "clamp(1.5rem, 3.2vw, 2.125rem)", lineHeight: 1.2, margin: 0,
        }}>
          Select a format to see size and paper options
        </h2>
        <p style={{ margin: "10px 0 0", fontSize: TYPE.base, color: T.textSubtle }}>
          Save more when you print in bulk. Learn about{" "}
          <span style={{ color: T.textBrand, fontWeight: 600, textDecoration: "underline" }}>
            volume discounts
          </span>.
        </p>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
        {FORMAT_CARDS.map(([id, title, blurb, badge]) => {
          const on = id === formatId;
          const from = fromPrice(id);
          return (
            <button
              key={id}
              onClick={() => onPick(id)}
              aria-pressed={on}
              className="card-move"
              style={{
                textAlign: "left", font: "inherit", cursor: "pointer", minWidth: 0,
                background: T.bgNeutral, borderRadius: R.lg, padding: 12,
                border: on ? `2px solid ${T.borderBrand}` : `1px solid ${T.border}`,
                margin: on ? 0 : 1,
                display: "grid", gap: 10, alignContent: "start",
              }}
            >
              {/* The live cards photograph the product; this is the placeholder
                  for that, with the badge sitting on it as it does there. */}
              <span style={{
                position: "relative", display: "block", background: C.gray50,
                borderRadius: R.md, aspectRatio: "1 / 1",
              }}>
                {badge && (
                  <span style={{
                    position: "absolute", top: 8, left: 8, background: "#fff",
                    border: `1px solid ${T.border}`, borderRadius: R.sm,
                    padding: "2px 8px", fontSize: TYPE.sm, fontWeight: 600,
                  }}>
                    {badge}
                  </span>
                )}
              </span>

              <span style={{
                display: "block", fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"],
                fontWeight: 600, lineHeight: 1.2, color: T.textNeutral,
              }}>
                {title}
              </span>
              <span style={{ display: "block", fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>
                {blurb}
              </span>
              <span style={{ display: "block", fontSize: TYPE.sm, fontWeight: 700 }}>
                {sizeCount(id)} {sizeCount(id) === 1 ? "size" : "sizes"} —{" "}
                {from == null ? "price on request" : `from ${money(from)}`}
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

/* Product options, as compact selects rather than the full step page.
   Everything the matrix cannot build is disabled rather than hidden, so
   the shape of what Blurb makes stays visible. */
function SpecPicker({ formatId, state, onState }) {
  const f = CATALOG[formatId];
  const derived = derivedSteps(formatId, state);

  const set = (groupId, id) => {
    let next = reconcile(formatId, { ...state, [groupId]: id }, groupId);
    const cap = pageLimit(formatId, next);
    if (cap && next.pages > cap) next.pages = cap;
    onState(next);
  };

  return (
    <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
      {f.groups.map(g => {
        const ok = availableFor(formatId, state, g.id);
        return (
          <Field key={g.id} label={g.label.replace(/^choose your /i, "")}>
            <select style={control} value={state[g.id]} onChange={e => set(g.id, e.target.value)}>
              {g.options.map(o => (
                <option key={o.id} value={o.id} disabled={!ok.has(o.id)}>
                  {o.label}{o.dims ? ` — ${o.dims}` : ""}{ok.has(o.id) ? "" : " (not available)"}
                </option>
              ))}
            </select>
          </Field>
        );
      })}

      {derived.map(d => (
        <Field key={d.id} label={d.label.replace(/^your /i, "")} hint="included">
          <span style={{ ...control, display: "flex", alignItems: "center", color: T.textSubtle, background: C.gray50 }}>
            {d.option.label}
          </span>
        </Field>
      ))}
    </div>
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
  const makerShip = ship.postal.trim().length > 1
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

      {/* ── Which calculator you are in, said before anything else ── */}
      <section style={{ padding: "clamp(28px, 5vw, 52px) 20px 0", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "36px 0 4px" }}>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 400,
            fontSize: "clamp(2rem, 5vw, 3.25rem)", lineHeight: 1.14, margin: 0, letterSpacing: "-0.01em",
          }}>
            {m.h1}
          </h1>
          <p style={{ fontSize: TYPE.xl, color: T.textSubtle, lineHeight: 1.6, margin: "14px auto 0", maxWidth: 640 }}>
            {m.lede}
          </p>
        </div>
      </section>

      <section style={{ padding: "24px 16px 72px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gap: 18 }}>

          {/* ── Formats first, then the controls that price one ── */}
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
            <SpecPicker formatId={formatId} state={state} onState={setState} />

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

            {!selling && (
              <div style={{ display: "grid", gap: 10, borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
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

          {selling && <SellChannels price={shown} cost={cost} formatId={formatId} sel={state} />}

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
