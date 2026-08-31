# Handoff — Blurb Merchant Experience

Updated **2026-08-31**, covering the session of 28 August. Start here, then read `CLAUDE.md` for
conventions and the decision log, and `REVIEW-DES-482.md` for the reasoning
behind anything Ana asked for.

---

## Where things are

| Where | What |
|---|---|
| Repo | `~/Documents/Claude/Projects/Blurb Merchant Experience` — **local only, no remote** |
| Branch | **`v2`** ← you are here, at `80249a6`. `v1-home-pdp` is the frozen fallback (tag `snapshot-2026-08-24-home-pdp`); `main` still holds the 8/24 morning state |
| Live | **https://blurb-merchant-experience.vercel.app** — production, **current with `v2`** (promoted 2026-08-28). Verified in a browser, not just built |
| Vercel | project `blurb-merchant-experience`, **RPI Print** team (`rpi-print-daf707f9`). CLI deploys only — no push-to-deploy |
| Local | `npm run dev` (5173 upward; it walks to the first free port) |
| Board | [Merchant Pricing and Experience](https://www.figma.com/board/yh0flPHiAUhrALmaT1H8Xk/Merchant-Pricing-and-Experience) |
| Instant Store LP | [260824 POC — Instant Store LP](https://www.figma.com/make/vvCuAgnIuUxg1nXhkpwQHj/260824-POC---Instant-Store-LP) — the Figma Make POC our page is built from. Read it before claiming anything about that page |
| Jira | [DES-469](https://blurb-books.atlassian.net/browse/DES-469) (audit) · [DES-482](https://blurb-books.atlassian.net/browse/DES-482) (dual pricing — Ana's review lives in the comments) |

**Not part of this work:** the AI listing-assist prototype at
`~/Documents/Claude/Projects/AI Listing Assist (side project)`. Separate thread;
never merge it in.

---

## The two scopes — the first thing to show anyone

The demo bar carries a **Scope** dropdown. It is not two designs; the screens are
the same screens. It changes **which are claimed**, and where the surfaces in the
lean set point, because half their destinations are pages that version never
builds. `?version=lean` opens it directly.

| | **Recommended** | **Minimum effort** |
|---|---|---|
| Home | ✅ | ✅ |
| `/formats` catalogue + selling lane + price modal | ✅ | ✅ |
| Photo-book PDP + selling line | ✅ *"See your price"* → calculator | ✅ *"Open an Instant Store"* → the page |
| Sell page (`/sell`) | ✅ | ✅ |
| Instant Store page | ✅ placeholder | ✅ placeholder |
| Nav changes | ✅ | ✅ |
| Pricing page | ✅ replaced by the calculator | ✅ **today's page + one Instant Store lane** |
| Shipping page | ✅ informational, no calculator | ✅ **today's page, calculator included, + the lane** |
| `/getting-started` redesign | ✅ | ❌ untouched |
| Instant Store profit calculator | ✅ | ❌ does not exist, so nothing is lost |

The lean pricing and shipping pages are **not retyped**. They read the same
`PRICING` matrix the calculators use, so the two cannot drift.

---

## The screens

Switchable from the demo bar, or via `?stage=<id>`.

| Stage | State |
|---|---|
| `home` | ✅ Rebuild of the live blurb.com home at 1440. Instant Store lives in the **Selling tab** |
| `catalog` | ✅ `/formats` rebuilt, prices computed per cover. Selling lane after the grid; **"What changes the price?" opens the live modal**, with a sixth step on selling |
| `product` | ✅ The ImageWrap photo-book PDP. **"Selling this?" sits beside the price**, not below the buttons |
| `getstarted` | ✅ Product first. Deltas per option, shipping and postcode, the fork under **"Ready to make it?"**, Questions accordion at the foot |
| `seller` | ✅ **The Sell page** — copies → four route cards + comparison → film → why Blurb → FAQ → closing lane |
| `pricing` | ✅ Pricing calculator (`?mode=make`). `&version=lean` gives today's page instead |
| `margin` | ✅ **Instant Store profit calculator** (`?mode=sell`). Scope named above the controls, positively |
| `shipping` | ✅ Informational — rates, speeds, what moves a date. No calculator |
| `instantstore` | ✅ **The Instant Store landing page**, built 2026-08-28 from the Figma Make POC. Crometrics still owns the live page; ours is reference (item 24) |

---

## What changed on 28 August

Fifteen commits. The first two thirds are Ana's DES-482 review; the last third is
the Instant Store landing page. **Every bullet of her four
comments now has an entry in `REVIEW-DES-482.md`** saying done, done-differently,
or not-doing-and-why — written to be quoted back into the ticket.

- **The margin estimator is the Instant Store profit calculator.** Copy only; the
  stage id stays `margin` and the file stays `Estimator.jsx`.
- **Its scope reads positively** (design review item 21): *these figures are for a
  sale through your Instant Store*, then the other routes, then the door.
- **The shipping calculator page became informational**, because both calculators
  now price delivery where the book is.
- **Lean pricing and shipping pages**, answering "is a rebuild required for
  launch?" with both options rather than an argument.
- **Notebooks withdrawn from every selling channel** (eng, via Ana). The sellable
  product list is now **generated** from `sellChannels` — `sellableSentence()` —
  so the next withdrawal rewrites every sentence built on it at once. **The live
  `/self-publish` is now wrong and needs correcting by whoever owns it.**
- **The price modal** on the catalogue, in blurb.com's own copy, with a sixth
  step on selling that carries no figure.
- **The nav, worked through against Ana's list**: "seller hub" gone, Volume orders
  and RPI Print API under Sell *and* Services, Switch to Blurb out of both, API
  Printing → RPI Print API, Tools → **Creation Tools**, Retail distribution as one
  item, "See all …" across the foot of Sell and Creation Tools, one cross-link
  from Pricing to the profit calculator, chevrons on the calculator link and the
  featured cards.
- **The Instant Store landing page is built** — see below. This **reverses the
  8/24 placeholder decision**.
- **The footer names Blurb**, not RPI Print: `© 2026 Blurb, Inc. All rights
  reserved.`
- **The work-in-progress chip is gone.** It rode on the branch name; the chip, the
  `__BRANCH__` define and `vite.config.js`'s branch lookup came off together.
  Nothing marks a build as unapproved now — the demo bar's own controls are the
  only signal that this is a prototype.

---

## The Instant Store landing page — new, and the thing most likely to be misread

`?stage=instantstore` was a placeholder saying "Crometrics owns this". It is now a
full landing page, built from the Figma Make POC. **Ownership did not change** —
Crometrics still builds the live page, and whether ours stays a design or is handed
over is item 24. Read `REVIEW-DES-482.md` item 29 before touching it; the short
version:

- **What it argues.** The link opens a *real product page*, not a payment box. Four
  proofs under a screenshot of the whole page — the interactive preview, the author
  panel, "More from you", and the buy block.
- **The images are the POC's own screens of `blurb.com/c/36690`**, committed to
  `public/assets/store-*.png` rather than hotlinked: the MCP asset URLs expire in
  about a week.
- **`store-page.png` is edited.** The POC's *"Printed and shipped by Blurb"* badge
  is painted out, because **RPI Print does the printing** (Anain, 2026-08-28). If
  you ever re-export that asset from the POC, the badge comes back — patch it again.
- **The ladder carries `$X`, deliberately.** The POC's worked figures contradict
  each other; any number here is invented, and an invented sum on a marketing page
  gets quoted.
- **Three claims from the POC are refused**: "earn more per sale than anywhere
  else", "no platform cut — ever", and "a whole store in one link". Unsourced,
  unpromiseable, and overclaiming in the way the POC's own brief warns against.
- **Every block is an existing component** — the shared gradient hero, the Sell
  page's icon grid, the Codex split panel, **Alert L** (its first appearance on a
  screen, carrying the proof requirement) and the shared `Faq`.

---

## Rules that keep getting re-litigated

1. **The margin is payment for work the seller did.** Stated generally, never
   per-sale, and **never with retail and fulfilment side by side.**
2. **Ask what someone is doing, never who they are.** No identity gate; log-in at
   the handoff only.
3. **The buyer pays shipping**, so it never enters the seller's margin. It can sit
   *beside* it, behind a checkbox, saying so.
4. **The proof gate is a quality gate**, and it gates **buying, not publishing**.
5. **A PDF cannot be sold through an Instant Store.** Modelled by channel, not
   intention.
6. **Comparison before commitment** — the four routes are compared on the Sell
   page, never inside a calculator that prices one of them.
7. **Say the scope before the controls, and say it positively.** A caveat read
   after the figures has already failed.

---

## Corrections — please don't reintroduce these

- **Prices are a lookup on cover + size + paper**, not a base plus deltas.
- **Empty `.book_price` spans are not missing prices** — they are filled in the
  browser. Load the page before concluding anything.
- **A build that only bundles is not a test.** `npm run build` passes with a page
  that throws on render; drive the browser.
- **`SELL_CHANNELS` uses `link`; `sellChannels` uses `checkout_link`.** Comparing
  them directly reports every channel as unavailable. `CATALOG_ID` maps them.
- **Don't type a product list into copy.** `sellableSentence(channel)` writes it.
- **Anything from a WebFetch summary is unconfirmed until `curl`'d, and anything
  from `curl` is unconfirmed until seen in a browser.**

---

## Every figure is a placeholder unless it says otherwise

- **Real**: product prices, per-page rates, paper specs, page ceilings, volume
  tiers, shipping destinations, Amazon's $1.35 + 15%, Ingram's 55%, the $25 payout
  minimum.
- **Invented**: every fulfilment price, seller cost and margin — one constant,
  `FULFILMENT_FACTOR` in `catalog.js`. Also every shipping rate.
- **Four live-site gaps are visible on the catalogue** (ticket T7): paperback
  $2.99 vs the site's $3.99, ImageWrap hardcover $12.99 vs $13.99, linen hardcover
  $14.99 vs $15.99, layflat $58 vs $60.

---

## Gotchas

- **Node is via nvm**, not on `PATH` non-interactively:
  `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"`
- npm blocks install scripts, so `esbuild` and `fsevents` warn. The build works;
  expected.
- **No push-to-deploy.** `vercel` for a preview, `vercel --prod --yes` to promote.
- Typekit (futura-pt, proxima-nova) is domain-locked; the fallbacks in `tokens.js`
  are load-bearing.
- **Screenshots**: `playwright-core` is **not installed** anywhere — not in this
  project, not globally — so a script that imports it fails. What works is driving
  the cached binary directly:
  `~/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-x64/chrome-headless-shell`
  with `--headless --virtual-time-budget=9000 --window-size=W,H --screenshot=... --dump-dom`.
  Note the app bundle under `chromium-1234/` is *Google Chrome for Testing.app*,
  not `Chromium.app`, so the obvious glob misses it. `--screenshot` captures the
  window, not the full page: set a tall `--window-size` and crop with `sips`.
- **`--dump-dom` is the render test.** The build passing proves nothing — a page
  that throws still bundles. Dump the DOM and assert the headings are in it.
- **Sharing for review**: comments only work on **preview** deployments. Dashboard
  → deployment → Share → "Anyone with the link" → Copy Link. Reviewers need a free
  Vercel account to comment, not a seat.

---

## Next moves

**Ours to close:**

1. **Post the reply to Ana on DES-482.** Drafted and agreed, not sent — Anain is
   handling it. It covers the nav changes, the one push-back (Services and
   Resources are not merged), and the two pieces of her feedback nothing had
   answered: the per-channel option in the "to…" dropdown, and whether "pricing
   calculator" is clear enough.
2. **Sweep the FigJam board for "checkout links" → Instant Store**, and add the
   scope rule. Correct the board, don't annotate it.
3. **Get Ana's copy** onto the route cards and the Instant Store lane; ours is
   drafted, not hers.
4. **Data check**: `TOOLS` grants InDesign to wall art only, while `/pdf-to-book`
   advertises an InDesign plug-in for photo books. One of the two is wrong.
5. **Decide whether "we print" needs to become RPI anywhere in the copy.** The
   badge came out of the screenshot because RPI does the printing, but the pages
   still speak in Blurb's first person — "we print, pack and ship" — which is the
   live site's voice everywhere. If the distinction has to reach the copy, it is a
   deliberate sweep across the Sell page and both calculators, not a one-page edit.
   **Raised, not decided.**

**Waiting on a decision (all in `REVIEW-DES-482.md`):**

6. **Item 22 — where the profit calculator sits in the IA.** This build is the
   maximal version: featured under Sell, cross-linked from Pricing, and on the
   PDP. Easy to dial back, impossible to guess.
7. **Item 23** — RPI Print API and Large Order Services belong in the comparison
   table, not just the nav.
8. **Item 24 — now the sharper question.** Does the Sell page stay ours or go to
   CRO Metrics with the brief? The Instant Store page is no longer a placeholder
   deferring to them, so the same question applies to it too, and Ana's 8/28 note
   about a selling overview page is a third instance of it.
9. **Item 25** — confirm with engineering that Get started can lead straight into
   creation. "Ready to make it?" assumes it can.
10. **Item 26** — who owns the get-started modules if the editor landing page
   reuses them.
11. **Settle the calculator/agent overlap with Stacey** — still the largest
    duplicated-effort risk.
