# Handoff — Blurb Merchant Experience

Updated 2026-08-19. Start here, then read `CLAUDE.md` for conventions and decisions.

---

## What this is

Prototypes for the **seller side of blurb.com** — how someone discovers selling, prices a book, and reaches a checkout link. Grew out of **[DES-469](https://blurb-books.atlassian.net/browse/DES-469)**, the dual-pricing surface audit.

**Anain owns wireframes and architecture** (agreed 2026-08-17), plus item 7 — assembling everything into one proposal for Tom. Ana owns copy and value propositions (items 1–3); Deb owns segmentation, white-glove classification and the nav proposal (items 4–6).

| Where | What |
|---|---|
| This repo | `~/Documents/Claude/Projects/Blurb Merchant Experience` |
| Vercel | project `blurb-merchant-experience`, **RPI Print** team (`rpi-print-daf707f9`). CLI deploys only — no push-to-deploy |
| Live | **https://blurb-merchant-experience.vercel.app** — production, stable URL. Behind RPI SSO, so sharing outside the team needs a Vercel share link |
| Local | `npm run dev` |
| Board | [Merchant Pricing and Experience](https://www.figma.com/board/yh0flPHiAUhrALmaT1H8Xk/Merchant-Pricing-and-Experience) — journeys, page audit, tickets, questions, provenance |
| Audit note | Obsidian → `03 Resources/Dual Pricing Surface Audit — DES-469` |

---

## The four screens

Switchable from the demo bar, or directly via `?stage=<id>`.

| Stage | State |
|---|---|
| **`getstarted`** | ✅ The redesign of `/getting-started`. Three routes, project kinds, recommended product, channel comparison, handoff. |
| **`waystosell`** | ✅ Five channel cards. Value propositions **drafted** for Ana to overwrite. |
| **`pricing`** | ✅ Pricing calculator — what it costs to make. Lives under **Pricing** in the nav. |
| **`margin`** | ✅ Margin estimator — what you'd keep. Lives under **Sell & Self-Publish**. |

**Checkout link setup is deliberately not prototyped.** It is Stacey's design; her Checkout Link file is the spec.

### getstarted

`Start Your [Cookbook] [to Sell]` — one question, asked once.

- **Three routes**: to Sell · to Keep · to Distribute. Each changes what the page offers, what the calculator computes, and where it hands off. Under *to Keep* only, chips refine the recommendation: keepsake · display · gift.
- **Project kinds, not product types.** Fifteen kinds, as the live page has. The kind seeds a whole specification through `seedFor`; the recommended product then leads step 1, starred, with the reason stated.
- **The calculator is pinned alongside** and holds everything that moves the price. Under *to Sell* it is the margin ladder; under *to Distribute* it opens at 100 copies and shows cost per copy.
- **The handoff ends the page** — make it here, or bring one you already made. Log-in lives here and nowhere earlier.

### pricing and margin

Two pages, not two tabs, because the seller's numbers belong behind the seller section. Product options lead in both; the project-kind picker is behind *"Not sure which product?"*. Each names the other and links across, since a wrong turn is the likeliest mistake either page invites.

**The margin ladder** is the piece to look at: cost → price → profit, where **clicking a number takes control of it**. Profit-driven by default, which is how Blurb's own Bookstore works. The difference shows on a spec change — profit-driven holds your earnings and moves the buyer's price; price-driven does the reverse.

---

## Decisions

All recorded in `CLAUDE.md`. The ones most likely to be re-litigated:

1. **The gate is a quality gate, not a commitment fee.** A proof is required before a link can sell. It gates **buying, not publishing** — the link goes live, the page shows "coming soon" until a proof exists. A PDF proof satisfies it. Amazon and the Global Retail Network require it too; the Blurb Bookstore only recommends it.
2. **A PDF cannot be sold through a checkout link.** Orderable for yourself. Modelled by channel, not intention.
3. **The margin is payment for work the seller did** — a retail price covers running the shop, and a seller doing their own promotion carries that cost. Stated generally, never as a per-sale condition, and **never with retail and fulfilment side by side**.
4. **Ask what someone is doing, never who they are.** No identity gate; log-in only at the handoff.
5. **The buyer pays shipping**, so it never enters the seller's margin.

---

## What the site actually does — established 2026-08-19

Walked page by page with screenshots; every card is on the board under **Pages to touch**.

- **Two routes to Amazon.** Photo books go **direct** (five sizes; not Layflat, not Mini Square) for $1.35 + 15%. Trade books go via the **Global Retail Network**, which is Ingram, for the wholesale discount you set — 55% for widest reach. Magazines have no Amazon route. No page distinguishes the two.
- **Per-channel formats**: Bookstore takes photo, trade, magazines and notebooks; Amazon photo only; Ingram paperback and hardcover only. Modelled in `sellChannels`, with the layflat and Mini Square rules in `CHANNEL_RULES` because they depend on the configuration.
- **Nine pages compute price from a product spec**, not two — `/getting-started`, `/pdf-to-book` and seven verticals carry `.book_price` spans filled in the browser. Two verticals hand-type prices, and those are already adrift.
- **"Sell from your own website" is already promised** on `/childrens-books` and `/comic-books`, with no mechanism behind it. `/comic-books` and `/amazon` both mention an **embeddable book preview** — so checkout links are the buy button that widget lacks.
- **The ladder already ships.** `/amazon` and `/sell-through-blurb` both send sellers to a **Sales Channel & Profit** tab showing base cost, fees and profit per sale. Checkout links are a fourth row in something that exists.

---

## Corrections — please don't reintroduce these

- **Prices are a LOOKUP on cover + size + paper**, not a base plus deltas. `pricing.data.js` is generated from the real matrix embedded in `/pricing`.
- **Empty price spans are not missing prices.** `.book_price` spans are filled by JavaScript, so a `curl` or a markdown reader sees a label and no number. Load the page in a browser before concluding a price is absent.
- **Anything resting on a WebFetch summary is unconfirmed until `curl`'d** — and anything resting on `curl` is unconfirmed until it has been seen in a browser.
- **"Hardcover" is a group**, ImageWrap and Dust Jacket both. Blurb says hardcover when speaking of them together, and a from-price resolves to the cheapest member — Dust Jacket, which is cheaper than ImageWrap.
- **Magazines have no paper choice.** One magazine, one size, one paper. Its steps keep a book's shape but never say "choose".

---

## Open questions

Nineteen on the board, grouped by who can answer. The ones that block prototype work:

1. **Where does pricing guidance live** — Stacey's agent or our estimator?
2. **Variants vs our per-book model** — which should the estimator speak?
3. **What do we call the seller's cost?** `/amazon` says *base cost*, `/sell-through-blurb` says *base printing cost*, we say *your cost*. Blurb's dashboard also uses *wholesale discount* for the retailer's cut, so that word is spoken for.
4. **Who owns `/getting-started`?** In nobody's list, and the most central page in the flow.
5. **Is MagCloud deliberately not a selling channel?** Live, sells, and appears on no channel list anywhere.

Seven live-site defects are logged separately under **Tickets to raise** — none belong to this project.

---

## Every figure is a placeholder unless it says otherwise

- **Real**: all product prices, per-page rates, paper specs, page ceilings, volume tiers, the 67 shipping destinations, Amazon's $1.35 + 15%, Ingram's 55% wholesale discount, the $25 payout minimum.
- **Invented**: every **fulfilment price, seller cost and margin** — one constant, `FULFILMENT_FACTOR` in `catalog.js`, drives all of it. Also every **shipping rate**; `/shipping` publishes none.

---

## Gotchas

- **Node is via nvm** and not on `PATH` non-interactively: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"`
- npm blocks install scripts, so `esbuild` and `fsevents` warn on install. The build works; that is expected.
- **No push-to-deploy.** `vercel` for a preview, `vercel deploy --prod` to promote.
- The **WIP chip** reads `local` because there is no git integration. It still says "not approved", which is the part that matters.
- Typekit (futura-pt, proxima-nova) is domain-locked and may not resolve off blurb.com — the fallbacks in `tokens.js` are load-bearing.
- **Screenshots**: `puppeteer-core` drives the installed Chrome. The script scrolls a page before capturing, because lazy images otherwise come out blank.

---

## Suggested next moves

1. **Settle the estimator/agent overlap with Stacey.** Still the largest duplicated-effort risk.
2. **Adopt margin % as a third handle on the ladder.** Stacey's Pricing strategy has cost, price, margin % and profit all linked; ours drives from price or profit only.
3. **Finish the page walk** — nine verticals plus `/ingram`, `/print-api-software`, `/large-order-services`, `/pricing`, `/pdf-to-book`.
4. **Do the signed-in audit pass.** Six gaps in the DES-469 inventory; one screen-record from upload to order closes four.
5. **Assemble the proposal for Tom** (meeting item 7). The board is most of it; it needs a narrative pass rather than more zones.
