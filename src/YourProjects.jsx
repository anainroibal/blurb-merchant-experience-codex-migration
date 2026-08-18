import React from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";
import { PROJECTS } from "./projects.js";

/* ────────────────────────────────────────────────────────────────
   Sell something you have already made.

   Stacey's setup flow forks on whether the seller has projects. Most
   returning sellers do, and making them re-pick a product type and
   re-configure a book they have already built is work they should not
   have to repeat — the project already knows its size, paper and cover.

   Three states:
     · signed out          — offer the shortcut, do not assume it applies
     · signed in, projects — pick one, or start something new
     · signed in, none     — nothing to show, fall through to the types
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

function ProjectCard({ p, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(p)}
      aria-pressed={selected}
      style={{
        textAlign: "left", background: T.bgNeutral, borderRadius: R.lg, padding: 16,
        border: selected ? `2px solid ${T.borderBrand}` : `1px solid ${T.border}`,
        margin: selected ? 0 : 1,
        display: "grid", gridTemplateColumns: "72px 1fr", gap: 14, alignItems: "center",
        fontFamily: FONT_BODY, minWidth: 0,
      }}
    >
      <span style={{
        width: 72, height: 72, borderRadius: R.md, display: "grid", placeItems: "center",
        background: selected ? C.blue50 : C.gray100,
      }}>
        <span className="ms" style={{ fontSize: 32, color: selected ? C.blue600 : C.gray400 }}>{p.icon}</span>
      </span>

      <span style={{ display: "grid", gap: 5, minWidth: 0 }}>
        <span style={{
          fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 500, lineHeight: 1.2,
          color: selected ? C.blue950 : T.textNeutral,
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
    </button>
  );
}

export default function YourProjects({ signedIn, onSignIn, selectedId, onSelect, onStartNew }) {
  /* Signed out — offer it, but do not claim they have projects. */
  if (!signedIn) {
    return (
      <div
        style={{
          background: T.bgNeutral, border: `1px solid ${T.border}`, borderRadius: R.lg,
          padding: 24, marginBottom: 28, fontFamily: FONT_BODY,
          display: "grid", gap: 16, gridTemplateColumns: "1fr auto", alignItems: "center",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["4xl"], fontWeight: 500, lineHeight: 1.2 }}>
            Already made a book with us?
          </div>
          <p style={{ fontSize: TYPE.base, lineHeight: 1.65, color: T.textSubtle, margin: "8px 0 0", maxWidth: 620 }}>
            Log in and sell one you have already finished — it keeps the size, paper and cover you chose,
            so there is nothing to set up again.
          </p>
        </div>
        <button
          onClick={onSignIn}
          style={{
            height: BUTTON_HEIGHT, padding: "0 24px", borderRadius: R.md,
            fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 700,
            letterSpacing: 0.6, textTransform: "uppercase", whiteSpace: "nowrap",
            background: C.blue950, color: "#fff", border: "1px solid transparent",
          }}
        >
          Log in
        </button>
      </div>
    );
  }

  /* Signed in with nothing to show — say nothing, fall through to the types. */
  if (!PROJECTS.length) return null;

  return (
    <div style={{ marginBottom: 32, fontFamily: FONT_BODY }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
        <div style={{ fontSize: TYPE.base, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>
          Sell one you have already made
        </div>
        <button
          onClick={onStartNew}
          style={{
            background: "transparent", border: 0, padding: 0, fontFamily: FONT_BODY,
            fontSize: TYPE.base, fontWeight: 700, color: C.blue600,
          }}
        >
          Or start something new ↓
        </button>
      </div>

      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        {PROJECTS.map(p => (
          <ProjectCard key={p.id} p={p} selected={selectedId === p.id} onSelect={onSelect} />
        ))}
      </div>

      <p style={{ fontSize: TYPE.sm, color: T.textSubtle, marginTop: 12, lineHeight: 1.55 }}>
        Selling is set per project — the rest of your dashboard is unaffected. A project with no proof on file
        can still go live; buyers just cannot buy until you have ordered and reviewed a copy.
      </p>
    </div>
  );
}
