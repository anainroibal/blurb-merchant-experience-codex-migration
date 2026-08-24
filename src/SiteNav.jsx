import React, { useState, useRef, useEffect } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";

/* ────────────────────────────────────────────────────────────────
   Site navigation — the proposal, now on Deb's option D.

   There was a Today/Proposed toggle here. It is gone: the "today"
   nav was a reconstruction of the live header and did not match it
   closely enough to be read as one, so the comparison misled more
   than it explained. Anyone who wants today's nav has blurb.com open
   in the next tab, which is a truer reference than a rebuild.

   ── Why D, of Deb's four LOS drafts (26-08 LOS Volume Nav Drafts) ──
   A moved Large Order Services from a buried link to a promoted panel;
   B and C made it a persistent header item. All three leave it filed
   under selling, and it is not a way to sell — it is a SERVICE. You buy
   the stock and distribute it yourself; Blurb is not in the sale.

   D is the only draft that gives it an honest home, and the same for
   API printing. That resolves the 8/21 pod's "API printing is not
   included in the selling tool" WITHOUT reversing the 2026-08-18
   decision: that decision was about the ways-to-sell comparison, where
   API printing genuinely is a route to market. Where it lives in NAV is
   a different question, and the answer is Services.

   D also agrees with the live site. /print-api-software already offers
   Large Order Services, the Self-Service API and the Custom API as one
   three-way chooser — "Pathways to print". Every other draft contradicts
   that page; this one matches it.

   And "Make → what are you making?" is the vocabulary the rest of this
   project already runs on: PROJECT_KINDS, the live /getting-started
   dropdown, and the twelve vertical landing pages all speak in project
   kinds rather than product types.

   Two departures from the sketch, both deliberate:
     · NO "Shop with AI". Out of scope, and it would dominate both the
       conversation and the estimate.
     · Search is drawn but inert. It is a product — an index, a results
       page, ranking — not a nav control, and pretending otherwise in a
       prototype invites the wrong conversation. The placeholder is here
       because D's utility row is shaped around it.

   Signed out, the proposal makes three moves:
     1. Five top-level groups by JOB, not by department: Make, Sell,
        Services, Pricing, Resources. Bookstore sits apart, because
        shopping is not one of those jobs.
     2. Services exists at all — LOS ("Volume orders", Deb's rename, and
        the clearer word) and API printing stop being smuggled into a
        selling menu.
     3. Seller pricing does NOT appear under Pricing. It sits behind the
        seller hub, which is what keeps the public pricing pages
        retail-only and the maker guardrail intact.
   ──────────────────────────────────────────────────────────────── */

/* Brand mark, copied from Blurb Checkout Prototypes so the two prototypes
   show the same logo. Served from public/assets. */
const BLURB_LOGO = "/assets/blurb-logo.png";

export const NEW = "new";
export const CHANGED = "changed";

const NAV = [
  /* MAKE — everything about producing the object. Products answer "what
     can I print", the kinds answer "what am I making", and the tools are
     how. Three columns because they are three different questions, and a
     maker arrives holding one of them. */
  { label: "Make", href: "/formats", mark: CHANGED, items: [
    ["Products", ["Shop All", "Photo Books", "Layflat Books", "Paperback and Hardcover Books", "Magazines", "Notebooks & Journals", "Wall Art"]],
    ["What are you making?", [
      ["Photo books", null, "Travel, family, weddings"],
      ["Cookbooks", null, "Recipes, long text beside colour"],
      ["Children's books", null, "Colour on every page"],
      ["Novels and poetry", null, "Text-first, priced to sell"],
      ["Portfolios", null, "Your work, at gallery quality"],
      ["Yearbooks", null, "A run of the same book"],
    ]],
    ["Tools", [
      ["Online editor", CHANGED, "Design in your browser. Nothing to download"],
      "BookWright for desktop",
      "Adobe plug-ins",
      "PDF to Book",
      "Templates",
    ]],
  ]},

  /* SELL — routes to market only. API printing and Large Order Services
     have moved to Services; what is left is the set of ways a copy
     reaches a buyer, grouped by who finds that buyer. */
  { label: "Sell", href: "/self-publish", mark: CHANGED, items: [
    ["Start selling", [
      ["Sell with Blurb", NEW, "The seller hub — join free, then sell how you like"],
      ["Margin estimator", NEW, "What a copy costs you, what to charge, what you keep"],
    ]],
    ["Sell direct", [
      ["Checkout Links", NEW, "One link per book. Share it anywhere"],
      ["Store integrations", NEW, "⚠️ In Deb's draft A. No source yet — needs an owner before it ships"],
    ]],
    ["Sell through retailers", ["Blurb Bookstore", "Amazon", "Ingram"]],
  ]},

  /* SERVICES — the new group, and the point of option D. Neither of these
     is a way to sell: one prints a run you distribute yourself, the other
     prints behind someone else's storefront. /print-api-software already
     groups them exactly this way. */
  { label: "Services", href: "/large-order-services", mark: NEW, items: [
    ["Print in volume", [
      ["Volume orders", CHANGED, "Was Large Order Services. Discounts start at 100+ copies"],
      ["Get a bulk quote", null, "Our team prices the run and handles the logistics"],
    ]],
    ["Print as infrastructure", [
      ["Self-Service API", null, "No minimums, no setup fees. US shipping, photo books"],
      ["Custom API", null, "Global, more products, tailored SLAs"],
    ]],
    ["Help from a person", [
      ["Hire an expert", null, "Design and layout help, if you would rather not"],
    ]],
  ]},

  { label: "Pricing", href: "/pricing", mark: CHANGED, items: [
    [null, [
      ["Pricing calculator", CHANGED, "What your book costs to make, and when it arrives"],
      "Shipping calculator",
      ["Volume discounts", null, "Retail only — they never apply to fulfilment pricing"],
    ]],
  ]},

  { label: "Resources", href: "/blog", items: [
    [null, ["Blog", "Help Center", "Book dimensions", "Swatch kit"]],
  ]},
];

/* Shopping is not one of the five jobs, so the Bookstore sits apart from
   them — its own item on the right of the nav row, as in the sketch. */
const BOOKSTORE = { label: "Blurb Bookstore", href: "/bookstore", icon: "storefront", items: [
  [null, ["All Categories", "Photography", "Portfolios", "Cookbooks", "Travel", "Children's Books"]],
]};

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
export const NAV_COLUMNS = [...NAV, BOOKSTORE].map(g => ({
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
        gridTemplateColumns: grouped
          ? `repeat(${Math.min(group.items.length, 3)}, minmax(230px, 1fr))`
          : "1fr",
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
      {[...NAV, BOOKSTORE].map(group => (
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

  /* One place to decide whether a mega menu is open, so the two rows can
     both close each other's popovers. */
  const toggle = key => setOpen(open === key ? null : key);

  const NavItem = ({ group }) => (
    <span key={group.label} style={{ position: "relative" }}>
      <button
        onClick={() => toggle(group.label)}
        onMouseEnter={() => open && setOpen(group.label)}
        aria-expanded={open === group.label}
        style={{
          background: "transparent", border: 0, padding: "14px 10px",
          fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 500,
          color: open === group.label ? C.blue600 : T.textNeutral,
          borderBottom: open === group.label ? `2px solid ${C.blue600}` : "2px solid transparent",
          whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer",
        }}
      >
        {group.icon && <span className="ms" style={{ fontSize: 20 }}>{group.icon}</span>}
        {group.label}
        {group.mark && <Mark kind={group.mark} />}
        <span className="ms turn" style={{ fontSize: 18, transform: open === group.label ? "rotate(180deg)" : "none" }}>
          expand_more
        </span>
      </button>
      {open === group.label && <MegaMenu group={group} />}
    </span>
  );

  return (
    <div ref={ref} style={{ borderBottom: `1px solid ${T.border}`, background: "#fff", position: "relative", zIndex: 40 }}>

      {/* ── Utility row ──
          Draft D moves the logo, search, account, locale and cart up here,
          which leaves the row below for the five jobs and nothing else.
          "Shop with AI" is deliberately absent — see the file header. */}
      <div style={{
        maxWidth: 1400, margin: "0 auto", padding: "0 16px", minHeight: 56,
        display: "flex", alignItems: "center", gap: 16, fontFamily: FONT_BODY,
      }}>
        <a
          href="#"
          aria-label="Blurb home"
          onClick={e => { e.preventDefault(); onGo?.("getstarted"); }}
          style={{ display: "flex", alignItems: "center", flex: "0 0 auto" }}
        >
          <img src={BLURB_LOGO} alt="Blurb" style={{ height: 36, width: "auto", display: "block" }} />
        </a>

        {/* Search is drawn, not built. A prototype search box that returned
            nothing would invite a conversation about results rather than
            about navigation. */}
        <label
          className="hide-sm"
          title="Search is not prototyped"
          style={{
            flex: "1 1 320px", maxWidth: 420, minWidth: 0, height: 40,
            display: "flex", alignItems: "center", gap: 8, padding: "0 12px",
            border: `1px solid ${T.border}`, borderRadius: 999, color: T.textSubtle,
          }}
        >
          <span className="ms" style={{ fontSize: 20 }}>search</span>
          <input
            readOnly
            placeholder="Search books, formats and tools"
            style={{
              border: 0, outline: "none", background: "transparent", minWidth: 0, width: "100%",
              fontFamily: FONT_BODY, fontSize: TYPE.sm, color: T.textSubtle, cursor: "default",
            }}
          />
        </label>

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

        <div className="hide-sm" style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: "auto", flex: "0 0 auto" }}>
          {signedIn ? (
            <AccountMenu
              open={open === "__account"}
              onToggle={() => toggle("__account")}
              onSignOut={() => { setOpen(null); onSignedIn && onSignedIn(false); }}
            />
          ) : (
            <>
              <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: TYPE.sm, color: T.textNeutral, textDecoration: "none" }}>Sign Up</a>
              <a href="#" onClick={e => { e.preventDefault(); onSignedIn && onSignedIn(true); }} style={{ fontSize: TYPE.sm, color: T.textNeutral, textDecoration: "none" }}>Log In</a>
            </>
          )}

          <LocaleMenu
            open={open === "__locale"}
            onToggle={() => toggle("__locale")}
            value={locale}
            onPick={i => { setLocale(i); setOpen(null); }}
          />

          {/* Kept when signed in. Today it disappears, which strands anyone mid-order. */}
          <span className="ms" style={{ fontSize: 20, color: T.textNeutral }}>shopping_cart</span>

          {/* Start Project goes to /getting-started, not to registration. On
              the live site this is the header's most prominent action and it
              opens /my/account/register — an account form before a price,
              which is the identity gate the audit argues against. */}
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

      {/* ── Nav row ── the five jobs, and the Bookstore apart from them. */}
      <nav
        className="nav-desktop"
        style={{
          borderTop: `1px solid ${T.border}`,
          maxWidth: 1400, margin: "0 auto", padding: "0 16px",
          display: "flex", alignItems: "center", gap: 4, fontFamily: FONT_BODY,
        }}
      >
        {NAV.map(group => <NavItem key={group.label} group={group} />)}

        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          <span aria-hidden style={{ width: 1, height: 22, background: T.border, margin: "0 8px" }} />
          <NavItem group={BOOKSTORE} />
        </span>
      </nav>

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
                <strong style={{ color: T.textNeutral }}>Proposed nav — Deb's option D.</strong>{" "}
                Five jobs, not six departments: <em>Make</em> · <em>Sell</em> · <em>Services</em> ·{" "}
                <em>Pricing</em> · <em>Resources</em>, with the Bookstore apart. Volume orders and API
                printing move to <em>Services</em>, because neither is a way to sell. Seller pricing stays
                off the Pricing menu. Search is drawn, not built; no AI.
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
