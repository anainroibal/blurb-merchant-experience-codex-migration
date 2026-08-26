/* ────────────────────────────────────────────────────────────────
   Photography for the option steps.

   The product row has carried Blurb's own photographs since 2026-08-24;
   the steps underneath it still had a grey tile and a `menu_book` icon,
   which is a placeholder pretending to be a swatch. A paper is a thing
   you can see, and choosing between five of them by reading five names
   is the part of the live calculator this redesign is meant to fix.

   Every file here is Blurb's own, served from assets.blurb.com, and the
   names are the site's — `small-square.png` is the Mini Square, so the
   mapping is the option id and not a guess about what the picture shows:

     · sizes and papers   — /pricing
     · covers and layflat — /photo-books

   Two gaps, both left as the icon tile rather than filled with a picture
   of something else:

     · Softcover Wire-O has no photograph anywhere on blurb.com.
     · Wall art materials are photographed as finished pieces, not as
       materials, so /wall-art has nothing that reads as a swatch.

   One approximation, marked as such: blurb.com publishes a single
   black-and-white trade spread, so Economy and Standard Black & White
   share it. They are the same ink on the same matte stock at different
   prices, and the photograph cannot tell them apart either.
   ──────────────────────────────────────────────────────────────── */
const A = "https://assets.blurb.com/_astro/";

/* Keyed by OPTION ID. Ids are unique across the groups that use them —
   trade and photo books share `standard_portrait`-shaped names but not
   the ids themselves, except where the product genuinely is the same
   shape, in which case the same photograph is the right one. */
export const OPTION_PHOTOS = {
  /* ── Sizes: the book itself, blank, at its true proportions ── */
  small_square:            [A + "small-square.D8sTSz0I.png", "Blank 5×5 in square hardcover book."],
  square:                  [A + "square.C4M9af8g.png", "Blank 7×7 in square hardcover book."],
  standard_portrait:       [A + "standard-portrait.BDFRvpWo.png", "Blank 8×10 in portrait hardcover book."],
  standard_landscape:      [A + "standard-landscape.1NYQBpOZ.png", "Blank 10×8 in landscape hardcover book."],
  large_square:            [A + "large-square.ILip0VQy.png", "Blank 12×12 in square hardcover book."],
  large_format_landscape:  [A + "large-format-landscape.1X82FB4d.png", "Blank 13×11 in landscape hardcover book."],
  pocket_text:             [A + "pocket-text.ZrY7LvYz.png", "Blank 5×8 in pocket paperback."],
  large_text:              [A + "large-text.DuhsFdyq.png", "Blank 6×9 in US Trade paperback."],
  standard_portrait_true8x10: [A + "standard-portrait.BDFRvpWo.png", "Blank 8×10 in portrait book."],

  /* ── Covers ── */
  softcover:  [A + "softcover-optimized.CRV7UW6t.webp", "Open softcover photo book with a pale interior spread."],
  imagewrap:  [A + "imagewrap-hardcover-optimized.DIukpr2R.webp", "Stack of ImageWrap hardcover books with a Paris scene on the cover."],
  dustjacket: [A + "linen-hardcover-dustjacket-optimized.DNuztDk1.webp", "Linen hardcover book with a printed dust jacket."],

  /* ── Photo papers: a spread, so the finish is what you see ── */
  standard_paper:         [A + "standard.xyqN8kC4.png", "Spread printed on standard semi-matte paper."],
  premium_paper:          [A + "premium-matte.BtcgeMMZ.png", "Spread printed on premium matte paper."],
  premium_paper_lustre:   [A + "premium-lustre.DZ2b7-Cf.png", "Spread printed on premium lustre paper."],
  pro_uncoated_paper:     [A + "pro-uncoated.BBP7oXk5.png", "Spread printed on Mohawk Superfine uncoated paper."],
  pro_medium_gloss_paper: [A + "pro-medium-gloss.n6HyjFh9.png", "Spread printed on Mohawk ProPhoto Pearl paper."],

  /* Layflat is a binding rather than a stock, and it is photographed as
     one: the same open book with a spread running across the gutter. */
  standard_layflat_paper:      [A + "layflat-optimized.DkXhhS7N.webp", "Open layflat book with an image running across the gutter."],
  premium_matte_layflat_paper: [A + "layflat-optimized.DkXhhS7N.webp", "Open layflat book with an image running across the gutter."],
  pro_uncoated_layflat_paper:  [A + "layflat-optimized.DkXhhS7N.webp", "Open layflat book with an image running across the gutter."],
  pro_photo_layflat_paper:     [A + "layflat-optimized.DkXhhS7N.webp", "Open layflat book with an image running across the gutter."],

  /* ── Trade papers ── */
  economy_trade_bw_matte_paper:  [A + "standard-trade-bw-matte.B1MOh5A3.png", "Black-and-white spread on matte trade paper."],
  standard_trade_bw_matte_paper: [A + "standard-trade-bw-matte.B1MOh5A3.png", "Black-and-white spread on matte trade paper."],
  economy_trade_matte_paper:     [A + "economy-trade-matte.BJpuPYdi.png", "Colour spread on economy matte trade paper."],
  standard_trade_matte_paper:    [A + "standard-trade-color.etaP7zF_.png", "Colour spread on standard matte trade paper."],

  /* ── The one-option products ── */
  premium: [A + "premium-magazine.CnF_ScyZ.png", "Premium magazine, 8.5×11 in, softcover."],
};

/* A notebook is priced off the trade matrix and shares its paper id, but
   the product is not a trade book, and the trade colour spread would be
   the wrong picture in a step headed "Choose your pages". Per-format
   overrides, applied before the shared map. */
const BY_FORMAT = {
  notebook: {
    standard_trade_matte_paper: [A + "notebooks-and-journals.BGE8TXbz.png",
      "Dark green ImageWrap notebook with 'Today is the Day' on the cover."],
  },
};

export const photoFor = (formatId, optionId) => {
  const hit = BY_FORMAT[formatId]?.[optionId] ?? OPTION_PHOTOS[optionId];
  return hit ? { img: hit[0], alt: hit[1] } : null;
};
