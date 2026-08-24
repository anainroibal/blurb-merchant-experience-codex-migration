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
     · NO SEARCH. Drawn out on 2026-08-24 to keep the scope honest: search
       is a product — an index, a results page, ranking — not a nav
       control, and a box that returns nothing invites a conversation
       about results instead of about navigation. The utility row holds
       what it holds without it. Worth revisiting on its own: the sitemap
       sweep found 99 pages, dead URLs and redirect hops, and a five-link
       footer that carries no navigation at all.

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

/* ── Draft D's menus, as drawn ──
   Column headings, the label-plus-description shape and the wording are
   Deb's. At most three columns of content, a note box under Make's
   products, and a promoted panel on the right of Sell and Services.

   Two tags survive from the sketch and one does not. CONCEPT and COMING
   SOON stay: they say a thing is not real yet, which a visitor needs to
   know and which nav is otherwise very bad at admitting. The NEW badges
   are out, per 2026-08-24 — those spoke to reviewers, not to visitors.

   ⚠️ Store integrations and Switch to Blurb both come from Deb's drafts
   and appear in no source we hold — not the DES-469 audit, not Stacey's
   files. Nav is a commitment surface, and "coming soon" against an
   unowned thing is how /apple-books-store happened. Tagged here, and
   raised with Deb. */
const NAV = [
  /* PRODUCTS, not "Make". Draft D put a verb at the head of this menu and
     folded the products inside it. The verb costs more than it earns:
     "Products" is the word a returning customer scans for, and it leads to
     the highest-traffic pages on the site. What D got right is what the
     menu HOLDS — products, project kinds and tools in one place — so this
     keeps D's menu and takes the live site's label for it.

     It also absorbs Design Tools, which was a department rather than a job:
     tools serve making, they are not a reason to visit. That is what keeps
     this row at six items, the same as today, while still finding room for
     Services. */
  { label: "Products", href: "/formats", columns: [
    { heading: "Products", items: [
      ["Shop All", "Every format Blurb prints."],
      ["Hardcover", "Ideal for photo books, portfolios and anything meant to last."],
      ["Softcover", "Perfect bound, lighter and lower cost. Also suits text-led publications."],
    ], note: ["Not making a book? We also print ", "photo prints and framed wall art", "."] },

    /* Ten kinds in two columns under one heading, as drawn — and the same
       vocabulary as PROJECT_KINDS and the live /getting-started dropdown,
       which is the strongest thing about this menu. */
    { heading: "What are you making?", split: true, items: [
      ["Photo Books"], ["Wedding"],
      ["Travel"], ["Cookbooks"],
      ["Zines"], ["Magazines"],
      ["Comic books"], ["Portfolio"],
      ["Novels"], ["Children's books"],
    ]},

    { heading: "Tools", items: [
      ["Blurb online editor", "Design in your browser. Nothing to download."],
      ["BookWright", "Blurb's own book-making software."],
      ["PDF to Book", "Bring a file you have already laid out."],
      ["Adobe software", "InDesign plugin and Lightroom Book Module."],
    ]},
  ]},

  { label: "Sell", href: "/self-publish", columns: [
    { heading: "Blurb seller hub", items: [
      ["Checkout links", "Share a link or embed a button. We print and ship each order."],
      ["Sell on Blurb's Bookstore", "List in Blurb's own storefront."],
      ["Sell on Amazon", "Reach the largest book audience."],
      ["Ingram Distribution", "Distribute to bookstores and libraries."],
      ["Store integrations", "Connect Shopify, Etsy and more.", "Coming soon"],
    ]},
    { heading: "Pricing and products", items: [
      ["Margin estimator", "Set a price and see what you keep per copy."],
      /* The crossover. A seller whose question is "what can I sell?" is
         asking about products, and the Products menu answers what we print
         rather than what is sellable. One link, to the seller page where
         the two axes meet. */
      ["What you can sell", "Which formats sell through which route, and what each one asks of you."],
    ]},
  ], promo: {
    heading: "Switch to Blurb",
    title: "Switch to Blurb",
    tag: "Concept",
    body: "Already selling books elsewhere? Move your titles across.",
  }},

  { label: "Services", href: "/large-order-services", columns: [
    { heading: "Services", items: [
      ["Volume orders", "Volume discounts start at 100 copies. We quote the run and handle the logistics."],
      ["Switch to Blurb", "Already selling books elsewhere? Move your titles across.", "Concept"],
    ]},
  ], promo: {
    title: "API Printing",
    body: "Print as infrastructure. Send orders from your own system and we print and ship them.",
    cta: "RPI Print",
    external: true,
  }},

  { label: "Pricing", href: "/pricing", columns: [
    { heading: "Pricing", items: [
      ["Compare products & pricing", "What each format costs, with cost estimates per book."],
      ["Shipping Calculator", "Estimate delivery cost and time."],
    ]},
  ]},

  { label: "Resources", href: "/blog", columns: [
    { heading: "Resources", items: [
      ["Blog", "Craft, printing and selling, from Blurb and its makers."],
      ["Templates", "Layouts sized to every format Blurb prints."],
      ["Events", "Workshops, talks and book fairs."],
      ["Help Center", "Guides, specs and answers."],
    ]},
  ]},
];

/* Shopping is not one of the five jobs, so the Bookstore sits apart from
   them — its own item to the right of the nav row, as in the sketch. */
/* No icon, and no "Blurb" in front of it. It was the only pictogram in the
   row, which made the Bookstore look like a different kind of thing rather
   than another destination — and the label already says what it is. */
const BOOKSTORE = { label: "Bookstore", href: "/bookstore", columns: [
  { heading: "The Bookstore", items: [
    ["Browse the Bookstore", "Read what other makers are selling."],
    ["All Categories", "Photography, portfolios, cookbooks, travel, memoir and more."],
  ]},
]};

/* The same navigation, flattened into footer columns. Exported so a footer
   cannot drift from the header — one list, two renderings. */
export const NAV_COLUMNS = [...NAV, BOOKSTORE].map(g => ({
  label: g.label,
  items: g.columns.flatMap(c => c.items.map(([label, body]) => ({ label, hint: body }))),
}));

/* COMING SOON / CONCEPT. Content, not annotation — the outline treatment
   keeps them quieter than a filled badge, because a status is a caveat
   rather than a selling point. */
function Tag({ children }) {
  if (!children) return null;
  return (
    <span style={{
      marginLeft: 8, padding: "1px 8px", borderRadius: 999, verticalAlign: "middle",
      fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase",
      border: `1px solid ${T.borderStrong}`, color: T.textSubtle, whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

/* ── The panel ──
   Full width, under the nav row, as drawn: one rule per column heading and
   the whole thing spanning the header rather than hanging off its trigger.
   That is the shape that lets Make hold ten project kinds and a note box
   without becoming a scrolling column. */
function MegaMenu({ group, onClose }) {
  const cols = group.columns.length + (group.promo ? 1 : 0);
  return (
    <div
      className="pop-in"
      style={{
        position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
        background: "#fff", borderTop: `1px solid ${T.border}`,
        borderBottom: `1px solid ${T.border}`,
        boxShadow: "0 16px 36px rgba(0,0,0,0.10)",
      }}
    >
      <div style={{
        maxWidth: 1400, margin: "0 auto", padding: "22px 16px 28px",
        display: "grid", gap: 32,
        gridTemplateColumns: `repeat(${cols}, minmax(220px, 1fr))`,
        alignItems: "start",
      }}>
        {group.columns.map(col => (
          <div key={col.heading} style={{ minWidth: 0 }}>
            <div style={{
              fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase",
              color: T.textSubtle, paddingBottom: 8, borderBottom: `1px solid ${T.border}`,
            }}>
              {col.heading}
            </div>

            <div style={{
              marginTop: 14, display: "grid", gap: col.split ? "10px 24px" : 14,
              gridTemplateColumns: col.split ? "repeat(2, minmax(0, 1fr))" : "1fr",
            }}>
              {col.items.map(([label, body, tag]) => (
                <a
                  key={label}
                  href="#"
                  onClick={e => { e.preventDefault(); onClose(); }}
                  style={{ textDecoration: "none", color: T.textNeutral, display: "grid", gap: 2, minWidth: 0 }}
                >
                  <span style={{ fontSize: TYPE.base, fontWeight: 700 }}>
                    {label}<Tag>{tag}</Tag>
                  </span>
                  {body && (
                    <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>{body}</span>
                  )}
                </a>
              ))}
            </div>

            {col.note && (
              <div style={{
                marginTop: 18, border: `1px dashed ${T.borderStrong}`, borderRadius: R.sm,
                padding: "10px 12px", fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5,
              }}>
                {col.note[0]}<strong style={{ color: T.textNeutral }}>{col.note[1]}</strong>{col.note[2]}
              </div>
            )}
          </div>
        ))}

        {group.promo && (
          <div style={{ minWidth: 0 }}>
            {group.promo.heading && (
              <div style={{
                fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase",
                color: T.textSubtle, paddingBottom: 8, borderBottom: `1px solid ${T.border}`,
              }}>
                {group.promo.heading}
              </div>
            )}
            <div style={{
              marginTop: group.promo.heading ? 14 : 0,
              border: `1px solid ${T.border}`, borderRadius: R.md, padding: 14,
              display: "grid", gap: 10,
            }}>
              <div style={{ background: C.gray50, borderRadius: R.sm, height: 96 }} />
              <span style={{ fontSize: TYPE.base, fontWeight: 700 }}>
                {group.promo.title}<Tag>{group.promo.tag}</Tag>
              </span>
              <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>
                {group.promo.body}
              </span>
              {group.promo.cta && (
                <span style={{
                  justifySelf: "start", border: `1px solid ${T.borderStrong}`, borderRadius: R.sm,
                  padding: "6px 12px", fontSize: TYPE.sm, fontWeight: 700,
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}>
                  {group.promo.cta}
                  {group.promo.external && <span className="ms" style={{ fontSize: 16 }}>open_in_new</span>}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
            {group.label}
          </div>
          {group.columns.map(col => (
            <div key={col.heading} style={{ display: "grid", gap: 1, paddingBottom: 8 }}>
              <div style={{
                fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase",
                color: T.textSubtle, padding: "8px 0 2px",
              }}>{col.heading}</div>
              {col.items.map(([label, , tag]) => (
                <a
                  key={label}
                  href="#"
                  onClick={e => { e.preventDefault(); onClose(); }}
                  style={{ padding: "9px 0", textDecoration: "none", color: T.textSubtle, fontSize: TYPE.base }}
                >
                  {label}<Tag>{tag}</Tag>
                </a>
              ))}
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
                {it.label}
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
                  <span>{it.label}</span>
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

  /* The trigger only — the panel is full width and rendered once below the
     row rather than inside each item.

     No chevron. Every item in this row opens a menu, so a caret on each one
     says nothing an interaction does not already say, and six of them turn
     a row of words into a row of controls. The open item takes the brand
     colour, which is how the live header marks it. */
  const NavItem = ({ group }) => (
    <button
      onClick={() => toggle(group.label)}
      onMouseEnter={() => open && !open.startsWith("__") && setOpen(group.label)}
      aria-expanded={open === group.label}
      style={{
        background: "transparent", border: 0, padding: "22px 12px",
        fontFamily: FONT_BODY, fontSize: TYPE.sm, fontWeight: 500,
        color: open === group.label ? C.blue600 : T.textNeutral,
        whiteSpace: "nowrap", cursor: "pointer",
      }}
    >
      {group.label}
    </button>
  );

  const openGroup = [...NAV, BOOKSTORE].find(g => g.label === open);

  return (
    <div ref={ref} style={{ borderBottom: `1px solid ${T.border}`, background: "#fff", position: "relative", zIndex: 40 }}>

      {/* ── One row ──
          Draft D stacked the header into two, which buys room for a search
          box and costs vertical space on every page. Without search there is
          nothing to put in the second row, so it goes back to one: logo,
          the six destinations, then the account actions and Start Project.
          Same height as the live header, and the menus below are unaffected. */}
      <div style={{
        maxWidth: 1400, margin: "0 auto", padding: "0 16px", minHeight: 66,
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

        <nav
          className="nav-desktop"
          style={{ display: "flex", alignItems: "center", gap: 0, flex: 1, minWidth: 0 }}
        >
          {NAV.map(group => <NavItem key={group.label} group={group} />)}
          <NavItem group={BOOKSTORE} />
        </nav>

        <div className="hide-sm" style={{ display: "flex", alignItems: "center", gap: 16, flex: "0 0 auto" }}>
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

      {openGroup && <MegaMenu group={openGroup} onClose={() => setOpen(null)} />}

      <MobileNav
        open={mobileOpen}
        signedIn={signedIn}
        onClose={() => setMobileOpen(false)}
        onSignedIn={v => onSignedIn && onSignedIn(v)}
      />

    </div>
  );
}
