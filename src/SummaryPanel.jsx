import React, { useState, useEffect } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import WhiteLabelTip from "./WhiteLabelTip.jsx";
import CostExplainer from "./CostExplainer.jsx";
import MarginLadder from "./MarginLadder.jsx";
import { MiniStepper, Divider } from "./Configurator.jsx";
import {
  CATALOG, ADDONS, SHIPPING, PRINT_DAYS,
  priceFor, selectedOption, pageLimit, shippingFor, money,
  sellerCost, minSellPrice, derivedSteps, BULK_MIN, speedDays,
} from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   The summary panel — one component, two screens.

   It was the sticky aside on /getting-started and nothing else. The
   estimator had its own result panel doing the same job with different
   parts: a row of big figures, its own shipping block, its own footnotes.
   Two panels answering "what does this cost, and what would I keep" is
   two places to fix a rule and two chances to disagree about it.

   So the aside moved here and both screens render it. Everything that
   moves the number lives in it — pages, copies, upgrades, shipping — which
   is what keeps the whole calculation visible in one place while the
   choices are made beside it.

   The panel knows nothing about which screen it is on. It takes a
   specification and a mode, and the mode decides whether it shows a total
   (make), a run (distribute) or the cost → price → profit ladder (sell).
   ──────────────────────────────────────────────────────────────── */

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

/* The switch. A checkbox rather than a disclosure, because it changes a
   number rather than revealing more reading — and it names which number. */
function ShippingSwitch({ on, onChange, quote, selling }) {
  return (
    <label style={{
      display: "grid", gap: 4, cursor: "pointer",
      borderTop: `1px solid ${T.border}`, paddingTop: 12,
    }}>
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="checkbox"
          checked={on}
          onChange={e => onChange(e.target.checked)}
          style={{ width: 18, height: 18, accentColor: C.blue600, flex: "0 0 auto" }}
        />
        <span style={{ fontSize: TYPE.sm, fontWeight: 700 }}>
          {selling ? "Show what your buyer pays" : "Include shipping in the total"}
        </span>
      </span>
      <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5, paddingLeft: 28 }}>
        {quote
          ? (selling
              ? "Their price plus delivery, kept apart from your numbers."
              : `Adds ${money(quote.cost)} — ${quote.speed.label.toLowerCase()}.`)
          : "Choose a destination under Shipping to get a figure."}
      </span>
    </label>
  );
}

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
export default function SummaryPanel({
  formatId, state, onChange, mode, sellPrice, onSellPrice, onProductPage,
  sticky = true, ship: shipProp, setShip: setShipProp,
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

  /* Shipping can be owned by the screen instead, so a page that shows
     arrival dates beside the panel is reading the same country and speed
     rather than keeping a second copy of them. */
  const [ownShip, setOwnShip] = useState({ open: false, country: "US", postal: "", speed: "economy" });
  const ship = shipProp ?? ownShip;
  const setShip = setShipProp ?? setOwnShip;
  const quote = ship.postal.trim().length > 1 ? shippingFor(ship.country, ship.speed, selling ? 1 : state.qty) : null;

  /* ── Shipping is a question, not a section ──
     It used to be a block in this panel: destination, postcode, four
     speeds, folded away but always present. The destination now lives in
     the main column, where there is room for arrival dates beside it, and
     what is left here is the only shipping question this panel needs to
     answer — do you want to see it in the total?

     Off by default, deliberately. The price of the book is what is being
     decided; shipping is a fact about one delivery to one address, and
     folding it in by default makes every number on the page conditional on
     a postcode nobody has typed yet. Turn it on and the total changes.

     On the selling side it stays out of the seller's numbers entirely —
     the buyer pays it, so what the switch reveals there is what the BUYER
     pays, as separate lines. That rule is why this panel exists. */
  const [withShipping, setWithShipping] = useState(false);

  const toggleAddon = id => {
    const on = state.addons.includes(id);
    onChange({ ...state, addons: on ? state.addons.filter(a => a !== id) : [...state.addons, id] });
  };

  const addons = (f.addons || []).map(id => ADDONS.find(a => a.id === id)).filter(Boolean);

  return (
      <aside
        className="cfg-aside"
        style={{
          ...(sticky ? { position: "sticky", top: 88 } : null), background: T.bgNeutral,
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
          </>
        )}

        <Divider />

        {selling ? (
          <>
            <MarginLadder cost={cost} price={sellPrice} onPrice={onSellPrice} floor={floor} compact />
            <p style={{ fontSize: TYPE.sm, color: T.textSubtle, margin: 0, lineHeight: 1.5 }}>
              Your buyer pays shipping, so your margin is the same wherever they live.
            </p>

            {shipProp && (
              <>
                <ShippingSwitch on={withShipping} onChange={setWithShipping} quote={quote} selling />
                {withShipping && quote && (
                  <div style={{ display: "grid", gap: 10 }}>
                    <Line label="Your price" value={money(sellPrice)} muted />
                    <Line label="Shipping, paid by them" value={money(quote.cost)} muted />
                    <Line label="Your buyer pays" value={money(sellPrice + quote.cost)} strong />
                  </div>
                )}
              </>
            )}

            <CostExplainer compact />
          </>
        ) : (
          <>
            <div style={{ display: "grid", gap: 10 }}>
              {p.extraPages > 0 && <Line label={`Extra pages (${state.pages - f.basePages})`} value={money(p.extraPages)} muted />}
              {p.addons > 0 && <Line label="Upgrades" value={money(p.addons)} muted />}
              {state.qty > 1 && <Line label={`${state.qty} copies`} value={money(p.subtotal)} muted />}
              {p.tier && <Line label={`Volume discount ${Math.round(p.tier.pct * 100)}%`} value={`− ${money(p.subtotal - p.total)}`} muted />}
              {withShipping && quote && (
                <Line label={`Shipping — ${quote.speed.label}`} value={money(quote.cost)} muted />
              )}
              <Line
                label={withShipping && quote ? "Total with shipping" : "Total"}
                value={money(p.total + (withShipping && quote ? quote.cost : 0))}
                strong
              />
              {/* A bulk buyer prices the run by the copy — it is the number
                  they will set their own price against. */}
              {bulk && state.qty > 0 && (
                <Line label="Cost per copy" value={money(p.total / state.qty)} accent />
              )}
            </div>
            {shipProp && (
              <ShippingSwitch on={withShipping} onChange={setWithShipping} quote={quote} selling={false} />
            )}

            <p style={{ fontSize: TYPE.sm, color: T.textSubtle, margin: 0, lineHeight: 1.5 }}>
              {withShipping && quote ? "Excludes taxes." : "Excludes taxes and shipping."}
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
  );
}
