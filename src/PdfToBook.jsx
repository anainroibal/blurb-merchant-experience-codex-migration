import React from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import { Divider } from "./Configurator.jsx";
import { CATALOG, fromPrice, money } from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   /pdf-to-book — PLACEHOLDER, NOT A REDESIGN

   Captured 21 Aug, 1462×2906. This page exists so the home page's
   Print prompt lands somewhere real, and so a reviewer following that
   route does not fall out of the prototype. It is a restatement of the
   live page: its headings, its sections, its order, its words.

   Nothing here is a proposal. If you are looking for what we think
   should change about /pdf-to-book, it is on the board — the page-walk
   card says it needs the second value and that "sell" appears only in
   its nav — and none of that is attempted here. The banner at the top
   says so on the page itself, because a screenshot of this in a deck
   would otherwise read as a recommendation.

   Two departures from a straight copy, both deliberate:

     · THE PRICES ARE COMPUTED. The live page carries three spans filled
       in the browser (trade $2.99, economy magazine $5.00, softcover
       square $17.00). This shows each family's cheapest buildable
       configuration through fromPrice, the same definition the home
       page uses, because a typed number in a prototype is a number
       that will drift.
     · LINKS THAT LEAVE THE PROTOTYPE SAY SO. "Prepare your files",
       "Download the Plug-In" and the tips list are marked rather than
       wired to nothing.

   Canva is worth noticing while we are here: it is a creation route on
   this page and appears in no tool matrix we hold. ProductList 2025
   answers products × tools, and Canva is not one of its tools.
   ──────────────────────────────────────────────────────────────── */

/* Blurb's headings, in Blurb's order. */
const H = {
  title: "PDF to Book",
  create: "Create a PDF",
  createSub: "Create a PDF Book from any application",
  formats: "Formats for any kind of PDF to book project",
  settings: "Review PDF Settings",
  checklist: "PDF to Book Checklist",
  acrobat: "Review your PDF with Adobe Acrobat Reader",
  prefs: "Preferences Settings",
  previewTips: "Preview Tips",
  ready: "Ready to upload your PDF?",
  upload: "Upload a PDF",
  readyUpload: "Ready to Upload?",
  tips: "Helpful tips for converting your PDF to a book",
};

const APPLICATIONS = [
  ["palette", "Using Canva?",
   "Canva files require print preparation to avoid corrupt or unprintable files.",
   "Prepare your files"],
  ["article", "Adobe InDesign Plug-In",
   "Already using Adobe InDesign? Download our plugin to easily create Blurb-ready books.",
   "Download the Plug-In"],
  ["description", "Everyday Applications",
   "If you use Word, Google Docs, Pages, or OpenOffice your PDF book is but a few clicks away.",
   "Get specifications"],
];

const FORMATS = [
  ["trade",    "Trade Books", "Affordable paperbacks and hardbacks are ideal for distribution.", 24],
  ["magazine", "Magazines",   "The magazine format offers a sleek solution to serial content.",  20],
  ["photo",    "Photo Books", "Stunning photo books for creative expressions of all kinds.",     20],
];

const CHECKLIST = [
  "Create the cover last after your final page count is known",
  "Use the correct dimensions for files",
  "Files must have an even number of pages",
  "Design your book with a single page on the right, followed by two-page spreads, and ending with a single page on the left",
  "Page counts for 5x8 and 6x9 books must be divisible by six",
  "Use only 100% black ink for text",
  "Do not use spot or registration color",
  "For advanced users, fine tune colors with our ICC profile",
  "Rasterize overly complex vectors (e.g. Illustrator or CAD art)",
  "For full-bleed printing, stretch images to the page's edge",
];

const PREFS = [
  ["1. Open the Preferences: Go to Page Display and ensure the following:", [
    "Use local fonts is not checked",
    "Use Overprint Preview is set to Always",
    "Show art, trim, & bleed boxes is selected",
  ]],
  ["2. Go to Units:", ["In Page Units, select Points", "Click OK to save your settings"]],
  ["3. In the menu, go to View → Page Display:", ["Select Two Page View and Show Cover Page in Two Page Spread"]],
];

const PREVIEW_TIPS = [
  "Your cover is a single page document",
  "Look for any missing or reflowed text",
  "No Registration or Trim marks",
  "The Trim and Bleed boxes should be visible so that you can see what will be trimmed off when the book is finished",
  "Check that elements are overprinting or knocking out as expected",
];

const READY_STEPS = [
  "Make sure your file dimensions are the correct dimensions",
  "Export your PDF and review the checklist under Review PDF Settings",
];

const TIPS = [
  "Self publish with Blurb's PDF uploader",
  "Export your word document to a PDF to print with Blurb",
  "How to purchase and download a PDF of your book",
  "How to upload an existing PDF to Blurb",
];

function H2({ children }) {
  return (
    <h2 style={{
      fontFamily: FONT_DISPLAY, fontWeight: 400, letterSpacing: "-0.01em",
      fontSize: "clamp(1.5rem, 3vw, 2rem)", lineHeight: 1.2, margin: "0 0 6px",
    }}>
      {children}
    </h2>
  );
}

function H3({ children }) {
  return <div style={{ fontSize: TYPE.lg, fontWeight: 700, lineHeight: 1.3 }}>{children}</div>;
}

function NotPrototyped({ children }) {
  return (
    <span style={{ fontSize: TYPE.sm, fontWeight: 600, color: T.textSubtle }}>
      {children} <span style={{ fontWeight: 400 }}>(not prototyped)</span>
    </span>
  );
}

function UploadButton({ onGo }) {
  return (
    <button
      onClick={() => onGo("getstarted")}
      style={{
        fontFamily: FONT_BODY, fontSize: TYPE.lg, fontWeight: 600, minHeight: 48, padding: "0 26px",
        borderRadius: R.md, border: 0, cursor: "pointer",
        background: T.bgBrand, color: T.textInverse,
      }}
    >
      Upload PDF
    </button>
  );
}

export default function PdfToBook({ onGo }) {
  return (
    <div style={{ fontFamily: FONT_BODY, color: T.textNeutral }}>

      {/* ── The banner. Non-dismissible, above everything, and it names
             what this page is before anyone reads a word of it. Same warm
             treatment as the work-in-progress chip, because it is the same
             kind of warning: do not take this for a proposal. ── */}
      <div style={{ background: "#fdf6ec", borderBottom: "1px solid #e6c9a0", color: "#7a4b12" }}>
        <div style={{
          maxWidth: 1180, margin: "0 auto", padding: "10px 24px",
          display: "flex", gap: 10, alignItems: "flex-start", fontSize: TYPE.sm, lineHeight: 1.55,
        }}>
          <span className="ms" style={{ fontSize: 18, flex: "0 0 auto" }}>info</span>
          <span>
            <strong>Placeholder page, not a redesign.</strong> This restates the live /pdf-to-book so the home
            page's Print prompt has somewhere to land. Its headings, sections and words are Blurb's. Nothing
            here is a proposal — what we think should change about this page is on the board.
          </span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section style={{ background: T.bgAccentSubtle, borderBottom: `1px solid ${C.blue100}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(36px, 5vw, 64px) 24px", textAlign: "center" }}>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 400, letterSpacing: "-0.01em",
            fontSize: "clamp(2.25rem, 5vw, 3.25rem)", lineHeight: 1.12, margin: 0,
          }}>
            {H.title}
          </h1>
          <div style={{ marginTop: 24 }}><UploadButton onGo={onGo} /></div>
        </div>
      </section>

      {/* ── Create a PDF ── */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(36px, 5vw, 56px) 24px 0" }}>
        <H2>{H.create}</H2>
        <p style={{ margin: "0 0 20px", fontSize: TYPE.lg, color: T.textSubtle }}>{H.createSub}</p>

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {APPLICATIONS.map(([icon, title, body, cta]) => (
            <div key={title} style={{
              border: `1px solid ${T.border}`, borderRadius: R.lg, padding: 20,
              display: "grid", gap: 8, alignContent: "start",
            }}>
              <span className="ms" style={{ fontSize: 26, color: T.bgBrand }}>{icon}</span>
              <H3>{title}</H3>
              <p style={{ margin: 0, fontSize: TYPE.sm, lineHeight: 1.6, color: T.textSubtle }}>{body}</p>
              <NotPrototyped>{cta}</NotPrototyped>
            </div>
          ))}
        </div>

        {/* The swatch-kit block the live page runs under the applications. */}
        <div style={{
          marginTop: 20, border: `1px solid ${T.border}`, borderRadius: R.lg, padding: 20,
          display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap",
        }}>
          <div style={{ minWidth: 0 }}>
            <H3>How will it look?</H3>
            <p style={{ margin: "4px 0 0", fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.6 }}>
              Order our Swatch Kit to find the perfect paper to display your design.
            </p>
          </div>
          <NotPrototyped>Learn More</NotPrototyped>
        </div>
      </section>

      {/* ── Formats ── */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(36px, 5vw, 56px) 24px 0" }}>
        <H2>{H.formats}</H2>
        <p style={{ margin: "0 0 20px", fontSize: TYPE.sm, color: T.textSubtle }}>
          From-prices computed from the price matrix rather than typed, per copy, at each format's minimum page
          count. The live page binds three specific configurations here.
        </p>
        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {FORMATS.map(([id, label, body, minPages]) => {
            const from = fromPrice(id);
            return (
              <button
                key={id}
                onClick={() => onGo("getstarted", { format: id })}
                style={{
                  textAlign: "left", font: "inherit", cursor: "pointer", padding: 20,
                  border: `1px solid ${T.border}`, borderRadius: R.lg, background: T.bgNeutral,
                  display: "grid", gap: 8, alignContent: "start", minWidth: 0,
                }}
              >
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["4xl"], fontWeight: 500, lineHeight: 1.2 }}>
                  {label}
                </div>
                <p style={{ margin: 0, fontSize: TYPE.sm, lineHeight: 1.6, color: T.textSubtle }}>{body}</p>
                <div style={{ fontSize: TYPE.sm, fontWeight: 700 }}>
                  {from == null ? "Price on request" : `From ${money(from)}`} for {minPages} pages
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Review PDF Settings ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(36px, 5vw, 56px) 24px 0" }}>
        <H2>{H.settings}</H2>

        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
          <H3>{H.checklist}</H3>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
            {CHECKLIST.map(item => (
              <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span className="ms" style={{ fontSize: 20, color: T.bgBrand, flex: "0 0 auto" }}>check_circle</span>
                <span style={{ fontSize: TYPE.base, lineHeight: 1.6 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ margin: "28px 0" }}><Divider /></div>

        <div style={{ display: "grid", gap: 12 }}>
          <H3>{H.acrobat}</H3>
          <p style={{ margin: 0, fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.65 }}>
            Adobe Acrobat Reader is the best way to check your exported PDF to book file. If you are ready to
            print a book from a PDF, this is the most accurate proof of how your book will look in print.
            Online, low-resolution previews (such as our book preview) are not as precise of a proof for
            inspecting your PDF prior to upload. Download it for free and make sure your Adobe Reader settings
            match the below.
          </p>

          <div style={{ marginTop: 4, display: "grid", gap: 14 }}>
            <H3>{H.prefs}</H3>
            {PREFS.map(([step, items]) => (
              <div key={step} style={{ display: "grid", gap: 6 }}>
                <div style={{ fontSize: TYPE.base, fontWeight: 600 }}>{step}</div>
                <ul style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 4 }}>
                  {items.map(i => (
                    <li key={i} style={{ fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.6 }}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
            <p style={{
              margin: 0, fontSize: TYPE.sm, lineHeight: 1.6, color: T.textNeutral,
              background: T.bgSubtle, border: `1px solid ${T.border}`, borderRadius: R.md, padding: "10px 12px",
            }}>
              <strong>Please note:</strong> Your book should start with a single page, followed by two-page
              spreads, and end with a single page.
            </p>
          </div>

          <div style={{ marginTop: 8, display: "grid", gap: 10 }}>
            <H3>{H.previewTips}</H3>
            <p style={{ margin: 0, fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.6 }}>
              Open your exported PDF book files to see how your book will print. Check for the following:
            </p>
            <ul style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 6 }}>
              {PREVIEW_TIPS.map(t => (
                <li key={t} style={{ fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.6 }}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Ready to upload ── */}
      <section style={{ marginTop: "clamp(36px, 5vw, 56px)", background: T.bgAccentSubtle, borderTop: `1px solid ${C.blue100}`, borderBottom: `1px solid ${C.blue100}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(32px, 4vw, 48px) 24px", textAlign: "center" }}>
          <H2>{H.ready}</H2>
          <div style={{ marginTop: 16 }}><UploadButton onGo={onGo} /></div>
        </div>
      </section>

      {/* ── Upload a PDF ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(36px, 5vw, 48px) 24px 0" }}>
        <H2>{H.upload}</H2>
        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <H3>{H.readyUpload}</H3>
          <ul style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 6 }}>
            {READY_STEPS.map(s => (
              <li key={s} style={{ fontSize: TYPE.base, color: T.textSubtle, lineHeight: 1.6 }}>{s}</li>
            ))}
          </ul>
          <div><UploadButton onGo={onGo} /></div>
        </div>
      </section>

      {/* ── Helpful tips ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(32px, 4vw, 48px) 24px 64px" }}>
        <H2>{H.tips}</H2>
        <ul style={{ margin: "14px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
          {TIPS.map(t => (
            <li key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span className="ms" style={{ fontSize: 18, color: T.bgBrand, flex: "0 0 auto" }}>article</span>
              <NotPrototyped>{t}</NotPrototyped>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
