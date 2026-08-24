import React from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";
import YourProjects from "./YourProjects.jsx";
import {
  CATALOG, FORMAT_IDS, SELLING_CHANNEL, hasTool, formatsWithTool,
} from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   Where /getting-started stops.

   This page estimates and hands off. It does not try to complete the
   selling journey — setting up the link, connecting payout and the
   proof all happen after the project exists. So the last step is a
   fork: make it here, or bring one you already have.

   Everyone who lands here is assumed to be starting something new —
   that is what the steps above are for. Which makes the existing
   project a decision at the END, once the page has done its job, and
   not a shortcut past it. The log-in lives here for the same reason:
   no reason to ask who someone is before they have seen a price.

   PDF upload is deliberately the favoured path. It is the shortest
   route to a finished book, and for a seller it is the on-ramp that
   skips the tools entirely.
   ──────────────────────────────────────────────────────────────── */

/* `unavailable` is not a disabled card. A tool that cannot make what you
   have chosen should say so and say what it CAN make — a greyed-out
   button with no explanation leaves you guessing whether it is broken,
   whether you are signed out, or whether you chose wrong. */
function Path({ icon, title, body, cta, primary, note, unavailable }) {
  const quiet = unavailable || !primary;
  return (
    <div
      className="card-move"
      style={{
        background: unavailable ? C.gray50 : T.bgNeutral, borderRadius: R.lg, padding: 24,
        border: primary && !unavailable ? `2px solid ${T.borderBrand}` : `1px solid ${T.border}`,
        margin: primary && !unavailable ? 0 : 1,
        display: "grid", gap: 12, alignContent: "start", minWidth: 0,
      }}
    >
      <span
        className="ms"
        style={{
          fontSize: 32, color: quiet ? C.gray400 : C.blue600,
          background: quiet ? C.gray100 : C.blue50,
          width: 56, height: 56, borderRadius: R.md, display: "grid", placeItems: "center",
        }}
      >
        {icon}
      </span>
      <div style={{
        fontFamily: FONT_DISPLAY, fontSize: TYPE["4xl"], fontWeight: 500, lineHeight: 1.2,
        color: unavailable ? T.textSubtle : T.textNeutral,
      }}>
        {title}
      </div>
      <p style={{ fontSize: TYPE.base, lineHeight: 1.65, color: T.textSubtle, margin: 0 }}>{body}</p>
      <button
        style={{
          height: BUTTON_HEIGHT, borderRadius: R.md, marginTop: 4,
          fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 700,
          letterSpacing: 0.6, textTransform: "uppercase",
          background: primary && !unavailable ? T.bgBrand : "transparent",
          color: primary && !unavailable ? T.textInverse : T.textBrand,
          border: primary && !unavailable ? "1px solid transparent" : `1px solid ${T.border}`,
        }}
      >
        {cta}
      </button>
      {note && <div style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>{note}</div>}
    </div>
  );
}

/* ── What a checkout link cannot sell ──
   Said BEFORE the link is set up, not discovered after. Under "to Sell"
   the product row already hides what cannot be sold, and a silent
   omission is the worst version of this: the seller either does not
   notice, or notices and cannot tell whether it is a rule or a bug.

   Only the PDF exclusion is decided (2026-08-18). Notebooks and wall art
   are absent because nothing says they CAN be sold this way — a different
   thing from a decision, and named as such.

   What each OTHER channel takes is now known, from /self-publish
   (2026-08-19), so this can point somewhere instead of stopping at a no:
   a notebook cannot take a link, but the Bookstore sells notebooks. */
function LinkLimits({ formatId }) {
  const excluded = FORMAT_IDS
    .filter(id => id !== "pdf" && !(CATALOG[id].sellChannels || []).includes(SELLING_CHANNEL))
    .map(id => CATALOG[id].label);

  /* Where the thing you chose CAN be sold, if not here. */
  const elsewhere = formatId
    ? (CATALOG[formatId].sellChannels || []).filter(c => c !== SELLING_CHANNEL)
    : [];
  const NAMES = { bookstore: "the Blurb Bookstore", amazon: "Amazon", ingram: "Ingram" };

  return (
    <div style={{
      marginTop: 16, background: T.bgNeutral, border: `1px solid ${T.border}`,
      borderRadius: R.lg, padding: 20, display: "grid", gap: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="ms" style={{ fontSize: 20, color: T.textSubtle }}>info</span>
        <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>
          What a checkout link can sell
        </span>
      </div>
      <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.65, color: T.textSubtle }}>
        Printed books and magazines. <strong style={{ color: T.textNeutral }}>A PDF cannot be sold through a
        checkout link</strong> — you can still order one for yourself. {excluded.length > 0 && (
          <>Nor can {list(excluded)} — unconfirmed rather than decided, so ask before promising it to anyone.{" "}</>
        )}
        {elsewhere.length > 0 && formatId && (
          <>Beyond a link, {CATALOG[formatId].label.toLowerCase()} sell through{" "}
          {list(elsewhere.map(c => NAMES[c] ?? c))}.</>
        )}
      </p>
    </div>
  );
}

/* "Photo Books, Notebooks & Journals and PDFs" */
const list = items =>
  items.length <= 1 ? (items[0] ?? "")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

export default function Handoff({ route, signedIn, onSignIn, formatId, use, price, cost, sel }) {
  const selling = route === "sell";
  const bulk = route === "distribute";
  const product = formatId ? CATALOG[formatId] : null;
  const online = formatId ? hasTool(formatId, "online") : true;
  const onlineProducts = formatsWithTool("online", route, use);

  return (
    <section>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["7xl"], fontWeight: 500, margin: 0, lineHeight: 1.2 }}>
          {selling ? "Ready to sell it?" : bulk ? "Ready to order the run?" : "Ready to make your book?"}
        </h2>
        <p style={{ fontSize: TYPE.lg, color: T.textSubtle, marginTop: 10, maxWidth: 620, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
          {selling
            ? "Your project comes first — the link, the payout and the proof all follow from it. Make one here, or sell one you have already finished."
            : bulk
              ? "The book comes first, then the quote. Make one here or bring a finished PDF, and we'll price the run properly."
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
          unavailable={!online}
          title="Create online"
          body={
            online
              ? `Design your ${product ? product.short.toLowerCase() : "book"} in the browser with our online editor. Nothing to install.`
              : `The online editor can't make ${product ? `${product.label.toLowerCase()}` : "this"} yet. It makes ${list(onlineProducts)}.`
          }
          cta={
            online
              ? `Create your ${product ? product.short.toLowerCase() : "book"} online`
              : "See what you can make online"
          }
          note={
            online
              ? null
              : `For ${product ? product.label.toLowerCase() : "this"}, use BookWright or upload a print-ready PDF.`
          }
        />
        <Path
          icon="download"
          title="Download BookWright"
          body="Our desktop app, for longer books and more control over layout."
          cta="Download BookWright"
        />
      </div>

      {/* The other route out of this page — and the only place it asks who you are. */}
      {selling && (
        <div style={{ marginTop: 32 }}>
          <YourProjects signedIn={signedIn} onSignIn={onSignIn} />
        </div>
      )}

      {selling && (
        <div
          className="stack-md"
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

      {selling && <LinkLimits formatId={formatId} />}

      {/* The bulk route's whole destination. It does not compare channels,
          because there is only one — you — and the price is quoted rather
          than listed, so the honest end of this page is a conversation. */}
      {bulk && (
        <div
          className="stack-md"
          style={{
            marginTop: 20, background: C.blue50, border: `1px solid ${C.blue100}`,
            borderRadius: R.lg, padding: 24,
            display: "grid", gap: 16, gridTemplateColumns: "1fr auto", alignItems: "center",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["4xl"], fontWeight: 500, lineHeight: 1.2, color: C.blue950 }}>
              Get it priced properly
            </div>
            <p style={{ fontSize: TYPE.base, lineHeight: 1.65, color: T.textNeutral, margin: "8px 0 0", maxWidth: 680 }}>
              The figures above come off the self-serve ladder, which stops discounting at fifty copies.
              Large Order Services quotes past that and arranges delivery in bulk — so treat the estimate
              as a ceiling, not a price.
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
            Get a bulk quote
          </button>
        </div>
      )}

      {/* No channel comparison here either — it is the seller landing
          page's job. This page hands off to a tool or a project; choosing a
          route to market happens before that, on its own page. */}
    </section>
  );
}
