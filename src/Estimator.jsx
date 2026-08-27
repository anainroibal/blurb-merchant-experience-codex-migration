import React, { useState } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";
import SummaryPanel from "./SummaryPanel.jsx";
import ProductOptions from "./ProductOptions.jsx";
import ShippingSection, { Field, control } from "./ShippingSection.jsx";
import InstantStoreLane from "./InstantStoreLane.jsx";
import CreateActions from "./CreateActions.jsx";
import FormatCards from "./FormatCards.jsx";
import {
  CATALOG, PROJECT_KINDS, fromPrice, sizeCount,
  seedFor, priceFor, sellerCost, minSellPrice, defaultSelection,
  availableFor, reconcile, pageLimit, derivedSteps, money,
  SHIPPING, US_STATES, shippingFor, speedDays, arrivalWindow, formatDay, PRINT_RANGE,
} from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   Two calculators, not one.

   They answer different questions and the answers barely overlap:

     MAKE — "what will this cost me?"  One total, copies included,
            shipping in it, no margin anywhere. This is what
            blurb.com/pricing already does.
     SELL — "what would I keep?"       Cost, price, profit, and the
            channel that changes all three.

   Splitting them is what lets each one lead with the right control.
   A maker wants SIZES AND FORMATS immediately — asking "what kind of
   book are you writing?" before showing a price is an obstacle when
   the person already knows they want an 8×10 hardback. A seller is
   better served by the project kind, because the recommendation is
   most of the value there.

   So the kind picker is not gone from the maker's side; it is behind
   "Help me decide", for the person who wants it. Ask what someone is
   doing, never who they are — and never make them answer a question
   they did not need.

   Landing in the wrong one is expected, so each says what the other
   is for and hands over without losing the specification.
   ──────────────────────────────────────────────────────────────── */

const ILLUS = "https://assets.blurb.com/_astro/";

const MODES = {
  make: {
    id: "make",
    tab: "Pricing calculator",
    sub: "What it costs to make",
    h1: "Compare products & pricing",
    lede: "Whatever your vision or budget, we have a format that fits.",
    other: "sell",
    swap: "Looking to sell, and want to see what it would earn you?",
    swapBody: "The Instant Store profit calculator shows what a copy costs you, what to charge, and what you keep on a sale.",
  },
  sell: {
    id: "sell",
    /* ── Named for the route it prices (Ana DES-482 #16; design review
         2026-08-26) ── It was the "margin estimator", a generic name that
         then needed a notice to say what it did not cover. Ana's point was
         that the notice was evidence of a misnamed page: "there are so
         many exceptions that it would be clearer to name what it actually
         applies to." The room agreed and settled the wording — this is the
         Instant Store profit calculator, framed as applying to that route
         rather than as a caveat about the others.

         Copy only. The stage id stays `margin` and the file stays
         Estimator.jsx, for the same reason the checkout link rename left
         its ids alone: renaming them touches every surface for no gain. */
    tab: "Instant Store profit calculator",
    sub: "What you'd earn on a sale",
    /* ── The hero sells the idea; the page explains itself ──
       It used to describe the controls below it ("set your price and see
       the profit"), which is a caption on a page the reader can already
       see. A hero on a marketing site is the pitch, and it is the part
       search engines read: what a seller gets, in the words they would
       have typed to find it. The mechanics are discovered in the ladder,
       which invites them.

       Claims kept to what this project can stand behind: you set the
       price, you print only what sells, and the margin is yours because
       you brought the buyer. Nothing about fees or commission, which is
       the unsourced claim in Crometrics' mock. */
    h1: "Sell your book. Keep more of what it earns.",
    /* "The rest of YOUR PRICE", never "the rest of what your buyer pays":
       the buyer pays the price plus delivery, and delivery is not the
       seller's to keep. Shipping stays outside the margin everywhere on
       this site, and a hero is no place to start blurring it. */
    lede: "Set your own price in your Instant Store. We print each copy as it sells, you pay us for the printing, and the rest of your price is yours.",
    other: "make",
    swap: "Just making it for yourself?",
    swapBody: "The pricing calculator gives you the price, your copies, and when it would arrive — no margin, nothing to set up.",
  },
};

/* The kind picker, offered rather than imposed. */
function HelpMeDecide({ open, onToggle, kindId, onKind, why }) {
  return (
    <div style={{
      background: C.blue50, border: `1px solid ${C.blue100}`, borderRadius: R.md,
      padding: open ? 18 : "12px 18px", display: "grid", gap: 12,
    }}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
          background: "transparent", border: 0, padding: 0, width: "100%",
          fontFamily: FONT_BODY, textAlign: "left", color: C.blue950,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span className="ms" style={{ fontSize: 20 }}>lightbulb</span>
          <span style={{ fontSize: TYPE.base, fontWeight: 700 }}>
            Not sure which product? Tell us what you're making
          </span>
        </span>
        <span className="ms turn" style={{ fontSize: 22, transform: open ? "rotate(180deg)" : "none" }}>
          expand_more
        </span>
      </button>

      {open && (
        <div className="fade-in" style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
            <Field label="I'm making a">
              <select style={control} value={kindId ?? ""} onChange={e => onKind(e.target.value || null)}>
                <option value="">—</option>
                {PROJECT_KINDS.map(k => <option key={k.id} value={k.id}>{k.label}</option>)}
              </select>
            </Field>
          </div>
          {why && (
            <p style={{ margin: 0, fontSize: TYPE.sm, lineHeight: 1.6, color: T.textNeutral }}>{why}</p>
          )}
        </div>
      )}
    </div>
  );
}

function Rung({ label, value, loud }) {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <span style={{
        fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
        color: loud ? C.blue600 : T.textSubtle,
      }}>{label}</span>
      <span style={{
        fontFamily: FONT_DISPLAY, fontWeight: 700, lineHeight: 1,
        fontSize: loud ? TYPE["7xl"] : TYPE["4xl"],
        color: loud ? C.blue600 : T.textNeutral,
      }}>{value}</span>
    </div>
  );
}

/* `seed` is a specification handed over by another screen — a product page
   sending a seller here to see what this exact book leaves them. Arriving
   with the book already configured is the whole value of the handover: the
   alternative is asking someone who was just looking at an 8×10 ImageWrap
   to describe it again. */
export default function Estimator({ mode = "make", onGo, seed = null }) {

  const [formatId, setFormatId] = useState(seed?.formatId ?? "photo");
  const [state, setState] = useState(() =>
    seed ? { ...defaultSelection(seed.formatId), ...seed.sel } : defaultSelection("photo"));
  const [price, setPrice] = useState(24);
  const [kindId, setKindId] = useState(null);
  const [why, setWhy] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  /* Shipping lives in a modal on the selling side. See the note beside the
     link that opens it. */
  const [buyerOpen, setBuyerOpen] = useState(false);
  const [ship, setShip] = useState({ country: "US", postal: "", state: "California", speed: "economy", poBox: false });

  const m = MODES[mode];
  const selling = mode === "sell";
  const f = CATALOG[formatId];

  const p = priceFor(formatId, state);
  const cost = sellerCost(formatId, state);
  const floor = minSellPrice(formatId, state);
  const shown = Math.max(price, floor);
  const profit = Math.max(0, shown - cost);
  const margin = shown > 0 ? Math.round((profit / shown) * 100) : 0;
  const limit = pageLimit(formatId, state);

  const changeFormat = id => {
    setFormatId(id);
    setState(defaultSelection(id));
    setKindId(null);
    setWhy(null);
  };

  /* The kind seeds a whole specification, exactly as it does on
     /getting-started — same function, so the two can never disagree. */
  const changeKind = id => {
    setKindId(id);
    if (!id) { setWhy(null); return; }
    const seed = seedFor(id, selling ? "sell" : "keep");
    setFormatId(seed.formatId);
    setState(seed.sel);
    setWhy([seed.why, seed.note].filter(Boolean).join(" "));
    const nextFloor = minSellPrice(seed.formatId, seed.sel);
    setPrice(Math.max(nextFloor, Math.round(nextFloor * 2.4 * 2) / 2));
  };

  return (
    <div style={{ fontFamily: FONT_BODY, color: T.textNeutral }}>

      {/* ── The hero, as /pricing has it ──
          A banded intro over a soft gradient: heading and one line. Both
          calculators use it; the pattern is the page's, the words are the
          mode's.

          NO BUTTON (Anain, 2026-08-27). It read "See what you'd keep" and
          scrolled to the controls a screen below, which is a call to
          action for something the reader is already doing: they came to
          the calculator, and the calculator is this page rather than
          something layered over it. A button that only scrolls asks for a
          decision it cannot reward. The format cards do the work instead
          — picking one is the real first step, and it is visible without
          being announced. */}
      <section style={{
        background: "linear-gradient(100deg, #e9ecef 0%, #f6f3ef 45%, #ebebeb 100%)",
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{
          maxWidth: 900, margin: "0 auto", padding: "clamp(48px, 7vw, 88px) 20px",
          textAlign: "center",
        }}>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, letterSpacing: "-0.01em",
            fontSize: "clamp(2rem, 4.6vw, 2.75rem)", lineHeight: 1.16, margin: 0, color: C.gray950,
          }}>
            {m.h1}
          </h1>
          <p style={{ fontSize: TYPE.base, color: C.gray950, lineHeight: 1.6, margin: "14px auto 0", maxWidth: 640 }}>
            {m.lede}
          </p>
        </div>
      </section>

      <section style={{ padding: "24px 16px 72px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gap: 18 }}>

          {/* ── Formats first, then the controls that price one ── */}
          <span id="calculator" aria-hidden style={{ display: "block", scrollMarginTop: 90 }} />

          {/* ── Which route these figures are for (2026-08-24) ──
              The ladder is your cost → your price → your profit, and that
              shape holds only where the whole difference is yours: an
              Instant Store. Amazon takes a share of the list price, Ingram
              a trade discount, and the Bookstore has terms of its own, so
              the same three numbers would be wrong on all three.

              Said in the second person and without the abstraction it
              opened with — "nothing is taken off it" describes a mechanism;
              "what is left after your cost is yours" describes what the
              seller gets, which is the thing they are here to find out.

              Said before the controls rather than under them. Someone who
              reads this after setting a price has already been misled, and
              the mistake is silent: the figures look just as plausible for
              the wrong route. It carries the way out with it, because the
              honest answer to "what about Amazon?" is another page.

              ── A SCOPE, NOT A WARNING, AND NOT AN ALERT ──
              Three passes to get here. It began as a hand-built blue box
              with an info icon, which is the shape this site uses to say
              something has gone wrong. Then Codex's Alert L at Type=Info,
              which is the right component for a title, a message and an
              action — but an alert is for STATE, and state changes. This
              copy is identical on every visit forever, and a permanent
              alert wears out: people stop seeing the colour, and it is
              then missing on the day something really is wrong.

              So the naming does the work (Ana DES-482 #16). The heading
              says which route this prices, the lede says what you get, and
              all that is left for this line is the half neither can carry:
              the other three routes exist and are compared elsewhere. One
              sentence and a door, in the page's own voice. */}
          <FormatCards
            formatId={formatId}
            onPick={changeFormat}
            note={selling ? (
              <>
                The Bookstore, Amazon and Ingram each work on different terms.{" "}
                <button
                  onClick={() => onGo?.("seller")}
                  style={{
                    font: "inherit", fontWeight: 700, color: T.textBrand, background: "transparent",
                    border: 0, padding: 0, cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: 4, verticalAlign: "baseline",
                  }}
                >
                  Compare the routes
                  <span className="ms" style={{ fontSize: 18 }}>arrow_forward</span>
                </button>
              </>
            ) : (
              <>
                Save more when you print in bulk. Learn about{" "}
                <span style={{ color: T.textBrand, textDecoration: "underline" }}>volume discounts</span>.
              </>
            )}
          />

          {/* ── The get-started layout: choices on one side, the running
                 total on the other ──
                 Same grid and the same two classes, so the responsive rules
                 written for that screen apply here without a second set:
                 cfg-grid collapses to one column on a narrow viewport, and
                 cfg-aside stops being sticky and caps its height so it
                 cannot swallow the page. The panel is sticky again, which is
                 the point of it — the number stays on screen while the
                 options are changed rather than being scrolled back to. ── */}
          <div
            className="fade-in cfg-grid"
            style={{
              display: "grid", gap: 40, alignItems: "start",
              gridTemplateColumns: "minmax(340px, 1.55fr) minmax(310px, 0.85fr)",
            }}
          >
            <div className="cfg-steps" style={{ minWidth: 0, display: "grid", gap: 18 }}>

          {/* ── Product options first. Always. ── */}
          <div style={{
            background: T.bgNeutral, border: `1px solid ${T.border}`, borderRadius: R.lg,
            padding: 24, display: "grid", gap: 18,
          }}>
            {/* The PDP's own option component, not a row of selects. Same
                questions, same treatment, and the size modifiers are
                visible where a dropdown hid them. */}
            <ProductOptions formatId={formatId} state={state} onChange={setState} />

            {/* ── Only for the person who wants it ── */}
            <HelpMeDecide
              open={helpOpen} onToggle={() => setHelpOpen(o => !o)}
              kindId={kindId} onKind={changeKind} why={why}
            />
          </div>

          <ShippingSection
            selling={selling}
            ship={ship} setShip={setShip}
            qty={state.qty} price={shown}
          />

          {/* The channel comparison used to sit here. It belongs on the
              seller landing page and only there — that page's one goal is
              "which route is mine?", and answering the same question in
              three places is how a prototype starts contradicting itself.
              Removed 2026-08-24. Note this supersedes the board's
              "comparison before commitment — the channel comparison belongs
              on the estimator": still comparison before commitment, but the
              comparison has its own page now. */}

            </div>

            {/* ── The answer, sticky beside the choices ──
                The same panel /getting-started uses. The estimator had its
                own doing the same job with different parts, which is two
                places to fix a rule and two chances to disagree about it. */}
            {/* ── The panel, with the way out at the bottom of it ──
                Once someone has a total, the next step is to make the book,
                and the action belongs where the number is. The panel is
                sticky, so it stays in reach while the options change. */}
            <SummaryPanel
              formatId={formatId}
              state={state}
              onChange={setState}
              mode={mode}
              sellPrice={shown}
              onSellPrice={setPrice}
              ship={ship}
              setShip={setShip}
              onGo={onGo}
              actions={
                <CreateActions
                  formatId={formatId}
                  sel={state}
                  onGo={onGo}
                  heading={selling ? "Ready to make it?" : "Ready to make it?"}
                />
              }
            />
          </div>



          {/* ── What the number is FOR (Anain, 2026-08-27) ──
              The page argued for an Instant Store and then offered no way
              into one: the exits were "make the book", "compare the
              routes" and "you wanted the other calculator". This closes it
              on the shop, after the arithmetic rather than before it,
              because the number is the argument.

              Written for a reader who has already priced a sale, so it
              assumes the decision instead of asking about it. Same panel
              as the catalogue's, different words. */}
          {selling && (
            <InstantStoreLane
              title="Next, the shop it sells from"
              onGo={() => onGo?.("instantstore")}
            >
              An Instant Store is one link for this book, set up in minutes. Share it wherever your readers
              already are, and we print and ship every order as it comes in. Nothing to build, and no
              shopfront to run.
            </InstantStoreLane>
          )}

          {/* ── The other page ──
              Two pages, not two tabs: the maker's price lives under
              Pricing, the seller's margin under Sell & Self-Publish. Each
              names the other plainly, because arriving at the wrong one is
              the most likely mistake either page invites. */}
          <div
            className="stack-md"
            style={{
              background: C.blue50, border: `1px solid ${C.blue100}`, borderRadius: R.lg, padding: 24,
              display: "grid", gap: 16, gridTemplateColumns: "1fr auto", alignItems: "center",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["4xl"], fontWeight: 500, lineHeight: 1.25, color: C.blue950 }}>
                {m.swap}
              </div>
              <p style={{ fontSize: TYPE.base, lineHeight: 1.65, color: T.textNeutral, margin: "6px 0 0", maxWidth: 660 }}>
                {m.swapBody}
              </p>
            </div>
            <button
              onClick={() => onGo && onGo(m.other === "sell" ? "margin" : "pricing")}
              style={{
                height: BUTTON_HEIGHT, padding: "0 22px", borderRadius: R.md,
                background: T.bgBrand, color: T.textInverse, border: "1px solid transparent",
                fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 700,
                letterSpacing: 0.6, textTransform: "uppercase", whiteSpace: "nowrap",
              }}
            >
              {MODES[m.other].tab}
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
