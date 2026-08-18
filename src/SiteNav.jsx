import React, { useState, useRef, useEffect } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";

/* ────────────────────────────────────────────────────────────────
   Site navigation — today, and proposed.

   "Today" mirrors the live blurb.com header: six top-level items with
   mega-menus, then Sign Up / Log In / Cart and a Start Project button.
   Structure and labels are taken from the live markup, not invented.

   "Proposed" is the change checkout links require. Deb owns the nav
   proposal itself (meeting item 6); this is the architecture view of
   it, so treat it as a starting position rather than a decision.

   The proposal makes two moves:
     1. Sell & Self-Publish stops being a flat list of five channels
        and groups them by HOW you sell — direct, through retailers,
        or in bulk. Checkout Links joins the direct group.
     2. Seller pricing does NOT appear under Pricing. It sits behind
        the seller hub, which is what keeps the public pricing pages
        retail-only and the maker guardrail intact.
   ──────────────────────────────────────────────────────────────── */

/* Brand mark, copied from Blurb Checkout Prototypes so the two prototypes
   show the same logo. Served from public/assets. */
const BLURB_LOGO = "/assets/blurb-logo.png";

const NAV_TODAY = [
  { label: "Products", href: "/formats", items: [
    [null, ["Shop All", "Photo Books", "Layflat Books", "Paperback and Hardcover Books", "Magazines", "Notebooks & Journals", "Wall Art"]],
  ]},
  { label: "Pricing", href: "/pricing", items: [
    [null, ["Pricing Calculator", "Shipping Calculator"]],
  ]},
  { label: "Design Tools", href: "/bookmaking-tools", items: [
    [null, ["BookWright", "Adobe Tools", "PDF to Book", "BookWright Templates"]],
  ]},
  { label: "Sell & Self-Publish", href: "/self-publish", items: [
    [null, ["Blurb Bookstore", "Amazon", "Ingram", "Large Order Services", "API Printing"]],
  ]},
  { label: "Bookstore", href: "/bookstore", items: [
    [null, ["All Categories", "Photography", "Portfolios", "Cookbooks", "Travel"]],
  ]},
  { label: "Resources", href: "/blog", items: [
    [null, ["Blog", "Help Center"]],
  ]},
];

const NEW = "new";
const CHANGED = "changed";

const NAV_PROPOSED = [
  NAV_TODAY[0],
  { label: "Pricing", href: "/pricing", items: [
    [null, [
      ["Pricing Calculator", CHANGED, "Intent-first: what are you making, and what for"],
      "Shipping Calculator",
    ]],
  ]},
  NAV_TODAY[2],
  { label: "Sell & Self-Publish", href: "/self-publish", mark: CHANGED, items: [
    ["Start selling", [
      ["Sell with Blurb", NEW, "The seller hub — join free, then sell how you like"],
      ["Your cost and your margin", NEW, "What you pay, what you charge, what you keep"],
    ]],
    ["Sell direct", [
      ["Checkout Links", NEW, "One link per book. Share it anywhere"],
      "API Printing",
    ]],
    ["Sell through retailers", ["Blurb Bookstore", "Amazon", "Ingram"]],
    ["Bulk and services", ["Large Order Services"]],
  ]},
  NAV_TODAY[4],
  NAV_TODAY[5],
];

const norm = i => (Array.isArray(i) ? { label: i[0], mark: i[1], hint: i[2] } : { label: i });

function Mark({ kind }) {
  if (!kind) return null;
  const isNew = kind === NEW;
  return (
    <span style={{
      marginLeft: 8, padding: "1px 7px", borderRadius: 999, verticalAlign: "middle",
      fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
      background: isNew ? C.blue600 : C.blue50,
      color: isNew ? "#fff" : C.blue950,
      border: isNew ? "1px solid transparent" : `1px solid ${C.blue100}`,
    }}>
      {isNew ? "New" : "Changed"}
    </span>
  );
}

function MegaMenu({ group }) {
  const grouped = group.items.length > 1 || group.items[0][0];
  return (
    <div
      style={{
        position: "absolute", top: "100%", left: 0, zIndex: 50,
        background: "#fff", border: `1px solid ${T.border}`, borderTop: 0,
        borderRadius: `0 0 ${R.lg}px ${R.lg}px`, boxShadow: "0 16px 36px rgba(0,0,0,0.12)",
        padding: grouped ? 20 : 12, minWidth: grouped ? 560 : 260,
        display: "grid", gap: grouped ? 18 : 2,
        gridTemplateColumns: grouped ? "repeat(2, minmax(240px, 1fr))" : "1fr",
      }}
    >
      {group.items.map(([heading, items], gi) => (
        <div key={gi} style={{ display: "grid", gap: 2, alignContent: "start" }}>
          {heading && (
            <div style={{
              fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase",
              color: T.textSubtle, padding: "4px 10px 6px",
            }}>{heading}</div>
          )}
          {items.map(raw => {
            const it = norm(raw);
            return (
              <a
                key={it.label}
                href="#"
                onClick={e => e.preventDefault()}
                style={{
                  display: "grid", gap: 1, padding: "8px 10px", borderRadius: R.sm,
                  textDecoration: "none", color: T.textNeutral, fontSize: TYPE.base,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.gray50)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <span>{it.label}<Mark kind={it.mark} /></span>
                {it.hint && <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>{it.hint}</span>}
              </a>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function SiteNav({ variant = "today", onVariant, signedIn, onSignedIn }) {
  const nav = variant === "proposed" ? NAV_PROPOSED : NAV_TODAY;
  const [open, setOpen] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(null); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} style={{ borderBottom: `1px solid ${T.border}`, background: "#fff", position: "relative", zIndex: 40 }}>
      <div style={{
        maxWidth: 1400, margin: "0 auto", padding: "0 24px", height: 66,
        display: "flex", alignItems: "center", gap: 24, fontFamily: FONT_BODY,
      }}>
        {/* The real brand mark, carried over from Blurb Checkout Prototypes —
            same asset, same proportions as the live header (52px square). */}
        <a href="#" onClick={e => e.preventDefault()} style={{ display: "flex", alignItems: "center", flex: "0 0 auto" }}>
          <img src={BLURB_LOGO} alt="Blurb" style={{ height: 42, width: "auto", display: "block" }} />
        </a>

        <nav style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, minWidth: 0 }}>
          {nav.map(group => (
            <span key={group.label} style={{ position: "relative" }}>
              <button
                onClick={() => setOpen(open === group.label ? null : group.label)}
                onMouseEnter={() => open && setOpen(group.label)}
                aria-expanded={open === group.label}
                style={{
                  background: "transparent", border: 0, padding: "22px 10px",
                  fontFamily: FONT_BODY, fontSize: TYPE.sm, fontWeight: 500,
                  color: open === group.label ? C.blue600 : T.textNeutral,
                  borderBottom: open === group.label ? `2px solid ${C.blue600}` : "2px solid transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {group.label}
                {variant === "proposed" && group.mark && <Mark kind={group.mark} />}
              </button>
              {open === group.label && <MegaMenu group={group} />}
            </span>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 16, flex: "0 0 auto" }}>
          {signedIn ? (
            <a href="#" onClick={e => e.preventDefault()} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: TYPE.sm, color: T.textNeutral, textDecoration: "none" }}>
              <span style={{
                width: 26, height: 26, borderRadius: 999, background: C.blue600, color: "#fff",
                display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700,
              }}>AR</span>
              My Dashboard
            </a>
          ) : (
            <>
              <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: TYPE.sm, color: T.textNeutral, textDecoration: "none" }}>Sign Up</a>
              <a href="#" onClick={e => { e.preventDefault(); onSignedIn && onSignedIn(true); }} style={{ fontSize: TYPE.sm, color: T.textNeutral, textDecoration: "none" }}>Log In</a>
            </>
          )}
          <span className="ms" style={{ fontSize: 20, color: T.textNeutral }}>shopping_cart</span>
          <button style={{
            height: BUTTON_HEIGHT, padding: "0 18px", borderRadius: R.md, border: 0,
            background: C.blue600, color: "#fff",
            fontFamily: FONT_BODY, fontSize: TYPE.sm, fontWeight: 700,
            letterSpacing: 0.6, textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            Start Project
          </button>
        </div>
      </div>

      {/* prototype control — not part of the design */}
      {onVariant && (
        <div style={{
          borderTop: `1px dashed ${T.border}`, background: C.gray50,
          padding: "6px 24px", display: "flex", alignItems: "center", gap: 10,
          fontFamily: FONT_BODY, fontSize: TYPE.sm, color: T.textSubtle,
        }}>
          <span style={{ fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", fontSize: 11 }}>Nav</span>
          {["today", "proposed"].map(v => (
            <button
              key={v}
              onClick={() => onVariant(v)}
              style={{
                border: variant === v ? `1px solid ${C.blue600}` : `1px solid ${T.border}`,
                background: variant === v ? C.blue50 : "#fff",
                color: variant === v ? C.blue950 : T.textSubtle,
                borderRadius: 999, padding: "3px 12px", fontSize: TYPE.sm,
                fontWeight: variant === v ? 700 : 500, fontFamily: FONT_BODY,
              }}
            >
              {v === "today" ? "Today" : "Proposed"}
            </button>
          ))}
          <span style={{ marginLeft: 4 }}>
            {variant === "proposed"
              ? "Open Pricing and Sell & Self-Publish to see what changes."
              : "The live blurb.com structure, for comparison."}
          </span>
          {onSignedIn && (
            <>
              <span style={{ marginLeft: "auto", fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", fontSize: 11 }}>Session</span>
              {[["Signed out", false], ["Signed in", true]].map(([label, v]) => (
                <button
                  key={label}
                  onClick={() => onSignedIn(v)}
                  style={{
                    border: signedIn === v ? `1px solid ${C.blue600}` : `1px solid ${T.border}`,
                    background: signedIn === v ? C.blue50 : "#fff",
                    color: signedIn === v ? C.blue950 : T.textSubtle,
                    borderRadius: 999, padding: "3px 12px", fontSize: TYPE.sm,
                    fontWeight: signedIn === v ? 700 : 500, fontFamily: FONT_BODY,
                  }}
                >
                  {label}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
