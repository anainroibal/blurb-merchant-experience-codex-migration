import React, { useState } from "react";
import { Button } from "@blurb/codex-react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import { CATALOG, SELL_CHANNELS , sellableSentence } from "./catalog.js";

const ILLUS = "https://assets.blurb.com/_astro/";

/* ────────────────────────────────────────────────────────────────
   The seller landing page.

   This was "Ways to sell" until 2026-08-24. Same page, renamed and
   given a job: it is the light option's first piece — where someone who
   wants to sell arrives, works out which route is theirs, and leaves
   with one action. The five-channel comparison is what it is FOR, so it
   stays here rather than moving into the estimator.

   The card set and its structure are ours; the value proposition on
   each card is Ana's (meeting item 1), and she is the last reviewer
   DES-482 is waiting on. So every card carries the same four facts in
   the same order, and one line at the top that is hers to write.

   Those lines are DRAFTED rather than left blank — second person, plain
   words, one idea each, no exclamation marks, the voice the rest of
   blurb.com uses. Reacting to a sentence is faster than starting at an
   empty slot, and a draft shows how long the line can run before the
   card breaks. Every one of them is Ana's to overwrite.

   The four facts are the ones a seller actually decides on:
     · who it suits
     · what the buyer pays
     · what you earn
     · when you get paid

   ── RPI Print API came off the CARD GRID, 2026-08-24 — table only now ──
   The 8/21 pod said "API printing is not included in the selling tool"
   and the room read that as: not a route to market on this page's card
   grid. A business's own store is where the selling happens and RPI's
   network only prints behind it, so a card promising four seller facts
   cannot fill them in for an engineering integration. Large Order Services
   was never on the card grid for the same reason: you buy the stock and
   distribute it yourself.

   RESETTLED, design review 2026-08-26 (item 23): "not included" only ever
   meant the card grid. Ana asked for RPI Print API and Large Order
   Services in the COMPARISON TABLE too, since a seller can use either —
   they belong beside the four routes on the one fact a card set cannot
   show: how they read across the same six rows. So the table now compares
   six; the card grid still shows four. The 8/18 reasoning is kept beside
   the `api` channel in catalog.js — the argument for keeping it off the
   card grid is still the argument.

   So four cards, not six. Store integrations — Shopify, Etsy — would be a
   fifth or seventh card when it exists, which is why it is named under the
   cards rather than compared: unbuilt, so there is nothing to fill six
   facts in with.

   ONE PAGE, ONE GOAL (8/21 rule): the goal is "which route is mine?".
   Everything here serves the comparison, and the page ends with the one
   step that follows from having chosen — nothing else.

   ── A table, not four cards, 2026-08-24 ──
   Each card carried five labelled facts, which meant the labels were
   printed four times and the eye had to travel down one card and back up
   the next to compare anything. A table prints each label once and puts
   the four answers side by side, which is the whole job of this page. It
   is also the compact form: the same information in about a third of the
   height.

   ── NO MONEY ON THIS PAGE, 2026-08-24 ──
   It had a worked example: one product, one price, and "you keep" per
   route. It read as precision and could not be. What a route pays depends
   on the whole specification — size, cover, paper, page count — and this
   page holds none of it, so the figure was either a guess dressed as an
   answer or a demand that someone configure a book twice.

   The fix is not a smaller form. It is to stop asking this page to do two
   jobs: here you choose a ROUTE, in the profit calculator you price a
   BOOK. So the table compares what the routes actually differ on —
   who they reach, what they take, when they pay, what they ask of you —
   and the page hands over to the estimator for the number, where the
   specification already exists and nothing has to be typed again.

   "Pick this if" is the row that does the work. A seller is not choosing
   between fee structures, they are choosing between situations.

   Fee structures are sourced from blurb.com. The seller's cost is not —
   Blurb publishes no fulfilment pricing, so FULFILMENT_FACTOR stands in
   for it and every figure below inherits that.
   ──────────────────────────────────────────────────────────────── */


function Chip({ children, solid }) {
  return (
    <span style={{
      padding: "2px 8px", borderRadius: 999, fontSize: TYPE.sm, fontWeight: 700,
      letterSpacing: 0.4, textTransform: "uppercase", whiteSpace: "nowrap",
      background: solid ? C.blue600 : C.blue50,
      color: solid ? "#fff" : C.blue950,
    }}>
      {children}
    </span>
  );
}


/* Ana's line for each route — hers to overwrite. No dashed box around them
   any more: the box marked them as unfinished, and they are finished enough
   to read. If they change, they change. */
const PROPS = {
  link: "One link, one book — share it anywhere you can paste a link.",
  bookstore: "Put your book somewhere readers are already browsing.",
  amazon: "Reach the readers who would never think to look for you.",
  ingram: "Get your book onto the shelves of bookshops and libraries.",
  /* Drafted, like the four above — Ana's to overwrite (item 23 added these
     two to the table; it did not supply their copy). */
  api: "Plug your own store into Blurb's print network and let it handle fulfilment.",
  bulk: "Buy the stock, then sell or hand it out anywhere you like.",
};

/* Six routes now, in the order a seller meets them on the comparison table:
   the four print-on-demand routes first (the one they control entirely,
   then the two Blurb runs, then the one that reaches everyone else), then
   the two seller TOOLS — RPI Print API and Large Order Services — added by
   design review item 23 (2026-08-26). They stay off the SELL_CARDS grid
   below; see the note at the top of this file for why the table compares
   six while the cards still show four.

   The two id sets do not match, and that is a real trap: SELL_CHANNELS
   calls it `link` while a product's `sellChannels` calls it
   `checkout_link` (the Instant Store's key). Comparing them directly silently reports every channel
   as unavailable, which is exactly what it did on first run. Mapped here
   rather than papered over, because the mismatch is worth seeing.

   `api` and `bulk` have no entry in CATALOG_ID: neither is gated by
   product the way the four checkout-based routes are (a product's
   `sellChannels` never lists them), so `cellFor` answers their "Products
   it takes" row directly rather than through `sellableSentence`. */
const ROUTE_IDS = ["link", "bookstore", "amazon", "ingram", "api", "bulk"];
const CATALOG_ID = { link: "checkout_link", bookstore: "bookstore", amazon: "amazon", ingram: "ingram" };

/* The decisive line for each route, written as a situation rather than a
   feature. This is the row a seller actually reads. */
const PICK_IF = {
  link: "You already have people listening — a newsletter, a talk, a stall, a bio link — and no shop to send them to.",
  bookstore: "You want a listing you do not have to run, and you are happy for readers to find it by browsing.",
  amazon: "Reach matters more than margin, and the book is a photo book you are happy to sell at Amazon's terms.",
  ingram: "You want the book orderable anywhere books are — bookshops, libraries, and the retailers Amazon among them.",
  api: "You already have a storefront and want RPI's network to print and ship behind it.",
  bulk: "You need copies in hand — for an event, a launch, a stall, or to sell or distribute yourself outside Blurb's channels.",
};

const ROWS = [
  { key: "pick",      label: "Pick this if", strong: true },
  { key: "products",  label: "Products it takes" },
  { key: "buyerPays", label: "Your buyer pays" },
  { key: "takes",     label: "What the channel takes" },
  { key: "paid",      label: "When you are paid" },
];

/* Each route's own page. Three of the four PoD routes exist on blurb.com
   and open there; the Instant Store does not exist at all, which is worth
   showing rather than hiding — it is the one route with no landing page,
   and whoever writes it will need to know that. RPI Print API and Large
   Order Services each have a page too, off blurb.com for the first. */
const ROUTE_PAGE = {
  link: null,
  bookstore: "https://www.blurb.com/sell-through-blurb",
  amazon: "https://www.blurb.com/amazon",
  ingram: "https://www.blurb.com/ingram",
  api: "https://www.rpiprint.com",
  bulk: "https://www.blurb.com/large-order-services",
};

/* Which products each route takes, read off the catalogue rather than
   typed — so this can never claim a channel a product does not have.
   Family level on purpose: the exceptions are per configuration (Amazon
   excludes layflat and the 5×5) and they belong in the caveat under the
   table, not in a cell.

   RPI Print API and Large Order Services are not in this lookup — neither
   is gated by product the way the four checkout-based routes are, so
   `cellFor` answers their row directly instead of calling this. */
const productsFor = channelId => sellableSentence(channelId);

const ANY_PRODUCT = "Any product in the catalogue — not limited by format.";

/* ── Table styling, read off blurb.com/bookmaking-tools ──
   16px cells, 16px/1.4 text, labels bold, zebra starting white, a #d1d1d1
   rule under each row and between the columns — but never between the label
   and the first column, where the sticky cell's inset shadow does that job
   so the rule travels with it while the rest scrolls. */
const ROW_BG = i => (i % 2 === 0 ? "#fff" : C.gray50);

const cellBase = {
  padding: 16, fontSize: TYPE.base, lineHeight: 1.4,
  color: C.gray950, textAlign: "left", verticalAlign: "top",
  background: "inherit",
};

const labelCell = { ...cellBase, fontWeight: 700, width: 200, minWidth: 160 };

const stickyCell = {
  position: "sticky", left: 0, zIndex: 1,
  boxShadow: `inset -1px 0 0 0 ${C.charcoal200}`,
};

/* The frame draws the outermost rules now, so the last column and the last
   row must not draw them again — two 1px lines a pixel apart read as a
   thicker, slightly wrong border. */
const lastCol = (i, n) => (i === n - 1 ? { borderRight: 0 } : null);

const dataCell = {
  ...cellBase, minWidth: 250,
  /* Right, not left: the label column's inset shadow already draws the first
     rule, and a left border here would double it. Exactly what the live
     table does — border-r on the data cells, shadow on the sticky one. */
  borderRight: `1px solid ${C.charcoal200}`,
  scrollSnapAlign: "end",
};

/* ── The four routes as cards ──
   Rewritten shorter, 2026-08-24. Each card carried a "Best for" line, a
   sentence and up to six bullets lifted from /self-publish, which made four
   columns of small print that nobody reads across. A card's job here is to
   say who the route is for and let you leave — the six facts are one scroll
   below, in the table, where they can actually be compared.

   So: an illustration, the name, one sentence, two facts, a link. The
   illustrations are Blurb's own, from /amazon and /ingram — the same hand,
   so four routes look like one family rather than four brands. */
/* ── How many copies ──
   The live page asks this BEFORE it asks how to sell, and it is the right
   order: one-at-a-time, a small run and a print job are three different
   businesses, and only the first one leads to the routes below. Missing
   from our page until 2026-08-24.

   Blurb's own photographs of the press floor, and its own bands. The copy
   is cut to a line each, like the route cards — the paragraph the live page
   runs under each band says the same thing at four times the length. */
const PRINT_TIERS = [
  {
    id: "pod", band: "1+ copies", img: ILLUS + "on-demand.CB3F805E_Z27Lxnp.webp",
    alt: "A print technician checking a photo book on the press floor.",
    title: "Printed as it is ordered, one copy at a time",
    line: "No upfront cost, nothing to stock, and never out of print. This is what the four routes below run on.",
    cta: "Choose how to sell", href: "#routes",
  },
  {
    id: "run", band: "10–99 copies", img: ILLUS + "volume-discount.B4mGU6AL_ZLbwTD.webp",
    alt: "Identical photo books moving along a conveyor at the bindery.",
    title: "A small run for signings, events and giveaways",
    line: "Volume discounts start at ten copies, and the whole order ships to one address.",
    cta: "Price up a print run", stage: "pricing", leanHref: "https://www.blurb.com/pricing",
  },
  {
    id: "los", band: "100+ copies", img: ILLUS + "large-order.Dolls1H4_A7dqn.webp",
    alt: "A press roller running colour on a large print job.",
    title: "A print job, quoted by people",
    line: "Past a hundred copies our print team quotes it, and handles the logistics with you.",
    cta: "Large Order Services", href: "https://www.blurb.com/large-order-services",
  },
];

const SELL_CARDS = [
  {
    id: "link", name: "Instant Store", isNew: true, stage: "margin", cta: "See what you would keep",
    /* Where it goes when there is no estimator to go to. */
    leanStage: "instantstore", leanCta: "About Instant Stores",
    img: ILLUS + "blurb-dashboard.YPDjPrK8_Z1bvCol.webp",
    alt: "An illustration of a person setting up a book listing.",
    line: "Share one link — a newsletter, a bio, a talk, a stall — and we print and ship every order.",
    facts: ["You set the price", "Nothing to run, and no listing fees"],
  },
  {
    id: "bookstore", name: "Blurb Bookstore", href: "https://www.blurb.com/sell-through-blurb", cta: "Sell with us",
    img: ILLUS + "share-books-1.BHcvSHBn_2rGILu.webp",
    alt: "An illustration of a person holding out a book to share, beside a shelf of books.",
    line: "A listing you do not have to run, in a shop readers already browse.",
    /* "Takes the widest range of products" was true while the Bookstore
       took notebooks and journals. It no longer does (Ana + engineering,
       2026-08-25), so its range is now exactly the Instant Store's and
       the claim distinguishes nothing. What actually separates this route
       is who finds the buyer, which is also what separates the margin. */
    facts: ["No listing fee", "Blurb's readers find it, not just yours"],
  },
  {
    id: "amazon", name: "Sell on Amazon", href: "https://www.blurb.com/amazon", cta: "Sell on Amazon",
    img: ILLUS + "share-books-3.CrZIj1S-_725ax.webp",
    alt: "An illustration of a reader being found through a magnifying glass.",
    line: "Put the book in front of readers who would never think to look for you.",
    facts: ["Amazon takes a cut of your list price", "Photo books only"],
  },
  {
    id: "ingram", name: "Sell through Ingram", href: "https://www.blurb.com/ingram", cta: "Sell through Ingram",
    img: ILLUS + "reach-bookstores.BYbE8YXC_Z1XIS6H.webp",
    alt: "An illustration of a person riding an open book past a globe.",
    line: "Orderable anywhere books are — bookshops, libraries, and the retailers among them.",
    facts: ["You set the trade discount", "Paperback and hardcover only"],
  },
];

/* Blurb's own illustrations, served from the site. */
const ILLUS_NOTE = null;

/* ── Why choose Blurb ── the live page's four columns, cut to a line each.
   "Multiple ways to sell" is ours only insofar as it now names the Instant
   Store first: it is the column that would otherwise describe a page that
   no longer exists. */
const WHY = [
  ["menu_book", "Trusted printing partner",
   "Twenty years of in-house printing and full production control. No outsourcing."],
  ["architecture", "Complete creative control",
   "Free bookmaking software, Adobe plug-ins, or a print-ready PDF — your layout, your call."],
  ["storefront", "Several ways to sell",
   "Your own Instant Store, the Blurb Bookstore, Amazon, Ingram. You choose the channel, the price and the pace."],
  ["eco", "Sustainable papers and practices",
   "FSC-certified papers, printed at the facility nearest your reader."],
];

/* ── The questions ──
   The live page's, with the answers cut to what they actually answer. Two
   are ours: pricing now names the Instant Store, because on that route the
   price is the seller's rather than a markup on a base price, and payment
   says the same. Everything else is Blurb's. */
const FAQS = [
  ["How do I set the price for my book?",
   "It depends on the route. In an Instant Store you set the price outright, and what is left after your cost is yours. On the Bookstore, Amazon and Ingram your price sits on top of a base price, and the channel takes its cut from what the buyer pays."],
  ["How and when will I get paid?",
   "A US $25 minimum applies before any payout is released, whichever route you sell through. Instant Store and Bookstore sales pay out by PayPal or check on a set cadence; Amazon holds payment through its returns window, and Ingram can take up to four months."],
  ["Can I update my book after it is published?",
   "Book details — description, keywords, price — can be changed at any time. The interior cannot: to change the content you upload the new file and publish it again."],
  ["What creative control do I have?",
   "All of it. Format, size, cover, paper, layout and price are yours, in whichever tool you make the book in."],
  ["Do I get sales data?",
   "Yes — sales and earnings per book, per channel, in your dashboard."],
  ["Can I sell from my own website?",
   "That is what an Instant Store is for: one link, shared or embedded wherever you already are, and we print and ship every order."],
];

export default function SellerLanding({ onGo, lean = false }) {
  /* One question open at a time, none by default — a page of open answers is
     the wall of copy this redesign removed. */
  const [openQ, setOpenQ] = useState(null);
  const routes = ROUTE_IDS.map(id => SELL_CHANNELS.find(c => c.id === id)).filter(Boolean);

  const cellFor = (route, row) => {
    if (row.key === "pick") return PICK_IF[route.id];
    if (row.key === "products") {
      return CATALOG_ID[route.id] ? productsFor(CATALOG_ID[route.id]) : ANY_PRODUCT;
    }
    return route[row.key];
  };

  return (
    <div style={{ fontFamily: FONT_BODY, color: T.textNeutral }}>
      {/* ── The Sell page ──
          Renamed from /self-publish, 2026-08-24 (Anain). "Self-publish"
          names a movement, not a task, and the nav item above it already
          says Sell; a page whose whole job is "which route is mine?" should
          be called the thing the reader came to do. The live URL is still
          /self-publish and the redirect is somebody's call — the live page's
          heading is kept, because that copy is not what is wrong with it.

          This is where the home page's Selling tab lands. The live version
          offers three routes and the Instant Store is missing from it;
          adding the fourth is the change this page argues for.

          The hero is the one /pricing and /bookmaking-tools use: a wide
          gradient band, 96px of air, the title and one line centred in it.
          It is the site's own way of opening a marketing page, and it puts
          some colour at the top of a page that was white to the horizon. */}
      <section style={{
        background: "linear-gradient(100deg, #e9ecef 0%, #f6f3ef 45%, #ebebeb 100%)",
        padding: "clamp(56px, 8vw, 96px) 24px",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", display: "grid", gap: 20, justifyItems: "center" }}>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, letterSpacing: "-0.01em",
            fontSize: "clamp(2rem, 4.6vw, 2.75rem)", lineHeight: 1.2, margin: 0,
          }}>
            Publish and sell your books on demand
          </h1>
          <p style={{ fontSize: TYPE.xl, lineHeight: 1.55, color: T.textNeutral, margin: 0, maxWidth: 640 }}>
            Four ways to reach a buyer. They differ in who finds the book, what they ask of you, and what
            the channel takes.
          </p>
          <a
            href="#routes"
            style={{
              display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 24px",
              borderRadius: R.md, textDecoration: "none",
              background: T.bgBrand, color: T.textInverse,
              fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 600,
            }}
          >
            Compare the routes
          </a>
        </div>
      </section>

      {/* ── How many copies ──
          Ahead of the routes, as the live page has it: the answer changes
          whether the routes are even the right page. Same card as the route
          cards — tile, band, one line, a link — so the two rows read as one
          sequence rather than two designs. */}
      {/* Padded on all four sides. It used to close at zero, which was fine
          when the next section was white and invisible — with the grey band
          under it, the last link sat a few pixels off the rule. */}
      <section style={{ padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 48 }}>
          <div style={{ textAlign: "center", display: "grid", gap: 12, justifyItems: "center" }}>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
              lineHeight: 1.25, margin: 0,
            }}>
              You've made your book — now choose how to print it
            </h2>
            <p style={{ fontSize: TYPE.lg, color: T.textSubtle, margin: 0, maxWidth: 680, lineHeight: 1.6 }}>
              One copy at a time, a small run for an event, or a print job we quote for you.
            </p>
          </div>

          <div style={{ display: "grid", gap: 32, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {PRINT_TIERS.map(tier => (
              <div key={tier.id} style={{ display: "grid", gap: 16, alignContent: "start", minWidth: 0 }}>
                <div style={{ borderRadius: R.lg, overflow: "hidden", aspectRatio: "4 / 3", background: "#f5f0ea" }}>
                  <img
                    src={tier.img}
                    alt={tier.alt}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>

                <span style={{ justifySelf: "start" }}><Chip>{tier.band}</Chip></span>

                <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["4xl"], fontWeight: 500, lineHeight: 1.2 }}>
                  {tier.title}
                </div>

                <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.6, color: T.textSubtle }}>{tier.line}</p>

                {tier.stage && !(lean && tier.leanHref) ? (
                  <button
                    onClick={() => onGo?.(tier.stage)}
                    style={{
                      justifySelf: "start", fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 700,
                      color: T.textBrand, background: "transparent", border: 0, padding: 0, cursor: "pointer",
                      textDecoration: "underline", textUnderlineOffset: 4,
                    }}
                  >
                    {tier.cta}
                  </button>
                ) : (
                  <a
                    href={lean && tier.leanHref ? tier.leanHref : tier.href}
                    {...((lean && tier.leanHref ? tier.leanHref : tier.href).startsWith("#") ? {} : { target: "_blank", rel: "noreferrer" })}
                    style={{
                      justifySelf: "start", fontSize: TYPE.base, fontWeight: 700, color: T.textBrand,
                      display: "inline-flex", alignItems: "center", gap: 5,
                      textDecoration: "underline", textUnderlineOffset: 4,
                    }}
                  >
                    {tier.cta}
                    {!(lean && tier.leanHref ? tier.leanHref : tier.href).startsWith("#") &&
                      <span className="ms" style={{ fontSize: 16 }}>open_in_new</span>}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Choose how to sell your book ──
          The /self-publish section with a fourth card, and with the copy cut
          to what a card can carry: an illustration, the name, one sentence,
          two facts, a link. The bullet lists that used to sit here were four
          columns of small print arguing across each other — the same facts
          are one scroll down, in the table, where they line up.

          Sections are 80px apart, which is what /bookmaking-tools uses, and
          it is most of what "lighten it up" means on a page like this. */}
      {/* Light grey, top and bottom rule: the choosing happens here, and the
          band is what says so — everything above it is about printing, and
          everything below it is reassurance. */}
      <section
        id="routes"
        style={{
          background: T.bgSubtle,
          borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`,
          padding: "clamp(56px, 7vw, 80px) 24px", scrollMarginTop: 140,
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 48 }}>
          <div style={{ textAlign: "center", display: "grid", gap: 12, justifyItems: "center" }}>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
              lineHeight: 1.25, margin: 0,
            }}>
              Choose how to sell your book
            </h2>
            <p style={{ fontSize: TYPE.lg, color: T.textSubtle, margin: 0, maxWidth: 680, lineHeight: 1.6 }}>
              Sell from your own Instant Store, in our bookstore, on Amazon, with Ingram — or all of them.
            </p>
          </div>

          <div style={{ display: "grid", gap: 32, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {SELL_CARDS.map(card => (
              <div key={card.id} style={{ display: "grid", gap: 16, alignContent: "start", minWidth: 0 }}>
                {/* The illustration sits on the same cream tile the product
                    cards use, so a route card and a product card are
                    recognisably the same kind of object. */}
                <div style={{
                  position: "relative", background: "#f5f0ea", borderRadius: R.lg,
                  aspectRatio: "4 / 3", display: "grid", placeItems: "center", overflow: "hidden",
                }}>
                  <img
                    src={card.img}
                    alt={card.alt}
                    loading="lazy"
                    /* The illustrations ship on a white ground, which read as
                       a white square pasted on the cream tile. Multiply drops
                       the white out and leaves the drawing. */
                    style={{ width: "78%", height: "auto", display: "block", mixBlendMode: "multiply" }}
                  />
                  {card.isNew && (
                    <span style={{ position: "absolute", top: 12, left: 12 }}><Chip solid>New</Chip></span>
                  )}
                </div>

                <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["4xl"], fontWeight: 500, lineHeight: 1.2 }}>
                  {card.name}
                </div>

                <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.6, color: T.textSubtle }}>{card.line}</p>

                <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4, fontSize: TYPE.sm, lineHeight: 1.5, color: T.textSubtle }}>
                  {card.facts.map(f => <li key={f}>{f}</li>)}
                </ul>

                {card.stage ? (
                  <button
                    onClick={() => onGo?.(lean && card.leanStage ? card.leanStage : card.stage)}
                    style={{
                      justifySelf: "start", fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 700,
                      color: T.textBrand, background: "transparent", border: 0, padding: 0, cursor: "pointer",
                      textDecoration: "underline", textUnderlineOffset: 4,
                    }}
                  >
                    {lean && card.leanCta ? card.leanCta : card.cta}
                  </button>
                ) : (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      justifySelf: "start", fontSize: TYPE.base, fontWeight: 700, color: T.textBrand,
                      display: "inline-flex", alignItems: "center", gap: 5,
                      textDecoration: "underline", textUnderlineOffset: 4,
                    }}
                  >
                    {card.cta}
                    <span className="ms" style={{ fontSize: 16 }}>open_in_new</span>
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* ── …and the same four, side by side ──
              One section, not two (2026-08-24). The cards and the table are
              one question — which route is mine? — asked twice over: once as
              four pictures you skim, once as five facts you can read across.
              A grey band between them made the table look like a different
              subject, and a second h2 said so out loud. It gets a quiet
              label under the same heading instead, and the ground never
              changes, so the eye stays in one section until the answer is
              chosen. */}
          <div style={{ display: "grid", gap: 20, marginTop: 8 }}>

          {/* ── The comparison ──
              Built like the tool comparison on blurb.com/bookmaking-tools,
              which is the site's own pattern for exactly this job — one
              column per option, one labelled row per thing they differ on.
              Values read off the live table rather than eyeballed: zebra
              rows (#fff / #f5f5f5) with the header row counted as the first
              stripe, a 1px #d1d1d1 rule under every row, a vertical rule
              between the columns but not against the labels, 16px cells at
              16px/1.4, and the labels bold.

              Two things that table does and this one has to: the label
              column STICKS while the columns scroll, because a value with
              its label off-screen is unreadable, and the columns snap, so a
              horizontal drag lands on a route rather than between two.

              The one departure is the button row. The live table uses solid
              near-black buttons; ours are the outlined secondary, matching
              the rest of the prototype. */}
          {/* Outlined all the way round now that the section is grey: the
              internal rules alone left the table's edges open, and on a
              coloured ground an open-sided table reads as text that happens
              to line up rather than as one object. The frame is the same
              #d1d1d1 as the rules inside it, so it belongs to the table
              rather than boxing it. */}
          <div
            className="cmp-scroll"
            style={{
              background: "#fff", overflowX: "auto", scrollSnapType: "x mandatory",
              border: `1px solid ${C.charcoal200}`, borderRadius: R.md,
            }}
          >
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 200 + routes.length * 250 }}>
              <tbody>
                {/* The header row is a row, not a thead: it takes the first
                    zebra stripe like every other row on the live table. */}
                <tr style={{ background: ROW_BG(0), borderBottom: `1px solid ${C.charcoal200}` }}>
                  <th style={{ ...labelCell, ...stickyCell }}>Route</th>
                  {routes.map((r, i) => (
                    <th key={r.id} style={{ ...dataCell, ...lastCol(i, routes.length), fontWeight: 700, verticalAlign: "middle" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: TYPE.base, fontWeight: 700, color: C.gray950 }}>{r.name}</span>
                        {r.isNew && <Chip solid>New</Chip>}
                      </span>
                      <span style={{
                        display: "block", marginTop: 6, fontSize: TYPE.sm,
                        color: T.textSubtle, lineHeight: 1.4, fontWeight: 400,
                      }}>
                        {PROPS[r.id]}
                      </span>
                    </th>
                  ))}
                </tr>

                {ROWS.map((row, i) => (
                  <tr key={row.key} style={{ background: ROW_BG(i + 1), borderBottom: `1px solid ${C.charcoal200}` }}>
                    <th style={{ ...labelCell, ...stickyCell }}>{row.label}</th>
                    {routes.map((r, i) => (
                      <td key={r.id} style={{ ...dataCell, ...lastCol(i, routes.length), fontWeight: row.strong ? 600 : 400 }}>
                        {cellFor(r, row)}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* ── Each column ends in its own way out ──
                    A table that compares four things should let you leave by
                    any of the four, and the button belongs at the foot of its
                    own column rather than beside the route name, where it
                    would compete for the first read. */}
                {/* No bottom rule on the last row: the frame is that line. */}
                <tr style={{ background: ROW_BG(ROWS.length + 1) }}>
                  <th style={{ ...labelCell, ...stickyCell }} />
                  {routes.map((r, i) => {
                    const href = ROUTE_PAGE[r.id];
                    return (
                      <td key={r.id} style={{ ...dataCell, ...lastCol(i, routes.length), verticalAlign: "middle" }}>
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                              width: "100%", minHeight: 40, padding: "0 16px", borderRadius: R.sm,
                              fontFamily: FONT_BODY, fontSize: TYPE.sm, fontWeight: 700,
                              letterSpacing: 0.5, textTransform: "uppercase", textDecoration: "none",
                              background: "transparent", color: T.textBrand, border: `1px solid ${T.borderBrand}`,
                            }}
                          >
                            How this works
                            <span className="ms" style={{ fontSize: 16 }}>open_in_new</span>
                          </a>
                        ) : (
                          <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.45, fontStyle: "italic" }}>
                            No page for this route yet — the newest one, and the only one without a page of
                            its own.
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── The small print, once ──
              Three cards of prose used to sit here — what is true of every
              route, what is coming, and a closing pitch — which is a lot of
              reading for facts that qualify a table. They are one line each
              now, under the thing they qualify. */}
          <p style={{ margin: 0, fontSize: TYPE.sm, lineHeight: 1.7, color: T.textSubtle, maxWidth: 900 }}>
            True of the four print-on-demand routes: a US $25 payout minimum, a proof before the book goes on
            sale, and volume discounts that are retail-only. Neither applies to RPI Print API or Large Order
            Services — you deal with the buyer directly on both, so there is no Blurb payout to hold a minimum
            or a gate on. A route can also fall away once the book is specified — Amazon takes photo books but
            not layflat ones or the 5×5. Store integrations (Shopify, Etsy) would be a future card; unbuilt, so
            not compared.
            </p>
          </div>
        </div>
      </section>

      {/* ── Precision printing in action ──
          Blurb's own film of the press floor, embedded from its own channel.
          It earns its place on a page about selling: everything above is a
          promise that somebody prints and ships the book, and this is the
          only thing on the page that shows it. */}
      <section style={{ padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 32, justifyItems: "center" }}>
          <div style={{ textAlign: "center", display: "grid", gap: 12, justifyItems: "center" }}>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
              lineHeight: 1.25, margin: 0,
            }}>
              Precision printing in action
            </h2>
            <p style={{ fontSize: TYPE.lg, color: T.textSubtle, margin: 0, lineHeight: 1.6 }}>
              Go behind the scenes and see how a Blurb book is made.
            </p>
          </div>

          <div style={{
            width: "100%", maxWidth: 1000, aspectRatio: "16 / 9",
            borderRadius: R.lg, overflow: "hidden", background: C.gray950,
          }}>
            <iframe
              src="https://www.youtube.com/embed/G7GTVfHXVho?playsinline=1&cc_lang_pref=en&hl=en"
              title="How Blurb Books Are Made — Behind the Scenes of Print-on-Demand"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              style={{ width: "100%", height: "100%", border: 0, display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* ── Why choose Blurb ── four columns, a line each. */}
      <section style={{ background: T.bgSubtle, borderTop: `1px solid ${T.border}`, padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 48 }}>
          <div style={{ textAlign: "center", display: "grid", gap: 12, justifyItems: "center" }}>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
              lineHeight: 1.25, margin: 0,
            }}>
              Why choose Blurb?
            </h2>
            <p style={{ fontSize: TYPE.lg, color: T.textSubtle, margin: 0, lineHeight: 1.6 }}>
              Creative freedom, premium quality, and full control — all in one platform.
            </p>
          </div>

          <div style={{ display: "grid", gap: 32, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {WHY.map(([icon, title, body]) => (
              <div key={title} style={{ display: "grid", gap: 12, alignContent: "start" }}>
                <span className="ms" style={{ fontSize: 40, color: C.blue600, lineHeight: 1 }}>{icon}</span>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 500, lineHeight: 1.2 }}>
                  {title}
                </div>
                <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.6, color: T.textSubtle }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Questions ──
          Closed by default and one at a time. The live page prints six long
          answers in full, which is the wall of copy this redesign is about;
          a question nobody asked costs a line here instead of a paragraph. */}
      <section style={{ padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{
          maxWidth: 1240, margin: "0 auto", display: "grid", gap: 40,
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", alignItems: "start",
        }}>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
            lineHeight: 1.25, margin: 0, maxWidth: 420,
          }}>
            Have a question?<br />Here are answers.
          </h2>

          <div style={{ display: "grid" }}>
            {FAQS.map(([q, a2]) => {
              const on = openQ === q;
              return (
                <div key={q} style={{ borderTop: `1px solid ${T.border}` }}>
                  <button
                    onClick={() => setOpenQ(on ? null : q)}
                    aria-expanded={on}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                      gap: 16, padding: "20px 0", background: "transparent", border: 0, cursor: "pointer",
                      font: "inherit", fontSize: TYPE.base, fontWeight: on ? 700 : 400, textAlign: "left",
                      color: T.textNeutral,
                    }}
                  >
                    {q}
                    <span className="ms turn" style={{ fontSize: 22, transform: on ? "rotate(180deg)" : "none" }}>
                      expand_more
                    </span>
                  </button>
                  {on && (
                    <p className="pop-in" style={{
                      margin: "0 0 20px", fontSize: TYPE.base, lineHeight: 1.7, color: T.textSubtle, maxWidth: 620,
                    }}>
                      {a2}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── The way out ──
          Comparison before commitment: the route is chosen here, so the step
          that acts on it belongs here too — once, at the end. Two actions,
          because there are two states to be in: you have picked the Instant
          Store and want the number, or you have not started the book yet. */}
      {/* The live page's closing band, read off it: a duotone gradient at 71°
          from #e2e8f0 through #f5f0ea, 120px of air above the heading and
          80px below, and a shallow arc across the top — the same shape the
          home hero cuts, mirrored. */}
      <section
        className="curve-cta"
        style={{
          background: "linear-gradient(71deg, #e2e8f0 -0.95%, #f5f0ea 45.34%, #e2e8f0 98.72%)",
          padding: "clamp(72px, 9vw, 120px) 24px clamp(56px, 7vw, 80px)",
          marginTop: 8,
        }}
      >
        <div style={{
          maxWidth: 1000, margin: "0 auto", textAlign: "center",
          display: "grid", gap: 16, justifyItems: "center",
        }}>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
            lineHeight: 1.25, margin: 0,
          }}>
            Ready to sell your book?
          </h2>
          <p style={{ margin: 0, fontSize: TYPE.lg, color: T.textSubtle, lineHeight: 1.6, maxWidth: 640 }}>
            {lean ? (
              <>Every one of them starts with a book, and the table above is how the four compare.</>
            ) : (
              <>
                Every one of them starts with a book. The Instant Store profit calculator prices an{" "}
                <strong style={{ color: T.textNeutral }}>Instant Store sale</strong>; for the other three,
                the table above is the comparison.
              </>
            )}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
            <Button onClick={() => onGo?.(lean ? "instantstore" : "margin")}>
              {lean ? "About Instant Stores" : "See what you would keep"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => onGo?.(lean ? "catalog" : "getstarted", lean ? null : { route: "sell" })}
            >
              {lean ? "Shop all products" : "Start a book to sell"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
