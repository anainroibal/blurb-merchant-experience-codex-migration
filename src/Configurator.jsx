import React, { useState, useEffect } from "react";
import { C, T, TYPE, R, FONT_DISPLAY, FONT_BODY, BUTTON_HEIGHT } from "./tokens.js";
import WhiteLabelTip from "./WhiteLabelTip.jsx";
import {
  CATALOG, ADDONS, SHIPPING, PRINT_DAYS,
  priceFor, selectedOption, pageLimit, shippingFor, money,
  availableFor, reconcile, sellerCost, minSellPrice,
} from "./catalog.js";

/* ────────────────────────────────────────────────────────────────
   The configurator, following the Blurb Pricing Calculator design
   (Figma "Blurb Pricing Page", v1-4, node 38:1562) — vertical STEP
   sections, each a grid of large image-led cards.

   Two changes from that design:
     · the pricing summary is not a block at the bottom. It sits
       alongside as a sticky panel, so the number moves while you
       choose rather than after you finish.
     · every variable that moves the price — pages, copies, upgrades,
       shipping — lives in that panel too, so the whole calculation is
       visible at a glance instead of scattered up the page.
   ──────────────────────────────────────────────────────────────── */

export function StepHeading({ n, children }) {
  return (
    <div style={{ textAlign: "center", margin: "0 0 24px" }}>
      <div style={{
        fontFamily: FONT_BODY, fontSize: TYPE.xl, fontWeight: 700,
        letterSpacing: 1, textTransform: "uppercase", color: T.textNeutral,
      }}>
        Step {n}: {children}
      </div>
      <div style={{ width: 64, height: 3, background: T.bgBrand, margin: "12px auto 0", borderRadius: 2 }} />
    </div>
  );
}

/* Codex — Text Selector, PDP variant: white, 2px #0d2f44 ring when chosen. */
function OptionCard({ title, sub, spec, note, selected, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      title={disabled ? "Not available with the rest of your selection" : undefined}
      style={{
        textAlign: "center", background: T.bgNeutral, borderRadius: R.md,
        padding: 16, minWidth: 0, opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        border: selected ? `2px solid ${T.borderBrand}` : `1px solid ${T.border}`,
        margin: selected ? 0 : 1,
        fontFamily: FONT_BODY, display: "grid", gap: 8, alignContent: "start",
      }}
    >
      <div style={{
        background: selected ? C.blue50 : C.gray100, borderRadius: R.sm,
        aspectRatio: "16 / 11", display: "grid", placeItems: "center",
      }}>
        <span className="ms" style={{ fontSize: 40, color: selected ? C.blue600 : C.gray400 }}>menu_book</span>
      </div>
      <div style={{
        fontSize: TYPE.base, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase",
        color: selected ? C.blue950 : T.textNeutral, lineHeight: 1.3,
      }}>
        {title}
      </div>
      {sub && <div style={{ fontSize: TYPE.sm, color: T.textSubtle }}>{sub}</div>}
      {spec && <div style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>{spec}</div>}
      {note && (
        <div style={{ fontSize: TYPE.sm, fontWeight: 700, color: selected ? C.blue600 : T.textSubtle }}>
          {note}
        </div>
      )}
    </button>
  );
}

/* Compact controls for the calculator panel — everything that moves the
   price sits next to the price itself. */
function MiniStepper({ label, hint, value, min, max, step = 1, onChange }) {
  const btn = {
    width: 30, height: 30, borderRadius: R.sm, border: `1px solid ${T.border}`,
    background: T.bgNeutral, display: "grid", placeItems: "center",
  };
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <span style={{ display: "grid", gap: 1, minWidth: 0 }}>
        <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</span>
        {hint && <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>{hint}</span>}
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flex: "0 0 auto" }}>
        <button style={btn} onClick={() => onChange(Math.max(min, value - step))} aria-label={`Fewer ${label}`}>
          <span className="ms" style={{ fontSize: 16 }}>remove</span>
        </button>
        <input
          type="number" value={value} min={min} max={max}
          onChange={e => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
          style={{
            width: 54, border: `1px solid ${T.border}`, borderRadius: R.sm, outline: "none",
            textAlign: "center", padding: "5px 2px",
            fontFamily: FONT_BODY, fontSize: TYPE.lg, fontWeight: 700, color: T.textNeutral,
          }}
        />
        <button style={btn} onClick={() => onChange(Math.min(max, value + step))} aria-label={`More ${label}`}>
          <span className="ms" style={{ fontSize: 16 }}>add</span>
        </button>
      </span>
    </div>
  );
}

function Check({ label, detail, benefit, checked, onChange, info }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      style={{
        display: "grid", gridTemplateColumns: "22px 1fr", gap: 10, alignItems: "start",
        background: "transparent", border: 0, padding: 0, textAlign: "left",
        fontFamily: FONT_BODY, width: "100%",
      }}
    >
      <span style={{
        width: 22, height: 22, borderRadius: R.sm, marginTop: 1,
        border: checked ? `2px solid ${C.blue950}` : `1px solid ${T.borderStrong}`,
        background: checked ? C.blue950 : T.bgNeutral,
        display: "grid", placeItems: "center", color: T.textInverse, flex: "0 0 auto",
      }}>
        {checked && <span className="ms" style={{ fontSize: 15 }}>check</span>}
      </span>
      <span style={{ display: "grid", gap: 2, minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</span>
            {info}
          </span>
          <span style={{ fontSize: TYPE.sm, color: T.textSubtle, whiteSpace: "nowrap" }}>{detail}</span>
        </span>
        {benefit && (
          <span style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.45 }}>{benefit}</span>
        )}
      </span>
    </button>
  );
}

/* Free-text price entry. A number input clamped on every keystroke is
   impossible to type into — entering "24" against a $4.20 floor turns
   into "4.20" the moment you press 2. So: type whatever you like, the
   ladder follows live, and the floor is applied when you leave the field. */
function PriceInput({ value, floor, onChange }) {
  const [raw, setRaw] = useState(value.toFixed(2));
  const [editing, setEditing] = useState(false);

  useEffect(() => { if (!editing) setRaw(value.toFixed(2)); }, [value, editing]);

  const parsed = parseFloat(raw);
  const below = editing && raw.trim() !== "" && Number.isFinite(parsed) && parsed < floor;

  const commit = () => {
    setEditing(false);
    const next = Number.isFinite(parsed) ? Math.max(floor, parsed) : floor;
    setRaw(next.toFixed(2));
    onChange(next);
  };

  return (
    <span style={{ display: "grid", gap: 4 }}>
      <span style={{
        display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
        border: `2px solid ${below ? "#b3261e" : T.borderBrand}`, borderRadius: R.md,
        background: T.bgNeutral,
      }}>
        <span style={{ fontSize: TYPE.lg, color: T.textSubtle }}>US $</span>
        <input
          type="text" inputMode="decimal" value={raw}
          aria-label="Your price"
          onFocus={e => { setEditing(true); e.target.select(); }}
          onChange={e => {
            const v = e.target.value;
            if (!/^\d*\.?\d*$/.test(v)) return;   // digits and one decimal point
            setRaw(v);
            const n = parseFloat(v);
            if (Number.isFinite(n)) onChange(n);   // ladder follows as you type
          }}
          onBlur={commit}
          onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
          style={{
            border: 0, outline: "none", width: "100%", background: "transparent",
            fontFamily: FONT_BODY, fontSize: TYPE.xl, fontWeight: 700, color: T.textNeutral,
          }}
        />
      </span>
      {below && (
        <span style={{ fontSize: TYPE.sm, color: "#b3261e" }}>
          Below your cost. This will lift to {money(floor)} when you finish.
        </span>
      )}
    </span>
  );
}

/* Fixed attributes — shown, not chosen. BookWright presents magazine paper and
   cover this way: a labelled value you can read but not change, with the detail
   underneath. Better than a one-option picker, which implies a decision. */
function FixedSpecs({ items, note }) {
  return (
    <div style={{
      background: T.bgNeutral, border: `1px solid ${T.border}`, borderRadius: R.md,
      padding: 20, display: "grid", gap: 16, maxWidth: 560, margin: "0 auto",
    }}>
      {items.map(f => (
        <div key={f.label} style={{ display: "grid", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span style={{
              fontSize: TYPE.base, fontWeight: 700, color: T.textNeutral,
              minWidth: 74, flex: "0 0 auto",
            }}>{f.label}:</span>
            <span style={{
              flex: 1, minWidth: 0, padding: "7px 12px", borderRadius: R.sm,
              border: `1px solid ${T.border}`, background: C.gray50,
              fontSize: TYPE.base, color: T.textNeutral,
            }}>{f.value}</span>
          </div>
          {f.detail && (
            <div style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.55, paddingLeft: 88 }}>
              {f.detail}
            </div>
          )}
        </div>
      ))}
      {note && (
        <div style={{ fontSize: TYPE.sm, color: T.textSubtle, lineHeight: 1.5 }}>{note}</div>
      )}
    </div>
  );
}

function Line({ label, value, strong, muted }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
      <span style={{
        fontSize: strong ? TYPE.base : TYPE.sm,
        color: muted ? T.textSubtle : T.textNeutral,
        fontWeight: strong ? 700 : 400,
        letterSpacing: strong ? 0.4 : 0, textTransform: strong ? "uppercase" : "none",
      }}>{label}</span>
      <span style={{
        fontSize: strong ? TYPE["4xl"] : TYPE.base, fontWeight: strong ? 700 : 600,
        color: strong ? C.blue950 : T.textNeutral, whiteSpace: "nowrap",
        fontFamily: strong ? FONT_DISPLAY : FONT_BODY,
      }}>{value}</span>
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: `1px solid ${T.border}` }} />;
}

/* ── Shipping estimate, folded away until asked for ── */
function ShippingBlock({ ship, setShip, qty, selling, cost }) {
  const country = SHIPPING.countries.find(c => c.id === ship.country);
  const ready = ship.postal.trim().length > 1;
  const quote = ready ? shippingFor(ship.country, ship.speed, qty) : null;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <button
        onClick={() => setShip({ ...ship, open: !ship.open })}
        aria-expanded={ship.open}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
          background: "transparent", border: 0, padding: 0, width: "100%",
          fontFamily: FONT_BODY, textAlign: "left",
        }}
      >
        <span style={{ fontSize: TYPE.sm, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>
          {selling ? "What your buyer pays" : "Shipping"}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: T.textSubtle, fontSize: TYPE.sm }}>
          {quote ? money(quote.cost) : "Estimate"}
          <span className="ms" style={{ fontSize: 18 }}>{ship.open ? "expand_less" : "expand_more"}</span>
        </span>
      </button>

      {ship.open && (
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
            <select
              value={ship.country}
              onChange={e => setShip({ ...ship, country: e.target.value, postal: "" })}
              style={{
                border: `1px solid ${T.border}`, borderRadius: R.sm, padding: "8px 10px",
                fontFamily: FONT_BODY, fontSize: TYPE.sm, background: T.bgNeutral, minWidth: 0,
              }}
            >
              {SHIPPING.countries.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <input
              value={ship.postal}
              onChange={e => setShip({ ...ship, postal: e.target.value })}
              placeholder={country?.example}
              aria-label={country?.postal}
              style={{
                border: `1px solid ${T.border}`, borderRadius: R.sm, padding: "8px 10px",
                fontFamily: FONT_BODY, fontSize: TYPE.sm, minWidth: 0,
              }}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            {SHIPPING.speeds.map(s => {
              const on = ship.speed === s.id;
              const q = ready ? shippingFor(ship.country, s.id, qty) : null;
              return (
                <button
                  key={s.id}
                  onClick={() => setShip({ ...ship, speed: s.id })}
                  aria-pressed={on}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                    padding: "8px 10px", borderRadius: R.sm, background: T.bgNeutral,
                    border: on ? `2px solid ${T.borderBrand}` : `1px solid ${T.border}`,
                    margin: on ? 0 : 1, fontFamily: FONT_BODY, textAlign: "left",
                  }}
                >
                  <span style={{ display: "grid", gap: 1, minWidth: 0 }}>
                    <span style={{ fontSize: TYPE.sm, fontWeight: on ? 700 : 500 }}>{s.label}</span>
                    <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>{s.days}</span>
                  </span>
                  <span style={{ fontSize: TYPE.sm, fontWeight: 700, color: on ? C.blue600 : T.textSubtle, whiteSpace: "nowrap" }}>
                    {q ? money(q.cost) : "—"}
                  </span>
                </button>
              );
            })}
          </div>

          <p style={{ fontSize: TYPE.sm, color: T.textSubtle, margin: 0, lineHeight: 1.5 }}>
            This is an estimate. Taxes and delivery rates vary by destination and are confirmed at checkout.
            Printing takes {PRINT_DAYS.label} before your order ships.
          </p>

          {selling && quote && (
            <div style={{ display: "grid", gap: 8, borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
              <Line label="Your price" value={money(cost.sellPrice)} muted />
              <Line label="Shipping, paid by them" value={money(quote.cost)} muted />
              <Line label="Buyer pays" value={money(cost.sellPrice + quote.cost)} />
              <p style={{ fontSize: TYPE.sm, color: T.textSubtle, margin: 0, lineHeight: 1.5 }}>
                None of this touches your margin — your buyer pays shipping directly.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Configurator({
  formatId, state, onChange, selling, sellPrice, onSellPrice,
  stepOffset = 1, leading, trailing,
}) {
  const f = CATALOG[formatId];
  const p = priceFor(formatId, state);
  const limit = pageLimit(formatId, state);
  const cost = sellerCost(formatId, state);
  const floor = minSellPrice(formatId, state);
  const profit = Math.max(0, sellPrice - cost);

  /* A pricier paper can push cost above the asking price — lift it rather
     than leaving the ladder showing zero profit. */
  useEffect(() => { if (selling && sellPrice < floor) onSellPrice(floor); }, [floor, selling]);

  const [ship, setShip] = useState({ open: false, country: "US", postal: "", speed: "economy" });
  const quote = ship.postal.trim().length > 1 ? shippingFor(ship.country, ship.speed, selling ? 1 : state.qty) : null;

  const set = (groupId, id) => {
    /* One choice can invalidate another, and paper caps the page count.
       Repair both rather than quoting a book that cannot be made. */
    let next = reconcile(formatId, { ...state, [groupId]: id }, groupId);
    const cap = pageLimit(formatId, next);
    if (next.pages > cap) next.pages = cap;
    onChange(next);
  };
  const toggleAddon = id => {
    const on = state.addons.includes(id);
    onChange({ ...state, addons: on ? state.addons.filter(a => a !== id) : [...state.addons, id] });
  };

  const addons = (f.addons || []).map(id => ADDONS.find(a => a.id === id)).filter(Boolean);

  return (
    <div style={{ display: "grid", gap: 40, gridTemplateColumns: "minmax(340px, 1.55fr) minmax(310px, 0.85fr)", alignItems: "start" }}>

      {/* ── Steps ── */}
      <div style={{ minWidth: 0, display: "grid", gap: 48 }}>
        {leading}

        {f.digital && (
          <p style={{ fontSize: TYPE.lg, lineHeight: 1.6, color: T.textSubtle, margin: 0, textAlign: "center" }}>{f.note}</p>
        )}

        {f.groups.map((g, i) => (
          <section key={g.id}>
            <StepHeading n={stepOffset + i + 1}>{g.label}</StepHeading>
            <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
              {g.options.map(o => {
                const ok = availableFor(formatId, state, g.id).has(o.id);
                return (
                  <OptionCard
                    key={o.id}
                    title={o.label}
                    sub={o.dims}
                    spec={o.spec ? `${o.spec}${o.maxPages ? ` · up to ${o.maxPages} pages` : ""}` : null}
                    note={ok ? null : "Not in this combination"}
                    selected={state[g.id] === o.id}
                    disabled={!ok}
                    onClick={() => set(g.id, o.id)}
                  />
                );
              })}
            </div>

            {(() => {
              const chosen = selectedOption(formatId, g.id, state);
              return chosen?.fixed ? (
                <div style={{ marginTop: 20 }}>
                  <FixedSpecs items={chosen.fixed} note={g.note} />
                </div>
              ) : null;
            })()}
          </section>
        ))}

        {trailing}
      </div>

      {/* ── Calculator, alongside. Every variable lives here. ── */}
      <aside
        style={{
          position: "sticky", top: 88, background: T.bgNeutral,
          border: `1px solid ${T.border}`, borderRadius: R.lg,
          padding: 22, display: "grid", gap: 14, minWidth: 0,
        }}
      >
        <div style={{
          fontFamily: FONT_BODY, fontSize: TYPE.base, fontWeight: 700,
          letterSpacing: 0.8, textTransform: "uppercase",
        }}>
          {selling ? "What you'd earn" : "Pricing summary"}
        </div>

        {/* what you've chosen */}
        <div style={{ display: "grid", gap: 3, fontSize: TYPE.sm, color: T.textSubtle }}>
          {f.groups.map(g => {
            const o = selectedOption(formatId, g.id, state);
            return <span key={g.id}><strong style={{ color: T.textNeutral }}>{g.label.replace("Choose your ", "").toUpperCase()}:</strong> {o?.label}</span>;
          })}
        </div>

        {!f.digital && (
          <>
            <Divider />
            <MiniStepper
              label="Pages" hint={`${f.basePages}–${limit} · ${money(p.perPage)} each`}
              value={state.pages} min={f.basePages} max={limit} step={2}
              onChange={pages => onChange({ ...state, pages })}
            />
            {!selling && (
              <MiniStepper
                label="Copies" hint="Discount from 10"
                value={state.qty} min={1} max={999}
                onChange={qty => onChange({ ...state, qty })}
              />
            )}
            {addons.length > 0 && (
              <>
                <Divider />
                <div style={{ display: "grid", gap: 10 }}>
                  {addons.map(a => (
                    <Check
                      key={a.id} label={a.label} detail={a.detail} benefit={a.benefit}
                      info={a.id === "whitelabel" ? <WhiteLabelTip /> : null}
                      checked={state.addons.includes(a.id)}
                      onChange={() => toggleAddon(a.id)}
                    />
                  ))}
                </div>
              </>
            )}
            <Divider />
            <ShippingBlock
              ship={ship} setShip={setShip}
              qty={selling ? 1 : state.qty} selling={selling}
              cost={{ sellPrice }}
            />
          </>
        )}

        <Divider />

        {selling ? (
          <>
            <div style={{ display: "grid", gap: 12 }}>
              <Line label="Your cost" value={money(cost)} />
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: TYPE.sm, color: T.textSubtle }}>Your price — minimum {money(floor)}</span>
                <PriceInput value={sellPrice} floor={floor} onChange={onSellPrice} />
              </label>
              <div style={{ borderTop: `1px solid ${C.gray400}` }} />
              <Line label="Your profit" value={money(profit)} strong />
            </div>
            <p style={{ fontSize: TYPE.sm, color: T.textSubtle, margin: 0, lineHeight: 1.5 }}>
              Your buyer pays shipping, so your margin is the same wherever they live.
            </p>
          </>
        ) : (
          <>
            <div style={{ display: "grid", gap: 10 }}>
              {p.extraPages > 0 && <Line label={`Extra pages (${state.pages - f.basePages})`} value={money(p.extraPages)} muted />}
              {p.addons > 0 && <Line label="Upgrades" value={money(p.addons)} muted />}
              {state.qty > 1 && <Line label={`${state.qty} copies`} value={money(p.subtotal)} muted />}
              {p.tier && <Line label={`Volume discount ${Math.round(p.tier.pct * 100)}%`} value={`− ${money(p.subtotal - p.total)}`} muted />}
              {quote && <Line label={`Shipping — ${quote.speed.label}`} value={money(quote.cost)} muted />}
              <Line label="Total" value={money(p.total + (quote?.cost ?? 0))} strong />
            </div>
            <p style={{ fontSize: TYPE.sm, color: T.textSubtle, margin: 0, lineHeight: 1.5 }}>
              {quote ? "Excludes taxes." : "Excludes taxes and shipping."}
              {p.tier && " A promo code replaces this discount rather than adding to it."}
            </p>
          </>
        )}

        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
          <p style={{ fontSize: TYPE.sm, color: T.textSubtle, margin: 0, lineHeight: 1.5 }}>
            {selling
              ? "Cost and margin are placeholders — Blurb publishes no fulfilment pricing."
              : p.anyGuess
                ? "Some option prices are placeholders. Sizes, per-page rate, paper specs and tiers are real."
                : "Sizes, per-page rate, paper specs and volume tiers are real."}
          </p>
        </div>
      </aside>
    </div>
  );
}
