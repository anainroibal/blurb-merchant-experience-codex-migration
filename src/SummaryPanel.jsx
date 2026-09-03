import React, { useState, useEffect } from "react";
import { Button, Divider } from "@blurb/codex-react";
import { ArrowForwardIcon } from "@blurb/codex-react/icons";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import WhiteLabelTip from "./WhiteLabelTip.jsx";
import CostExplainer from "./CostExplainer.jsx";
import MarginLadder from "./MarginLadder.jsx";
import { MiniStepper } from "./Configurator.jsx";
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
      <Button variant="outlined" size="small" style={{ justifySelf: "start" }}>
        Get a bulk quote
      </Button>
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

/* ── Which configurations have a product page to read ──
   blurb.com has a PDP per cover, not per family: /photo-books holds
   /imagewrap-hardcover-photo-book, /layflat-photo-book and the rest. Only
   the ImageWrap one is prototyped here.

   Two levels, because two different links need this. The panel names the
   exact page when the configuration matches it — "ImageWrap hardcover
   photo books" — and the create actions fall back to the family, since
   "learn more about photo books" is true of any photo book and the page it
   opens is a photo-book page. A map rather than an `if`, so a missing PDP
   means no link instead of a broken one. */
const PDP_NAME = {
  photo: { imagewrap: "ImageWrap hardcover photo books" },
};
const PDP_FAMILY = { photo: "photo books" };

export const pdpName = (formatId, sel) =>
  PDP_NAME[formatId]?.[sel?.cover] ?? PDP_FAMILY[formatId] ?? null;

/* The stricter one: only when the page IS this configuration. */
export const exactPdpName = (formatId, sel) => PDP_NAME[formatId]?.[sel?.cover] ?? null;

export default function SummaryPanel({
  formatId, state, onChange, mode, sellPrice, onSellPrice,
  sticky = true, ship: shipProp, setShip: setShipProp, actions, onGo,
}) {
  const selling = mode === "sell";
  const bulk = mode === "distribute";
  /* ── The phone bar's own state ──
     Collapsed by default: a bar showing one figure, expanding into this
     same panel as a bottom sheet only when tapped. Irrelevant above 640px,
     where CSS never shows the bar and never hides the aside — see
     index.html. */
  const [expanded, setExpanded] = useState(false);
  const f = CATALOG[formatId];
  const p = priceFor(formatId, state);
  const limit = pageLimit(formatId, state);
  /* White label is never charged for on the Instant Store, so a seller's
     cost can't be affected by it even if it rode in on a seeded spec — the
     addon isn't offered as a toggle here at all (see `addons` below). */
  const sellerSel = selling ? { ...state, addons: state.addons.filter(id => id !== "whitelabel") } : state;
  const cost = sellerCost(formatId, sellerSel);
  const floor = minSellPrice(formatId, sellerSel);
  const derived = derivedSteps(formatId, state);
  const profit = Math.max(0, sellPrice - cost);

  /* A pricier paper can push cost above the asking price — lift it rather
     than leaving the ladder showing zero profit. */
  useEffect(() => { if (selling && sellPrice < floor) onSellPrice(floor); }, [floor, selling]);

  /* Shipping can be owned by the screen instead, so a page that shows
     arrival dates beside the panel is reading the same country and speed
     rather than keeping a second copy of them. */
  const [ownShip, setOwnShip] = useState({ open: false, country: "US", postal: "", speed: "economy" });
  const ship = shipProp ?? ownShip;
  const setShip = setShipProp ?? setOwnShip;
  /* ── What counts as knowing the destination ──
     A maker is receiving the box, so nothing is quoted until there is a
     postcode: a country-level guess would be a number they might plan a
     delivery around. A seller is not receiving anything — their buyers are
     everywhere, so the country they pick IS the destination, and the figure
     is an illustration of what one buyer somewhere pays. So the seller's
     lines appear as soon as a country is chosen, and the maker's total
     waits for the postcode. */
  const quote = selling
    /* The seller has to ask for this. Shipping is not part of their price
       and not part of their margin — the buyer pays it — so showing it
       unasked puts a number next to the margin that has nothing to do with
       it. `show` is set by the Shipping section, which is switched off
       until someone turns it on. */
    ? (ship.show ? shippingFor(ship.country, ship.speed, 1) : null)
    : (ship.postal.trim().length > 1 ? shippingFor(ship.country, ship.speed, state.qty) : null);

  /* ── Shipping answers to the postcode, not to a checkbox ──
     It used to be a block in this panel, then briefly a switch. Both were
     asking a question the postcode already answers: someone who types a
     destination has said they want to see delivery, and someone who clears
     it has said they do not. So the total simply follows — shipping is in
     it while there is a destination, and out of it the moment there is not.

     One state, one place. A checkbox beside a field that means the same
     thing is two controls for one decision, and they can disagree.

     On the selling side it never enters the seller's numbers: the buyer
     pays it, so it appears as what the BUYER pays, on its own lines under
     the ladder. That rule is why this panel exists. */

  const toggleAddon = id => {
    const on = state.addons.includes(id);
    onChange({ ...state, addons: on ? state.addons.filter(a => a !== id) : [...state.addons, id] });
  };

  /* White label is not an option on the profit calculator (Ana, 2026-09-01):
     there's nothing to toggle when it's already free, so the choice is
     removed rather than shown as a free checkbox. It still appears as a
     real upgrade wherever a maker is pricing a copy for themselves. */
  const addons = (f.addons || [])
    .filter(id => !(selling && id === "whitelabel"))
    .map(id => ADDONS.find(a => a.id === id))
    .filter(Boolean);

  /* ── The one figure the phone bar shows ──
     Same headline the panel itself leads with, just read off the numbers
     already computed above rather than recomputed. */
  const barLabel = selling ? "You'd earn" : bulk ? "Run total" : "Total";
  const barValue = selling ? profit : p.total + (quote?.cost ?? 0);

  return (
    /* Clear of the sticky header, whatever height it is at this width —
       App publishes it as --nav-h. The fallback matches the desktop block,
       so a panel rendered before the measurement still lands correctly. */
    <div style={{ ...(sticky ? { position: "sticky", top: "calc(var(--nav-h, 124px) + 16px)" } : null), display: "grid", gap: 12, minWidth: 0 }}>

      {/* ── The phone bar ──
          Invisible above 640px (see .cfg-bar in index.html). Below it, this
          replaces the sticky-top panel entirely: a slim strip pinned to the
          bottom of the viewport, one figure and a tap to open the same
          panel as a sheet. */}
      <button
        className="cfg-bar"
        onClick={() => setExpanded(true)}
        aria-expanded={expanded}
        style={{
          width: "100%", alignItems: "center", justifyContent: "space-between",
          background: T.bgNeutral, border: 0, borderTop: `1px solid ${T.border}`,
          padding: "14px 20px", cursor: "pointer", font: "inherit", color: "inherit",
        }}
      >
        <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: T.textSubtle }}>
          {barLabel}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: TYPE["2xl"], color: C.blue600 }}>
            {money(barValue)}
          </span>
          <span className="ms" style={{ fontSize: 22, color: T.textSubtle }}>expand_less</span>
        </span>
      </button>

      {/* Tapping outside the open sheet closes it, same as tapping its own
          close row. */}
      <div className={`cfg-bar-scrim${expanded ? " open" : ""}`} onClick={() => setExpanded(false)} aria-hidden />

      <aside
        className={`cfg-aside${expanded ? " cfg-aside-open" : ""}`}
        style={{
          background: T.bgNeutral,
          border: `1px solid ${T.border}`, borderRadius: R.lg,
          padding: 22, display: "grid", gap: 14, minWidth: 0,
        }}
      >
        {/* Only rendered as a control on a phone (.show-sm) — the sheet's
            own way to close, since there is no outside click on a bar. */}
        <button
          className="show-sm"
          onClick={() => setExpanded(false)}
          aria-label="Close"
          style={{
            alignItems: "center", justifyContent: "center", gap: 6,
            background: "transparent", border: 0, padding: 0, margin: "-6px 0 0", cursor: "pointer",
            font: "inherit", color: T.textSubtle,
          }}
        >
          <span className="ms" style={{ fontSize: 22 }}>expand_more</span>
          <span style={{ fontSize: TYPE.sm, fontWeight: 700 }}>Close</span>
        </button>

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

        {/* The way out to the product page used to sit here, and now sits in
            the create block at the foot of this panel — one "Learn more about
            this product" per panel, in the same place on every screen, next
            to the actions it is an alternative to. See CreateActions. */}

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
            <MarginLadder cost={cost} price={sellPrice} onPrice={onSellPrice} floor={floor} compact onGo={onGo} />
            <p style={{ fontSize: TYPE.sm, color: T.textSubtle, margin: 0, lineHeight: 1.5 }}>
              Your buyer pays shipping, so your margin is the same wherever they live.
            </p>

            {/* The buyer's total is NOT here. It used to be three lines
                under this ladder, which put the buyer's money inside the
                seller's panel — the one place it must never appear. It now
                sits in the Shipping section beside the checkbox that asks
                for it, where it belongs: with its own control, and out of
                the seller's numbers. */}

            {/* Standalone and always visible (Ana; Anain, 2026-09-01) — this
                used to live only inside CostExplainer's collapsed body,
                which meant seeing it took two clicks nobody made. A plain
                text link directly under that toggle read as one of its
                bullet points rather than its own control, and wrapped
                awkwardly in the 310px panel — so this is its own tinted
                card instead, same shape as the doorways elsewhere in the
                prototype (BulkQuotePanel, the Sell/Pricing swap banner).
                Placed above CostExplainer (Anain, 2026-09-01): the fact
                that the other three routes price differently comes first,
                the explanation of why second. */}
            {onGo && (
              <div style={{
                background: C.blue50, border: `1px solid ${C.blue100}`, borderRadius: R.md,
                padding: 14, display: "grid", gap: 8,
              }}>
                <span style={{ fontSize: TYPE.sm, color: T.textNeutral, lineHeight: 1.5 }}>
                  Amazon, Ingram and the Bookstore each price differently.
                </span>
                <Button
                  variant="text"
                  size="small"
                  iconRight={<ArrowForwardIcon />}
                  onClick={() => onGo("seller")}
                  style={{ justifySelf: "start", padding: 0 }}
                >
                  Compare all four routes
                </Button>
              </div>
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
              {quote && <Line label={`Shipping — ${quote.speed.label}`} value={money(quote.cost)} muted />}
              <Line
                label={quote ? "Total with shipping" : "Total"}
                value={money(p.total + (quote?.cost ?? 0))}
                strong
              />
              {/* A bulk buyer prices the run by the copy — it is the number
                  they will set their own price against. */}
              {bulk && state.qty > 0 && (
                <Line label="Cost per copy" value={money(p.total / state.qty)} accent />
              )}
            </div>
            <p style={{ fontSize: TYPE.sm, color: T.textSubtle, margin: 0, lineHeight: 1.5 }}>
              {quote
                ? "Includes shipping to the postcode you entered. Excludes taxes."
                : "Excludes taxes and shipping — add a postcode to include delivery."}
              {p.tier && " A promo code replaces this discount rather than adding to it."}
            </p>
          </>
        )}

        {/* ── The panel ends on the action, not on a footnote ──
            Someone reading a total is deciding whether to make the thing,
            so the way to make it belongs where the number is — and the
            panel is sticky, which means the action stays in reach while the
            options are changed.

            The provenance note that used to close the panel has moved
            OUTSIDE the card, below. It is a caveat about the figures rather
            than part of the calculation, and every price in this prototype
            is a placeholder: dropping it to make room for a button would
            have been the wrong trade. */}
        {actions && (
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
            {actions}
          </div>
        )}
      </aside>

      {/* ── No provenance line on the selling side (Anain, 2026-08-27) ──
          It said the cost and the margin were placeholders, on the panel
          that exists to show a seller their margin: a caveat under the
          answer undercuts the thing being reviewed, and every figure in
          this prototype is a placeholder anyway. Where it survives is the
          maker's side, which quotes real matrix prices and therefore has a
          real distinction to draw. The blanket statement lives in
          CLAUDE.md and the board's provenance panel. */}
      {!selling && (
        <p style={{ fontSize: TYPE.sm, color: T.textSubtle, margin: 0, lineHeight: 1.5 }}>
          {p.anyGuess
            ? "Some option prices are placeholders. Sizes, per-page rate, paper specs and tiers are real."
            : "Sizes, per-page rate, paper specs and volume tiers are real."}
        </p>
      )}
    </div>
  );
}
