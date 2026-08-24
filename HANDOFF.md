# Handoff — Blurb Merchant Experience

Updated **2026-08-24**, end of session. Start here, then read `CLAUDE.md` for conventions and the decision log.

---

## Where things are

| Where | What |
|---|---|
| Repo | `~/Documents/Claude/Projects/Blurb Merchant Experience` — **local only, no remote** |
| Branch | **`v2`** ← you are here. `v1-home-pdp` is the frozen fallback (tag `snapshot-2026-08-24-home-pdp`); `main` still holds the 8/24 morning state |
| Live | **https://blurb-merchant-experience.vercel.app** — production, deployed 2026-08-24 from `v2` |
| Vercel | project `blurb-merchant-experience`, **RPI Print** team (`rpi-print-daf707f9`). CLI deploys only — no push-to-deploy |
| Local | `npm run dev` (port 5173/5174) |
| Board | [Merchant Pricing and Experience](https://www.figma.com/board/yh0flPHiAUhrALmaT1H8Xk/Merchant-Pricing-and-Experience) |
| Jira | [DES-469](https://blurb-books.atlassian.net/browse/DES-469) (audit) · DES-482 (dual pricing) |

**Not part of this work:** the AI listing-assist prototype at `~/Documents/Claude/Projects/AI Listing Assist (side project)`. Separate thread; never merge it in.

---

## The two scopes — new, and the first thing to show anyone

The demo bar carries a **Scope** dropdown. It is not two designs; the screens are the same screens. It changes **which are claimed**, and where the surfaces in the lean set point, because half their destinations are pages that version never builds. `?version=lean` opens it directly.

| | **Recommended** | **Minimum effort** |
|---|---|---|
| Home | ✅ | ✅ |
| `/formats` catalogue + selling lane | ✅ | ✅ |
| Photo-book PDP + doorway line | ✅ *"See your price"* → estimator | ✅ *"Open an Instant Store"* → the page |
| Sell page (`/self-publish`) | ✅ | ✅ |
| Instant Store page | ✅ placeholder | ✅ placeholder |
| Nav changes | ✅ | ✅ |
| `/getting-started` redesign | ✅ | ❌ untouched today |
| Pricing calculator | ✅ redesigned | ❌ stays as blurb.com has it |
| Margin estimator | ✅ | ❌ does not exist, so nothing is lost |

In lean, nav items pointing at unbuilt screens go inert rather than lying, the catalogue lane drops the estimator button and promotes the page, and "Price up a print run" leaves for blurb.com/pricing.

---

## The screens

Switchable from the demo bar, or via `?stage=<id>`.

| Stage | State |
|---|---|
| `home` | ✅ Rebuild of the live blurb.com home, measured at 1440. Instant Store lives in the **Selling tab**, not a band of its own |
| `catalog` | ✅ `/formats` rebuilt. Prices **computed per cover** by `variantFromPrice`. Selling lane after the grid |
| `product` | ✅ The ImageWrap photo-book PDP, with the doorway line |
| `getstarted` | ✅ Product first, then the options; the product is **not a numbered step** |
| `seller` | ✅ **The Sell page** — copies → routes + comparison → film → why Blurb → FAQ → closing lane |
| `pricing` / `margin` | ✅ Two calculators. The margin estimator is **Instant Store only**, said above the controls |
| `instantstore` | ⛔ **Placeholder — Crometrics is building this.** Do not design it |

---

## What changed this session

- **Checkout links → Instant Store** (copy only; ids and `sellChannels: ["checkout_link"]` unchanged). **The FigJam board still says "checkout links" everywhere and needs sweeping.**
- **The margin estimator prices one route.** A note above the controls says so, with a way out to the comparison.
- **One product card everywhere** (`FormatCards.jsx`) — photo flush to the edges, no frame until selected. The option cards inside the steps use the same geometry.
- **PDFs are off the product row** (`offered: false`) — no photograph exists for one. This supersedes half the 8/18 decision.
- **The Sell page was rebuilt**: gradient hero, Blurb's own illustrations, roughly half the copy, comparison table in the site's `/bookmaking-tools` pattern, framed on grey.
- **The site's real curves and logo**: `hero-clip` / `cta-clip-*` SVG clip paths copied verbatim into `index.html`; logo at 50px in 40px gutters.
- **Sticky panels clear the nav** via a measured `--nav-h`.

---

## Rules that keep getting re-litigated

1. **The margin is payment for work the seller did.** Stated generally, never per-sale, and **never with retail and fulfilment side by side**.
2. **Ask what someone is doing, never who they are.** No identity gate; log-in at the handoff only.
3. **The buyer pays shipping**, so it never enters the seller's margin.
4. **The proof gate is a quality gate**, and it gates **buying, not publishing**.
5. **A PDF cannot be sold through an Instant Store.** Modelled by channel, not intention.
6. **Comparison before commitment** — the channel comparison lives on the Sell page, not the estimator.

---

## Corrections — please don't reintroduce these

- **Prices are a lookup on cover + size + paper**, not a base plus deltas.
- **Empty `.book_price` spans are not missing prices** — they are filled in the browser. Load the page before concluding anything.
- **A build that only bundles is not a test.** `npm run build` passes with a page that throws on render; drive the browser.
- **`SELL_CHANNELS` uses `link`; `sellChannels` uses `checkout_link`.** Comparing them directly reports every channel as unavailable. `CATALOG_ID` maps them.
- **Anything from a WebFetch summary is unconfirmed until `curl`'d, and anything from `curl` is unconfirmed until seen in a browser.**

---

## Every figure is a placeholder unless it says otherwise

- **Real**: product prices, per-page rates, paper specs, page ceilings, volume tiers, shipping destinations, Amazon's $1.35 + 15%, Ingram's 55%, the $25 payout minimum.
- **Invented**: every fulfilment price, seller cost and margin — one constant, `FULFILMENT_FACTOR` in `catalog.js`. Also every shipping rate.
- **Four live-site gaps are visible on the catalogue** (ticket T7): paperback $2.99 vs the site's $3.99, ImageWrap hardcover $12.99 vs $13.99, linen hardcover $14.99 vs $15.99, layflat $58 vs $60.

---

## Gotchas

- **Node is via nvm**, not on `PATH` non-interactively: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"`
- npm blocks install scripts, so `esbuild` and `fsevents` warn. The build works; expected.
- **No push-to-deploy.** `vercel` for a preview, `vercel --prod --yes` to promote.
- The **WIP chip** reads the branch from a build-time define; anything not `main` shows "not approved".
- Typekit (futura-pt, proxima-nova) is domain-locked; the fallbacks in `tokens.js` are load-bearing.
- **Screenshots**: `playwright-core` drives the cached Chromium at `~/Library/Caches/ms-playwright/chromium-1234/...`, falling back to Chrome. Scroll before capturing — lazy images come out blank.
- **Sharing for review**: comments only work on **preview** deployments. Dashboard → deployment → Share → "Anyone with the link" → Copy Link. Reviewers need a free Vercel account to comment, not a seat.

---

## Next moves

1. **Sweep the FigJam board for "checkout links" → Instant Store**, and add the estimator-scope rule. Correct the board, don't annotate it.
2. **Pod items 2 and 3** — option cards into a modal on `/getting-started`, and "Ready to sell?" into the right panel, staying skippable. Both unblocked, never started.
3. **Get Ana's copy** onto the route cards and the Instant Store lane; ours is drafted, not hers.
4. **Confirm the Instant Store name** with whoever owns it, and whether `/self-publish` redirects to `/sell`.
5. **Settle the estimator/agent overlap with Stacey** — still the largest duplicated-effort risk.
6. **Data check**: `TOOLS` grants InDesign to wall art only, while `/pdf-to-book` advertises an InDesign plug-in for photo books. One of the two is wrong.
