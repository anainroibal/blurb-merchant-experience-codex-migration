import React, { useState } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import { OptionCard, Divider } from "./Configurator.jsx";
import { Field, OptionGroup } from "./ProductOptions.jsx";
import CreateActions from "./CreateActions.jsx";
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

/* `seed` is a configuration arriving from somewhere else — the pricing
   summary sending someone here to read about the book they just priced.
   Opening on a different size than the one they were looking at would make
   the link feel like a reset rather than an explanation. */
export default function ProductPage({ onGo, seed = null }) {
  /* A specification can arrive from a screen that was not looking at an
     ImageWrap — the calculators offer "learn more about photo books" for any
     photo book. So the seed is repaired against this page's cover before it
     is used, rather than trusted into a combination the matrix cannot build
     and rendering "Not available" at someone. */
  const seeded = seed?.sel
    ? reconcile("photo", { ...seed.sel, cover: "imagewrap" }, "cover")
    : null;
  const formatId = "photo";
  const f = CATALOG[formatId];
  /* Options carry their own label, dims and spec — mk() copies them out of
     the size and paper dictionaries — so nothing here needs to reach past
     the catalog for a name. */
  const cover = "imagewrap";           /* the page IS the cover */

  const [size, setSize] = useState(seeded?.size ?? "square");
  const [paper, setPaper] = useState(seeded?.paper ?? "standard_paper");
  const [finish, setFinish] = useState("matte");
  const [pages, setPages] = useState(seeded?.pages ?? 20);
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

          {/* Size and paper go through the shared OptionGroup — the same
              component the calculators use, so a swatch cannot look like one
              thing here and another there. */}
          <OptionGroup
            label="Size"
            value={`${opt("size", size)?.label} (${sizeModifier(size) ?? "not available"})`}
            options={f.groups.find(g => g.id === "size").options}
            selected={size}
            onPick={changeSize}
            available={sizesOk}
            variant="thumb"
            modifier={sizeModifier}
            detailsOpen={details.has("size")}
            onDetails={() => toggleDetails("size")}
          />

          <Divider />

          <OptionGroup
            label="Paper"
            value={opt("paper", paper)?.label}
            options={f.groups.find(g => g.id === "paper").options}
            selected={paper}
            onPick={setPaper}
            available={papersOk}
            detailsOpen={details.has("paper")}
            onDetails={() => toggleDetails("paper")}
            footer={
              <p style={{ margin: "12px 0 0", fontSize: TYPE.sm }}>
                <span className="ms" style={{ fontSize: 16, color: T.bgBrand, verticalAlign: "-3px", marginRight: 6 }}>
                  palette
                </span>
                <span style={{ color: T.textBrand, fontWeight: 600, textDecoration: "underline" }}>{COPY.swatch}</span>
              </p>
            }
          />

          <Divider />

          <OptionGroup
            label="Cover finish"
            value={FINISHES.find(o => o.id === finish)?.label}
            options={FINISHES}
            selected={finish}
            onPick={setFinish}
          />

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
            {/* The shared create actions — same component the calculators
                use, so "Create online" cannot mean one thing here and
                another there. showLearnMore is off: this IS the product
                page. */}
            <CreateActions
              formatId={formatId}
              sel={{ cover, size, paper, pages }}
              onGo={onGo}
              showLearnMore={false}
            />

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
