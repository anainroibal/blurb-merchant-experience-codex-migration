import React, { useState, useRef, useEffect } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";

/* ────────────────────────────────────────────────────────────────
   Site navigation — the proposal.

   There was a Today/Proposed toggle here. It is gone: the "today"
   nav was a reconstruction of the live header and did not match it
   closely enough to be read as one, so the comparison misled more
   than it explained. Anyone who wants today's nav has blurb.com open
   in the next tab, which is a truer reference than a rebuild.

   What remains is the proposal itself, with NEW and CHANGED marking
   what it adds. This is Anain's recommendation into Deb's nav work
   (meeting item 6) — the architecture case, made to be argued with.

   Signed out, it makes two moves:
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

export const NEW = "new";
export const CHANGED = "changed";

const NAV = [
  { label: "Products", href: "/formats", items: [
    [null, ["Shop All", "Photo Books", "Layflat Books", "Paperback and Hardcover Books", "Magazines", "Notebooks & Journals", "Wall Art"]],
  ]},
  { label: "Pricing", href: "/pricing", items: [
    [null, [
      ["Pricing Calculator", CHANGED, "What your book costs to make, and when it arrives"],
      "Shipping Calculator",
    ]],
  ]},
  { label: "Design Tools", href: "/bookmaking-tools", items: [
    [null, ["BookWright", "Adobe Tools", "PDF to Book", "BookWright Templates"]],
  ]},
  { label: "Sell & Self-Publish", href: "/self-publish", mark: CHANGED, items: [
    ["Start selling", [
      ["Sell with Blurb", NEW, "The seller hub — join free, then sell how you like"],
      ["Margin estimator", NEW, "What a copy costs you, what to charge, what you keep"],
    ]],
    ["Sell direct", [
      ["Checkout Links", NEW, "One link per book. Share it anywhere"],
      "API Printing",
    ]],
    ["Sell through retailers", ["Blurb Bookstore", "Amazon", "Ingram"]],
    ["Bulk and services", ["Large Order Services"]],
  ]},
  { label: "Bookstore", href: "/bookstore", items: [
    [null, ["All Categories", "Photography", "Portfolios", "Cookbooks", "Travel"]],
  ]},
  { label: "Resources", href: "/blog", items: [
    [null, ["Blog", "Help Center"]],
  ]},
];

/* ── The signed-in header ──
   Today it is: Settings · Help · Log Out · 🇺🇸 · [My Dashboard]. Three
   account chores hold permanent top-level space, nothing says which
   account you are in, the flag could mean language, country or currency,
   and there is no cart — so a signed-in buyer mid-order has no way back
   to it.

   Proposed: one account menu, opened from your own name, holding
   everything you rarely need and everything a seller does often. That
   frees the top level for the two things worth a permanent slot — the
   cart, and Start Project, which then means the same thing and sits in
   the same place whether you are logged in or not.

   Which five, judged against today's dashboard sidebar — eleven items in
   two groups, all set at the same weight:

     · BOOKWRIGHT ONLINE PROJECTS is a second projects list, split by the
       tool that made it. That is Blurb's internal division, not the
       seller's. One Projects, with a filter.
     · SALES OVERVIEW and MONTHLY PROFIT REPORTS are two doors to the same
       room, one of them named after a date range. Earnings, with the
       period as a control inside it.
     · ADDRESS BOOK, MY PROFILE, ACCOUNT SETTINGS and PAYMENT SETTINGS are
       four settings pages. Settings.
     · PUBLISHING RESOURCES is reading material, not a destination. Help.
     · CHECKOUT LINKS is missing entirely, which is the gap this project
       exists to close. Josh's dashboard file already has it as a section
       beside Projects and Earnings.
     · MY ORDERS earns its place: it is where a buyer goes, and it is also
       where a seller's proof copy lives, which is what unlocks selling.

   Naming: the live sidebar mixes MY PROJECTS with SALES OVERVIEW. Pick
   one. Second person throughout, as everywhere else in this prototype. */
const ACCOUNT_MENU = [
  [
    { label: "Dashboard" },
    { label: "Your projects" },
    { label: "Your checkout links", mark: NEW, hint: "Every link, and what each has earned" },
    { label: "Your earnings", mark: CHANGED, hint: "Sales overview and profit reports, in one place" },
    { label: "Your orders", hint: "Including the proof copy that unlocks selling" },
  ],
  [{ label: "Settings" }, { label: "Help" }],
  [{ label: "Log out", quiet: true }],
];

const norm = i => (Array.isArray(i) ? { label: i[0], mark: i[1], hint: i[2] } : { label: i });

/* The same navigation, flattened into footer columns. Exported so the
   footer cannot drift from the header — one list, two renderings. Group
   headings are dropped: a mega-menu has room to sub-group four ways, a
   footer column does not, and the order carries the same argument. */
export const NAV_COLUMNS = NAV.map(g => ({
  label: g.label,
  items: g.items.flatMap(([, items]) => items.map(norm)),
}));

export function Mark({ kind }) {
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
      className="pop-in pop-wide"
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

/* ── Region and language ──
   The live control is a bare flag opening these twelve destinations. The
   list is really locales wearing country labels — Canada appears twice,
   split by language, which is the tell.

   CONFIRMED 2026-08-18: currency follows the region. That makes this the
   control that decides what a seller's buyers are charged in — which no
   part of a bare flag says. So the trigger names the region and the
   CURRENCY, the two that carry money, and the menu names the language as
   well, which is what makes the two Canadas explain themselves.

   Currency codes below are the obvious ones for each store and are easy to
   correct; the rule they follow is confirmed. */
const LOCALES = [
  { flag: "🇺🇸", label: "United States",   lang: "English",    ccy: "USD" },
  { flag: "🇫🇷", label: "France",          lang: "Français",   ccy: "EUR" },
  { flag: "🇦🇺", label: "Australia",       lang: "English",    ccy: "AUD" },
  { flag: "🇩🇪", label: "Germany",         lang: "Deutsch",    ccy: "EUR" },
  { flag: "🇵🇹", label: "Portugal",        lang: "Português",  ccy: "EUR" },
  { flag: "🇪🇸", label: "Spain",           lang: "Español",    ccy: "EUR" },
  { flag: "🇳🇱", label: "Netherlands",     lang: "Nederlands", ccy: "EUR" },
  { flag: "🇨🇦", label: "Canada",          lang: "English",    ccy: "CAD" },
  { flag: "🇮🇹", label: "Italy",           lang: "Italiano",   ccy: "EUR" },
  { flag: "🇨🇦", label: "Canada",          lang: "Français",   ccy: "CAD" },
  { flag: "🇬🇧", label: "United Kingdom",  lang: "English",    ccy: "GBP" },
  { flag: "🌍", label: "Other Countries", lang: "English",    ccy: "USD" },
];

function LocaleMenu({ open, onToggle, value, onPick }) {
  const current = LOCALES[value];
  return (
    <span style={{ position: "relative" }}>
      <button
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 8px",
          background: "transparent", border: 0, borderRadius: R.md,
          fontFamily: FONT_BODY, fontSize: TYPE.sm, color: T.textNeutral, whiteSpace: "nowrap",
        }}
      >
        <span aria-hidden>{current.flag}</span>
        {/* On a phone the flag carries it; the menu still names all three. */}
        <span className="hide-sm">
          {current.label === "Other Countries" ? "Other" : current.label} · {current.ccy}
        </span>
        <span className="ms turn" style={{ fontSize: 18, color: T.textSubtle, transform: open ? "rotate(180deg)" : "none" }}>
          expand_more
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="pop-in pop-wide"
          style={{
            position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
            background: "#fff", border: `1px solid ${T.border}`, borderRadius: R.lg,
            boxShadow: "0 16px 36px rgba(0,0,0,0.12)", padding: 10, minWidth: 460,
          }}
        >
          <div style={{
            fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase",
            color: T.textSubtle, padding: "2px 10px 8px",
          }}>
            Region, language and currency
          </div>
          <div className="pop-cols" style={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}>
            {LOCALES.map((l, i) => (
              <a
                key={`${l.label}-${l.lang}`}
                href="#"
                role="menuitem"
                onClick={e => { e.preventDefault(); onPick(i); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                  borderRadius: R.sm, textDecoration: "none", fontSize: TYPE.base,
                  color: T.textNeutral, background: i === value ? C.blue50 : "transparent",
                  fontWeight: i === value ? 700 : 400,
                }}
                onMouseEnter={e => { if (i !== value) e.currentTarget.style.background = C.gray50; }}
                onMouseLeave={e => { if (i !== value) e.currentTarget.style.background = "transparent"; }}
              >
                <span aria-hidden style={{ fontSize: 17 }}>{l.flag}</span>
                <span style={{ minWidth: 0 }}>
                  {l.label}
                  <span style={{ color: T.textSubtle, fontWeight: 400 }}> · {l.lang} · {l.ccy}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </span>
  );
}

/* ── The nav below 900px ──
   Mega-menus do not survive a phone: they rely on hover, on width, and on
   a pointer that can leave without closing them. So the small screen gets
   the same content as one scrollable list, groups intact and headings
   kept — the grouping is the recommendation, and it is worth more here
   than on desktop, where a wide menu can afford to be flat.

   Account items join the same list when signed in, rather than hiding
   behind a second control that would compete with this one. */
function MobileNav({ open, signedIn, onClose, onSignedIn }) {
  if (!open) return null;
  return (
    <div
      className="nav-mobile pop-in"
      style={{
        borderTop: `1px solid ${T.border}`, background: "#fff",
        maxHeight: "calc(100vh - 66px)", overflowY: "auto",
        padding: "8px 16px 20px", fontFamily: FONT_BODY,
      }}
    >
      {NAV.map(group => (
        <div key={group.label} style={{ padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: TYPE.lg, fontWeight: 700, color: T.textNeutral, padding: "4px 0 6px" }}>
            {group.label}{group.mark && <Mark kind={group.mark} />}
          </div>
          {group.items.map(([heading, items], gi) => (
            <div key={gi} style={{ display: "grid", gap: 1, paddingBottom: heading ? 8 : 0 }}>
              {heading && (
                <div style={{
                  fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase",
                  color: T.textSubtle, padding: "8px 0 2px",
                }}>{heading}</div>
              )}
              {items.map(raw => {
                const it = norm(raw);
                return (
                  <a
                    key={it.label}
                    href="#"
                    onClick={e => { e.preventDefault(); onClose(); }}
                    style={{
                      padding: "9px 0", textDecoration: "none",
                      color: T.textSubtle, fontSize: TYPE.base,
                    }}
                  >
                    {it.label}<Mark kind={it.mark} />
                  </a>
                );
              })}
            </div>
          ))}
        </div>
      ))}

      <div style={{ padding: "14px 0", display: "grid", gap: 2 }}>
        {signedIn
          ? ACCOUNT_MENU.flat().map(it => (
              <a
                key={it.label}
                href="#"
                onClick={e => {
                  e.preventDefault();
                  if (it.label === "Log out") onSignedIn(false);
                  onClose();
                }}
                style={{
                  padding: "9px 0", textDecoration: "none", fontSize: TYPE.base,
                  color: it.quiet ? T.textSubtle : T.textNeutral,
                }}
              >
                {it.label}<Mark kind={it.mark} />
              </a>
            ))
          : (
            <>
              <a href="#" onClick={e => e.preventDefault()} style={{ padding: "9px 0", textDecoration: "none", color: T.textNeutral, fontSize: TYPE.base }}>Sign Up</a>
              <a href="#" onClick={e => { e.preventDefault(); onSignedIn(true); onClose(); }} style={{ padding: "9px 0", textDecoration: "none", color: T.textNeutral, fontSize: TYPE.base }}>Log In</a>
            </>
          )}
      </div>
    </div>
  );
}

/* Your own name, and everything filed behind it. */
function AccountMenu({ open, onToggle, onSignOut }) {
  return (
    <span style={{ position: "relative" }}>
      <button
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 8px",
          background: "transparent", border: 0, borderRadius: R.md,
          fontFamily: FONT_BODY, fontSize: TYPE.sm, color: T.textNeutral, whiteSpace: "nowrap",
        }}
      >
        <span style={{
          width: 26, height: 26, borderRadius: 999, background: C.blue600, color: "#fff",
          display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, flex: "0 0 auto",
        }}>AR</span>
        Anain
        <span className="ms turn" style={{ fontSize: 18, color: T.textSubtle, transform: open ? "rotate(180deg)" : "none" }}>
          expand_more
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="pop-in pop-wide"
          style={{
            position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
            background: "#fff", border: `1px solid ${T.border}`, borderRadius: R.lg,
            boxShadow: "0 16px 36px rgba(0,0,0,0.12)", padding: 8, minWidth: 260,
            display: "grid", gap: 6,
          }}
        >
          {ACCOUNT_MENU.map((section, si) => (
            <div key={si} style={{
              display: "grid", gap: 2,
              borderTop: si ? `1px solid ${T.border}` : 0, paddingTop: si ? 6 : 0,
            }}>
              {section.map(it => (
                <a
                  key={it.label}
                  href="#"
                  role="menuitem"
                  onClick={e => { e.preventDefault(); if (it.label === "Log out") onSignOut(); }}
                  style={{
                    display: "grid", gap: 1, padding: "8px 10px", borderRadius: R.sm,
                    textDecoration: "none", fontSize: TYPE.base,
                    color: it.quiet ? T.textSubtle : T.textNeutral,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.gray50)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span>{it.label}<Mark kind={it.mark} /></span>
                  {it.hint && <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>{it.hint}</span>}
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </span>
  );
}

export default function SiteNav({ signedIn, onSignedIn, onGo }) {
  const [open, setOpen] = useState(null);
  const [locale, setLocale] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(null); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} style={{ borderBottom: `1px solid ${T.border}`, background: "#fff", position: "relative", zIndex: 40 }}>
      <div style={{
        maxWidth: 1400, margin: "0 auto", padding: "0 16px", height: 66,
        display: "flex", alignItems: "center", gap: 16, fontFamily: FONT_BODY,
      }}>
        {/* The real brand mark, carried over from Blurb Checkout Prototypes —
            same asset, same proportions as the live header (52px square).
            A logo goes home; there is no home page in this prototype, so it
            goes to the first screen of the journey instead of nowhere. */}
        <a
          href="#"
          aria-label="Blurb home"
          onClick={e => { e.preventDefault(); onGo?.("getstarted"); }}
          style={{ display: "flex", alignItems: "center", flex: "0 0 auto" }}
        >
          <img src={BLURB_LOGO} alt="Blurb" style={{ height: 42, width: "auto", display: "block" }} />
        </a>

        <button
          className="nav-toggle"
          onClick={() => setMobileOpen(o => !o)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          style={{
            alignItems: "center", gap: 6, marginLeft: "auto",
            background: "transparent", border: 0, padding: "8px 6px", color: T.textNeutral,
          }}
        >
          <span className="ms" style={{ fontSize: 26 }}>{mobileOpen ? "close" : "menu"}</span>
        </button>

        <nav className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, minWidth: 0 }}>
          {NAV.map(group => (
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
                {group.mark && <Mark kind={group.mark} />}
              </button>
              {open === group.label && <MegaMenu group={group} />}
            </span>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 16, flex: "0 0 auto" }}>
          {/* On a phone these live in the menu instead, so the bar keeps
              room for the two things you cannot reach from there — your
              cart, and the action the page is for. */}
          <span className="hide-sm" style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
          {signedIn ? (
            <AccountMenu
              open={open === "__account"}
              onToggle={() => setOpen(open === "__account" ? null : "__account")}
              onSignOut={() => { setOpen(null); onSignedIn && onSignedIn(false); }}
            />
          ) : (
            <>
              <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: TYPE.sm, color: T.textNeutral, textDecoration: "none" }}>Sign Up</a>
              <a href="#" onClick={e => { e.preventDefault(); onSignedIn && onSignedIn(true); }} style={{ fontSize: TYPE.sm, color: T.textNeutral, textDecoration: "none" }}>Log In</a>
            </>
          )}
          </span>

          <LocaleMenu
            open={open === "__locale"}
            onToggle={() => setOpen(open === "__locale" ? null : "__locale")}
            value={locale}
            onPick={i => { setLocale(i); setOpen(null); }}
          />

          {/* Kept when signed in. Today it disappears, which strands anyone mid-order. */}
          <span className="ms" style={{ fontSize: 20, color: T.textNeutral }}>shopping_cart</span>
          {/* Start Project goes to /getting-started, not to registration.
              On the live site this button is the header's most prominent
              action and it opens /my/account/register — an account form
              before a price, which is the identity gate the audit argues
              against. The page it should open is the one that asks what you
              are making and prices it. */}
          <button
            onClick={() => onGo?.("getstarted")}
            style={{
              height: BUTTON_HEIGHT, padding: "0 18px", borderRadius: R.md, border: 0,
              background: C.blue600, color: "#fff", cursor: "pointer",
              fontFamily: FONT_BODY, fontSize: TYPE.sm, fontWeight: 700,
              letterSpacing: 0.6, textTransform: "uppercase", whiteSpace: "nowrap",
            }}
          >
            Start Project
          </button>
        </div>
      </div>

      <MobileNav
        open={mobileOpen}
        signedIn={signedIn}
        onClose={() => setMobileOpen(false)}
        onSignedIn={v => onSignedIn && onSignedIn(v)}
      />

      {/* prototype control — not part of the design */}
      {onSignedIn && (
        <div style={{
          borderTop: `1px dashed ${T.border}`, background: C.gray50,
          padding: "6px 24px", display: "flex", alignItems: "center", gap: 10,
          fontFamily: FONT_BODY, fontSize: TYPE.sm, color: T.textSubtle,
        }}>
          {/* The recommendation, said where it is being looked at. Each state
              proposes different things, so the line follows the state. */}
          <span style={{ minWidth: 0 }}>
            {signedIn ? (
              <>
                <strong style={{ color: T.textNeutral }}>Proposed header.</strong>{" "}
                Settings, Help and Log Out move into your account menu; the cart survives log-in; the bare
                flag names the region and the currency it sets; Start Project stays the primary action in
                both states.
              </>
            ) : (
              <>
                <strong style={{ color: T.textNeutral }}>Proposed nav.</strong>{" "}
                Sell &amp; Self-Publish groups by <em>how</em> you sell, and seller pricing stays off the
                Pricing menu. <strong style={{ color: T.textNeutral }}>New</strong> and{" "}
                <strong style={{ color: T.textNeutral }}>Changed</strong> mark what it adds — open those two
                menus to see them.
              </>
            )}
          </span>

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
        </div>
      )}
    </div>
  );
}
