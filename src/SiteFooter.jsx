import React from "react";
import { FONT_BODY } from "./tokens.js";

/* ────────────────────────────────────────────────────────────────
   Site footer — one bar, five links.

   Follows the Single-page Checkout file (node 13277:21743) rather than
   inventing a sitemap footer. Values are that frame's own variables:

     bg-blurb-bg-surface-bold   #292929
     text-blurb-text-inverse    #ffffff
     text-icon-inverse          #f5f5f5
     Body XS                    Proxima Nova 400, 12px, 1.4
     <utility>-6 / -20          24px gap, 80px inset
     height                     50px

   Worth knowing what this trades away: the earlier sitemap footer put a
   link to the seller pages — Sell with Blurb, Your cost and your margin,
   Checkout Link file — on every page of the site, which is the cheapest SEO
   there is. A five-link bar cannot carry that, so if those pages are to
   be found, the header nav and the marketing pages have to do all of it.
   ──────────────────────────────────────────────────────────────── */

const LINKS = ["Privacy policy", "Return policy", "Terms of service", "Cookie policy", "Support"];

const INK = "#ffffff";
const ICON = "#f5f5f5";
const GROUND = "#292929";

export default function SiteFooter() {
  const link = {
    color: INK, textDecoration: "none", fontSize: 12, lineHeight: 1.4, whiteSpace: "nowrap",
  };

  return (
    <footer style={{ background: GROUND, color: INK, fontFamily: FONT_BODY }}>
      <div
        style={{
          minHeight: 50, padding: "12px clamp(16px, 5vw, 80px)",
          display: "flex", alignItems: "center", gap: "10px 24px", flexWrap: "wrap",
          fontSize: 12, lineHeight: 1.4,
        }}
      >
        {/* Blurb, not RPI (Anain, 2026-08-28). These are blurb.com pages, and
            the mark in the footer names whoever the visitor is dealing with. */}
        <span style={{ whiteSpace: "nowrap" }}>© 2026 Blurb, Inc. All rights reserved.</span>

        <span style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", marginLeft: 24 }}>
          {LINKS.map(l => (
            <a key={l} href="#" onClick={e => e.preventDefault()} style={link}>{l}</a>
          ))}
        </span>

        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          marginLeft: "auto", whiteSpace: "nowrap",
        }}>
          <span className="ms" style={{ fontSize: 16, color: ICON }}>lock</span>
          Secure payment
        </span>
      </div>
    </footer>
  );
}
