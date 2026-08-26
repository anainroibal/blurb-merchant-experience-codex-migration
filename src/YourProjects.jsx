import React from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";
import { PROJECTS } from "./projects.js";

/* ────────────────────────────────────────────────────────────────
   Sell something you have already made.

   This is a DESTINATION, not an input. Whoever lands on
   /getting-started is starting something new — that is what the page
   is for, and what its steps assume. So an existing project is not a
   shortcut through the configurator; it is one of the two things you
   can do once the page has done its job.

   That puts it at the end, in the handoff, beside the routes to
   making a book. And it puts the log-in there too: no reason to ask
   who someone is before they have seen a price.

   Two states:
     · signed out — offer it, do not claim they have projects
     · signed in  — their projects, with proof status, each a way in
   ──────────────────────────────────────────────────────────────── */

function ProofChip({ hasProof }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "3px 9px", borderRadius: 999, whiteSpace: "nowrap",
        fontSize: TYPE.sm, fontWeight: 700,
        background: hasProof ? C.blue50 : C.gray100,
        color: hasProof ? C.blue950 : T.textSubtle,
        border: `1px solid ${hasProof ? C.blue100 : T.border}`,
      }}
    >
      <span className="ms" style={{ fontSize: 14 }}>{hasProof ? "check_circle" : "schedule"}</span>
      {hasProof ? "Proof on file" : "Needs a proof"}
    </span>
  );
}

function ProjectCard({ p }) {
  return (
    <button
      className="card-move"
      style={{
        textAlign: "left", background: T.bgNeutral, borderRadius: R.lg, padding: 16,
        border: `1px solid ${T.border}`,
        display: "grid", gridTemplateColumns: "72px 1fr auto", gap: 14, alignItems: "center",
        fontFamily: FONT_BODY, minWidth: 0,
      }}
    >
      <span style={{
        width: 72, height: 72, borderRadius: R.md, display: "grid", placeItems: "center",
        background: C.gray100,
      }}>
        <span className="ms" style={{ fontSize: 32, color: C.gray400 }}>{p.icon}</span>
      </span>

      <span style={{ display: "grid", gap: 5, minWidth: 0 }}>
        <span style={{
          fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 500, lineHeight: 1.2,
          color: T.textNeutral,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {p.title}
        </span>
        <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>{p.subtitle}</span>
        <span style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
          <ProofChip hasProof={p.hasProof} />
          {p.selling && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "3px 9px", borderRadius: 999, whiteSpace: "nowrap",
              fontSize: TYPE.sm, fontWeight: 700,
              background: C.blue600, color: "#fff",
            }}>
              <span className="ms" style={{ fontSize: 14 }}>link</span>
              Already selling
            </span>
          )}
        </span>
      </span>

      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4, flex: "0 0 auto",
        fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
        color: T.textBrand,
      }}>
        {p.selling ? "Manage" : "Set up"}
        <span className="ms" style={{ fontSize: 18 }}>chevron_right</span>
      </span>
    </button>
  );
}

/* ── The same fork, sized for the summary panel ──
   The log-in and the project list are a NEXT STEP rather than a section of
   their own (Ana, DES-482), so they sit under "Ready to make it?" at the
   foot of the panel — beside the tools, which are the other way to arrive
   at a book. That panel is 310px wide, and the full-width card and the
   340px project cards do not fit in it, so the compact form is a list of
   rows: what it is, whether it can be bought yet, and a way in. */
function CompactProject({ p }) {
  return (
    <button
      style={{
        font: "inherit", textAlign: "left", cursor: "pointer", width: "100%",
        background: T.bgNeutral, border: `1px solid ${T.border}`, borderRadius: R.md,
        padding: "10px 12px", display: "flex", gap: 10, alignItems: "center", minWidth: 0,
      }}
    >
      <span className="ms" style={{ fontSize: 20, color: C.gray400, flex: "0 0 auto" }}>{p.icon}</span>
      <span style={{ display: "grid", gap: 3, minWidth: 0, flex: "1 1 auto" }}>
        <span style={{
          fontSize: TYPE.base, fontWeight: 600, color: T.textNeutral,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {p.title}
        </span>
        <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>
          {p.selling ? "Already selling" : p.hasProof ? "Proof on file" : "Needs a proof"}
        </span>
      </span>
      <span className="ms" style={{ fontSize: 20, color: T.textBrand, flex: "0 0 auto" }}>chevron_right</span>
    </button>
  );
}

export default function YourProjects({ signedIn, onSignIn, compact = false }) {
  if (compact) {
    return (
      <div style={{ display: "grid", gap: 10, fontFamily: FONT_BODY, minWidth: 0 }}>
        <div style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>
            Or sell one you have already made
          </span>
          <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>
            {signedIn
              ? "It keeps the size, paper and cover you chose. All that is left is the price, the link and your payout."
              : "Log in and a finished book keeps the size, paper and cover you chose. All that is left is the price, the link and your payout."}
          </span>
        </div>

        {signedIn
          ? PROJECTS.map(p => <CompactProject key={p.id} p={p} />)
          : (
            <button
              onClick={onSignIn}
              style={{
                font: "inherit", fontSize: TYPE.base, fontWeight: 600, minHeight: 44, padding: "0 18px",
                borderRadius: R.md, background: "transparent", color: T.textBrand,
                border: `1px solid ${T.borderBrand}`, cursor: "pointer", width: "100%",
              }}
            >
              Log in
            </button>
          )}
      </div>
    );
  }


  /* Signed out — offer it, but do not claim they have projects. */
  if (!signedIn) {
    return (
      <div
        style={{
          background: T.bgNeutral, border: `1px solid ${T.border}`, borderRadius: R.lg,
          padding: 24, fontFamily: FONT_BODY,
          display: "grid", gap: 16, gridTemplateColumns: "1fr auto", alignItems: "center",
        }}
        className="stack-md"
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["4xl"], fontWeight: 500, lineHeight: 1.2 }}>
            Already made your book?
          </div>
          <p style={{ fontSize: TYPE.base, lineHeight: 1.65, color: T.textSubtle, margin: "8px 0 0", maxWidth: 660 }}>
            Log in to sell one you have already finished. It keeps the size, paper and cover you chose,
            so there is nothing to set up again — just the price, the link and your payout.
          </p>
        </div>
        <button
          onClick={onSignIn}
          style={{
            height: BUTTON_HEIGHT, padding: "0 24px", borderRadius: R.md,
            fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 700,
            letterSpacing: 0.6, textTransform: "uppercase", whiteSpace: "nowrap",
            background: "transparent", color: T.textBrand, border: `1px solid ${T.borderBrand}`,
          }}
        >
          Log in
        </button>
      </div>
    );
  }

  /* Signed in with nothing to show — say nothing rather than an empty shelf. */
  if (!PROJECTS.length) return null;

  return (
    <div style={{ fontFamily: FONT_BODY }}>
      <div style={{ fontSize: TYPE.base, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 14 }}>
        Or sell one you have already made
      </div>

      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
        {PROJECTS.map(p => <ProjectCard key={p.id} p={p} />)}
      </div>

      <p style={{ fontSize: TYPE.sm, color: T.textSubtle, marginTop: 12, lineHeight: 1.55 }}>
        Selling is set per project — the rest of your dashboard is unaffected. A project with no proof on file
        can still go live; buyers just cannot buy until you have ordered and reviewed a copy.
      </p>
    </div>
  );
}
