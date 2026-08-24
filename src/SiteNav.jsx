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

     Tools were briefly folded in here and are now their own destination
     again — see the note on that group. So the row runs to seven with the
     Bookstore, one more than today. If that ever needs paying for, the
     Bookstore is the candidate: shopping is not one of these jobs, and it
     would sit naturally beside the cart in the account actions. */
  { label: "Products", href: "/formats", columns: [
    /* The seven products Blurb prints, with the "best for" line each one
       carries in the sample. Split 4 / 3 across two columns under a single
       heading, as drawn. */
    { heading: "Product catalog", chunkAt: 4, items: [
      ["Shop All", "Every format Blurb prints.", null, "catalog"],
      ["Photo Books", "Best for travel, fine-art photography, and books built to last on a shelf.", null, "product"],
      ["Layflat Books", "Best for wedding albums, panoramic landscapes, and portfolio work."],
      ["Paperback and Hardcover Books", "Best for novels, cookbooks, children's books, and prototyping."],
      ["Magazines", "Best for editorial projects, lookbooks, and serial publications."],
      ["Notebooks & Journals", "Best for sketchbooks, planners, field notes, and writing practice."],
      ["Wall Art", "Best for gallery displays, home décor, and print gifting."],
    ]},
  ], featured: {
    heading: "Featured",
    title: "Layflat Photo Books",
    body: "Our most seamless format — open flat, edge to edge, with no gutter interruption.",
    cta: "Shop Layflat",
  }},

  /* TOOLS, top level. It was folded into Products for a while, on the
     argument that tools serve making rather than being a reason to visit.
     That is true of a shopper and wrong about everyone else: the tool is
     the decision for anyone who has already decided to make something, and
     it is the thing they come back for. Blurb has four of them and they
     are genuinely different — a browser editor, a desktop app, a PDF path
     and two Adobe plug-ins — which is a choice, not a footnote.

     Templates comes here from Resources, because a template is a tool, not
     reading material. The live site agrees: its Design Tools menu carries
     BookWright, Adobe Tools, PDF to Book and BookWright Templates. */
  { label: "Tools", href: "/bookmaking-tools", columns: [
    { heading: "Creative tools", items: [
      ["Blurb online editor", "Design in your browser. Nothing to download."],
      ["BookWright", "Blurb's own book-making software."],
      ["PDF to Book", "Bring a file you have already laid out."],
      ["Adobe software", "InDesign plugin and Lightroom Book Module."],
      ["Templates", "Layouts sized to every format Blurb prints."],
    ]},
  ]},

  { label: "Sell", href: "/self-publish", columns: [
    { heading: "Blurb seller hub", items: [
      ["Instant Store", "Share a link or embed a button. We print and ship each order.", null, "instantstore"],
      ["Sell on Blurb's Bookstore", "List in Blurb's own storefront."],
      ["Sell on Amazon", "Reach the largest book audience."],
      ["Ingram Distribution", "Distribute to bookstores and libraries."],
      ["Store integrations", "Connect Shopify, Etsy and more.", "Coming soon"],
    ]},
    { heading: "Pricing and products", items: [
      ["Margin estimator", "Set a price and see what you keep per copy.", null, "margin"],
      /* The crossover. A seller whose question is "what can I sell?" is
         asking about products, and the Products menu answers what we print
         rather than what is sellable. One link, to the seller page where
         the two axes meet. */
      ["What you can sell", "Which formats sell through which route, and what each one asks of you.", null, "seller"],
    ]},
  ], featured: {
    heading: "Featured",
    title: "Switch to Blurb",
    tag: "Concept",
    body: "Already selling books elsewhere? Move your titles across.",
    cta: "See how it works",
  }},

  { label: "Services", href: "/large-order-services", columns: [
    { heading: "Services", items: [
      ["Volume orders", "Volume discounts start at 100 copies. We quote the run and handle the logistics."],
      ["Switch to Blurb", "Already selling books elsewhere? Move your titles across.", "Concept"],
    ]},
  ], featured: {
    heading: "Featured",
    title: "API Printing",
    body: "Print as infrastructure. Send orders from your own system and we print and ship them.",
    cta: "RPI Print",
    external: true,
  }},

  { label: "Pricing", href: "/pricing", columns: [
    { heading: "Pricing", items: [
      ["Pricing Calculator", "Price a specific book by size, pages and paper.", null, "pricing"],
      /* Shipping lives inside the pricing calculator now — the destination
         and the arrival dates are a section of that page, so this opens the
         same screen rather than pretending to a page of its own. */
      ["Shipping Calculator", "Estimate delivery cost and time.", null, "pricing"],
    ]},
  ], featured: {
    heading: "Featured",
    title: "Need to order in volume?",
    body: "Volume discounts start at 100+ copies. Our Large Order Services quotes the run and handles the logistics.",
    cta: "Learn more",
  }},

  { label: "Resources", href: "/blog", columns: [
    { heading: "Resources", items: [
      ["Blog", "Craft, printing and selling, from Blurb and its makers."],
      ["Events", "Workshops, talks and book fairs."],
      ["Help Center", "Guides, specs and answers."],
    ]},
  ]},
];

/* Shopping is not one of the five jobs, so the Bookstore sits apart from
   them — its own item to the right of the nav row, as in the sketch. */
/* ── The Bookstore is a link, not a menu ──
   It goes straight there. Everything else in the row is a category of
   pages; this is one page, and it is somewhere people arrive meaning to
   browse rather than to choose. A dropdown holding "Browse the Bookstore"
   and "All Categories" was two links to the same shop with a click in
   front of them.

   No icon and no "Blurb" either: it was the only pictogram in the row,
   which made it look like a different kind of thing, and the logo already
   says whose site this is. */
/* ── The signed-in account menu ──
   RESTORED 2026-08-24. It was deleted with the old NAV data when the menus
   were rebuilt to draft D, while both consumers — this menu and the mobile
   nav — kept referencing it, so clicking your own name threw a
   ReferenceError and took the page down with it. A constant with two live
   call sites is not dead code, whatever the shape of the object around it.

   Five destinations, judged against today's dashboard sidebar (eleven
   items in two groups, all at the same weight):

     · BOOKWRIGHT ONLINE PROJECTS is a second projects list split by the
       tool that made it — Blurb's division, not the seller's. One
       Projects, with a filter.
     · SALES OVERVIEW and MONTHLY PROFIT REPORTS are two doors to one room,
       one named after a date range. Earnings, with the period inside it.
     · ADDRESS BOOK, MY PROFILE, ACCOUNT SETTINGS and PAYMENT SETTINGS are
       four settings pages. Settings.
     · PUBLISHING RESOURCES is reading material, not a destination. Help.
     · MY ORDERS earns its place: it is where a buyer goes, and where a
       seller's proof copy lives — the thing that unlocks selling.

   Your Instant Stores is the entry the live sidebar has no equivalent for,
   and it is the gap this project exists to close.

   Naming: the live sidebar mixes MY PROJECTS with SALES OVERVIEW. Pick
   one — second person throughout, as everywhere else here. */
const ACCOUNT_MENU = [
  [
    { label: "Dashboard" },
    { label: "Your projects" },
    { label: "Your Instant Stores", hint: "Every store, and what each has earned" },
    { label: "Your earnings", hint: "Sales overview and profit reports, in one place" },
    { label: "Your orders", hint: "Including the proof copy that unlocks selling" },
  ],
  [{ label: "Settings" }, { label: "Help" }],
  [{ label: "Log out", quiet: true }],
];

const BOOKSTORE = { label: "Bookstore", href: "/bookstore", direct: true };

/* The same navigation, flattened into footer columns. Exported so a footer
   cannot drift from the header — one list, two renderings. */
export const NAV_COLUMNS = NAV.map(g => ({
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

/* ── The panel, as blurb.com draws it ──
   Anchored under its trigger rather than spanning the header, sized to its
   contents, white on a soft shadow, and inside it nothing but the
   destinations: no column headings, no descriptions, one label per line
   with a lot of air around it.

   That is a real choice and worth naming, because draft D's panels carried
   a description under every item. Two arguments for the live treatment:

     · A menu is for getting somewhere, and a list of seven plain words is
       scanned in about a second. The same list with a line of explanation
       under each takes an order of magnitude longer to read, and the
       explanation is repeated on the page it leads to anyway.
     · Descriptions in a menu are where copy goes to be forgotten. Nobody
       reviews them, nobody translates them twice, and they drift from the
       pages they describe.

   THE DESCRIPTIONS ARE STILL IN THE DATA, unused by this renderer. If they
   are wanted back, it is one `body &&` away — see the commented line
   below. What is genuinely parked by this style: Products' wall-art note,
   and the Switch to Blurb and API Printing promo panels. Those need a
   layout with room for a picture, which this one does not have.

   Items flow DOWN each column and then across, in columns of at most five,
   which is how the live Products menu breaks its seven products. */
const COLUMN_MAX = 5;

const chunk = (arr, size) =>
  arr.reduce((cols, item, i) => {
    if (i % size === 0) cols.push([]);
    cols[cols.length - 1].push(item);
    return cols;
  }, []);

/* A row, not a word: the highlight is a block that spans the column, so
   the target is the whole line rather than the label's own width. Grey
   ground, brand-blue label — the live site's treatment.

   Every item carries its description, as Deb's design has them: bold label,
   one line underneath. The earlier plain-list version matched the live site
   but lost the only thing in a nav that helps someone CHOOSE — the live
   menus are lists of names, and a name only helps if you already know what
   it means. "Volume orders" is a good example: the label says nothing about
   100 copies, and the line under it does. */
/* The screens the minimum-effort scope does not build. A nav item pointing
   at one of them is still the right nav item — those pages exist on
   blurb.com — it just has nothing to open here. */
const LEAN_MISSING = ["getstarted", "pricing", "margin"];
const reachable = (stage, lean) => (lean && LEAN_MISSING.includes(stage) ? null : stage);

function MenuLink({ item, onClose, onGo, lean }) {
  const [hot, setHot] = useState(false);
  const [label, body, tag, rawStage] = item;
  const stage = reachable(rawStage, lean);
  return (
    <a
      href="#"
      /* Items that have a screen behind them go to it. The rest close the
         menu and stay put, which is honest: this prototype holds five
         screens, not a site. */
      onClick={e => { e.preventDefault(); onClose(); if (stage) onGo?.(stage); }}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
      style={{
        /* `.nav__link-desktop` in the same stylesheet, as used inside the
           submenu: font-size --text-sm (14px) at line-height 1.4, weight
           500, colour --color-light-gray-950, padding 16px all round,
           min-width --spacing * 55 = 220px, and rounded-md (6px) on the
           hover ground, which is --color-light-gray-50. */
        display: "block", textDecoration: "none",
        fontSize: TYPE.sm, lineHeight: 1.4, fontWeight: 400,
        padding: 16, borderRadius: 6, minWidth: body ? 300 : 220,
        /* blue600 on white is 4.52:1, which passes AA for this 14px text by
           a hair. On the grey hover ground it drops to 4.14:1 and fails, so
           the hover uses blue700 — 5.54:1 on grey. The live site keeps
           blue600 on both, which is a real (small) contrast bug there. */
        color: hot ? C.blue700 : C.gray950,
        background: hot ? C.gray50 : "transparent",
        /* .nav__link-desktop: 200ms, cubic-bezier(.4, 0, .2, 1). */
        transition: "color var(--nav-hover) var(--nav-ease), background-color var(--nav-hover) var(--nav-ease)",
      }}
    >
      <span style={{ display: "block", fontWeight: 700 }}>{label}<Tag>{tag}</Tag></span>
      {body && (
        <span style={{
          display: "block", marginTop: 3, fontWeight: 400,
          color: T.textSubtle, whiteSpace: "normal", maxWidth: 300,
        }}>
          {body}
        </span>
      )}
    </a>
  );
}

function MegaMenu({ group, isOpen, onClose, onGo, lean }) {
  /* Every menu is headed (2026-08-24). The rule used to be "only when the
     menu holds more than one kind of thing", which left Tools — a single
     column — as the one panel that opened with no label on it, and the row
     reading inconsistently as you moved along it. A heading costs one line
     and says what the list is; there is no menu here where that is wasted. */
  const headed = true;

  return (
    /* Mounted whether or not it is open, so the exit is animated too — a
       menu that fades in and then vanishes on a hard cut feels broken.
       Hidden panels are inert: visibility hidden keeps them out of the
       accessibility tree, and pointer-events none stops them swallowing
       clicks meant for the page underneath. */
    <div
      aria-hidden={!isOpen}
      style={{
        /* ── Taken from the live stylesheet, not estimated ──
           assets.blurb.com/_astro/index.CV0oYoXR.css, `.nav__submenu`:

             left            calc(--spacing * -2)  = -8px
             padding-inline  calc(--spacing * 2)   = 8px
             padding-block   calc(--spacing * 4)   = 16px
             radius          0 0 --radius-md --radius-md = 0 0 6px 6px
             border-top      1px --color-light-gray-100
             box-shadow      0 4px 6px -1px #0000001a,
                             0 2px 4px -2px #0000001a

           The top corners are square and only the top edge is bordered,
           because the panel hangs off the header rather than floating: it
           reads as the header continuing downwards. */
        position: "absolute", top: "100%", left: -8, zIndex: 50,
        background: "#fff",
        borderTop: `1px solid ${C.gray100}`,
        borderRadius: "0 0 6px 6px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
        padding: "16px 8px",
        display: "flex", gap: 8, alignItems: "flex-start",
        fontFamily: FONT_BODY, whiteSpace: "nowrap",
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? "visible" : "hidden",
        pointerEvents: isOpen ? "auto" : "none",
        transform: isOpen ? "none" : "translateY(-6px) scale(0.985)",
        transformOrigin: "top center",
        transition:
          isOpen
            ? "opacity var(--menu) var(--nav-ease), transform var(--menu) var(--nav-ease)"
            : "opacity var(--menu) var(--nav-ease), transform var(--menu) var(--nav-ease), visibility 0s var(--menu)",
      }}
    >
      {group.columns.map(col => (
        <div key={col.heading} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          {/* A long set breaks into columns of five, which is how the live
              Products menu splits its seven. */}
          {chunk(col.items, col.chunkAt || COLUMN_MAX).map((sub, i) => (
            <div key={i}>
              {headed && (
                <div style={{
                  fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase",
                  color: T.textSubtle, padding: "0 16px 6px",
                  /* The heading belongs to the set, not to each column of it,
                     so only the first column of a split set is labelled. */
                  visibility: i === 0 ? "visible" : "hidden",
                }}>
                  {col.heading}
                </div>
              )}
              {sub.map(item => <MenuLink key={item[0]} item={item} onClose={onClose} onGo={onGo} lean={lean} />)}
            </div>
          ))}
        </div>
      ))}

      {/* ── The Featured card — the ONLY promo pattern in the nav ──
          Products, Sell, Services and Pricing all promote something beside
          their list, and they all do it this way: image, title, one line,
          a text link. An earlier pass gave Pricing its own treatment — icon,
          bordered box, outlined button — which meant two patterns doing one
          job, and a reader learning the second one for no reason. Check for
          an existing pattern before adding one.

          One promoted thing beside the list. It is a SINGLE link wrapping
          the image, the heading and the call to action, not three — two
          adjacent links to the same page is a redundant tab stop, and the
          image carries no information the heading does not, so its alt is
          empty rather than a description repeated to a screen reader.

          It sits last in the DOM on purpose: keyboard and screen-reader
          users reach the seven products before the advert, which is the
          order they came for. */}
      {group.featured && (
        <div style={{ minWidth: 260, maxWidth: 280 }}>
          <div style={{
            fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase",
            color: T.textSubtle, padding: "0 16px 6px",
          }}>
            {group.featured.heading}
          </div>
          <FeaturedCard card={group.featured} onClose={onClose} onGo={onGo} />
        </div>
      )}
    </div>
  );
}

function FeaturedCard({ card, onClose, onGo }) {
  const [hot, setHot] = useState(false);
  return (
    <a
      href="#"
      onClick={e => { e.preventDefault(); onClose(); if (card.stage) onGo?.(card.stage); }}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
      style={{
        display: "block", textDecoration: "none", padding: 16, borderRadius: 6,
        background: hot ? C.gray50 : "transparent", whiteSpace: "normal",
        transition: "background-color var(--nav-hover) var(--nav-ease)",
      }}
    >
      {/* Decorative: the heading beside it already names the product, so a
          description here would be read out twice. */}
      <span
        role="img"
        aria-label=""
        style={{ display: "block", height: 116, borderRadius: 4, background: C.gray100 }}
      />
      <span style={{
        display: "block", marginTop: 12, fontSize: TYPE.sm, fontWeight: 700,
        color: C.gray950, lineHeight: 1.4,
      }}>
        {card.title}<Tag>{card.tag}</Tag>
      </span>
      <span style={{ display: "block", marginTop: 4, fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.45 }}>
        {card.body}
      </span>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5, marginTop: 10,
        fontSize: TYPE.sm, fontWeight: 700,
        color: hot ? C.blue700 : C.blue600,
        transition: "color var(--nav-hover) var(--nav-ease)",
      }}>
        {card.cta}
        {card.external && <span className="ms" aria-hidden style={{ fontSize: 16 }}>open_in_new</span>}
      </span>
    </a>
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
function MobileNav({ open, signedIn, onClose, onSignedIn, onGo, lean }) {
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
            {group.label}
          </div>
          {group.columns.map(col => (
            <div key={col.heading} style={{ display: "grid", gap: 1, paddingBottom: 8 }}>
              <div style={{
                fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase",
                color: T.textSubtle, padding: "8px 0 2px",
              }}>{col.heading}</div>
              {col.items.map(([label, , tag, stage]) => (
                <a
                  key={label}
                  href="#"
                  onClick={e => { e.preventDefault(); onClose(); const to = reachable(stage, lean); if (to) onGo?.(to); }}
                  style={{ padding: "9px 0", textDecoration: "none", color: T.textSubtle, fontSize: TYPE.base }}
                >
                  {label}<Tag>{tag}</Tag>
                </a>
              ))}
            </div>
          ))}
        </div>
      ))}

      <a
        href="#"
        onClick={e => { e.preventDefault(); onClose(); }}
        style={{
          display: "block", padding: "14px 0", borderBottom: `1px solid ${T.border}`,
          textDecoration: "none", fontSize: TYPE.lg, fontWeight: 700, color: T.textNeutral,
        }}
      >
        {BOOKSTORE.label}
      </a>

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

export default function SiteNav({ signedIn, onSignedIn, onGo, lean = false }) {
  const [open, setOpen] = useState(null);
  const [locale, setLocale] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  /* Bookstore has no panel to open, so it carries its own hover state. */
  const [shopHot, setShopHot] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(null); };
    const onKey = e => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  /* One place to decide whether a mega menu is open, so the row and the
     account and locale popovers can all close each other. */
  const toggle = key => setOpen(open === key ? null : key);

  /* ── Hover, with the two delays that make hover menus usable ──
     Opening waits ~90ms, so sweeping the pointer across the row on the way
     to something else does not fire five menus. Closing waits ~180ms, so
     the diagonal from a trigger to the far side of its own panel is
     forgiving — the classic reason hover menus feel broken is a 0ms close.

     Switching between triggers while a menu is already open is instant:
     the intent has been established, and waiting again reads as lag.

     The panel is a child of its trigger's wrapper, so moving from one to
     the other never leaves the element and never schedules a close. */
  const openTimer = useRef(null);
  const closeTimer = useRef(null);
  const clearTimers = () => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  };
  useEffect(() => clearTimers, []);

  const hoverOpen = label => {
    clearTimers();
    if (open && !String(open).startsWith("__")) { setOpen(label); return; }
    openTimer.current = setTimeout(() => setOpen(label), 90);
  };
  const hoverClose = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpen(null), 180);
  };

  /* The trigger only — the panel is full width and rendered once below the
     row rather than inside each item.

     No chevron. Every item in this row opens a menu, so a caret on each one
     says nothing an interaction does not already say, and six of them turn
     a row of words into a row of controls. The open item takes the brand
     colour, which is how the live header marks it. */
  const NavItem = ({ group }) => (
    /* The panel is anchored to its own trigger now, so it lives inside the
       item rather than being rendered once for the whole row. */
    <span
      style={{ position: "relative" }}
      onMouseEnter={() => hoverOpen(group.label)}
      onMouseLeave={hoverClose}
    >
      <button
        onClick={() => { clearTimers(); toggle(group.label); }}
        /* Keyboard users get the same menu without a pointer. */
        onFocus={() => { clearTimers(); setOpen(group.label); }}
        aria-expanded={open === group.label}
        style={{
          background: "transparent", border: 0, padding: "22px 12px",
          fontFamily: FONT_BODY, fontSize: TYPE.sm, fontWeight: 500,
          color: open === group.label ? C.blue600 : T.textNeutral,
          whiteSpace: "nowrap", cursor: "pointer",
          transition: "color var(--nav-hover) var(--nav-ease)",
        }}
      >
        {group.label}
      </button>
      <MegaMenu group={group} isOpen={open === group.label} onClose={() => setOpen(null)} onGo={onGo} lean={lean} />
    </span>
  );

  return (
    <div ref={ref} style={{ borderBottom: `1px solid ${T.border}`, background: "#fff", position: "relative", zIndex: 40 }}>

      {/* ── One row ──
          Draft D stacked the header into two, which buys room for a search
          box and costs vertical space on every page. Without search there is
          nothing to put in the second row, so it goes back to one: logo,
          the six destinations, then the account actions and Start Project.
          Same height as the live header, and the menus below are unaffected. */}
      <div style={{
        /* 40px gutters, which is where the live header puts the logo at
           1440 — ours sat at 36 and everything after it was 4px out. */
        maxWidth: 1440, margin: "0 auto", padding: "0 40px", minHeight: 66,
        display: "flex", alignItems: "center", gap: 16, fontFamily: FONT_BODY,
      }}>
        <a
          href="#"
          aria-label="Blurb home"
          /* The logo goes home, now that there is a home page to go to. */
          onClick={e => { e.preventDefault(); onGo?.("home"); }}
          style={{ display: "flex", alignItems: "center", flex: "0 0 auto" }}
        >
          {/* 50px tall, as the live mark is — its SVG renders 52×50 in a 65px
              header. Ours was 36, which made the whole row read as a smaller
              site than the one it is copying. */}
          <img src={BLURB_LOGO} alt="Blurb" style={{ height: 50, width: "auto", display: "block" }} />
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

          {/* Straight to the shop — no panel, so no hover intent either. */}
          <a
            href="#"
            onClick={e => { e.preventDefault(); setOpen(null); }}
            /* The others go blue when their panel opens, which is what hover
               does to them. This one has no panel, so it was the only item in
               the row that stayed black under the pointer — the same gesture
               with no answer. Hover and focus colour it themselves. */
            onMouseEnter={() => { hoverClose(); setShopHot(true); }}
            onMouseLeave={() => setShopHot(false)}
            onFocus={() => setShopHot(true)}
            onBlur={() => setShopHot(false)}
            style={{
              padding: "22px 12px", textDecoration: "none",
              fontFamily: FONT_BODY, fontSize: TYPE.sm, fontWeight: 500,
              color: shopHot ? C.blue600 : T.textNeutral, whiteSpace: "nowrap",
              transition: "color var(--nav-hover) var(--nav-ease)",
            }}
          >
            {BOOKSTORE.label}
          </a>
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

      <MobileNav
        open={mobileOpen}
        signedIn={signedIn}
        onGo={onGo}
        lean={lean}
        onClose={() => setMobileOpen(false)}
        onSignedIn={v => onSignedIn && onSignedIn(v)}
      />

    </div>
  );
}
