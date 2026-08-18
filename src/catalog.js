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

const TRADE_PAPERS = {
  economy_trade_bw_matte_paper:  { label: "Economy Black & White",  spec: "Matte", maxPages: 440 },
  standard_trade_bw_matte_paper: { label: "Standard Black & White", spec: "Matte", maxPages: 440 },
  economy_trade_matte_paper:     { label: "Economy Colour",         spec: "Matte", maxPages: 440 },
  standard_trade_matte_paper:    { label: "Standard Colour",        spec: "Matte", maxPages: 440 },
};

const mk = (dict, ids) => ids.map(id => ({ id, ...dict[id] }));

/* DECISION, 2026-08-18: a PDF cannot be sold through a checkout link.
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
    sellChannels: ["checkout_link", "bookstore", "amazon", "ingram"],
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
    tiers: [{ min: 50, pct: 0.25 }, { min: 20, pct: 0.20 }, { min: 10, pct: 0.10 }],
    addons: ["whitelabel"],
    sellChannels: ["checkout_link", "bookstore", "amazon", "ingram"],
  },

  magazine: {
    fam: "magazines",
    label: "Magazines",
    short: "Magazine",
    blurb: "The magazine format offers a sleek solution to serial content.",
    basePages: 20,
    flat: true, // priced by grade, not by a size/paper matrix
    groups: [
      /* Magazines do not offer a paper choice — paper and cover are fixed per
         product, exactly as BookWright presents them: read-only fields, not
         pickers. Premium's specs are from BookWright; Economy's are not
         published there, so only what the price matrix names is shown. */
      {
        id: "grade", label: "Choose your magazine", options: [
          {
            id: "economy", label: "Economy Magazine", dims: "8.5×11 in (22×28 cm)",
            pageKey: "magazine_magazine_paper", maxPages: 240,
            fixed: [
              { label: "Paper", value: "Magazine paper" },
              { label: "Cover", value: "Softcover" },
            ],
          },
          {
            id: "premium", label: "Premium Magazine", dims: "8.5×11 in (22×28 cm)",
            pageKey: "magazine_velvet_paper", maxPages: 240,
            fixed: [
              { label: "Paper", value: "Matte 80#", detail: "80# Matte text (115 GSM). Vibrant printing on matte, velvet finish." },
              { label: "Cover", value: "Softcover", detail: "80# Semi-gloss (216 GSM) for heft and protection." },
            ],
          },
        ],
      },
    ],
    tiers: [{ min: 50, pct: 0.20 }, { min: 20, pct: 0.15 }, { min: 10, pct: 0.10 }],
    addons: ["whitelabel"],
    sellChannels: ["checkout_link", "bookstore", "amazon", "ingram"],
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
       one through a checkout link, so `checkout_link` is absent below.
       Other channels are listed because the decision was specific to
       checkout links; confirm before relying on it. */
    sellChannels: ["bookstore", "amazon", "ingram"],
  },
};

export const FORMAT_IDS = Object.keys(CATALOG);

/* The selling route this page leads to. Its seller path ends at a checkout
   link, so that is what "to Sell" is filtered against. If the page ever
   forks to the other channels, this stops being a constant. */
export const SELLING_CHANNEL = "checkout_link";

/* Which product types are offered for a given intention.

   Only the selling intention narrows the set, and it narrows by CHANNEL
   rather than by intention — a PDF is perfectly orderable for yourself,
   it just cannot be sold through a checkout link. */
export const formatsFor = (intention, channel = SELLING_CHANNEL) =>
  intention === "sell"
    ? FORMAT_IDS.filter(id => (CATALOG[id].sellChannels || []).includes(channel))
    : FORMAT_IDS;

/* Upgrades. "REMOVE BLURB LOGO +25%" in the calculator design is renamed
   WHITE LABEL here: the same option, framed as something the seller gains
   rather than pays to take away. It matches the "white label packaging"
   language already in the seller brief. Naming sits with Ana's copy work.

   End sheets are deliberately NOT here. They are a finishing choice, not a
   variable that shapes the decision on this page, so they belong in Add to
   Cart. (blurb.com prices them at US $3.00, and charcoal linen at $6.00.) */
export const ADDONS = [
  {
    id: "whitelabel", label: "White label", detail: "+25%",
    benefit: "The finished book carries only your brand.",
    kind: "pct", value: 0.25, src: "live",
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
  return comboSet(f.fam).has(`${sel.cover}|${sel.size}_${sel.paper}`);
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
  return PRICING.families[f.fam]?.[sel.cover]?.[`${sel.size}_${sel.paper}`] ?? null;
};

export const perPagePrice = (formatId, sel) => {
  const f = CATALOG[formatId];
  if (f.flat) {
    const opt = f.groups[0].options.find(o => o.id === sel.grade);
    return opt?.pageKey ? (PRICING.additionalPages[opt.pageKey] ?? 0) : 0;
  }
  return PRICING.additionalPages[`${sel.size}_${sel.paper}`] ?? 0;
};

export const pageLimit = (formatId, sel) => {
  const f = CATALOG[formatId];
  const g = f.flat ? f.groups[0] : f.groups.find(x => x.id === "paper");
  const opt = g.options.find(o => o.id === (f.flat ? sel.grade : sel.paper));
  return opt?.maxPages ?? 440;
};

/* First buildable default for a format. */
export function defaultSelection(formatId) {
  const f = CATALOG[formatId];
  if (f.flat) return { grade: f.groups[0].options[0].id, pages: f.basePages, qty: 1, addons: [] };

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
  const order = ["paper", "size", "cover"].filter(g => g !== changedGroup);
  for (const g of order) {
    const options = f.groups.find(x => x.id === g).options;
    for (const o of options) {
      const candidate = { ...sel, [g]: o.id };
      if (isAvailable(formatId, candidate)) return candidate;
    }
  }
  return sel;
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

/* The seller's cost, and the floor their price is allowed to sit on. */
export const sellerCost = (formatId, sel) => priceFor(formatId, sel).unit * FULFILMENT_FACTOR;
export const minSellPrice = (formatId, sel) => Math.ceil(sellerCost(formatId, sel) * 100) / 100;

export const money = n => `US $${n.toFixed(2)}`;

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
  countries: [
    { id: "US", label: "United States",  zone: "domestic", postal: "ZIP code",    example: "94107" },
    { id: "CA", label: "Canada",         zone: "near",     postal: "Postal code", example: "M5V 2T6" },
    { id: "GB", label: "United Kingdom", zone: "intl",     postal: "Postcode",    example: "EC1A 1BB" },
    { id: "DE", label: "Germany",        zone: "intl",     postal: "Postleitzahl",example: "10115" },
    { id: "AU", label: "Australia",      zone: "far",      postal: "Postcode",    example: "2000" },
  ],
  speeds: [
    { id: "economy",  label: "Economy",  days: "7–10 business days", mult: 1 },
    { id: "standard", label: "Standard", days: "4–6 business days",  mult: 1.6 },
    { id: "express",  label: "Express",  days: "2–3 business days",  mult: 2.8 },
  ],
  rates: {
    domestic: { base: 5.99,  per: 1.99 },
    near:     { base: 9.99,  per: 2.99 },
    intl:     { base: 14.99, per: 3.99 },
    far:      { base: 18.99, per: 4.99 },
  },
};

export function shippingFor(countryId, speedId, qty = 1) {
  const country = SHIPPING.countries.find(c => c.id === countryId);
  const speed = SHIPPING.speeds.find(s => s.id === speedId);
  if (!country || !speed) return null;
  const rate = SHIPPING.rates[country.zone];
  return { cost: (rate.base + rate.per * Math.max(0, qty - 1)) * speed.mult, country, speed };
}
