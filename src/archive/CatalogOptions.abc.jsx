/* ARCHIVED 2026-10-21 — options A (faceted rail) and B (guided shelves), kept as they
   stood beside C. Nothing imports this file; C is the Shop All layout now (see
   ../CatalogOptions.jsx). Relative imports point at ../ so it can be revived by
   moving it back. */
import React, { useMemo, useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { Select as BaseSelect } from "@base-ui/react/select";
import { Button, Badge, Checkbox, Chip, Select, Tabs, Modal, ModalContent, ModalClose, CallToAction, ComparisonTable } from "@blurb/codex-react";
import { CheckIcon, CloseIcon, KeyboardArrowDownIcon, KeyboardArrowUpIcon, TuneIcon } from "@blurb/codex-react/icons";
import { C, T, TYPE, R, FONT_DISPLAY } from "../tokens.js";
import { variantFromPrice, money } from "../catalog.js";

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
const TYPES = ["Photo books", "Books", "Magazines", "Notebooks", "Samples"];
const BINDINGS = ["Softcover", "Hardcover", "Layflat", "Wire-O"];
const BUCKETS = ["Under $10", "$10–$30", "$30 and up"];
const bucketOf = p => (p < 10 ? BUCKETS[0] : p < 30 ? BUCKETS[1] : BUCKETS[2]);
const TYPE_OF = {
  "Photo Book": "Photo books", "Paperback & Hardcover Books": "Books", "Magazine": "Magazines",
  "Notebooks & Journals": "Notebooks", "Swatch Kit": "Samples",
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
  "Swatch Kit": {
    binding: [], coverNote: "Papers and covers to hold", best: "Choosing before you commit", uses: [],
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

function useFilters(items, animate = false) {
  const [f, setFRaw] = useState(EMPTY);
  const [sort, setSortRaw] = useState("featured");
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
  const active = Object.values(f).reduce((n, a) => n + a.length, 0);
  return { f, setF, toggle, remove, clear, results, countFor, active, sort, setSort, vt, raw: { setF: setFRaw, setSort: setSortRaw } };
}

/* ── Shared pieces ── */
const grid = (min = 300) => ({
  display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${min}px), 1fr))`,
  columnGap: 24, rowGap: 48, alignItems: "start",
});

const Empty = ({ onClear }) => (
  <div style={{ padding: "64px 16px", textAlign: "center", display: "grid", gap: 12, justifyItems: "center" }}>
    <div style={{ fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 600 }}>No products match those filters</div>
    <div style={{ color: SUBTLE }}>Try removing a filter, or start again.</div>
    <Button variant="outlined" onClick={onClear}>Clear all filters</Button>
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
    <FilterGroup title="Product type" k="type" options={TYPES} fx={fx} touch={touch} />
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
function AppliedChips({ fx, skipType }) {
  /* The filter bar (C) already shows the chosen product types as its picture
     chips and keeps "Clear all" beside them, so repeating them here is noise. */
  const entries = Object.entries(fx.f).filter(([k]) => !(skipType && k === "type"));
  if (!entries.some(([, vals]) => vals.length)) return null;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", overflowX: "auto", whiteSpace: "nowrap", paddingBottom: 2, viewTransitionName: "vt-chips" }}>
      {entries.flatMap(([k, vals]) =>
        vals.map(v => <span key={k + v} style={{ flex: "none" }}><Chip label={v} onDelete={() => fx.remove(k, v)} /></span>))}
      {!skipType && <TextAction onClick={fx.clear}>Clear all</TextAction>}
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
   Three directions, from the discovery board (Figma: Research & Ideation)

   A  Faceted rail    IKEA / Nike: sticky rail with counts, a Hide filters toggle,
                      compare, and quick filter pills on mobile.
   B  Guided shelves  MOO / Apple / Vistaprint: no filter panel. Family shelves under
                      a sticky tab bar, preset shortcut pills, a free-sample callout.
   C  Filter bar      Picture chips for product type (IKEA's subcategory chips), then a
                      sticky bar of dropdown pills for the other filters.

   They share the data, the cards, the counts, the compare tray and the motion.
   ──────────────────────────────────────────────────────────────── */
export const OPTIONS = [
  { id: "a", short: "A · Faceted rail", note: "Sticky filter rail with counts, Hide filters, compare. Mobile: quick pills + sheet." },
  { id: "b", short: "B · Guided shelves", note: "No filter panel: family shelves, sticky tabs, preset pills, free-sample callout." },
  { id: "c", short: "C · Filter bar", note: "Picture chips for product type, then a sticky bar of dropdown pills." },
];

export function useOption() {
  const [option, setOptionState] = useState(() => {
    const q = (new URLSearchParams(window.location.search).get("option") || "").toLowerCase();
    return OPTIONS.some(o => o.id === q) ? q : "a";
  });
  const setOption = id => {
    const go = () => setOptionState(id);
    if (canAnimate()) document.startViewTransition(() => flushSync(go)); else go();
    const u = new URL(window.location.href); u.searchParams.set("option", id); window.history.replaceState(null, "", u);
  };
  return [option, setOption];
}

/* Floating switcher. It is prototype scaffolding, so it sits clear of the page
   and lifts above the compare tray when that is showing. */
export function OptionSwitcher({ option, setOption }) {
  const cur = OPTIONS.find(o => o.id === option);
  const small = useWidth() < 600;
  return (
    <div role="group" aria-label="Layout option" style={{
      position: "fixed", left: 12, bottom: "calc(12px + var(--tray-h, 0px))", zIndex: 45, maxWidth: "calc(100vw - 24px)",
      background: "#fff", border: "1px solid #d1d1d1", borderRadius: small ? 999 : 16, padding: small ? 4 : 8, display: "grid", gap: 6,
      boxShadow: "0 8px 24px rgba(0,0,0,.18)", fontSize: TYPE.sm,
    }}>
      <div style={{ display: "flex", gap: 4 }}>
        {OPTIONS.map(o => (
          <Button key={o.id} size="small" intent="neutral" variant={o.id === option ? "filled" : "text"} aria-pressed={o.id === option}
            aria-label={o.short} title={o.short} onClick={() => setOption(o.id)}>
            {small ? o.id.toUpperCase() : o.short}
          </Button>
        ))}
      </div>
      {!small && <div style={{ padding: "0 8px 4px", color: SUBTLE, maxWidth: 420, lineHeight: 1.4 }}>{cur.note}</div>}
    </div>
  );
}

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

function CompareUI({ cmp }) {
  const { rows, open, setOpen } = cmp;
  return (
    <>
      {rows.length > 0 && !open && (
        <div style={{
          position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 40, background: "#fff",
          boxShadow: "0 -4px 16px rgba(0,0,0,.12)", padding: "12px 16px",
        }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <strong>{rows.length} selected</strong>
            <span style={{ color: SUBTLE, flex: "1 1 160px", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {rows.map(r => r.name).join(" · ")}
            </span>
            <Button variant="outlined" onClick={cmp.clear}>Clear</Button>
            <Button disabled={rows.length < 2} onClick={() => setOpen(true)}>
              {rows.length < 2 ? "Pick one more" : "Compare"}
            </Button>
          </div>
        </div>
      )}
      {open && <CompareSheet rows={rows} onClose={() => setOpen(false)} />}
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
function Faceted({ variant, items, Card, onGo, lean, promo }) {
  const fx = useFilters(items, true);
  const draft = useFilters(items);
  const cmp = useCompare(items);
  const wide = useWidth() >= 960;
  const bar = variant === "bar";
  const [sheet, setSheet] = useState(false);
  const [railOpen, setRailOpen] = useState(true);
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
      <Checkbox label="Compare" checked={cmp.picked.includes(it.name)}
        disabled={!cmp.picked.includes(it.name) && cmp.picked.length >= 3} onCheckedChange={() => cmp.toggle(it.name)} />
    } />
  );

  const results = fx.results.length ? (
    /* The promo is a row of the grid after the first three products, spanning
       every column. It shows only on the unfiltered list. */
    <div style={{ ...grid(bar ? 340 : 260), gridAutoFlow: "row dense" }}>
      {fx.results.slice(0, 3).map(cell)}
      {promo && fx.active === 0 && <div key="promo" style={{ gridColumn: "1 / -1", viewTransitionName: "vt-promo" }}>{promo}</div>}
      {fx.results.slice(3).map(cell)}
    </div>
  ) : <Empty onClear={fx.clear} />;

  /* ---- A, desktop toolbar: count + Hide filters + chips, Sort at the right ---- */
  const railToolbar = (
    <div style={{ position: "sticky", top: NAV_H, zIndex: 20, background: "#fff", padding: "12px 0", marginBottom: 16, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "stretch", gap: 24 }}>
        <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontWeight: 700, whiteSpace: "nowrap", lineHeight: 1.5 }} aria-live="polite">
              {fx.results.length} {fx.results.length === 1 ? "product" : "products"}
            </span>
            <Button variant="text" intent="neutral" size="small" iconLeft={<TuneIcon size="base" aria-hidden />} aria-expanded={railOpen} onClick={() => setRailOpen(o => !o)}>
              {railOpen ? "Hide filters" : "Show filters"}
            </Button>
          </div>
          <div style={{ width: "100%", minWidth: 0 }}><AppliedChips fx={fx} /></div>
        </div>
        <div style={{ minWidth: 200 }}>
          <Select label="Sort by" options={SORT_OPTIONS} value={fx.sort} onValueChange={v => v && fx.setSort(v)} />
        </div>
      </div>
    </div>
  );

  /* ---- C: type picture chips, then the dropdown-pill bar ---- */
  /* IKEA's picture chips, as Codex Chips: filled (with a remove X) when the
     type is on, dashed "suggestion" when it is off. The label is an inline
     element so it can carry a thumbnail. */
  const typeChips = (
    <div style={{ display: "flex", gap: 12, alignItems: "center", overflowX: "auto", padding: "4px 0 16px", scrollbarWidth: "none" }} role="group" aria-label="Product type">
      {TYPES.map(t => {
        const first = items.find(i => i.type === t);
        const on = fx.f.type.includes(t);
        const n = fx.countFor("type", t);
        const label = (
          <span style={{ display: "flex", alignItems: "center", gap: 8, paddingBlock: 3.5 }}>
            <span style={{ width: 28, height: 28, borderRadius: 999, overflow: "hidden", display: "inline-block", background: "#e7e7e7", flex: "none" }}>
              {first && <img src={first.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", height: 28, lineHeight: "28px" }}>{t} ({n})</span>
          </span>
        );
        return (
          <span key={t} style={{ flex: "none" }}>
            {on
              ? <Chip size="large" label={label} onDelete={() => fx.toggle("type", t)} />
              : <Chip size="large" variant="suggestion" label={label} disabled={n === 0} onAdd={() => fx.toggle("type", t)} />}
          </span>
        );
      })}
      {fx.active > 0 && <TextAction onClick={fx.clear}>Clear all</TextAction>}
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
          {!bar && fx.active > 0 && <TextAction onClick={fx.clear}>Clear all</TextAction>}
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
      <AppliedChips fx={fx} skipType={bar} />
    </div>
  );

  return (
    <div style={{ paddingBottom: cmp.rows.length ? 88 : 0 }}>
      <MotionCss items={items} />
      {bar && !wide && typeChips}
      {!bar && wide ? (
        <div style={{ display: "grid", gridTemplateColumns: railOpen ? "260px 1fr" : "minmax(0, 1fr)", columnGap: 48, alignItems: "start", minHeight: `calc(100vh - ${NAV_H})` }}>
          {railOpen && (
            <aside aria-label="Filters" style={{ position: "sticky", top: NAV_H, maxHeight: `calc(100vh - ${NAV_H})`, overflowY: "auto", padding: "12px 0 16px" }}>
              <FilterPanel fx={fx} />
            </aside>
          )}
          <div style={{ minWidth: 0 }}>{railToolbar}{results}</div>
        </div>
      ) : (
        <div style={{ minWidth: 0 }}>
          {wide ? <>{filterBar}{typeChips}</> : <MobileBar fx={fx} openSheet={openSheet} triggerRef={triggerRef} facets={bar ? FACETS.filter(([k]) => k !== "type") : FACETS} />}
          {/* On desktop the count sits right above the cards it counts, not in the bar. */}
          {wide && <div style={{ fontWeight: 700, margin: "0 0 16px" }} aria-live="polite">{fx.results.length} {fx.results.length === 1 ? "product" : "products"}</div>}
          {results}
        </div>
      )}

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
      <CompareUI cmp={cmp} />
    </div>
  );
}

/* ── B: guided shelves ── */
const SHELF_COPY = {
  "Photo books": "Pictures first. Pick a cover and paper to suit how you'll show them.",
  "Books": "Text-led books for novels, poetry, cookbooks, and children's stories.",
  "Magazines": "A periodical-style format for portfolios, zines, and yearbooks.",
  "Notebooks": "Pages to write and sketch in, with your own cover.",
};
const PRESETS = [
  { id: "soft", label: "Softcover", k: "binding", v: "Softcover" },
  { id: "hard", label: "Hardcover", k: "binding", v: "Hardcover" },
  { id: "lay", label: "Layflat", k: "binding", v: "Layflat" },
  { id: "u10", label: "Under $10", k: "price", v: "Under $10" },
];

function Shelves({ items, Card, onGo, lean, promo }) {
  const fx = useFilters(items, true);
  const wide = useWidth() >= 960;
  const [tab, setTab] = useState("all");
  const shelves = TYPES.filter(t => t !== "Samples").map(t => ({ t, list: fx.results.filter(i => i.type === t) })).filter(s => s.list.length);
  const sample = items.find(i => i.type === "Samples");
  const jump = t => {
    setTab(t);
    if (t === "all") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById("shelf-" + t)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const tabs = [{ value: "all", label: `All (${fx.results.filter(i => i.type !== "Samples").length})` },
    ...TYPES.filter(t => t !== "Samples").map(t => ({ value: t, label: `${t} (${fx.results.filter(i => i.type === t).length})`, disabled: !fx.results.some(i => i.type === t) }))];
  const cell = it => <RichCard key={it.name} it={it} Card={Card} onGo={onGo} lean={lean} vtName={`vt-${items.indexOf(it)}`} />;

  return (
    <div>
      <MotionCss items={items} />
      {/* Preset shortcuts, like Vistaprint's hero pills: each is a filter in disguise. */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 24 }} role="group" aria-label="Quick picks">
        <span style={{ fontWeight: 700, marginRight: 4 }}>Quick picks</span>
        {PRESETS.map(p => {
          const on = fx.f[p.k].includes(p.v);
          return (
            <span key={p.id}>
              {on
                ? <Chip size="large" label={p.label} onDelete={() => fx.toggle(p.k, p.v)} />
                : <Chip size="large" variant="suggestion" label={p.label} onAdd={() => fx.toggle(p.k, p.v)} />}
            </span>
          );
        })}
        {fx.active > 0 && <TextAction onClick={fx.clear}>Clear</TextAction>}
      </div>

      {/* Sticky tabs jump between shelves (MOO's bar). */}
      <div style={{ position: "sticky", top: NAV_H, zIndex: 20, background: "#fff", margin: "0 0 40px", borderBottom: `1px solid ${T.border}`, overflowX: "auto" }}>
        <Tabs aria-label="Product families" items={tabs} value={tab} onValueChange={jump} />
      </div>

      {shelves.length === 0 && <Empty onClear={fx.clear} />}
      {shelves.map(({ t, list }, i) => (
        <React.Fragment key={t}>
          <section id={"shelf-" + t} style={{ scrollMarginTop: `calc(${NAV_H} + 64px)`, marginBottom: 72 }}>
            <div style={{ display: "grid", gap: 8, marginBottom: 28 }}>
              <H2>{t}</H2>
              <p style={{ margin: 0, color: SUBTLE, fontSize: TYPE.lg }}>{SHELF_COPY[t]}</p>
            </div>
            <div style={{ ...grid(340), gridAutoFlow: "row dense" }}>{list.map(cell)}</div>
          </section>
          {i === 0 && promo && fx.active === 0 && <div style={{ marginBottom: 72, viewTransitionName: "vt-promo" }}>{promo}</div>}
        </React.Fragment>
      ))}

      {/* MOO's free sample pack: the Swatch Kit, said as a decision aid. Codex
          CallToAction, the closest pattern (it has no image slot). */}
      {sample && fx.active === 0 && (
        <section aria-label="Free swatch kit" style={{ marginBottom: 40 }}>
          <CallToAction
            heading="Not sure about the paper or cover?"
            subheading={`Hold them before you commit. The Swatch Kit is free: ${sample.note.replace(/^Free — /, "")}.`}
            ctas={[{ children: "Get the free Swatch Kit" }]}
          />
        </section>
      )}
    </div>
  );
}

export function CatalogBrowser({ products, Card, onGo, lean, promo, option = "a" }) {
  const items = useMemo(() => prepare(products), [products]);
  if (option === "b") return <Shelves items={items} Card={Card} onGo={onGo} lean={lean} promo={promo} />;
  return <Faceted key={option} variant={option === "c" ? "bar" : "rail"} items={items} Card={Card} onGo={onGo} lean={lean} promo={promo} />;
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

/* ── D · richer cards + compare ── */
function CompareSheet({ rows, onClose }) {
  const fields = [
    ["Type", r => r.type], ["Binding", r => r.binding.join(", ") || "—"], ["Cover", r => r.coverNote],
    ["Starting at", r => (r.price ? money(r.price) : "Free")], ["Best for", r => r.best],
  ];
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
        <div data-compare-modal>
          <ComparisonTable
            cellSize="small"
            columnHeaders={["Format", ...rows.map(r => r.name)]}
            rows={fields.map(([label, get]) => ({ header: label, cells: rows.map(get) }))}
          />
        </div>
      </ModalContent>
    </Modal>
  );
}
