import React from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";
import SummaryPanel from "./SummaryPanel.jsx";
import {
  CATALOG, pageLimit, reconcile, availableFor, derivedSteps,
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
  /* The default card is the product card's geometry (FormatCards.jsx): the
     swatch runs to the card's edges, only the caption is inset, and there is
     no frame until the card is chosen — 2px transparent rather than absent,
     so choosing one cannot shift the row. One way of showing a choice across
     the whole prototype; the boxed, inset, always-bordered version this
     replaced made the same act look like a different control on every page. */
  const card = !thumb && !text;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className="card-move"
      title={disabled ? "Not available with the rest of your selection" : undefined}
      style={{
        textAlign: "center", minWidth: 0, opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: FONT_BODY, display: "grid", alignContent: "start",
        ...(card ? {
          background: "transparent", padding: 0, overflow: "hidden", borderRadius: 10, gap: 0,
          border: selected ? `2px solid ${C.gray950}` : "2px solid transparent",
          transition: "border-color var(--nav-hover) var(--nav-ease)",
        } : {
          background: T.bgNeutral, borderRadius: R.md,
          padding: thumb ? 8 : "10px 12px",
          gap: thumb ? 6 : 2,
          border: selected ? `2px solid ${T.borderBrand}` : `1px solid ${T.border}`,
          margin: selected ? 0 : 1,
        }),
      }}
    >
      {!text && (
        <div style={{
          background: card ? C.gray100 : (selected ? C.blue50 : C.gray100),
          borderRadius: card ? 0 : R.sm,
          /* A square swatch, as on the live PDP. A fixed height inside a
             flexible card gave a squat rectangle that read as a cropped
             image rather than a sample. */
          aspectRatio: thumb ? "1 / 1" : "16 / 11",
          display: "grid", placeItems: "center",
        }}>
          <span className="ms" style={{ fontSize: thumb ? 26 : 40, color: card ? C.gray400 : (selected ? C.blue600 : C.gray400) }}>
            menu_book
          </span>
        </div>
      )}
      <span style={card ? { display: "grid", gap: 6, padding: "14px 12px 18px" } : { display: "grid", gap: text ? 2 : 8 }}>
      <div style={{
        /* Only the default step card shouts. A thumbnail's caption and a text
           button are read as words, and the live PDP sets both in sentence
           case — uppercasing "Mohawk Superfine Eggshell" costs a line break
           and buys nothing. */
        fontSize: thumb ? TYPE.sm : TYPE.base,
        fontWeight: thumb ? 600 : text ? 600 : 700,
        letterSpacing: thumb || text ? 0 : 0.6,
        textTransform: thumb || text ? "none" : "uppercase",
        color: card ? C.gray950 : (selected ? C.blue950 : T.textNeutral), lineHeight: 1.3,
      }}>
        {title}
      </div>
      {sub && <div style={{ fontSize: TYPE.sm, color: T.textSubtle }}>{sub}</div>}
      {spec && <div style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>{spec}</div>}
      {note && (
        <div style={{ fontSize: TYPE.sm, fontWeight: 700, color: card ? T.textSubtle : (selected ? C.blue600 : T.textSubtle) }}>
          {note}
        </div>
      )}
      </span>
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
export function Divider() {
  return <div style={{ borderTop: `1px solid ${T.border}` }} />;
}

export default function Configurator({
  formatId, state, onChange, mode, sellPrice, onSellPrice,
  stepOffset = 1, leading, trailing, actions,
}) {
  /* Everything the price depends on — the arithmetic, the shipping quote,
     the floor under the asking price — moved into SummaryPanel with the
     panel itself. What is left here is the step page: which options exist,
     which of them can be built, and what happens when one is chosen. */
  const f = CATALOG[formatId];
  const derived = derivedSteps(formatId, state);

  const set = (groupId, id) => {
    /* One choice can invalidate another, and paper caps the page count.
       Repair both rather than quoting a book that cannot be made. */
    let next = reconcile(formatId, { ...state, [groupId]: id }, groupId);
    const cap = pageLimit(formatId, next);
    if (next.pages > cap) next.pages = cap;
    onChange(next);
  };
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

      {/* ── The summary panel, shared with the estimator ── */}
      <SummaryPanel
        formatId={formatId}
        state={state}
        onChange={onChange}
        mode={mode}
        sellPrice={sellPrice}
        onSellPrice={onSellPrice}
        actions={actions}
      />

    </div>
  );
}
