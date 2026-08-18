import React, { useState, useRef, useEffect } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import Configurator, { StepHeading } from "./Configurator.jsx";
import ProductTypes from "./ProductTypes.jsx";
import Handoff from "./Handoff.jsx";
import YourProjects from "./YourProjects.jsx";
import { CATALOG, formatsFor, defaultSelection, minSellPrice } from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   /getting-started — redesign

   The live page is ALREADY intent-first: its markup carries an
   #intention-dropdown with sell · keepsake · display · gift, defaulting
   to keepsake. And "to Sell" already does one thing — it stars the
   product types that suit selling. So this is not a new question.

   What changes:
     1. Product type stays step one, as cards, exactly as it is today.
     2. The intention regroups — one business intent and three flavours
        of personal use is not a parallel set.
     3. Choosing "to Sell" opens a guided path instead of dropping you
        into the maker funnel with a star on two cards.

   The default stays keepsake on purpose. Most traffic is makers, and a
   maker who never opens the dropdown never meets a price that isn't
   theirs — the guardrail comes free.
   ──────────────────────────────────────────────────────────────── */

const INTENTIONS = [
  { id: "sell",     label: "to Sell",       group: "business" },
  { id: "keepsake", label: "as a Keepsake", group: "personal" },
  { id: "display",  label: "to Display",    group: "personal" },
  { id: "gift",     label: "to Gift",       group: "personal" },
];

/* "Project" is the unset state — what the live page shows until a product
   type is chosen. Headline and cards drive the same state, and both offer
   only what is available for the current intention. */
const formatOptions = intention => [
  { id: null, label: "Project" },
  ...formatsFor(intention).map(id => ({ id, label: CATALOG[id].short })),
];

function InlineSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = e => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const current = options.find(o => o.id === value);
  const grouped = options.some(o => o.group);

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          font: "inherit", color: "inherit", background: "transparent",
          border: 0, borderBottom: `2px solid ${T.bgBrand}`,
          padding: "0 4px 2px", display: "inline-flex", alignItems: "baseline", gap: 8,
        }}
      >
        {current?.label}
        <span className="ms" style={{ fontSize: "0.5em", color: T.bgBrand, transform: open ? "rotate(180deg)" : "none" }}>
          expand_more
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          style={{
            position: "absolute", top: "calc(100% + 12px)", left: 0, zIndex: 30,
            margin: 0, padding: 8, listStyle: "none", minWidth: 260,
            background: T.bgNeutral, border: `1px solid ${T.border}`,
            borderRadius: R.lg, boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            fontFamily: FONT_BODY, fontSize: TYPE.lg, fontWeight: 400,
          }}
        >
          {options.map((o, i) => {
            const selected = o.id === value;
            const startsPersonal = grouped && o.group === "personal" && options[i - 1]?.group === "business";
            return (
              <React.Fragment key={String(o.id)}>
                {startsPersonal && (
                  <li aria-hidden style={{ padding: "10px 12px 6px", fontSize: TYPE.sm, color: T.textSubtle, fontWeight: 600, letterSpacing: 0.3 }}>
                    For yourself
                  </li>
                )}
                <li role="option" aria-selected={selected}>
                  <button
                    onClick={() => { onChange(o.id); setOpen(false); }}
                    style={{
                      width: "100%", textAlign: "left", border: 0, borderRadius: R.md,
                      padding: "10px 12px", font: "inherit",
                      background: selected ? T.bgAccentSubtle : "transparent",
                      color: selected ? T.textBrand : T.textNeutral,
                      fontWeight: selected ? 600 : 400,
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                    }}
                  >
                    {o.label}
                    {selected && <span className="ms" style={{ fontSize: 18 }}>check</span>}
                  </button>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      )}
    </span>
  );
}

export default function GetStarted({ signedIn, onSignIn }) {
  const [format, setFormat] = useState(null);
  /* Defaults to Project + to Sell. Note this is a prototype default, chosen so
     reviewers land on the selling path — not a recommendation for production,
     where keepsake is the live default and most traffic is makers. */
  const [intention, setIntention] = useState("sell");
  const [state, setState] = useState(null);
  const [sellPrice, setSellPrice] = useState(24);
  const [projectId, setProjectId] = useState(null);

  const selling = intention === "sell";

  /* Picking an existing project skips the product-type step entirely — it
     already knows its size, paper and cover. */
  const pickProject = p => {
    setProjectId(p.id);
    setFormat(p.formatId);
    setState(p.sel);
    const floor = minSellPrice(p.formatId, p.sel);
    setSellPrice(Math.max(floor, Math.round(floor * 2.4 * 2) / 2));
  };

  const changeFormat = id => {
    setProjectId(null);
    setFormat(id);
    if (!id) { setState(null); return; }
    const next = defaultSelection(id);
    setState(next);
    /* Anchor the asking price above cost so the ladder never opens negative. */
    const floor = minSellPrice(id, next);
    setSellPrice(Math.max(floor, Math.round(floor * 2.4 * 2) / 2));
  };

  /* Switching intention can withdraw the chosen product — PDFs are not
     offered for selling — so drop a selection that is no longer on offer
     rather than configuring something we do not sell. */
  const changeIntention = id => {
    setIntention(id);
    if (format && !formatsFor(id).includes(format)) changeFormat(null);
  };

  return (
    <div style={{ fontFamily: FONT_BODY, color: T.textNeutral }}>
      {/* ── Hero ── */}
      <section style={{ padding: "64px 24px 36px", maxWidth: 1180, margin: "0 auto", textAlign: "center" }}>
        <h1
          style={{
            fontFamily: FONT_DISPLAY, fontWeight: 400,
            fontSize: "clamp(2.25rem, 5.5vw, 3.5rem)", lineHeight: 1.14,
            margin: 0, color: T.textNeutral, letterSpacing: "-0.01em",
          }}
        >
          Start Your{" "}
          <InlineSelect value={format} options={formatOptions(intention)} onChange={changeFormat} />{" "}
          <InlineSelect value={intention} options={INTENTIONS} onChange={changeIntention} />
        </h1>
      </section>

      {/* ── The steps, with the calculator pinned alongside ── */}
      <section
        style={{
          background: T.bgSubtle,
          borderTop: `1px solid ${T.border}`,
          padding: "44px 24px 80px",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          {format ? (
            <Configurator
              formatId={format}
              state={state}
              onChange={setState}
              selling={selling}
              sellPrice={sellPrice}
              onSellPrice={setSellPrice}
              stepOffset={1}
              leading={
                <section>
                  <StepHeading n={1}>Choose your project</StepHeading>
                  {selling && (
                    <YourProjects
                      signedIn={signedIn} onSignIn={onSignIn}
                      selectedId={projectId} onSelect={pickProject}
                      onStartNew={() => setProjectId(null)}
                    />
                  )}
                  <ProductTypes format={format} intention={intention} onSelect={changeFormat} />
                </section>
              }
              trailing={<Handoff selling={selling} />}
            />
          ) : (
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <StepHeading n={1}>Choose your project</StepHeading>
              {selling && (
                <YourProjects
                  signedIn={signedIn} onSignIn={onSignIn}
                  selectedId={projectId} onSelect={pickProject}
                  onStartNew={() => setProjectId(null)}
                />
              )}
              <ProductTypes format={format} intention={intention} onSelect={changeFormat} />
              <p style={{ fontSize: TYPE.xl, color: T.textSubtle, textAlign: "center", margin: "40px 0 0" }}>
                {selling
                  ? "Pick a project to see what it costs you and what you'd earn. The starred ones suit selling."
                  : "Pick a project to see sizes, papers and prices."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
