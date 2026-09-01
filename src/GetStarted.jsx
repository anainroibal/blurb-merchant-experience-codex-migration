import React, { useState, useRef, useEffect } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";
import Configurator from "./Configurator.jsx";
import CreateActions from "./CreateActions.jsx";
import ProductTypes from "./ProductTypes.jsx";
import Handoff, { SellableAnswer } from "./Handoff.jsx";
import Faq from "./Faq.jsx";
import YourProjects from "./YourProjects.jsx";
import ShippingSection from "./ShippingSection.jsx";
import {
  CATALOG, formatsFor, defaultSelection, minSellPrice, sellerCost,
  PROJECT_KINDS, seedFor, BULK_MIN,
} from "./catalog.js";

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
     4. Nothing asks who you are until the end. Whoever arrives here is
        starting something new, so the page's job is prices and product
        options; an existing project and the log-in that reaches it are
        a decision AFTER that, in the handoff — not a gate before it.

   The default stays keepsake on purpose. Most traffic is makers, and a
   maker who never opens the dropdown never meets a price that isn't
   theirs — the guardrail comes free.
   ──────────────────────────────────────────────────────────────── */

/* ── The three routes ──
   One question — where do the copies end up, and who pays? — asked once.
   Three plain labels (Ana, 2026-09-01; the static "to" now lives in the
   heading itself, not the option), each of which changes what the page
   DOES: which products are offered, what the calculator computes, and
   what the foot of the page hands off to.

   "Buy in bulk" is the one that is not self-evident, and it is easily
   misread as a distribution service like Ingram — which is the opposite,
   and lives under Sell. Hence the gloss. */
const ROUTES = [
  { id: "sell",       label: "Sell",         hint: "People buy it from you, one copy at a time" },
  { id: "keep",       label: "Keep",         hint: "For yourself — to hold on to, display or give" },
  { id: "distribute", label: "Buy in bulk",  hint: "Then sell or hand them out yourself" },
];

/* ── And, under "to Keep" only, what it is for ──
   These change what we RECOMMEND — cover, paper — and nothing else, so
   they sit a level down as chips rather than competing with the routes.
   Keepsake stays the default, as it is on the live page. */
const USES = [
  { id: "keepsake", label: "for a keepsake" },
  { id: "display",  label: "to display" },
  { id: "gift",     label: "to give as a gift" },
];

/* "Project" is the unset state, exactly as the live page shows it. What
   follows is what you are MAKING, not what we print — see PROJECT_KINDS.
   Sixteen kinds is a long list, so it is grouped; the live one runs flat
   and scrolls past the fold. */
const kindOptions = () => [
  { id: null, label: "Project" },
  ...PROJECT_KINDS.map(k => ({ id: k.id, label: k.label, group: k.group })),
];

function InlineSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  /* Pointer and keyboard both land on the same row treatment, so tabbing
     through the menu looks the way hovering it does. */
  const [hot, setHot] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = e => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  useEffect(() => { if (!open) setHot(null); }, [open]);

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
        <span className="ms turn" style={{ fontSize: "0.5em", color: T.bgBrand, transform: open ? "rotate(180deg)" : "none" }}>
          expand_more
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="pop-in"
          style={{
            position: "absolute", top: "calc(100% + 12px)", left: 0, zIndex: 30,
            margin: 0, padding: "0 8px 8px", listStyle: "none", minWidth: 260,
            background: T.bgNeutral, border: `1px solid ${T.border}`,
            borderRadius: R.lg, boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            fontFamily: FONT_BODY, fontSize: TYPE.lg, fontWeight: 400,
            /* Sixteen kinds is taller than most screens. Scroll inside the
               menu rather than off the bottom of the page. */
            maxHeight: "min(62vh, 520px)", overflowY: "auto", overscrollBehavior: "contain",
          }}
        >
          {options.map((o, i) => {
            const selected = o.id === value;
            /* A heading whenever the group changes. "business" is the first
               intention and needs no heading — the list starts there. */
            const changed = grouped && o.group && o.group !== options[i - 1]?.group;
            return (
              <React.Fragment key={String(o.id)}>
                {changed && (
                  /* A label, not an option — so it is set apart rather than
                     merely smaller: uppercase, and stuck to the top of the
                     menu while its own group scrolls past.

                     Full-bleed to the menu edges (the -8px undoes the list's
                     side padding) for two reasons: a pinned heading has to
                     cover the options sliding under it, edge to edge, and the
                     rule then reads as a divider across the menu rather than
                     as a line belonging to one option. Space above, none
                     below: the rule and the gap belong to the group starting
                     here, not to the one ending above. */
                  <li
                    aria-hidden
                    style={{
                      position: "sticky", top: 0, zIndex: 1,
                      background: T.bgNeutral,
                      margin: "8px -8px 0",
                      padding: "14px 20px 8px",
                      borderTop: `1px solid ${T.border}`,
                      /* The headline this menu hangs off is centred, and the
                         heading would inherit that. The options set their own
                         alignment; this has to as well. */
                      textAlign: "left",
                      fontSize: TYPE.sm, color: T.textSubtle,
                      fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase",
                    }}
                  >
                    {o.group}
                  </li>
                )}
                <li role="option" aria-selected={selected}>
                  <button
                    onClick={() => { onChange(o.id); setOpen(false); }}
                    onMouseEnter={() => setHot(i)}
                    onMouseLeave={() => setHot(h => (h === i ? null : h))}
                    onFocus={() => setHot(i)}
                    onBlur={() => setHot(h => (h === i ? null : h))}
                    style={{
                      width: "100%", textAlign: "left", border: 0, borderRadius: R.md,
                      padding: "10px 12px", font: "inherit",
                      /* The menu has no top padding, so the sticky headings
                         can pin flush. The first row supplies its own. */
                      marginTop: i === 0 ? 8 : 0,
                      /* Hover is a grey wash, never the selected blue: the
                         row you are pointing at must not look like the row
                         you already chose. */
                      background: selected ? T.bgAccentSubtle : hot === i ? T.bgSubtle : "transparent",
                      transition: "background 120ms ease",
                      color: selected ? T.textBrand : T.textNeutral,
                      fontWeight: selected ? 600 : 400,
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                    }}
                  >
                    <span style={{ display: "grid", gap: 2, minWidth: 0 }}>
                      {o.label}
                      {/* A route that is not self-evident says what it means
                          here, rather than being discovered by choosing it. */}
                      {o.hint && (
                        <span style={{ fontSize: TYPE.sm, color: T.textSubtle, fontWeight: 400, lineHeight: 1.45 }}>
                          {o.hint}
                        </span>
                      )}
                    </span>
                    {selected && <span className="ms" style={{ fontSize: 18, flex: "0 0 auto" }}>check</span>}
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

/* ── "Buy in bulk" is a prompt, not a calculator (Anain, 2026-09-01) ──
   This used to run the full per-copy calculator, seeded at BULK_MIN, and
   hand off to Large Order Services at the foot of the page with a "treat
   the estimate as a ceiling, not a price" caveat. Reworked because that
   caveat was doing too much: a self-serve total that isn't the real price
   reads as a price anyway. A bulk run is quoted by a person, not priced by
   this page, so the page's job is to name what they're making and get them
   to that person — the way blurb.com/large-order-services itself opens
   with "Get a Quote", not a calculator. */
function BulkQuotePanel({ kindLabel, formatLabel }) {
  const what = kindLabel || formatLabel
    ? ` for your ${(kindLabel || formatLabel).toLowerCase()}`
    : "";
  return (
    <div style={{ maxWidth: 1240, margin: "0 auto" }}>
      <div
        className="stack-md"
        style={{
          background: C.blue50, border: `1px solid ${C.blue100}`, borderRadius: R.lg,
          padding: "clamp(28px, 4vw, 40px)", display: "grid", gap: 16,
          gridTemplateColumns: "1fr auto", alignItems: "center",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["5xl"], fontWeight: 500, lineHeight: 1.2, color: C.blue950 }}>
            Your partner in print
          </div>
          <p style={{ fontSize: TYPE.lg, lineHeight: 1.65, color: T.textNeutral, margin: "10px 0 0", maxWidth: 680 }}>
            A run of 100 copies or more{what} is quoted by a person, not this calculator. Large Order
            Services' dedicated team prices the run and arranges delivery in bulk, and gets back to you
            within two business days.
          </p>
        </div>
        <a
          href="https://www.blurb.com/large-order-services"
          target="_blank" rel="noreferrer"
          style={{
            height: BUTTON_HEIGHT, padding: "0 24px", borderRadius: R.md,
            fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 700,
            letterSpacing: 0.6, textTransform: "uppercase", whiteSpace: "nowrap",
            background: T.bgBrand, color: T.textInverse, border: "1px solid transparent",
            display: "inline-flex", alignItems: "center", textDecoration: "none",
          }}
        >
          Get a Quote
        </a>
      </div>
    </div>
  );
}

export default function GetStarted({ signedIn, onSignIn, initialRoute, initialSeed, onGo }) {
  const [format, setFormat] = useState(null);
  /* ── Shipping lives on this page too (Ana, DES-482) ──
     The panel has always been able to price delivery; nothing on this page
     asked for a destination, so the maker's total said "add a postcode"
     with no postcode to add, and a seller could not answer the first
     question a buyer asks them. Same control the estimator uses, same two
     defaults: in the total for a maker, off and optional for a seller. */
  const [ship, setShip] = useState({
    country: "US", postal: "", state: "California", speed: "economy", poBox: false, show: false,
  });
  /* Defaults to Project + to Sell. Note this is a prototype default, chosen so
     reviewers land on the selling path — not a recommendation for production,
     where keepsake is the live default and most traffic is makers.

     initialRoute is what a lane on the home page already answered. Arriving
     from "I'm making something" must not re-ask the question in the headline
     with a different answer showing. */
  const [route, setRoute] = useState(initialRoute ?? "sell");
  const [use, setUse] = useState("keepsake");
  const [state, setState] = useState(null);
  const [sellPrice, setSellPrice] = useState(24);
  /* What they said they are making. It survives changing the product type,
     because the recommendation is still worth showing after it is refused. */
  const [kind, setKind] = useState(null);
  const [why, setWhy] = useState(null);
  const [recommended, setRecommended] = useState(null);

  const selling = route === "sell";
  const bulk = route === "distribute";

  const priceFrom = (id, sel) => {
    /* Anchor the asking price above cost so the ladder never opens negative. */
    const floor = minSellPrice(id, sel);
    setSellPrice(Math.max(floor, Math.round(floor * 2.4 * 2) / 2));
  };

  /* Choosing a kind seeds a whole specification, not just a format, so the
     calculator shows a real number straight away. Nothing is locked — every
     step below can still be changed. */
  const changeKind = (id, forRoute = route, forUse = use) => {
    setKind(id);
    if (!id) { setFormat(null); setState(null); setWhy(null); setRecommended(null); return; }
    const seed = seedFor(id, forRoute, forUse);
    setFormat(seed.formatId);
    setRecommended(seed.formatId);
    setState({ ...seed.sel, qty: forRoute === "distribute" ? BULK_MIN : seed.sel.qty });
    setWhy([seed.why, seed.note].filter(Boolean).join(" "));
    priceFrom(seed.formatId, seed.sel);
  };

  /* Refusing the recommendation is allowed and expected. The kind and its
     reasoning stay put; only the product changes. */
  const changeFormat = id => {
    setFormat(id);
    if (!id) { setState(null); return; }
    const next = defaultSelection(id);
    setState({ ...next, qty: bulk ? BULK_MIN : next.qty });
    priceFrom(id, next);
  };

  /* The recommendation depends on the route as much as the kind — a wedding
     album to sell is not the wedding album you keep — so switching either
     re-seeds from the kind. That discards hand-made changes, which is the
     right trade here: seeing the answer move IS the argument.

     Without a kind, the old rule still applies: switching can withdraw the
     chosen product, since PDFs are not sold through a link and cannot be
     handed out in a box. */
  const changeRoute = id => {
    setRoute(id);
    if (kind) { changeKind(kind, id, use); return; }
    /* Every product leads to the same quote prompt under "Buy in bulk" —
       there's nothing here for a format choice to change — so pick one
       rather than making someone click a card to reach a panel that
       doesn't depend on which one they picked (Anain, 2026-09-01). */
    if (id === "distribute" && !format) { changeFormat("photo"); return; }
    if (format && !formatsFor(id, use).includes(format)) changeFormat(null);
  };

  const changeUse = id => {
    setUse(id);
    if (kind) { changeKind(kind, route, id); return; }
    if (format && !formatsFor(route, id).includes(format)) changeFormat(null);
  };

  /* A product page hands over the WHOLE configuration, not just the family.
     Someone who chose 13×11 ImageWrap on Mohawk Pearl and pressed Create
     must not arrive on a softcover Mini Square — and the summary could not
     offer its way back to that product page either, because the cover it
     names would be gone. So the seed wins over defaultSelection, and the
     asking price is refloored to match. */
  useEffect(() => {
    if (!initialSeed?.formatId) return;
    const id = initialSeed.formatId;
    if (!formatsFor(initialRoute ?? "sell", use).includes(id)) return;
    const next = { ...defaultSelection(id), ...initialSeed.sel };
    setFormat(id);
    setState({ ...next, qty: (initialRoute ?? "sell") === "distribute" ? BULK_MIN : next.qty });
    priceFrom(id, next);
  }, []);

  /* Arriving already on "Buy in bulk" (a lane elsewhere on the site, say)
     skips the same click a manual switch skips in `changeRoute` — see the
     comment there. Only fires when nothing has set a format yet. */
  useEffect(() => {
    if (initialRoute === "distribute" && !initialSeed?.formatId && !kind && !format) {
      changeFormat("photo");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ fontFamily: FONT_BODY, color: T.textNeutral }}>
      {/* ── Hero ── */}
      <section style={{ padding: "clamp(32px, 6vw, 64px) 20px 32px", maxWidth: 1180, margin: "0 auto", textAlign: "center" }}>
        <h1
          style={{
            fontFamily: FONT_DISPLAY, fontWeight: 400,
            fontSize: "clamp(2.25rem, 5.5vw, 3.5rem)", lineHeight: 1.14,
            margin: 0, color: T.textNeutral, letterSpacing: "-0.01em",
          }}
        >
          Start Your{" "}
          <InlineSelect value={kind} options={kindOptions()} onChange={changeKind} />{" "}
          to{" "}
          <InlineSelect value={route} options={ROUTES} onChange={changeRoute} />
        </h1>

        {/* One level down, one branch only. Chips rather than a second
            dropdown: this refines the recommendation, it does not change
            the page, and it should not look like it might. */}
        {route === "keep" && (
          <div className="fade-in" style={{
            display: "flex", justifyContent: "center", alignItems: "center",
            gap: 8, flexWrap: "wrap", marginTop: 22,
          }}>
            <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>What for?</span>
            {USES.map(u => {
              const on = use === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => changeUse(u.id)}
                  aria-pressed={on}
                  style={{
                    padding: "7px 16px", borderRadius: 999, fontFamily: FONT_BODY, fontSize: TYPE.base,
                    background: on ? T.bgAccentSubtle : T.bgNeutral,
                    color: on ? T.textBrand : T.textSubtle,
                    border: on ? `1px solid ${T.borderBrand}` : `1px solid ${T.border}`,
                    fontWeight: on ? 700 : 400,
                  }}
                >
                  {u.label}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ── The product, first ──
          /pricing opens with the format cards, on their own, above
          everything the choice then feeds. This page does the same, and for
          the same reason: the product is not step one of a form, it is the
          thing being priced. Making it a numbered step implied an order the
          page does not enforce — the row can be changed at any point, and
          doing so re-seeds every option below it.

          So the numbering starts at the first real step (the size), and
          this section carries /pricing's heading instead. When a kind has
          been named the recommendation leads the row and the reason runs
          under it. */}
      <section
        style={{
          borderTop: `1px solid ${T.border}`,
          padding: "clamp(28px, 4vw, 44px) 16px clamp(28px, 4vw, 44px)",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 28 }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 600, letterSpacing: "-0.01em",
              fontSize: "clamp(1.5rem, 3.2vw, 2rem)", lineHeight: 1.25, margin: 0,
            }}>
              Select a format to see size and paper options
            </h2>
            {/* The standing instruction for this section, so it reads as the
                heading's second line rather than as a note left under the
                cards. It goes once a format is chosen: by then the row has
                already done what it describes. */}
            {!format && (
              <p style={{ fontSize: TYPE.lg, color: T.textSubtle, margin: "10px auto 0", maxWidth: 720, lineHeight: 1.6 }}>
                {selling
                  ? "Tell us what you're making at the top and we'll recommend a product, a size and a paper, with what it costs you and what you'd earn. Or pick one yourself."
                  : "Tell us what you're making at the top and we'll recommend a product, a size and a paper. Or pick one yourself."}
              </p>
            )}
          </div>

          <ProductTypes
            format={format} route={route} use={use} onSelect={changeFormat}
            recommended={format ? recommended : null}
            why={format ? why : null}
            kindLabel={PROJECT_KINDS.find(k => k.id === kind)?.label}
          />

        </div>
      </section>

      {/* ── The options it feeds, with the calculator pinned alongside ──
          Not for "Buy in bulk": that route isn't priced here at all, so it
          gets the quote prompt below instead of the calculator. */}
      {format && bulk && (
        <section style={{ borderTop: `1px solid ${T.border}`, padding: "clamp(28px, 4vw, 44px) 16px 72px" }}>
          <BulkQuotePanel
            kindLabel={PROJECT_KINDS.find(k => k.id === kind)?.label}
            formatLabel={CATALOG[format]?.label}
          />
        </section>
      )}

      {format && !bulk && (
        <section
          /* White, as the calculators are. The grey ground this section used
             to carry put a grey card on a grey page the moment the option
             cards lost their white box, and the same option would have read
             differently here than on /pricing. */
          style={{
            borderTop: `1px solid ${T.border}`,
            padding: "clamp(28px, 4vw, 44px) 16px 72px",
          }}
        >
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            {/* Keyed on the format so the steps arrive rather than appear. */}
            <Configurator
              key={format}
              formatId={format}
              state={state}
              onChange={setState}
              mode={route}
              sellPrice={sellPrice}
              onSellPrice={setSellPrice}
              stepOffset={0}
              ship={ship}
              setShip={setShip}
              onGo={onGo}
              /* The same "Ready to make it?" block the calculators carry, in
                 the same place — the foot of the summary panel. It used to be
                 three large cards at the bottom of this page, which is a
                 second way of asking one question: one primary tool, decided
                 by the catalogue, with the rest behind "Other tools".

                 No `onGo` for the build here: this IS /getting-started, so
                 there is nowhere for it to hand over to. The tools it names
                 are not prototyped on either page. */
              actions={
                <CreateActions
                  formatId={format}
                  sel={state}
                  onGo={onGo}
                  onBuild={() => {}}
                  heading="Ready to make it?"
                  after={selling
                    ? <YourProjects compact signedIn={signedIn} onSignIn={onSignIn} />
                    : null}
                />
              }
              trailing={
                <div style={{ display: "grid", gap: 24 }}>
                  <ShippingSection
                    selling={selling}
                    ship={ship} setShip={setShip}
                    qty={state.qty} price={sellPrice}
                  />
                  <Handoff route={route} />
                </div>
              }
            />
          </div>
        </section>
      )}

      {/* ── Questions, at the foot of the page ──
          The proof requirement and the Instant Store's product limits used
          to be two panels beside the steps. Both are rules of the channel
          rather than of the book, and at the point of choosing a paper they
          are more than the step needs (Ana, DES-482). They keep their place
          on the page, one scroll further down, where somebody who has just
          seen what they would earn goes looking for the catch. */}
      {selling && format && (
        <Faq
          heading={<>Before you sell it,<br />two things to know.</>}
          items={[
            ["Do I have to order a copy before I can sell?",
             <p style={{ margin: 0 }}>
               Blurb has always asked authors to order and review a copy before a book goes on sale. Your
               Instant Store can go live straight away; buyers just cannot buy until your proof is on file.
               A discounted copy or a PDF proof, either one.
             </p>],
            ["What can an Instant Store sell?", <SellableAnswer formatId={format} />],
          ]}
        />
      )}

    </div>
  );
}
