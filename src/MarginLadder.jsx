import React, { useState, useEffect } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import { money } from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   Your cost → your price → your profit → your margin.

   All three are live fields all the time (Anain, 2026-09-03) — it used
   to be a click-to-take-over switch (one field a plain figure, the
   other an input with a pencil), which cost an extra tap before typing
   and swapped which DOM node rendered under the seller's finger. Now
   every field is always the input; typing into any one of them just
   works, and nothing jumps.

   `driver` still exists, silently: whichever field the seller last
   typed into is the one held steady when the SPEC changes underneath
   it (a paper upgrade, a size change) — the other two move instead.
   PROFIT-DRIVEN IS THE DEFAULT when selling, because that's usually the
   number a seller has already decided on.
   ──────────────────────────────────────────────────────────────── */

function Cell({ label, sub, children, compact }) {
  return (
    <div style={{ display: "grid", gap: 4, minWidth: 0, padding: compact ? "2px 0" : 0 }}>
      <span style={{
        fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
        color: T.textSubtle,
      }}>
        {label}
      </span>
      {children}
      <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.4 }}>{sub}</span>
    </div>
  );
}

/* A number you are reading, not typing. */
function Figure({ value, loud, compact }) {
  return (
    <span style={{
      fontFamily: FONT_DISPLAY, fontWeight: 700, lineHeight: 1,
      fontSize: compact ? TYPE["4xl"] : loud ? TYPE["7xl"] : TYPE["5xl"],
      color: loud ? C.blue600 : T.textNeutral,
      display: "flex", alignItems: "baseline", gap: 8,
    }}>
      {money(value)}
    </span>
  );
}

/* ── The number you are typing ──
   Codex's Quantity Selector (Single-page Checkout 12442:88383), the same
   control Pages and Copies use in this panel: three segments joined into
   one object, borders collapsed with a −1px margin, #989898, and 4px on
   the OUTER corners only. Vertical chevrons hung off the side of the field
   were ours, not the system's.

   Two departures, both to keep it a price rather than a count. The value
   segment grows to fill the column instead of sitting at 48px, because it
   holds "US $12.99" and not "12". And it keeps the ladder's display type:
   this is the number the page exists to produce, and 18px regular would
   make the seller's profit the quietest figure in the panel.

   ±1 a click. Cents are typed. */
const SEG_H = compact => (compact ? 38 : 42);
const seg = compact => ({
  height: SEG_H(compact), flex: "0 0 auto", width: 44,
  background: T.bgNeutral, border: `1px solid ${T.borderStrong}`,
  display: "grid", placeItems: "center", color: T.textNeutral, cursor: "pointer",
});

/* `unit`: "currency" prefixes "US $" and steps in dollars; "percent" suffixes
   "%" and steps in whole points, clamped below 100 since a 100% margin
   divides the price by zero. Same field either way — the margin driver is
   this component with a different unit, not a new one. */
function Entry({ value, min, max = Infinity, onChange, compact, unit = "currency" }) {
  const fmt = v => (unit === "percent" ? String(Math.round(v)) : v.toFixed(2));
  const [raw, setRaw] = useState(fmt(value));
  const [editing, setEditing] = useState(false);
  useEffect(() => { if (!editing) setRaw(fmt(value)); }, [value, editing]);

  const parsed = parseFloat(raw);
  const clamp = v => Math.min(max, Math.max(min, v));
  const commit = () => {
    setEditing(false);
    const next = Number.isFinite(parsed) ? clamp(parsed) : min;
    setRaw(fmt(next));
    onChange(next);
  };
  const step = d => {
    const from = Number.isFinite(parsed) ? parsed : value;
    const next = clamp(Math.round((from + d) * 100) / 100);
    setEditing(false);
    setRaw(fmt(next));
    onChange(next);
  };

  const S = seg(compact);
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <span style={{ display: "flex", alignItems: "stretch", minWidth: 0 }}>
      <button
        style={{ ...S, borderRadius: "4px 0 0 4px", marginRight: -1,
                 opacity: atMin ? 0.35 : 1, cursor: atMin ? "not-allowed" : "pointer" }}
        onClick={() => step(-1)} disabled={atMin} aria-label="Less"
      >
        <span className="ms" style={{ fontSize: 22 }}>remove</span>
      </button>

      <span style={{
        flex: "1 1 auto", minWidth: 0, height: SEG_H(compact), marginRight: -1,
        display: "flex", alignItems: "center", gap: unit === "percent" ? 2 : 6, padding: "0 10px",
        border: `1px solid ${T.borderStrong}`, background: T.bgNeutral,
      }}>
        {/* One line. "US $" broke over two the moment the field narrowed. */}
        {unit === "currency" && (
          <span style={{ fontSize: TYPE.base, color: T.textSubtle, whiteSpace: "nowrap", flex: "0 0 auto" }}>US $</span>
        )}
        <input
          type="text" inputMode="decimal" value={raw}
          onFocus={e => { setEditing(true); e.target.select(); }}
          onChange={e => {
            const v = e.target.value;
            if (!/^\d*\.?\d*$/.test(v)) return;
            setRaw(v);
            const n = parseFloat(v);
            if (Number.isFinite(n)) onChange(clamp(n));
          }}
          onBlur={commit}
          onKeyDown={e => e.key === "Enter" && e.currentTarget.blur()}
          style={{
            border: 0, outline: "none", width: "100%", minWidth: 0, background: "transparent",
            fontFamily: FONT_DISPLAY, fontWeight: 700, color: C.blue600,
            fontSize: compact ? TYPE["3xl"] : TYPE["4xl"],
            /* Right-aligned in every unit, so the three cells in the ladder
               (price, profit, margin) read as a column of numbers rather
               than each sitting wherever its prefix happens to end. */
            textAlign: "right",
          }}
        />
        {/* Same size, weight and colour as the digits — a smaller, quieter
            "%" read as a footnote next to the number it belongs to. */}
        {unit === "percent" && (
          <span style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700, color: C.blue600,
            fontSize: compact ? TYPE["3xl"] : TYPE["4xl"],
            whiteSpace: "nowrap", flex: "0 0 auto",
          }}>%</span>
        )}
      </span>

      <button
        style={{ ...S, borderRadius: "0 4px 4px 0", opacity: atMax ? 0.35 : 1, cursor: atMax ? "not-allowed" : "pointer" }}
        onClick={() => step(1)} disabled={atMax} aria-label="More"
      >
        <span className="ms" style={{ fontSize: 22 }}>add</span>
      </button>
    </span>
  );
}


/* ── One row of the plain summary ──
   8/21 pod: "the summary section for margin calculator — same thing without
   the visuals." Two rules point the same way. Utilitarian is the obvious
   one: a summary is read, and display type competes with the numbers it is
   summarising. The sharper reason is the pricing rule — the fulfilment price
   is a line in a calculation, never a price tag, and visual treatment is
   exactly what turns a number into a price tag. Plain rows keep cost → price
   → profit reading as arithmetic the seller is doing. */
function Row({ label, sub, children, last }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        padding: "10px 0", borderBottom: last ? 0 : `1px solid ${T.border}`,
        minWidth: 0,
      }}
    >
      <span style={{ display: "grid", gap: 2, minWidth: 0 }}>
        <span style={{ fontSize: TYPE.base, fontWeight: 600 }}>{label}</span>
        {sub && <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>{sub}</span>}
      </span>
      <span style={{ flex: "0 0 auto" }}>{children}</span>
    </div>
  );
}

/* "Instant Store" links out to the page that explains the thing itself
   (Anain, 2026-09-01) — someone reading this ladder may not know what an
   Instant Store is yet, and the cost line is where that question first
   comes up. A plain string elsewhere in this component; JSX only where
   `onGo` makes the link possible. */
function CostSub({ onGo }) {
  return (
    <>
      What Blurb charges you for your{" "}
      {onGo ? (
        <button
          onClick={() => onGo("instantstore")}
          style={{
            font: "inherit", color: "inherit", textDecoration: "underline",
            background: "transparent", border: 0, padding: 0, cursor: "pointer",
          }}
        >
          Instant Store
        </button>
      ) : "Instant Store"}
      . Set by your specification.
    </>
  );
}

/* A margin as a percent of price, not of cost — "40% margin" means 40% of
   what the buyer pays is profit, the way a seller already talks about
   margin. `MARGIN_MAX` keeps the field short of 100: at 100% the price
   would have to be infinite to leave any cost covered. */
const MARGIN_MAX = 90;

export default function MarginLadder({ cost, price, onPrice, floor, compact, plain, onGo }) {
  const [driver, setDriver] = useState("profit");
  const profit = Math.max(0, price - cost);
  const margin = price > 0 ? Math.min(MARGIN_MAX, (profit / price) * 100) : 0;

  /* Profit-driven means the profit is what survives a spec change: when
     cost moves, the price follows and the earnings hold. Margin-driven
     holds the same way, on the percentage instead of the dollar amount. */
  useEffect(() => {
    if (driver === "profit") {
      const next = Math.round((cost + profit) * 100) / 100;
      if (Math.abs(next - price) > 0.005) onPrice(next);
    } else if (driver === "margin") {
      const next = Math.round((cost / (1 - margin / 100)) * 100) / 100;
      if (Math.abs(next - price) > 0.005) onPrice(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cost]);

  useEffect(() => { if (price < floor) onPrice(floor); }, [floor, price]);

  /* Each field is live all the time now (Anain, 2026-09-03) — the
     click-to-take-over step and the Ghost/Entry swap it caused were an
     extra motion and a layout jump for a seller who just wants to type a
     number. `driver` still exists, just silently: it is only read by the
     effect above, to decide what a spec change should hold steady. Typing
     into any of the three sets it without the seller doing anything to
     "select" a field first. */
  const setPrice = v => { setDriver("price"); onPrice(v); };
  const setProfit = p => { setDriver("profit"); onPrice(Math.round((cost + p) * 100) / 100); };
  const setMargin = pct => {
    setDriver("margin");
    const bounded = Math.min(MARGIN_MAX, Math.max(0, pct));
    onPrice(Math.round((cost / (1 - bounded / 100)) * 100) / 100);
  };

  if (plain) {
    const amount = v => (
      <span style={{ fontFamily: FONT_BODY, fontSize: TYPE.xl, fontWeight: 700, color: T.textNeutral }}>
        {money(v)}
      </span>
    );
    return (
      <div style={{ fontFamily: FONT_BODY, display: "grid" }}>
        <Row label="Your cost" sub={<CostSub onGo={onGo} />}>{amount(cost)}</Row>

        <Row label="Your listing price">
          <Entry value={price} min={floor} onChange={setPrice} compact />
        </Row>

        <Row label="Your profit">
          <Entry value={profit} min={0} onChange={setProfit} compact />
        </Row>

        <Row label="Your margin" last>
          <Entry value={margin} min={0} max={MARGIN_MAX} onChange={setMargin} compact unit="percent" />
        </Row>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: compact ? 12 : 16, fontFamily: FONT_BODY }}>
      <div style={{
        display: "grid", gap: compact ? 12 : 20,
        gridTemplateColumns: compact ? "1fr" : "repeat(auto-fit, minmax(190px, 1fr))",
        alignItems: "start",
      }}>
        <Cell label="Your cost" sub={<CostSub onGo={onGo} />} compact={compact}>
          <Figure value={cost} compact={compact} />
        </Cell>

        <Cell label="Your listing price" compact={compact}>
          <Entry value={price} min={floor} onChange={setPrice} compact={compact} />
        </Cell>

        <Cell label="Your profit" compact={compact}>
          <Entry value={profit} min={0} onChange={setProfit} compact={compact} />
        </Cell>

        <Cell label="Your margin" sub="Profit as a share of your price" compact={compact}>
          <Entry value={margin} min={0} max={MARGIN_MAX} onChange={setMargin} compact={compact} unit="percent" />
        </Cell>
      </div>
    </div>
  );
}
