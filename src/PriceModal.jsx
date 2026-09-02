import React, { useState } from "react";
import { Button } from "@blurb/codex-react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import Modal from "./Modal.jsx";

/* ────────────────────────────────────────────────────────────────
   "What changes the price?" — the live /formats modal, rebuilt.

   On blurb.com that link opens a five-step explainer (PriceModal.js):
   Cover options, Size, Paper, Number of pages, Binding. One step at a
   time, each with a description and a Tip, and Next moves along. The
   copy here is that page's own, cut where it repeated itself.

   ── The change: a sixth step for selling (Ana, DES-482 #6) ──
   "Another good place to add seller pricing would be on the modal that
   opens when you click what changes the price."

   She is right that it belongs here: this is the one place on a retail
   page where somebody has asked to be told how pricing works, so it is
   the cheapest possible door and nobody who did not ask is shown it.

   WHAT IT CANNOT DO IS QUOTE THE OTHER PRICE. The five steps above it
   are full of retail figures, and putting a fulfilment number beside
   them is precisely the pairing the whole project forbids: it publishes
   Blurb's margin with the arithmetic already done. So the step explains
   the CHANGE OF ROLE — you are the customer, then we are your printer —
   says what the seller gets, and hands over to the calculator, which is
   the only surface that prices a seller's copy.
   ──────────────────────────────────────────────────────────────── */

const STEPS = [
  {
    id: "cover",
    title: "Cover options",
    body: "Soft and flexible, or bold and bookstore-ready. Whether you opt for an easygoing softcover or a sleek hardcover with ImageWrap, your choice shapes how your book looks, how it feels, and what it costs.",
    tip: "Want to make it unforgettable? Go for a linen hardcover with a dust jacket, which suits heirloom keepsakes and your finest work.",
  },
  {
    id: "size",
    title: "Size",
    body: "Choose the size that suits your story and your budget, from a handy 7×7 you can carry everywhere to a striking 12×12 that makes a statement on a coffee table.",
    tip: "Keeping things budget-friendly? Standard paperback and hardcover sizes give you the most for your money, especially for word-heavy projects like novels and memoirs.",
  },
  {
    id: "paper",
    title: "Paper",
    body: "Your paper should match your content, whether that is vibrant photographs, fine illustrations or a lot of text. Each type changes how colours appear, how the pages feel, and how much your book costs.",
    tip: "Every format offers its own papers: premium and archival for photo books, affordable and versatile for hardcover and paperback, practical for notebooks.",
  },
  {
    id: "pages",
    title: "Number of pages",
    body: "Every extra page adds paper, ink and binding, so more pages mean more spend.",
    tip: "Papers do not cost the same per page, so cutting pages is not the only way to stay on budget. Consider how paper and page count work together.",
  },
  {
    id: "binding",
    title: "Binding",
    body: "How your book is bound changes how it looks, how it feels, how long it lasts, and yes, the price too.",
    tip: "Think about how your book will live in the world. Wire-O is good for flipping and jotting, perfect binding gives a polished look, and layflat lets a picture run across the gutter.",
  },
  {
    id: "selling",
    /* The seller's step. No figure on it, by design — see the note above. */
    title: "And if you are selling it",
    body: "Everything above is what a copy costs you to buy. Sell the book instead and your role changes: you are not our customer any more, we are your printer. You set what your buyer pays, you pay us to print each copy as it sells, and the rest of your price is yours.",
    tip: "That difference is payment for work you have taken on. A retail price also pays for running the shop — the marketing, the site, the readers it brings in. Sell it yourself and that part is your job, so the margin it would have paid for comes to you.",
    action: { label: "See what you would keep", stage: "margin" },
  },
];

export default function PriceModal({ open, onClose, onGo }) {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const last = i === STEPS.length - 1;

  /* Reopening starts at the beginning: the step you left off on is rarely
     the step you came back for. */
  React.useEffect(() => { if (open) setI(0); }, [open]);

  return (
    <Modal open={open} onClose={onClose} title="What changes the price?">
      <div style={{ display: "grid", gap: 20, fontFamily: FONT_BODY, maxWidth: 620 }}>
        {/* Where you are, as dots rather than "3 of 6": the steps are a
            tour, not a form, and any of them can be jumped to. */}
        <div style={{ display: "flex", gap: 6 }}>
          {STEPS.map((s, k) => (
            <button
              key={s.id}
              onClick={() => setI(k)}
              aria-label={s.title}
              aria-current={k === i}
              style={{
                flex: 1, height: 4, borderRadius: 2, border: 0, padding: 0, cursor: "pointer",
                background: k === i ? C.blue600 : k < i ? C.blue100 : T.border,
              }}
            />
          ))}
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <h3 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: TYPE["4xl"],
            lineHeight: 1.2, margin: 0,
          }}>
            {step.title}
          </h3>
          <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.65, color: T.textNeutral }}>
            {step.body}
          </p>

          <div style={{
            background: last ? C.blue50 : C.gray50,
            border: `1px solid ${last ? C.blue100 : T.border}`,
            borderRadius: R.md, padding: "12px 14px",
            display: "grid", gap: 4,
          }}>
            <span style={{
              fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
              color: last ? C.blue950 : T.textSubtle,
            }}>
              {last ? "Why" : "Tip"}
            </span>
            <span style={{ fontSize: TYPE.sm, lineHeight: 1.6, color: T.textNeutral }}>{step.tip}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          {i > 0 && (
            <Button variant="text" onClick={() => setI(i - 1)} style={{ padding: 0 }}>
              Back
            </Button>
          )}

          <span style={{ flex: 1 }} />

          {step.action ? (
            <Button onClick={() => { onClose(); onGo?.(step.action.stage); }}>
              {step.action.label}
            </Button>
          ) : (
            <Button variant="outlined" onClick={() => setI(i + 1)}>
              Next: {STEPS[i + 1].title}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
