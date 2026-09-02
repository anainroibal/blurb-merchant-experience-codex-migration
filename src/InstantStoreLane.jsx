import React from "react";
import { Button } from "@blurb/codex-react";
import { ArrowForwardIcon } from "@blurb/codex-react/icons";
import { C, T, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";

/* ────────────────────────────────────────────────────────────────
   The Instant Store lane — Codex's split panel, measured off the
   "BookWright Online by Blurb" block on blurb.com/photo-books.

   Two equal halves that stack when narrow, 8px on the OUTER corners
   only so they read as one object, the copy on light-foam-50 (#f9f6f3)
   at 40px padding with 24px between its parts, futura-pt 32/1.1 over
   proxima-nova 18/1.4 in #282828.

   ── The artwork, cut out ──
   Blurb's hp-selling.webp bakes its own pale card in behind the book,
   and the book overhangs that card, so no crop of it fills a panel:
   object-cover leaves transparent bands, and the baked card ends short
   of the copy beside it with a visible seam. The asset here is that
   artwork with the card keyed out — flood-filled from the edges,
   stopping at anything not pale and near-neutral, so the book, its
   shadow, the storefront mark and the dotted leaders all survive. It
   sits on the panel's own gradient, which is the card's own colours
   sampled from the original.

   The words differ by where it sits, so they are passed in. On a page
   of products it asks the question ("Making it to sell?"); after a
   calculator the reader has already answered it, so it says what
   happens next. Same panel either way, which is the point: a seller who
   meets this twice should recognise it rather than wonder whether they
   are two different products.

   NO FIGURES ON IT, anywhere it appears. What a seller keeps depends on
   the book, and that arithmetic lives behind the door.
   ──────────────────────────────────────────────────────────────── */
export default function InstantStoreLane({ title, children, cta = "Learn more about Instant Stores", onGo, isNew }) {
  return (
    <section style={{
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
      alignItems: "stretch", borderRadius: R.lg, overflow: "hidden",
    }}>
      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, #f3f5f9 0%, #e3e9f0 100%)",
        display: "grid", placeItems: "center", minHeight: 280, padding: 24,
      }}>
        <img
          src="/assets/instant-store-lane.png"
          alt="A photo book beside a storefront mark, the sign of an Instant Store."
          loading="lazy"
          style={{ width: "100%", height: "auto", maxHeight: "100%", objectFit: "contain", display: "block" }}
        />
        {isNew && (
          <span style={{
            position: "absolute", top: 16, left: 16, padding: "3px 10px", borderRadius: 999,
            background: C.blue600, color: "#fff", fontFamily: FONT_BODY,
            fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
          }}>
            New
          </span>
        )}
      </div>

      <div style={{
        background: "#f9f6f3", padding: 40, fontFamily: FONT_BODY,
        display: "flex", flexDirection: "column", alignItems: "flex-start",
        justifyContent: "center", gap: 24,
      }}>
        <h2 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: "2rem", lineHeight: 1.1,
          margin: 0, color: C.gray950,
        }}>
          {title}
        </h2>

        <p style={{ margin: 0, fontSize: "1.125rem", lineHeight: 1.4, color: "#282828" }}>
          {children}
        </p>

        {/* A link, not a filled button: every page this appears on has its
            own action, and this one leads to reading rather than doing. */}
        <Button variant="text" iconRight={<ArrowForwardIcon />} onClick={onGo} style={{ padding: 0 }}>
          {cta}
        </Button>
      </div>
    </section>
  );
}
