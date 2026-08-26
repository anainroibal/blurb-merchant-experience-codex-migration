import React from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";
import {
  CATALOG, FORMAT_IDS, SELLING_CHANNEL,
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

/* ── What an Instant Store can sell ──
   An answer to a question in the FAQ at the foot of the page rather than a
   panel beside the steps (Ana, DES-482): at the point of choosing a size,
   the rules of a channel are more detail than the step needs. It stays ON
   this page, though, and before any link is set up. A silent omission is
   the worst version of this: the seller either does not notice, or notices
   and cannot tell whether it is a rule or a bug.

   Only the PDF exclusion is decided (2026-08-18). Notebooks and wall art
   are absent because nothing says they CAN be sold this way, a different
   thing from a decision, and named as such.

   What each OTHER channel takes is known, from /self-publish (2026-08-19),
   so this can point somewhere instead of stopping at a no: a notebook
   cannot take a link, but the Bookstore sells notebooks. */
export function SellableAnswer({ formatId }) {
  const excluded = FORMAT_IDS
    .filter(id => id !== "pdf" && !(CATALOG[id].sellChannels || []).includes(SELLING_CHANNEL))
    .map(id => CATALOG[id].label);

  /* Where the thing you chose CAN be sold, if not here. */
  const elsewhere = formatId
    ? (CATALOG[formatId].sellChannels || []).filter(c => c !== SELLING_CHANNEL)
    : [];
  const NAMES = { bookstore: "the Blurb Bookstore", amazon: "Amazon", ingram: "Ingram" };

  return (
    <p style={{ margin: 0 }}>
      Printed books and magazines. <strong style={{ color: T.textNeutral }}>A PDF cannot be sold through an
      Instant Store.</strong> It is ordered, not sold. {excluded.length > 0 && (
        <>Nor can {list(excluded)}, which is unconfirmed rather than decided, so ask before promising it to
        anyone.{" "}</>
      )}
      {elsewhere.length > 0 && formatId && (
        <>Beyond an Instant Store, {CATALOG[formatId].label.toLowerCase()} sell through{" "}
        {list(elsewhere.map(c => NAMES[c] ?? c))}.</>
      )}
    </p>
  );
}

/* "Photo Books, Notebooks & Journals and PDFs" */
const list = items =>
  items.length <= 1 ? (items[0] ?? "")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

export default function Handoff({ route }) {
  const bulk = route === "distribute";

  return (
    <section>
      {/* The tools used to be three large cards here — Upload your PDF,
          Create online, Download BookWright — under "Ready to make your
          book?". That is now one block at the foot of the summary panel,
          the same one the calculators carry: one primary tool chosen by
          the catalogue, the rest behind "Other tools". Asking the same
          question twice on one page, in two different shapes, was the
          thing to fix.

          The selling fork went the same way, into that block. What is left
          under the steps is the bulk route alone, where the honest end of
          the page is not a next step but a conversation. */}
      {/* ── No "Ready to sell it?" ──
          It was a heading, a paragraph and a project list sitting under the
          steps, and every one of those is a next step rather than a section
          (Ana, DES-482). The fork now lives where the other next steps are:
          under "Ready to make it?" at the foot of the summary panel, tools
          on one side of the rule and a finished book on the other. The bulk
          route keeps a heading here, because what follows it is not a next
          step but a different way of being priced. */}
      {bulk && (
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["7xl"], fontWeight: 500, margin: 0, lineHeight: 1.2 }}>
            Ready to order the run?
          </h2>
          <p style={{ fontSize: TYPE.lg, color: T.textSubtle, marginTop: 10, maxWidth: 620, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            The book comes first, then the quote. Make one with the tools in the panel or bring a finished
            PDF, and we'll price the run properly.
          </p>
        </div>
      )}

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
              background: "transparent", color: T.textBrand, border: `1px solid ${T.borderBrand}`,
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
