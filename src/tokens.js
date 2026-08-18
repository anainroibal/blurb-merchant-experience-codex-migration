/* ────────────────────────────────────────────────────────────────
   Codex tokens.

   Lifted from the live blurb.com stylesheet (assets.blurb.com/_astro),
   which ships the Codex token system as CSS custom properties. The
   source values are oklch(); these are the sRGB equivalents so the
   prototype renders identically everywhere.

   Two of them independently confirm this is the real set:
     --color-light-blue-600  #107eb1  — the brand blue in Blurb Checkout
     --color-light-blue-950  #0d2f44  — the Text Selector ring colour

   Don't invent values. If something is missing, pull it from the
   stylesheet rather than eyeballing it.
   ──────────────────────────────────────────────────────────────── */

export const C = {
  /* brand — light-blue ramp */
  blue50:  "#f1f9fe",
  blue100: "#e2f3fc",
  blue600: "#107eb1",  // brand
  blue700: "#0f6995",  // hover
  blue800: "#10597c",  // active
  blue950: "#0d2f44",  // brand ink

  /* neutrals — light-gray ramp */
  gray50:  "#f5f5f5",
  gray100: "#efefef",
  gray200: "#dcdcdc",
  gray400: "#989898",
  gray600: "#656565",
  gray700: "#525252",
  gray950: "#292929",

  white:   "#ffffff",
};

/* Semantic aliases, named the way Codex names them. Prefer these in
   components so a token change lands in one place. */
export const T = {
  textNeutral: C.gray950,
  textSubtle:  C.gray600,
  textBrand:   C.blue950,
  textInverse: C.white,

  bgNeutral:      C.white,
  bgSubtle:       C.gray50,
  bgBrand:        C.blue600,
  bgBrandHover:   C.blue700,
  bgBrandActive:  C.blue800,
  bgAccentSubtle: C.blue50,

  border:       C.gray200,
  borderStrong: C.gray400,
  borderBrand:  C.blue950,
};

/* Type scale, verbatim from --text-* */
export const TYPE = {
  sm:   "0.875rem",
  base: "1rem",
  lg:   "1.125rem",
  xl:   "1.25rem",
  "2xl": "1.375rem",
  "3xl": "1.5rem",
  "4xl": "1.75rem",
  "5xl": "2rem",
  "6xl": "2.125rem",
  "7xl": "2.25rem",
  "8xl": "2.5rem",
  "9xl": "2.75rem",
  "11xl": "3.75rem",
  "12xl": "5rem",
};

/* Radii, verbatim from --radius-* */
export const R = { sm: 4, md: 6, lg: 8, "2xl": 16 };

/* Blurb serves futura-pt and proxima-nova from Typekit. The kit is
   domain-locked, so treat the fallbacks as load-bearing rather than
   decorative — on a vercel.app host the real faces may not resolve. */
export const FONT_DISPLAY = '"futura-pt", "Futura", "Avenir Next", Inter, system-ui, sans-serif';
export const FONT_BODY    = '"proxima-nova", "Proxima Nova", Inter, -apple-system, system-ui, sans-serif';

/* Codex Button: 40px tall. Full-width stacked with a 16px gap. */
export const BUTTON_HEIGHT = 40;
