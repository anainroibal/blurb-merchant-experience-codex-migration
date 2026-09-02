import React from "react";
import { Alert as CodexAlert } from "@blurb/codex-react";
import { InfoIcon, CheckCircleIcon, WarningIcon, ErrorIcon, CloseIcon, ArrowForwardIcon } from "@blurb/codex-react/icons";
import { C, T, TYPE, FONT_BODY } from "./tokens.js";

/* ────────────────────────────────────────────────────────────────
   Codex Foundation, Alert L (component set key f57f121f…6728).

   Migrated to Codex's own <Alert> (2026-09-02): the library's primitive
   is deliberately bare — type + size only, ground colour comes from its
   CSS module — everything else (icon, title, message, action, dismiss)
   is composed content, same as the library's own "Large" story composes
   a bold line + a paragraph inside children. So this wrapper keeps the
   exact layout it always had, just built on top of the real component
   instead of a hand-rolled one, and keeps the same external API so
   InstantStorePage doesn't need to change.

     Info     info
     Success  check_circle
     Warning  warning
     Error    error

   INFO IS NOT A WARNING. It is the neutral member of the set.
   ──────────────────────────────────────────────────────────────── */
const ICONS = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

export default function Alert({ type = "info", title, children, action, onAction, onDismiss }) {
  const Icon = ICONS[type] ?? ICONS.info;

  return (
    <CodexAlert type={type} size="large">
      <div style={{ display: "flex", alignItems: "flex-start", gap: 4, width: "100%", fontFamily: FONT_BODY }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flex: "1 1 auto", minWidth: 0 }}>
          <Icon size="2xl" style={{ color: C.gray950, flex: "0 0 auto" }} aria-hidden />

          <div style={{ minWidth: 0, display: "grid" }}>
            {title && (
              <div style={{ fontSize: TYPE.xl, fontWeight: 500, lineHeight: 1.2, color: C.gray950 }}>
                {title}
              </div>
            )}
            {children && (
              <div style={{ fontSize: TYPE.sm, lineHeight: 1.4, color: C.gray950, marginTop: title ? 4 : 0 }}>
                {children}
              </div>
            )}
            {action && (
              <div style={{ paddingTop: 8 }}>
                <button
                  onClick={onAction}
                  style={{
                    font: "inherit", fontSize: TYPE.sm, fontWeight: 700, color: T.textBrand,
                    background: "transparent", border: 0, padding: 0, cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: 4,
                  }}
                >
                  {action}
                  <ArrowForwardIcon size="lg" aria-hidden />
                </button>
              </div>
            )}
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss"
            style={{
              background: "transparent", border: 0, padding: 0, cursor: "pointer",
              flex: "0 0 auto", color: C.gray950, lineHeight: 0,
            }}
          >
            <CloseIcon size="lg" aria-hidden />
          </button>
        )}
      </div>
    </CodexAlert>
  );
}
