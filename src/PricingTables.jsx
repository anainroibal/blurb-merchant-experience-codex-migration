import React from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import { CATALOG, money } from "./catalog.js";
import { PRICING } from "./pricing.data.js";

/* ────────────────────────────────────────────────────────────────
   The price tables from blurb.com/pricing, as they are.

   The lean scope does not redesign this page (Ana, DES-482 #19: "do you
   think rebuilding this page is required for launch? to minimise scope
   I'd rather identify required changes to the existing pricing
   calculator"). So the page is rebuilt in its current shape and the only
   thing added to it is the Instant Store lane. This file is the part
   that carries the prices.

   Same layout as the live tables: one table per product family, a column
   per size, a row group per paper, a row per cover inside it, and the
   per-page rate as the last row of each group. "Not Available" where the
   combination does not exist, which is the live page's own wording and a
   third of that grid.

   The figures are NOT retyped. They come out of PRICING, which was
   extracted from the pricingData payload on that page, so this table and
   the calculators cannot drift apart. Blurb's own table is the source of
   both.
   ──────────────────────────────────────────────────────────────── */

const ROW_BG = i => (i % 2 === 0 ? "#fff" : C.gray50);
const cellBase = {
  padding: 16, fontSize: TYPE.base, lineHeight: 1.4,
  color: C.gray950, textAlign: "left", verticalAlign: "top", background: "inherit",
};
const labelCell = { ...cellBase, fontWeight: 700, width: 220, minWidth: 180 };
const stickyCell = { position: "sticky", left: 0, zIndex: 1, boxShadow: `inset -1px 0 0 0 ${C.charcoal200}` };
const lastCol = (i, n) => (i === n - 1 ? { borderRight: 0 } : null);
const dataCell = { ...cellBase, minWidth: 150, borderRight: `1px solid ${C.charcoal200}`, scrollSnapAlign: "end" };

const groupOf = (formatId, id) => CATALOG[formatId].groups.find(g => g.id === id);
const NA = <span style={{ color: T.textSubtle }}>Not Available</span>;

/* One family: sizes across the top, papers down the side, covers within. */
function FamilyTable({ formatId }) {
  const f = CATALOG[formatId];
  const sizes = groupOf(formatId, "size").options;
  const covers = groupOf(formatId, "cover").options;
  const papers = groupOf(formatId, "paper").options;
  const prices = PRICING.families[f.fam];

  /* Every row the table will draw, flattened first so the zebra runs
     unbroken down the whole table as it does on the live page. */
  const rows = [];
  papers.forEach(paper => {
    rows.push({ kind: "paper", paper });
    covers.forEach(cover => rows.push({ kind: "cover", paper, cover }));
    rows.push({ kind: "pages", paper });
  });

  const cell = (row, size) => {
    const key = `${size.id}_${paperKey(formatId, row.paper.id)}`;
    if (row.kind === "pages") {
      const rate = PRICING.additionalPages[key];
      return rate == null ? NA : money(rate);
    }
    const price = prices?.[row.cover.id]?.[key];
    return price == null ? NA : money(price);
  };

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <h3 style={{
        fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.4rem, 2.6vw, 1.75rem)",
        lineHeight: 1.25, margin: 0,
      }}>
        {f.label}
      </h3>

      <div style={{
        overflowX: "auto", scrollSnapType: "x proximity",
        border: `1px solid ${C.charcoal200}`, borderRadius: R.md, background: "#fff",
      }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 220 + sizes.length * 150 }}>
          <tbody>
            <tr style={{ background: ROW_BG(0), borderBottom: `1px solid ${C.charcoal200}` }}>
              <th style={{ ...labelCell, ...stickyCell }}>Size</th>
              {sizes.map((s, i) => (
                <th key={s.id} style={{ ...dataCell, ...lastCol(i, sizes.length), fontWeight: 700 }}>
                  {s.label}
                  {s.dims && (
                    <span style={{ display: "block", marginTop: 4, fontSize: TYPE.sm, color: T.textSubtle, fontWeight: 400 }}>
                      {s.dims}
                    </span>
                  )}
                </th>
              ))}
            </tr>

            {rows.map((row, i) => {
              const last = i === rows.length - 1;
              const bg = ROW_BG(i + 1);
              if (row.kind === "paper") {
                return (
                  <tr key={`p-${row.paper.id}`} style={{ background: bg, borderBottom: `1px solid ${C.charcoal200}` }}>
                    <th
                      colSpan={sizes.length + 1}
                      style={{ ...cellBase, fontWeight: 700, position: "sticky", left: 0 }}
                    >
                      {row.paper.label}
                      {row.paper.spec && (
                        <span style={{ marginLeft: 8, fontSize: TYPE.sm, color: T.textSubtle, fontWeight: 400 }}>
                          {row.paper.spec}
                        </span>
                      )}
                    </th>
                  </tr>
                );
              }
              return (
                <tr
                  key={`${row.paper.id}-${row.kind}-${row.cover?.id ?? "pages"}`}
                  style={{ background: bg, borderBottom: last ? 0 : `1px solid ${C.charcoal200}` }}
                >
                  <th style={{ ...labelCell, ...stickyCell, fontWeight: row.kind === "pages" ? 400 : 700 }}>
                    {row.kind === "pages" ? "Additional pages" : row.cover.label}
                  </th>
                  {sizes.map((s, k) => (
                    <td key={s.id} style={{ ...dataCell, ...lastCol(k, sizes.length) }}>
                      {cell(row, s)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* Notebooks price off the trade matrix under a paper id that is not the
   paper they are printed on — see NOTEBOOK_PAPERS in catalog.js. The
   lookup key is the trade one; the label the reader sees is the
   notebook's. */
const paperKey = (formatId, paperId) => paperId;

/* Wall art is priced material × size, a shape nothing else here uses. */
function WallArtTable() {
  const f = CATALOG.wallart;
  const materials = groupOf("wallart", "material").options;
  const sizes = groupOf("wallart", "size").options;

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <h3 style={{
        fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.4rem, 2.6vw, 1.75rem)",
        lineHeight: 1.25, margin: 0,
      }}>
        {f.label}
      </h3>
      <div style={{
        overflowX: "auto", scrollSnapType: "x proximity",
        border: `1px solid ${C.charcoal200}`, borderRadius: R.md, background: "#fff",
      }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 220 + sizes.length * 130 }}>
          <tbody>
            <tr style={{ background: ROW_BG(0), borderBottom: `1px solid ${C.charcoal200}` }}>
              <th style={{ ...labelCell, ...stickyCell }}>Size</th>
              {sizes.map((s, i) => (
                <th key={s.id} style={{ ...dataCell, minWidth: 130, ...lastCol(i, sizes.length), fontWeight: 700 }}>
                  {s.label}
                </th>
              ))}
            </tr>
            {materials.map((m, i) => (
              <tr
                key={m.id}
                style={{ background: ROW_BG(i + 1), borderBottom: i === materials.length - 1 ? 0 : `1px solid ${C.charcoal200}` }}
              >
                <th style={{ ...labelCell, ...stickyCell }}>{m.label}</th>
                {sizes.map((s, k) => {
                  const price = PRICING.wallArt[m.id]?.[s.id];
                  return (
                    <td key={s.id} style={{ ...dataCell, minWidth: 130, ...lastCol(k, sizes.length) }}>
                      {price == null ? NA : money(price)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* A magazine has one size, one paper and one cover, so the live page
   gives it a line rather than a grid. */
function MagazineTable() {
  const grade = groupOf("magazine", "grade").options[0];
  const price = PRICING.magazines.premium;
  const rate = PRICING.additionalPages.magazine_velvet_paper;

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <h3 style={{
        fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.4rem, 2.6vw, 1.75rem)",
        lineHeight: 1.25, margin: 0,
      }}>
        {CATALOG.magazine.label}
      </h3>
      <div style={{ border: `1px solid ${C.charcoal200}`, borderRadius: R.md, background: "#fff" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <tbody>
            <tr style={{ background: ROW_BG(0), borderBottom: `1px solid ${C.charcoal200}` }}>
              <th style={{ ...labelCell }}>{grade.label}</th>
              <td style={{ ...cellBase }}>{grade.dims}, softcover, 20 pages included</td>
              <td style={{ ...cellBase, fontWeight: 700, textAlign: "right" }}>{money(price)}</td>
            </tr>
            <tr style={{ background: ROW_BG(1) }}>
              <th style={{ ...labelCell, fontWeight: 400 }}>Additional pages</th>
              <td style={{ ...cellBase }}>Per page</td>
              <td style={{ ...cellBase, textAlign: "right" }}>{money(rate)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* The volume table, from the tiers each family carries in the catalogue —
   the same tiers the calculators discount by. */
function VolumeTable() {
  const rows = [
    ["Photo Book", "photo"],
    ["Paperback or Hardcover Book", "trade"],
    ["Magazine", "magazine"],
    ["Notebook or Journal", "notebook"],
  ];
  const bands = [[10, 19], [20, 49], [50, null]];
  const pct = (formatId, min) => {
    const tier = CATALOG[formatId].tiers.find(t => t.min === min);
    return tier ? `${Math.round(tier.pct * 100)}%` : "—";
  };

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <h3 style={{
        fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.4rem, 2.6vw, 1.75rem)",
        lineHeight: 1.25, margin: 0,
      }}>
        Volume Discounts
      </h3>
      <div style={{ overflowX: "auto", border: `1px solid ${C.charcoal200}`, borderRadius: R.md, background: "#fff" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 560 }}>
          <tbody>
            <tr style={{ background: ROW_BG(0), borderBottom: `1px solid ${C.charcoal200}` }}>
              <th style={{ ...labelCell, ...stickyCell }}>Product</th>
              {bands.map(([lo, hi], i) => (
                <th key={lo} style={{ ...dataCell, ...lastCol(i, bands.length), fontWeight: 700 }}>
                  {hi ? `${lo}–${hi} copies` : `${lo}+ copies`}
                </th>
              ))}
            </tr>
            {rows.map(([label, id], i) => (
              <tr
                key={id}
                style={{ background: ROW_BG(i + 1), borderBottom: i === rows.length - 1 ? 0 : `1px solid ${C.charcoal200}` }}
              >
                <th style={{ ...labelCell, ...stickyCell }}>{label}</th>
                {bands.map(([lo], k) => (
                  <td key={lo} style={{ ...dataCell, ...lastCol(k, bands.length) }}>{pct(id, lo)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ margin: 0, fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.55, fontFamily: FONT_BODY }}>
        Ordering a hundred copies or more? Large Order Services quotes the run rather than discounting from
        this table.
      </p>
    </section>
  );
}

export default function PricingTables() {
  return (
    <div style={{ display: "grid", gap: 48, fontFamily: FONT_BODY }}>
      <FamilyTable formatId="photo" />
      <FamilyTable formatId="trade" />
      <MagazineTable />
      <FamilyTable formatId="notebook" />
      <WallArtTable />
      <VolumeTable />
    </div>
  );
}
