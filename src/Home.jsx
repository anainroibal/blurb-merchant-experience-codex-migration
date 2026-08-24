import React, { useState } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";
import { FormatRow } from "./FormatCards.jsx";

/* ────────────────────────────────────────────────────────────────
   blurb.com — the home page, with a lane to /getting-started

   Captured 21 Aug, 1440×6896. The live page in order: hero ("Your
   story starts here" · "Create. Print. Sell. Share.") → four product
   cards with typed from-prices → "Tools and resources for makers,
   sellers, and businesses" as four tabs → The Blurb Difference →
   an email capture → inspiring examples → "Ready to get started?".

   WHY THIS SCREEN EXISTS. Three links on that page point at starting
   something, and they go three different places:

     · the hero's "Get started"     → /formats, a product grid
     · the header's "Start Project" → /my/account/register
     · "Start a project"            → /getting-started

   Only the third one reaches the page that asks what you are making
   and prices it, and it sits inside a case-study carousel two thirds
   of the way down. So the most valuable page in this whole flow is
   reachable from the home page by its least visible link, and the two
   prominent doors lead to a grid and to a registration form.

   WHAT CHANGES HERE, and nothing else does:

     1. The hero's primary action goes to /getting-started. A product
        grid cannot answer "what will this cost me"; that page can.
     2. Registration stops being a door. Pricing follows the order, not
        the user — so the closing band asks for a project, not an
        account. You make one when you order.
     3. The fork is named, once, directly under the hero. Making and
        selling want different pages, and today a seller has to guess
        that "Sell & Self-Publish" in the nav is for them.
     4. The product cards compute their from-prices from the matrix
        instead of typing them. See fromPrice() — on 21 Aug this page
        typed $4.99 for a trade book, /pricing typed $3.99, and the
        matrix says $2.99. That is ticket T7, visible here.

   BACK IN v2, 2026-08-24, with three changes forced by what v2 dropped:
   /pdf-to-book is not in this build, so the hero's second prompt is the
   pricing calculator; ways-to-sell became the seller page; and the NEW /
   CHANGED marks are gone from the whole prototype, so nothing here wears
   one. The four product cards are now the shared product card — the same
   component and the same photographs as /pricing and /getting-started —
   rather than a title over a grey band.

   AND ONE ADDITION: a lane for the Instant Store. It is the new selling
   channel and the only one where the seller sets the price, so it is the
   one thing on this page a visitor could not have found last month. It is
   still a DOORWAY: no margin, no fulfilment price, no arithmetic.

   PHASE 1 RULE, held: no second price on this page. The home page
   stays retail-only, which is what protects makers. The selling lane
   is a doorway — a line of copy and a destination, no margin, no
   fulfilment price, no arithmetic. Everything a seller needs to see a
   number lives behind it.
   ──────────────────────────────────────────────────────────────── */

/* Their copy, kept. The hero line and the four Difference columns are
   Blurb's own words from the live page — this screen argues about
   structure and destinations, not about the writing. */
const HERO = {
  title: "Your story starts here",
  sub: "Create. Print. Sell. Share. Blurb specializes in custom books and book printing services for photographers, businesses, and creative storytellers alike.",
};

const DIFFERENCE = [
  ["auto_awesome", "Professional bookstore-grade quality",
   "Versatile formats and sizes, luxe paper options, and three unique cover types all printed and shipped in-house."],
  ["menu_book", "Trusted printing partner",
   "Backed by 20 years of in-house expertise and full production control, Blurb ensures consistent quality from start to finish. No outsourcing, no compromises."],
  ["eco", "Sustainable papers & practices",
   "Photo books are crafted in the US with Forest Stewardship Council-certified papers, printed at the facility nearest you."],
  ["architecture", "Complete creative control",
   "Choose between our free bookmaking software with flexible templates and page layouts, or our plugins that work with Adobe programs."],
];

/* The four families the live page shows, in its order. Their descriptions
   are not repeated here — they live on the card, with the photograph and the
   from-price. */
const PRODUCT_IDS = ["photo", "trade", "magazine", "notebook"];

/* The live "Tools and resources" tabs, with their real destinations. The
   Selling tab is where the Instant Store belongs: it is the only tab whose
   audience has already decided to sell, and today it offers them the
   retail channels and no way to see what they would keep. */
const TABS = [
  {
    id: "create", label: "Book creation",
    body: "Design online, or use our free desktop software. We also integrate with several Adobe products.",
    actions: [["Explore free tools", null]],
  },
  {
    id: "print", label: "Printing",
    body: "One copy or a thousand. Print on demand for a single book, or a bulk quote when you need a run.",
    actions: [["See prices", "pricing"]],
  },
  {
    id: "sell", label: "Selling",
    body: "Sell from your own Instant Store, or list the book where readers are already browsing. Four routes, and they work differently — the comparison is the point.",
    actions: [["Compare the ways to sell", "seller"], ["Work out what you keep", "margin"]],
  },
  {
    id: "business", label: "Business services",
    body: "Connect your own storefront through the API, or hand a large order to a team that quotes it for you.",
    actions: [["Large orders and API printing", null]],
  },
];

function Btn({ children, onClick, tone = "brand", size = "lg" }) {
  const brand = tone === "brand";
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: FONT_BODY, fontSize: size === "lg" ? TYPE.lg : TYPE.base, fontWeight: 600,
        minHeight: size === "lg" ? 48 : BUTTON_HEIGHT, padding: size === "lg" ? "0 26px" : "0 18px",
        borderRadius: R.md, cursor: "pointer",
        background: brand ? T.bgBrand : "transparent",
        color: brand ? T.textInverse : T.textBrand,
        border: brand ? "1px solid transparent" : `1px solid ${T.borderBrand}`,
      }}
    >
      {children}
    </button>
  );
}

/* A quiet inline link, for the sideways moves that must not compete with
   the primary action on the same card. */
function GoLink({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        font: "inherit", fontWeight: 600, color: T.textBrand, background: "transparent",
        border: 0, padding: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4,
      }}
    >
      {children}
      <span className="ms" style={{ fontSize: 18 }}>arrow_forward</span>
    </button>
  );
}

function SectionHeading({ children, center = true }) {
  return (
    <h2
      style={{
        fontFamily: FONT_DISPLAY, fontWeight: 400, letterSpacing: "-0.01em",
        fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)", lineHeight: 1.18,
        margin: "0 0 8px", textAlign: center ? "center" : "left",
      }}
    >
      {children}
    </h2>
  );
}

export default function Home({ onGo }) {
  const [tab, setTab] = useState("sell");
  const active = TABS.find(t => t.id === tab);

  return (
    <div style={{ fontFamily: FONT_BODY, color: T.textNeutral }}>

      {/* ── Hero ──
          The image collage on the live page is a photograph of books; it
          carries no argument, so it is a tinted band here rather than a
          borrowed asset. */}
      <section style={{ background: T.bgAccentSubtle, borderBottom: `1px solid ${C.blue100}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(48px, 7vw, 88px) 24px", textAlign: "center" }}>
          <h1
            style={{
              fontFamily: FONT_DISPLAY, fontWeight: 400, letterSpacing: "-0.01em",
              fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1.1, margin: 0,
            }}
          >
            {HERO.title}
          </h1>
          <p style={{ fontSize: TYPE.lg, lineHeight: 1.6, color: T.textSubtle, margin: "16px auto 28px", maxWidth: 620 }}>
            {HERO.sub}
          </p>
          {/* ── Two prompts, and they are the site's two real jobs ──
              Create for people with an idea, Print for people with a file.
              That is a genuine fork — the second group has already made the
              book and needs specifications and an upload, not a product
              chooser — so it earns two buttons where "Start your project"
              beside "See what it costs" did not: those were one intent and
              a hedge about price.

              Create opens /getting-started, where the options and the tools
              that make them live. Print pointed at /pdf-to-book, which is
              not in this build, so it goes to the pricing calculator — the
              other page that prices a real specification, and the one that
              answers "what would this cost to print?" without a project. */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={() => onGo("getstarted")}>Create</Btn>
            <Btn tone="ghost" onClick={() => onGo("pricing")}>See prices</Btn>
          </div>
          <p style={{ fontSize: TYPE.sm, color: T.textSubtle, margin: "16px 0 0" }}>
            Start from an idea and we will help you make it, or price a book you have already planned.
          </p>
          {/* No reassurance line under the hero. "You only need an account
              when you order" answers a worry nobody has arrived with yet —
              it puts registration in a visitor's head at the exact moment
              the page is trying to get them started. The point still holds;
              it is made by the closing band asking for a project instead of
              an account, and by never gating a price. */}
        </div>
      </section>

      {/* ── The fork ──
          Two doors, named for what happens behind them rather than for who
          the visitor is. "Create" and "Sell" are the two jobs this site
          does, and a heading asking where to START says the choice is not
          binding — you can come back and do the other one.

          They are weighted the same on purpose. Selling is the newer road,
          but highlighting it would answer the question the section asks, and
          it would tell a maker — most of the traffic — that they picked the
          lesser option. No figure appears on either: these are doors, not
          calculators. */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "clamp(40px, 6vw, 64px) 24px 8px" }}>
        <SectionHeading>Where do you want to start?</SectionHeading>
        <p style={{ textAlign: "center", fontSize: TYPE.base, color: T.textSubtle, margin: "0 auto 28px", maxWidth: 620 }}>
          Both roads lead to prices and product options. They just start from different questions.
        </p>

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>

          <div style={{ border: `1px solid ${T.border}`, borderRadius: R.lg, padding: 24, display: "grid", gap: 12, alignContent: "start" }}>
            <span className="ms" style={{ fontSize: 30, color: T.bgBrand }}>auto_stories</span>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["5xl"], fontWeight: 500, lineHeight: 1.15 }}>
              Create
            </div>
            <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.6, color: T.textSubtle }}>
              Pick your product and the tool you want to make it in, see what a copy costs, and start
              building.
            </p>
            <div style={{ marginTop: 4 }}>
              <Btn size="md" onClick={() => onGo("getstarted", { route: "keep" })}>Get started</Btn>
            </div>
          </div>

          <div style={{ border: `1px solid ${T.border}`, borderRadius: R.lg, padding: 24, display: "grid", gap: 12, alignContent: "start" }}>
            <span className="ms" style={{ fontSize: 30, color: T.bgBrand }}>sell</span>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["5xl"], fontWeight: 500, lineHeight: 1.15 }}>
              Sell
            </div>
            <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.6, color: T.textSubtle }}>
              See the ways to sell a book, what each one asks of you, and what you would keep on a sale.
            </p>
            {/* One action per card, matched to the other one.
                "Start a book to sell" used to sit under this button, and the
                two were the same intent pointing at two pages — so the card
                asked the visitor to choose a page before they had anything to
                choose between, and split its own clickthrough doing it.
                Committing to a book belongs AFTER the comparison, which is
                where it now lives: at the foot of the ways-to-sell page. */}
            <div style={{ marginTop: 4 }}>
              <Btn size="md" onClick={() => onGo("seller")}>See my selling options</Btn>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Instant Store lane ──
          The one genuinely new thing on this page, and the reason the fork
          above is not enough on its own: "Sell" has been a door on
          blurb.com for years and it has always meant the same thing — list
          your book somewhere Blurb runs and take what is left. The Instant
          Store is different in the one way a seller cares about: they set
          the price, so the margin is theirs to decide.

          It sits under the fork rather than inside it. Making it a third
          card would have made three doors where there are two jobs, and
          weighting it over "Sell" would answer the question that section
          asks. A band underneath can introduce something without competing
          with the choice above it.

          NO FIGURES. The phase-1 rule holds here more than anywhere: this
          is the page that protects retail pricing, so the lane says what
          the channel IS and hands over. Cost, price and profit live behind
          it, on the estimator, where a real specification exists. Saying
          "keep more" with no number is also the honest version — what a
          seller keeps depends on the book, which is exactly the estimator's
          argument. */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "clamp(28px, 4vw, 40px) 24px 0" }}>
        <div style={{
          background: T.bgAccentSubtle, border: `1px solid ${C.blue100}`, borderRadius: R.lg,
          padding: "clamp(20px, 3vw, 28px)", display: "grid", gap: 14,
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{
              padding: "3px 10px", borderRadius: 999, background: C.blue600, color: "#fff",
              fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
            }}>
              New
            </span>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["5xl"], fontWeight: 500, lineHeight: 1.15, color: C.blue950 }}>
              Sell it yourself with an Instant Store
            </span>
          </span>

          <p style={{ margin: 0, fontSize: TYPE.lg, lineHeight: 1.6, color: T.textNeutral, maxWidth: 760 }}>
            Share one link — in a newsletter, a bio, a talk, a stall — and we print and ship every order.
            You set the price, so what you make on a copy is yours to decide, and there is nothing to run:
            no shop, no stock, no listing fees.
          </p>

          <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.6, color: T.textSubtle, maxWidth: 760 }}>
            It is the only route where the price is yours. Because you bring the buyer, you are paying us
            to print rather than to sell — so the margin the shop would have taken stays with you. The
            estimator shows what that comes to for your book.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 2 }}>
            <Btn size="md" onClick={() => onGo("margin")}>See what you would keep</Btn>
            <Btn size="md" tone="ghost" onClick={() => onGo("seller")}>Compare all four routes</Btn>
          </div>
        </div>
      </section>

      {/* ── Products ──
          Same four families as the live page, in its order, but the card is
          the shared product card (FormatCards.jsx) — the same photographs,
          the same "6 sizes - From US $12.00" line computed from the matrix,
          and the same selection geometry as /pricing and /getting-started.
          A home page that shows a different card for the same product
          teaches the visitor that they are different things.

          Wall art is not on the live home page and is not added here; this
          screen is not the place to argue for a fifth card. */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(40px, 6vw, 64px) 24px 0" }}>
        <SectionHeading>Books and other products for every creative expression</SectionHeading>
        <p style={{ textAlign: "center", fontSize: TYPE.sm, color: T.textSubtle, margin: "0 auto 28px" }}>
          From-prices computed from the price matrix, per copy, at the format's minimum page count.
          Photo books open their product page, as they do on the live site.
        </p>

        <FormatRow
          ids={PRODUCT_IDS}
          formatId={null}
          /* The card carries the product through as a seed, which is what
             every other handover in this prototype uses — `{format}` was a
             v1 shape nothing reads any more, so the destination opened on
             its default product instead of the one that was clicked. */
          onPick={id => onGo(id === "photo" ? "product" : "getstarted", { seed: { formatId: id } })}
        />
      </section>

      {/* ── Tools and resources ──
          The live tab set, kept. Selling is the default tab here because
          this prototype is about the seller; on the live page Book
          creation opens first, and that is the right production default. */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "clamp(48px, 7vw, 72px) 24px 0" }}>
        <SectionHeading>Tools and resources for makers, sellers, and businesses</SectionHeading>

        <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap", margin: "20px 0 0" }}>
          {TABS.map(t => {
            const on = t.id === tab;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                aria-pressed={on}
                style={{
                  font: "inherit", fontSize: TYPE.base, fontWeight: on ? 700 : 500, cursor: "pointer",
                  padding: "8px 14px", background: on ? T.bgAccentSubtle : "transparent",
                  color: on ? T.textBrand : T.textSubtle,
                  border: 0, borderBottom: `2px solid ${on ? T.bgBrand : "transparent"}`,
                  borderRadius: `${R.sm}px ${R.sm}px 0 0`,
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            border: `1px solid ${T.border}`, borderRadius: R.lg, padding: 24, marginTop: 16,
            display: "grid", gap: 14, justifyItems: "center", textAlign: "center",
          }}
        >
          <div style={{ fontSize: TYPE.lg, fontWeight: 600 }}>{active.label}</div>
          <p style={{ margin: 0, maxWidth: 640, fontSize: TYPE.base, lineHeight: 1.6, color: T.textSubtle }}>
            {active.body}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
            {active.actions.map(([label, target], i) =>
              target
                ? <GoLink key={label} onClick={() => onGo(target)}>{label}</GoLink>
                : (
                  <span key={label} style={{ fontSize: TYPE.base, color: T.textSubtle }}>
                    {label} <span style={{ fontSize: TYPE.sm }}>(not prototyped)</span>
                  </span>
                )
            )}
          </div>
        </div>
      </section>

      {/* ── The Blurb Difference ── their section, unchanged. */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(48px, 7vw, 72px) 24px 0" }}>
        <SectionHeading center={false}>The Blurb Difference</SectionHeading>
        <div style={{ display: "grid", gap: 28, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginTop: 24 }}>
          {DIFFERENCE.map(([icon, title, body]) => (
            <div key={title} style={{ display: "grid", gap: 8, alignContent: "start" }}>
              <span className="ms" style={{ fontSize: 26, color: T.bgBrand }}>{icon}</span>
              <div style={{ fontSize: TYPE.lg, fontWeight: 700, lineHeight: 1.3 }}>{title}</div>
              <p style={{ margin: 0, fontSize: TYPE.sm, lineHeight: 1.6, color: T.textSubtle }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Closing band ──
          The live page closes on "Ready to get started? Create your
          account". An account is not what a visitor came for, and asking
          for one here is the identity gate the audit argues against:
          pricing follows the order, not the user. So it closes on the
          project instead, and log-in waits until there is something to
          save — which is exactly where /getting-started puts it. */}
      <section style={{ marginTop: "clamp(48px, 7vw, 72px)", background: T.bgSubtle, borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "clamp(40px, 6vw, 64px) 24px", textAlign: "center" }}>
          <SectionHeading>Ready to get started?</SectionHeading>
          <p style={{ fontSize: TYPE.base, color: T.textSubtle, margin: "8px auto 24px", maxWidth: 560 }}>
            Pick what you are making and see the price. Nothing to sign up for until you order.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={() => onGo("getstarted")}>Start your project</Btn>
            <Btn tone="ghost" onClick={() => onGo("getstarted", { route: "sell" })}>I want to sell one</Btn>
          </div>
        </div>
      </section>
    </div>
  );
}
