import React, { useState } from "react";
import { C, T, TYPE, R, FONT_BODY } from "./tokens.js";
import { CATALOG, hasTool } from "./catalog.js";
import { pdpName } from "./SummaryPanel.jsx";

/* ────────────────────────────────────────────────────────────────
   "Now make it" — one primary action and its alternatives.

   This was the product page's call-to-action row. The calculators needed
   the same thing: once someone has priced a book, the next step is to
   build it, and there are four ways in. So it moved here and both use it.

   ── Why one primary and a disclosure, rather than four buttons ──
   Four equal buttons is not a choice, it is a quiz. The primary is
   whichever tool can actually make THIS product, decided by TOOLS in the
   catalogue rather than per page: the online editor where it exists,
   BookWright where it does not — it cannot make a trade book or a
   magazine — and the PDF upload for anything left. Everything else sits
   behind "See other tools", which is where alternatives belong: findable,
   not competing.

   ── And why "Learn more about this product" is a link, not a button ──
   The label says "this product" rather than naming the product: the page
   already shows which one is selected, twice — in the summary panel and in
   the options above — so naming it a third time is words without
   information. "This product" also survives the product changing, which
   the named version did not.
   Someone who wants to read about the paper has not finished deciding;
   someone who wants to build has. Making both look equally like the next
   step would slow the person who is ready, and the reading is one click
   away either way.
   ──────────────────────────────────────────────────────────────── */

/* The creation tools, named as /getting-started's handoff names them so the
   two screens cannot describe the same tool differently. Which of them apply
   is decided by TOOLS in the catalog, not here — see hasTool.

   The online editor is called exactly that, here and in the handoff — it is
   the same tool as BookWright Online, and the product name earns nothing on
   a page where the alternative is called BookWright too.

   Every row is clickable, and where each one goes is the honest part. Two
   of them are prototyped here and start the build; the other two are pages
   on blurb.com, so they open there rather than pretending to be screens we
   have. `external` is what makes that visible before the click. */
const TOOL_PATHS = [
  /* No online-editor row. Create online IS the online editor, so listing it
     here would be the same door twice — and the second one, sitting under
     "other tools", reads as though it were something else. What the catalog
     still decides is whether that primary CTA is honest at all: hasTool
     (formatId, "online") is false for trade books and magazines, so a
     generalised version of this page has to relabel the button, not just
     filter this list. */
  { id: "bookwright", icon: "download", label: "BookWright for desktop",
    body: "Our free desktop app, for longer books and more control over layout.",
    external: "https://www.blurb.com/bookwright" },
  /* ── One Adobe row, pointing at the Adobe tools page ──
     There were two: a Lightroom row linking to /lightroom and an InDesign
     row linking to /indesign-plugin. Both pages exist — the sitemap sweep
     found Adobe living on three of them, /lightroom, /indesign-plugin and
     /photoshop-plugin — but the destination a maker wants is the hub that
     holds all of them, /bookmaking-tools/adobe-tools, which is also where
     the nav sends them.

     So one row, and the copy says Adobe rather than naming a single
     application. Which applications get named in the line underneath comes
     from TOOLS in the catalogue, because it differs by product: a photo
     book has Lightroom, wall art has InDesign and Photoshop. Naming all
     three everywhere would be quicker to write and wrong two ways. */
  { id: "adobe", icon: "photo_library", label: "Adobe tools",
    body: null,
    external: "https://www.blurb.com/bookmaking-tools/adobe-tools" },
  { id: "pdf", icon: "upload_file", label: "Upload a print-ready PDF",
    body: "Finished it elsewhere? Bring the PDF and it is ready to order.",
    action: "build" },
];

/* The Adobe applications this product can be laid out in, named from the
   catalogue. "Lay it out in Lightroom, where you already work." */
const ADOBE = [
  ["lightroom", "Lightroom"],
  ["indesign", "InDesign"],
  ["photoshop", "Photoshop"],
];

const adobeBody = formatId => {
  const names = ADOBE.filter(([id]) => hasTool(formatId, id)).map(([, name]) => name);
  if (!names.length) return null;
  const list = names.length === 1
    ? names[0]
    : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  return `Plug-ins for ${list} — lay the book out where you already work.`;
};

/* One row of the tools list. A button when it starts something here, a link
   when it leaves for blurb.com — same shape either way, so the list reads as
   one set of choices rather than two. */
function ToolRow({ tool, onBuild, body }) {
  const inner = (
    <>
      <span className="ms" style={{ fontSize: 22, color: T.bgBrand, flex: "0 0 auto" }}>{tool.icon}</span>
      <span style={{ minWidth: 0, display: "grid", gap: 2 }}>
        <span style={{ fontSize: TYPE.base, fontWeight: 600, color: T.textBrand, display: "inline-flex", alignItems: "center", gap: 5 }}>
          {tool.label}
          <span className="ms" style={{ fontSize: 16 }}>
            {tool.external ? "open_in_new" : "arrow_forward"}
          </span>
        </span>
        <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.55 }}>{body}</span>
      </span>
    </>
  );

  const style = {
    font: "inherit", textAlign: "left", textDecoration: "none", cursor: "pointer",
    background: T.bgNeutral, border: `1px solid ${T.border}`, borderRadius: R.md,
    padding: "12px 14px", display: "flex", gap: 12, alignItems: "flex-start", width: "100%",
  };

  return tool.external
    ? <a href={tool.external} target="_blank" rel="noreferrer" style={style}>{inner}</a>
    : <button onClick={onBuild} style={style}>{inner}</button>;
}


/* The tool that gets the button. Not a per-page choice — the catalogue is
   the only thing that knows the online editor cannot make a magazine. */
function primaryTool(formatId) {
  if (hasTool(formatId, "online")) {
    return { label: "Create online", hint: "Design it in your browser. Nothing to download." };
  }
  if (hasTool(formatId, "bookwright")) {
    return { label: "Download BookWright", hint: "Our free desktop app — the way this format is made." };
  }
  return { label: "Upload your PDF", hint: "Bring a print-ready file and order it." };
}

export default function CreateActions({ formatId, sel, onGo, onBuild, showLearnMore = true, heading, after }) {
  const [toolsOpen, setToolsOpen] = useState(false);
  const primary = primaryTool(formatId);
  const pdp = pdpName(formatId, sel);
  const build = onBuild ?? (() => onGo("getstarted", { seed: { formatId, sel } }));

  return (
    <div style={{ display: "grid", gap: 14, fontFamily: FONT_BODY, minWidth: 0 }}>
      {heading && (
        <div style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>
            {heading}
          </span>
          <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>{primary.hint}</span>
        </div>
      )}

      {/* Side by side while they fit, and only stacking when the column is
          too narrow for both — which is flex-wrap's job rather than a
          breakpoint's. Each button grows to share the row, keeps its label
          on one line, and the row breaks as a whole.

          Sizes come down from 18px to 16px and the padding with them: these
          live in a 310px sticky panel now, not across the width of a
          product page. */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={build}
          style={{
            font: "inherit", fontSize: TYPE.base, fontWeight: 600, minHeight: 44, padding: "0 18px",
            borderRadius: R.md, background: T.bgBrand, color: T.textInverse, border: 0, cursor: "pointer",
            flex: "1 1 auto", whiteSpace: "nowrap",
          }}
        >
          {primary.label}
        </button>
        <button
          onClick={() => setToolsOpen(o => !o)}
          aria-expanded={toolsOpen}
          style={{
            font: "inherit", fontSize: TYPE.base, fontWeight: 600, minHeight: 44, padding: "0 14px",
            borderRadius: R.md, background: "transparent", color: T.textBrand,
            border: `1px solid ${T.borderBrand}`, cursor: "pointer",
            flex: "1 1 auto", whiteSpace: "nowrap",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4,
          }}
        >
          Other tools
          <span className="ms turn" style={{ fontSize: 20, transform: toolsOpen ? "rotate(180deg)" : "none" }}>
            expand_more
          </span>
        </button>
      </div>

      {toolsOpen && (
        <div
          className="pop-in"
          style={{
            border: `1px solid ${T.border}`, borderRadius: R.lg,
            padding: 16, display: "grid", gap: 14, background: T.bgSubtle,
          }}
        >
          {TOOL_PATHS
            .filter(t => t.id === "adobe"
              ? ADOBE.some(([id]) => hasTool(formatId, id))
              : hasTool(formatId, t.id) && t.label !== primary.label)
            .map(t => (
              <ToolRow
                key={t.id}
                tool={t}
                onBuild={build}
                body={t.id === "adobe" ? adobeBody(formatId) : t.body}
              />
            ))}
          <div style={{ fontSize: TYPE.sm, color: T.textSubtle }}>
            Every one of these makes the book you have priced, and the price does not change with the tool
            you pick.
          </div>
          <a
            href="https://www.blurb.com/bookmaking-tools"
            target="_blank" rel="noreferrer"
            style={{
              fontSize: TYPE.sm, fontWeight: 600, color: T.textBrand, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 4, justifySelf: "start",
            }}
          >
            More on Creation Tools
            <span className="ms" style={{ fontSize: 16 }}>open_in_new</span>
          </a>
        </div>
      )}

      {/* The other way to arrive at a book you can sell: one you have already
          finished. A next step among next steps, so it sits inside this block
          rather than in a section of its own (Ana, DES-482). */}
      {after && (
        <>
          <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 4 }} />
          {after}
        </>
      )}

      {showLearnMore && pdp && (
        <button
          onClick={() => onGo("product", { seed: { formatId, sel } })}
          style={{
            font: "inherit", fontSize: TYPE.sm, fontWeight: 600, color: T.textBrand,
            background: "transparent", border: 0, padding: 0, cursor: "pointer",
            justifySelf: "start", display: "inline-flex", alignItems: "center", gap: 4,
          }}
        >
          Learn more about this product
          <span className="ms" style={{ fontSize: 18 }}>arrow_forward</span>
        </button>
      )}
    </div>
  );
}
