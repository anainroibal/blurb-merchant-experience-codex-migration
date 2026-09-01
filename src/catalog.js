import { PRICING } from "./pricing.data.js";

/* ────────────────────────────────────────────────────────────────
   Product catalogue and pricing.

   Prices come from the real matrix embedded in blurb.com/pricing
   (see pricing.data.js). Two things follow from that:

     · Price is a LOOKUP on cover + size + paper. It is not a base
       price with deltas added — an earlier version of this file got
       that wrong and produced numbers that existed nowhere.
     · Not every combination exists. Mini Square softcover comes in
       one paper only. So options are availability-aware, and the UI
       disables what cannot be built rather than pricing fiction.

   Labels and dimensions are ours; every figure is Blurb's.
   Blurb publishes no fulfilment pricing, so the seller cost is still
   derived — see FULFILMENT_FACTOR.
   ──────────────────────────────────────────────────────────────── */

const COVERS = {
  softcover:       { label: "Soft Cover" },
  imagewrap:       { label: "ImageWrap, Hardcover" },
  dustjacket:      { label: "Dust Jacket, Hardcover" },
  softcover_wireo: { label: "Softcover Wire-O" },
};

const PHOTO_SIZES = {
  small_square:           { label: "Mini Square",        dims: "5×5 in (13×13 cm)" },
  square:                 { label: "Small Square",       dims: "7×7 in (18×18 cm)" },
  standard_portrait:      { label: "Standard Portrait",  dims: "8×10 in (20×25 cm)" },
  standard_landscape:     { label: "Standard Landscape", dims: "10×8 in (25×20 cm)" },
  large_square:           { label: "Large Square",       dims: "12×12 in (30×30 cm)" },
  large_format_landscape: { label: "Large Landscape",    dims: "13×11 in (33×28 cm)" },
};

const PHOTO_PAPERS = {
  standard_paper:              { label: "Standard",                  spec: "80# Semi Matte (118 GSM)",              maxPages: 440 },
  premium_paper:               { label: "Premium Matte",             spec: "100# Premium Matte (148 GSM)",          maxPages: 240 },
  premium_paper_lustre:        { label: "Premium Lustre",            spec: "100# Premium Lustre (148 GSM)",         maxPages: 240 },
  pro_uncoated_paper:          { label: "Mohawk Superfine Eggshell", spec: "100# Mohawk Superfine Uncoated (148 GSM)", maxPages: 240 },
  pro_medium_gloss_paper:      { label: "Mohawk ProPhoto Pearl",     spec: "140# Mohawk Photo Gloss (190 GSM)",     maxPages: 240 },
  standard_layflat_paper:      { label: "Standard — Layflat",        spec: "Layflat binding",                        maxPages: 110 },
  premium_matte_layflat_paper: { label: "Premium Matte — Layflat",   spec: "Layflat binding",                        maxPages: 110 },
  pro_uncoated_layflat_paper:  { label: "Mohawk Eggshell — Layflat", spec: "402# Double Thick (596 GSM)",           maxPages: 110 },
  pro_photo_layflat_paper:     { label: "Mohawk Pearl — Layflat",    spec: "506# Double Thick (750 GSM)",           maxPages: 110 },
};

const TRADE_SIZES = {
  pocket_text:               { label: "Pocket",      dims: "5×8 in (13×20 cm)" },
  large_text:                { label: "US Trade",    dims: "6×9 in (15×23 cm)" },
  standard_portrait_true8x10:{ label: "Large Format",dims: "8×10 in (20×25 cm)" },
};

/* Notebooks share the trade price matrix, so the paper KEY has to stay
   `standard_trade_matte_paper` for the lookup to work — but it is not
   that paper. ProductList 2025 calls it White Uncoated 70#, and puts the
   ceiling at 480pp rather than a trade book's. Same id, own description. */
const NOTEBOOK_PAPERS = {
  standard_trade_matte_paper: {
    label: "White Uncoated", spec: "70# White Uncoated (105 GSM)", maxPages: 480,
  },
};

const TRADE_PAPERS = {
  economy_trade_bw_matte_paper:  { label: "Economy Black & White",  spec: "Matte", maxPages: 440 },
  standard_trade_bw_matte_paper: { label: "Standard Black & White", spec: "Matte", maxPages: 440 },
  economy_trade_matte_paper:     { label: "Economy Colour",         spec: "Matte", maxPages: 440 },
  standard_trade_matte_paper:    { label: "Standard Colour",        spec: "Matte", maxPages: 440 },
};

/* Wall art, from the same embedded matrix as everything else — five
   materials, twelve sizes, and a good many gaps between them. */
const WALL_MATERIALS = {
  poster_matte:  { label: "Matte Poster",  spec: "Printed on heavyweight matte stock" },
  block_matte:   { label: "Photo Block",   spec: "Mounted on a standing wood block" },
  metal_gloss:   { label: "Metal",         spec: "Gloss aluminium — colour sits above the surface" },
  canvas_matte:  { label: "Canvas",        spec: "Matte canvas, stretched and ready to hang" },
  acrylic_gloss: { label: "Acrylic",       spec: "Gloss acrylic face mount, the deepest blacks" },
};

const WALL_SIZES = {
  portrait_8x10:   { label: "8×10 Portrait",  dims: "8×10 in (20×25 cm)" },
  landscape_10x8:  { label: "10×8 Landscape", dims: "10×8 in (25×20 cm)" },
  square_12x12:    { label: "12×12 Square",   dims: "12×12 in (30×30 cm)" },
  portrait_11x14:  { label: "11×14 Portrait", dims: "11×14 in (28×36 cm)" },
  landscape_14x11: { label: "14×11 Landscape",dims: "14×11 in (36×28 cm)" },
  portrait_16x20:  { label: "16×20 Portrait", dims: "16×20 in (41×51 cm)" },
  landscape_20x16: { label: "20×16 Landscape",dims: "20×16 in (51×41 cm)" },
  square_20x20:    { label: "20×20 Square",   dims: "20×20 in (51×51 cm)" },
  portrait_20x24:  { label: "20×24 Portrait", dims: "20×24 in (51×61 cm)" },
  landscape_24x20: { label: "24×20 Landscape",dims: "24×20 in (61×51 cm)" },
  portrait_20x30:  { label: "20×30 Portrait", dims: "20×30 in (51×76 cm)" },
  landscape_30x20: { label: "30×20 Landscape",dims: "30×20 in (76×51 cm)" },
};

const mk = (dict, ids) => ids.map(id => ({ id, ...dict[id] }));

/* DECISION, 2026-08-18: a PDF cannot be sold through an Instant Store
   (called a checkout link when the decision was made).
   It can still be ordered for yourself. See `sellChannels` on each format
   and `formatsFor` below — the restriction is by channel, not intention. */

/* Which cover/size/paper combinations actually exist in the matrix. */
const combos = fam => {
  const out = new Set();
  for (const [cover, rows] of Object.entries(PRICING.families[fam] || {})) {
    for (const key of Object.keys(rows)) out.add(`${cover}|${key}`);
  }
  return out;
};

export const CATALOG = {
  photo: {
    fam: "photo_books",
    label: "Photo Books",
    short: "Photo Book",
    blurb: "Professional-quality photo books for creative expressions of all kinds.",
    basePages: 20,
    groups: [
      { id: "size",  label: "Choose your book size", options: mk(PHOTO_SIZES, Object.keys(PHOTO_SIZES)) },
      { id: "cover", label: "Choose your cover",     options: mk(COVERS, ["softcover", "imagewrap", "dustjacket"]) },
      { id: "paper", label: "Choose your paper",     options: mk(PHOTO_PAPERS, Object.keys(PHOTO_PAPERS)) },
    ],
    tiers: [{ min: 50, pct: 0.25 }, { min: 20, pct: 0.20 }, { min: 10, pct: 0.20 }],
    addons: ["whitelabel"],
    /* /self-publish: Bookstore lists photo books; Amazon is photo-only
       (layflat excluded — see CHANNEL_RULES); Ingram is trade-only. */
    sellChannels: ["checkout_link", "bookstore", "amazon"],
  },

  trade: {
    fam: "trade_books",
    label: "Trade Books",
    short: "Trade Book",
    blurb: "Affordable paperbacks and hardcovers – priced to sell.",
    basePages: 24,
    groups: [
      { id: "size",  label: "Choose your book size", options: mk(TRADE_SIZES, Object.keys(TRADE_SIZES)) },
      { id: "cover", label: "Choose your cover",     options: mk(COVERS, ["softcover", "imagewrap", "dustjacket", "softcover_wireo"]) },
      { id: "paper", label: "Choose your paper",     options: mk(TRADE_PAPERS, Object.keys(TRADE_PAPERS)) },
    ],
    /* 10–19 is 10%, restored 2026-08-21 from the live /pricing page, which
       publishes trade at 10/20/25 — photo, magazine and notebook all match
       it. ProductList 2025 reads 10–19 20% and an earlier pass followed the
       document; the page is what a seller reads, so the page wins and the
       disagreement belongs to whoever owns the matrix. ProductList's top
       rung, 100+ blurb.com, is still the source for BULK_AT — /pricing
       publishes no band above 50+. */
    tiers: [{ min: 50, pct: 0.25 }, { min: 20, pct: 0.20 }, { min: 10, pct: 0.10 }],
    addons: ["whitelabel"],
    /* /self-publish: Ingram takes "paperback and hardcover books" — this
       family and no other. Amazon does not list trade books at all. */
    sellChannels: ["checkout_link", "bookstore", "ingram"],
  },

  magazine: {
    fam: "magazines",
    label: "Magazines",
    short: "Magazine",
    blurb: "The magazine format offers a sleek solution to serial content.",
    basePages: 20,
    flat: true, // priced by grade, not by a size/paper matrix
    groups: [
      /* A magazine offers nothing to choose. /pricing lists one magazine —
         Premium, 8.5×11, one paper — under the heading "1 size", and no
         alternative anywhere on the page. So no step here says "choose":
         each keeps the heading and the card a book step has, showing the one
         option already selected, and the page keeps its shape.

         CONFIRMED 2026-08-18: premium is the only magazine price. The
         `economy` entry PRICING.magazines still carries from the matrix is
         not a product, so it is not offered. If that ever changes it comes
         back as a second card and these headings return to "Choose your …".

         /pricing also shows "Additional Pages: Not Available" for magazines,
         which contradicts the per-page rate in the matrix. A bug is raised;
         the rate stays until it is settled, so the page count still moves
         the price here. Specs are BookWright's. */
      {
        id: "grade", label: "Your magazine", note: "Magazines come in one size.",
        options: [
          {
            id: "premium", label: "Premium Magazine", dims: "8.5×11 in (22×28 cm)",
            pageKey: "magazine_velvet_paper", maxPages: 240,
            derived: [
              {
                id: "cover", label: "Your cover", note: "Included with every magazine.",
                option: { label: "Softcover", spec: "80# Semi-gloss (216 GSM) for heft and protection." },
              },
              {
                id: "paper", label: "Your paper", note: "Included with every magazine.",
                option: { label: "Matte 80#", spec: "80# Matte text (115 GSM). Vibrant printing on matte, velvet finish." },
              },
            ],
          },
        ],
      },
    ],
    tiers: [{ min: 50, pct: 0.20 }, { min: 20, pct: 0.15 }, { min: 10, pct: 0.10 }],
    addons: ["whitelabel"],
    /* /self-publish lists magazines for the Bookstore only. */
    sellChannels: ["checkout_link", "bookstore"],
  },

  /* Notebooks & Journals — a real product family with real prices in the
     matrix, and one this page never offered. It is a book you write IN,
     so it is not something you sell or hang: it belongs to keepsake and
     gift. Paper and size come as a pair in the matrix (standard trade
     matte only), so paper is a derived step, as on a magazine. */
  notebook: {
    fam: "notebooks",
    label: "Notebooks & Journals",
    short: "Notebook",
    blurb: "Blank, lined, dotted or grid pages made for sketching, planning, and day-dreaming.",
    /* 72–480pp, from ProductList 2025 — a notebook starts far longer than
       a book, which is why the page stepper opens where it does. */
    basePages: 72,
    intentions: ["keepsake", "gift"],
    /* Not offered under "Buy in bulk" — unconfirmed whether Large Order
       Services quotes notebooks at all (Anain, 2026-09-01). See
       `formatsFor`'s distribute branch. */
    bulk: false,
    groups: [
      { id: "size",  label: "Choose your notebook size", options: mk(TRADE_SIZES, Object.keys(TRADE_SIZES)) },
      { id: "cover", label: "Choose your cover",         options: mk(COVERS, ["softcover", "softcover_wireo", "imagewrap", "dustjacket"]) },
      {
        id: "paper", label: "Choose your pages",
        note: "Every notebook is printed on the same stock; only the ruling changes, and that is chosen in the tool.",
        options: mk(NOTEBOOK_PAPERS, ["standard_trade_matte_paper"]),
      },
    ],
    tiers: [{ min: 50, pct: 0.25 }, { min: 20, pct: 0.20 }, { min: 10, pct: 0.20 }],
    addons: ["whitelabel"],
    /* ── Not sold through any channel (Ana + engineering, 2026-08-25) ──
       "We won't allow selling of wall art or notebooks and journals. The
       principle is we only allow selling of what is currently allowed in
       the bookstore, to avoid additional scope."

       This overrides what /self-publish says. That page lists "notebooks
       and journals" under the Bookstore, and this repo took it as
       confirmation on 2026-08-19. A decision made with engineering beats a
       marketing page, so the rule stands and the page is what is wrong —
       worth raising with whoever owns it, because a seller reading it
       today is being told they can sell something they cannot.

       Notebooks stay fully priced and orderable for yourself. What is
       withdrawn is selling them. */
    sellChannels: [],
  },

  /* Wall Art. Priced material × size — a shape no other product here
     uses, so it carries its own availability and lookup. There are no
     pages, and nothing to bind.

     STAYS under Keep — keepsake, display and gift alike (Anain,
     2026-09-01: "wall art can stay in keepsake too", overriding the
     earlier "keepsake is a book word" rule) — GOES from Sell and Buy in
     bulk only. Not `offered: false`, which pulled it out of Keep too and
     was too broad. `sellChannels: []` below already withdraws it from
     Sell; `bulk: false` does the same for Buy in bulk, which otherwise
     ignores `intentions` entirely and was still surfacing it there. It's
     also left off the profit/pricing calculator's own curated card row
     in FormatCards.jsx. */
  wallart: {
    fam: "wall_art",
    label: "Wall Art",
    short: "Wall Art",
    blurb: "Gallery-quality wall décor, featuring your favorite photos or custom designs.",
    basePages: 0,
    pageless: true,
    bulk: false,
    intentions: ["keepsake", "display", "gift"],
    groups: [
      { id: "material", label: "Choose your material", options: mk(WALL_MATERIALS, Object.keys(WALL_MATERIALS)) },
      { id: "size",     label: "Choose your size",     options: mk(WALL_SIZES, Object.keys(WALL_SIZES)) },
    ],
    tiers: [],
    addons: [],
    /* Wall art appears on no channel list anywhere on /self-publish, and
       Ana confirmed with engineering on 2026-08-25 that it is not sold
       through any route. Two sources agreeing, for once. */
    sellChannels: [],
  },

  pdf: {
    fam: "ebooks",
    label: "PDFs",
    short: "PDF",
    blurb: "Made for digital distribution, PDFs preserve your book design on any device.",
    digital: true,
    basePages: 0,
    flat: true,
    groups: [
      {
        id: "grade", label: "Choose your format", options: [
          { id: "pdf",                label: "PDF",                spec: "Instant download" },
          { id: "fixed_layout_ebook", label: "Fixed-layout ebook", spec: "For ebook readers" },
        ],
        note: "All covers are available when creating your book.",
      },
    ],
    tiers: [],
    addons: [],
    note: "A digital download — nothing to print, and no page count to set.",
    /* PDFs can still be ORDERED for yourself — they stay in the product
       types for keepsake, display and gift. What is not allowed is selling
       one through an Instant Store, so `checkout_link` is absent below.
       Other channels are listed because the decision was specific to
       the Instant Store; confirm before relying on it. */
    /* No channel lists PDFs. The earlier ["bookstore","amazon","ingram"]
       was our guess, flagged as unconfirmed; the evidence says none. */
    sellChannels: [],
    /* ── Not offered on the product row (2026-08-24) ──
       This reverses part of the 8/18 decision, which kept PDFs in the
       product types for keepsake, display and gift and dropped them only
       under "to Sell". The row is photographs of products now, and there is
       no product photograph of a PDF: blurb.com has none, /pricing has no
       PDF card, and the only PDF imagery on blurb.com is a page banner and
       a screenshot of the uploader. A single icon tile in a row of
       photographs read as a missing image rather than a product.

       The entry stays — priced, with its formats and its channel rules —
       because /pdf-to-book and the checkout-link limits both depend on it.
       Flip this to offer it again once there is a photograph. */
    offered: false,
  },
};

export const FORMAT_IDS = Object.keys(CATALOG);

/* ── Which tools can make which product ──
   From ProductList 2025. The important one is `online`: BookWright
   Online cannot make a trade book, a magazine or wall art, so the
   handoff at the foot of the page must stop offering it for those.

   One disagreement inside the source itself: its Books sheet lists
   BookWright Online against all four notebook covers, while its Creation
   Tool sheet lists only photo and layflat books under that tool. The
   product-oriented sheet is followed here; worth confirming.

   Wall art has no PDF route either — PDF to Book covers photo, trade,
   magazine and notebooks only. */
const TOOLS = {
  photo:    ["bookwright", "online", "lightroom", "pdf"],
  trade:    ["bookwright", "lightroom", "pdf"],
  magazine: ["bookwright", "lightroom", "pdf"],
  notebook: ["bookwright", "online", "lightroom", "pdf"],
  wallart:  ["bookwright", "indesign", "photoshop"],
  pdf:      ["bookwright", "online", "lightroom", "pdf"],
};

export const hasTool = (formatId, tool) => (TOOLS[formatId] ?? []).includes(tool);

/* The products a given tool CAN make, named the way the page names them,
   so a card that has to say no can say what to do instead. */
export const formatsWithTool = (tool, route, use) =>
  formatsFor(route, use).filter(id => hasTool(id, tool)).map(id => CATALOG[id].label);

/* The selling route this page leads to. Its seller path ends at an Instant
   Store, so that is what "to Sell" is filtered against. If the page ever
   forks to the other channels, this stops being a constant. */
export const SELLING_CHANNEL = "checkout_link";

/* What a channel actually sells, named for copy rather than for a table:
   "Photo books, trade books and magazines". Read off `sellChannels`, so a
   product leaving a channel — as notebooks did on 2026-08-25 — rewrites
   every sentence built on this at once, and no page can promise something
   the catalogue does not. Sentence case, because it lands mid-sentence. */
export const sellableIn = (channel = SELLING_CHANNEL) =>
  Object.values(CATALOG)
    .filter(f => (f.sellChannels || []).includes(channel))
    .map(f => f.label.toLowerCase());

export const sellableSentence = (channel = SELLING_CHANNEL) => {
  const names = sellableIn(channel);
  if (!names.length) return "";
  const list = names.length === 1
    ? names[0]
    : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  return list.charAt(0).toUpperCase() + list.slice(1);
};


/* ── The three routes ──
   What the headline dropdown asks is where the copies END UP, and who
   pays for them. The three answers are parallel, exclusive and complete:

     sell       — other people buy, one copy at a time, printed on demand
     keep       — you buy, you keep it (or display it, or give it)
     distribute — you buy many, and hand them out or sell them yourself

   An earlier version mixed this with a second question — keepsake,
   display, gift — which is not the same kind of answer: those change
   what we RECOMMEND, never what the page does. They now live one level
   down, as `use`, and only under `keep`. See INTENT_TUNING. */
/* ── Channel rules that depend on the SELECTION, not the format ──
   From /self-publish, 2026-08-19: Amazon takes "photo books (layflat not
   included)". Layflat is a paper choice, so eligibility turns on what is
   configured rather than on which product it is — a photo book qualifies
   or not depending on the stock. `sellChannels` cannot express that, so
   it lives here and `channelsFor` applies both.

   The right place to say this is beside the paper, not in a footnote
   after the sale. */
const CHANNEL_RULES = {
  amazon: {
    /* CORRECTED 2026-08-19 from the help centre, "Types of Blurb books you
       can sell on Amazon". There are TWO routes to Amazon and the marketing
       pages never distinguish them:

         DIRECT — Blurb lists it on Amazon.com. Photo books only, and only
                  these five sizes: Large Landscape, Large Square, Standard
                  Landscape, Standard Portrait, Small Square. LAYFLAT AND
                  MINI SQUARE ARE BOTH EXCLUDED. This channel is `amazon`.
         GLOBAL RETAIL NETWORK — trade books 5×8, 6×9, 8×10 reach Amazon
                  through Ingram's network, alongside 39,000+ retailers.
                  That is the `ingram` channel, and it is why the verticals
                  say "Amazon, and over 39,000 other retailers" — correct
                  copy that we mistook for an error.

       Magazines have no Amazon route at all, direct or otherwise. */
    ok: (formatId, sel) =>
      !String(sel?.paper || "").includes("layflat") && sel?.size !== "small_square",
    why: "Direct Amazon listing excludes layflat books and the 5×5 Mini Square. Trade books reach Amazon through Ingram instead.",
  },
};

/* Every channel a specific configuration can actually be sold through. */
export function channelsFor(formatId, sel) {
  const listed = CATALOG[formatId]?.sellChannels || [];
  return listed.filter(id => {
    const rule = CHANNEL_RULES[id];
    return !rule || rule.ok(formatId, sel);
  });
}

/* Why a channel dropped out, so the UI can say so rather than hide it. */
export const channelBlockedBecause = (channelId, formatId, sel) => {
  const listed = CATALOG[formatId]?.sellChannels || [];
  if (!listed.includes(channelId)) {
    return `${CATALOG[formatId].label} are not sold through this channel.`;
  }
  const rule = CHANNEL_RULES[channelId];
  return rule && !rule.ok(formatId, sel) ? rule.why : null;
};

export const ROUTES = ["sell", "keep", "distribute"];
export const USES = ["keepsake", "display", "gift"];

/* Where the self-serve quantity ladder ends and Large Order Services
   begins — ProductList 2025's last rung reads "100+ Books – blurb.com".
   The distribute route opens here rather than at one copy. */
export const BULK_MIN = 100;

/* Which product types are offered, given the route and (under keep) the use.

   Three different filters, and they are not the same kind of rule:

     · SELL narrows by CHANNEL. A PDF is perfectly orderable for
       yourself; it just cannot be sold through an Instant Store.
     · KEEP narrows by what the product IS. Wall art is for hanging and
       for giving — "keepsake" is a book word. A notebook is a book you
       write in, so it is a keepsake or a gift and nothing else.
     · DISTRIBUTE narrows to what can be printed in numbers AND what Large
       Order Services actually quotes. Everything physical passes the
       first test — a PDF cannot be handed out in a box — but wall art
       isn't sold at all (see `sellChannels` above) and notebooks are
       unconfirmed on the second (Anain, 2026-09-01: "not sure we sell
       those in LOS"), so `bulk: false` withdraws both here specifically,
       the same shape as `sellChannels` narrowing SELL. The notebook case
       is unconfirmed rather than decided — flip it once someone checks.

   Order follows CATALOG, so the everyday products stay first. */
export const formatsFor = (route, use = "keepsake", channel = SELLING_CHANNEL) => {
  /* `offered: false` withdraws a product from every row at once — see the
     PDF entry above. Not the same rule as the three below: those say which
     of the products we offer suit what you are doing. */
  const offered = FORMAT_IDS.filter(id => CATALOG[id].offered !== false);
  if (route === "sell") {
    return offered.filter(id => (CATALOG[id].sellChannels || []).includes(channel));
  }
  if (route === "distribute") {
    return offered.filter(id => !CATALOG[id].digital && CATALOG[id].bulk !== false);
  }
  return offered.filter(id => {
    const only = CATALOG[id].intentions;
    return !only || only.includes(use);
  });
};

/* Upgrades. "REMOVE BLURB LOGO +25%" in the calculator design is renamed
   WHITE LABEL here: the same option, framed as something the seller gains
   rather than pays to take away. It matches the "white label packaging"
   language already in the seller brief. Naming sits with Ana's copy work.

   NOT CHARGED FOR (Ana, 2026-09-01): there is no Instant Store upcharge for
   white label, so `value` is 0 rather than the live page's +25%. It stayed
   `kind: "pct"` so a real markup can come back here without touching the
   pricing math elsewhere.

   End sheets are deliberately NOT here. They are a finishing choice, not a
   variable that shapes the decision on this page, so they belong in Add to
   Cart. (blurb.com prices them at US $3.00, and charcoal linen at $6.00.) */
export const ADDONS = [
  {
    id: "whitelabel", label: "White label", detail: "Included",
    benefit: "The finished book carries only your brand.",
    kind: "pct", value: 0, src: "product",
  },
];

/* Blurb publishes no fulfilment pricing. The brief says it runs "up to 70%
   below list" at roughly a 60% contribution margin, so this stands in for
   the real number. Change it here, once. */
export const FULFILMENT_FACTOR = 0.35;

const comboSets = {};
const comboSet = fam => (comboSets[fam] ||= combos(fam));

export const isAvailable = (formatId, sel) => {
  const f = CATALOG[formatId];
  if (f.flat) return true;
  /* Wall art is priced material × size, not cover × size_paper. Plenty of
     the grid is empty — no 20×20 metal, no 5×5 anything. */
  if (f.fam === "wall_art") return PRICING.wallArt[sel.material]?.[sel.size] != null;
  return comboSet(f.fam).has(`${sel.cover}|${sel.size}_${sel.paper}`);
};

/* Which group gives way when a choice makes the rest impossible. */
const REPAIR_ORDER = {
  wall_art: ["size", "material"],
  default: ["paper", "size", "cover"],
};

/* Everything buildable for the current selection, so the UI can disable the
   rest instead of quoting a price that does not exist. */
export const availableFor = (formatId, sel, groupId) => {
  const f = CATALOG[formatId];
  if (f.flat) return new Set(f.groups[0].options.map(o => o.id));
  const ok = new Set();
  for (const o of f.groups.find(g => g.id === groupId).options) {
    if (isAvailable(formatId, { ...sel, [groupId]: o.id })) ok.add(o.id);
  }
  return ok;
};

export const unitPrice = (formatId, sel) => {
  const f = CATALOG[formatId];
  if (f.fam === "magazines") return PRICING.magazines[sel.grade] ?? 0;
  if (f.fam === "ebooks")    return PRICING.ebooks[sel.grade] ?? 0;
  if (f.fam === "wall_art")  return PRICING.wallArt[sel.material]?.[sel.size] ?? null;
  return PRICING.families[f.fam]?.[sel.cover]?.[`${sel.size}_${sel.paper}`] ?? null;
};

export const perPagePrice = (formatId, sel) => {
  const f = CATALOG[formatId];
  if (f.pageless) return 0;
  if (f.flat) {
    const opt = f.groups[0].options.find(o => o.id === sel.grade);
    return opt?.pageKey ? (PRICING.additionalPages[opt.pageKey] ?? 0) : 0;
  }
  return PRICING.additionalPages[`${sel.size}_${sel.paper}`] ?? 0;
};

export const pageLimit = (formatId, sel) => {
  const f = CATALOG[formatId];
  if (f.pageless) return 0;
  const g = f.flat ? f.groups[0] : f.groups.find(x => x.id === "paper");
  const opt = g.options.find(o => o.id === (f.flat ? sel.grade : sel.paper));
  return opt?.maxPages ?? 440;
};

/* First buildable default for a format. */
export function defaultSelection(formatId) {
  const f = CATALOG[formatId];
  if (f.flat) return { grade: f.groups[0].options[0].id, pages: f.basePages, qty: 1, addons: [] };

  if (f.fam === "wall_art") {
    const materials = f.groups.find(g => g.id === "material").options;
    const sizes = f.groups.find(g => g.id === "size").options;
    for (const m of materials) for (const s of sizes) {
      if (isAvailable(formatId, { material: m.id, size: s.id })) {
        return { material: m.id, size: s.id, pages: 0, qty: 1, addons: [] };
      }
    }
  }

  const sizes = f.groups.find(g => g.id === "size").options;
  const covers = f.groups.find(g => g.id === "cover").options;
  const papers = f.groups.find(g => g.id === "paper").options;
  for (const c of covers) for (const s of sizes) for (const p of papers) {
    const sel = { size: s.id, cover: c.id, paper: p.id };
    if (isAvailable(formatId, sel)) return { ...sel, pages: f.basePages, qty: 1, addons: [] };
  }
  return { size: sizes[0].id, cover: covers[0].id, paper: papers[0].id, pages: f.basePages, qty: 1, addons: [] };
}

/* Changing one choice can invalidate the others — repair by keeping the
   thing just chosen and moving whatever else has to move. */
export function reconcile(formatId, sel, changedGroup) {
  const f = CATALOG[formatId];
  if (f.flat || isAvailable(formatId, sel)) return sel;
  const order = (REPAIR_ORDER[f.fam] ?? REPAIR_ORDER.default).filter(g => g !== changedGroup);
  for (const g of order) {
    const options = f.groups.find(x => x.id === g).options;
    for (const o of options) {
      const candidate = { ...sel, [g]: o.id };
      if (isAvailable(formatId, candidate)) return candidate;
    }
  }
  return sel;
}

/* Steps that follow from a choice rather than offering one — a magazine's
   paper and cover. Presented like any other step, with the single option
   already selected, so nothing about the page changes shape. */
export const derivedSteps = (formatId, sel) => {
  const f = CATALOG[formatId];
  if (!f.flat || !sel) return [];
  return f.groups[0].options.find(o => o.id === sel.grade)?.derived ?? [];
};

/* ────────────────────────────────────────────────────────────────
   PROJECT KINDS — what someone is making, in their words.

   The live /getting-started headline already offers these: Cookbook,
   Children's Book, Comic Book, Graphic Novel, Novel, Poetry Book,
   Portfolio, Photography Book, Art Book, Photo Album, Wedding Album,
   Travel Book, Yearbook, Instagram Book, Layflat Photo Book, Notebook.
   An earlier pass of this prototype replaced them with PRODUCT types —
   Photo Book, Trade Book, Magazine — which is Blurb's manufacturing
   vocabulary, not the customer's. Someone with a manuscript knows they
   have a cookbook; they do not know they want a trade book.

   So the kind is the QUESTION and the product type is the ANSWER. Each
   kind seeds a whole specification, not just a format, so the price on
   screen is real from the first click. Everything stays changeable —
   the recommendation leads the row, it does not shorten it.

   The recommendation depends on the INTENTION too. A wedding album as a
   keepsake wants the thickest layflat paper Blurb sells; almost nothing
   is worth selling on that stock. Where selling changes the answer, a
   kind carries a `sell` override and a reason given in money.

   Notebook is absent: Notebooks & Journals is a product family this
   prototype does not model, and inventing specs for it would put made-up
   figures next to real ones. ──────────────────────────────────────── */
export const PROJECT_KINDS = [
  /* ── Books — text first, pictures second ── */
  {
    id: "novel", label: "Novel", group: "Books",
    rec: { formatId: "trade", sel: { size: "large_text", cover: "softcover", paper: "standard_trade_bw_matte_paper" } },
    why: "Trade books are built for text, and US Trade is the size most novels are printed at.",
    sell: { formatId: "trade", sel: { size: "large_text", cover: "softcover", paper: "economy_trade_bw_matte_paper" } },
    whySell: "Economy black & white is where a novel's margin comes from — readers judge the cover, not the stock.",
  },
  {
    id: "poetry", label: "Poetry Book", group: "Books",
    rec: { formatId: "trade", sel: { size: "pocket_text", cover: "softcover", paper: "standard_trade_bw_matte_paper" } },
    why: "Pocket size suits short lines, and keeps a slim book from looking underfilled.",
  },
  {
    id: "cookbook", label: "Cookbook", group: "Books",
    rec: { formatId: "trade", sel: { size: "standard_portrait_true8x10", cover: "imagewrap", paper: "standard_trade_matte_paper" } },
    why: "Colour photography beside long text, at a size that stays open on a worktop.",
    sell: { formatId: "trade", sel: { size: "standard_portrait_true8x10", cover: "softcover", paper: "economy_trade_matte_paper" } },
    whySell: "Softcover and economy colour bring your cost down far enough to price against shop cookbooks.",
  },
  {
    id: "childrens", label: "Children's Book", group: "Books",
    rec: { formatId: "trade", sel: { size: "standard_portrait_true8x10", cover: "imagewrap", paper: "standard_trade_matte_paper" } },
    why: "Colour on every page, and a hardcover that survives being read at bedtime.",
    sell: { formatId: "trade", sel: { size: "standard_portrait_true8x10", cover: "softcover", paper: "economy_trade_matte_paper" } },
    whySell: "Softcover halves your cost, which matters when you are pricing against picture books.",
  },
  {
    id: "comic", label: "Comic Book", group: "Books",
    rec: { formatId: "trade", sel: { size: "standard_portrait_true8x10", cover: "softcover", paper: "standard_trade_matte_paper" } },
    why: "Full-colour pages at the proportions a comic is drawn to.",
  },
  {
    id: "graphicnovel", label: "Graphic Novel", group: "Books",
    rec: { formatId: "trade", sel: { size: "standard_portrait_true8x10", cover: "imagewrap", paper: "standard_trade_matte_paper" } },
    why: "Longer than a comic, so it earns a hardcover and a spine that holds up.",
    sell: { formatId: "trade", sel: { size: "standard_portrait_true8x10", cover: "softcover", paper: "economy_trade_matte_paper" } },
    whySell: "Softcover is what most graphic novels sell as, and it leaves room to price competitively.",
  },

  /* ── Photography and art — the picture is the point ── */
  {
    id: "photography", label: "Photography Book", group: "Photography and art",
    rec: { formatId: "photo", sel: { size: "large_format_landscape", cover: "dustjacket", paper: "premium_paper_lustre" } },
    why: "The largest landscape Blurb prints, on lustre — the closest thing to a print on the page.",
    sell: { formatId: "photo", sel: { size: "standard_landscape", cover: "imagewrap", paper: "premium_paper" } },
    whySell: "A smaller landscape on premium matte keeps the book gallery-quality at a cost a buyer will meet.",
  },
  {
    id: "portfolio", label: "Portfolio", group: "Photography and art",
    rec: { formatId: "photo", sel: { size: "standard_landscape", cover: "imagewrap", paper: "premium_paper_lustre" } },
    why: "Landscape suits most work, and an ImageWrap puts your own image on the cover.",
  },
  {
    id: "artbook", label: "Art Book", group: "Photography and art",
    rec: { formatId: "photo", sel: { size: "large_square", cover: "imagewrap", paper: "pro_uncoated_paper" } },
    why: "Uncoated Mohawk holds paint and pencil the way coated stock flattens them.",
  },
  {
    id: "travel", label: "Travel Book", group: "Photography and art",
    rec: { formatId: "photo", sel: { size: "standard_landscape", cover: "softcover", paper: "standard_paper" } },
    why: "Landscape for the views, softcover because a travel book gets carried.",
  },
  {
    id: "layflat", label: "Layflat Photo Book", group: "Photography and art",
    rec: { formatId: "photo", sel: { size: "large_square", cover: "imagewrap", paper: "premium_matte_layflat_paper" } },
    why: "Layflat is the only binding that lets an image cross the gutter without losing its middle.",
  },

  /* ── Personal — made for one shelf, usually ── */
  {
    id: "photoalbum", label: "Photo Album", group: "Personal",
    rec: { formatId: "photo", sel: { size: "square", cover: "imagewrap", paper: "standard_layflat_paper" } },
    why: "Square and layflat, so a two-page spread reads as one picture.",
  },
  {
    id: "wedding", label: "Wedding Album", group: "Personal",
    rec: { formatId: "photo", sel: { size: "large_square", cover: "imagewrap", paper: "pro_photo_layflat_paper" } },
    why: "The heaviest layflat stock Blurb sells — this is the one book that gets kept for fifty years.",
  },
  {
    id: "yearbook", label: "Yearbook", group: "Personal",
    rec: { formatId: "photo", sel: { size: "standard_portrait", cover: "softcover", paper: "standard_paper" } },
    why: "Portrait for the class photographs, softcover because yearbooks are printed in numbers.",
    sell: { formatId: "photo", sel: { size: "standard_portrait", cover: "softcover", paper: "standard_paper" } },
    whySell: "Standard paper and softcover keep the per-copy cost low, and yearbooks sell by volume.",
  },
  {
    id: "instagram", label: "Instagram Book", group: "Personal",
    rec: { formatId: "photo", sel: { size: "small_square", cover: "softcover", paper: "standard_paper" } },
    why: "Square and small, matching the shape the pictures were taken in.",
  },
];

/* ── What the INTENTION changes ──
   Before this, only "to Sell" did anything: it filtered PDFs out and
   turned the calculator into cost/price/profit. Keepsake, Display and
   Gift rendered identically, which made three quarters of the dropdown
   decorative — you were asked a question whose answer was ignored.

   Same logic as the kinds, then. The kind says what the book IS; the
   intention says what it is FOR, and each one wants something different
   from the same book. Written as ordered preferences rather than a
   kind × intention table: 15 kinds by 4 intentions is 60 hand-written
   specs to keep true, and a rule states the reasoning where a table
   only stores its results.

   Keepsake is deliberately absent — the recommendation on each kind is
   already written for someone making one for themselves, so it is the
   base case rather than a variation on one. */
export const INTENT_TUNING = {
  /* Intention tunes the FINISH, never the size. Size belongs to the kind:
     an Instagram book is small and square, and a version of it printed
     13×11 to "display" better is not an Instagram book any more. An early
     version of this table preferred larger sizes for display and turned a
     layflat album into a standard landscape. Cover and paper only. */
  display: {
    prefer: { cover: ["dustjacket", "imagewrap"] },
    note: "Bound to sit face-out — a display copy is looked at more often than it is opened.",
  },
  gift: {
    prefer: { cover: ["imagewrap", "dustjacket"] },
    note: "Hardcover, because a gift is judged before it is opened.",
  },
  sell: {
    /* Only reached when a kind has no `sell` override of its own. */
    prefer: { cover: ["softcover"] },
    note: "Softcover keeps your cost down, which is where the margin comes from.",
  },
  distribute: {
    prefer: {
      cover: ["softcover"],
      paper: ["economy_trade_matte_paper", "economy_trade_bw_matte_paper", "standard_paper"],
    },
    note: "Printed in numbers, so the cheaper stock is usually the right call — it multiplies by every copy.",
  },
};

/* Move a selection towards a wishlist, one group at a time, keeping only
   what the price matrix can actually build.

   A preference is applied only when it changes NOTHING ELSE. Repair is
   the right behaviour when a person picks an option — keep their choice,
   move what has to move — but a preference is not a choice, and letting
   one drag a size or a paper along with it is how a 5×5 Instagram book
   quietly became a 7×7 on the way to a hardcover. If the upgrade cannot
   be had on its own, the kind keeps what it had. */
function applyPrefer(formatId, sel, prefer) {
  const f = CATALOG[formatId];
  if (f.flat || !prefer) return sel;

  let out = { ...sel };
  for (const [groupId, wishlist] of Object.entries(prefer)) {
    const group = f.groups.find(g => g.id === groupId);
    if (!group) continue;
    for (const want of wishlist) {
      if (!group.options.some(o => o.id === want)) continue;
      const candidate = { ...out, [groupId]: want };
      if (isAvailable(formatId, candidate)) { out = candidate; break; }
    }
  }
  return out;
}

/* Turn a kind and an intention into a real, buildable specification.

   The recommendation is written by hand, so it goes through the same
   availability repair as any other choice — a spec that does not exist in
   the price matrix must never reach the calculator. */
export function seedFor(kindId, route, use = "keepsake") {
  const kind = PROJECT_KINDS.find(k => k.id === kindId);
  if (!kind) return null;

  /* Under `keep` the tuning comes from the use, not the route — keepsake
     is the base case each kind is already written for. */
  const key = route === "keep" ? use : route;

  /* A kind that has thought about selling beats the generic rule. */
  const bespoke = route === "sell" && kind.sell;
  const rec = bespoke ? kind.sell : kind.rec;
  const tuning = bespoke ? null : INTENT_TUNING[key];

  let sel = { ...defaultSelection(rec.formatId), ...rec.sel };
  let tuned = false;
  if (!CATALOG[rec.formatId].flat) {
    sel = reconcile(rec.formatId, sel, "size");
    const after = applyPrefer(rec.formatId, sel, tuning?.prefer);
    /* The upgrade is not always on offer — a 5×5 has no hardcover, and
       large square uncoated has no softcover. Where it could not be had,
       the note must not claim it was: nothing changed, so say nothing. */
    tuned = JSON.stringify(after) !== JSON.stringify(sel);
    sel = after;
    const cap = pageLimit(rec.formatId, sel);
    if (sel.pages > cap) sel.pages = cap;
  }

  const why = bespoke ? kind.whySell : kind.why;
  return { formatId: rec.formatId, sel, why, note: tuned ? tuning.note : null };
}

export const selectedOption = (formatId, groupId, sel) => {
  const g = CATALOG[formatId].groups.find(x => x.id === groupId);
  return g ? g.options.find(o => o.id === sel[groupId]) : null;
};

export function priceFor(formatId, sel) {
  const f = CATALOG[formatId];
  const base = unitPrice(formatId, sel) ?? 0;
  const perPage = perPagePrice(formatId, sel);
  const extra = f.digital ? 0 : Math.max(0, (sel.pages || 0) - f.basePages);
  const extraPages = extra * perPage;

  let unit = base + extraPages;
  let addons = 0;
  for (const id of sel.addons || []) {
    const a = ADDONS.find(x => x.id === id);
    if (!a) continue;
    addons += a.kind === "pct" ? unit * a.value : a.value;
  }
  unit += addons;

  const tier = f.tiers.find(t => sel.qty >= t.min) || null;
  const subtotal = unit * sel.qty;
  const total = tier ? subtotal * (1 - tier.pct) : subtotal;
  return { base, unit, perPage, extraPages, addons, tier, subtotal, total, available: unitPrice(formatId, sel) !== null };
}

/* ── Sell and distribute ──
   There are three ways a book leaves Blurb, and they are not variations
   on each other:

     1. YOU BUY IT — for yourself, to display, to give. That is the
        "For yourself" half of the intention dropdown, and it is the only
        one where the person paying and the person keeping it are the same.
     2. PRINT ON DEMAND — someone else buys, we print and ship each copy.
        No stock, no money up front, and a different cut per channel.
     3. BULK — you buy the stock and distribute it yourself. You pay up
        front and carry the risk; nobody takes a cut of the sale, because
        Blurb is not part of it.

   Only 2 and 3 are selling, so only they are compared here. The channel
   is the biggest single lever on a seller's margin — bigger than paper,
   bigger than page count — so it belongs beside the ladder rather than
   in a help page.

   Fee structures are Blurb's own words, from /amazon and /ingram. Only
   Amazon's is a published NUMBER; Ingram's trade discount is set by the
   seller and 55% is the trade convention, not a Blurb figure. Anything
   uncertain is marked so the panel can say which is which.

   `net(price, cost)` returns what the seller keeps on one copy, or null
   where the channel cannot be computed from a list price at all. */
export const SELL_CHANNELS = [
  {
    /* ── Renamed: Instant Store, 2026-08-24 (Anain) ──
       Called "checkout links" until then, and the id and the channel key
       (`checkout_link`) still are — renaming those would touch every
       product's sellChannels for no gain, and the old name is what the
       source files and the board still say. Only what a seller reads
       changes. */
    id: "link", name: "Instant Store", isNew: true, mode: "pod",
    buyerPays: "Your price, plus shipping",
    takes: "Nothing published",
    paid: "PayPal, at a set cadence",
    suits: "An audience and no shop — a newsletter, a talk, a stall, a bio link.",
    src: "guess",
    net: (price, cost) => price - cost,
  },
  {
    id: "bookstore", name: "Blurb Bookstore", mode: "pod",
    buyerPays: "Your list price, plus shipping",
    takes: "No listing fee",
    paid: "Monthly",
    suits: "A listing without running anything yourself.",
    src: "live",
    net: (price, cost) => price - cost,
  },
  {
    id: "amazon", name: "Amazon", mode: "pod",
    buyerPays: "Your list price",
    /* Blurb's own words on /amazon: "Amazon's distribution fee ($1.35 per
       book + 15% of your list price)". The one published fee on the site. */
    takes: "US $1.35 + 15% of list",
    /* Also /amazon, and more specific than the "up to 60 days" we had:
       "After Amazon's 30-day return window ... once you hit the minimum
       payment threshold, we'll send your payment by PayPal or check
       within 15-45 days." */
    paid: "30-day returns window, then 15–45 days by PayPal or check",
    suits: "Reach over margin — amazon.com only, and photo books only.",
    src: "live",
    net: (price, cost) => price - cost - (1.35 + price * 0.15),
  },
  {
    id: "ingram", name: "Ingram — the Global Retail Network", mode: "pod",
    buyerPays: "Whatever the retailer decides",
    /* SOURCED 2026-08-19, help centre, "How to sell your Trade Book on
       Amazon and other retail sites": the dashboard calls this the
       WHOLESALE DISCOUNT, and "some retailers will only accept books with
       a 55% discount, so selecting a 55% discount will ensure the broadest
       exposure". So 55% is Blurb's own recommendation, not our guess.

       Note the vocabulary: "wholesale discount" is Blurb's term for the
       RETAILER's cut. That is exactly why it must never be reused for the
       seller's fulfilment price — the collision is already in the product,
       not just on /ingram. */
    takes: "The wholesale discount you set — 55% for the widest reach",
    paid: "Up to four months. Two weeks before it appears on Amazon.",
    /* This is also how a TRADE book reaches Amazon. Worth saying, because
       a seller comparing "Amazon" against "Ingram" is not choosing between
       two audiences — Ingram contains Amazon. */
    suits: "Bookshops, libraries and 39,000+ retailers — Amazon among them.",
    src: "live",
    net: (price, cost) => price * 0.45 - cost,
  },
  {
    id: "api", name: "RPI Print API", mode: "pod",
    /* SETTLED 2026-08-18: a way to sell, not a candidate for one — how a
       business connects its own store to Blurb's print service, distinct
       from Large Order Services (you buy the stock and distribute it).

       RESETTLED, design review 2026-08-26 (item 23): the 8/21 pod's "not
       included in the selling tool" only ever meant it stays off the SELL
       CARD GRID (still true — see SELL_CARDS below), not off the
       comparison table. Ana asked for both this and Large Order Services in
       the comparison and on a larger selling overview, so both are compared
       here now. The card grid stays at four; the table compares six.

       Renamed to match the nav (item 12/27): RPI is the outer layer, Blurb
       the print network inside it, not the reverse. Pricing stays on
       rpiprint.com (item 5e) — there is no single calculator covering both,
       so nothing here computes a number for it. */
    buyerPays: "Whatever your own store charges",
    takes: "Nothing — you pay RPI to print, not a per-sale cut",
    paid: "Through your own store",
    suits: "You already have a storefront and want RPI's network to print behind it.",
    src: "live",
    net: () => null,   // no list price to work from
  },
  {
    id: "bulk", name: "Large Order Services", mode: "bulk",
    buyerPays: "Whatever you charge, wherever you sell it",
    takes: "Nothing — Blurb is not in the sale",
    paid: "Immediately, by whoever buys from you",
    suits: "Events, launches, a stall, a shop that buys from you directly.",
    src: "guess",
    /* Quoted, not listed. The self-serve ladder ends at 100+ copies and
       hands over, so there is no rate here to compute from — and a number
       would be worse than none: it would imply the discount is fixed.

       In the comparison table now too (design review item 23, 2026-08-26) —
       see the note on the "api" entry above. */
    net: () => null,
  },
];

/* The seller's cost, and the floor their price is allowed to sit on. */
export const sellerCost = (formatId, sel) => priceFor(formatId, sel).unit * FULFILMENT_FACTOR;
export const minSellPrice = (formatId, sel) => Math.ceil(sellerCost(formatId, sel) * 100) / 100;

export const money = n => `US $${n.toFixed(2)}`;

/* ── "From" prices, computed rather than typed ──
   The cheapest buildable configuration of a family, at its base page count.
   Nothing else on blurb.com does this: /pricing types its from-prices, the
   home page types different ones again, and the verticals render a third
   set from a real binding. On 21 Aug a trade book was "from $3.99" on
   /pricing, "from $4.99" on the home page, and $2.99 wherever the price
   came from the matrix — which is ticket T7 on the board.

   So this is the fix being demonstrated, not a new number: one definition
   of "from", derived from the same matrix every other price here uses.
   Expect it to read lower than the live marketing pages. That gap IS the
   finding. */
export function fromPrice(formatId) {
  const f = CATALOG[formatId];
  if (!f) return null;

  if (f.flat) {
    /* Magazines and PDFs are priced by grade. Only offered grades count —
       PRICING carries an economy magazine that the page does not sell. */
    const prices = f.groups[0].options
      .map(o => unitPrice(formatId, { grade: o.id }))
      .filter(n => n != null);
    return prices.length ? Math.min(...prices) : null;
  }

  if (f.fam === "wall_art") {
    const materials = f.groups.find(g => g.id === "material").options;
    const sizes = f.groups.find(g => g.id === "size").options;
    const prices = [];
    for (const m of materials) for (const s of sizes) {
      const p = unitPrice(formatId, { material: m.id, size: s.id });
      if (p != null) prices.push(p);
    }
    return prices.length ? Math.min(...prices) : null;
  }

  const sizes  = f.groups.find(g => g.id === "size").options;
  const covers = f.groups.find(g => g.id === "cover").options;
  const papers = f.groups.find(g => g.id === "paper").options;
  const prices = [];
  for (const c of covers) for (const s of sizes) for (const p of papers) {
    const sel = { size: s.id, cover: c.id, paper: p.id };
    if (!isAvailable(formatId, sel)) continue;
    const price = unitPrice(formatId, sel);
    if (price != null) prices.push(price);
  }
  return prices.length ? Math.min(...prices) : null;
}

/* The same minimum, for ONE cover — what a catalogue page needs, because it
   lists a product per cover rather than per family: "Softcover Photo Book,
   starting at …" is fromPrice with the cover held fixed. Layflat is a PAPER
   in this model rather than a cover, so it is addressed the same way, by
   passing a paper predicate instead. Returns null when nothing in the matrix
   matches, which is the honest answer for a product we do not price. */
export function variantFromPrice(formatId, { cover, paperTest } = {}) {
  const f = CATALOG[formatId];
  if (!f || f.flat || f.fam === "wall_art") return fromPrice(formatId);

  const sizes  = f.groups.find(g => g.id === "size").options;
  const covers = f.groups.find(g => g.id === "cover").options;
  const papers = f.groups.find(g => g.id === "paper").options;
  const prices = [];
  for (const c of covers) {
    if (cover && c.id !== cover) continue;
    for (const s of sizes) for (const p of papers) {
      if (paperTest && !paperTest(p.id)) continue;
      const sel = { size: s.id, cover: c.id, paper: p.id };
      if (!isAvailable(formatId, sel)) continue;
      const price = unitPrice(formatId, sel);
      if (price != null) prices.push(price);
    }
  }
  return prices.length ? Math.min(...prices) : null;
}

/* How many sizes a family offers, for the "6 sizes — from US $12.00" line
   on the format cards. Wall art is counted the way /pricing counts it:
   8×10 and 10×8 are one size in two orientations, not two, which is how a
   twelve-key matrix becomes the seven the page advertises. */
export function sizeCount(formatId) {
  const f = CATALOG[formatId];
  if (!f) return 0;
  if (f.flat) return 1;
  const sizes = f.groups.find(g => g.id === "size")?.options ?? [];
  if (f.fam !== "wall_art") return sizes.length;
  const shapes = new Set(
    sizes.map(o => (o.dims.match(/\d+/g) || []).map(Number).sort((a, b) => a - b).join("×"))
  );
  return shapes.size;
}

/* ── Shipping ──────────────────────────────────────────────────────
   /shipping publishes no rates — it takes a destination and shows
   speeds, but carries no figures. So every rate below is INVENTED.
   The one real number is production time.

   Who pays matters, and it differs by intention:
     · maker  — shipping is part of what you pay, so it joins the total
     · seller — the BUYER pays it, so it never touches your margin
   ────────────────────────────────────────────────────────────────── */
export const PRINT_DAYS = { label: "4–5 business days", src: "live" };

export const SHIPPING = {
  src: "guess",
  /* All 67 destinations from blurb.com/shipping — scraped, not invented,
     and a reminder that the live page says "over 70 countries and
     territories" while its own list holds 67.

     The ZONES are ours: US domestic; Canada, Mexico and the Caribbean
     near; Europe intl; everywhere else far. Blurb publishes no rates at
     all, so the banding is a plausible shape, never a price list. */
  countries: [
    { id: "US", label: "United States", zone: "domestic", postal: "ZIP code", example: "94107" },
    { id: "AR", label: "Argentina", zone: "far" },
    { id: "AU", label: "Australia", zone: "far", postal: "Postcode", example: "2000" },
    { id: "AT", label: "Austria", zone: "intl" },
    { id: "BE", label: "Belgium", zone: "intl" },
    { id: "BM", label: "Bermuda", zone: "near" },
    { id: "BG", label: "Bulgaria", zone: "intl" },
    { id: "CA", label: "Canada", zone: "near", postal: "Postal code", example: "M5V 2T6" },
    { id: "KY", label: "Cayman Islands", zone: "near" },
    { id: "CL", label: "Chile", zone: "far" },
    { id: "CO", label: "Colombia", zone: "far" },
    { id: "HR", label: "Croatia", zone: "intl" },
    { id: "CY", label: "Cyprus", zone: "intl" },
    { id: "CZ", label: "Czech Republic", zone: "intl" },
    { id: "DK", label: "Denmark", zone: "intl" },
    { id: "EE", label: "Estonia", zone: "intl" },
    { id: "FI", label: "Finland", zone: "intl" },
    { id: "FR", label: "France", zone: "intl" },
    { id: "DE", label: "Germany", zone: "intl", postal: "Postleitzahl", example: "10115" },
    { id: "GR", label: "Greece", zone: "intl" },
    { id: "GP", label: "Guadeloupe (French territory)", zone: "intl" },
    { id: "HK", label: "Hong Kong", zone: "far" },
    { id: "HU", label: "Hungary", zone: "intl" },
    { id: "IS", label: "Iceland", zone: "intl" },
    { id: "IN", label: "India", zone: "far" },
    { id: "ID", label: "Indonesia", zone: "far" },
    { id: "IE", label: "Ireland", zone: "intl" },
    { id: "IL", label: "Israel", zone: "far" },
    { id: "IT", label: "Italy", zone: "intl" },
    { id: "JM", label: "Jamaica", zone: "near" },
    { id: "JP", label: "Japan", zone: "far" },
    { id: "LV", label: "Latvia", zone: "intl" },
    { id: "LT", label: "Lithuania", zone: "intl" },
    { id: "LU", label: "Luxembourg", zone: "intl" },
    { id: "MO", label: "Macao", zone: "far" },
    { id: "MY", label: "Malaysia", zone: "far" },
    { id: "MT", label: "Malta", zone: "intl" },
    { id: "MX", label: "Mexico", zone: "near" },
    { id: "FM", label: "Micronesia", zone: "far" },
    { id: "NL", label: "Netherlands", zone: "intl" },
    { id: "NZ", label: "New Zealand", zone: "far" },
    { id: "NO", label: "Norway", zone: "intl" },
    { id: "PY", label: "Paraguay", zone: "far" },
    { id: "PE", label: "Peru", zone: "far" },
    { id: "PH", label: "Philippines", zone: "far" },
    { id: "PL", label: "Poland", zone: "intl" },
    { id: "PT", label: "Portugal", zone: "intl" },
    { id: "RE", label: "Reunion (French territory)", zone: "intl" },
    { id: "RO", label: "Romania", zone: "intl" },
    { id: "BL", label: "Saint Barthelemy (French territory)", zone: "intl" },
    { id: "RS", label: "Serbia", zone: "intl" },
    { id: "SG", label: "Singapore", zone: "far" },
    { id: "SK", label: "Slovakia", zone: "intl" },
    { id: "SI", label: "Slovenia", zone: "intl" },
    { id: "ZA", label: "South Africa", zone: "far" },
    { id: "KR", label: "South Korea", zone: "far" },
    { id: "ES", label: "Spain", zone: "intl" },
    { id: "SE", label: "Sweden", zone: "intl" },
    { id: "CH", label: "Switzerland", zone: "intl" },
    { id: "TW", label: "Taiwan", zone: "far" },
    { id: "TH", label: "Thailand", zone: "far" },
    { id: "TR", label: "Turkey", zone: "far" },
    { id: "AE", label: "United Arab Emirates", zone: "far" },
    { id: "GB", label: "United Kingdom", zone: "intl", postal: "Postcode", example: "EC1A 1BB" },
    { id: "UY", label: "Uruguay", zone: "far" },
    { id: "VN", label: "Vietnam", zone: "far" },
    { id: "VG", label: "Virgin Islands (British)", zone: "near" },
  ],
  speeds: [
    { id: "economy",  label: "Economy",  days: [7, 10], poBox: true,  mult: 1 },
    { id: "standard", label: "Standard", days: [4, 6],  poBox: true,  mult: 1.6 },
    /* Couriers do not deliver to a P.O. Box, so express is withdrawn
       rather than quoted and refused later. */
    { id: "express",  label: "Express",  days: [2, 3],  poBox: false, mult: 2.8 },
  ],
  rates: {
    domestic: { base: 5.99,  per: 1.99 },
    near:     { base: 9.99,  per: 2.99 },
    intl:     { base: 14.99, per: 3.99 },
    far:      { base: 18.99, per: 4.99 },
  },
};

/* US states, for the margin estimator's "a buyer in ___ pays" line.

   They do NOT change the rate. Our placeholder shipping is zone-based,
   and Blurb publishes nothing finer, so a state cannot honestly move a
   number here. It is there because it changes WHO the illustration is
   about, which is the actual job on that page — a seller is picturing
   their buyers, not shipping a box to themselves. Sales tax does vary
   by state, and is settled at checkout. */
export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois",
  "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
  "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

export function shippingFor(countryId, speedId, qty = 1) {
  const country = SHIPPING.countries.find(c => c.id === countryId);
  const speed = SHIPPING.speeds.find(s => s.id === speedId);
  if (!country || !speed) return null;
  const rate = SHIPPING.rates[country.zone];
  return { cost: (rate.base + rate.per * Math.max(0, qty - 1)) * speed.mult, country, speed };
}

/* ── Dates, not day-counts ──
   The live page tells you printing takes "4-5 business days" and leaves
   you to do the arithmetic against a calendar. People plan around the
   day a box arrives, so this returns that day. Weekends are skipped;
   public holidays are not modelled, which is why every date is given as
   an estimate and a range. */
export function addBusinessDays(from, days) {
  const d = new Date(from);
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) left -= 1;
  }
  return d;
}

export const PRINT_RANGE = [4, 5];

/* Ordered today, printed, then shipped — the whole wait, end to end. */
export function arrivalWindow(speed, from = new Date()) {
  const [pMin, pMax] = PRINT_RANGE;
  const [sMin, sMax] = speed.days;
  return {
    earliest: addBusinessDays(from, pMin + sMin),
    latest: addBusinessDays(from, pMax + sMax),
    businessDays: [pMin + sMin, pMax + sMax],
  };
}

export const formatDay = d =>
  d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

/* "7–10 business days" — the speeds now carry a range, not a sentence. */
export const speedDays = s => `${s.days[0]}–${s.days[1]} business days`;
