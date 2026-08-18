import { CATALOG, defaultSelection, reconcile, isAvailable } from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   Demo projects for the signed-in state.

   Stacey's Checkout Link file has two setup flows — "No Blurb
   Projects" and "Existing Blurb projects" — and the second one starts
   by retrieving the seller's projects and recommending based on
   completion status. This is that list.

   `hasProof` mirrors the legacy dashboard's hasPaidOrderShipments
   flag: true once a project has any paid order. It decides whether a
   link can start selling immediately or goes live with buying
   switched off until a proof lands.

   Selling is a project-level state — a seller can have selling and
   non-selling projects side by side.
   ──────────────────────────────────────────────────────────────── */

/* Build a valid configuration for a project, repairing anything the real
   price matrix does not actually offer. */
function config(formatId, overrides = {}, pages) {
  let sel = { ...defaultSelection(formatId), ...overrides };
  for (const g of CATALOG[formatId].groups) sel = reconcile(formatId, sel, g.id);
  if (!isAvailable(formatId, sel)) sel = defaultSelection(formatId);
  if (pages) sel.pages = pages;
  return sel;
}

export const PROJECTS = [
  {
    id: "kyoto",
    title: "Kyoto in Winter",
    subtitle: "Photo book · 96 pages",
    formatId: "photo",
    sel: config("photo", { size: "standard_landscape", cover: "imagewrap", paper: "premium_paper_lustre" }, 96),
    hasProof: true,
    selling: false,
    icon: "menu_book",
  },
  {
    id: "saltpath",
    title: "Notes from the Salt Path",
    subtitle: "Trade book · 240 pages",
    formatId: "trade",
    sel: config("trade", { size: "large_text", cover: "softcover", paper: "standard_trade_bw_matte_paper" }, 240),
    hasProof: false,
    selling: false,
    icon: "auto_stories",
  },
  {
    id: "fieldnotes",
    title: "Field Notes, Spring",
    subtitle: "Magazine · 32 pages",
    formatId: "magazine",
    sel: config("magazine", { grade: "premium" }, 32),
    hasProof: true,
    selling: true,
    icon: "auto_stories",
  },
];
