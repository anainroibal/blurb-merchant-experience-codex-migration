import React, { useState, useEffect } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import { money } from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   Your cost → your price → your profit.

   Two ways to drive it, and the switch IS the ladder rather than a
   control beside it: the two numbers you could own are both live, and
   clicking one hands it the input. No toggle to find, no label to read
   first, and the relationship teaches itself — take hold of one and
   watch the other move.

   PROFIT-DRIVEN IS THE DEFAULT when selling. It is how Blurb's own
   Bookstore works ("enter your desired profit, and we'll calculate the
   final retail price"), and it matches what a seller has usually already
   decided: what this needs to earn per copy. Price-driven suits the
   opposite case — a price already announced, which cannot move.

   The difference only shows when the SPEC changes, so the ladder says
   what will happen before it happens.
   ──────────────────────────────────────────────────────────────── */

function Cell({ label, sub, children, tone = "quiet", onClick, compact }) {
  const loud = tone === "loud";
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? e => (e.key === "Enter" || e.key === " ") && onClick() : undefined}
      className={onClick ? "card-move" : undefined}
      style={{
        display: "grid", gap: 4, minWidth: 0, padding: compact ? "2px 0" : 0,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <span style={{
        fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
        color: loud ? C.blue600 : T.textSubtle,
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

function Entry({ value, min, onChange, compact }) {
  const [raw, setRaw] = useState(value.toFixed(2));
  const [editing, setEditing] = useState(false);
  useEffect(() => { if (!editing) setRaw(value.toFixed(2)); }, [value, editing]);

  const parsed = parseFloat(raw);
  const commit = () => {
    setEditing(false);
    const next = Number.isFinite(parsed) ? Math.max(min, parsed) : min;
    setRaw(next.toFixed(2));
    onChange(next);
  };
  const step = d => {
    const from = Number.isFinite(parsed) ? parsed : value;
    const next = Math.max(min, Math.round((from + d) * 100) / 100);
    setEditing(false);
    setRaw(next.toFixed(2));
    onChange(next);
  };

  const S = seg(compact);
  const atMin = value <= min;

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
        display: "flex", alignItems: "center", gap: 6, padding: "0 10px",
        border: `1px solid ${T.borderStrong}`, background: T.bgNeutral,
      }}>
        {/* One line. "US $" broke over two the moment the field narrowed. */}
        <span style={{ fontSize: TYPE.base, color: T.textSubtle, whiteSpace: "nowrap", flex: "0 0 auto" }}>US $</span>
        <input
          type="text" inputMode="decimal" value={raw}
          onFocus={e => { setEditing(true); e.target.select(); }}
          onChange={e => {
            const v = e.target.value;
            if (!/^\d*\.?\d*$/.test(v)) return;
            setRaw(v);
            const n = parseFloat(v);
            if (Number.isFinite(n)) onChange(Math.max(min, n));
          }}
          onBlur={commit}
          onKeyDown={e => e.key === "Enter" && e.currentTarget.blur()}
          style={{
            border: 0, outline: "none", width: "100%", minWidth: 0, background: "transparent",
            fontFamily: FONT_DISPLAY, fontWeight: 700, color: C.blue600,
            fontSize: compact ? TYPE["3xl"] : TYPE["4xl"],
          }}
        />
      </span>

      <button style={{ ...S, borderRadius: "0 4px 4px 0" }} onClick={() => step(1)} aria-label="More">
        <span className="ms" style={{ fontSize: 22 }}>add</span>
      </button>
    </span>
  );
}

/* ── The number you could be typing, but are not ──
   Three numbers, three states, and until now only two treatments: the one
   being typed was a field, and the other two were the same plain figure. So
   half of what a seller can change looked as fixed as the one thing they
   cannot (Ana, DES-482).

   Cost keeps the plain figure — it has no box, because there is nothing to
   type into. Price and profit are always a field: the one driving the
   ladder wears the whole quantity selector, the other is its value segment
   alone, with the pencil in place of the two buttons. Taking it over gives
   it the buttons back. */
function Ghost({ value, compact, loud }) {
  const [hot, setHot] = useState(false);
  return (
    <span
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      style={{
        display: "flex", alignItems: "center", gap: 6, minWidth: 0,
        height: SEG_H(compact), padding: "0 10px",
        border: `1px solid ${hot ? T.borderBrand : T.borderStrong}`,
        borderRadius: 4, background: T.bgNeutral,
        transition: "border-color 120ms ease",
      }}
    >
      <span style={{ fontSize: TYPE.base, color: T.textSubtle, whiteSpace: "nowrap", flex: "0 0 auto" }}>US $</span>
      <span style={{
        flex: 1, minWidth: 0,
        /* Blue where this is the number the ladder just worked out, so the
           answer still reads as the answer inside its field. */
        fontFamily: FONT_DISPLAY, fontWeight: 700, color: loud ? C.blue600 : T.textNeutral,
        fontSize: compact ? TYPE["3xl"] : TYPE["4xl"],
      }}>
        {value.toFixed(2)}
      </span>
      <span className="ms" style={{ fontSize: 18, color: hot ? T.textBrand : T.textSubtle, flex: "0 0 auto" }}>
        edit
      </span>
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
function Row({ label, sub, children, onClick, last }) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? e => (e.key === "Enter" || e.key === " ") && onClick() : undefined}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        padding: "10px 0", borderBottom: last ? 0 : `1px solid ${T.border}`,
        cursor: onClick ? "pointer" : "default", minWidth: 0,
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

export default function MarginLadder({ cost, price, onPrice, floor, compact, plain, onGo }) {
  const [driver, setDriver] = useState("profit");
  const profit = Math.max(0, price - cost);

  /* Profit-driven means the profit is what survives a spec change: when
     cost moves, the price follows and the earnings hold. */
  useEffect(() => {
    if (driver !== "profit") return;
    const next = Math.round((cost + profit) * 100) / 100;
    if (Math.abs(next - price) > 0.005) onPrice(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cost]);

  useEffect(() => { if (price < floor) onPrice(floor); }, [floor, price]);

  const take = next => setDriver(next);

  if (plain) {
    const amount = v => (
      <span style={{ fontFamily: FONT_BODY, fontSize: TYPE.xl, fontWeight: 700, color: T.textNeutral }}>
        {money(v)}
      </span>
    );
    return (
      <div style={{ fontFamily: FONT_BODY, display: "grid" }}>
        <Row label="Your cost" sub={<CostSub onGo={onGo} />}>{amount(cost)}</Row>

        <Row
          label="Your listing price"
          onClick={driver === "price" ? undefined : () => take("price")}
        >
          {driver === "price"
            ? <Entry value={price} min={floor} onChange={onPrice} compact />
            : <Ghost value={price} compact />}
        </Row>

        <Row
          label="Your profit"
          onClick={driver === "profit" ? undefined : () => take("profit")}
          last
        >
          {driver === "profit"
            ? <Entry value={profit} min={0} onChange={p => onPrice(Math.round((cost + p) * 100) / 100)} compact />
            : <Ghost value={profit} compact />}
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

        <Cell
          label="Your listing price"
          tone={driver === "profit" ? "loud" : "quiet"}
          onClick={driver === "price" ? undefined : () => take("price")}
          compact={compact}
        >
          {driver === "price"
            ? <Entry value={price} min={floor} onChange={onPrice} compact={compact} />
            : <Ghost value={price} loud compact={compact} />}
        </Cell>

        <Cell
          label="Your profit"
          tone={driver === "price" ? "loud" : "quiet"}
          onClick={driver === "profit" ? undefined : () => take("profit")}
          compact={compact}
        >
          {driver === "profit"
            ? <Entry value={profit} min={0} onChange={p => onPrice(Math.round((cost + p) * 100) / 100)} compact={compact} />
            : <Ghost value={profit} loud compact={compact} />}
        </Cell>
      </div>
    </div>
  );
}
