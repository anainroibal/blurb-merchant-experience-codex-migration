# Onboarding — new to this project?

This is a **setup guide for a new person joining the Blurb merchant/seller
experience prototype work** — separate from `HANDOFF.md`, which is a
running session-to-session log Anain keeps for continuity between working
sessions. Read this once, up front, to get your machine working; then read
`CLAUDE.md` in full before changing a screen — it's the canonical spec.

Deploying to Vercel stays with Anain for now. This guide gets you to a
working local preview, nothing more.

## 1. Get the code

The repo is public on GitHub: `anainroibal/blurb-merchant-experience-codex-migration`.

1. Fork it on GitHub (top-right "Fork" button on the repo page).
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/blurb-merchant-experience-codex-migration.git
   cd blurb-merchant-experience-codex-migration
   ```
3. Check out the active branch — active development is on
   **`codex-migration`**, not `main`:
   ```bash
   git checkout codex-migration
   ```

Branches you'll see, and what each is for:
- **`main`** — older baseline.
- **`v1-home-pdp`** — frozen fallback, tagged `snapshot-2026-08-24-home-pdp`. Don't build on this.
- **`v2`** — where major (non-Codex) changes go.
- **`codex-migration`** *(current)* — rewriting the UI onto Blurb's real `@blurb/codex-react` component library in place of the hand-rolled inline-style components `v2` uses. Same screens, same behavior — see `CODEX-MIGRATION.md` for exactly what's migrated and what's deliberately left custom.

When you're ready to share work back, push to your fork and open a PR
against `anainroibal/blurb-merchant-experience-codex-migration` on the
`codex-migration` branch. Anain reviews, merges, and handles deploys.

## 2. Install Node

Node is managed via **nvm**, and isn't on `PATH` in a fresh shell until you
source it:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

If you don't have nvm yet, install it first: https://github.com/nvm-sh/nvm
Then install a current Node (this repo was built against Node 24):

```bash
nvm install 24
nvm use 24
```

## 3. Install dependencies

```bash
npm install
```

This pulls in `@blurb/codex-react` — Blurb's real design system — from a
**vendored tarball already committed in this repo**
(`vendor/blurb-codex-react-0.5.6.tgz`, referenced in `package.json` as a
`file:` dependency). You don't need any extra registry login or GitHub
Packages access to get it; it's not published anywhere reachable yet, which
is exactly why it's vendored this way. See `CODEX-MIGRATION.md`'s "Dependency
setup" note if that ever needs fixing properly.

`npm` may print a warning about install scripts being blocked (`esbuild`,
`fsevents`). That's expected on npm 12+, not a failure — the build works
anyway.

## 4. Run the local preview

```bash
npm run dev
```

Opens a Vite dev server with hot reload. The app has a demo bar for
switching between the three screens (`getstarted`, `waystosell`,
`estimator`) — or open one directly via `?stage=<id>`.

Verify a production build works before handing anything off for review:

```bash
npm run build     # ~1s, builds to dist/
npm run preview   # serves the dist/ build
```

## 5. Image assets

Two sources, both already working out of the box:

- **Local assets** — `public/assets/*` (logos, Instant Store screenshots).
  These are committed to the repo, so your fork already has them; nothing
  to download separately.
- **Blurb's own product photography** — pulled live from `assets.blurb.com`,
  a public CDN. No auth needed, just an internet connection.

## 6. Deploying — not your job for now

The Vercel project (`blurb-merchant-experience`, team `RPI Print`) stays
under Anain's account. You don't need a Vercel login to do design work here
— just run `npm run dev` locally, push to your fork, and open a PR. Anain
will preview/promote from her machine (`vercel` / `vercel --prod`).

## 7. Context you need before touching a screen

This project is a companion to a **FigJam board** ("Merchant Pricing and
Experience") that holds the research, the flow, and the *why* behind almost
every number and layout choice on these screens, plus **Jira DES-469**
(the discovery audit this grew out of) and follow-on ticket **DES-482**. You
haven't been given access to either yet — until you are, treat `CLAUDE.md`
as the record of what's already been decided and don't re-derive a decision
that's written there. The most load-bearing ones:

- **Every price in this repo is a placeholder.** Blurb doesn't publish
  fulfilment pricing; nothing here is a real quote.
- **Never show retail and fulfilment side by side.** That publishes Blurb's
  margin with the arithmetic done for the reader. Explain the price gap as
  a change of role (*you're the customer* → *we're your printer*), never as
  two numbers next to each other.
- **The margin is payment for work the seller did** (running their own
  shop/marketing), not a discount — state it generally, never as a
  per-sale condition.
- **The Instant Store profit calculator only prices the Instant Store
  route** (`Estimator.jsx`, stage id `margin`). Through the Bookstore,
  Amazon, or Ingram the buyer's price isn't the seller's to set, so the
  same cost→price→profit ladder would be wrong there. Those routes are
  *compared*, not calculated, on the Sell page.
- **"Instant Store" is the current name for checkout links** — copy only,
  renamed 2026-08-24. Internally the route id (`link`) and channel key
  (`sellChannels: ["checkout_link"]`) are unchanged; don't rename those.
- **Checkout link setup itself is not prototyped here** — it's a separate
  spec (Stacey's "Checkout Link" file). Don't guess at how links behave.
- **All state is local `useState`, no router/context/store**, and styling
  is inline `style={{}}` plus small global CSS — except where migrated to
  `@blurb/codex-react` components (see `CODEX-MIGRATION.md`). Prefer the
  Codex component where one exists; only build custom where there's a real
  structural gap (documented in `CODEX-MIGRATION.md`'s "deliberately left
  custom" section).

Full detail, provenance, and every other decision (product filtering rules,
the proof-requirement gate, nav recommendations, etc.) is in `CLAUDE.md` at
the repo root — read it before your first real change. `HANDOFF.md` is
Anain's running session log if you want the blow-by-blow of recent work.

## 8. Quick reference

| Need | Where |
|---|---|
| Full design spec / decision log | `CLAUDE.md` |
| Recent session-by-session history | `HANDOFF.md` |
| Codex migration status, what's done vs. deliberately custom | `CODEX-MIGRATION.md` |
| Run locally | `npm run dev` |
| Verify a build | `npm run build` |
| Design tokens | `T` object in `src/App.jsx`, brand values in `src/tokens.js` |
| Product/price data | `catalog.js` |
