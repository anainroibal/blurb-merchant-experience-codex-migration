import React, { useState, useEffect, useRef } from "react";
import ProductPage from "./ProductPage.jsx";
import SellerLanding from "./SellerLanding.jsx";
import GetStarted from "./GetStarted.jsx";
import SiteNav from "./SiteNav.jsx";
import SiteFooter from "./SiteFooter.jsx";
import Estimator from "./Estimator.jsx";
import Home from "./Home.jsx";
import ProductCatalog from "./ProductCatalog.jsx";
import InstantStorePage from "./InstantStorePage.jsx";
import ShippingPage from "./ShippingPage.jsx";

/* ────────────────────────────────────────────────────────────────
   Blurb — Merchant Experience prototypes

   Companion to the "Merchant Pricing and Experience" FigJam board.
   Scope: the seller journey — get started, the five ways to sell,
   and the intent-first estimator. The checkout-link setup screen is
   Stacey's design and is deliberately NOT prototyped here.

   Conventions match Blurb Checkout Prototypes on purpose: design
   tokens in `T`, inline style objects, no CSS framework, all state
   in useState. Keep it that way so the two read alike.
   ──────────────────────────────────────────────────────────────── */

/* ── Design tokens ── */
const T = {
  brand:      "#107eb1",
  brandDark:  "#0d2f44",
  text:       "#1e1e1e",
  textSubtle: "#595959",
  textBold:   "#111",
  border:     "#e0e0e0",
  borderSoft: "#eee",
  panel:      "#f0f7fb",
  success:    "#2e7d32",
  warn:       "#b86114",
  bg:         "#fff",
  bgSubtle:   "#f9f9f9",
  radius:     8,
};

/* Branch name comes from a build-time define — Vercel's VERCEL_GIT_COMMIT_REF,
   falling back to the local git branch. See vite.config.js. */
const BRANCH = typeof __BRANCH__ !== "undefined" ? __BRANCH__ : "local";
const IS_WIP = BRANCH !== "main";

/* Warm outline chip, same treatment as the checkout prototype: brown ink on a
   light warm ground. It must survive being screenshotted into a deck, so it
   never hides — not even when the demo controls are hidden. */
const WIP_INK    = "#7a4b12";
const WIP_BG     = "#fdf6ec";
const WIP_BORDER = "#e6c9a0";

function useViewport() {
  const [w, setW] = useState(typeof window === "undefined" ? 1280 : window.innerWidth);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return { width: w, isMobile: w < 768, isTablet: w >= 768 && w < 1024, isDesktop: w >= 1024 };
}

function WipChip() {
  if (!IS_WIP) return null;
  const { width } = useViewport();
  const narrow = width < 560;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 10px", borderRadius: 999,
        border: `1px solid ${WIP_BORDER}`, background: WIP_BG, color: WIP_INK,
        fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
      }}
    >
      <span className="ms" style={{ fontSize: 14 }}>warning</span>
      {narrow ? "Not approved" : `Work in progress — not approved · ${BRANCH}`}
    </span>
  );
}

/* ── Stages. One linear journey, same idea as the checkout stepper. ── */
const STAGES = [
  /* Home is back (2026-08-24). It is where the journey actually starts, and
     what it adds is the lane: the Instant Store is the newest way to sell
     and nothing on the live home page mentions it. */
  { id: "home",       short: "Home",         label: "blurb.com — the lane into get started" },
  /* The product page comes next: it is where someone meets a price before
     they have decided anything, and it is the doorway page — retail-only,
     one quiet line for a seller. */
  /* The catalogue sits between home and a product page, as it does on the
     site: home → /formats → a PDP. Its selling lane is the one thing on it
     that is ours. */
  { id: "catalog",    short: "Shop all",     label: "/formats — the product catalogue, with a selling lane" },
  { id: "product",    short: "Photo book",   label: "/photo-books/imagewrap-hardcover-photo-book — the doorway" },
  { id: "getstarted", short: "Get started",  label: "Get started — the intent router" },
  /* Ways to sell, renamed and given one goal: which route is mine? It is
     where a seller lands, and it ends in the single step that follows. */
  { id: "seller",     short: "Sell",         label: "/sell — how to print it and how to sell it, Instant Store included" },
  /* Two pages, not two tabs. The maker's price sits under Pricing; the
     seller's margin sits under Sell & Self-Publish, which is what keeps
     the public pricing pages retail-only. */
  { id: "pricing",    short: "Pricing",      label: "Pricing calculator — under Pricing" },
  { id: "margin",     short: "Profit",       label: "Instant Store profit calculator — under Sell & Self-Publish" },
  /* Crometrics' page. A placeholder so the links into it can be reviewed. */
  { id: "instantstore", short: "Instant Store", label: "The Instant Store page — placeholder, built by Crometrics" },
  /* /shipping, after both calculators, because what it now does is explain
     what they compute — 2026-08-27. */
  { id: "shipping",   short: "Shipping",     label: "/shipping — informational, now that both calculators price delivery" },
];

/* ────────────────────────────────────────────────────────────────
   TWO VERSIONS OF THE SAME PROPOSAL (2026-08-24)

   RECOMMENDED is everything in this prototype: the intent-first
   /getting-started, both calculators, the Sell page, the catalogue and
   its lane, the nav, the Instant Store landing page.

   MINIMUM EFFORT is the shippable subset — what the Instant Store needs
   in order to exist at all, and nothing that asks engineering to rebuild
   a page that already works:

     · the Instant Store landing page (Crometrics is building it anyway)
     · the nav changes
     · the doorway line on the PDP
     · the banner lanes and copy that point at it
     · the Sell page's fourth card and its comparison

   And what it drops: /getting-started (unchanged today), the pricing
   calculator (stays exactly as blurb.com has it), and the margin
   estimator (does not exist, so nothing is lost by not building it).

   The switch is not a toggle between designs — the screens are the same
   screens. It changes WHICH of them are claimed, and what the surfaces
   in the lean set point at, because half their destinations are pages
   the lean version never builds. A reviewer can see both scopes without
   two prototypes to keep in sync.
   ──────────────────────────────────────────────────────────────── */
const VERSIONS = [
  { id: "full", label: "Recommended", note: "Every screen in this proposal" },
  { id: "lean", label: "Minimum effort", note: "Instant Store, nav, PDP line, banners, Sell page" },
];

/* The lean set, in journey order. Anything not listed here is a page the
   minimum-effort version does not touch. */
const LEAN_STAGES = ["home", "catalog", "product", "seller", "instantstore"];

const stagesFor = version =>
  version === "lean" ? STAGES.filter(s => LEAN_STAGES.includes(s.id)) : STAGES;

function VersionSwitch({ version, onVersion }) {
  const [open, setOpen] = useState(false);
  const current = VERSIONS.find(v => v.id === version) ?? VERSIONS[0];

  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
        color: T.textSubtle,
      }}>
        Scope
      </span>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          border: `1px solid ${T.brand}`, background: T.panel, color: T.brandDark,
          borderRadius: 999, padding: "3px 10px 3px 12px", fontSize: 12, fontWeight: 700,
          whiteSpace: "nowrap", cursor: "pointer",
        }}
      >
        {current.label}
        <span className="ms turn" style={{ fontSize: 16, transform: open ? "rotate(180deg)" : "none" }}>
          expand_more
        </span>
      </button>

      {open && (
        <>
          {/* Click-away, so the menu behaves like the ones in the nav. */}
          <span
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 60 }}
          />
          <span
            className="pop-in"
            style={{
              position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 61,
              background: "#fff", border: `1px solid ${T.border}`, borderRadius: 8,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: 6, minWidth: 280,
              display: "grid", gap: 2,
            }}
          >
            {VERSIONS.map(v => {
              const on = v.id === version;
              return (
                <button
                  key={v.id}
                  onClick={() => { onVersion(v.id); setOpen(false); }}
                  aria-pressed={on}
                  style={{
                    display: "grid", gap: 2, textAlign: "left", cursor: "pointer",
                    background: on ? T.panel : "transparent", border: 0, borderRadius: 6,
                    padding: "8px 10px", font: "inherit",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: on ? T.brandDark : T.textNeutral }}>
                    {v.label}
                  </span>
                  <span style={{ fontSize: 12, color: T.textSubtle, lineHeight: 1.4 }}>{v.note}</span>
                </button>
              );
            })}
          </span>
        </>
      )}
    </span>
  );
}

function StageStepper({ stage, onJump, version }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 2,
        border: `1px solid ${T.border}`, borderRadius: 999,
        padding: 3, background: T.bg, overflowX: "auto", maxWidth: "100%",
      }}
    >
      {stagesFor(version).map((s, i) => {
        const active = s.id === stage;
        return (
          <React.Fragment key={s.id}>
            {i > 0 && (
              <span className="ms" style={{ fontSize: 16, color: "#bbb", flex: "0 0 auto" }}>
                chevron_right
              </span>
            )}
            <button
              onClick={() => onJump(s.id)}
              title={s.label}
              aria-current={active ? "step" : undefined}
              style={{
                border: 0, borderRadius: 999, padding: "6px 12px",
                background: active ? T.brand : "transparent",
                color: active ? "#fff" : T.textSubtle,
                fontSize: 13, fontWeight: active ? 600 : 500,
                whiteSpace: "nowrap", flex: "0 0 auto",
              }}
            >
              {s.short}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* The session switch lives here rather than under the nav.
   It is a prototype control — there is no signing in — so it belongs with
   the other prototype chrome, beside the work-in-progress chip. Under the
   header it read as part of the design, which is exactly what a control
   like this must not do. */
function SessionSwitch({ signedIn, onSignedIn }) {
  if (!onSignedIn) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
        color: T.textSubtle,
      }}>
        Session
      </span>
      {[["Signed out", false], ["Signed in", true]].map(([label, v]) => (
        <button
          key={label}
          onClick={() => onSignedIn(v)}
          aria-pressed={signedIn === v}
          style={{
            border: signedIn === v ? `1px solid ${T.brand}` : `1px solid ${T.border}`,
            background: signedIn === v ? T.panel : T.bg,
            color: signedIn === v ? T.brandDark : T.textSubtle,
            borderRadius: 999, padding: "3px 12px", fontSize: 12,
            fontWeight: signedIn === v ? 700 : 500, whiteSpace: "nowrap", cursor: "pointer",
          }}
        >
          {label}
        </button>
      ))}
    </span>
  );
}

function DemoBar({ stage, onJump, signedIn, onSignedIn, version, onVersion }) {
  return (
    <div
      className="demo-bar"
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, flexWrap: "wrap",
        padding: "10px 16px", borderBottom: `1px solid ${T.border}`,
        background: T.bgSubtle,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <WipChip />
        <SessionSwitch signedIn={signedIn} onSignedIn={onSignedIn} />
        <VersionSwitch version={version} onVersion={onVersion} />
      </div>
      <StageStepper stage={stage} onJump={onJump} version={version} />
      <div className="hide-sm" style={{ fontSize: 12, color: T.textSubtle }}>Merchant Experience</div>
    </div>
  );
}



export default function App() {
  const [stage, setStage] = useState(() => {
    const q = new URLSearchParams(window.location.search).get("stage");
    return STAGES.some(s => s.id === q) ? q : "getstarted";
  });

  const [signedIn, setSignedIn] = useState(false);

  /* Which scope is being shown. `?version=lean` so a link can open the
     minimum-effort set directly — the two are reviewed by different people
     and each will want their own URL. */
  const [version, setVersion] = useState(() =>
    new URLSearchParams(window.location.search).get("version") === "lean" ? "lean" : "full");

  /* Switching to the lean set from a screen it does not include has to land
     somewhere: the home page, which both versions have. */
  const changeVersion = next => {
    setVersion(next);
    setEntry(null);
    if (!stagesFor(next).some(s => s.id === stage)) setStage("home");
  };

  /* What the previous screen said on its way here — a specification, a
     route, or nothing. It exists so a handover arrives as an answer rather
     than as a link: the product page sending someone to build the book they
     just configured should not drop them on a default one.

     Cleared whenever the stepper is used, because jumping stages from the
     demo bar is not following a link. */
  const [entry, setEntry] = useState(null);
  const go = (id, opts = null) => { setEntry(opts); setStage(id); };
  const jump = id => { setEntry(null); setStage(id); };

  const lean = version === "lean";

  /* Changing screen is a page change, so it starts at the top. Without
     this you keep the scroll position of the page you left — follow a
     link from the foot of one page and you land halfway down the next.
     Instant, not smooth: a long smooth scroll on navigation is slower and
     more disorienting than simply being there. */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [stage]);

  /* ── How tall the sticky header is, published as --nav-h ──
     Anything else that sticks has to clear it, and its height is not a
     constant: the demo bar wraps on a narrow screen, so the block is 124px
     at desktop width and taller below that. A hardcoded offset was wrong at
     both — the summary panel slid under the nav. Measured instead, and
     re-measured on resize, so one number is right everywhere. */
  const headerRef = useRef(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const publish = () =>
      document.documentElement.style.setProperty("--nav-h", `${Math.round(el.getBoundingClientRect().height)}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Column layout, so the footer sits on the bottom of the viewport when a
     screen is short and after the content when it is not. */
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column" }}>
      {/* The demo bar and the site nav stick as one block. Sticking the nav
          alone would need the demo bar's height as an offset, and that height
          changes when the bar wraps on a narrow screen — one sticky wrapper
          holds them together at any width. The nav keeps its own relative
          position inside, so the mega-menus still hang off it. */}
      <div ref={headerRef} style={{ position: "sticky", top: 0, zIndex: 40 }}>
        <DemoBar
          stage={stage}
          onJump={jump}
          signedIn={signedIn}
          onSignedIn={setSignedIn}
          version={version}
          onVersion={changeVersion}
        />
        <SiteNav signedIn={signedIn} onSignedIn={setSignedIn} onGo={jump} lean={lean} />
      </div>
      {/* Keyed on the stage so switching screens fades rather than cuts. */}
      <div key={stage} className="fade-in" style={{ flex: 1, minWidth: 0 }}>
        {/* `lean` is passed rather than read from a store: it changes where
            four surfaces point, and nothing else. See VERSIONS above. */}
        {stage === "home"       && <Home onGo={go} lean={lean} />}
        {stage === "catalog"    && <ProductCatalog onGo={go} lean={lean} />}
        {stage === "instantstore" && <InstantStorePage onGo={go} lean={lean} />}
        {stage === "product"    && <ProductPage onGo={go} seed={entry?.seed} lean={lean} />}
        {stage === "getstarted" && (
          <GetStarted
            signedIn={signedIn}
            onSignIn={() => setSignedIn(true)}
            initialRoute={entry?.route}
            initialSeed={entry?.seed}
            onGo={go}
          />
        )}
        {stage === "seller"     && <SellerLanding onGo={go} lean={lean} />}
        {stage === "pricing"    && <Estimator mode="make" onGo={go} seed={entry?.seed} />}
        {stage === "margin"     && <Estimator mode="sell" onGo={go} seed={entry?.seed} />}
        {stage === "shipping"   && <ShippingPage onGo={go} />}
      </div>
      <SiteFooter />
    </div>
  );
}
