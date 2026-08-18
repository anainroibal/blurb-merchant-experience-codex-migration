import React from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";

/* ────────────────────────────────────────────────────────────────
   Where /getting-started stops.

   This page estimates and hands off. It does not try to complete the
   selling journey — setting up the link, connecting payout and the
   proof all happen after the project exists. So the last step is a
   fork: make it here, or bring one you already have.

   PDF upload is deliberately the favoured path. It is the shortest
   route to a finished book, and for a seller it is the on-ramp that
   skips the tools entirely.
   ──────────────────────────────────────────────────────────────── */

function Path({ icon, title, body, cta, primary, note }) {
  return (
    <div
      style={{
        background: T.bgNeutral, borderRadius: R.lg, padding: 24,
        border: primary ? `2px solid ${T.borderBrand}` : `1px solid ${T.border}`,
        margin: primary ? 0 : 1,
        display: "grid", gap: 12, alignContent: "start", minWidth: 0,
      }}
    >
      <span
        className="ms"
        style={{
          fontSize: 32, color: primary ? C.blue600 : C.gray400,
          background: primary ? C.blue50 : C.gray100,
          width: 56, height: 56, borderRadius: R.md, display: "grid", placeItems: "center",
        }}
      >
        {icon}
      </span>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["4xl"], fontWeight: 500, lineHeight: 1.2 }}>
        {title}
      </div>
      <p style={{ fontSize: TYPE.base, lineHeight: 1.65, color: T.textSubtle, margin: 0 }}>{body}</p>
      <button
        style={{
          height: BUTTON_HEIGHT, borderRadius: R.md, marginTop: 4,
          fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 700,
          letterSpacing: 0.6, textTransform: "uppercase",
          background: primary ? T.bgBrand : "transparent",
          color: primary ? T.textInverse : T.textBrand,
          border: primary ? "1px solid transparent" : `1px solid ${T.border}`,
        }}
      >
        {cta}
      </button>
      {note && <div style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>{note}</div>}
    </div>
  );
}

export default function Handoff({ selling }) {
  return (
    <section>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["7xl"], fontWeight: 500, margin: 0, lineHeight: 1.2 }}>
          {selling ? "Ready to sell it?" : "Ready to make your book?"}
        </h2>
        <p style={{ fontSize: TYPE.lg, color: T.textSubtle, marginTop: 10, maxWidth: 620, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
          {selling
            ? "Bring a finished book or make one here. Your project comes first — the link, the payout and the proof all follow from it."
            : "Bring a finished book or make one here. You only pay when it's ready to print."}
        </p>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", marginTop: 24 }}>
        <Path
          primary
          icon="upload_file"
          title="Upload your PDF"
          body="Already have a finished book? This is the quickest route — upload it and it's ready to order."
          cta="Upload your PDF"
          note={selling ? "The shortest path to a sellable book." : null}
        />
        <Path
          icon="design_services"
          title="Create online"
          body="Design in the browser with our free tool. Nothing to install."
          cta="Create online"
        />
        <Path
          icon="download"
          title="Download BookWright"
          body="Our desktop app, for longer books and more control over layout."
          cta="Download BookWright"
        />
      </div>

      {selling && (
        <div
          style={{
            marginTop: 20, background: C.gray50, border: `1px solid ${T.border}`,
            borderRadius: R.lg, padding: 24,
            display: "grid", gap: 16, gridTemplateColumns: "1fr auto", alignItems: "center",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["4xl"], fontWeight: 500, lineHeight: 1.2 }}>
              See it before your buyers do
            </div>
            <p style={{ fontSize: TYPE.base, lineHeight: 1.65, color: T.textSubtle, margin: "8px 0 0", maxWidth: 660 }}>
              Blurb has always asked authors to order and review a copy before a book goes on sale. Your link
              can go live straight away — buyers just can't buy until your proof is on file. A discounted
              copy or a PDF proof, either one.
            </p>
          </div>
          <button
            style={{
              height: BUTTON_HEIGHT, padding: "0 24px", borderRadius: R.md,
              fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 700,
              letterSpacing: 0.6, textTransform: "uppercase", whiteSpace: "nowrap",
              background: C.blue950, color: T.textInverse, border: "1px solid transparent",
            }}
          >
            How selling works
          </button>
        </div>
      )}
    </section>
  );
}
