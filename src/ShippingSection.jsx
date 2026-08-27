import React from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY } from "./tokens.js";
import {
  SHIPPING, US_STATES, PRINT_RANGE, shippingFor, arrivalWindow, formatDay,
  speedDays, money,
} from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   Shipping, for whichever of the two people is asking.

   Lifted out of the estimator so /getting-started can carry it too
   (Ana, DES-482). It was the estimator's alone, which meant the page
   that leads a seller to a price could not answer the first question a
   buyer asks them — what does delivery cost? — and the maker's total
   there said "add a postcode" with no postcode field on the page.

   One component, because these are the same question asked by two
   people, and the whole design rests on never confusing the two.
   ──────────────────────────────────────────────────────────────── */

export const control = {
  height: 40, width: "100%", minWidth: 0,
  border: `1px solid ${T.borderStrong}`, borderRadius: 4, background: T.bgNeutral,
  padding: "0 10px", fontFamily: FONT_BODY, fontSize: TYPE.base, color: T.textNeutral,
};


export function Field({ label, hint, children }) {
  return (
    <label style={{ display: "grid", gap: 6, minWidth: 0 }}>
      <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>
          {label}
        </span>
        {hint && <span style={{ fontSize: TYPE.sm, color: T.textSubtle, whiteSpace: "nowrap" }}>{hint}</span>}
      </span>
      {children}
    </label>
  );
}


/* ── Two destinations, two questions ──
   The maker is receiving the box, so the calculator asks precisely where
   — a ZIP or postcode — and puts the shipping in the total, because it
   is money they will actually pay.

   The seller is not receiving anything. Their buyers are many and
   everywhere, so a street-level destination is meaningless; what they
   need is an illustration of what a buyer SOMEWHERE pays, kept firmly
   outside the margin. Country, then. The state is there because a seller
   pictures people, not parcels — it changes who the sentence is about.
   It does not change the rate, and the panel says so rather than
   implying a precision the placeholder data does not have. */
function ShipTo({ selling, shipping, ship, setShip }) {
  const country = SHIPPING.countries.find(c => c.id === ship.country);
  return (
    <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
      <Field label={selling ? "Your buyer is in" : "Ship to"}>
        <select
          style={control}
          value={ship.country}
          onChange={e => setShip({ ...ship, country: e.target.value, postal: "", state: "California" })}
        >
          {SHIPPING.countries.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </Field>

      {selling ? (
        ship.country === "US" && (
          <Field label="State" hint="tax varies">
            <select style={control} value={ship.state} onChange={e => setShip({ ...ship, state: e.target.value })}>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        )
      ) : (
        <Field label={country?.postal ?? "Postal code"}>
          <input
            style={control}
            value={ship.postal}
            placeholder={country?.example}
            onChange={e => setShip({ ...ship, postal: e.target.value })}
          />
        </Field>
      )}

      {!shipping && (
        <Field label="Speed">
          <select style={control} value={ship.speed} onChange={e => setShip({ ...ship, speed: e.target.value })}>
            {SHIPPING.speeds.map(s => <option key={s.id} value={s.id}>{s.label} — {speedDays(s)}</option>)}
          </select>
        </Field>
      )}

      {shipping && (
        /* A real constraint, and the reason express can vanish below. */
        <Field label="Delivery point">
          <label style={{ ...control, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={ship.poBox}
              onChange={e => setShip({ ...ship, poBox: e.target.checked })}
            />
            <span style={{ fontSize: TYPE.base }}>This is a P.O. Box</span>
          </label>
        </Field>
      )}
    </div>
  );
}


/* ── The shipping answer: dates, not day-counts ──
   The live /shipping page tells you printing takes "4-5 business days"
   in a paragraph, then quotes speeds in more business days, and leaves
   the arithmetic — and the weekends — to you. Nobody plans around
   "7–10 business days"; they plan around whether it arrives before the
   wedding. So every speed is priced AND dated, side by side, and the
   print time is shown as the leading segment it actually is.

   Express disappears for a P.O. Box rather than being quoted and
   refused later, because couriers do not deliver to one. */
function DeliveryTable({ qty, country, poBox, chosen, onChoose }) {
  const speeds = SHIPPING.speeds.filter(s => !poBox || s.poBox);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {speeds.map(s => {
        const quote = shippingFor(country, s.id, qty);
        const w = arrivalWindow(s);
        const on = chosen === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onChoose(s.id)}
            aria-pressed={on}
            className="card-move"
            style={{
              textAlign: "left", width: "100%", padding: 16, borderRadius: R.md,
              background: T.bgNeutral,
              border: on ? `2px solid ${T.borderBrand}` : `1px solid ${T.border}`,
              margin: on ? 0 : 1,
              display: "grid", gap: 10, alignItems: "center",
              gridTemplateColumns: "minmax(0,1fr) auto auto", fontFamily: FONT_BODY,
            }}
          >
            <span style={{ display: "grid", gap: 2, minWidth: 0 }}>
              <span style={{ fontSize: TYPE.lg, fontWeight: 700, color: on ? C.blue950 : T.textNeutral }}>
                {s.label}
              </span>
              <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>
                {PRINT_RANGE[0]}–{PRINT_RANGE[1]} days printing, then {speedDays(s)}
              </span>
            </span>

            <span style={{ display: "grid", gap: 2, justifyItems: "end", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>Arrives</span>
              <span style={{ fontSize: TYPE.base, fontWeight: 700 }}>
                {formatDay(w.earliest)} – {formatDay(w.latest)}
              </span>
            </span>

            <span style={{
              fontFamily: FONT_DISPLAY, fontSize: TYPE["3xl"], fontWeight: 700,
              color: on ? C.blue600 : T.textNeutral, whiteSpace: "nowrap", paddingLeft: 8,
            }}>
              {quote ? money(quote.cost) : "—"}
            </span>
          </button>
        );
      })}
    </div>
  );
}


/* ── The section itself ──
   Two different jobs, so two different defaults.

   THE MAKER is buying the copies, so shipping is part of what they pay:
   enter a postcode and it joins the total, and the speeds are priced and
   dated together.

   THE SELLER never pays it. It is not in their price and not in their
   margin, and a delivery figure sitting beside the margin invites exactly
   the misreading the whole pricing model exists to prevent. So for them it
   is off, and it is a variable they can switch on to answer one question:
   what does the buyer see at checkout? Turning it on changes nothing in
   the ladder. */
export default function ShippingSection({ selling, ship, setShip, qty, price }) {
  const hasDestination = ship.postal.trim().length > 1;
  const buyerShip = shippingFor(ship.country, ship.speed, 1);

  return (
    <div style={{
      background: T.bgNeutral, border: `1px solid ${T.border}`, borderRadius: R.lg,
      padding: 24, display: "grid", gap: 16, fontFamily: FONT_BODY,
    }}>
      <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>
        Shipping{selling ? " — optional" : ""}
      </span>

      {selling ? (
        <>
          <label style={{ display: "grid", gap: 6, cursor: "pointer" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={!!ship.show}
                onChange={e => setShip({ ...ship, show: e.target.checked })}
                style={{ width: 18, height: 18, accentColor: C.blue600, flex: "0 0 auto" }}
              />
              <span style={{ fontSize: TYPE.base, fontWeight: 700 }}>
                Show what a buyer pays with delivery
              </span>
            </span>
            <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.55, paddingLeft: 28 }}>
              Your buyer pays shipping, so it is never part of your price or your profit. This only adds
              a line showing what they would see at checkout.
            </span>
          </label>

          {ship.show && (
            <div className="fade-in" style={{ display: "grid", gap: 14, borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
              <ShipTo selling shipping={false} ship={ship} setShip={setShip} />

              {/* ── The buyer's total, where the question was asked ──
                  One line, in the section with the checkbox, rather than
                  three lines in the panel. The panel is the seller's
                  numbers and nothing else; this is the buyer's, so it
                  lives with the control that reveals it and stays the
                  size of an aside. */}
              {buyerShip && (
                <div style={{
                  background: C.gray50, border: `1px solid ${T.border}`, borderRadius: R.md,
                  padding: "12px 14px", display: "grid", gap: 4,
                }}>
                  <span style={{ fontSize: TYPE.base, lineHeight: 1.55 }}>
                    A buyer in{" "}
                    {ship.country === "US"
                      ? ship.state
                      : SHIPPING.countries.find(c => c.id === ship.country)?.label}{" "}
                    pays <strong>{money(price)}</strong> for the book and{" "}
                    <strong>{money(buyerShip.cost)}</strong> to have it sent,{" "}
                    <strong>{money(price + buyerShip.cost)}</strong> in all.
                  </span>
                  <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>
                    Your cost, your price and your profit are unchanged. None of this is yours to pay.
                  </span>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <ShipTo selling={false} shipping ship={ship} setShip={setShip} />

          {/* Arrival dates wait for a postcode. Rates and dates mean nothing
              without a destination, and a table that cannot be right yet
              invites someone to plan around figures that will move the
              moment they type. */}
          {hasDestination && (
            <div className="fade-in" style={{ display: "grid", gap: 10, borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
              <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>
                When it would arrive
              </span>
              <DeliveryTable
                qty={qty} country={ship.country} poBox={ship.poBox}
                chosen={ship.speed} onChoose={id => setShip({ ...ship, speed: id })}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
