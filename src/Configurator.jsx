import React, { useState, useEffect } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";
import WhiteLabelTip from "./WhiteLabelTip.jsx";
import CostExplainer from "./CostExplainer.jsx";
import MarginLadder from "./MarginLadder.jsx";
import {
  CATALOG, ADDONS, SHIPPING, PRINT_DAYS,
  priceFor, selectedOption, pageLimit, shippingFor, money,
  availableFor, reconcile, sellerCost, minSellPrice, derivedSteps, BULK_MIN, speedDays,
} from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   The configurator, following the Blurb Pricing Calculator design
   (Figma "Blurb Pricing Page", v1-4, node 38:1562) — vertical STEP
   sections, each a grid of large image-led cards.

   Two changes from that design:
     · the pricing summary is not a block at the bottom. It sits
       alongside as a sticky panel, so the number moves while you
       choose rather than after you finish.
     · every variable that moves the price — pages, copies, upgrades,
       shipping — lives in that panel too, so the whole calculation is
       visible at a glance instead of scattered up the page.
   ──────────────────────────────────────────────────────────────── */

export function StepHeading({ n, children }) {
  return (
    <div style={{ textAlign: "center", margin: "0 0 24px" }}>
      <div style={{
        fontFamily: FONT_BODY, fontSize: TYPE.xl, fontWeight: 700,
        letterSpacing: 1, textTransform: "uppercase", color: T.textNeutral,
      }}>
        Step {n}: {children}
      </div>
      <div style={{ width: 64, height: 3, background: T.bgBrand, margin: "12px auto 0", borderRadius: 2 }} />
    </div>
  );
}

/* Codex — Text Selector, PDP variant: white, 2px #0d2f44 ring when chosen.
   One component, three densities, because the ring, the disabled treatment
   and the "not available with the rest of your selection" title have to
   behave identically wherever an option is offered:

     · default — the step cards on /getting-started. Image-led, 16/11.
     · thumb   — the live PDP's size swatches: a 56px tile, label under it.
     · text    — the live PDP's paper and finish buttons. No image at all,
                 because a paper is a word; a picture of one is a grey box
                 pretending to be information.

   The live page is the source for all three: its size row is thumbnails and
   its paper row is text, on the same screen. */
export function OptionCard({ title, sub, spec, note, selected, onClick, disabled, variant = "default" }) {
  const thumb = variant === "thumb";
  const text = variant === "text";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className="card-move"
      title={disabled ? "Not available with the rest of your selection" : undefined}
      style={{
        textAlign: "center", background: T.bgNeutral, borderRadius: R.md,
        padding: thumb ? 8 : text ? "10px 12px" : 16,
        minWidth: 0, opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        border: selected ? `2px solid ${T.borderBrand}` : `1px solid ${T.border}`,
        margin: selected ? 0 : 1,
        fontFamily: FONT_BODY, display: "grid", gap: thumb ? 6 : text ? 2 : 8, alignContent: "start",
      }}
    >
      {!text && (
        <div style={{
          background: selected ? C.blue50 : C.gray100, borderRadius: R.sm,
          /* A square swatch, as on the live PDP. A fixed height inside a
             flexible card gave a squat rectangle that read as a cropped
             image rather than a sample. */
          aspectRatio: thumb ? "1 / 1" : "16 / 11",
          display: "grid", placeItems: "center",
        }}>
          <span className="ms" style={{ fontSize: thumb ? 26 : 40, color: selected ? C.blue600 : C.gray400 }}>
            menu_book
          </span>
        </div>
      )}
      <div style={{
        /* Only the default step card shouts. A thumbnail's caption and a text
           button are read as words, and the live PDP sets both in sentence
           case — uppercasing "Mohawk Superfine Eggshell" costs a line break
           and buys nothing. */
        fontSize: thumb ? TYPE.sm : TYPE.base,
        fontWeight: thumb ? 600 : text ? 600 : 700,
        letterSpacing: thumb || text ? 0 : 0.6,
        textTransform: thumb || text ? "none" : "uppercase",
        color: selected ? C.blue950 : T.textNeutral, lineHeight: 1.3,
      }}>
        {title}
      </div>
      {sub && <div style={{ fontSize: TYPE.sm, color: T.textSubtle }}>{sub}</div>}
      {spec && <div style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>{spec}</div>}
      {note && (
        <div style={{ fontSize: TYPE.sm, fontWeight: 700, color: selected ? C.blue600 : T.textSubtle }}>
          {note}
        </div>
      )}
    </button>
  );
}

/* ── Codex, Quantity Selector (Single-page Checkout 12442:88383) ──
   Three segments joined into one control rather than three loose boxes:
   40px tall, 48px wide each, borders collapsed with a −1px margin,
   #989898 (which T.borderStrong already is), 4px on the outer corners
   only, and the value at 18px REGULAR — not bold, which is what our
   version had wrong.

   Two departures, both to keep it usable here rather than to restyle it:
   the value stays an input so a long page count can be typed instead of
   clicked to, and the label sits in our panel's uppercase style so it
   matches Pages, Copies and Your price rather than introducing a second
   label voice inside one panel. */
const SEG = {
  width: 48, height: 40, flex: "0 0 auto",
  background: T.bgNeutral, border: `1px solid ${T.borderStrong}`,
  display: "grid", placeItems: "center", color: T.textNeutral,
};

export function MiniStepper({ label, hint, value, min, max, step = 1, onChange }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</span>
        {hint && <span style={{ fontSize: TYPE.sm, color: T.textSubtle, textAlign: "right" }}>{hint}</span>}
      </span>

      <span style={{ display: "flex", alignItems: "stretch" }}>
        <button
          style={{ ...SEG, borderRadius: `4px 0 0 4px`, marginRight: -1 }}
          onClick={() => onChange(Math.max(min, value - step))}
          aria-label={`Fewer ${label}`}
        >
          <span className="ms" style={{ fontSize: 24 }}>remove</span>
        </button>

        <input
          type="number" value={value} min={min} max={max}
          aria-label={label}
          onChange={e => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
          style={{
            ...SEG, marginRight: -1, borderRadius: 0, outline: "none",
            textAlign: "center", padding: "0 4px",
            fontFamily: FONT_BODY, fontSize: TYPE.lg, fontWeight: 400, color: T.textNeutral,
          }}
        />

        <button
          style={{ ...SEG, borderRadius: `0 4px 4px 0` }}
          onClick={() => onChange(Math.min(max, value + step))}
          aria-label={`More ${label}`}
        >
          <span className="ms" style={{ fontSize: 24 }}>add</span>
        </button>
      </span>
    </div>
  );
}

/* ── Past a hundred copies, this is not the right page ──
   Someone ordering a hundred books is not making a keepsake. They are
   buying stock — to sell in person, to hand out at an event, to
   distribute somewhere Blurb's own channels do not reach. Large Order
   Services exists for exactly that, and the self-serve volume tiers stop
   at fifty, so past this point the page is quoting worse terms than the
   company would actually offer.

   The threshold is not a guess: ProductList 2025's quantity ladder ends
   "100+ Books – blurb.com", which is this handoff written down.

   It appears beside the copies stepper rather than replacing anything:
   this is a better door, not a closed one. */
const BULK_AT = BULK_MIN;

function BulkHandoff({ qty }) {
  return (
    <div style={{
      background: C.blue50, border: `1px solid ${C.blue100}`, borderRadius: R.md,
      padding: 14, display: "grid", gap: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="ms" style={{ fontSize: 20, color: C.blue600 }}>local_shipping</span>
        <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: C.blue950 }}>
          {qty} copies is a large order
        </span>
      </div>
      <p style={{ margin: 0, fontSize: TYPE.sm, lineHeight: 1.55, color: T.textNeutral }}>
        At this quantity you are buying stock — to sell in person, to hand out at an event, or to
        distribute somewhere our own channels do not reach. Large Order Services quotes better than this
        calculator can, and handles delivery in bulk.
      </p>
      <button style={{
        justifySelf: "start", height: 36, padding: "0 16px", borderRadius: R.sm,
        background: C.blue950, color: T.textInverse, border: "1px solid transparent",
        fontFamily: FONT_BODY, fontSize: TYPE.sm, fontWeight: 700,
        letterSpacing: 0.5, textTransform: "uppercase",
      }}>
        Get a bulk quote
      </button>
    </div>
  );
}

function Check({ label, detail, benefit, checked, onChange, info }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      style={{
        display: "grid", gridTemplateColumns: "22px 1fr", gap: 10, alignItems: "start",
        background: "transparent", border: 0, padding: 0, textAlign: "left",
        fontFamily: FONT_BODY, width: "100%",
      }}
    >
      <span style={{
        width: 22, height: 22, borderRadius: R.sm, marginTop: 1,
        border: checked ? `2px solid ${C.blue950}` : `1px solid ${T.borderStrong}`,
        background: checked ? C.blue950 : T.bgNeutral,
        display: "grid", placeItems: "center", color: T.textInverse, flex: "0 0 auto",
      }}>
        {checked && <span className="ms" style={{ fontSize: 15 }}>check</span>}
      </span>
      <span style={{ display: "grid", gap: 2, minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</span>
            {info}
          </span>
          <span style={{ fontSize: TYPE.sm, color: T.textSubtle, whiteSpace: "nowrap" }}>{detail}</span>
        </span>
        {benefit && (
          <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.45 }}>{benefit}</span>
        )}
      </span>
    </button>
  );
}

/* Free-text price entry. A number input clamped on every keystroke is
   impossible to type into — entering "24" against a $4.20 floor turns
   into "4.20" the moment you press 2. So: type whatever you like, the
   ladder follows live, and the floor is applied when you leave the field. */
function PriceInput({ value, floor, onChange }) {
  const [raw, setRaw] = useState(value.toFixed(2));
  const [editing, setEditing] = useState(false);

  useEffect(() => { if (!editing) setRaw(value.toFixed(2)); }, [value, editing]);

  const parsed = parseFloat(raw);
  const below = editing && raw.trim() !== "" && Number.isFinite(parsed) && parsed < floor;

  const commit = () => {
    setEditing(false);
    const next = Number.isFinite(parsed) ? Math.max(floor, parsed) : floor;
    setRaw(next.toFixed(2));
    onChange(next);
  };

  /* Typing is the precise way in, but a bare field does not look adjustable
     — and this is the one number on the page the seller is meant to move.
     The steppers say so, and match the pages and copies controls above. */
  const step = dir => {
    const from = Number.isFinite(parsed) ? parsed : value;
    const next = Math.max(floor, Math.round((from + dir) * 100) / 100);
    setEditing(false);
    setRaw(next.toFixed(2));
    onChange(next);
  };

  /* Stacked chevrons rather than a minus and a plus at opposite ends of the
     field: adjusting a price is a hunt for the right number, so up and down
     get used one after the other. Splitting them across the control makes
     every change of direction a journey. Together, the pointer stays put. */
  /* Codex defines Stepper Set — separate rounded boxes, 1px border, white
     fill, bold dark glyph — so the buttons take that look rather than a
     new one. What Codex does NOT define is a spinner: its stepper puts
     minus and plus either side of the value. Stacking them is a departure,
     and a deliberate one, because a price is hunted for rather than nudged
     once. If strict conformance matters more, this should go back to − /
     + and the spinner be proposed to Codex instead. */
  const atFloor = value <= floor;
  /* Same border, same fill, same 4px corners as the Codex selector, and
     the pair stacks to exactly its 40px height. */
  const chevron = {
    width: 34, height: 19, padding: 0,
    border: `1px solid ${T.borderStrong}`, background: T.bgNeutral,
    display: "grid", placeItems: "center", color: T.textNeutral,
  };

  return (
    <span style={{ display: "grid", gap: 4 }}>
      <span style={{ display: "flex", alignItems: "stretch", gap: 8 }}>
      <span style={{
        flex: 1, minWidth: 0, minHeight: 40,
        display: "flex", alignItems: "center", gap: 8, padding: "0 12px",
        border: `2px solid ${below ? "#b3261e" : T.borderBrand}`, borderRadius: R.md,
        background: T.bgNeutral,
      }}>
        <span style={{ fontSize: TYPE.lg, color: T.textSubtle, whiteSpace: "nowrap", flex: "0 0 auto" }}>US $</span>
        <input
          type="text" inputMode="decimal" value={raw}
          aria-label="Your price"
          onFocus={e => { setEditing(true); e.target.select(); }}
          onChange={e => {
            const v = e.target.value;
            if (!/^\d*\.?\d*$/.test(v)) return;   // digits and one decimal point
            setRaw(v);
            const n = parseFloat(v);
            if (Number.isFinite(n)) onChange(n);   // ladder follows as you type
          }}
          onBlur={commit}
          onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
          style={{
            border: 0, outline: "none", width: "100%", background: "transparent",
            fontFamily: FONT_BODY, fontSize: TYPE.xl, fontWeight: 700, color: T.textNeutral,
          }}
        />
      </span>

      <span style={{ flex: "0 0 auto", display: "grid", gap: 2, alignSelf: "center" }}>
        <button
          style={{ ...chevron, borderRadius: "4px 4px 0 0", marginBottom: -1 }}
          onClick={() => step(1)}
          aria-label="Raise your price by one dollar"
        >
          <span className="ms" style={{ fontSize: 18 }}>keyboard_arrow_up</span>
        </button>
        <button
          style={{
            ...chevron, borderRadius: "0 0 4px 4px",
            opacity: atFloor ? 0.35 : 1, cursor: atFloor ? "not-allowed" : "pointer",
          }}
          onClick={() => step(-1)}
          disabled={atFloor}
          aria-label="Lower your price by one dollar"
          title={atFloor ? `${money(floor)} is your cost — you cannot price below it` : undefined}
        >
          <span className="ms" style={{ fontSize: 18 }}>keyboard_arrow_down</span>
        </button>
      </span>
      </span>
      {below && (
        <span style={{ fontSize: TYPE.sm, color: "#b3261e" }}>
          Below your cost. This will lift to {money(floor)} when you finish.
        </span>
      )}
    </span>
  );
}

/* A step with nothing to pick — a magazine's paper and cover, which come with
   the magazine itself. Same heading, same card, already chosen: the page keeps
   its shape and the spec is read where every other spec is read. */
/* "Choose your book size" → "BOOK SIZE", "Your paper" → "PAPER". */
const summaryLabel = label => label.replace(/^(choose your|your)\s+/i, "").toUpperCase();

/* ── Which configurations have a product page to read ──
   blurb.com has a PDP per cover, not per family: /photo-books has
   /imagewrap-hardcover-photo-book, /layflat-photo-book and the rest. Only
   the ImageWrap one is prototyped here, so this map has one entry — and it
   is a map rather than an `if` because the second one costs a line, and
   because a missing PDP has to mean "no link" instead of a broken one. */
const PDP_NAME = {
  photo: { imagewrap: "ImageWrap hardcover photo books" },
};
const pdpName = (formatId, sel) => PDP_NAME[formatId]?.[sel?.cover] ?? null;

/* One card should not stretch the width of the column the way six do. */
export const stepGrid = count => ({
  display: "grid", gap: 14,
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  ...(count === 1 ? { maxWidth: 260, margin: "0 auto" } : null),
});

export function StepNote({ children }) {
  return (
    <p style={{
      fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5,
      textAlign: "center", margin: "14px auto 0", maxWidth: 560,
    }}>
      {children}
    </p>
  );
}

/* `accent` is for the one number the page exists to produce — the seller's
   profit. Brand blue rather than the near-black used for a plain total, so
   it reads as the answer and not just the last row. */
function Line({ label, value, strong, muted, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
      <span style={{
        fontSize: strong ? TYPE.base : TYPE.sm,
        color: accent ? C.blue600 : muted ? T.textSubtle : T.textNeutral,
        fontWeight: strong ? 700 : 400,
        letterSpacing: strong ? 0.4 : 0, textTransform: strong ? "uppercase" : "none",
      }}>{label}</span>
      <span style={{
        fontSize: strong ? TYPE["4xl"] : TYPE.base, fontWeight: strong ? 700 : 600,
        color: accent ? C.blue600 : strong ? C.blue950 : T.textNeutral, whiteSpace: "nowrap",
        fontFamily: strong ? FONT_DISPLAY : FONT_BODY,
      }}>{value}</span>
    </div>
  );
}

export function Divider() {
  return <div style={{ borderTop: `1px solid ${T.border}` }} />;
}

/* ── Shipping estimate, folded away until asked for ── */
function ShippingBlock({ ship, setShip, qty, selling, cost }) {
  const country = SHIPPING.countries.find(c => c.id === ship.country);
  const ready = ship.postal.trim().length > 1;
  const quote = ready ? shippingFor(ship.country, ship.speed, qty) : null;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <button
        onClick={() => setShip({ ...ship, open: !ship.open })}
        aria-expanded={ship.open}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
          background: "transparent", border: 0, padding: 0, width: "100%",
          fontFamily: FONT_BODY, textAlign: "left",
        }}
      >
        <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>
          {selling ? "What your buyer pays" : "Shipping"}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: T.textSubtle, fontSize: TYPE.sm }}>
          {quote ? money(quote.cost) : "Estimate"}
          <span className="ms" style={{ fontSize: 18 }}>{ship.open ? "expand_less" : "expand_more"}</span>
        </span>
      </button>

      {ship.open && (
        <div className="fade-in" style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
            <select
              value={ship.country}
              onChange={e => setShip({ ...ship, country: e.target.value, postal: "" })}
              style={{
                border: `1px solid ${T.border}`, borderRadius: R.sm, padding: "8px 10px",
                fontFamily: FONT_BODY, fontSize: TYPE.sm, background: T.bgNeutral, minWidth: 0,
              }}
            >
              {SHIPPING.countries.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <input
              value={ship.postal}
              onChange={e => setShip({ ...ship, postal: e.target.value })}
              placeholder={country?.example}
              aria-label={country?.postal}
              style={{
                border: `1px solid ${T.border}`, borderRadius: R.sm, padding: "8px 10px",
                fontFamily: FONT_BODY, fontSize: TYPE.sm, minWidth: 0,
              }}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            {SHIPPING.speeds.map(s => {
              const on = ship.speed === s.id;
              const q = ready ? shippingFor(ship.country, s.id, qty) : null;
              return (
                <button
                  key={s.id}
                  onClick={() => setShip({ ...ship, speed: s.id })}
                  aria-pressed={on}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                    padding: "8px 10px", borderRadius: R.sm, background: T.bgNeutral,
                    border: on ? `2px solid ${T.borderBrand}` : `1px solid ${T.border}`,
                    margin: on ? 0 : 1, fontFamily: FONT_BODY, textAlign: "left",
                  }}
                >
                  <span style={{ display: "grid", gap: 1, minWidth: 0 }}>
                    <span style={{ fontSize: TYPE.sm, fontWeight: on ? 700 : 500 }}>{s.label}</span>
                    <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>{speedDays(s)}</span>
                  </span>
                  <span style={{ fontSize: TYPE.sm, fontWeight: 700, color: on ? C.blue600 : T.textSubtle, whiteSpace: "nowrap" }}>
                    {q ? money(q.cost) : "—"}
                  </span>
                </button>
              );
            })}
          </div>

          <p style={{ fontSize: TYPE.sm, color: T.textSubtle, margin: 0, lineHeight: 1.5 }}>
            This is an estimate. Taxes and delivery rates vary by destination and are confirmed at checkout.
            Printing takes {PRINT_DAYS.label} before your order ships.
          </p>

          {selling && quote && (
            <div style={{ display: "grid", gap: 8, borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
              <Line label="Your price" value={money(cost.sellPrice)} muted />
              <Line label="Shipping, paid by them" value={money(quote.cost)} muted />
              <Line label="Buyer pays" value={money(cost.sellPrice + quote.cost)} />
              <p style={{ fontSize: TYPE.sm, color: T.textSubtle, margin: 0, lineHeight: 1.5 }}>
                None of this touches your margin — your buyer pays shipping directly.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Configurator({
  formatId, state, onChange, mode, sellPrice, onSellPrice,
  stepOffset = 1, leading, trailing, onProductPage,
}) {
  const selling = mode === "sell";
  const bulk = mode === "distribute";
  const f = CATALOG[formatId];
  const p = priceFor(formatId, state);
  const limit = pageLimit(formatId, state);
  const cost = sellerCost(formatId, state);
  const floor = minSellPrice(formatId, state);
  const derived = derivedSteps(formatId, state);
  const profit = Math.max(0, sellPrice - cost);
  const pdp = pdpName(formatId, state);

  /* A pricier paper can push cost above the asking price — lift it rather
     than leaving the ladder showing zero profit. */
  useEffect(() => { if (selling && sellPrice < floor) onSellPrice(floor); }, [floor, selling]);

  const [ship, setShip] = useState({ open: false, country: "US", postal: "", speed: "economy" });
  const quote = ship.postal.trim().length > 1 ? shippingFor(ship.country, ship.speed, selling ? 1 : state.qty) : null;

  const set = (groupId, id) => {
    /* One choice can invalidate another, and paper caps the page count.
       Repair both rather than quoting a book that cannot be made. */
    let next = reconcile(formatId, { ...state, [groupId]: id }, groupId);
    const cap = pageLimit(formatId, next);
    if (next.pages > cap) next.pages = cap;
    onChange(next);
  };
  const toggleAddon = id => {
    const on = state.addons.includes(id);
    onChange({ ...state, addons: on ? state.addons.filter(a => a !== id) : [...state.addons, id] });
  };

  const addons = (f.addons || []).map(id => ADDONS.find(a => a.id === id)).filter(Boolean);

  return (
    <div className="fade-in cfg-grid" style={{ display: "grid", gap: 40, gridTemplateColumns: "minmax(340px, 1.55fr) minmax(310px, 0.85fr)", alignItems: "start" }}>

      {/* ── Steps ── */}
      <div className="cfg-steps" style={{ minWidth: 0, display: "grid", gap: 48 }}>
        {leading}

        {f.digital && (
          <p style={{ fontSize: TYPE.lg, lineHeight: 1.6, color: T.textSubtle, margin: 0, textAlign: "center" }}>{f.note}</p>
        )}

        {f.groups.map((g, i) => (
          <section key={g.id}>
            <StepHeading n={stepOffset + i + 1}>{g.label}</StepHeading>
            <div style={stepGrid(g.options.length)}>
              {g.options.map(o => {
                const ok = availableFor(formatId, state, g.id).has(o.id);
                return (
                  <OptionCard
                    key={o.id}
                    title={o.label}
                    sub={o.dims}
                    spec={o.spec ? `${o.spec}${o.maxPages ? ` · up to ${o.maxPages} pages` : ""}` : null}
                    note={ok ? null : "Not in this combination"}
                    selected={state[g.id] === o.id}
                    disabled={!ok}
                    onClick={() => set(g.id, o.id)}
                  />
                );
              })}
            </div>

            {g.note && <StepNote>{g.note}</StepNote>}
          </section>
        ))}

        {/* Steps that follow from a choice rather than offering one. */}
        {derived.map((d, i) => (
          <section key={d.id}>
            <StepHeading n={stepOffset + f.groups.length + i + 1}>{d.label}</StepHeading>
            <div style={stepGrid(1)}>
              <OptionCard title={d.option.label} spec={d.option.spec} selected onClick={() => {}} />
            </div>
            {d.note && <StepNote>{d.note}</StepNote>}
          </section>
        ))}

        {trailing}
      </div>

      {/* ── Calculator, alongside. Every variable lives here. ── */}
      <aside
        className="cfg-aside"
        style={{
          position: "sticky", top: 88, background: T.bgNeutral,
          border: `1px solid ${T.border}`, borderRadius: R.lg,
          padding: 22, display: "grid", gap: 14, minWidth: 0,
        }}
      >
        <div style={{
          fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 700,
          letterSpacing: 0.8, textTransform: "uppercase",
        }}>
          {selling ? "What you'd earn" : bulk ? "What the run costs" : "Pricing summary"}
        </div>

        {/* what you've chosen */}
        <div style={{ display: "grid", gap: 3, fontSize: TYPE.sm, color: T.textSubtle }}>
          {f.groups.map(g => {
            const o = selectedOption(formatId, g.id, state);
            return <span key={g.id}><strong style={{ color: T.textNeutral }}>{summaryLabel(g.label)}:</strong> {o?.label}</span>;
          })}
          {derived.map(d => (
            <span key={d.id}><strong style={{ color: T.textNeutral }}>{summaryLabel(d.label)}:</strong> {d.option.label}</span>
          ))}
        </div>

        {/* ── Out to the product page ──
            The summary names a specific product — an ImageWrap hardcover
            photo book, 8×10, Premium Lustre — and this page can price that
            without ever describing it. Paper weights, cover finishes, end
            sheets, what the binding is actually like: all of that lives on
            the PDP, and someone deciding between two papers needs it.

            So the summary offers the way out, worded as what it is — a page
            to read, not a step in the flow. It carries the configuration, so
            the PDP opens on the same book, and coming back loses nothing. */}
        {pdp && onProductPage && (
          <button
            onClick={() => onProductPage({ formatId, sel: { ...state } })}
            style={{
              font: "inherit", fontSize: TYPE.sm, fontWeight: 600, color: T.textBrand,
              background: "transparent", border: 0, padding: 0, cursor: "pointer",
              justifySelf: "start", textAlign: "left", display: "inline-flex", alignItems: "center", gap: 4,
            }}
          >
            Learn more about {pdp}
            <span className="ms" style={{ fontSize: 18 }}>arrow_forward</span>
          </button>
        )}

        {!f.digital && (
          <>
            <Divider />
            {!f.pageless && (
              <MiniStepper
                label="Pages" hint={`${f.basePages}–${limit} · ${money(p.perPage)} each`}
                value={state.pages} min={f.basePages} max={limit} step={2}
                onChange={pages => onChange({ ...state, pages })}
              />
            )}
            {!selling && (
              <>
                <MiniStepper
                  label="Copies"
                  hint={bulk ? `From ${BULK_MIN}` : "Discount from 10"}
                  value={state.qty} min={bulk ? BULK_MIN : 1} max={9999}
                  step={bulk ? 25 : 1}
                  onChange={qty => onChange({ ...state, qty })}
                />
                {state.qty >= BULK_AT && <BulkHandoff qty={state.qty} />}
              </>
            )}
            {addons.length > 0 && (
              <>
                <Divider />
                <div style={{ display: "grid", gap: 10 }}>
                  {addons.map(a => (
                    <Check
                      key={a.id} label={a.label} detail={a.detail} benefit={a.benefit}
                      info={a.id === "whitelabel" ? <WhiteLabelTip /> : null}
                      checked={state.addons.includes(a.id)}
                      onChange={() => toggleAddon(a.id)}
                    />
                  ))}
                </div>
              </>
            )}
            <Divider />
            <ShippingBlock
              ship={ship} setShip={setShip}
              qty={selling ? 1 : state.qty} selling={selling}
              cost={{ sellPrice }}
            />
          </>
        )}

        <Divider />

        {selling ? (
          <>
            <MarginLadder cost={cost} price={sellPrice} onPrice={onSellPrice} floor={floor} compact />
            <p style={{ fontSize: TYPE.sm, color: T.textSubtle, margin: 0, lineHeight: 1.5 }}>
              Your buyer pays shipping, so your margin is the same wherever they live.
            </p>
            <CostExplainer compact />
          </>
        ) : (
          <>
            <div style={{ display: "grid", gap: 10 }}>
              {p.extraPages > 0 && <Line label={`Extra pages (${state.pages - f.basePages})`} value={money(p.extraPages)} muted />}
              {p.addons > 0 && <Line label="Upgrades" value={money(p.addons)} muted />}
              {state.qty > 1 && <Line label={`${state.qty} copies`} value={money(p.subtotal)} muted />}
              {p.tier && <Line label={`Volume discount ${Math.round(p.tier.pct * 100)}%`} value={`− ${money(p.subtotal - p.total)}`} muted />}
              {quote && <Line label={`Shipping — ${quote.speed.label}`} value={money(quote.cost)} muted />}
              <Line label="Total" value={money(p.total + (quote?.cost ?? 0))} strong />
              {/* A bulk buyer prices the run by the copy — it is the number
                  they will set their own price against. */}
              {bulk && state.qty > 0 && (
                <Line label="Cost per copy" value={money(p.total / state.qty)} accent />
              )}
            </div>
            <p style={{ fontSize: TYPE.sm, color: T.textSubtle, margin: 0, lineHeight: 1.5 }}>
              {quote ? "Excludes taxes." : "Excludes taxes and shipping."}
              {p.tier && " A promo code replaces this discount rather than adding to it."}
            </p>
          </>
        )}

        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
          <p style={{ fontSize: TYPE.sm, color: T.textSubtle, margin: 0, lineHeight: 1.5 }}>
            {selling
              ? "Cost and margin are placeholders — Blurb publishes no fulfilment pricing."
              : p.anyGuess
                ? "Some option prices are placeholders. Sizes, per-page rate, paper specs and tiers are real."
                : "Sizes, per-page rate, paper specs and volume tiers are real."}
          </p>
        </div>
      </aside>
    </div>
  );
}
