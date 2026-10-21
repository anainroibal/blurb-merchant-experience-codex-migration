import React, { useState } from "react";
import { Button, Modal, ModalContent, ModalClose, Breadcrumbs } from "@blurb/codex-react";
import { CloseIcon } from "@blurb/codex-react/icons";
import PriceModal from "./PriceModal.jsx";
import { CatalogBrowser } from "./CatalogOptions.jsx";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import { variantFromPrice, money , sellableSentence } from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   blurb.com/formats — Shop All Products

   Rebuilt from the live page, measured at 1440 rather than eyeballed:

     container   1280, section padding 0 80px 80px
     grid        3 × 411px, 24px column gap, 48px row gap
     card        square image, radius 8, object-cover
                 → eyebrow  14/19.6 #464646
                 → name     futura-pt 24/28.8, weight 600
                 → price    16/24 bold #464646
     h1          futura-pt 44/52.8, weight 400, centred

   Photography and product names are Blurb's own, served from
   assets.blurb.com. The live page's holiday promo tile and bar were removed
   (it ended 2026-10-15); in git history if a later offer needs them.

   TWO CHANGES, both the ones this project always makes:

     1. THE PRICES COMPUTE. Every "starting at" is variantFromPrice() —
        the matrix minimum for that cover — not a typed string. Four of
        them disagree with the live page, which is ticket T7 on screen:
        paperback $2.99 against $3.99, ImageWrap hardcover $12.99 against
        $13.99, linen hardcover $14.99 against $15.99, layflat $58.00
        against $60.00. Where the matrix holds nothing — the Swatch Kit —
        the card says so instead of inventing a number.

     2. A SELLING LANE AFTER THE GRID. Someone reading a catalogue is
        choosing a product, and every product on it can be sold; nothing
        on this page says so today. It sits AFTER the products rather
        than above them, because it is a second question, and it carries
        no figures — this is a retail page, and the margin lives behind
        the door, on the estimator.
   ──────────────────────────────────────────────────────────────── */

const IMG = "https://assets.blurb.com/_astro/";
const CREAM = "#f5f0ea";

/* The live catalogue, in its order. `price` is computed from the matrix by
   cover; `flat` is for the products the matrix does not carry. */
const PRODUCTS = [
  { cat: "Photo Book", name: "ImageWrap Hardcover Photo Book", format: "photo", cover: "imagewrap",
    img: IMG + "Photo Book - ImageWrap Hardcover-optimized.CTrmtmNl.webp", stage: "product" },
  { cat: "Photo Book", name: "Softcover Photo Book", format: "photo", cover: "softcover",
    img: IMG + "Photo Book - Softcover-optimized.NBFf1uEv.webp" },
  { cat: "Photo Book", name: "Layflat Photo Book", format: "photo", paperTest: id => id.includes("layflat"),
    img: IMG + "Photo Book - Layflat-optimized.CbG-E1cX.webp" },
  { cat: "Photo Book", name: "Hardcover Linen Photo Book with Dust Jacket", format: "photo", cover: "dustjacket",
    img: IMG + "Photo Book - Linen Hardcover with Dust Jacket-optimized.BSAV8Bpp.webp" },
  { cat: "Paperback & Hardcover Books", name: "Paperback Book", format: "trade", cover: "softcover",
    img: IMG + "Paperback and Hardcover Books - Paperback-optimized.CxLk4w5d.webp" },
  { cat: "Paperback & Hardcover Books", name: "ImageWrap Hardcover Book", format: "trade", cover: "imagewrap",
    img: IMG + "Paperback and Hardcover Books - ImageWrap Hardcover-optimized.D1sLnZ4y.webp" },
  { cat: "Paperback & Hardcover Books", name: "Linen Hardcover Book with Dust Jacket", format: "trade", cover: "dustjacket",
    img: IMG + "Paperback and Hardcover Books - Linen Hardcover with Dust Jacket-optimized.B8G8lKem.webp" },
  { cat: "Magazine", name: "Semi-gloss cover Magazine", format: "magazine",
    img: IMG + "Premium Magazine-optimized.CZWdhbpt.webp" },
  { cat: "Notebooks & Journals", name: "Softcover Notebook", format: "notebook", cover: "softcover",
    img: IMG + "Notebooks _ Journals - Softcover Notebook-optimized.BGO38hhS.webp" },
  { cat: "Notebooks & Journals", name: "ImageWrap Hardcover Notebook", format: "notebook", cover: "imagewrap",
    img: IMG + "Notebooks _ Journals - ImageWrap Hardcover Notebook-optimized.CkYI1UOa.webp" },
  { cat: "Notebooks & Journals", name: "Linen Hardcover Notebook with Dust Jacket", format: "notebook", cover: "dustjacket",
    img: IMG + "Notebooks _ Journals - Linen Hardcover with Dust Jacket Notebook-optimized.YP00RKbC.webp" },
  { cat: "Notebooks & Journals", name: "Wire-O Notebook", format: "notebook", cover: "softcover_wireo",
    img: IMG + "Notebooks _ Journals - Wire-O Notebook-optimized.CHz4jhym.webp" },
  /* The live card says "Starting at US $0.00", which is a placeholder
     showing through. Ours says what it is. */
  { cat: "Swatch Kit", name: "Swatch Kit", note: "Free — papers and covers to hold",
    img: IMG + "Swatch-Kit.FIDQju5I.png" },
];

const SUBTLE = "#464646";

/* Where a product opens: its own page where we have one, otherwise /getting-started
   with the product seeded, and in the lean scope (that page untouched) nowhere. The
   card and the compare table's "View product" share it. */
const openTarget = (item, lean) => item.stage ?? (lean ? null : "getstarted");
const openProduct = (item, onGo, lean) => {
  const to = openTarget(item, lean);
  if (to) onGo?.(to, { seed: { formatId: item.format, sel: item.cover ? { cover: item.cover } : undefined } });
};

function Card({ item, onGo, lean }) {
  const price = item.format
    ? variantFromPrice(item.format, { cover: item.cover, paperTest: item.paperTest })
    : null;

  return (
    <button
      className="shopall-card"
      /* A card opens its product page where we have one; otherwise it opens
         /getting-started with the product seeded — and in the lean scope,
         where that page is untouched, it stays on the catalogue. */
      onClick={() => openProduct(item, onGo, lean)}
      style={{
        display: "flex", flexDirection: "column", gap: 16, minWidth: 0, textAlign: "left",
        background: "transparent", border: 0, padding: 0, font: "inherit", cursor: "pointer",
      }}
    >
      <span style={{
        display: "block", width: "100%", aspectRatio: "1 / 1",
        borderRadius: R.lg, overflow: "hidden", background: CREAM,
      }}>
        <img
          src={item.img}
          alt={item.name}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </span>

      <span style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: TYPE.sm, lineHeight: 1.4, color: SUBTLE }}>{item.cat}</span>
        <span style={{
          fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 600, lineHeight: 1.2, color: C.gray950,
        }}>
          {item.name}
        </span>
        <span style={{ fontSize: TYPE.base, fontWeight: 700, color: SUBTLE, lineHeight: 1.5 }}>
          {price != null ? `Starting at ${money(price)}` : item.note ?? "Price on request"}
        </span>
      </span>
    </button>
  );
}

/* Hovering or focusing a card zooms its photo a little inside the same square,
   which is the cue that the card is something you can open. Off for anyone who
   prefers reduced motion. */
const CARD_ZOOM_CSS = `
  .shopall-card img { transition: transform 400ms cubic-bezier(.2,.7,.2,1); will-change: transform; }
  .shopall-card:hover img, .shopall-card:focus-visible img { transform: scale(1.08); }
  @media (prefers-reduced-motion: reduce) { .shopall-card img { transition: none; } .shopall-card:hover img, .shopall-card:focus-visible img { transform: none; } }
`;

export default function ProductCatalog({ onGo, lean }) {
  /* The live page opens a modal here rather than leaving for the
     calculator, and that is the right shape: someone asking what moves a
     price has not finished choosing a product. */
  const [priceOpen, setPriceOpen] = useState(false);

  return (
    <div style={{ fontFamily: FONT_BODY, color: C.gray950 }}>
      <style>{CARD_ZOOM_CSS}</style>
      <PriceModal open={priceOpen} onClose={() => setPriceOpen(false)} onGo={onGo} />
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* ── Breadcrumb, heading, and the price link ── the live page's */}
          <div style={{ display: "grid", gap: 12, justifyItems: "center", padding: "40px 0 32px", textAlign: "center" }}>
            <Breadcrumbs variant="bare" items={[{ label: "Home", href: "/?stage=home&version=full" }, { label: "Shop All", href: "#" }]} />

            <h1 style={{
              fontFamily: FONT_DISPLAY, fontSize: TYPE["9xl"], fontWeight: 400, lineHeight: 1.2,
              margin: 0, color: C.gray950,
            }}>
              Shop All Products
            </h1>

            {/* The live link: brand blue #107eb1 at 16/500, and the rule under
                the WORDS only — the icon sits outside it. Underlining the
                whole control put a line under the ⓘ, which reads as a typo
                rather than a link. */}
            <button
              onClick={() => setPriceOpen(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 4, font: "inherit",
                fontSize: TYPE.base, fontWeight: 500, color: C.blue600,
                background: "transparent", border: 0, padding: 0, cursor: "pointer",
              }}
            >
              <span className="ms" style={{ fontSize: 18, textDecoration: "none" }}>info</span>
              <span style={{ textDecoration: "underline" }}>What changes the price?</span>
            </button>
          </div>

          <CatalogBrowser products={PRODUCTS} Card={Card} onGo={onGo} lean={lean}
            canOpen={item => !!openTarget(item, lean)} onOpen={item => openProduct(item, onGo, lean)} />
        </div>
      </section>

      {/* ── The selling lane ──
          After the products, not above them: someone on a catalogue is
          choosing a product, and this is the second question. Not every
          product above can be sold — notebooks and wall art cannot, since
          2026-08-25 — so the copy names the ones that can, from the
          catalogue rather than from memory.

          No figures. This is a retail page — what a seller keeps depends on
          the book, and that arithmetic lives on the estimator, behind the
          door. The band is the closing gradient the rest of the site uses,
          so it reads as part of the page rather than an advert stuck on it. */}
      <section
        className="curve-cta"
        style={{
          background: "linear-gradient(71deg, #e2e8f0 -0.95%, #f5f0ea 45.34%, #e2e8f0 98.72%)",
          padding: "clamp(64px, 8vw, 96px) 24px clamp(56px, 7vw, 80px)",
        }}
      >
        <div style={{
          maxWidth: 1080, margin: "0 auto",
          display: "grid", gap: 32, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          alignItems: "center",
        }}>
          <img
            src={IMG + "hp-selling.Bihm600K_YtSAD.webp"}
            alt="A photo book beside a storefront mark, the sign of an Instant Store."
            loading="lazy"
            style={{ width: "100%", height: "auto", borderRadius: R.lg, display: "block" }}
          />

          <div style={{ display: "grid", gap: 16, minWidth: 0 }}>
            <span style={{
              justifySelf: "start", padding: "3px 10px", borderRadius: 999, background: C.blue600, color: "#fff",
              fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0, textTransform: "none",
            }}>
              New
            </span>

            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
              lineHeight: 1.25, margin: 0, color: C.blue950,
            }}>
              Making it to sell? Create a Blurb Instant Store
            </h2>

            {/* ── It says the prices above are not a seller's (Ana, #6/#7) ──
                "The copy will have to reference the difference in price,
                i.e. the prices listed on this page are higher than if you
                were going to sell it."

                Said as a DIRECTION and a change of role, never as a sum.
                Every price on this page is a retail one; naming the
                fulfilment figure beside them, or the gap between them,
                publishes Blurb's margin with the arithmetic already done.
                "You are buying a copy / we are your printer" gives a
                seller the whole of what they need to know here, which is
                that these are not their numbers and where theirs live.

                Copy realigned 2026-09-11 (Ana: "align the copy of the
                banner at the bottom with the copy elsewhere") — this
                lane predates the terminology the profit calculator, ISV2
                and Sell Overview have since settled on: "product page"
                (not "one link"), "listing price" and "print cost" (not
                "what your buyer pays" / "it costs you less"), "See what
                you'd earn" and "Create your Instant Store" as the two
                doors' exact labels everywhere else they appear. Same
                claim, same rule (never show retail and fulfilment side
                by side) — just this page's last holdout in the old
                words. */}
            <p style={{ margin: 0, fontSize: TYPE.lg, lineHeight: 1.6, color: T.textNeutral }}>
              {sellableSentence()} can be sold from a shareable product page, and the prices on this page
              aren't the ones you'd pay to sell. These are retail prices; when you sell, we're your printer
              instead, so your print cost is lower and you set your own listing price.
            </p>

            {/* Two doors in the recommended scope — the number, then the
                page. In the lean one there is no estimator to send anybody
                to, so the page is the only door and takes the primary. */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
              {!lean && (
                <Button onClick={() => onGo?.("margin")}>
                  See what you'd earn
                </Button>
              )}
              <Button
                variant={lean ? "filled" : "outlined"}
                onClick={() => onGo?.("instantstorev2")}
              >
                Create your Instant Store
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
