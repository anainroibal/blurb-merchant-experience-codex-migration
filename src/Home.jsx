import React, { useState } from "react";
import { Button, Input, Tabs } from "@blurb/codex-react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import { CATALOG, fromPrice, money } from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   blurb.com — the home page, rebuilt to match

   Captured 24 Aug 2026 at 1440 wide, from the live page rather than from
   a screenshot: every measurement below was read off the rendered DOM.
   The values that shape it:

     container   1280, section padding 80px
     h1          futura-pt 80/96, weight 400, centred
     h2          futura-pt 44/52.8, weight 500
     card title  futura-pt 32/38.4, weight 400
     column head futura-pt 24/28.8, weight 600
     body        proxima-nova 16/24, #292929; tab body 18/25.2, #4a5565
     primary     #107eb1, white, 8px 24px, radius 4 (= our C.blue600)
     subtle text #464646, card cream #f5f0ea, image ground #f2f1ef
     hero        background 1440×577 under the nav, book image 846×423
                 straddling its lower edge

   Photography and copy are Blurb's own, served from assets.blurb.com.

   WHAT WE CHANGE, and nothing else:

     1. The hero's action goes to /getting-started. On the live page
        "Get started" opens /formats, a product grid; the header's Start
        Project opens a registration form. Neither answers "what will
        this cost me" — that page does.
     2. The closing band asks for a project, not an account. Pricing
        follows the order, not the user.
     3. The four product cards compute their from-price from the matrix.
        On 21 Aug the live page typed $4.99 for a trade book, /pricing
        typed $3.99 and the matrix said $2.99 — ticket T7, on screen.
     4. THE SELLING TAB CARRIES THE INSTANT STORE. It is the live page's
        own selling surface, it already opens /self-publish, and it is
        the only place on the page where a seller is being spoken to —
        so the new channel belongs in that copy rather than in a band of
        its own. Its first sentence is the Instant Store; the tab opens
        selected. Nothing else about the section moves.

   NOT REBUILT: the "Shop our most popular products" strip. It is a
   client-rendered recommendation widget — it did not even render on two
   of three captures — and every product in it appears in the grid
   below, there with a from-price computed from the matrix.

   PHASE 1 RULE, held: no second price on this page. The home page stays
   retail-only, which is what protects makers. The Instant Store copy is
   a doorway — no margin, no fulfilment price, no arithmetic. Everything
   a seller needs to see a number lives behind it.
   ──────────────────────────────────────────────────────────────── */

const IMG = "https://assets.blurb.com/_astro/";

/* Read off the live page. Keeping the hashed filenames means these are
   the same files the site serves, not lookalikes. */
const HERO_BG = IMG + "hero-background-011226.BPI44Cje_vnf7f.webp";
const HERO_ART = IMG + "hero-image-011226.DnTBrpcB_Zp8W1e.webp";

const CREAM = "#f5f0ea";   // --color-light-foam-100
const SUBTLE = "#464646";  // --color-blurb-text-subtle
const GROUND = "#f2f1ef";  // the image ground on a card

const PAGE = { maxWidth: 1280, margin: "0 auto" };
const section = { padding: "80px", width: "100%" };

/* Their words, kept. This screen argues about structure and
   destinations, not about the writing. */
const HERO = {
  title: "Your story starts here",
  sub: "Create. Print. Sell. Share. Blurb specializes in custom books and book printing services for photographers, businesses, and creative storytellers alike.",
};

const PRODUCTS = [
  { id: "photo", title: "Photo Books", img: IMG + "photo-books.OjYWWhTA.png",
    body: "From high-end photography albums to keepsake family books, photo books are our most premium format with multiple trim sizes and paper types." },
  { id: "trade", title: "Paperback & Hardcover", img: IMG + "paperbacks-hardcovers.D5Abrnqy.png",
    body: "Ideal for books that combine art with text or just text alone like portfolios, cookbooks, novels, children’s books and the like" },
  { id: "magazine", title: "Magazines", img: IMG + "magazines.C_7iBsxM.png",
    body: "Great for a series or one-off custom projects. Impressive newsstand quality and easy distribution." },
  { id: "notebook", title: "Notebooks & Journals", img: IMG + "notebooks-journals.DLSuzQlP.png",
    body: "Choose from blank, lined, square, or dot-grid notebook pages, plus easily add photos or illustrations within the pages." },
];

/* The live tab set, its images, its destinations. Only the Selling copy
   is ours — see change 4 above. `lead` is set in bold, which is how the
   new thing gets to be the first thing read without the section growing
   a badge or a second heading. */
const TABS = [
  {
    id: "create", label: "Book creation", img: IMG + "hp-book-creation.7hSxeBZk_1qKVwM.webp",
    body: "Design online or use our free desktop software. We also integrate with several Adobe products.",
    cta: "Explore free tools", href: "https://build.blurb.com/create",
  },
  {
    id: "print", label: "Printing", img: IMG + "hp-printing.DiLqSDVo_ZqlQ0R.webp",
    body: "On-demand printing lets you print the quantity you need whether that’s one book or hundreds. We handle all shipping and distribution, too.",
    cta: "Start your book", stage: "getstarted",  // remapped in lean, see `start`
  },
  {
    id: "sell", label: "Selling", img: IMG + "hp-selling.Bihm600K_YtSAD.webp",
    lead: "New: sell it yourself with an Instant Store.",
    body: "Share one link and we print and ship every order — you set the price, so what you make on a copy is yours to decide. Or set your books up for sale on the Blurb Bookstore, or with Amazon or Ingram, all through one convenient dashboard.",
    cta: "Learn more", stage: "seller",
  },
  {
    id: "business", label: "Business services", img: IMG + "hp-business-service-en.CJfmvcxF_Z1NQUYC.webp",
    body: "Customized support, API tools, bulk discounts, and all your print needs fulfilled. Plus, quick quotes and consultations.",
    cta: "Explore services", href: "https://www.blurb.com/large-order-services",
  },
];

/* Their four columns, their words. The live page draws a 48px outline
   illustration above each; ours are the nearest Material Symbol at the
   same size and the same blue, because the drawings are assets rather
   than an argument. */
const DIFFERENCE = [
  ["star", "Professional bookstore-grade quality",
   "Versatile formats and sizes, luxe paper options, and three unique cover types all printed and shipped in-house."],
  ["menu_book", "Trusted printing partner",
   "Backed by 20 years of in-house expertise and full production control, Blurb ensures consistent quality from start to finish. No outsourcing, no compromises."],
  ["eco", "Sustainable papers & practices",
   "Our photo books are crafted in the US with Forest Stewardship Council-certified papers and printed at the facility nearest you, reducing emissions and supporting sustainable publishing."],
  ["architecture", "Complete creative control",
   "Choose between our free bookmaking software with flexible templates and page layouts or our plugins that work with Adobe programs."],
];

const EXAMPLES = [
  { title: "Branding at its best", img: IMG + "building-better-brands.CM3hOj_b_Z1WFOiV.webp",
    body: "Already in its second edition, this author put his 30 years of brand consultancy knowledge into a 6x9-inch paperback under US $3.99",
    creator: "Mid-size business, agency", by: "Scott Lerman,", work: "Building Better Brands",
    tool: "Blurb plugin for Adobe InDesign", format: "Paperback", paper: "Standard Color" },
  { title: "A travel treasure", img: IMG + "door.BJehDc6f_Rcewj.webp",
    body: "A layflat book was the go-to format for this travel photographer wanting a coffee-table worthy piece that commanded attention.",
    creator: "Photographer, self-published author", by: "Adam C. Stuart,", work: "Europe in One-Way Tickets",
    tool: "Blurb plugin for Adobe InDesign", format: "Layflat", paper: "Premium Lustre" },
  { title: "Refueling print", img: IMG + "Refueled-1.DqQj5T3k_2f327w.webp",
    body: "With 32 Blurb-made publications, this artist-publisher used his magazines as a canvas to feature the people and culture that drive his work.",
    creator: "Artist, publisher, entrepreneur", by: "Chris Brown,", work: "Refueled Magazine",
    tool: "Blurb plugin for Adobe InDesign", format: "Magazine", paper: null },
];

const FAQS = [
  "What book formats can I create with Blurb?",
  "How do I create my own book with Blurb?",
  "How do I self-publish a book with Blurb?",
  "How much does it cost to self-publish a book?",
  "How long does it take to produce and ship my book?",
  "Does Blurb offer volume pricing?",
];

/* Their button: 16/24, 8px 24px, 4px radius, #107eb1. */
function H2({ children, center, style }) {
  return (
    <h2 style={{
      fontFamily: FONT_DISPLAY, fontSize: TYPE["9xl"], fontWeight: 500, lineHeight: 1.2,
      margin: 0, color: C.gray950, textAlign: center ? "center" : "left",
      maxWidth: center ? "none" : 640, ...style,
    }}>
      {children}
    </h2>
  );
}

export default function Home({ onGo, lean }) {
  /* In the minimum-effort scope /getting-started is untouched, so it is not
     a screen this prototype can hand over to. The catalogue is: it exists on
     the live site, it is where "start something" actually begins today, and
     the lean version changes it anyway. */
  const start = lean ? "catalog" : "getstarted";
  /* Selling opens first here. On the live page Book creation does, which is
     the right production default; this prototype is about the seller, and
     the Instant Store is the thing being shown. */
  const [tab, setTab] = useState("sell");
  const active = TABS.find(t => t.id === tab);

  return (
    <div style={{ fontFamily: FONT_BODY, color: C.gray950 }}>

      {/* ── Hero ──
          Background 1440×577 hard against the nav, the text stack centred
          on it, and the book photograph straddling its lower edge — which
          is why the image is in normal flow with a negative offset rather
          than absolutely placed: it has to push the section's own height. */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={HERO_BG}
          alt=""
          aria-hidden
          /* The live page's own cut: #hero-clip, an SVG clip path in
             objectBoundingBox units, copied from blurb.com into index.html.
             A border-radius approximation was close at 1440 and wrong at
             every other height, because a percentage radius scales with the
             box while the real curve's control points do not. */
          className="curve-hero"
          style={{
            position: "absolute", inset: "0 0 auto", width: "100%", height: 577,
            objectFit: "cover",
          }}
        />
        <div style={{
          position: "relative", ...PAGE, padding: "40px 24px 0",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 32,
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
            <h1 style={{
              fontFamily: FONT_DISPLAY, fontSize: TYPE["12xl"], fontWeight: 400, lineHeight: 1.2,
              margin: 0, color: C.gray950, maxWidth: 720,
            }}>
              {HERO.title}
            </h1>
            <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.5, color: C.gray950, maxWidth: 550 }}>
              {HERO.sub}
            </p>
          </div>

          {/* Live: /formats. Ours: the page that prices what you pick. */}
          <Button onClick={() => onGo(start)}>Get started</Button>

          <img
            src={HERO_ART}
            alt="An open photo book and a softcover book of Vespa photography from Rome."
            style={{ display: "block", width: 846, maxWidth: "100%", height: "auto", marginTop: 4 }}
          />
        </div>
      </section>

      {/* ── Products ──
          Two columns of 628×700 cards. Each card is one of Blurb's own
          product photographs filling it, the name and the from-price laid
          over the top, and a cream band across the foot for the
          description. Only the price is ours. */}
      <section style={section}>
        <div style={{ ...PAGE, display: "grid", gap: 48 }}>
          <H2>Books and other products for every creative expression</H2>

          {/* Two columns, as the live grid is — 628px each at 1280 with a
              24px gutter. The minimum is what keeps it two rather than
              three: a third column would need 1464px. */}
          <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))" }}>
            {PRODUCTS.map(p => {
              const from = fromPrice(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => onGo(p.id === "photo" ? "product" : "getstarted", { seed: { formatId: p.id } })}
                  style={{
                    position: "relative", overflow: "hidden", borderRadius: R.lg, border: 0, padding: 0,
                    background: GROUND, cursor: "pointer", font: "inherit", textAlign: "left",
                    height: 700, display: "block", width: "100%",
                  }}
                >
                  <img
                    src={p.img}
                    alt={`${CATALOG[p.id].label} from Blurb`}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <span style={{
                    position: "relative", height: "100%", display: "flex", flexDirection: "column",
                    justifyContent: "space-between",
                  }}>
                    <span style={{ display: "flex", flexDirection: "column", gap: 12, padding: 40 }}>
                      <span style={{
                        fontFamily: FONT_DISPLAY, fontSize: TYPE["5xl"], fontWeight: 400, lineHeight: 1.2,
                        color: C.gray950,
                      }}>
                        {p.title}
                      </span>
                      <span style={{ fontSize: TYPE.base, fontWeight: 700, color: SUBTLE }}>
                        {from == null ? "Price on request" : `Starting from ${money(from)}`}
                      </span>
                    </span>
                    <span style={{ background: CREAM, padding: 40 }}>
                      <span style={{ display: "block", fontSize: TYPE.base, lineHeight: 1.5, color: SUBTLE }}>
                        {p.body}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Tools and resources ──
          The live tabs, and the Selling one is where the Instant Store is
          introduced: same section, same image, same button, one bold
          sentence at the front of the copy. */}
      <section style={section}>
        <div style={{ ...PAGE, display: "grid", gap: 40, justifyItems: "center" }}>
          <H2 center>Tools and resources for makers, sellers, and businesses</H2>

          <Tabs
            aria-label="Tools and resources"
            items={TABS.map(t => ({ value: t.id, label: t.label }))}
            value={tab}
            onValueChange={setTab}
          />

          <p style={{
            margin: 0, maxWidth: 672, textAlign: "center",
            fontSize: TYPE.lg, lineHeight: 1.4, color: "#4a5565",
          }}>
            {active.lead && <strong style={{ color: C.gray950 }}>{active.lead} </strong>}
            {active.body}
          </p>

          {active.stage
            ? <Button onClick={() => onGo(active.stage === "getstarted" ? start : active.stage)}>{active.cta}</Button>
            : <Button as="a" href={active.href} target="_blank">{active.cta}</Button>}

          <img
            key={active.id}
            className="fade-in"
            src={active.img}
            alt={`${active.label} at Blurb`}
            style={{ display: "block", width: "100%", height: "auto", borderRadius: R.lg }}
          />
        </div>
      </section>

      {/* ── The Blurb Difference ── their section, their words. */}
      <section style={section}>
        <div style={{ ...PAGE, display: "grid", gap: 48 }}>
          <H2>The Blurb Difference</H2>
          <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {DIFFERENCE.map(([icon, title, body]) => (
              <div key={title} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <span className="ms" style={{ fontSize: 48, color: C.blue600, lineHeight: 1 }}>{icon}</span>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 600, lineHeight: 1.2 }}>
                  {title}
                </div>
                <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.5 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The email band ──
          Live furniture, kept for fidelity and inert here: nothing submits
          and nothing is stored. Its photograph is the live page's own
          (email-capture-desktop), which is why the copy sits in the left
          third — that is where the image leaves room. */}
      <section style={{
        backgroundImage: `url(${IMG}email-capture-desktop.DFnncEC6_1DTtcA.png)`,
        backgroundSize: "cover", backgroundPosition: "center",
      }}>
        <div style={{ ...PAGE, padding: "80px", display: "grid", gap: 24, maxWidth: 1440 }}>
          <div style={{ maxWidth: 600, display: "grid", gap: 12 }}>
            <H2 style={{ color: "#fff" }}>Want 30% off? Sign up and save on your first book.</H2>
          </div>
          <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
            {/* Codex's Input label always renders in --codex-color-semantic-text-bold
                (dark) — right against a white field, wrong against this section's
                photo. So the visible label stays ours, white, and the Input gets
                an aria-label instead of its own. */}
            <label htmlFor="home-email" style={{ fontSize: TYPE.sm, fontWeight: 700, color: "#fff" }}>
              Email Address
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 300px", minWidth: 0 }}>
                <Input id="home-email" type="email" />
              </div>
              <Button>Join us</Button>
            </div>
            <p style={{ margin: 0, fontSize: TYPE.sm, color: "#fff", lineHeight: 1.5 }}>
              By continuing, you agree to our <span style={{ textDecoration: "underline" }}>Terms of Service</span>{" "}
              and <span style={{ textDecoration: "underline" }}>Privacy Policy</span>.
            </p>
          </div>
        </div>
      </section>

      {/* ── Inspiring examples ── */}
      <section style={section}>
        <div style={{ ...PAGE, display: "grid", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <H2>Inspiring examples made with Blurb</H2>
            <Button onClick={() => onGo(start)}>Start a project</Button>
          </div>

          <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {EXAMPLES.map(e => (
              <div key={e.title} style={{ display: "grid", gap: 16, alignContent: "start" }}>
                <div style={{
                  background: GROUND, borderRadius: R.lg, height: 320,
                  display: "grid", placeItems: "center", overflow: "hidden",
                }}>
                  <img src={e.img} alt={e.work} style={{ maxHeight: 320, maxWidth: "70%", objectFit: "contain" }} />
                </div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["5xl"], fontWeight: 400, lineHeight: 1.2 }}>
                  {e.title}
                </div>
                <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.5 }}>{e.body}</p>
                <dl style={{ margin: 0, display: "grid", gap: 8, fontSize: TYPE.base, lineHeight: 1.5 }}>
                  <div><strong>Creator type:</strong><div>{e.creator}</div></div>
                  <div>{e.by} <span style={{ color: C.blue600, textDecoration: "underline" }}>{e.work}</span></div>
                  <div><strong>Tool:</strong><div>{e.tool}</div></div>
                  <div><strong>Format:</strong><div>{e.format}</div></div>
                  {e.paper && <div><strong>Paper:</strong><div>{e.paper}</div></div>}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Questions ──
          Their heading break — "Have questions?" over "Get answers." — and
          their six questions, closed. The answers are on the live page; a
          prototype that opened them would be inventing support copy. */}
      <section style={section}>
        <div style={{ ...PAGE, display: "grid", gap: 40, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          <H2>Have questions?<br />Get answers.</H2>
          <div style={{ display: "grid" }}>
            {FAQS.map(q => (
              <div key={q} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                padding: "20px 0", borderTop: `1px solid ${C.gray200}`, fontSize: TYPE.base,
              }}>
                {q}
                <span className="ms" style={{ fontSize: 22, color: C.gray950 }}>expand_more</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing band ──
          Live: "Ready to get started? / Create your account". An account is
          not what a visitor came for, and asking for one here is the
          identity gate the audit argues against — pricing follows the
          order, not the user. So it closes on the project, and log-in waits
          until there is something to save, which is where
          /getting-started puts it. */}
      <section style={{ ...section, paddingTop: 40 }}>
        <div style={{ ...PAGE, display: "grid", gap: 24, justifyItems: "center", textAlign: "center" }}>
          <H2 center>Ready to get started?</H2>
          <Button onClick={() => onGo(start)}>Start your project</Button>
        </div>
      </section>
    </div>
  );
}
