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
  /* "Buy in bulk" no longer reaches this component (Anain, 2026-09-01) —
     that route renders BulkQuotePanel in GetStarted.jsx instead of the
     calculator this sits under, because a bulk run is quoted by Large
     Order Services, not priced by this page. What's left here is the
     sell/keep fork this component was always really about. */
  return (
    <section>
      {/* The tools used to be three large cards here — Upload your PDF,
          Create online, Download BookWright — under "Ready to make your
          book?". That is now one block at the foot of the summary panel,
          the same one the calculators carry: one primary tool chosen by
          the catalogue, the rest behind "Other tools". Asking the same
          question twice on one page, in two different shapes, was the
          thing to fix. */}
      {/* ── No "Ready to sell it?" ──
          It was a heading, a paragraph and a project list sitting under the
          steps, and every one of those is a next step rather than a section
          (Ana, DES-482). The fork now lives where the other next steps are:
          under "Ready to make it?" at the foot of the summary panel, tools
          on one side of the rule and a finished book on the other. */}

      {/* No channel comparison here either — it is the seller landing
          page's job. This page hands off to a tool or a project; choosing a
          route to market happens before that, on its own page. */}
    </section>
  );
}
