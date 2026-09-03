import React, { useState } from "react";
import { RadioCard, RadioCardGroup } from "@blurb/codex-react";
import { C, T, TYPE, R, FONT_BODY } from "./tokens.js";
import { OptionCard } from "./Configurator.jsx";
import Modal from "./Modal.jsx";
import { CATALOG, availableFor, reconcile, derivedSteps, pageLimit, priceFor, money, FULFILMENT_FACTOR } from "./catalog.js";

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

   No price modifiers on the options themselves — see the note above
   ProductOptions for why. The price lives in the summary panel, where it
   is one number for the book in front of you.
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


/* ── A size swatch ──
   The tile IS the control and the label sits under it, outside the frame —
   which is what the live PDP does, and what my first pass got wrong by
   wrapping both in a bordered card. Only the chosen tile is outlined;
   the rest have a transparent border of the same width so choosing one
   cannot nudge the row.

   Inside each tile is a white rectangle in the real proportions of that
   size, scaled against the largest size in the group: a 12×12 reads
   bigger than a 7×7, and an 8×10 reads taller than it is wide. That is
   the whole point of showing a shape rather than a glyph — the control
   answers "what will this look like" before the label does. */
function SizeSwatch({ option, selected, disabled, maxDim, delta }) {
  const [w, h] = (option.dims?.match(/[\d.]+/g) || [1, 1]).slice(0, 2).map(Number);
  const scale = 0.78 / (maxDim || Math.max(w, h));
  return (
    <RadioCard
      value={option.id}
      disabled={disabled}
      className="radiocard-flush"
      title={disabled ? "Not available with the rest of your selection" : option.label}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        display: "grid", justifyItems: "center", gap: 8, minWidth: 0,
        opacity: disabled ? 0.4 : 1, fontFamily: FONT_BODY,
        /* The ring this option needs rings the swatch tile below, not the
           whole card — RadioCard's own ring would sit around the label and
           delta too, so it's switched off here rather than recoloured. */
        "--codex-color-semantic-border-link-active": "transparent",
      }}
    >
      <span style={{
        display: "grid", placeItems: "center", width: "100%", aspectRatio: "1 / 1",
        background: C.gray100, borderRadius: 8,
        border: `2px solid ${selected ? C.gray950 : "transparent"}`,
        boxSizing: "border-box",
        transition: "border-color var(--nav-hover) var(--nav-ease)",
      }}>
        <span style={{
          display: "block", background: "#fff", borderRadius: 2,
          width: `${w * scale * 100}%`, height: `${h * scale * 100}%`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
        }} />
      </span>
      <span style={{ fontSize: TYPE.sm, color: C.gray950, lineHeight: 1.3, textAlign: "center" }}>
        {option.dims ? option.dims.split(" (")[0] : option.label}
      </span>
      {/* What switching to this size would add to, or take off, the book as
          configured now — see the note on OptionGroup below for why this is
          measured against the current specification, not the cheapest size.

          Always rendered, even with nothing to say — the option you've
          already picked and any option priced the same have no delta, and
          an omitted line there used to make those cards shorter than their
          neighbours. A row of swatches must line up regardless of which
          one has something to report. */}
      <span style={{
        fontSize: TYPE.sm, fontWeight: 700, color: C.gray950, lineHeight: 1.3,
        visibility: delta ? "visible" : "hidden",
      }}>
        {delta || " "}
      </span>
    </RadioCard>
  );
}

/* One group: its label, the choice as words, and the options themselves.
   Sizes get swatches because a size is a shape; everything else is a word
   and gets a text button. */
export function OptionGroup({
  label, value, options, selected, onPick, available, variant = "text",
  detailsOpen, onDetails, note, footer, trayNote, deltas,
}) {
  const thumb = variant === "thumb";
  const chosen = options.find(o => o.id === selected);
  const maxDim = Math.max(
    ...options.flatMap(x => (x.dims?.match(/[\d.]+/g) || [1]).slice(0, 2).map(Number))
  );

  /* The controls, drawn once and used twice — inline, and again inside the
     tray. Reading about a paper and choosing it are the same gesture there,
     so the tray holds the real control rather than a picture of it. */
  const controls = (
    <RadioCardGroup
      value={selected}
      onValueChange={onPick}
      aria-label={label}
      style={
        thumb
          ? { display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(74px, 84px))" }
          : { display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }
      }
    >
      {thumb
        ? options.map(o => (
            <SizeSwatch
              key={o.id}
              option={o}
              selected={o.id === selected}
              disabled={available ? !available.has(o.id) : false}
              maxDim={maxDim}
              delta={deltas?.[o.id]}
            />
          ))
        : options.map(o => (
            <OptionCard
              key={o.id}
              value={o.id}
              variant="text"
              title={o.label}
              delta={deltas?.[o.id]}
              selected={o.id === selected}
              disabled={available ? !available.has(o.id) : false}
            />
          ))}
    </RadioCardGroup>
  );

  return (
    <>
      <Field label={label} value={value} note={note} onDetails={onDetails} detailsOpen={detailsOpen}>
        {controls}
        {footer}
      </Field>

      {/* ── Details opens a tray, not an inline reveal ──
          The specification is reading material: a paper weight, a coating, a
          trim size in two units. Inline it pushed every other choice down
          the page and made the group taller the more you wanted to know.
          In a tray it sits beside a picture of the thing, with the controls
          repeated so a decision can be made while reading rather than
          after remembering. */}
      <Modal open={!!detailsOpen} variant="side" title={label} onClose={onDetails}>
        <div style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: TYPE.base, fontWeight: 700 }}>
            {chosen?.label}
            {chosen?.dims ? ` (${chosen.dims.replace(" (", ", ").replace(")", "")})` : ""}
            {!chosen?.dims && chosen?.spec ? ` (${chosen.spec})` : ""}
          </span>
          {trayNote && (
            <span style={{ fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.6 }}>{trayNote}</span>
          )}
          {!trayNote && chosen?.spec && chosen?.dims && (
            <span style={{ fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.6 }}>{chosen.spec}</span>
          )}
          {chosen?.maxPages && (
            <span style={{ fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.6 }}>
              Up to {chosen.maxPages} pages.
            </span>
          )}
        </div>

        {footer}

        {controls}

        {/* Where the live tray shows a photograph of the option. Ours is a
            placeholder with the same caption, because the prototype ships
            no photography — the shape of the tray is the point. */}
        <div style={{
          marginTop: 4, background: C.gray100, borderRadius: R.md, minHeight: 300,
          position: "relative",
        }}>
          <span style={{
            position: "absolute", top: 12, left: 12, background: "#fff",
            border: `1px solid ${T.border}`, borderRadius: R.sm, padding: "4px 10px",
            fontSize: TYPE.sm,
          }}>
            {chosen?.label}
            {chosen?.dims ? ` (${chosen.dims.replace(" (", ", ").replace(")", "")})` : ""}
          </span>
        </div>
      </Modal>
    </>
  );
}

/* Every group a format has, in the catalogue's order. */
export default function ProductOptions({ formatId, state, onChange, mode = "make" }) {
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

  /* ── "+US $3" per option, measured from the book on screen ──
     This used to be "no deltas anywhere" — every group named its choice in
     words alone, because a modifier measured against the cheapest option in
     the group floats: the same size reads "+US $9.00" on one paper and
     nothing on another, and no card says which book its zero belongs to.

     Ana's review (DES-482 #2) asked for the number back, so it returns here
     the way Configurator.jsx already does it for Get Started — measured
     against THE BOOK IN FRONT OF YOU, not the cheapest option in the step.
     Every option then answers one question, what does switching to this
     cost me from where I am now, and the option you are already on carries
     no figure. On the selling path the delta counts in the seller's cost,
     not the retail price, so it moves the panel total by exactly what it
     names. */
  const scale = mode === "sell" ? FULFILMENT_FACTOR : 1;
  const deltasFor = g => {
    const avail = availableFor(formatId, state, g.id);
    const prices = {};
    g.options.forEach(o => {
      if (!avail.has(o.id)) return;
      const next = reconcile(formatId, { ...state, [g.id]: o.id }, g.id);
      const cap = pageLimit(formatId, next);
      if (next.pages > cap) next.pages = cap;
      prices[o.id] = priceFor(formatId, next).unit;
    });
    const base = prices[state[g.id]];
    const out = {};
    g.options.forEach(o => {
      if (!avail.has(o.id) || base == null) return;
      const d = (prices[o.id] - base) * scale;
      if (Math.abs(d) >= 0.005) out[o.id] = `${d > 0 ? "+" : "−"}${money(Math.abs(d))}`;
    });
    return out;
  };

  return (
    <div style={{ display: "grid", gap: 24, fontFamily: FONT_BODY }}>
      {f.groups.map(g => {
        const label = g.label.replace(/^choose your\s+/i, "");
        const pretty = label.charAt(0).toUpperCase() + label.slice(1);
        const chosen = g.options.find(o => o.id === state[g.id]);
        const isSize = g.id === "size";
        return (
          <OptionGroup
            key={g.id}
            label={pretty}
            value={chosen ? chosen.label : null}
            options={g.options}
            selected={state[g.id]}
            onPick={id => set(g.id, id)}
            available={availableFor(formatId, state, g.id)}
            variant={isSize ? "thumb" : "text"}
            detailsOpen={details.has(g.id)}
            onDetails={() => toggle(g.id)}
            note={g.note}
            deltas={deltasFor(g)}
            trayNote={isSize
              ? "Select sizes have been rounded for uniformity. Refer to exact dimensions if needed."
              : null}
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
