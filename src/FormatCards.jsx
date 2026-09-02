import React from "react";
import { RadioCard, RadioCardGroup } from "@blurb/codex-react";
import { C, T, TYPE, FONT_DISPLAY } from "./tokens.js";
import { CATALOG, fromPrice, sizeCount, money } from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   ONE product card, used everywhere a product is chosen.

   /pricing set the pattern and it is the one to keep: the photograph
   runs to the card's edges, nothing is inset but the text, and an
   unchosen card has no frame at all — the border is transparent rather
   than absent so choosing one cannot shift the row by two pixels.

   Step one of /getting-started used to have its own card: a bordered
   box, a padded icon tile, a coloured ground when selected, a blue
   bottom rule. Two cards doing one job, and the newer one was the
   worse of the two. This module is now the only one.
   ──────────────────────────────────────────────────────────────── */

/* ── The format cards, as /pricing opens with them ──
   "Select a format to see size and paper options" — products first, then
   the controls that price one. Same principle the rest of the prototype
   runs on: a maker who already knows they want an 8×10 hardback must not
   be asked what kind of book they are writing first.

   Everything here except the numbers is the live page's, read out of the
   PricingTableSection island's own props rather than retyped: the heading,
   the subheading, the descriptions, the badge text, the alt text, and the
   product photographs themselves, served from assets.blurb.com.

   THE NUMBERS ARE STILL COMPUTED. sizeCount() and fromPrice() keep the
   "3 sizes — from US $2.99" line honest against the matrix, where the live
   page types $3.99 for the same book, $12.00 for notebooks the matrix
   prices at $14.67, and $65.00 for wall art that starts at $10.11. Same
   sentence shape, same position, real figures — the gap is ticket T7 and
   showing it is the point. Swap `fromPrice(id)` for `card.price` if the
   live strings are ever wanted verbatim.

   PDFs are absent because /pricing does not offer one. They are still in
   the catalogue, and still priced, for the pages that do. */
const IMG = "https://assets.blurb.com/_astro/";

export const FORMAT_CARDS = [
  { id: "photo", title: "Photo Book", badge: "Most Popular",
    desc: "Premium books made for visual storytelling.",
    img: IMG + "photo-book.GsE6vVn8.png",
    alt: "Stack of two ImageWrap hardcover photo books with a scene of Paris on the front cover." },
  { id: "trade", title: "Paperback & Hardcover Books", badge: "Budget-friendly",
    desc: "Ideal for projects that pair text and imagery.",
    img: IMG + "trade-book.XYVh8a5K.png",
    alt: "Imagewrap hardcover book with colorful fruit and vegetable photography on dark background cover." },
  { id: "magazine", title: "Magazine",
    desc: "Great for serial content or volume printing. Think lookbooks and zines.",
    img: IMG + "magazines.DBPIwly6.png",
    alt: "Stack of pink design magazines titled ‘Tonal’ featuring colorful ceramic bowls and pottery on cover." },
  { id: "notebook", title: "Notebooks & Journals",
    desc: "Blank, lined, dotted or grid pages made for sketching, planning, and day-dreaming.",
    img: IMG + "notebooks-and-journals.BGE8TXbz.png",
    alt: "Dark green ImageWrap hardcover notebook with yellow 'Today is the Day' text on cover." },
];

/* /pricing has no PDF card because /pricing does not sell one. The other
   surfaces do, so the fallback is the catalogue's own name and blurb, with
   a stand-in tile at the photograph's aspect ratio — same geometry, same
   edges, so the row stays level until real photography exists. */
const STANDIN = { pdf: "tablet_mac" };

/* Cards for products that never join /pricing's or the calculators' own
   grid (see FORMAT_CARDS above) but still need a real photo somewhere
   else it's chosen — right now just Wall Art, under Keep. Kept out of
   FORMAT_CARDS itself so it can never be enumerated back into a row that
   deliberately excludes it. */
const OTHER_CARDS = [
  { id: "wallart", title: "Wall Art",
    desc: "Gallery-quality wall décor, featuring your favorite photos or custom designs.",
    img: "https://www.blurb.com/pages/ad-hoc-assets/newnewwall/03c1_Material_448x376_v1-Metal01-dfe422eb19340f856829299342ebb84a9cb7624782ad89e707a0ed2a7e7a7b6f.jpg",
    alt: "A metal print of a landscape photograph, an example of Blurb wall art." },
];

export const cardFor = id => {
  const card = FORMAT_CARDS.find(c => c.id === id) ?? OTHER_CARDS.find(c => c.id === id);
  if (card) return card;
  const f = CATALOG[id];
  return f && { id, title: f.short ?? f.label, desc: f.blurb, img: null, alt: "" };
};

/* `badge` overrides the card's own — step one uses it for the
   recommendation, /pricing for "Most Popular". Same chip either way. */
export function FormatCard({ id, selected, badge, icon, hidePrice }) {
  const card = cardFor(id);
  if (!card) return null;
  const from = fromPrice(id);
  const count = sizeCount(id);
  const chip = badge === undefined ? card.badge : badge;

  return (
    <RadioCard
      value={id}
      className="radiocard-flush"
      style={{
        textAlign: "left", font: "inherit", cursor: "pointer", minWidth: 0,
        overflow: "hidden", borderRadius: 10, display: "block",
        /* Same as OptionCard's image variant: overflow: hidden (needed to
           clip the photo's corners) breaks RadioCard's own ::before ring
           where it crosses the image, so the ring is switched off and the
           border is real again. */
        border: selected ? `2px solid ${C.gray950}` : "2px solid transparent",
        "--codex-color-semantic-border-link-active": "transparent",
      }}
    >
      <span style={{ position: "relative", display: "block" }}>
        {card.img ? (
          <img
            src={card.img}
            alt={card.alt}
            width={700}
            height={700}
            loading="lazy"
            style={{ display: "block", width: "100%", height: "auto" }}
          />
        ) : (
          <span style={{
            display: "grid", placeItems: "center",
            width: "100%", aspectRatio: "1 / 1", background: C.gray100,
          }}>
            <span className="ms" style={{ fontSize: 56, color: C.gray400 }}>
              {icon ?? STANDIN[id] ?? "menu_book"}
            </span>
          </span>
        )}
        {chip && (
          <span style={{
            position: "absolute", top: 12, left: 12, background: "#fff",
            borderRadius: 4, padding: "4px 10px",
            fontSize: TYPE.sm, fontWeight: 600, color: C.gray950,
          }}>
            {chip}
          </span>
        )}
      </span>

      <span style={{ display: "block", padding: "18px 12px 20px" }}>
        <span style={{
          display: "block", fontFamily: FONT_DISPLAY,
          fontSize: TYPE["3xl"], fontWeight: 600, lineHeight: 1.2, color: C.gray950,
        }}>
          {card.title}
        </span>
        <span style={{
          display: "block", marginTop: 10, fontSize: TYPE.sm,
          color: T.textSubtle, lineHeight: 1.5,
        }}>
          {card.desc}
        </span>
        {!hidePrice && (
          <span style={{
            display: "block", marginTop: 12, fontSize: TYPE.sm, fontWeight: 700, color: C.gray950,
          }}>
            {count} {count === 1 ? "size" : "sizes"} - {from == null ? "price on request" : `From ${money(from)}`}
          </span>
        )}
      </span>
    </RadioCard>
  );
}

/* The row itself. `ids` lets a caller narrow or reorder the set — step one
   filters by route and leads with the recommendation. */
const GAP = 28;
/* /pricing shows five of these across the content width, which puts each
   card at a little over 200px. A page offering three would stretch them to
   nearly twice that on the same grid rule, and the same product would look
   like a different component from one screen to the next. Capping the row
   at what five cards occupy keeps the card itself one size everywhere and
   simply centres a shorter row. */
const CARD_MAX = 232;

export function FormatRow({ ids, formatId, onPick, badgeFor, hidePrice }) {
  return (
    <RadioCardGroup
      value={formatId}
      onValueChange={onPick}
      aria-label="Format"
      style={{
        display: "grid", gap: GAP, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
        alignItems: "start",
        maxWidth: ids.length * CARD_MAX + (ids.length - 1) * GAP, margin: "0 auto", width: "100%",
      }}
    >
      {ids.map(id => (
        <FormatCard
          key={id}
          id={id}
          selected={id === formatId}
          badge={badgeFor ? badgeFor(id) : undefined}
          hidePrice={hidePrice}
        />
      ))}
    </RadioCardGroup>
  );
}

/* The line under the heading belongs to the PAGE, not to the row. On the
   pricing calculator it is the volume discount; on the profit calculator
   it is where the other selling routes live (Anain, 2026-08-27). Passing
   it in stops one screen's footnote appearing on the other, which is what
   put "save more when you print in bulk" above a seller's margin. */
export default function FormatCards({ formatId, onPick, note }) {
  return (
    <div style={{ display: "grid", gap: 28 }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 600, letterSpacing: "-0.01em",
          fontSize: "clamp(1.5rem, 3.2vw, 2rem)", lineHeight: 1.25, margin: 0,
        }}>
          Select a format to see size and paper options
        </h2>
        {note && (
          <div style={{ margin: "12px 0 0", fontSize: TYPE.base, color: T.textNeutral }}>
            {note}
          </div>
        )}
      </div>

      <FormatRow ids={FORMAT_CARDS.map(c => c.id)} formatId={formatId} onPick={onPick} />
    </div>
  );
}
