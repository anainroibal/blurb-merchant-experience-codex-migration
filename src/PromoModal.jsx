import React from "react";
import { Modal, ModalContent, ModalClose } from "@blurb/codex-react";
import { CloseIcon } from "@blurb/codex-react/icons";
import { PROMO } from "./promo.js";
import { TYPE, FONT_BODY, FONT_DISPLAY } from "./tokens.js";

/* The live "Details" modal: centred futura headline, the code and end date
   on two lines, and the terms in small print underneath. */
export default function PromoModal({ open, onOpenChange }) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent title={PROMO.modalTitle} size="large">
        <ModalClose
          aria-label="Close"
          style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: 0, padding: 0, cursor: "pointer", color: "#292929", lineHeight: 0 }}
        >
          <CloseIcon size="lg" aria-hidden />
        </ModalClose>
        {/* The Codex modal title is a small left-aligned heading; the live promo
            modal sets it large, bold and centred. Scoped to this modal by :has. */}
        <style>{`[data-codex-component="modal"]:has([data-promo-modal]) > h2 {
          font-family: ${FONT_DISPLAY}; font-size: clamp(1.75rem, 5vw, 2.5rem); font-weight: 600;
          line-height: 1.2; text-align: center; margin: 40px 24px 24px; }
        [data-codex-component="modal"]:has([data-promo-modal]) { width: min(750px, calc(100vw - 32px)); max-width: none; }`}</style>
        <div data-promo-modal style={{ display: "grid", gap: 24, fontFamily: FONT_BODY, textAlign: "center" }}>
          <div style={{ color: "#656565", fontSize: TYPE.lg, lineHeight: 1.5 }}>
            <div>Code: {PROMO.code}</div>
            <div>{PROMO.ends}</div>
          </div>
          <p style={{ margin: 0, textAlign: "left", fontSize: TYPE.sm, lineHeight: 1.5, color: "#656565" }}>{PROMO.terms}</p>
        </div>
      </ModalContent>
    </Modal>
  );
}
