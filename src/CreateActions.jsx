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
  { id: "lightroom", icon: "photo_library", label: "Adobe Lightroom plug-in",
    body: "Already editing in Lightroom? Send a gallery straight into a book layout.",
    external: "https://www.blurb.com/lightroom" },
  { id: "indesign", icon: "article", label: "Adobe InDesign plug-in",
    body: "Lay it out in InDesign and export a Blurb-ready file.",
    external: "https://www.blurb.com/indesign-plugin" },
  { id: "pdf", icon: "upload_file", label: "Upload a print-ready PDF",
    body: "Finished it elsewhere? Bring the PDF and it is ready to order.",
    action: "build" },
];

/* One row of the tools list. A button when it starts something here, a link
   when it leaves for blurb.com — same shape either way, so the list reads as
   one set of choices rather than two. */
function ToolRow({ tool, onBuild }) {
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
        <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.55 }}>{tool.body}</span>
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

export default function CreateActions({ formatId, sel, onGo, showLearnMore = true, heading }) {
  const [toolsOpen, setToolsOpen] = useState(false);
  const primary = primaryTool(formatId);
  const pdp = pdpName(formatId, sel);
  const build = () => onGo("getstarted", { seed: { formatId, sel } });

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

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          onClick={build}
          style={{
            font: "inherit", fontSize: TYPE.lg, fontWeight: 600, minHeight: 48, padding: "0 26px",
            borderRadius: R.md, background: T.bgBrand, color: T.textInverse, border: 0, cursor: "pointer",
          }}
        >
          {primary.label}
        </button>
        <button
          onClick={() => setToolsOpen(o => !o)}
          aria-expanded={toolsOpen}
          style={{
            font: "inherit", fontSize: TYPE.lg, fontWeight: 600, minHeight: 48, padding: "0 20px",
            borderRadius: R.md, background: "transparent", color: T.textBrand,
            border: `1px solid ${T.borderBrand}`, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}
        >
          See other tools
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
          {TOOL_PATHS.filter(t => hasTool(formatId, t.id) && t.label !== primary.label)
            .map(t => <ToolRow key={t.id} tool={t} onBuild={build} />)}
          <div style={{ fontSize: TYPE.sm, color: T.textSubtle }}>
            Every one of these makes the book you have priced, and the price does not change with the tool
            you pick.
          </div>
        </div>
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
          Learn more about {pdp}
          <span className="ms" style={{ fontSize: 18 }}>arrow_forward</span>
        </button>
      )}
    </div>
  );
}
