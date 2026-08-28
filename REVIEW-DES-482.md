# DES-482 review — what changed, and why

One entry per item of Ana's feedback on the prototype (DES-482, 24–25 Aug 2026).
Where the answer is not simply "done", the reasoning is here so it can be quoted
back into the ticket rather than rebuilt from memory.

## 1. Dropdown groupings — titles, alignment, separation

Done. Three fixes to the "Start your…" menu:

- The group name now prints as written. Dead mapping code was trying to rename
  groups that no longer exist, so it never fired.
- Headings were inheriting `text-align: center` from the headline the menu hangs
  off, and sat 8px inside the option text. Both fixed — headings now align flush
  with the options.
- Headings run full-bleed to the menu edges, so a pinned heading covers the
  options sliding under it and its rule reads as a divider across the menu
  rather than a line attached to one option. Space above the rule, none below:
  the rule belongs to the group starting there.

Also added a hover and focus wash on the options, which they had been missing.

## 2. Show the price increase on each product option

Done, with one deliberate difference from the way Stacey's checkout link setup
page does it — worth agreeing before it goes further, because it is a rule, not
a style choice.

**The ask.** Show `+ USD $3` on each option so nobody has to watch the total on
the right and do the arithmetic.

**The difference.** Stacey's page measures each option against **the cheapest
option in that step**. The prototype measures it against **the book you have
configured so far** — what switching to this option would add to, or take off,
what is on screen right now.

**Why.** This prototype had per-option deltas once, measured from the cheapest
option, and they were removed for a reason worth restating. Blurb's prices are
not additive: the price of a size depends on the paper, and the price of a paper
depends on the size. Measuring from the cheapest option in the step makes the
baseline float, so the same size reads `+US $9.00` on one paper and nothing on
another, and no card on screen says which book its zero belongs to. Someone
comparing two sizes reads two numbers that were measured from different books.

Measuring from the current specification fixes that without losing anything.
Every card answers one question — *what does switching to this cost me, from
where I am now?* — and the answer is true of the book in front of you at the
moment you read it. The numbers re-compute as the specification changes.

Two consequences:

- The option you are currently on is the baseline, so it carries no figure.
  Nothing reads `+US $0.00`.
- A cheaper option shows a **saving** (`−US $2.00`) rather than going quiet.
  Measured from the cheapest option, savings can never appear at all.

On the selling path the deltas count in the seller's cost, not the retail price,
so the figure on the card moves the panel total by exactly the amount it names.

**Not an engineering constraint.** Nothing here is a limit of the prototype or
of the pricing data — both versions are a few lines apart, and the cheapest-in-
step version was built first and works. This is a comprehension argument, and if
the checkout link setup page is going to ship the other version we should pick
one and use it in both places rather than have the same figure mean two things.

**Open:** currently applied on `/getting-started` only. The estimator uses a
different picker and still shows no deltas. Worth doing there too once the
version is settled.

## 3. "See it before your buyers do" and "What a checkout link can sell" — too much detail here

Done. Both were panels sitting beside the steps; they are now the two answers
in a **Questions** section at the foot of `/getting-started`, closed by default,
one open at a time — the same accordion the Sell page uses, now a shared
component rather than a third hand-built one.

- *Do I have to order a copy before I can sell?* — the proof requirement.
- *What can an Instant Store sell?* — the product limits, still computed from
  the catalogue, so it names what the format you picked sells through instead.

Both are rules of the **channel**, not of the book, which is why they read as
noise next to a paper choice and as an answer at the end of the page. They stay
on this page and still come before any link is set up, which was the point of
having them at all: a seller who is told nothing either does not notice the
limit or cannot tell whether it is a rule or a bug.

The "How selling works" button that sat in the proof panel went with it. The Sell
page is the doorway for that now.

## 4. The log-in CTA belongs in "Ready to make it", and "Ready to sell it" goes

Done. "Ready to sell it?" — heading, paragraph and project list — is gone from
under the steps. The fork it carried now sits under **Ready to make it?** at the
foot of the summary panel, below a rule: the tools on one side, a book you have
already finished on the other. Both are next steps, and they now look like it.

- **Signed out** — "Or sell one you have already made", one line, and a **Log in**
  button.
- **Signed in** — the same heading and the projects themselves, as compact rows
  carrying whether each one is already selling, has a proof on file, or needs one.

The panel is 310px wide, so the full-width card and the 340px project cards could
not simply move; the panel form is a slimmer list of the same thing.

Nothing about *when* the page asks who you are has changed. It still asks at the
end, after a price has been seen, which was the point of putting it at the foot
of the page in the first place.

The bulk route keeps its heading under the steps ("Ready to order the run?"),
because what follows it is not a next step: it is a quote, and a different way of
being priced.

## 5a. Make print cost look fixed, and price and profit look editable

Done. The ladder had three numbers and only two treatments: whichever of price
or profit was driving it was a field, and the other two were the same plain
figure. So half of what a seller can actually change looked as fixed as the one
thing they cannot.

Now:

- **Your cost** — a plain figure with no box, because there is nothing to type
  into. Its line says so: "What Blurb charges you. Set by your specification."
- **Your price** and **Your profit** — always a field. The one driving the ladder
  is the live input with the brand border and the steppers; the other is the same
  shape, quieter, with a pencil, and takes over on a click. Where it is the number
  the ladder just worked out it stays blue, so the answer still reads as the
  answer.

This is the treatment on both the panel ladder and the plain summary rows.

## 5b. Show the buyer's shipping, or link out to it

Done, and it turned up a gap wider than the one you spotted: `/getting-started`
had **no shipping control at all**. The panel could always price delivery — its
maker total even said "add a postcode to include delivery" — but there was no
postcode field anywhere on the page, so a maker could not add one and a seller
could not answer the first question a buyer asks them.

The estimator's shipping section is now a shared component and sits on both
pages, keeping its two defaults:

- **Making it** — "Ship to" plus a postcode, and once there is a destination,
  every speed priced and dated together ("arrives 3–6 Sep"), not counted in
  business days. Shipping joins the total.
- **Selling it** — off, and optional. One checkbox, *Show what a buyer pays with
  delivery*, opens a country and state and then a single line: *a buyer in
  California pays US $32.00 for the book and US $5.99 to have it sent, US $37.99
  in all.* Underneath it, in as many words: your cost, your price and your profit
  are unchanged.

That last part is why this is a checkbox rather than a permanent block. A
delivery figure sitting beside the margin is exactly the misreading the pricing
model exists to prevent, so the seller asks for it, it appears with the control
that asked, and it never enters the ladder or the panel.

**Your question — is the shipping calculator page being removed?** No, and that
should be explicit rather than implied. See item 20.

## 20 / 5b. The shipping calculator page

**Decided (Anain, 2026-08-27): it stays, and stops being a calculator.** It
becomes an informational page — how long printing takes, what each speed costs
by region, what changes a delivery date — because the calculating now happens
where the book is being priced: at product level for a maker, and inside the
margin estimator for a seller, where it can sit beside the margin without
entering it.

That is the same direction as Crometrics' proposal ("make the shipping page more
educational rather than a standalone calculator"), and this prototype already
implements the two halves it hands off to (see item 5b).

**Three things in that proposal cannot ship as drawn**, and all three are the
same mistake — something true, said in a way that publishes Blurb's margin:

1. **"Wholesale pricing. Retail margins."** `/ingram` already uses *wholesale*
   for the trade discount a retailer takes. One word, two meanings, one site.
2. **"up to 70% below the retail maker price"**, and the fulfilment price list
   that strikes through `$10.99` next to `$4.50`. That is retail and fulfilment
   side by side with the subtraction already done for the reader.
3. **"Retail price for reference — $18.99"** inside the calculator panel. Same
   thing again, in the exact place the rule was written for.

The sanctioned way to say it is the change of role — *you're the customer* →
*we're your printer* — and the margin as payment for work the seller does:
running the shop, marketing, traffic. It explains the whole difference without
quoting a number that belongs to Blurb.

**Worth keeping from the proposal:** the region × speed table ("Ship in 3–5 days.
Worldwide.") is exactly what an informational shipping page is for. The platform
comparison is a good idea whose figures — Amazon KDP, IngramSpark and Lulu rates,
"Blurb keeps 0% of your revenue" — need a source before they go on a live page.

## 5c. "Why you pay less when you sell" could clarify the cost per channel

Done, as far as it can go without contradicting the page above it.

The explainer now ends by saying where its own explanation stops being true:

> It works this way in your Instant Store, where you bring the buyer. Sell
> through the Blurb Bookstore, Amazon or Ingram and they bring the buyer
> instead, so your price sits on top of a base price and the channel takes its
> cut of the sale.

Then a link: **Compare all four routes**, which opens the Sell page.

**Why a sentence and a door rather than the figures.** The ladder above this
explainer prices an Instant Store sale and nothing else — that is the note above
the calculator, and it is the reason the three rungs are honest. Putting per
channel costs inside the same panel would put figures next to a ladder that does
not apply to them, which is the misreading the note exists to prevent. The four
routes are compared in one place, on the Sell page, where a reader can take one
fact across all four; a second comparison in the panel would be a third answer to
a question already answered twice.

What the explainer gains is the *shape* of the difference, which is the part a
seller needs here: in an Instant Store you bring the buyer, so the margin is
yours; everywhere else the channel brings the buyer and prices accordingly.

---

# From the design review, 2026-08-26

[2026-08-26 Design Review – Product + Design Teams](https://blurb-books.atlassian.net/wiki/spaces/DTS/pages/4450844673)

Only what lands on this prototype. Two of Ana's open items were settled in the
room; six new pieces of work came out of it.

## Settled in the room

**5e — RPI Print API pricing. Answered: it stays on rpiprint.com.** There will be
no single calculator covering both, because the SKUs are not the same. Pritam's
reasoning for starting narrow: the Instant Store is the first of the seller
tools, more will follow with different margins, and *"focusing on checkout links
seems like the least one-way door-ish approach, given what we know right now."*
Melissa raised joining them up in a later iteration once the framework supports
it, informed by user outreach. Parked, not rejected.

**16 — rename the margin estimator. Confirmed: it is the Instant Store profit
calculator.** With one instruction about *how* to say it, which changes what we
built: frame it **positively, as applying to the Instant Store**, rather than as
a caveat that it does not apply to the other routes. Our note above the controls
is currently the caveat version. → **item 21.**

**5d / 5c — the channel comparison stays out of the calculator this phase** and
lives on the selling page. That is what item 5c already did.

**20 — the shipping calculator becomes an information page.** Built.

**The governing rule was restated as a decision:** retail and fulfilment prices
are never shown side by side, because a creator does not need to see what a
seller will charge.

## New work

**21. Say what the calculator IS, not what it isn't.** *(Done — see below.)*
Rewrite the note above the
margin estimator so it opens by naming the Instant Store as what it prices,
rather than listing the routes it excludes. Same fact, and the seller meets it as
a scope rather than a warning. The exclusions still have to be findable — the
ladder is wrong for the other routes — so they follow the positive statement
rather than leading it.

**22. Settle where the profit calculator sits in the IA.** Action item from the
meeting. Hierarchically it sits below the Instant Store, so one reading is to
link it only from the Instant Store landing page and take it off the PDP and out
of the nav for this phase. Against that: the scale of the price reduction
warrants prominence, and a **featured entry under Sell** — "calculate the profit
you could make with your Instant Store" — was floated, with hero copy as an
alternative. Held open. This prototype currently surfaces it in the nav *and* on
the PDP, so it is the maximal version and can be dialled back once decided.

**23. The comparison table should compare RPI too, and list RPI and volume order
as seller tools.** Today ours compares four routes. RPI Print API and Large Order
Services are both things a seller can use, so they belong in the comparison and
on a larger selling overview. Note this overlaps Ana's nav item 9, which asks for
the same two under both Sell and Services.

**24. Ownership: the selling overview page is CRO Metrics' work,** per the brief
given to them. Ours is a reworked version of the page that exists today. Worth
deciding explicitly whether our Sell page continues as a design or becomes
reference handed to CRO, the way the Instant Store page already is.

**25. Confirm with engineering whether Get started can lead straight into
creation.** The direct-to-creation path is what "Ready to make it?" assumes. If
it cannot, that block needs a different destination.

**26. Who owns the get-started modules if the online editor landing page reuses
them?** Josh's option 3 repurposes this page's size / cover / paper steps as a
three-step row into the editor. Two surfaces would then share one component, and
Josh noted our designs are not final. Also relevant to the meeting's reuse
decision: existing components from the PDP, shipping and pricing calculator get
reused rather than new ones built, which is the same principle the shared
`Faq` and `ShippingSection` follow here.

**27. RPI is described as orchestration at scale, not fulfilment** — and RPI is
the outer layer with Blurb inside it, not the reverse. That wording affects the
nav copy in Ana's item 12 ("Change to RPI Print API") and anywhere this prototype
describes RPI.

## 16. Rename the calculator for the route it prices — DONE

It is the **Instant Store profit calculator**, in the wording the design review
settled on. Renamed everywhere a reader meets it: the page heading, its tab and
lede, the Pricing menu in the nav, the Sell page, the Instant Store page, the
shipping page and the demo bar.

Copy only. The stage id stays `margin` and the file stays `Estimator.jsx`, for the
same reason the checkout link rename left its ids alone: renaming them touches
every surface for no gain.

Two consequences worth seeing on the page:

- The h1 now carries the route — **"See what you keep on an Instant Store sale"** —
  so the scope arrives before the first control, which is what you were asking for.
- The notice above the controls therefore **lost its title**, which had become a
  second copy of the heading. What is left is the half a heading cannot carry:
  the other three routes work on different terms and are compared on the Sell
  page. It is now Codex's Alert L at Type=Info, the system's own component for a
  title-message-action panel, rather than the hand-built blue box it was.

Placement in the IA — nav and PDP now, or linked from the Instant Store landing
page for this phase — is item 22 and still open.

## 19. Is a rebuild of the pricing page required for launch? — ANSWERED IN THE PROTOTYPE

No, and the prototype now shows both answers rather than arguing for one.

- **Minimum effort** (`?stage=pricing&version=lean`) is the page as it is today:
  the live heading and lede, the format cards, all five price tables and the
  volume bands, the live FAQ questions — and **one addition**, the Instant Store
  lane after the tables. That is the entire ask of engineering on this surface.
- **Recommended** (`?stage=pricing`) still replaces the page with the calculator.

The tables are not retyped. They read the same `PRICING` matrix the calculators
use, which was extracted from that page's own payload, so the two cannot drift
apart and the lean page is a fair likeness rather than an impression of one.

The lean shipping page is built the same way: today's page, calculator included,
plus the lane. The recommended one drops the calculator, because by then both
calculators price delivery where the book is.

## 17. No selling of wall art or notebooks and journals — DONE

Wall art was already withdrawn from every channel, so that half of the note
matched the prototype already. Notebooks were not: `/self-publish` lists
"notebooks and journals" under the Bookstore, and this repo took that as
confirmation on 2026-08-19. They are now withdrawn from every channel too.

**This leaves the live page wrong.** `/self-publish` still tells a seller they can
sell notebooks through the Bookstore. A decision made with engineering beats a
marketing page, so the rule stands here — but that page needs correcting, and it
is somebody's to own.

Notebooks stay fully priced and orderable for yourself. Only selling is withdrawn.
The product row narrows on its own: under "to Sell" both products simply are not
offered, which is how the PDF exclusion already worked.

## 18. Pin the "What you'd earn" panel — NO CHANGE (Anain, 2026-08-27)

The panel stays sticky, which it already is: `SummaryPanel` pins by default,
clear of the header at whatever height that is, and nothing overrides it on
either calculator or on `/getting-started`.

If the awkward scrolling Ana describes persists, the likely cause is height
rather than behaviour — the panel is tall enough that its lower half, the ladder
and "Ready to make it?", can sit below the fold on a laptop even while the panel
is pinned. Sticky holds the top in place, not the bottom. The fix for that would
be trimming what the panel carries, not changing how it sticks.

## 6. Seller pricing in the "What changes the price?" modal — DONE

That link used to leave the catalogue for the calculator. It now opens the modal
the live page opens, rebuilt: five steps in blurb.com's own copy — Cover options,
Size, Paper, Number of pages, Binding — each with its Tip, one at a time.

Then **a sixth step, "And if you are selling it"**:

> Everything above is what a copy costs you to buy. Sell the book instead and your
> role changes: you are not our customer any more, we are your printer. You set
> what your buyer pays, you pay us to print each copy as it sells, and the rest of
> your price is yours.

Underneath it, in place of the Tip, the **Why**: the margin is payment for work
the seller has taken on, because a retail price also pays for running the shop.
Then one action, **See what you would keep**, into the profit calculator.

You are right that this is the place for it: it is the one spot on a retail page
where somebody has *asked* to be told how pricing works, so it costs nothing and
nobody who did not ask is shown it.

**No figure on that step, deliberately.** The five steps above it are full of
retail prices, and a fulfilment number beside them is the one pairing this
project forbids — it publishes the margin with the arithmetic already done.

## 7. The banner copy should reference the difference — DONE

> Photo books, trade books and magazines can be sold from one link you share, and
> **the prices on this page are not the ones you would pay. They are what a copy
> costs to buy; when you sell, we are your printer instead, so it costs you less
> and you set what your buyer pays.**

Said as a direction and a change of role rather than as a sum, for the reason
above. The product list writes itself from the catalogue, so it cannot promise a
product that is not sellable.

## 8. Move the "Selling this?" note beside the price — DONE

Moved: it now sits directly under the price and the per-page line, above the
create actions.

It is a better place, and worth saying why: the line's job is to tell a seller
that the number above it is not theirs, so it belongs with that number. Below the
buttons it read as a fourth call to action arguing with Create now.

Still deliberately quiet — body text, no panel, no icon, no border — so a maker
reads "selling this?" and moves on having lost nothing. It still carries the
configuration, so the calculator opens on the book being looked at.

## 21. Say what the calculator IS, not what it isn't — DONE

The line above the format cards on the profit calculator was the exclusions
alone:

> The Bookstore, Amazon and Ingram each work on different terms.
> **Compare the routes →**

It now opens with what the figures are for, and the other routes follow:

> These figures are for a sale through your Instant Store, where you set the
> price and what is left after your cost is yours. The Bookstore, Amazon and
> Ingram each work on different terms. **Compare the routes →**

Same fact, same door, same two sentences; the order is the whole change. The
opening clause is the ladder's own terms — *your cost → your price → your
profit* — so it says why the scope holds rather than asserting it, and it does
that without putting a figure on the page.

The exclusions stay, because the ladder really is wrong for the other three and
a seller who never meets that is worse off. They now read as where to go next
rather than as what this page cannot do.

# The nav — Ana's review of 24 Aug (items 9–15)

Applied 2026-08-28. Her list is the whole of what changed, except where noted.

## 9. Volume orders and RPI Print API belong under Sell as well as Services — DONE

Both now appear in both menus, in a second Sell column headed **Seller tools**.
They are things a seller uses, and a seller who needs 500 copies or their own
storefront integration was being sent to a menu called Services to find out.
The same page answering to two jobs is not duplication when the two jobs are
real; these two are. Overlaps design review item 23, which asks for the same
two in the comparison table — still open.

## 10. Switch to Blurb — OUT of both menus

Ana: it is a good idea but belongs with store integrations, and there is no
proposal for the page. That is the stronger version of the warning already
written above the nav data: it comes from Deb's drafts and appears in no source
we hold — not the DES-469 audit, not Stacey's files. Nav is a commitment
surface. It goes, and comes back when there is something behind it.

Store integrations stays, tagged Coming soon, because it is the thing Switch to
Blurb was waiting for rather than a second guess at the same page.

## 11. "Seller hub" — GONE

It was the heading on Sell's first column, and it named an internal construct.
There is no seller hub; a visitor reading it cannot tell whether it is a page
they have failed to find. The column is **Ways to sell**, which is what it
holds.

The phrase also sat in this file's nav rationale — "seller pricing sits behind
the seller hub" — which was the load-bearing use. Rewritten: the public pricing
pages stay retail-only, seller pricing is featured under Sell, and the guardrail
is that the two prices are never shown together.

## 12. "API Printing" → "RPI Print API" — DONE

Renamed, and re-described per design review item 27: orchestration at scale, not
fulfilment, with RPI as the outer layer and Blurb inside it.

> Print and delivery orchestrated at scale. Send orders from your own system and
> RPI's network prints, packs and ships them.

"Print as infrastructure" was closer to a slogan than to what it does.

## 13. Pricing defaults to maker pricing — DONE, as one cross-link

The Pricing menu now carries **"Selling instead? — See what you keep on an
Instant Store sale."**

Ana's observation is right: that menu answers one of two pricing questions, and
a seller looking for prices looks there. Her two options were a link or moving
the calculator under Products; a link is the smaller move and the truer one,
because the calculator is a seller tool and belongs under Sell, where it is now
the featured card.

**It does not breach the retail-only rule.** That rule forbids showing the two
prices together, and a link shows neither. What it does is say there is a second
question, in wording that cannot be read as a second price for the first one.

## 14. Services and Resources feel similar — PARTLY. The labels were the problem

**Not merged.** Services are things you buy — a 500-copy run, a print API.
Resources are things you read. Merging them puts a quotable print job next to a
blog post, and the menu stops being able to say what either is for.

**The naming is fixed, which is what the confusion was.** Tools / Services /
Resources were three words for the same drawer, and only one of them had an
adjective available: **Creation Tools**. Confirmed over "Design Tools", the live
label — PDF to Book and the templates are not design tools, and the menu holds
both (Anain, 2026-08-28).

## 15. Sell and Creation Tools need a way through to an overview — DONE

Ana: it is not always clear you can tap the main nav item. Both menus now end in
a **See all …** link across the foot, under a rule.

This was briefly the first item in the list, which is how Products does it with
"Shop All". Ana's own mock (item 28) does it better: among five siblings an
overview reads as a sixth destination competing with them, and the eye has to
work out that one of them contains the rest. Across the foot it reads as the way
out of the menu, which is what it is.

Products keeps "Shop All" in the list. That one is a destination people ask for
by name, not a fallback for a nav that will not admit it is clickable.

## 28. Ana's selling-overview mock (2026-08-28) — THREE THINGS ADOPTED

Posted as a treatment she liked for a selling overview page; it is drawn as a
Sell mega menu, and three things in it beat what was built.

**Retail distribution is one item, not three.** The Bookstore, Amazon and Ingram
were three lines. They are one decision — somebody else brings the buyer, lists
the book in their shop and takes a cut, and the seller does not set the price. A
reader choosing between the three has already made that decision; a reader still
making it does not need the shortlist. The item goes to the comparison, which is
where the three are actually told apart. "Retail distribution" is also Ana's own
word for the group in item 5d, which is a good sign it reads.

**See all across the foot** — item 15.

**Five items, not seven.** The consequence of the first two, and it matches her
mock exactly.

**Two things in the mock are superseded, not rejected:** it says "Checkout
links" with a **NEW** badge. It is the Instant Store now, and the NEW badges
went on 2026-08-24 — they spoke to reviewers rather than to visitors.

**Still open from this comment:** whether the selling overview page stays ours
or goes to CRO Metrics with the brief, the way the Instant Store landing page
has. That is design review item 24.

## 5d, first half — an option per channel in the "to…" dropdown — NO CHANGE

The comparison-table half was settled in the room and lives on the Sell page.
The dropdown half was never answered, so: three of Ana's four options are
already there under different names. **to Sell** is the Instant Store, **to
Keep** is personal use, **to Distribute** is the bulk order.

**Retail distribution is the one left out, deliberately.** Adding it would make
the page price a route where *your cost → your price → your profit* is not true:
the buyer's price is not the seller's to set, and the channel takes a cut. The
page would have to either quote figures that are wrong or carry a fourth option
that computes nothing. It is compared on the Sell page instead — which is the
same conclusion the room reached about the comparison table.

## Ana's note that "pricing calculator" is not clear enough — ANSWERED BY THE RENAME

Her question was what a reader makes of *pricing* calculator versus *margin*
calculator. The rename (item 16) fixed half of it, and the handover banner
between the two now leads with the reader's question rather than the product
name:

> **Just making it for yourself?** The pricing calculator gives you the price,
> your copies, and when it would arrive — no margin, nothing to set up.

Nobody has to know which calculator they are on to know which one they want.

## 29. The Instant Store landing page is built — REVERSES THE PLACEHOLDER DECISION

*(Anain, 2026-08-28.)* It stood empty since 24 Aug because Crometrics owns the
live page and a prototype that guessed at it would have been screenshotted into
a deck and become somebody else's spec. What changed is that there is now a POC
to work from — **260824 POC — Instant Store LP**, a Figma Make file written
against a brief — so ours is a reading of that rather than a guess.

**Ownership has not changed.** Crometrics still builds the live page. Whether
ours stays a design or is handed over as reference is item 24, still open.

**Taken from the POC.** The differentiator, which is the best thing in it and
the argument this project had never made anywhere: the link opens a *real
product page*, not a payment box — cover and description, an interactive preview,
the seller's bio, "More from you" surfacing their whole catalogue, and no account
for the buyer. Five proofs instead of one claim. Also its three steps, its
fulfilment band, and "works anywhere a link goes" said in places (a bio, a
newsletter, a talk, a stall) rather than in the abstract.

**Refused, and why.**

- **"Earn more per sale than anywhere else"** and **"no platform cut — ever."**
  Unsourced comparative claims — the same class as Crometrics' "Blurb keeps 0% of
  your revenue" — and "ever" is a forward commitment nobody in the room can make.
- **The worked figures.** They contradict each other: $22.40 is the print cost in
  one section and the seller's profit in another, and $22.40 + $25.60 does not
  make the $35 sale it sits under. The ladder here carries **`$X`** instead, which
  is honest about being a shape rather than a sum, and the calculator is one click
  away for the real one. A made-up figure on a marketing page gets quoted.
- **The AI description writer**, which is the walled-off side project.
- **"A whole store in one link"**, which overclaims in exactly the way the POC's
  own brief warns against ("never call a single page a store or shop").

**Added, because the POC leaves it out.** The proof requirement. A seller can set
a store up and share the link immediately, but nobody can buy until a proof
exists, and a landing page that never says so sends people into a surprise. It is
Codex's **Alert L** at Type=Info — the one thing on this page that is state, which
is what that component is for, and what `Alert.jsx` was built for.

**The POC's screens are on the page** *(2026-08-28)*. The section claiming the
link opens a real product page was illustrated with Material Symbols, which is the
wrong instinct on the one section whose whole argument is *the page is real* — an
icon of a book is a drawing of a promise. It now carries the POC's own screens of
`blurb.com/c/36690`: the store page entire, at 760px, captioned "What your link
opens. Your buyer never leaves this page," and then the four parts a seller is
being sold on — the interactive preview, the author panel with its links, "More
from Paige Hazelwood", and the buy block with its payment marks. Two across, not
four: these are screens with type in them and a quarter of 1240 cannot be read.

They are screenshots of a **buyer's** page, so the $32.00 in them is the seller's
own asking price as their buyer sees it. That is not the pairing this project
forbids — there is no fulfilment figure anywhere near it, and the ladder stays at
`$X`. The five files are committed to `public/assets/` rather than hotlinked,
because the MCP asset URLs expire in about a week.

**Every other block is an existing component.** The gradient hero the seller pages
share, the Sell page's icon grid, the Codex split panel already used as the
Instant Store lane, Alert L, and the shared `Faq`. Nothing new was invented, and
"what you can sell" is written by `sellableSentence` rather than typed.

**Nav decisions are untouched.** The POC's nav is two items and labelled a
placeholder; none of it was read as a proposal.
