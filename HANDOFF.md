# Handoff — Blurb Merchant Experience

Written 2026-08-18, end of the first session. Start here, then read `CLAUDE.md` for conventions.

---

## What this is

Prototypes for the **seller side of blurb.com** — how someone discovers selling, prices a book, and reaches a checkout link. Grew out of **[DES-469](https://blurb-books.atlassian.net/browse/DES-469)**, the dual-pricing surface audit.

**Anain owns wireframes and architecture** (agreed at the 2026-08-17 meeting), plus item 7 — assembling everything into one proposal for Tom. Ana owns copy and value propositions (items 1–3); Deb owns segmentation, white-glove classification and the nav proposal (items 4–6).

| Where | What |
|---|---|
| This repo | `~/Documents/Claude/Projects/Blurb Merchant Experience` |
| Vercel | project `blurb-merchant-experience` in the **RPI Print** team (`rpi-print-daf707f9`). CLI deploys only — no push-to-deploy |
| Live | https://blurb-merchant-experience-399ga81bn-rpi-print-daf707f9.vercel.app — **behind RPI SSO**, so sharing needs team access or a Vercel share link |
| Local | `npm run dev` — was on `:5180` |
| Board | [Merchant Pricing and Experience](https://www.figma.com/board/yh0flPHiAUhrALmaT1H8Xk/Merchant-Pricing-and-Experience) — the research, flow, recommendations and provenance |
| Audit note | Obsidian → `03 Resources/Dual Pricing Surface Audit — DES-469` |

---

## State of the four screens

| Stage | State |
|---|---|
| **`getstarted`** | ✅ Built out. The real work of this session. |
| **`waystosell`** | ✅ First pass. Five channel cards with a marked slot for Ana's copy. |
| **`estimator`** | ⬜ Placeholder — **and possibly redundant, see below.** |
| **`link`** | ⬜ Placeholder — **do not build without reading Stacey's file first.** |

### What `getstarted` does

A redesign of the live `/getting-started`. That page is **already intent-first** — its markup carries an `#intention-dropdown` with `sell · keepsake · display · gift`, defaulting to keepsake. So this is not a new question; it gives "to Sell" somewhere to go.

- **Hero** keeps the mad-lib: *Start Your **[Project] [to Sell]***. Intentions are regrouped — selling alone, then "For yourself".
- **Step 1** product types, filtered by intention. Under "to Sell" a signed-in seller sees **their existing projects first** (with proof status) and can skip configuration entirely; signed out they get a log-in prompt.
- **Steps 2–4** size, cover, paper as image-led cards, following the *Blurb Pricing Page* Figma calculator, using **real prices**.
- **The calculator is pinned alongside** and holds every variable that moves the price — pages, copies, white label, and a collapsible shipping estimate.
- **Handoff** ends the page. It estimates and hands off; it does not complete the journey. PDF upload is the favoured path.

Prototype controls live in the dashed strip under the nav: **nav Today/Proposed** and **session Signed out/Signed in**.

---

## Decisions made this session

Recorded in `CLAUDE.md` too, so they don't get relitigated.

1. **The gate is a QUALITY GATE, not a commitment fee** *(confirmed 2026-08-18)*. A longstanding Blurb rule (HLP-81), not new to checkout links. **It gates buying, not publishing** — the link goes live, the PDP hides price/quantity/Add-to-cart and shows "coming soon" until a proof exists. **A PDF proof satisfies it**, as does a discounted or free physical copy.
2. **A PDF cannot be sold through a checkout link**. It can still be *ordered for yourself*. Modelled as `sellChannels` per format — by channel, not by intention.
3. **The buyer pays shipping**, so it never enters the seller's margin — only "what your buyer pays".
4. **The seller's price floors at their cost.** A real minimum-price rule is still open.
5. **White label** replaces "remove Blurb logo" — framed as a gain, with a tooltip explaining the mark on the last page.
6. **End sheets are out** of this page — a finishing choice, so they belong in Add to Cart.

---

## Corrections — please don't reintroduce these

I got these wrong during the session and fixed them. They are all easy to fall back into.

- **Prices are a LOOKUP on cover + size + paper**, not a base plus deltas. `pricing.data.js` is generated from the real matrix embedded in `/pricing` (810 prices). Not every combination exists — Mini Square softcover has one paper.
- **`/pdf-to-book` does not render empty prices.** It and `/getting-started` are the only two pages checked that bind price to a product spec; every other marketing page has prices typed into the copy. That makes zone A *more* expensive to change, not less.
- **The tools already show pricing.** BookWright's marketing page not mentioning it is not evidence the tool lacks it.
- **`/getting-started` was missed by the original 36-surface audit** and is arguably the most central page in the flow.
- **Magazines have no paper choice** — paper and cover are fixed per product and shown as read-only specs, after BookWright.

General lesson worth carrying: several of these came from reading pages through a markdown converter rather than raw HTML. **Anything resting on a WebFetch summary should be treated as unconfirmed until `curl`'d.**

---

## Related files — read before building more

| File | Owner | Why it matters |
|---|---|---|
| [Proof Requirement](https://www.figma.com/design/JHNAyUd25lFkWwBFeleLym/Proof-Requirement) | Stacey | Specifies the quality gate. Settles what we spent a long time guessing at. |
| [Checkout Link](https://www.figma.com/design/DwOtjq4yUU2HdhJ2ZWxkR9/Checkout-Link) | Stacey | The setup flow, **agent-led**, with **variants** as the unit rather than the book. PayPal payout, QR code, review-based quality gate. |
| [Phase 2 Dashboard](https://www.figma.com/design/gTzyLLjj8B04uIvYqr14FY/Phase-2-Dashboard) | Josh | Reference only. "Checkout links" already exists as a dashboard section beside Projects and Earnings. |
| [Blurb Pricing Page](https://www.figma.com/design/0wUZKSbyvGYUPUvdM6M3Bn/Blurb-Pricing-Page) | Anain | The v1-4 pricing calculator this configurator follows. |

**Two live overlaps to settle before building `estimator` or `link`:**

- Stacey's setup flow has an **agent that suggests a retail price per variant, flags thin margin and surfaces fulfilment cost**. That is our estimator. One of them should own it.
- Her flow prices **per variant**; ours prices per book. "One book, one link, one price" is too simple to describe what is being built.

---

## Open questions

All seventeen are on the board in the **Pending questions** zone, grouped by who can answer. The ones that block prototype work:

1. **Where does pricing guidance live** — Stacey's agent or our estimator?
2. **Variants vs our per-book model** — which should the estimator speak?
3. **What is the fifth way to sell** — API or Large Order Services? It changes the card set and the nav grouping.
4. **Who owns `/getting-started`?** It is in nobody's list.
5. **Naming the second price** — "your cost" + "list price", and *not* "wholesale" (`/ingram` already uses it for the retailer trade discount). Blocks all copy.

Also outstanding: **DES-448** ("Cart Change — Checkout Link — PDF", In Review since 8/13) makes PDF purchasable through a checkout link, which contradicts decision 2 above. Its owner needs telling.

---

## Every figure is a placeholder unless it says otherwise

- **Real**, from `/pricing`'s embedded matrix: all product prices, per-additional-page rates, paper specs and page ceilings. Amazon's $1.35 + 15%. Volume tiers. The $25 payout minimum.
- **Invented**: every **fulfilment price, seller cost and margin** — Blurb publishes none. One constant, `FULFILMENT_FACTOR` in `catalog.js`, drives all of it. Also every **shipping rate**; `/shipping` publishes none.

The calculator panel says which you are looking at. The board's **Figures and provenance** zone has the full classification.

---

## Gotchas

- **Node is via nvm** and not on `PATH` non-interactively: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"`
- npm blocks install scripts, so `esbuild` and `fsevents` warn on install. The build works; that is expected.
- **No push-to-deploy.** `vercel` for a preview, `vercel --prod` to promote.
- The **WIP chip** reads `local` because there is no git integration, so `VERCEL_GIT_COMMIT_REF` is unset. It still says "not approved", which is the part that matters.
- Typekit (futura-pt, proxima-nova) is domain-locked and may not resolve off blurb.com — the fallbacks in `tokens.js` are load-bearing.

---

## Suggested next moves

1. **Settle the estimator/agent overlap with Stacey** before building anything else. It is the largest duplicated-effort risk.
2. **Get the fifth channel decided** so `waystosell` can be finished and handed to Ana.
3. **Do the signed-in audit pass** — six gaps in the DES-469 inventory, four of which one screen-record from upload to order would close.
4. **Assemble the proposal for Tom** (meeting item 7). The board is most of it; it needs a narrative pass rather than more zones.
