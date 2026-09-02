import React from "react";
import { Footer } from "@blurb/codex-react";
import { LockIcon } from "@blurb/codex-react/icons";

/* ────────────────────────────────────────────────────────────────
   Site footer — Codex's own Footer pattern (2026-09-02, superseding
   the 2026-08-18 pin to the Single-page Checkout file's node
   13277:21743).

   The colours and type matched that node exactly — bg-surface-bold
   IS #292929, text-inverse IS #ffffff, its xs size IS 12px/1.4 — but
   Codex's own shipped height is 72px on desktop (--codex-spacing-18),
   not that node's 50px. Superseded rather than kept alongside: this
   migration's whole point is Codex's real components as the source of
   truth, and a hand-matched one-off pin is exactly what it replaces.

   "Secure payment" isn't a link — it's a static mark, and Footer's
   icon row only takes navigable icon links (each one an <a>, no plain
   option). So it isn't a socialLink here; it's our own span, laid
   over the bar rather than through the component, vertically centred
   against the whole footer rather than one of its two internal rows
   (Footer stacks them on mobile) — right at desktop's fixed 72px
   height, close enough everywhere narrower. */

const LINKS = ["Privacy policy", "Return policy", "Terms of service", "Cookie policy", "Support"]
  .map(label => ({ label, url: "#" }));

export default function SiteFooter() {
  return (
    <div style={{ position: "relative" }}>
      <Footer
        copyright="2026 Blurb, Inc. All rights reserved."
        links={LINKS}
        socialLinks={[]}
      />
      <span style={{
        position: "absolute", top: "50%", right: "clamp(16px, 5vw, 80px)", transform: "translateY(-50%)",
        display: "inline-flex", alignItems: "center", gap: 4,
        color: "#fff", fontSize: 12, lineHeight: 1.4, whiteSpace: "nowrap",
      }}>
        <LockIcon size="base" aria-hidden />
        Secure payment
      </span>
    </div>
  );
}
