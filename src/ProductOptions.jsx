import React, { useState } from "react";
import { C, T, TYPE, R, FONT_BODY } from "./tokens.js";
import { OptionCard } from "./Configurator.jsx";
import { CATALOG, availableFor, reconcile, unitPrice, derivedSteps, money } from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   Product options, the way the PDP asks them.

   This was the PDP's own layout — label with Details, the current choice
   named underneath, size as swatches, everything else as text buttons.
   The calculators asked the same questions through <select> menus, which
   is a different answer to the same problem: two ways to choose a paper,
   one of which hides what the choice costs.

   So the PDP's version won and moved here. The calculators use it, the
   PDP uses it, and a size chip cannot look like one thing on a product
   page and another on a pricing page.

   Modifiers are computed against the cheapest available option in the
   same group, with the rest of the specification held still — so "+US
   $9.00" means what it says for the book currently configured, and
   recomputes when the paper changes.
   ──────────────────────────────────────────────────────────────── */

/* One selection group, laid out as the live PDP lays it out: a bold
   sentence-case label with Details opposite, the current choice named
   underneath, then the control, then a rule. Not the configurator's
   uppercase summary voice and not its StepHeading — a product page is not
   a numbered flow, and the live page is the reference for this block.

   Details is not decoration: it toggles the spec Blurb shows in its own
   Details modal — paper weights, trim sizes — from data the catalog
   already carries. A control that opened nothing would be worse than none. */
export function Field({ label, value, children, detailsOpen, onDetails, note }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: TYPE.base, fontWeight: 700 }}>{label}</span>
        {onDetails && (
          <button
            onClick={onDetails}
            aria-expanded={detailsOpen}
            style={{
              font: "inherit", fontSize: TYPE.sm, fontWeight: 600, color: T.textBrand,
              background: "transparent", border: 0, padding: 0, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 4,
            }}
          >
            <span className="ms" style={{ fontSize: 16 }}>info</span>
            Details
          </button>
        )}
      </div>
      {value && <div style={{ fontSize: TYPE.base, color: T.textNeutral }}>{value}</div>}
      {note && <div style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.6 }}>{note}</div>}
      <div style={{ marginTop: 2 }}>{children}</div>
    </div>
  );
}


/* One group: its label, the choice as words, and the options themselves.
   Sizes get swatches because a size is a shape; everything else is a word
   and gets a text button. */
export function OptionGroup({
  label, value, options, selected, onPick, available, variant = "text",
  modifier, detailsOpen, onDetails, note, footer,
}) {
  const thumb = variant === "thumb";
  return (
    <Field
      label={label}
      value={value}
      note={note}
      detailsOpen={detailsOpen}
      onDetails={onDetails}
    >
      <div style={
        thumb
          ? { display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))" }
          : { display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }
      }>
        {options.map(o => (
          <OptionCard
            key={o.id}
            variant={variant}
            title={thumb ? (o.dims ? o.dims.split(" (")[0] : o.label) : o.label}
            sub={thumb && detailsOpen ? o.label : null}
            spec={!thumb && detailsOpen ? o.spec : null}
            note={thumb && detailsOpen && modifier ? modifier(o.id) : null}
            selected={o.id === selected}
            disabled={available ? !available.has(o.id) : false}
            onClick={() => onPick(o.id)}
          />
        ))}
      </div>
      {footer}
    </Field>
  );
}

/* Every group a format has, in the catalogue's order. */
export default function ProductOptions({ formatId, state, onChange }) {
  const f = CATALOG[formatId];
  const derived = derivedSteps(formatId, state);
  const [details, setDetails] = useState(() => new Set());
  const toggle = id => setDetails(d => {
    const next = new Set(d);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const set = (groupId, id) => {
    const next = reconcile(formatId, { ...state, [groupId]: id }, groupId);
    onChange(next);
  };

  /* The cheapest buildable option in a group, holding everything else
     still — the baseline every modifier is measured from. */
  const modifierFor = groupId => id => {
    const options = f.groups.find(g => g.id === groupId).options;
    const prices = options
      .map(o => unitPrice(formatId, { ...state, [groupId]: o.id }))
      .filter(n => n != null);
    if (!prices.length) return null;
    const cheapest = Math.min(...prices);
    const mine = unitPrice(formatId, { ...state, [groupId]: id });
    if (mine == null) return null;
    return mine - cheapest === 0 ? "+US $0.00" : `+${money(mine - cheapest)}`;
  };

  return (
    <div style={{ display: "grid", gap: 24, fontFamily: FONT_BODY }}>
      {f.groups.map(g => {
        const label = g.label.replace(/^choose your\s+/i, "");
        const pretty = label.charAt(0).toUpperCase() + label.slice(1);
        const chosen = g.options.find(o => o.id === state[g.id]);
        const mod = modifierFor(g.id);
        const isSize = g.id === "size";
        return (
          <OptionGroup
            key={g.id}
            label={pretty}
            value={chosen ? `${chosen.label}${isSize ? ` (${mod(chosen.id) ?? "not available"})` : ""}` : null}
            options={g.options}
            selected={state[g.id]}
            onPick={id => set(g.id, id)}
            available={availableFor(formatId, state, g.id)}
            variant={isSize ? "thumb" : "text"}
            modifier={mod}
            detailsOpen={details.has(g.id)}
            onDetails={() => toggle(g.id)}
            note={g.note}
          />
        );
      })}

      {/* Steps that follow from a choice rather than offering one — a
          magazine's paper and cover. Shown, so the specification is
          complete, but not offered as a decision. */}
      {derived.map(d => (
        <Field key={d.id} label={d.label.replace(/^your\s+/i, "")} value={`${d.option.label} — included`} />
      ))}
    </div>
  );
}
