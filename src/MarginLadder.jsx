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

/* A number you are reading, not typing. Clicking it takes control. */
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

/* A number you are typing. Chevrons stack to the field height, Codex
   borders, matching the steppers elsewhere in the prototype. */
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

  const chevron = {
    width: 30, height: compact ? 17 : 19, padding: 0,
    border: `1px solid ${T.borderStrong}`, background: T.bgNeutral,
    display: "grid", placeItems: "center", color: T.textNeutral,
  };
  const atMin = value <= min;

  return (
    <span style={{ display: "flex", alignItems: "stretch", gap: 6, minWidth: 0 }}>
      <span style={{
        flex: 1, minWidth: 0, minHeight: compact ? 38 : 42,
        display: "flex", alignItems: "center", gap: 6, padding: "0 10px",
        border: `2px solid ${T.borderBrand}`, borderRadius: R.md, background: T.bgNeutral,
      }}>
        <span style={{ fontSize: TYPE.base, color: T.textSubtle }}>US $</span>
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
      <span style={{ display: "grid", gap: 2, alignSelf: "center", flex: "0 0 auto" }}>
        <button style={{ ...chevron, borderRadius: "4px 4px 0 0", marginBottom: -1 }}
          onClick={() => step(1)} aria-label="More">
          <span className="ms" style={{ fontSize: 16 }}>keyboard_arrow_up</span>
        </button>
        <button
          style={{ ...chevron, borderRadius: "0 0 4px 4px", opacity: atMin ? 0.35 : 1, cursor: atMin ? "not-allowed" : "pointer" }}
          onClick={() => step(-1)} disabled={atMin} aria-label="Less">
          <span className="ms" style={{ fontSize: 16 }}>keyboard_arrow_down</span>
        </button>
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

export default function MarginLadder({ cost, price, onPrice, floor, compact, plain }) {
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
        <Row label="Your cost" sub="What Blurb charges you to print it">{amount(cost)}</Row>

        <Row
          label="Your price"
          sub={driver === "price" ? "You set this" : "Click to set it instead"}
          onClick={driver === "price" ? undefined : () => take("price")}
        >
          {driver === "price"
            ? <Entry value={price} min={floor} onChange={onPrice} compact />
            : amount(price)}
        </Row>

        <Row
          label="Your profit"
          sub={driver === "profit" ? "You set this" : "Click to set it instead"}
          onClick={driver === "profit" ? undefined : () => take("profit")}
          last
        >
          {driver === "profit"
            ? <Entry value={profit} min={0} onChange={p => onPrice(Math.round((cost + p) * 100) / 100)} compact />
            : amount(profit)}
        </Row>

        <p style={{ margin: "12px 0 0", fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.55 }}>
          {driver === "profit"
            ? "Set what you need to earn and we work out the price. Change the paper and your earnings hold — your buyer pays the difference."
            : "Set what your buyer pays and we work out the rest. Change the paper and the price holds — the difference comes out of your profit."}
        </p>
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
        <Cell label="Your cost" sub="What Blurb charges you" compact={compact}>
          <Figure value={cost} compact={compact} />
        </Cell>

        <Cell
          label="Your price"
          sub={driver === "price" ? "You set this" : "Click to set it instead"}
          tone={driver === "profit" ? "loud" : "quiet"}
          onClick={driver === "price" ? undefined : () => take("price")}
          compact={compact}
        >
          {driver === "price"
            ? <Entry value={price} min={floor} onChange={onPrice} compact={compact} />
            : <Figure value={price} loud compact={compact} />}
        </Cell>

        <Cell
          label="Your profit"
          sub={driver === "profit" ? "You set this" : "Click to set it instead"}
          tone={driver === "price" ? "loud" : "quiet"}
          onClick={driver === "profit" ? undefined : () => take("profit")}
          compact={compact}
        >
          {driver === "profit"
            ? <Entry value={profit} min={0} onChange={p => onPrice(Math.round((cost + p) * 100) / 100)} compact={compact} />
            : <Figure value={profit} loud compact={compact} />}
        </Cell>
      </div>

      <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.55 }}>
        {driver === "profit"
          ? "Set what you need to earn and we work out the price. Change the paper and your earnings hold — your buyer pays the difference."
          : "Set what your buyer pays and we work out the rest. Change the paper and the price holds — the difference comes out of your profit."}
      </p>
    </div>
  );
}
