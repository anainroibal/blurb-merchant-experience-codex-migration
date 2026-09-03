# Codex migration status

Tracks the `codex-migration` branch's progress rewriting this prototype's
hand-rolled UI onto `@blurb/codex-react`, Blurb's real component library.
See CLAUDE.md's note on branches for how this relates to `v2`.

Updated as the migration progresses — treat this as a snapshot, not a plan.

## Done

- **Dependency setup.** `@blurb/codex-react` isn't published anywhere this
  repo can reach yet (GitHub Packages access issue), so it's built from a
  local, remote-less git repo (`../codex-react`, imported from a zip) and
  vendored into this repo as `vendor/blurb-codex-react-0.5.6.tgz`. Fix
  properly once the GitHub Packages access is sorted.
- **Tokens/theme.** `main.jsx` loads Codex's stylesheet and calls
  `setTheme("blurb")`. `src/tokens.js`'s hand-copied values were confirmed
  to match Codex's real `blurb` theme token-for-token.
- **Alert** (`Alert.jsx`) — wraps Codex's real `Alert`.
- **Button** — 19 CTA buttons across `CreateActions`, `Estimator`, `Home`,
  `InstantStoreLane`, `InstantStorePage`, `PriceModal`, `ProductCatalog`,
  `SellerLanding`, `ShippingPage`, `SiteNav`, `SummaryPanel`, `YourProjects`.
- **Divider** — `Configurator.jsx`'s local `Divider` → Codex's, used by
  `ProductPage.jsx` and `SummaryPanel.jsx`.
- **Form fields** — native `<select>`/`<input type="checkbox">`/`<input>` in
  `ShippingSection.jsx`, `Estimator.jsx`, `ShippingPage.jsx` → Codex
  `Select`/`Checkbox`/`Input`.
- **Tabs** — `Home.jsx`'s "Tools and resources" tabs, `ProductPage.jsx`'s
  Description/Recommended tabs.
- **Modal (center only)** — `PriceModal.jsx` → Codex `Modal`/`ModalContent`.
- **ComparisonTable** — `SellerLanding.jsx`'s six-route table. Confirmed
  Codex's real component is the one the CLAUDE.md spec (zebra rows,
  `charcoal200` rule, sticky column) was describing all along.
- **Footer** — `SiteFooter.jsx` → Codex's `Footer` (supersedes the
  2026-08-18 pin to the Single-page Checkout file's 50px node; Codex's own
  shipped height is 72px).
- **CardList / Card** — Home's "The Blurb Difference", SellerLanding's "Why
  choose Blurb?" and its 4 route cards, InstantStorePage's "Set up in
  minutes" 3 steps and its 4-screenshot "what the link opens" grid.
- **CallToAction** — Home's closing band ("Ready to get started?").
- **RadioCard / RadioCardGroup** — every hand-rolled `aria-pressed`
  selectable-card group: `OptionCard` (`Configurator.jsx`, also used by
  `ProductOptions.jsx` and `ProductPage.jsx`), `FormatCard`
  (`FormatCards.jsx`), `SizeSwatch` (`ProductOptions.jsx`),
  `ShippingSection.jsx`'s speed-picker rows, `GetStarted.jsx`'s "What for?"
  intent chips. Gained real radio-group semantics (arrow-key navigation)
  that didn't exist before.
- **HeroCenter** — SellerLanding's hero (plain-string heading/subheading,
  one CTA). Its gradient background rides in via a scoped
  `.hero-gradient-seller` class, since `HeroCenter` only takes a single
  background image.
- **PricingTable** — `PricingTables.jsx`'s `FamilyTable` (photo books,
  paperback/hardcover, notebooks). Its `sections` model (a toggleable
  group header with nested rows) is exactly this table's existing
  paper-group/cover-row structure. Sections are now collapsible — a real
  behavior gained, not just a restyle.
- **ComparisonTable** (again) — `WallArtTable` and `VolumeTable` in
  `PricingTables.jsx` (flat matrices, no groups).
- **Badge** — SellerLanding's subtle tier-band chip (`color="blue"`).

## Format-card image fix (not a Codex swap, a bug the migration exposed)

`FormatCard`'s photo used `width: 100%, height: auto`, scaling to each
file's own aspect ratio rather than a fixed square — fine for four photos
shaped close to 1:1, but the Wall Art shot (closer to portrait) rendered
smaller and letterboxed. Fixed with `aspectRatio: 1/1` + `overflow: hidden`
+ `objectFit: cover` so every photo crops to the same square.

## Deliberately left custom (real gaps, not oversights)

- **`SiteNav.jsx`** — Codex's `Navigation` pattern is a closed `{label,
  href}` tree with no slot for an account menu, locale menu, cart, or
  NEW/CHANGED badges. Migrating would delete functionality, not restyle it.
- **`Modal.jsx`'s `variant="side"`** (the tray `ProductOptions`' Details
  panel opens) — Codex has no drawer/tray pattern, only centered dialogs.
- **`Faq.jsx` and SellerLanding's own FAQ accordion** — Codex's `Accordion`
  types `heading`/`children` as plain strings (Markdown). Every `Faq`
  heading in this app is JSX with a deliberate `<br/>`, and every answer is
  a styled `<p>`. Flattening would lose real content, not just styling.
- **Three closing CTA bands** (SellerLanding's "Ready to sell your book?",
  InstantStorePage's "Made with Blurb...") — JSX headings/subheadings or a
  pinned live-page gradient background that `CallToAction`'s plain-string
  API can't hold.
- **Home's hero** — a pixel-pinned SVG clip-path curve (copied verbatim
  from the live site) plus a straddling foreground photo pushing the
  section's own height. `HeroCenter` has no clip-path/curve support and no
  secondary image slot.
- **InstantStorePage's hero** — a JSX `<br/>` in the heading, plus a
  footer line below the CTAs that's beyond `HeroCenter`'s heading/
  subheading/CTA slots.
- **SellerLanding's solid "New" chip** — Codex's `Badge` (the semantically
  right component for a static label) has a completely closed API: no
  `style`, no `className`, no props spread, and none of its 7 fixed colors
  reproduce a solid blue background with white text.
- **`PricingTables.jsx`'s `MagazineTable`** — a 2-row, 3-column table with
  no scrolling/sticky-column apparatus at all; a different, much simpler
  shape than what `PricingTable`/`ComparisonTable` are for.

## Not yet evaluated

- **Everything else largely untouched**: `GetStarted.jsx` (mostly),
  `MarginLadder.jsx`, `CreateActions.jsx`'s remaining bits, `Faq.jsx`'s
  internals, `YourProjects.jsx`, `CostExplainer.jsx`, `WhiteLabelTip.jsx`.
  Codex's `Tooltip`, `Spinner`, `Toast`, `Breadcrumbs`, `LargeTextCallout`,
  `ValueProp`, `ScrollView` haven't come up at all yet.
