import React, { useState } from "react";
import { T, TYPE, FONT_DISPLAY, FONT_BODY } from "./tokens.js";

/* ────────────────────────────────────────────────────────────────
   The site's questions pattern, lifted off the Sell page so a third
   hand-built accordion did not appear here.

   Closed by default and one at a time: a page of open answers is the
   wall of copy this redesign is about, and a question nobody asked
   should cost a line rather than a paragraph.

   `items` are [question, answer] pairs. An answer may be a node, so a
   question whose answer depends on what has been chosen can say so.
   ──────────────────────────────────────────────────────────────── */
export default function Faq({ heading, items }) {
  const [openQ, setOpenQ] = useState(null);

  return (
    <section style={{ borderTop: `1px solid ${T.border}`, padding: "clamp(40px, 6vw, 72px) 16px" }}>
      <div style={{
        maxWidth: 1240, margin: "0 auto", display: "grid", gap: 40,
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", alignItems: "start",
        fontFamily: FONT_BODY,
      }}>
        <h2 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
          lineHeight: 1.25, margin: 0, maxWidth: 420,
        }}>
          {heading}
        </h2>

        <div style={{ display: "grid" }}>
          {items.map(([q, a]) => {
            const on = openQ === q;
            return (
              <div key={q} style={{ borderTop: `1px solid ${T.border}` }}>
                <button
                  onClick={() => setOpenQ(on ? null : q)}
                  aria-expanded={on}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 16, padding: "20px 0", background: "transparent", border: 0, cursor: "pointer",
                    font: "inherit", fontSize: TYPE.base, fontWeight: on ? 700 : 400, textAlign: "left",
                    color: T.textNeutral,
                  }}
                >
                  {q}
                  <span className="ms turn" style={{ fontSize: 22, transform: on ? "rotate(180deg)" : "none" }}>
                    expand_more
                  </span>
                </button>
                {on && (
                  <div className="pop-in" style={{
                    margin: "0 0 20px", fontSize: TYPE.base, lineHeight: 1.7, color: T.textSubtle, maxWidth: 620,
                  }}>
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
