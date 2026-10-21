import React, { useMemo, useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { Select as BaseSelect } from "@base-ui/react/select";
import { Button, Badge, Checkbox, Chip, Select, Modal, ModalContent, ModalClose } from "@blurb/codex-react";
import { CheckIcon, CloseIcon, KeyboardArrowDownIcon, KeyboardArrowUpIcon } from "@blurb/codex-react/icons";
import { C, T, TYPE, R, FONT_DISPLAY } from "./tokens.js";
import { variantFromPrice, money, CATALOG, isAvailable } from "./catalog.js";
import { FormatRow } from "./FormatCards.jsx";

/* ────────────────────────────────────────────────────────────────
   /formats — the catalogue with filters and compare

   Filter panel (product type, use case, binding, price) with live counts,
   a result count, sort and removable chips; spec lines under every card;
   and a compare tray for up to three products.

   The "Save 25%" promo tile is not part of this view, so it does not skew
   the counts.

   DRAFT DATA. Everything in META below — use cases, binding, "best for"
   — is a first pass written for this prototype, not approved content.
   Use cases are the getting-started list minus Layflat Photo Book and
   Notebook, which are a binding and a product type.
   ──────────────────────────────────────────────────────────────── */

const SUBTLE = "#464646";
const SWATCH_IMG = { src: "https://assets.blurb.com/_astro/Swatch-Kit.FIDQju5I.png" };
const GIFT_IMG = {
  src: "https://assets.blurb.com/_astro/gift-box-promo-tablet-optimized.Dn78f72y.webp",
  mobile: "https://assets.blurb.com/_astro/gift-box-promo-mobile-optimized.Bdxh3SRF.webp",
};

const useWidth = () => {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return w;
};

/* ── Draft product data ── */
const USES = [
  "Wedding Album", "Photo Album", "Travel Book", "Photography Book", "Art Book", "Instagram Book",
  "Portfolio", "Cookbook", "Children's Book", "Novel", "Poetry Book", "Comic Book", "Graphic Novel", "Yearbook",
];
const TYPES = ["Photo books", "Books", "Magazines", "Notebooks"];
const BINDINGS = ["Softcover", "Hardcover", "Layflat", "Wire-O"];
const BUCKETS = ["Under $10", "$10–$30", "$30 and up"];
const bucketOf = p => (p < 10 ? BUCKETS[0] : p < 30 ? BUCKETS[1] : BUCKETS[2]);
const TYPE_OF = {
  "Photo Book": "Photo books", "Paperback & Hardcover Books": "Books", "Magazine": "Magazines",
  "Notebooks & Journals": "Notebooks",
};

const META = {
  "ImageWrap Hardcover Photo Book": {
    binding: ["Hardcover"], coverNote: "ImageWrap cover, printed edge to edge", best: "Keepsake albums and gifts",
    uses: ["Photo Album", "Wedding Album", "Travel Book", "Photography Book", "Art Book", "Instagram Book", "Portfolio"],
  },
  "Softcover Photo Book": {
    binding: ["Softcover"], coverNote: "Softcover", best: "Everyday albums and low-cost copies",
    uses: ["Photo Album", "Travel Book", "Instagram Book", "Portfolio"],
  },
  "Layflat Photo Book": {
    binding: ["Layflat"], coverNote: "Pages open fully flat", best: "Panoramic spreads and wedding albums",
    uses: ["Wedding Album", "Photography Book", "Art Book", "Portfolio", "Travel Book"],
  },
  "Hardcover Linen Photo Book with Dust Jacket": {
    binding: ["Hardcover"], coverNote: "Linen cover with dust jacket", best: "Heirloom albums",
    uses: ["Wedding Album", "Photo Album", "Travel Book"],
  },
  "Paperback Book": {
    binding: ["Softcover"], coverNote: "Softcover", best: "Novels, poetry, and low-cost proofs",
    uses: ["Novel", "Poetry Book", "Children's Book", "Cookbook", "Comic Book", "Graphic Novel", "Yearbook"],
  },
  "ImageWrap Hardcover Book": {
    binding: ["Hardcover"], coverNote: "ImageWrap cover, printed edge to edge", best: "Picture-led books",
    uses: ["Children's Book", "Cookbook", "Art Book", "Graphic Novel", "Yearbook", "Novel"],
  },
  "Linen Hardcover Book with Dust Jacket": {
    binding: ["Hardcover"], coverNote: "Linen cover with dust jacket", best: "Books meant to last on a shelf",
    uses: ["Novel", "Poetry Book", "Cookbook", "Children's Book"],
  },
  "Semi-gloss cover Magazine": {
    binding: ["Softcover"], coverNote: "Semi-gloss cover", best: "Portfolios, zines, and yearbooks",
    uses: ["Portfolio", "Art Book", "Yearbook", "Photography Book"],
  },
  "Softcover Notebook": {
    binding: ["Softcover"], coverNote: "Softcover", best: "Everyday writing and sketching", uses: [],
  },
  "ImageWrap Hardcover Notebook": {
    binding: ["Hardcover"], coverNote: "ImageWrap cover, printed edge to edge", best: "Gifts and keepsake journals", uses: [],
  },
  "Linen Hardcover Notebook with Dust Jacket": {
    binding: ["Hardcover"], coverNote: "Linen cover with dust jacket", best: "Premium journals", uses: [],
  },
  "Wire-O Notebook": {
    binding: ["Wire-O"], coverNote: "Wire-O spiral", best: "Notes that need to lie flat", uses: [],
  },
};

function prepare(products) {
  return products.filter(p => !p.promo).map(p => {
    const price = p.format ? variantFromPrice(p.format, { cover: p.cover, paperTest: p.paperTest }) : 0;
    return { ...p, ...META[p.name], price, type: TYPE_OF[p.cat], bucket: bucketOf(price) };
  });
}

/* ── Filtering ── */
const EMPTY = { type: [], use: [], binding: [], price: [] };
const matchFacet = (it, k, vals) => {
  if (!vals.length) return true;
  if (k === "type") return vals.includes(it.type);
  if (k === "price") return vals.includes(it.bucket);
  return it[k === "use" ? "uses" : "binding"].some(v => vals.includes(v));
};
const matches = (it, f, skip) => Object.keys(f).every(k => k === skip || matchFacet(it, k, f[k]));

/* Filter changes can animate: with `animate`, every change runs inside a
   View Transition, so cards that stay glide to their new place, cards that
   leave fade out, and new ones rise in (see the CSS in CatalogBrowser). Off
   for the sheet's draft, which changes behind a modal, and for anyone who
   prefers reduced motion; browsers without the API just update instantly. */
const canAnimate = () =>
  typeof document !== "undefined" && !!document.startViewTransition &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* With `persist`, the filters live in the address (?type=Books&binding=Hardcover
   &sort=low) so a filtered view can be shared, survives a reload, and is still
   there when a shopper comes back from a product. Written with replaceState, so
   filtering does not fill the back button with one entry per click. Values from
   the address are checked against the real lists; anything else is dropped. */
const FACET_VALUES = { type: TYPES, use: USES, binding: BINDINGS, price: BUCKETS };
const SORTS = ["featured", "low", "high"];
const fromUrl = () => {
  const q = new URLSearchParams(window.location.search);
  const f = Object.fromEntries(Object.keys(EMPTY).map(k => [k, q.getAll(k).filter(v => FACET_VALUES[k].includes(v))]));
  const sort = q.get("sort");
  return { f, sort: SORTS.includes(sort) ? sort : "featured" };
};
const toUrl = (f, sort) => {
  const u = new URL(window.location.href);
  Object.keys(EMPTY).forEach(k => u.searchParams.delete(k));
  u.searchParams.delete("sort");
  Object.entries(f).forEach(([k, vals]) => vals.forEach(v => u.searchParams.append(k, v)));
  if (sort !== "featured") u.searchParams.set("sort", sort);
  window.history.replaceState(window.history.state, "", u);
};

function useFilters(items, animate = false, persist = false) {
  const [start] = useState(() => (persist ? fromUrl() : { f: EMPTY, sort: "featured" }));
  const [f, setFRaw] = useState(start.f);
  const [sort, setSortRaw] = useState(start.sort);
  useEffect(() => { if (persist) toUrl(f, sort); }, [persist, f, sort]);
  const vt = fn => {
    if (!animate || !canAnimate()) return fn();
    document.startViewTransition(() => flushSync(fn));
  };
  const toggle = (k, v) => vt(() => setFRaw(s => ({ ...s, [k]: s[k].includes(v) ? s[k].filter(x => x !== v) : [...s[k], v] })));
  const remove = (k, v) => vt(() => setFRaw(s => ({ ...s, [k]: s[k].filter(x => x !== v) })));
  const clear = () => vt(() => setFRaw(EMPTY));
  const setF = v => vt(() => setFRaw(v));
  const setSort = v => vt(() => setSortRaw(v));
  const results = useMemo(() => {
    const r = items.filter(it => matches(it, f));
    if (sort === "low") return [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [items, f, sort]);
  const countFor = (k, v) => items.filter(it => matches(it, f, k) && matchFacet(it, k, [v])).length;
  /* Everything the other filters leave, whatever the type. */
  const countAll = () => items.filter(it => matches(it, f, "type")).length;
  const active = Object.values(f).reduce((n, a) => n + a.length, 0);
  /* For an empty result: each applied value that, taken off alone, brings products
     back, with how many, most first. */
  const relaxed = () => Object.entries(f)
    .flatMap(([k, vals]) => vals.map(v => ({ k, v, n: items.filter(it => matches(it, { ...f, [k]: f[k].filter(x => x !== v) })).length })))
    .filter(r => r.n > 0).sort((a, b) => b.n - a.n).slice(0, 3);
  return { f, setF, toggle, remove, clear, results, countFor, countAll, relaxed, active, sort, setSort, vt, raw: { setF: setFRaw, setSort: setSortRaw } };
}

/* ── Shared pieces ── */
const grid = (min = 300) => ({
  display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${min}px), 1fr))`,
  columnGap: 24, rowGap: 48, alignItems: "start",
});

/* `fixes` are the single filters whose removal brings products back
   (useFilters' `relaxed`), each one click away, with what it would show. */
const Empty = ({ onClear, fixes = [], onRemove }) => (
  <div style={{ padding: "64px 16px", textAlign: "center", display: "grid", gap: 12, justifyItems: "center" }}>
    <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 600 }}>No products match those filters</div>
    {fixes.length > 0 ? (
      <>
        <div style={{ color: SUBTLE }}>Take one off to see products again:</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {fixes.map(({ k, v, n }) => (
            <Button key={k + v} variant="outlined" intent="neutral" onClick={() => onRemove(k, v)}>
              Remove {v} ({n} {n === 1 ? "product" : "products"})
            </Button>
          ))}
        </div>
        <TextAction onClick={onClear}>Clear all filters</TextAction>
      </>
    ) : (
      <>
        <div style={{ color: SUBTLE }}>Try removing a filter, or start again.</div>
        <Button variant="outlined" onClick={onClear}>Clear all filters</Button>
      </>
    )}
  </div>
);

const H2 = ({ children, style }) => (
  <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["5xl"], fontWeight: 500, lineHeight: 1.2, margin: 0, color: C.gray950, ...style }}>
    {children}
  </h2>
);

/* ── Filters ──
   Mobile first. Below 960px the filters live in a bottom sheet opened from a
   sticky "Filters & sort" bar; the sheet edits a DRAFT and applies it on
   "Show N products", so a shopper can change several things without the
   page refreshing under them. From 960px up the panel is a sticky sidebar
   and filters apply instantly. */
const NAV_H = "var(--nav-h, 0px)";

function FilterGroup({ title, k, options, fx, collapsible, touch }) {
  const [more, setMore] = useState(false);
  const list = collapsible && !more ? options.slice(0, 6) : options;
  return (
    <fieldset id={"fg-" + k} style={{ border: 0, padding: 0, margin: 0, display: "grid", gap: 0, scrollMarginTop: 8 }}>
      <legend style={{ fontWeight: 700, fontSize: TYPE.base, padding: 0, marginBottom: 8 }}>{title}</legend>
      {list.map(o => {
        const n = fx.countFor(k, o);
        const on = fx.f[k].includes(o);
        return (
          <div key={o} style={{ minHeight: touch ? 44 : 32, display: "flex", alignItems: "center" }}>
            <Checkbox
              label={`${o} (${n})`}
              checked={on}
              disabled={n === 0 && !on}
              onCheckedChange={() => fx.toggle(k, o)}
            />
          </div>
        );
      })}
      {collapsible && options.length > 6 && (
        <div style={{ padding: touch ? "4px 0" : 0 }}><Button variant="text" size="small" onClick={() => setMore(!more)}>{more ? "Show fewer" : `Show all ${options.length}`}</Button></div>
      )}
    </fieldset>
  );
}

const FilterPanel = ({ fx, touch }) => (
  <div style={{ display: "grid", gap: 24 }}>
    <FilterGroup title="What are you making?" k="use" options={USES} fx={fx} collapsible touch={touch} />
    <FilterGroup title="Binding" k="binding" options={BINDINGS} fx={fx} touch={touch} />
    <FilterGroup title="Starting price" k="price" options={BUCKETS} fx={fx} touch={touch} />
  </div>
);

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "low", label: "Price: low to high" },
  { value: "high", label: "Price: high to low" },
];

/* One line of chips that scrolls sideways, so a sticky bar never grows taller
   as filters are added. */
function AppliedChips({ fx }) {
  /* The category cards already show the chosen product type and keep "Clear all"
     beside them, so repeating it here is noise. */
  const entries = Object.entries(fx.f).filter(([k]) => k !== "type");
  if (!entries.some(([, vals]) => vals.length)) return null;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", overflowX: "auto", whiteSpace: "nowrap", paddingBottom: 2, viewTransitionName: "vt-chips" }}>
      {entries.flatMap(([k, vals]) =>
        vals.map(v => <span key={k + v} style={{ flex: "none" }}><Chip label={v} onDelete={() => fx.remove(k, v)} /></span>))}
    </div>
  );
}

/* The filters panel on a phone. Codex has no bottom sheet, so this is the Codex
   Modal (the closest overlay): focus moves in and stays in, Escape closes, and
   the page behind does not scroll. The options scroll; the buttons do not. */
function Sheet({ onClose, children, footer, title = "Filters & sort" }) {
  return (
    <Modal open onOpenChange={o => !o && onClose()}>
      <ModalContent title={title} size="large">
        <ModalClose
          aria-label="Close"
          style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: 0, padding: 0, cursor: "pointer", color: "#292929", lineHeight: 0 }}
        >
          <CloseIcon size="lg" aria-hidden />
        </ModalClose>
        <div style={{ maxHeight: "calc(100dvh - 232px)", overflowY: "auto", paddingTop: 8 }}>{children}</div>
        <div style={{ display: "flex", gap: 8, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>{footer}</div>
      </ModalContent>
    </Modal>
  );
}

/* ────────────────────────────────────────────────────────────────
   The layout is the filter bar (was option C): category photo cards (the same
   FormatRow /getting-started opens with), then a sticky bar of dropdown pills.
   Options A (faceted rail) and B (guided shelves) are archived in
   src/archive/CatalogOptions.abc.jsx.
   ──────────────────────────────────────────────────────────────── */

/* ── Shared: compare ── */
function useCompare(items) {
  const [picked, setPicked] = useState([]);
  const [open, setOpen] = useState(false);
  const toggle = name => setPicked(p => (p.includes(name) ? p.filter(n => n !== name) : p.length < 3 ? [...p, name] : p));
  const rows = items.filter(i => picked.includes(i.name));
  useEffect(() => { if (rows.length < 2) setOpen(false); }, [rows.length]);
  useEffect(() => {
    document.documentElement.style.setProperty("--tray-h", rows.length && !open ? "72px" : "0px");
    return () => document.documentElement.style.removeProperty("--tray-h");
  }, [rows.length, open]);
  return { picked, rows, toggle, clear: () => setPicked([]), open, setOpen };
}

function CompareUI({ cmp, canOpen, onOpen }) {
  const { rows, open, setOpen } = cmp;
  return (
    <>
      {rows.length > 0 && !open && (
        <div style={{
          position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 40, background: "#fff",
          boxShadow: "0 -4px 16px rgba(0,0,0,.12)", padding: "12px 16px",
        }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <strong>{rows.length} of 3 selected</strong>
            {/* A thumbnail each, with an X, so what is chosen is seen at a glance and one tap removes it. */}
            <div style={{ flex: "1 1 160px", minWidth: 0, display: "flex", gap: 8 }}>
              {rows.map(r => (
                <span key={r.name} style={{ position: "relative", flex: "none" }}>
                  <img src={r.img} alt={r.name} title={r.name} style={{ display: "block", width: 48, height: 48, borderRadius: R.md, objectFit: "cover" }} />
                  <button type="button" aria-label={`Remove ${r.name}`} onClick={() => cmp.toggle(r.name)} style={{
                    position: "absolute", top: -6, right: -6, width: 20, height: 20, padding: 0, borderRadius: 999, border: "1px solid #d1d1d1",
                    background: "#fff", cursor: "pointer", display: "grid", placeItems: "center", color: "#292929",
                  }}>
                    <CloseIcon size="sm" aria-hidden />
                  </button>
                </span>
              ))}
            </div>
            <Button variant="outlined" onClick={cmp.clear}>Clear</Button>
            <Button disabled={rows.length < 2} onClick={() => setOpen(true)}>
              {rows.length < 2 ? "Pick one more" : "Compare"}
            </Button>
          </div>
        </div>
      )}
      {open && <CompareSheet rows={rows} onClose={() => setOpen(false)} onRemove={cmp.toggle} canOpen={canOpen} onOpen={onOpen} />}
    </>
  );
}

/* Motion for filter changes. Cards that stay glide, cards that appear rise in
   with a small stagger by column, cards that go shrink and fade. */
const MotionCss = ({ items }) => (
  <style>{`
    ::view-transition-group(*) { animation-duration: 450ms; animation-timing-function: cubic-bezier(.2, .8, .2, 1); }
    ::view-transition-old(root), ::view-transition-new(root) { animation-duration: 180ms; }
    @keyframes vt-in  { from { opacity: 0; transform: translateY(18px) scale(.94); } }
    @keyframes vt-out { to   { opacity: 0; transform: scale(.94); } }
    ::view-transition-new(*):only-child { animation: vt-in 450ms cubic-bezier(.2, .8, .2, 1) both; }
    ::view-transition-old(*):only-child { animation: vt-out 200ms ease-in both; }
    ${items.map((_, i) => `::view-transition-new(vt-${i}):only-child { animation-delay: ${(i % 3) * 60}ms; }`).join("\n")}
  `}</style>
);

/* ── Shared: dropdown triggers (Nike's row, IKEA's chip row) ──
   Codex Button, outlined when nothing is applied and filled when something is,
   with a Codex caret. Codex has no Popover or Menu, so what they open is built
   from Codex Checkbox and Button inside a plain panel. */
const Caret = ({ up }) => (up ? <KeyboardArrowUpIcon size="base" aria-hidden /> : <KeyboardArrowDownIcon size="base" aria-hidden />);
const TextAction = ({ onClick, children, intent }) => (
  <span style={{ flex: "none" }}><Button variant="text" size="small" intent={intent} onClick={onClick}>{children}</Button></span>
);

/* FormatRow card id → the catalogue's product type. */
const CARD_TYPE = { all: null, photo: "Photo books", trade: "Books", magazine: "Magazines", notebook: "Notebooks" };

const FACETS = [["type", "Type"], ["use", "Use"], ["binding", "Binding"], ["price", "Price"]];

/* Mobile: Filters & sort button, count, and a pill per top facet. A pill opens
   the sheet at its group and shows how many values are applied. */
function MobileBar({ fx, openSheet, triggerRef, facets }) {
  return (
    <div style={{
      position: "sticky", top: NAV_H, zIndex: 20, background: "#fff", padding: "12px 0", marginBottom: 16,
      borderBottom: `1px solid ${T.border}`, display: "grid", gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span ref={triggerRef} tabIndex={-1} style={{ outline: "none" }}>
          <Button variant="outlined" onClick={() => openSheet()}>Filters & sort{fx.active ? ` (${fx.active})` : ""}</Button>
        </span>
        <span style={{ fontWeight: 700, whiteSpace: "nowrap" }} aria-live="polite">
          {fx.results.length} {fx.results.length === 1 ? "product" : "products"}
        </span>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
        {facets.map(([k, label]) => {
          const n = fx.f[k].length;
          return (
            <span key={k} style={{ flex: "none" }}>
              <Button variant={n ? "filled" : "outlined"} intent="neutral" size="small" iconRight={<Caret />} onClick={() => openSheet(k)}>
                {label}{n ? ` (${n})` : ""}
              </Button>
            </span>
          );
        })}
        {fx.active > 0 && <TextAction onClick={fx.clear}>Clear all</TextAction>}
      </div>
    </div>
  );
}

/* ── A and C: the filtered grid ── */
function Faceted({ items, Card, onGo, lean, promo, canOpen, onOpen }) {
  const fx = useFilters(items, true, true);
  const draft = useFilters(items);
  const cmp = useCompare(items);
  const wide = useWidth() >= 960;
  const [sheet, setSheet] = useState(false);
  const [menu, setMenu] = useState(null);
  const triggerRef = useRef(null);
  const barRef = useRef(null);
  const openSheet = k => {
    draft.setF(fx.f); draft.setSort(fx.sort); setSheet(true);
    /* The Modal mounts its content a moment after this runs, so wait for the group. */
    if (k) {
      let tries = 0;
      const go = () => {
        const el = document.getElementById("fg-" + k);
        if (el) el.scrollIntoView({ block: "start" }); else if (tries++ < 20) setTimeout(go, 50);
      };
      setTimeout(go, 50);
    }
  };
  const applySheet = () => fx.vt(() => { fx.raw.setF(draft.f); fx.raw.setSort(draft.sort); setSheet(false); });

  /* The dropdowns (filters and sort) close on any click outside an open one, or Escape. */
  useEffect(() => {
    if (!menu) return;
    const out = e => { if (!(e.target instanceof Element) || !e.target.closest("[data-menu-root]")) setMenu(null); };
    const esc = e => { if (e.key === "Escape") setMenu(null); };
    document.addEventListener("mousedown", out); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", out); document.removeEventListener("keydown", esc); };
  }, [menu]);

  const cell = it => (
    <RichCard key={it.name} it={it} Card={Card} onGo={onGo} lean={lean} vtName={`vt-${items.indexOf(it)}`} footer={
      /* A visible toggle rather than a small checkbox. At three, the others say why
         they are off instead of just going grey. */
      (() => {
        const on = cmp.picked.includes(it.name);
        const full = !on && cmp.picked.length >= 3;
        return (
          <div style={{ display: "grid", gap: 4, justifyItems: "start" }}>
            <Button size="small" variant={on ? "filled" : "outlined"} intent="neutral" aria-pressed={on} disabled={full}
              iconLeft={on ? <CheckIcon size="base" aria-hidden /> : <span className="ms" aria-hidden style={{ fontSize: 18 }}>add</span>}
              onClick={() => cmp.toggle(it.name)}>
              {on ? "Added to compare" : "Compare"}
            </Button>
            {full && <span style={{ color: SUBTLE, fontSize: TYPE.sm }}>Compare up to 3. Remove one to add this.</span>}
          </div>
        );
      })()
    } />
  );

  const results = fx.results.length ? (
    /* The promo is a row of the grid after the first three products, spanning
       every column. It shows only on the unfiltered list. */
    <div style={{ ...grid(340), gridAutoFlow: "row dense" }}>
      {fx.results.slice(0, 3).map(cell)}
      {promo && fx.active === 0 && <div key="promo" style={{ gridColumn: "1 / -1", viewTransitionName: "vt-promo" }}>{promo}</div>}
      {fx.results.slice(3).map(cell)}
    </div>
  ) : <Empty onClear={fx.clear} fixes={fx.relaxed()} onRemove={fx.remove} />;

  /* ---- Category cards ----
     The same FormatRow /getting-started opens with: the /pricing photo card in a
     RadioCardGroup, so choosing a category looks and behaves as it does there.
     A radio group holds one value, so a category is one at a time; the first
     card, All Products, is the unfiltered list and starts selected. The prices are left off (hidePrice) because the
     cards below carry them, and no badge is shown since this row filters, it
     doesn't recommend. `placeholder` swaps the photographs for an "Image needed" tile
     to flag that category assets are still to come. The Swatch Kit is not a product, so
     it is not here: it is the banner after the results. */
  const catType = fx.f.type[0];
  const catId = catType ? Object.keys(CARD_TYPE).find(id => CARD_TYPE[id] === catType) : "all";
  const categoryCards = (
    <div style={{ padding: "0 0 24px" }}>
      <FormatRow
        ids={Object.keys(CARD_TYPE)}
        formatId={catId}
        onPick={id => fx.vt(() => fx.raw.setF(f => ({ ...f, type: CARD_TYPE[id] ? [CARD_TYPE[id]] : [] })))}
        badgeFor={() => null}
        hidePrice
        /* Each card counts what the lower filters leave in its category, and a
           category with nothing left is disabled rather than hidden, so the row
           never shifts. The chosen card is never disabled: its zero is shown and
           the empty state below offers the way out. */
        captionFor={id => {
          const n = CARD_TYPE[id] ? fx.countFor("type", CARD_TYPE[id]) : fx.countAll();
          return `${n} ${n === 1 ? "product" : "products"}`;
        }}
        disabledFor={id => id !== catId && !!CARD_TYPE[id] && fx.countFor("type", CARD_TYPE[id]) === 0}
        placeholder
        minCard={wide ? 190 : 148}
        scroll={!wide}
      />
      {fx.active > 0 && <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}><TextAction onClick={fx.clear}>Clear all</TextAction></div>}
    </div>
  );

  const menuPanel = (k, title, collapsible) => (
    <div role="dialog" aria-label={title} style={{
      position: "absolute", top: 46, left: 0, zIndex: 30, width: 300, maxHeight: "60vh", overflowY: "auto", background: "#fff",
      border: `1px solid ${T.border}`, borderRadius: R.lg, boxShadow: "0 12px 32px rgba(0,0,0,.16)", padding: 16,
    }}>
      <FilterGroup title={title} k={k} options={{ use: USES, binding: BINDINGS, price: BUCKETS }[k]} fx={fx} collapsible={collapsible} />
      {fx.f[k].length > 0 && (
        <div style={{ marginTop: 8 }}><Button variant="text" size="small" onClick={() => fx.setF(f => ({ ...f, [k]: [] }))}>Clear {title.toLowerCase()}</Button></div>
      )}
    </div>
  );

  /* A dropdown pill. */
  const pill = ([k, title, col]) => {
    const n = fx.f[k].length;
    return (
      <div key={k} data-menu-root style={{ position: "relative" }}>
        <Button variant={n ? "filled" : "outlined"} intent="neutral" size="small" className="cb-pill" aria-haspopup="dialog" aria-expanded={menu === k}
          iconRight={<Caret up={menu === k} />} onClick={() => setMenu(menu === k ? null : k)}>
          {title}{n ? ` (${n})` : ""}
        </Button>
        {menu === k && menuPanel(k, title, col)}
      </div>
    );
  };

  const filterBar = (
    <div ref={barRef} style={{ position: "sticky", top: NAV_H, zIndex: 25, background: "#fff", padding: "12px 0", marginBottom: 16, borderBottom: `1px solid ${T.border}`, display: "grid", gap: 10 }}>
      <style>{`
        button.cb-pill { min-height: 42px; padding-inline: 16px; }
        .cb-sort-positioner { z-index: 500; min-width: 240px; overflow: hidden; background-color: var(--codex-color-semantic-bg-surface-raised); border-radius: var(--codex-radius-sm); box-shadow: var(--codex-shadow-raised); }
        .cb-sort-popup { box-sizing: border-box; width: 100%; padding: var(--codex-spacing-2); }
        .cb-sort-list { display: flex; flex-direction: column; }
        .cb-sort-item { display: flex; align-items: center; justify-content: space-between; gap: var(--codex-spacing-2); padding: var(--codex-spacing-2); border-radius: var(--codex-radius-lg); cursor: pointer; user-select: none; outline: none; font-family: var(--codex-font-family-sans); font-weight: var(--codex-font-weight-normal); font-size: var(--codex-font-size-base); line-height: var(--codex-font-line-height-normal); }
        .cb-sort-item[data-selected] { font-weight: var(--codex-font-weight-semibold); background-color: var(--codex-color-semantic-bg-neutral-active); }
        .cb-sort-item[data-highlighted] { background-color: var(--codex-color-semantic-bg-input-hover); }
        .cb-sort-label { flex: 1 0 0; min-width: 0; }
        .cb-sort-check { display: flex; flex-shrink: 0; color: var(--codex-color-semantic-icon-bold); }
      `}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {[["use", "What are you making?", true], ["binding", "Binding", false], ["price", "Starting price", false]].map(pill)}
        </div>
        {/* Sort is an icon and a label. The list is Codex's Select pattern (a single
            choice, check on the chosen row, same popup surface) built on the Base UI
            primitive Codex's Select uses, because Codex's own Select has a text field
            for a trigger and no icon-button form. Keyboard, Escape and outside click
            come from the primitive. */}
        <BaseSelect.Root items={SORT_OPTIONS} value={fx.sort} onValueChange={v => v && fx.setSort(v)}>
          <BaseSelect.Trigger aria-label="Sort by" render={
            <Button variant={fx.sort !== "featured" ? "filled" : "outlined"} intent="neutral" size="small" className="cb-pill"
              iconLeft={<span className="ms" aria-hidden style={{ fontSize: 20 }}>swap_vert</span>} />
          }>
            Sort
          </BaseSelect.Trigger>
          <BaseSelect.Portal>
            <BaseSelect.Positioner className="cb-sort-positioner" side="bottom" align="end" sideOffset={4} alignItemWithTrigger={false}>
              <BaseSelect.Popup className="cb-sort-popup">
                <BaseSelect.List className="cb-sort-list">
                  {SORT_OPTIONS.map(o => (
                    <BaseSelect.Item key={o.value} value={o.value} label={o.label} className="cb-sort-item">
                      <BaseSelect.ItemText className="cb-sort-label">{o.label}</BaseSelect.ItemText>
                      <BaseSelect.ItemIndicator className="cb-sort-check"><CheckIcon size="3xl" aria-hidden /></BaseSelect.ItemIndicator>
                    </BaseSelect.Item>
                  ))}
                </BaseSelect.List>
              </BaseSelect.Popup>
            </BaseSelect.Positioner>
          </BaseSelect.Portal>
        </BaseSelect.Root>
      </div>
      <AppliedChips fx={fx} />
    </div>
  );

  return (
    <div style={{ paddingBottom: cmp.rows.length ? 88 : 0 }}>
      <MotionCss items={items} />
      {categoryCards}
      <div style={{ minWidth: 0 }}>
        {wide ? filterBar : <MobileBar fx={fx} openSheet={openSheet} triggerRef={triggerRef} facets={FACETS.filter(([k]) => k !== "type")} />}
        {/* On desktop the count sits right above the cards it counts, not in the bar. */}
        {wide && <div style={{ fontWeight: 700, margin: "0 0 16px" }} aria-live="polite">{fx.results.length} {fx.results.length === 1 ? "product" : "products"}<span style={{ fontWeight: 400, color: SUBTLE }}> · Select up to 3 to compare</span></div>}
        {results}
      </div>

      {/* ── The ad row ── two quiet tiles side by side: the live page's gift box
          promo (words and photographs lifted from it, as it has no button or
          link there, none is invented) and the Swatch Kit.
          The Swatch Kit is samples of the products, not a product: no binding,
          use or price to filter by. So it is a decision aid after the results,
          always shown whatever the filters leave, and never counted.
          Both tiles are light grey with the button outlined, so the Instant Store
          band below stays the one big closing moment. */}
      <div style={{ margin: "56px 0 0", display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))" }}>
        <AdTile
          eyebrow="New"
          heading="A gift box for your photo book"
          text="Add it at checkout for a keepsake presentation, no wrapping needed."
          img={GIFT_IMG}
          placeholder
          alt="Four white Blurb gift boxes arranged at angles on a dark wood table"
        />
        <AdTile
          eyebrow="Free"
          heading="Not sure about the paper or cover?"
          text="The Swatch Kit is free: hold our papers and covers before you commit."
          img={SWATCH_IMG}
          placeholder
          alt="Overlapping Premium Matte and Premium Lustre paper samples featuring a vibrant bird photo, showcasing differences in paper finish."
          cta={{ label: "Get the free Swatch Kit", href: "https://www.blurb.com/swatch-kit" }}
        />
      </div>

      {!wide && sheet && (
        <Sheet
          onClose={() => setSheet(false)}
          footer={<>
            <Button variant="outlined" onClick={draft.clear}>Clear all</Button>
            <Button disabled={draft.results.length === 0} onClick={applySheet}>
              {draft.results.length === 0 ? "No products" : `Show ${draft.results.length} ${draft.results.length === 1 ? "product" : "products"}`}
            </Button>
          </>}
        >
          <div style={{ display: "grid", gap: 24 }}>
            <Select label="Sort by" options={SORT_OPTIONS} value={draft.sort} onValueChange={v => v && draft.setSort(v)} />
            <FilterPanel fx={draft} touch />
          </div>
        </Sheet>
      )}
      <CompareUI cmp={cmp} canOpen={canOpen} onOpen={onOpen} />
    </div>
  );
}

export function CatalogBrowser({ products, Card, onGo, lean, promo, canOpen, onOpen }) {
  /* The Swatch Kit is not a product (see the banner in Faceted), so it never joins the list. */
  const items = useMemo(() => prepare(products.filter(p => p.cat !== "Swatch Kit")), [products]);
  return <Faceted items={items} Card={Card} onGo={onGo} lean={lean} promo={promo} canOpen={canOpen} onOpen={onOpen} />;
}

/* One tile of the ad row: photograph, tag, heading, a line, and (optionally) an
   outlined button pinned to the foot so tiles of unequal text still line up. */
function AdTile({ eyebrow, heading, text, img, alt, cta, placeholder }) {
  return (
    <section aria-label={heading} style={{
      background: "var(--codex-color-primitive-light-gray-50)", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      {placeholder ? (
        /* The category cards' "Image needed" tile, flagging that this photograph is still to come. */
        <div style={{
          display: "grid", placeItems: "center", alignContent: "center", gap: 8, width: "100%", aspectRatio: "4 / 3",
          background: "var(--codex-color-primitive-light-gray-100)",
        }}>
          <span className="ms" aria-hidden style={{ fontSize: 56, color: C.gray400 }}>image</span>
          <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>Image needed</span>
        </div>
      ) : (
        <picture>
          {img.mobile && <source media="(max-width: 767px)" srcSet={img.mobile} />}
          <img src={img.src} alt={alt} loading="lazy" style={{ display: "block", width: "100%", aspectRatio: "4 / 3", objectFit: "cover" }} />
        </picture>
      )}
      <div style={{ display: "grid", gap: 12, justifyItems: "start", alignContent: "start", padding: 24, flex: 1 }}>
        <span style={{ padding: "3px 10px", borderRadius: 999, background: C.blue600, color: "#fff", fontSize: TYPE.sm, fontWeight: 700 }}>{eyebrow}</span>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 600, lineHeight: 1.2, margin: 0, color: C.gray950 }}>{heading}</h2>
        <p style={{ margin: 0, color: SUBTLE, lineHeight: 1.5 }}>{text}</p>
        {cta && (
          <div style={{ marginTop: "auto", paddingTop: 4 }}>
            <Button as="a" href={cta.href} target="_blank" rel="noopener noreferrer" variant="outlined">{cta.label}</Button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Light D: the spec lines under a card ── */
function RichCard({ it, Card, onGo, lean, footer, vtName }) {
  return (
    <div style={{ display: "grid", gap: 12, alignContent: "start", viewTransitionName: vtName }}>
      <Card item={it} onGo={onGo} lean={lean} />
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {it.binding.map(b => <Badge key={b} color="white" border size="small" label={b} />)}
        </div>
        <div style={{ color: SUBTLE, fontSize: TYPE.sm, lineHeight: 1.5 }}>
          {it.coverNote}<br /><strong>Best for:</strong> {it.best}
        </div>
        {footer}
      </div>
    </div>
  );
}

/* ── Compare ── */

/* What the comparison reads off the real price matrix rather than the draft
   copy: the sizes, papers and page ceiling a product can actually be built in,
   given its cover (and, for layflat, its paper). Same availability test the
   "starting at" price uses, so a product never lists a size it cannot be made
   in. */
function specsOf(it) {
  const f = CATALOG[it.format];
  if (!f) return null;
  if (f.flat) {
    const o = f.groups[0].options[0];
    return {
      sizes: o.dims.replace(/ in .*/, " in"), papers: o.derived?.find(d => d.id === "paper")?.option.label ?? "—",
      pages: `${f.basePages}–${o.maxPages}`, layflat: "No",
    };
  }
  const opts = id => f.groups.find(g => g.id === id).options;
  const sizes = new Map(), papers = new Map();
  let max = 0;
  for (const c of opts("cover")) {
    if (it.cover && c.id !== it.cover) continue;
    for (const sz of opts("size")) for (const pp of opts("paper")) {
      if (it.paperTest && !it.paperTest(pp.id)) continue;
      if (!isAvailable(it.format, { cover: c.id, size: sz.id, paper: pp.id })) continue;
      sizes.set(sz.id, sz.dims.replace(/ in .*/, "")); papers.set(pp.id, pp);
      max = Math.max(max, pp.maxPages ?? 0);
    }
  }
  const flat = [...papers.keys()].filter(id => id.includes("layflat")).length;
  return {
    sizes: `${sizes.size} ${sizes.size === 1 ? "size" : "sizes"}: ${[...sizes.values()].join(", ")} in`,
    papers: [...new Set([...papers.values()].map(pp => pp.label))].join(", "),
    pages: `${f.basePages}–${max}`,
    layflat: flat === 0 ? "No" : flat === papers.size ? "Yes" : "Some papers",
  };
}

const CELL = { padding: 16, textAlign: "left", verticalAlign: "top", borderTop: `1px solid ${C.charcoal200}`, borderLeft: `1px solid ${C.charcoal200}`, lineHeight: 1.5 };

/* The table is built by hand rather than with Codex's ComparisonTable, which takes
   plain text only and so cannot hold a photograph, a link or a Remove button in a
   column header. It follows the site's own comparison pattern: zebra rows, a #d1d1d1
   rule under each row and between columns, 16px cells, a sticky label column. */
function CompareSheet({ rows, onClose, onRemove, canOpen, onOpen }) {
  const [diffOnly, setDiffOnly] = useState(false);
  const specs = rows.map(specsOf);
  const fields = [
    ["Type", r => r.type],
    ["Binding", r => r.binding.join(", ") || "—"],
    ["Cover", r => r.coverNote],
    ["Lies flat", (r, sp) => sp?.layflat ?? "—"],
    ["Sizes", (r, sp) => sp?.sizes ?? "—"],
    ["Paper", (r, sp) => sp?.papers ?? "—"],
    ["Pages", (r, sp) => sp?.pages ?? "—"],
    ["Starting at", r => (r.price ? money(r.price) : "Free")],
    ["Best for", r => r.best],
  ].map(([label, get]) => {
    const cells = rows.map((r, i) => get(r, specs[i]));
    return { label, cells, differs: new Set(cells).size > 1 };
  });
  const shown = diffOnly ? fields.filter(f => f.differs) : fields;
  const zebra = i => (i % 2 ? "#f5f5f5" : "#fff");

  return (
    <Modal open onOpenChange={o => !o && onClose()}>
      <ModalContent title={`Compare (${rows.length})`} size="large">
        <style>{`[data-codex-component="modal"]:has([data-compare-modal]) { width: min(980px, calc(100vw - 32px)); max-width: none; }`}</style>
        <ModalClose
          aria-label="Close"
          style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: 0, padding: 0, cursor: "pointer", color: "#292929", lineHeight: 0 }}
        >
          <CloseIcon size="lg" aria-hidden />
        </ModalClose>
        <div data-compare-modal style={{ display: "grid", gap: 16 }}>
          <Checkbox label="Show only differences" checked={diffOnly} onCheckedChange={() => setDiffOnly(d => !d)} />
          <div style={{ overflow: "auto", maxHeight: "calc(100dvh - 280px)", border: `1px solid ${C.charcoal200}`, borderLeft: 0, borderTop: 0 }}>
            <table style={{ borderCollapse: "separate", borderSpacing: 0, width: "100%", minWidth: 130 + rows.length * 220, fontSize: TYPE.base }}>
              <thead>
                <tr>
                  <th scope="col" style={{ ...CELL, borderLeft: 0, borderTop: 0, position: "sticky", left: 0, top: 0, zIndex: 3, background: "#fff", width: 130 }} />
                  {rows.map(r => (
                    <th key={r.name} scope="col" style={{ ...CELL, borderTop: 0, position: "sticky", top: 0, zIndex: 2, background: "#fff", fontWeight: 400 }}>
                      <div style={{ display: "grid", gap: 10, justifyItems: "start" }}>
                        <img src={r.img} alt="" style={{ display: "block", width: "100%", maxWidth: 140, aspectRatio: "1 / 1", objectFit: "cover", borderRadius: R.lg }} />
                        <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE.lg, fontWeight: 600, lineHeight: 1.2, color: C.gray950 }}>{r.name}</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {canOpen(r) && <Button size="small" variant="outlined" onClick={() => onOpen(r)}>View product</Button>}
                          <Button size="small" variant="text" intent="neutral" onClick={() => onRemove(r.name)}>Remove</Button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((f, i) => (
                  <tr key={f.label}>
                    <th scope="row" style={{ ...CELL, borderLeft: 0, position: "sticky", left: 0, zIndex: 1, background: zebra(i), fontWeight: 700 }}>{f.label}</th>
                    {f.cells.map((c, j) => <td key={j} style={{ ...CELL, background: zebra(i) }}>{c}</td>)}
                  </tr>
                ))}
                {shown.length === 0 && (
                  <tr><td colSpan={rows.length + 1} style={{ ...CELL, borderLeft: 0, color: SUBTLE }}>These products match on every row we compare.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
