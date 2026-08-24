import React, { useState, useEffect } from "react";
import Home from "./Home.jsx";
import ProductPage from "./ProductPage.jsx";
import PdfToBook from "./PdfToBook.jsx";
import GetStarted from "./GetStarted.jsx";
import SiteNav from "./SiteNav.jsx";
import SiteFooter from "./SiteFooter.jsx";
import WaysToSell from "./WaysToSell.jsx";
import Estimator from "./Estimator.jsx";

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
  /* The home page comes first because that is where the journey actually
     starts, and because the lane into get-started is the thing it adds. */
  { id: "home",       short: "Home",         label: "blurb.com — the lane into get started" },
  /* A product page, between the home page and get-started, because that is
     where it sits on the live site: home → /photo-books/<cover> → build. It
     is the doorway page — retail-only, one line for a seller. */
  { id: "product",    short: "Photo book",   label: "/photo-books/imagewrap-hardcover-photo-book — the doorway" },
  /* The other way in: a finished file. The home page's Print prompt lands
     here, and it is one of only two marketing pages that compute a price
     from a product spec. */
  { id: "pdftobook",  short: "PDF to book",  label: "/pdf-to-book — print a file you already have" },
  { id: "getstarted", short: "Get started",  label: "Get started — the intent router" },
  { id: "waystosell", short: "Ways to sell", label: "The ways to sell" },
  /* Two pages, not two tabs. The maker's price sits under Pricing; the
     seller's margin sits under Sell & Self-Publish, which is what keeps
     the public pricing pages retail-only. */
  { id: "pricing",    short: "Pricing",      label: "Pricing calculator — under Pricing" },
  { id: "margin",     short: "Margin",       label: "Margin estimator — under Sell & Self-Publish" },
];

function StageStepper({ stage, onJump }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 2,
        border: `1px solid ${T.border}`, borderRadius: 999,
        padding: 3, background: T.bg, overflowX: "auto", maxWidth: "100%",
      }}
    >
      {STAGES.map((s, i) => {
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

function DemoBar({ stage, onJump }) {
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
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <WipChip />
      </div>
      <StageStepper stage={stage} onJump={onJump} />
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

  /* What the previous screen said on its way here — a route, a product
     type, or nothing. The home page's lanes are the only thing that sets
     it, and it exists so a lane arrives as an answer rather than as a
     link: choosing "I'm selling something" should land on get-started
     with the question already answered, not ask it again.

     Cleared whenever the stepper is used, because jumping stages from the
     demo bar is not following a lane. */
  const [entry, setEntry] = useState(null);
  const go = (id, opts = null) => { setEntry(opts); setStage(id); };
  const jump = id => { setEntry(null); setStage(id); };

  /* Changing screen is a page change, so it starts at the top. Without
     this you keep the scroll position of the page you left — follow a
     link from the foot of one page and you land halfway down the next.
     Instant, not smooth: a long smooth scroll on navigation is slower and
     more disorienting than simply being there. */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [stage]);

  /* Column layout, so the footer sits on the bottom of the viewport when a
     screen is short and after the content when it is not. */
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column" }}>
      {/* The demo bar and the site nav stick as one block. Sticking the nav
          alone would need the demo bar's height as an offset, and that height
          changes when the bar wraps on a narrow screen — one sticky wrapper
          holds them together at any width. The nav keeps its own relative
          position inside, so the mega-menus still hang off it. */}
      <div style={{ position: "sticky", top: 0, zIndex: 40 }}>
        <DemoBar stage={stage} onJump={jump} />
        <SiteNav signedIn={signedIn} onSignedIn={setSignedIn} onGo={jump} />
      </div>
      {/* Keyed on the stage so switching screens fades rather than cuts. */}
      <div key={stage} className="fade-in" style={{ flex: 1, minWidth: 0 }}>
        {stage === "home"       && <Home onGo={go} />}
        {stage === "product"    && <ProductPage onGo={go} seed={entry?.seed} />}
        {stage === "pdftobook"  && <PdfToBook onGo={go} />}
        {stage === "getstarted" && (
          <GetStarted
            signedIn={signedIn}
            onSignIn={() => setSignedIn(true)}
            initialRoute={entry?.route}
            initialFormat={entry?.format}
            initialSeed={entry?.seed}
            onGo={go}
          />
        )}
        {stage === "waystosell" && <WaysToSell onGo={go} />}
        {stage === "pricing"    && <Estimator mode="make" onGo={go} seed={entry?.seed} />}
        {stage === "margin"     && <Estimator mode="sell" onGo={go} seed={entry?.seed} />}
      </div>
      <SiteFooter />
    </div>
  );
}
