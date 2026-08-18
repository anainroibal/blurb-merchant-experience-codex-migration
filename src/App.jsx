import React, { useState, useEffect } from "react";
import GetStarted from "./GetStarted.jsx";
import SiteNav from "./SiteNav.jsx";
import WaysToSell from "./WaysToSell.jsx";

/* ────────────────────────────────────────────────────────────────
   Blurb — Merchant Experience prototypes

   Companion to the "Merchant Pricing and Experience" FigJam board.
   Scope: the seller journey — get started, the five ways to sell,
   the intent-first estimator, and the checkout-link setup screen.

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

const FONT_HEADING = "Inter, -apple-system, BlinkMacSystemFont, sans-serif";

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
  { id: "getstarted", short: "Get started",  label: "Get started — the intent router" },
  { id: "waystosell", short: "Ways to sell", label: "The ways to sell" },
  { id: "estimator",  short: "Estimator",    label: "Intent-first estimator" },
  { id: "link",       short: "Link setup",   label: "Checkout link setup" },
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
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, flexWrap: "wrap",
        padding: "10px 16px", borderBottom: `1px solid ${T.border}`,
        background: T.bgSubtle, position: "sticky", top: 0, zIndex: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <WipChip />
      </div>
      <StageStepper stage={stage} onJump={onJump} />
      <div style={{ fontSize: 12, color: T.textSubtle }}>Merchant Experience</div>
    </div>
  );
}

/* ── Placeholder screen. Replace one at a time as each is designed. ── */
function Placeholder({ title, blurb, notes }) {
  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "56px 24px 96px" }}>
      <h1 style={{ fontFamily: FONT_HEADING, fontSize: 40, fontWeight: 600, lineHeight: 1.15, margin: 0, color: T.textBold }}>
        {title}
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.55, color: T.textSubtle, marginTop: 12 }}>{blurb}</p>
      <div
        style={{
          marginTop: 32, padding: 24, borderRadius: T.radius,
          background: T.panel, border: `1px solid #d8e9f2`,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.4, color: T.textSubtle, textTransform: "uppercase" }}>
          From the board
        </div>
        <ul style={{ margin: "12px 0 0", paddingLeft: 20, fontSize: 16, lineHeight: 1.7 }}>
          {notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      </div>
    </div>
  );
}

const SCREENS = {
  waystosell: <WaysToSell />,
  estimator: (
    <Placeholder
      title="Intent-first estimator"
      blurb="Public and anonymous. It educates and converts; it cannot create anything."
      notes={[
        'Overlaps the pricing agent in Stacey\'s flow — agree where each lives.',
        'Margin is destination-free, so it can show anywhere. Buyer totals need a ship-to and wait for later.',
        'The ladder is two rungs: your cost → your price → your profit.',
        'Comparison lives here, not on the link screen.',
      ]}
    />
  ),
  link: (
    <Placeholder
      title="Checkout link setup"
      blurb="Per project, in the dashboard. Stacey's Checkout Link file specifies this flow — read it before designing here."
      notes={[
        'Agent-led: Setup → Drafting → Confirmation → Ongoing.',
        'VARIANTS are the unit, not the book — priced or options-only, mapped to a project.',
        'The quality gate blocks buying, not publishing. Until a proof exists the PDP hides price, quantity and Add to cart.',
        'PayPal for payout. QR code ships with the link.',
        'Highest-intent entry point is receiving the proof.',
      ]}
    />
  ),
};

export default function App() {
  const [stage, setStage] = useState(() => {
    const q = new URLSearchParams(window.location.search).get("stage");
    return STAGES.some(s => s.id === q) ? q : "getstarted";
  });

  const [navVariant, setNavVariant] = useState("proposed");
  const [signedIn, setSignedIn] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <DemoBar stage={stage} onJump={setStage} />
      <SiteNav variant={navVariant} onVariant={setNavVariant} signedIn={signedIn} onSignedIn={setSignedIn} />
      {stage === "getstarted"
        ? <GetStarted signedIn={signedIn} onSignIn={() => setSignedIn(true)} />
        : SCREENS[stage]}
    </div>
  );
}
