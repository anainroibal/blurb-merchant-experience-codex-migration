import React, { useState } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import { OptionCard, Divider } from "./Configurator.jsx";
import { Field } from "./ProductOptions.jsx";
import {
  CATALOG, availableFor, reconcile, hasTool,
  unitPrice, perPagePrice, pageLimit, money,
} from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   /photo-books/imagewrap-hardcover-photo-book

   Captured 21 Aug, 1440×4364. A real PDP, and the closest thing on
   blurb.com to a configurator: size · paper · cover finish · starting
   page count, then "From $32.00 USD (20-page minimum, +US $0.26 for
   each additional page)" and Create now. Every price on it comes from
   the same matrix this prototype uses, which is why it can carry a
   doorway without any new plumbing.

   WHY THIS SCREEN IS HERE. It is the doorway page from the board's
   Products card: 🟡, Phase 1, no price change. Someone reading this
   page has told us a great deal — they want a hardcover photo book,
   this size, this paper — and if they intend to sell it, this is the
   last page that can say so before they start building. Today the page
   offers them nothing: the only selling words anywhere on it are the
   nav's "Sell & Self-Publish" and three retailer links in the footer.

   WHAT IT ADDS, and it is one line:

       Selling this? See your price →

   That is the whole intervention. It obeys the Phase 1 rule — the page
   stays retail-only, and no second number appears on it. The line is
   self-selecting: a maker reads "selling this?" and moves on, having
   lost nothing, while a seller recognises themselves. And it hands the
   CONFIGURATION over, not just the destination, so the estimator opens
   on the book they were looking at rather than an empty form.

   Sizes carry "+US $0.00"-style modifiers on the live page. They are
   computed here from the matrix instead of typed, so the modifier is
   always the real difference from the cheapest size — see the diff
   under each size chip.
   ──────────────────────────────────────────────────────────────── */

/* The live page's own copy, kept. */
const COPY = {
  breadcrumb: ["Home", "Photo Books", "ImageWrap Hardcover Photo Book"],
  title: "ImageWrap Hardcover Photo Book",
  promo: "Limited-time offer: 25% off",
  description:
    "With a matte or glossy finish, rich texture, and end sheet color options, these covers are made to captivate and crafted to last. Your image wraps seamlessly across the front, back, and spine, transforming your photography into an object.",
  recommended:
    "Photographers and families who want the picture on the cover rather than under a jacket — portfolios, travel books, and anything that will sit face-up on a table.",
  statement:
    "Image-wrapped. Matte or glossy finished. Made to transform every cover into a canvas.",
  swatch: "Order a free paper swatch kit.",
  pagesRemove: "Remove or add pages in our creation tools.",
  quote: "I had the ability to customize every detail of my photo book, from size to paper type, which allowed me to bring my vision to life exactly as I imagined it.",
  quoteBy: "Kelsey S.",
  pagesNote: ["20–440 pages with Standard paper", "20–240 pages with all other papers"],
};

/* "You may also like", with prices computed rather than typed. Each entry is
   a real configuration of a real product, so the number is derived the same
   way the main price is. */
const ALSO = [
  { label: "Linen Hardcover with Dust Jacket Photo Book", formatId: "photo", sel: { cover: "dustjacket", size: "square", paper: "standard_paper" } },
  { label: "Layflat Hardcover Photo Book",                formatId: "photo", sel: { cover: "imagewrap", size: "square", paper: "standard_layflat_paper" } },
  { label: "Softcover Photo Book",                        formatId: "photo", sel: { cover: "softcover", size: "small_square", paper: "premium_paper_lustre" } },
];

/* Cover finish is a real choice on this page and NOT a price variable — the
   matrix prices ImageWrap once, whatever the finish. So it is offered
   without a modifier, which is the honest way to show it. */
const PAGE_STARTS = [20, 30, 40, 50];

const FINISHES = [
  { id: "matte",  label: "Matte",  spec: "Soft, low-sheen surface" },
  { id: "glossy", label: "Glossy", spec: "High shine, stronger contrast" },
];

/* The creation tools, named as /getting-started's handoff names them so the
   two screens cannot describe the same tool differently. Which of them apply
   is decided by TOOLS in the catalog, not here — see hasTool.

   The online editor is called exactly that, here and in the handoff — it is
   the same tool as BookWright Online, and the product name earns nothing on
   a page where the alternative is called BookWright too.

   Every row is clickable, and where each one goes is the honest part. Two
   of them are prototyped here and start the build; the other two are pages
   on blurb.com, so they open there rather than pretending to be screens we
   have. `external` is what makes that visible before the click. */
const TOOL_PATHS = [
  /* No online-editor row. Create online IS the online editor, so listing it
     here would be the same door twice — and the second one, sitting under
     "other tools", reads as though it were something else. What the catalog
     still decides is whether that primary CTA is honest at all: hasTool
     (formatId, "online") is false for trade books and magazines, so a
     generalised version of this page has to relabel the button, not just
     filter this list. */
  { id: "bookwright", icon: "download", label: "BookWright for desktop",
    body: "Our free desktop app, for longer books and more control over layout.",
    external: "https://www.blurb.com/bookwright" },
  { id: "lightroom", icon: "photo_library", label: "Adobe Lightroom plug-in",
    body: "Already editing in Lightroom? Send a gallery straight into a book layout.",
    external: "https://www.blurb.com/lightroom" },
  { id: "indesign", icon: "article", label: "Adobe InDesign plug-in",
    body: "Lay it out in InDesign and export a Blurb-ready file.",
    external: "https://www.blurb.com/indesign-plugin" },
  { id: "pdf", icon: "upload_file", label: "Upload a print-ready PDF",
    body: "Finished it elsewhere? Bring the PDF and it is ready to order.",
    action: "build" },
];

/* One row of the tools list. A button when it starts something here, a link
   when it leaves for blurb.com — same shape either way, so the list reads as
   one set of choices rather than two. */
function ToolRow({ tool, onBuild }) {
  const inner = (
    <>
      <span className="ms" style={{ fontSize: 22, color: T.bgBrand, flex: "0 0 auto" }}>{tool.icon}</span>
      <span style={{ minWidth: 0, display: "grid", gap: 2 }}>
        <span style={{ fontSize: TYPE.base, fontWeight: 600, color: T.textBrand, display: "inline-flex", alignItems: "center", gap: 5 }}>
          {tool.label}
          <span className="ms" style={{ fontSize: 16 }}>
            {tool.external ? "open_in_new" : "arrow_forward"}
          </span>
        </span>
        <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.55 }}>{tool.body}</span>
      </span>
    </>
  );

  const style = {
    font: "inherit", textAlign: "left", textDecoration: "none", cursor: "pointer",
    background: T.bgNeutral, border: `1px solid ${T.border}`, borderRadius: R.md,
    padding: "12px 14px", display: "flex", gap: 12, alignItems: "flex-start", width: "100%",
  };

  return tool.external
    ? <a href={tool.external} target="_blank" rel="noreferrer" style={style}>{inner}</a>
    : <button onClick={onBuild} style={style}>{inner}</button>;
}

/* `seed` is a configuration arriving from somewhere else — the pricing
   summary sending someone here to read about the book they just priced.
   Opening on a different size than the one they were looking at would make
   the link feel like a reset rather than an explanation. */
export default function ProductPage({ onGo, seed = null }) {
  const formatId = "photo";
  const f = CATALOG[formatId];
  /* Options carry their own label, dims and spec — mk() copies them out of
     the size and paper dictionaries — so nothing here needs to reach past
     the catalog for a name. */
  const cover = "imagewrap";           /* the page IS the cover */

  const [size, setSize] = useState(seed?.sel?.size ?? "square");
  const [paper, setPaper] = useState(seed?.sel?.paper ?? "standard_paper");
  const [finish, setFinish] = useState("matte");
  const [pages, setPages] = useState(seed?.sel?.pages ?? 20);
  const [tab, setTab] = useState("description");
  const [toolsOpen, setToolsOpen] = useState(false);
  /* Which groups have their Details open. A set, because more than one can
     be, and closing one must not close the others. */
  const [details, setDetails] = useState(() => new Set());
  const toggleDetails = id => setDetails(d => {
    const next = new Set(d);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const sel = { cover, size, paper, pages, qty: 1, addons: [] };

  /* Changing size can withdraw a paper (there is no 5×5 layflat), so the
      selection is repaired the same way every other screen repairs it. */
  const changeSize = id => {
    const next = reconcile(formatId, { ...sel, size: id }, "size");
    setSize(next.size); setPaper(next.paper);
  };

  const base = unitPrice(formatId, sel);
  const perPage = perPagePrice(formatId, sel);
  const limit = pageLimit(formatId, sel);

  /* The cheapest ImageWrap, for the "+US $x.xx" size modifiers the live
     page shows. Computed, so it can never drift from the matrix. */
  const cheapest = Math.min(
    ...f.groups.find(g => g.id === "size").options
      .map(o => unitPrice(formatId, { cover, size: o.id, paper }))
      .filter(n => n != null)
  );

  const papersOk = availableFor(formatId, sel, "paper");
  const sizesOk = availableFor(formatId, sel, "size");

  const opt = (groupId, id) => f.groups.find(g => g.id === groupId).options.find(o => o.id === id);
  /* "Small Square (+US $0.00)" — the live page's own way of naming the
     current choice and what it adds. The modifier is computed, so it is the
     real difference from the cheapest size rather than a typed figure. */
  const sizeModifier = id => {
    const price = unitPrice(formatId, { cover, size: id, paper });
    if (price == null) return null;
    const diff = price - cheapest;
    return diff === 0 ? "+US $0.00" : `+${money(diff)}`;
  };

  return (
    <div style={{ fontFamily: FONT_BODY, color: T.textNeutral }}>

      {/* ── Breadcrumb ── */}
      <div style={{ borderBottom: `1px solid ${T.border}`, background: T.bgSubtle }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "10px 24px", fontSize: TYPE.sm, color: T.textSubtle }}>
          {COPY.breadcrumb.map((b, i) => (
            <span key={b}>
              {i > 0 && <span style={{ margin: "0 8px", color: C.gray400 }}>/</span>}
              <span style={{ color: i === COPY.breadcrumb.length - 1 ? T.textNeutral : T.textSubtle }}>{b}</span>
            </span>
          ))}
        </div>
      </div>

      <section
        style={{
          maxWidth: 1240, margin: "0 auto", padding: "clamp(24px, 4vw, 40px) 24px 0",
          display: "grid", gap: 40, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        }}
      >
        {/* ── Left: the image section ──
            The live page runs a column of photographs down the left: the
            product shot with its name captioned over the corner, then a
            customer quote beside an image, then an interior spread. They are
            placeholders here — the prototype ships no photography — but the
            SHAPE matters, because it is what makes the right-hand column
            scroll as far as it does. Leaving it out would have made the
            selections look shorter than they really are. */}
        <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
          <div style={{
            background: C.gray50, border: `1px solid ${T.border}`, borderRadius: R.lg,
            aspectRatio: "1 / 1", display: "grid", placeItems: "center", position: "relative",
          }}>
            <span className="ms" style={{ fontSize: 56, color: C.gray400 }}>photo_camera</span>
            <span style={{
              position: "absolute", left: 16, bottom: 16, background: T.bgNeutral,
              border: `1px solid ${T.border}`, borderRadius: R.sm, padding: "4px 10px",
              fontSize: TYPE.sm, color: T.textNeutral,
            }}>
              {COPY.title}
            </span>
          </div>

          {/* The quote block, image and words side by side as on the live page. */}
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr", alignItems: "stretch" }}>
            <div style={{
              background: C.gray50, border: `1px solid ${T.border}`, borderRadius: R.lg,
              minHeight: 180, display: "grid", placeItems: "center",
            }}>
              <span className="ms" style={{ fontSize: 32, color: C.gray400 }}>image</span>
            </div>
            <blockquote style={{ margin: 0, display: "grid", gap: 8, alignContent: "center" }}>
              <p style={{ margin: 0, fontSize: TYPE.base, lineHeight: 1.6, color: T.textNeutral }}>
                “{COPY.quote}”
              </p>
              <cite style={{ fontSize: TYPE.sm, fontStyle: "normal", fontWeight: 700 }}>{COPY.quoteBy}</cite>
            </blockquote>
          </div>

          <div style={{
            background: C.gray50, border: `1px solid ${T.border}`, borderRadius: R.lg,
            aspectRatio: "4 / 3", display: "grid", placeItems: "center",
          }}>
            <span className="ms" style={{ fontSize: 40, color: C.gray400 }}>auto_stories</span>
          </div>
        </div>

        {/* ── Right: the configurator ── */}
        <div style={{ display: "grid", gap: 24, alignContent: "start" }}>
          <div>
            <div style={{
              display: "inline-block", fontSize: TYPE.sm, fontWeight: 700, color: C.blue950,
              background: T.bgAccentSubtle, border: `1px solid ${C.blue100}`, borderRadius: 999, padding: "3px 10px",
            }}>
              {COPY.promo}
            </div>
            <h1 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 400, letterSpacing: "-0.01em",
              fontSize: "clamp(1.875rem, 4vw, 2.75rem)", lineHeight: 1.15, margin: "12px 0 0",
            }}>
              {COPY.title}
            </h1>
          </div>

          <div>
            <div style={{ display: "flex", gap: 18, borderBottom: `1px solid ${T.border}` }}>
              {[["description", "Description"], ["recommended", "Recommended for"]].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  style={{
                    font: "inherit", fontSize: TYPE.base, fontWeight: tab === id ? 700 : 500,
                    background: "transparent", border: 0, cursor: "pointer", padding: "0 0 8px",
                    color: tab === id ? T.textNeutral : T.textSubtle,
                    borderBottom: `2px solid ${tab === id ? T.bgBrand : "transparent"}`,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <p style={{ margin: "12px 0 0", fontSize: TYPE.base, lineHeight: 1.6, color: T.textSubtle }}>
              {tab === "description" ? COPY.description : COPY.recommended}
            </p>
          </div>

          <Field
            label="Size"
            value={`${opt("size", size)?.label} (${sizeModifier(size) ?? "not available"})`}
            detailsOpen={details.has("size")}
            onDetails={() => toggleDetails("size")}
          >
            {/* An even grid rather than a flex row of fixed widths: the cards
                stretch to fill the column, so the sixth size wraps into line
                with the first instead of leaving a ragged gap. */}
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))" }}>
              {f.groups.find(g => g.id === "size").options.map(o => (
                <OptionCard
                  key={o.id}
                  variant="thumb"
                  title={o.dims.split(" (")[0]}
                  sub={details.has("size") ? o.label : null}
                  note={details.has("size") ? sizeModifier(o.id) : null}
                  selected={o.id === size}
                  disabled={!sizesOk.has(o.id)}
                  onClick={() => changeSize(o.id)}
                />
              ))}
            </div>
          </Field>

          <Divider />

          <Field
            label="Paper"
            value={opt("paper", paper)?.label}
            detailsOpen={details.has("paper")}
            onDetails={() => toggleDetails("paper")}
          >
            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
              {f.groups.find(g => g.id === "paper").options.map(o => (
                <OptionCard
                  key={o.id}
                  variant="text"
                  title={o.label}
                  spec={details.has("paper") ? o.spec : null}
                  selected={o.id === paper}
                  disabled={!papersOk.has(o.id)}
                  onClick={() => setPaper(o.id)}
                />
              ))}
            </div>
            <p style={{ margin: "12px 0 0", fontSize: TYPE.sm }}>
              <span className="ms" style={{ fontSize: 16, color: T.bgBrand, verticalAlign: "-3px", marginRight: 6 }}>
                palette
              </span>
              <span style={{ color: T.textBrand, fontWeight: 600, textDecoration: "underline" }}>{COPY.swatch}</span>
            </p>
          </Field>

          <Divider />

          <Field label="Cover finish" value={FINISHES.find(o => o.id === finish)?.label}>
            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
              {FINISHES.map(o => (
                <OptionCard
                  key={o.id}
                  variant="text"
                  title={o.label}
                  selected={o.id === finish}
                  onClick={() => setFinish(o.id)}
                />
              ))}
            </div>
          </Field>

          <Divider />

          {/* Four starting page counts, as the live page offers them — the
              creation tools are where pages are really added, so this only
              has to set a starting point. The tiles are the same OptionCard
              as everything else, and the ceiling is still the paper's: any
              value the paper cannot take is refused rather than shown. */}
          <Field label="Starting page count" note={[COPY.pagesRemove, ...COPY.pagesNote].join(" · ")}>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
              {PAGE_STARTS.map(n => (
                <OptionCard
                  key={n}
                  variant="text"
                  title={String(n)}
                  selected={n === pages}
                  disabled={n > limit}
                  onClick={() => setPages(n)}
                />
              ))}
            </div>
          </Field>

          {/* ── The price. Retail, per copy, exactly as the live page frames
                it: a from-price plus the per-page rate. No seller number. ── */}
          <Divider />
          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["7xl"], fontWeight: 500, lineHeight: 1.1 }}>
              {base == null ? "Not available" : `From ${money(base + Math.max(0, pages - f.basePages) * perPage)}`}
            </div>
            <div style={{ fontSize: TYPE.sm, color: T.textSubtle }}>
              {pages}-page minimum, +{money(perPage)} for each additional page
            </div>
            {/* ── The two calls to action ──
                The live page offers Create now, Download BookWright and
                Explore design tools, which is one decision wearing three
                buttons. It is really a fork: start in the browser now, or
                find out what else can make this book.

                So: one primary that begins the thing, and one that opens the
                tools rather than sending anyone off to read about them. The
                list comes from TOOLS in the catalog, filtered to this product
                — which is the only source that knows a photo book can be made
                online and a trade book cannot. Nothing here is invented per
                page, so it cannot drift from the matrix. */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 10 }}>
              <button
                onClick={() => onGo("getstarted", { seed: { formatId, sel: { cover, size, paper, pages } } })}
                style={{
                  font: "inherit", fontSize: TYPE.lg, fontWeight: 600, minHeight: 48, padding: "0 26px",
                  borderRadius: R.md, background: T.bgBrand, color: T.textInverse, border: 0, cursor: "pointer",
                }}
              >
                Create online
              </button>
              <button
                onClick={() => setToolsOpen(o => !o)}
                aria-expanded={toolsOpen}
                style={{
                  font: "inherit", fontSize: TYPE.lg, fontWeight: 600, minHeight: 48, padding: "0 20px",
                  borderRadius: R.md, background: "transparent", color: T.textBrand,
                  border: `1px solid ${T.borderBrand}`, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}
              >
                See other tools
                <span className="ms turn" style={{ fontSize: 20, transform: toolsOpen ? "rotate(180deg)" : "none" }}>
                  expand_more
                </span>
              </button>
            </div>

            {toolsOpen && (
              <div
                className="pop-in"
                style={{
                  marginTop: 4, border: `1px solid ${T.border}`, borderRadius: R.lg,
                  padding: 16, display: "grid", gap: 14, background: T.bgSubtle,
                }}
              >
                {TOOL_PATHS.filter(t => hasTool(formatId, t.id)).map(t => (
                  <ToolRow
                    key={t.id}
                    tool={t}
                    onBuild={() => onGo("getstarted", { seed: { formatId, sel: { cover, size, paper, pages } } })}
                  />
                ))}
                <div style={{ fontSize: TYPE.sm, color: T.textSubtle }}>
                  Every one of these makes the book on this page, and the price above does not change with the
                  tool you pick.
                </div>
              </div>
            )}

            {/* THE DOORWAY.
                Under the two real calls to action, deliberately quieter than
                both: body-size text, no panel, no icon, no border. It has to
                be findable by someone who intends to sell and ignorable by
                everyone else — a maker who reads "selling this?" and moves on
                has lost nothing, and nothing here competes with Create now.

                Worth knowing the cost of this placement: the configurator is
                long, so this line sits around 1560px down at 1440 wide —
                below the fold, exactly like the live page's own Create now.
                A seller who never scrolls to the price never meets the door.
                That is the trade for keeping it quiet, and it is the thing to
                watch if the doorway does not earn its clicks.

                It carries the CONFIGURATION, not just the destination, so the
                estimator opens on this book rather than an empty form. */}
            <div style={{ marginTop: 14, fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.6 }}>
              Selling this?{" "}
              <button
                onClick={() => onGo("margin", { seed: { formatId, sel: { cover, size, paper, pages } } })}
                style={{
                  font: "inherit", fontWeight: 600, color: T.textBrand, textDecoration: "underline",
                  background: "transparent", border: 0, padding: 0, cursor: "pointer",
                }}
              >
                See your price
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Statement band ── */}
      <section style={{ marginTop: "clamp(40px, 6vw, 64px)", background: T.bgAccentSubtle, borderTop: `1px solid ${C.blue100}`, borderBottom: `1px solid ${C.blue100}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(36px, 5vw, 56px) 24px", textAlign: "center" }}>
          <p style={{
            margin: 0, fontFamily: FONT_DISPLAY, fontWeight: 400,
            fontSize: "clamp(1.5rem, 3vw, 2.125rem)", lineHeight: 1.25,
          }}>
            {COPY.statement}
          </p>
        </div>
      </section>

      {/* ── You may also like — computed prices ── */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(40px, 6vw, 56px) 24px 64px" }}>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: "clamp(1.5rem, 3vw, 2rem)", margin: "0 0 20px" }}>
          You may also like
        </h2>
        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {ALSO.map(a => {
            const price = unitPrice(a.formatId, a.sel);
            return (
              <div key={a.label} style={{ border: `1px solid ${T.border}`, borderRadius: R.lg, overflow: "hidden" }}>
                <div style={{ background: C.gray50, height: 120, borderBottom: `1px solid ${T.border}` }} />
                <div style={{ padding: 16, display: "grid", gap: 6 }}>
                  <div style={{ fontSize: TYPE.base, fontWeight: 600, lineHeight: 1.35 }}>{a.label}</div>
                  <div style={{ fontSize: TYPE.sm, color: T.textSubtle }}>
                    {price == null ? "Price on request" : `Starting at ${money(price)}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
