import React from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import { sellableSentence } from "./catalog.js";
import InstantStoreLane from "./InstantStoreLane.jsx";
import Alert from "./Alert.jsx";
import Faq from "./Faq.jsx";

/* ────────────────────────────────────────────────────────────────
   The Instant Store landing page.

   ── This was a placeholder until 2026-08-28 ──
   It stood in because Crometrics owns the live page and a prototype
   that guessed at it would become somebody else's spec by accident.
   What changed is that there is now a second placeholder to work from:
   the Figma Make POC (260824 POC — Instant Store LP), which was written
   against a brief and carries the argument this project had not made
   anywhere. Anain's call (2026-08-28) is to build it here rather than
   leave a link pointing at an apology.

   OWNERSHIP HAS NOT CHANGED. Crometrics still builds the live page, and
   design review item 24 — whether our version stays a design or becomes
   reference handed over — is still open. This is the reference.

   ── What is taken from the POC, and what is not ──
   Taken: the differentiator, which is the best thing in it. The link
   opens a REAL PRODUCT PAGE — preview, description, bio, the seller's
   other work — not a payment box. Also the three steps, the fulfilment
   band, and "works anywhere a link goes" said in places rather than in
   the abstract.

   Not taken, and each for a reason:

     · "Earn more per sale than anywhere else" and "no platform cut —
       ever". Unsourced comparative claims, the same class as
       Crometrics' "Blurb keeps 0% of your revenue", and "ever" is a
       forward commitment nobody in the room can make.
     · The POC's worked figures. They contradict each other — $22.40 is
       the print cost in one section and the seller's profit in another,
       and $22.40 + $25.60 does not make the $35 sale it sits under. The
       ladder here carries $X, which is honest about being a shape
       rather than a sum (Anain, 2026-08-28), and the calculator is one
       click away for the real one.
     · The AI description writer. That is the walled-off side project.
     · "A whole store in one link", which overclaims in exactly the way
       the POC's own brief warns against.

   ── And one thing the POC leaves out ──
   The proof requirement. A seller can set a store up and share it, but
   nobody can buy until a proof exists — and a landing page that never
   says so sends people into a surprise. It is on the page, in Codex's
   Alert L, which is the component that was built for it.

   ── Components ──
   Nothing here is a new pattern. The hero is the gradient one /pricing,
   /bookmaking-tools and the Sell page share; the proof notice is Codex's
   Alert L; the fulfilment band is the Codex split panel already used as
   the Instant Store lane; the questions are the shared Faq. The icon
   grid is the Sell page's "Why choose Blurb?" treatment.

   NO RETAIL PRICE ANYWHERE ON THIS PAGE, and no fulfilment figure beside
   one. The margin is explained by the change of role, as everywhere else.
   ──────────────────────────────────────────────────────────────── */

/* ── What the link OPENS, which is the argument ──
   Four proofs and a photograph of the thing itself. The POC is right
   that this is what separates an Instant Store from a payment link, and
   right to give it the weight: everything else on this page is true of
   any competitor.

   ── SHOW IT, do not assert it (2026-08-28) ──
   These were Material Symbols, which is the wrong instinct on the one
   section whose whole claim is "the page is real". An icon of a book is
   a drawing of a promise; the buyer's page is the evidence. The images
   are the POC's own screens of blurb.com/c/36690 — the store page
   entire, then the four parts of it a seller is being sold on.

   They are screenshots of a BUYER's page, so the $32.00 in them is the
   seller's own asking price as their buyer sees it. That is not the
   pairing this project forbids: there is no fulfilment figure anywhere
   near it, and the ladder on this page stays at $X. */
const PRODUCT_PAGE = [
  ["/assets/store-preview.png",
   "Book preview, open at a spread, with page 1 of 15 below it and a fullscreen control.",
   "A look inside before they buy",
   "An interactive preview turns real pages, so a buyer sees the book rather than trusting a thumbnail."],
  ["/assets/store-author.png",
   "An “About the author” panel with a portrait, a biography, and links to a website, Facebook, Instagram, X, TikTok and Substack.",
   "They meet you first",
   "Your photo, your bio and your links sit on every page you sell from."],
  ["/assets/store-more-from.png",
   "A “More from Paige Hazelwood” row of three other books, each with its cover, title, first line and starting price.",
   "Your other work, on every page",
   "“More from you” appears automatically, so one sale is a way into everything else you have made."],
  ["/assets/store-buy.png",
   "A price, a quantity stepper, Buy now and Add to cart buttons, and the accepted payment marks.",
   "No account for your buyer",
   "They buy and go. Nothing to sign up for, which is one fewer reason to leave."],
];

/* ── The three steps ──
   The POC's, in its order, because the order is right: the project
   exists before the price, and the price before the link. */
const STEPS = [
  ["Pick a project", "Anything already in your Blurb account, or something you make today."],
  ["Set your price", "You choose what your buyer pays. Your cost is what we charge to print that book."],
  ["Share your link", "In a bio, a newsletter, a talk, a stall — or behind a button on a site you already have."],
];

export default function InstantStorePage({ onGo, lean = false }) {
  /* Written from the catalogue rather than typed, so a product leaving
     the channel rewrites this sentence too. It arrives sentence-cased,
     which is why nothing here capitalises it again. */
  const sellable = sellableSentence("checkout_link");

  const primaryBtn = {
    fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 700, minHeight: 44, padding: "0 24px",
    borderRadius: R.md, border: 0, cursor: "pointer", whiteSpace: "nowrap",
    background: T.bgBrand, color: T.textInverse,
    display: "inline-flex", alignItems: "center",
  };
  const quietBtn = {
    ...primaryBtn, fontWeight: 600,
    background: "#fff", color: T.textBrand, border: `1px solid ${T.borderBrand}`,
  };

  return (
    <div style={{ fontFamily: FONT_BODY, color: C.gray950 }}>

      {/* ── Hero ── the gradient the seller pages share. */}
      <section style={{
        background: "linear-gradient(100deg, #e9ecef 0%, #f6f3ef 45%, #ebebeb 100%)",
        padding: "clamp(56px, 8vw, 96px) 24px",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", display: "grid", gap: 20, justifyItems: "center" }}>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, letterSpacing: "-0.01em",
            fontSize: "clamp(2rem, 4.6vw, 2.75rem)", lineHeight: 1.2, margin: 0,
          }}>
            Sell your work with a link.<br />No store to build.
          </h1>

          {/* "Keep more" is the POC's phrase and it survives, because it
              is a direction rather than a comparison — unlike "earn more
              than anywhere else", which needs a source we do not have. */}
          <p style={{ fontSize: TYPE.xl, lineHeight: 1.55, color: T.textNeutral, margin: 0, maxWidth: 640 }}>
            Turn any project into a page people can buy from, and share it anywhere. We print, pack and
            ship every order. You set the price, and what is left after your printing cost is yours.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button style={primaryBtn}>Create your Instant Store</button>
            {!lean && (
              <button style={quietBtn} onClick={() => onGo?.("margin")}>See what you would keep</button>
            )}
          </div>

          <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle }}>
            Free to create. No listing fees. Works with the projects already in your account.
          </p>
        </div>
      </section>

      {/* ── The statement ──
          The POC's one device: a muted lead-in running straight into the
          answer. It earns its size because it is the only place the whole
          idea is said in one breath. */}
      <section style={{ padding: "clamp(56px, 7vw, 88px) 24px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <p style={{
            fontFamily: FONT_DISPLAY, fontWeight: 400, margin: 0,
            fontSize: "clamp(1.75rem, 3.8vw, 2.75rem)", lineHeight: 1.22, letterSpacing: "-0.01em",
          }}>
            <span style={{ color: T.textSubtle }}>What is an Instant Store? </span>
            <span>One link that turns a project into a page people can buy from. Share it anywhere, and
            we print, ship and take the payment. Nothing to build, and no code.</span>
          </p>
        </div>
      </section>

      {/* ── The differentiator ──
          The Sell page's icon grid, because this is the same job: several
          parallel things, one line each, scanned rather than read. */}
      <section style={{ background: C.gray50, padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 40 }}>
          <div style={{ display: "grid", gap: 10, maxWidth: 720 }}>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
              lineHeight: 1.25, margin: 0,
            }}>
              More than a checkout
            </h2>
            <p style={{ margin: 0, fontSize: TYPE.xl, lineHeight: 1.55, color: T.textNeutral }}>
              A payment link takes the money. Your link opens the whole book — and the person who made it.
            </p>
          </div>

          {/* The whole page first, at the size it deserves — it is the
              claim, and everything under it is a detail of this. */}
          <figure style={{ margin: 0, display: "grid", gap: 12, justifyItems: "center" }}>
            <img
              src="/assets/store-page.png"
              alt="An Instant Store page at blurb.com: the book's cover beside its title, author, description, cover and dedication options, a $32.00 price, a quantity stepper and Buy now, with a badge reading Printed and shipped by Blurb."
              loading="lazy"
              style={{
                width: "100%", maxWidth: 760, height: "auto", display: "block",
                borderRadius: R.lg,
              }}
            />
            <figcaption style={{ fontSize: TYPE.sm, color: T.textSubtle, textAlign: "center" }}>
              What your link opens. Your buyer never leaves this page.
            </figcaption>
          </figure>

          {/* Then the four parts of it, each with the part itself beside
              the claim. Two across rather than four: these are screens
              with type in them, and a quarter of 1240 is too narrow to
              read one. */}
          <div style={{
            display: "grid", gap: 40,
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
          }}>
            {PRODUCT_PAGE.map(([img, alt, title, body]) => (
              <div key={title} style={{ display: "grid", gap: 16, alignContent: "start" }}>
                <img
                  src={img}
                  alt={alt}
                  loading="lazy"
                  style={{
                    width: "100%", height: "auto", display: "block",
                    borderRadius: R.lg, border: `1px solid ${T.border}`, background: "#fff",
                  }}
                />
                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 500, lineHeight: 1.2 }}>
                    {title}
                  </div>
                  <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.6, color: T.textSubtle }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Three steps, and the shape of the money ── */}
      <section style={{ padding: "clamp(56px, 7vw, 80px) 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 40 }}>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
            lineHeight: 1.25, margin: 0,
          }}>
            Set up in minutes, not days
          </h2>

          <div style={{ display: "grid", gap: 32, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {STEPS.map(([title, body], i) => (
              <div key={title} style={{ display: "grid", gap: 12, alignContent: "start" }}>
                <span style={{
                  fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 500, lineHeight: 1, color: C.blue600,
                }}>
                  {i + 1}
                </span>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 500, lineHeight: 1.2 }}>
                  {title}
                </div>
                <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.6, color: T.textSubtle }}>{body}</p>
              </div>
            ))}
          </div>

          {/* ── The ladder, as a SHAPE ──
              $X on purpose. The POC printed worked figures and they did
              not agree with each other; any number here would be invented
              anyway, and a made-up sum on a marketing page gets quoted.
              What a reader needs from this block is the arithmetic — that
              profit is what is left, and that nothing else is taken off —
              and the calculator does it properly one click away. */}
          <div style={{
            border: `1px solid ${T.border}`, borderRadius: R.lg, padding: 24,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              {[
                ["Your cost", "$X", "What we charge to print it"],
                ["Your price", "$X", "You set this"],
                ["Your profit", "$X", "What is left, and it is yours"],
              ].map(([label, figure, hint], i) => (
                <React.Fragment key={label}>
                  {i > 0 && (
                    <span className="ms" aria-hidden style={{ fontSize: 24, color: T.textSubtle }}>arrow_forward</span>
                  )}
                  <div style={{ display: "grid", gap: 2 }}>
                    <div style={{ fontSize: TYPE.sm, fontWeight: 700, color: T.textSubtle }}>{label}</div>
                    <div style={{
                      fontFamily: FONT_DISPLAY, fontSize: "1.75rem", fontWeight: 500, lineHeight: 1.1,
                      color: i === 2 ? C.blue600 : C.gray950,
                    }}>
                      {figure}
                    </div>
                    <div style={{ fontSize: TYPE.sm, color: T.textSubtle }}>{hint}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {!lean && (
              <button style={quietBtn} onClick={() => onGo?.("margin")}>Put your book's numbers in</button>
            )}
          </div>

          {/* Why the seller pays less than a shopper does — the change of
              role, never the two prices. */}
          <p style={{ margin: 0, maxWidth: 720, fontSize: TYPE.base, lineHeight: 1.65, color: T.textNeutral }}>
            Buying a copy for yourself makes you our customer. Selling one makes us your printer: you bring
            the buyer, you do the promoting, and you keep what a shop would otherwise have been paid for it.
          </p>
        </div>
      </section>

      {/* ── Fulfilment ── the Codex split panel, already in use as the lane. */}
      <section style={{ padding: "0 24px clamp(56px, 7vw, 80px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <InstantStoreLane
            title="Printed, packed and shipped on every order"
            cta="Printing and delivery times"
            onGo={() => onGo?.("shipping")}
          >
            Every order goes straight to print and ships to your buyer with tracking. No stock to buy up
            front, no boxes to pack, no carrier account to open — and your buyer pays the delivery, so it
            never comes out of what you keep.
          </InstantStoreLane>
        </div>
      </section>

      {/* ── Two rules a seller meets whether or not we mention them ── */}
      <section style={{ padding: "0 24px clamp(56px, 7vw, 80px)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "grid", gap: 16 }}>
          {/* Codex Alert L, Info. The proof requirement is state — it
              clears itself the moment a proof exists — which is the one
              thing on this page an alert is the right component for. */}
          <Alert
            type="info"
            title="See it before your buyers do"
            action={lean ? undefined : "Price a proof copy"}
            onAction={lean ? undefined : () => onGo?.("pricing")}
          >
            You can set your store up and share the link straight away. Buyers cannot order until you have
            approved a copy yourself — a PDF proof or a discounted printed one, either is enough. Until
            then the page says the book is coming soon.
          </Alert>

          <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.65, color: T.textNeutral }}>
            <strong style={{ fontWeight: 700 }}>What you can sell.</strong>{" "}
            {sellable} can be sold from an Instant Store. A PDF
            cannot — an Instant Store sells a printed book.
          </p>
        </div>
      </section>

      <Faq
        heading={<>Before you<br />set one up</>}
        items={[
          ["What does it cost to have one?",
           "Nothing to create, nothing to keep open, and no listing fee. You pay us to print each copy as it sells, out of what your buyer paid you."],
          ["Where can I share the link?",
           "Anywhere a link goes — a social bio, a newsletter, a talk, a QR code on a stall — or behind a button on a site you already run. There is no code to add."],
          ["Do my buyers need a Blurb account?",
           "No. They open the page, buy, and we ship it to them."],
          ["Can I sell more than one book?",
           "Yes. Each project you sell gets its own link, and every one of those pages carries your bio and the rest of your work."],
          ["How is this different from the Bookstore, Amazon or Ingram?",
           "Here you bring the buyer and you set the price, so what is left after your printing cost is yours. On the other three the channel brings the buyer, and prices accordingly. The Sell page compares all four."],
        ]}
      />

      {/* ── Close ── */}
      <section style={{ background: C.gray50, padding: "clamp(56px, 7vw, 88px) 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", display: "grid", gap: 20, justifyItems: "center" }}>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
            lineHeight: 1.25, margin: 0,
          }}>
            Made with Blurb.<br />Sold with your Instant Store.
          </h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button style={primaryBtn}>Create your Instant Store</button>
            <button style={quietBtn} onClick={() => onGo?.("seller")}>Compare every way to sell</button>
          </div>
        </div>
      </section>
    </div>
  );
}
