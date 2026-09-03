import React from "react";
import { PricingTable, ComparisonTable } from "@blurb/codex-react";
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

const groupOf = (formatId, id) => CATALOG[formatId].groups.find(g => g.id === id);
const NA = "Not Available";

/* One family: sizes across the top (Codex PricingTable's `columns`), papers
   down the side as toggleable sections, covers (plus an "Additional pages"
   row) nested within each — exactly PricingTable's `sections` shape, not a
   coincidence: this table was already built to the live page's own grouped
   layout, which is what that component models. */
function FamilyTable({ formatId }) {
  const f = CATALOG[formatId];
  const sizes = groupOf(formatId, "size").options;
  const covers = groupOf(formatId, "cover").options;
  const papers = groupOf(formatId, "paper").options;
  const prices = PRICING.families[f.fam];

  const priceFor = (paper, cover, size) => {
    const key = `${size.id}_${paperKey(formatId, paper.id)}`;
    const price = prices?.[cover.id]?.[key];
    return price == null ? NA : money(price);
  };
  const pagesRate = (paper, size) => {
    const key = `${size.id}_${paperKey(formatId, paper.id)}`;
    const rate = PRICING.additionalPages[key];
    return rate == null ? NA : money(rate);
  };

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <h3 style={{
        fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: "clamp(1.4rem, 2.6vw, 1.75rem)",
        lineHeight: 1.25, margin: 0,
      }}>
        {f.label}
      </h3>

      <PricingTable
        rowHeader="Size"
        columns={sizes.map(s => ({ title: s.label, subtitle: s.dims }))}
        sections={papers.map(paper => ({
          title: paper.label,
          subtitle: paper.spec,
          rows: [
            ...covers.map(cover => ({
              label: cover.label,
              cells: sizes.map(s => priceFor(paper, cover, s)),
            })),
            { label: "Additional pages", cells: sizes.map(s => pagesRate(paper, s)) },
          ],
        }))}
      />
    </section>
  );
}

/* Notebooks price off the trade matrix under a paper id that is not the
   paper they are printed on — see NOTEBOOK_PAPERS in catalog.js. The
   lookup key is the trade one; the label the reader sees is the
   notebook's. */
const paperKey = (formatId, paperId) => paperId;

/* Wall art is priced material × size, a shape nothing else here uses — a
   flat grid, no groups, so it's Codex's ComparisonTable rather than
   PricingTable (whose sections a one-level table doesn't need). */
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
      <ComparisonTable
        columnHeaders={["Size", ...sizes.map(s => s.label)]}
        rows={materials.map(m => ({
          header: m.label,
          cells: sizes.map(s => {
            const price = PRICING.wallArt[m.id]?.[s.id];
            return price == null ? NA : money(price);
          }),
        }))}
      />
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
      <ComparisonTable
        columnHeaders={["Product", ...bands.map(([lo, hi]) => (hi ? `${lo}–${hi} copies` : `${lo}+ copies`))]}
        rows={rows.map(([label, id]) => ({
          header: label,
          cells: bands.map(([lo]) => pct(id, lo)),
        }))}
      />
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
