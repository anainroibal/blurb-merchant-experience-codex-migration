# CLAUDE.md

## What this is

UI/UX prototypes for the **Blurb merchant / seller experience** — a Vite + React app deployed to Vercel.

Companion to the FigJam board [Merchant Pricing and Experience](https://www.figma.com/board/yh0flPHiAUhrALmaT1H8Xk/Merchant-Pricing-and-Experience), which holds the research, the flow, the recommendations and the provenance of every figure. **Read the board before changing a screen** — most decisions here have a reason recorded there.

Jira: [DES-469](https://blurb-books.atlassian.net/browse/DES-469) (the discovery audit this grew out of).

## The four screens

`STAGES` in `src/App.jsx` drives one linear journey, switchable from the demo bar and openable directly via `?stage=<id>`:

1. **`getstarted`** — the redesign of `/getting-started`. It is *already* intent-first: the live page has an intention dropdown (`to Sell · as a Keepsake · to Display · to Gift`, defaulting to keepsake). The redesign gives "to Sell" somewhere to go; it does **not** add a new intent question and does **not** flip the default.
2. **`waystosell`** — one card per route to market. The card set is ours; the value proposition on each card is Ana's.
3. **`estimator`** — public, anonymous, intent-first. Educates and converts, creates nothing.
4. **`link`** — checkout link setup, in the dashboard. Specified in Stacey's **Checkout Link** file: agent-led, and **variants** are the unit rather than the book. Read it before designing here.

## Decisions already made

- **A PDF cannot be sold through a checkout link** *(2026-08-18)*. It can still be **ordered for yourself** — PDFs stay in the product types for keepsake, display and gift, and disappear only under "to Sell". Modelled as `sellChannels` per format in `catalog.js`, not as an intention rule, because the decision was specific to checkout links. Whether other channels sell PDFs is unconfirmed.
- **The gate is a QUALITY GATE, not a commitment fee** *(confirmed 2026-08-18)*. Blurb has always required an author to order and review a copy before a book goes on sale — a longstanding platform rule (HLP-81), not new to checkout links, with friction kept in deliberately to keep quality up. Specified in Stacey's **Proof Requirement** file.
  - **It gates buying, not publishing.** Setup is never blocked. A seller can go live with no proof; the PDP then hides price, quantity and Add to cart and shows *"This product is coming soon"* until a proof exists.
  - **A PDF proof satisfies it**, as does a discounted or free physical copy. Either one alone.
  - It clears automatically, even while a buyer has the PDP open. Banners are non-dismissible.
- **The seller's price floors at their cost**, so the ladder can never show negative profit. A real minimum-price rule is still an open product question.
- **The buyer pays shipping**, so it never enters the seller's margin — only "what your buyer pays".

## Rules the screens have to hold

These came out of the audit and they are the reason the design looks the way it does:

- **The fulfilment price is a line in a calculation, never a price tag.** The ladder is two rungs — *your cost → your price → your profit*. No shipping (the buyer pays it) and no fulfilment fee (nothing says Blurb charges one).
- **Pricing follows the order, not the user.** Ask what someone is doing, never who they are. No identity gate, no account-level price mode.
- **Bind prices only where a binding exists.** Most Blurb marketing pages carry hand-typed prices; only `/getting-started` and `/pdf-to-book` compute from a product spec. Those are the surfaces that can carry a second value structurally.
- **Comparison before commitment.** The channel comparison belongs on the estimator, not the link screen.
- **Second person everywhere** — *your cost, your price, your profit*. Keep "list price" for the customer-facing number. Never "wholesale": `/ingram` already uses it for the retailer trade discount.

## Figures

**Every price in this repo is a placeholder.** Blurb does not publish fulfilment pricing. Sourced figures (Amazon's $1.35 + 15%, the volume tiers, the LOS bands) are listed in the board's provenance panel — check there before treating any number as real.

## Commands

- `npm install` — React 18, Vite, `@vitejs/plugin-react`
- `npm run dev` — dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the built `dist/`

**Node is installed via nvm** and is not on `PATH` in a non-interactive shell. Source it first:

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
```

npm 12 blocks install scripts by default, so `esbuild` and `fsevents` are held back. The build works anyway — that warning is expected, not a failure.

Always verify with a local `npm run build` (~1s) rather than pushing and reading Vercel state.

## Deploying

Vercel project lives in the **RPI Print** team (scope `rpi-print-daf707f9`), not a personal account. Deployed from the CLI rather than a GitHub integration, so there is no push-to-deploy — run `vercel` for a preview, `vercel --prod` to promote.

Any build whose branch is not `main` shows a **"Work in progress — not approved"** chip on every screen (`WipChip`). The branch name comes from a build-time define in `vite.config.js` — Vercel's `VERCEL_GIT_COMMIT_REF`, falling back to the local git branch. Don't hardcode it per branch; it conflicts on every merge.

## Conventions

- Inline `style={{}}` objects plus the small global `<style>` block in `index.html`. No CSS framework, no classes beyond `.ms` (Material Symbols).
- All design values flow through the `T` tokens object at the top of `src/App.jsx`.
- Brand blue `#107eb1`, dark `#0d2f44`, success green `#2e7d32`, light panel `#f0f7fb`, borders `#e0e0e0`.
- All state is local `useState`. No router, context or store.
- Deliberately mirrors **Blurb Checkout Prototypes** so the two read alike. Where Blurb's **Codex Foundation** design system has a spec, follow it rather than inventing a variant.
