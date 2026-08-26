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
