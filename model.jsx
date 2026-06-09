import React, { useState, useMemo } from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
 
// ---- helpers ----
const L = 100000; // 1 Lakh in rupees
const fmtL = (x) => `₹${x.toFixed(1)}L`;
const fmtCr = (x) => `₹${(x / 100).toFixed(2)}Cr`;
const fmtRs = (x) =>
  `₹${Math.round(x).toLocaleString("en-IN")}`;
 
function Field({ label, value, onChange, min, max, step, suffix, hint }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <label style={{ fontSize: 12.5, letterSpacing: 0.2, color: "var(--muted)", fontFamily: "var(--sans)" }}>{label}</label>
        <span style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--gold)", fontWeight: 600 }}>
          {value}{suffix}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "var(--gold)", cursor: "pointer" }}
      />
      {hint && <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 4, fontFamily: "var(--sans)", lineHeight: 1.4 }}>{hint}</div>}
    </div>
  );
}
 
function Stat({ label, value, sub, tone }) {
  const color = tone === "good" ? "var(--green)" : tone === "warn" ? "var(--red)" : "var(--ink-text)";
  return (
    <div style={{ padding: "14px 16px", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 10 }}>
      <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--sans)", letterSpacing: 0.3, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontFamily: "var(--mono)", fontWeight: 600, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: "var(--faint)", fontFamily: "var(--sans)", marginTop: 6, lineHeight: 1.4 }}>{sub}</div>}
    </div>
  );
}
 
export default function DealModel() {
  const [projects, setProjects] = useState(3);
  const [stagger, setStagger] = useState(2);
  const [ticket, setTicket] = useState(30);
  const [projMonths, setProjMonths] = useState(4);
  const [subSize, setSubSize] = useState(5);
  const [subMonths, setSubMonths] = useState(8);
  const [projShare, setProjShare] = useState(10);
  const [subShare, setSubShare] = useState(10);
  const [hours, setHours] = useState(80);
  const [marketRate, setMarketRate] = useState(3500);
  const [equity, setEquity] = useState(0.0);
  const [valuation, setValuation] = useState(40); // in ₹ Cr at raise
  const [dayJob, setDayJob] = useState(25);
 
  const model = useMemo(() => {
    const MONTHS = 24;
    const data = [];
    let cum = 0;
    for (let m = 0; m < MONTHS; m++) {
      let monthly = 0;
      for (let i = 0; i < projects; i++) {
        const start = i * stagger;
        const age = m - start;
        if (age < 0) continue;
        if (age < projMonths) {
          monthly += (ticket / projMonths) * (projShare / 100);
        } else if (age < projMonths + subMonths) {
          monthly += subSize * (subShare / 100);
        }
      }
      cum += monthly;
      data.push({ month: m + 1, monthly: +monthly.toFixed(2), cum: +cum.toFixed(2) });
    }
    const year1 = data.slice(0, 12).reduce((a, b) => a + b.monthly, 0);
    const year2 = data.slice(12, 24).reduce((a, b) => a + b.monthly, 0);
    const effHourly = (year1 * L) / (hours * 12);
    const marketAnnual = (marketRate * hours * 12) / L; // in L
    const equityVal = (equity / 100) * valuation * 100; // ₹Cr*100 = ₹L
    return { data, year1, year2, effHourly, marketAnnual, equityVal };
  }, [projects, stagger, ticket, projMonths, subSize, subMonths, projShare, subShare, hours, marketRate, equity, valuation]);
 
  const { data, year1, year2, effHourly, marketAnnual, equityVal } = model;
  const discountPct = ((1 - effHourly / marketRate) * 100);
 
  return (
    <div style={{
      "--ink": "#16140f", "--panel": "#1f1c15", "--line": "#332f25",
      "--ink-text": "#f4efe3", "--muted": "#b8ad94", "--faint": "#8a8068",
      "--gold": "#d4a72c", "--green": "#7fb069", "--red": "#d97d6a",
      "--serif": "'Fraunces', Georgia, serif", "--mono": "'IBM Plex Mono', monospace", "--sans": "'IBM Plex Sans', sans-serif",
      background: "var(--ink)", color: "var(--ink-text)", padding: 24, borderRadius: 14,
      fontFamily: "var(--sans)", maxWidth: 1080, margin: "0 auto",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');`}</style>
 
      <div style={{ marginBottom: 4 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 2, color: "var(--gold)", textTransform: "uppercase" }}>Deal Desk · Side-Project Economics</span>
      </div>
      <h1 style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 30, margin: "2px 0 4px", letterSpacing: -0.5 }}>
        Revenue-share vs. the day job
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 13.5, maxWidth: 720, lineHeight: 1.5, marginTop: 0 }}>
        Every term is a knob. Defaults reflect 10% revenue share, ₹25–40L ticket over 4 mo, then ₹4–5L/mo for 8 mo.
      </p>
 
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24, marginTop: 20 }}>
        {/* CONTROLS */}
        <div>
          <SectionLabel>Pipeline</SectionLabel>
          <Field label="Projects you're on (yr 1)" value={projects} onChange={setProjects} min={1} max={6} step={1} hint="Assumed to be about 3. Model fewer to stress-test." />
          <Field label="Months between project starts" value={stagger} onChange={setStagger} min={0} max={4} step={1} suffix=" mo" hint="0 = all live day one (unrealistic). 2 = staggered ramp." />
 
          <SectionLabel>Per-project economics</SectionLabel>
          <Field label="Project-phase ticket" value={ticket} onChange={setTicket} min={20} max={45} step={1} suffix="L" hint="Total over the build phase." />
          <Field label="Project-phase length" value={projMonths} onChange={setProjMonths} min={2} max={6} step={1} suffix=" mo" />
          <Field label="Subscription / month" value={subSize} onChange={setSubSize} min={2} max={8} step={0.5} suffix="L" />
          <Field label="Subscription length" value={subMonths} onChange={setSubMonths} min={4} max={12} step={1} suffix=" mo" />
 
          <SectionLabel>Your share</SectionLabel>
          <Field label="Share · project phase" value={projShare} onChange={setProjShare} min={5} max={25} step={1} suffix="%" />
          <Field label="Share · subscription phase" value={subShare} onChange={setSubShare} min={0} max={25} step={1} suffix="%" hint="Set to 0 to model 'share stops after 4 months, converts to equity.'" />
 
          <SectionLabel>You & comparison</SectionLabel>
          <Field label="Your hours / month" value={hours} onChange={setHours} min={40} max={160} step={10} suffix=" hrs" />
          <Field label="Your market contract rate" value={marketRate} onChange={setMarketRate} min={2000} max={7000} step={250} suffix="/hr" />
          <Field label="Equity granted" value={equity} onChange={setEquity} min={0} max={5} step={0.25} suffix="%" />
          <Field label="Valuation at raise" value={valuation} onChange={setValuation} min={5} max={150} step={5} suffix=" Cr" hint="Notional. Equity value = grant × valuation." />
          <Field label="Day-job fixed comp (ref)" value={dayJob} onChange={setDayJob} min={15} max={50} step={1} suffix="L" />
        </div>
 
        {/* OUTPUTS */}
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            {/* <Stat label="Year-1 cash" value={fmtL(year1)} sub={`vs ₹${dayJob}L day job (kept on top)`} tone={year1 >= dayJob ? "good" : undefined} /> */}
            <Stat label="Year-1 cash" value={fmtL(year1)} tone={year1 >= dayJob ? "good" : undefined} />
            <Stat label="Yr-2 run rate" value={fmtL(year2)} sub="steady state, same params" />
            <Stat label="Equity value @ raise" value={equityVal > 0 ? fmtL(equityVal) : "—"} sub={equity > 0 ? `${equity}% × ${fmtCr(valuation * 100)}` : "no equity set"} tone={equityVal > 0 ? "good" : undefined} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <Stat
              label="Effective hourly"
              value={fmtRs(effHourly)}
              sub={`${discountPct > 0 ? discountPct.toFixed(0) + "% below" : Math.abs(discountPct).toFixed(0) + "% above"} your ${fmtRs(marketRate)} market rate`}
              tone={effHourly >= marketRate ? "good" : "warn"}
            />
            <Stat
              label="The discount = your buy-in"
              value={discountPct > 0 ? fmtL(marketAnnual - year1) + "/yr" : "₹0"}
              sub={discountPct > 0 ? "cash forgoing vs market rate" : "at/above market on cash alone"}
              tone={discountPct > 0 ? "warn" : "good"}
            />
          </div>
 
          <div style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 10, padding: "16px 12px 8px" }}>
            <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--sans)", letterSpacing: 0.3, textTransform: "uppercase", marginBottom: 10, paddingLeft: 8 }}>
              Your monthly income (bars) & cumulative (line) · 24 mo
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={data} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="#2a2820" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#8a8068", fontSize: 10, fontFamily: "monospace" }} tickLine={false} axisLine={{ stroke: "#332f25" }} />
                <YAxis tick={{ fill: "#8a8068", fontSize: 10, fontFamily: "monospace" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#16140f", border: "1px solid #332f25", borderRadius: 8, fontFamily: "monospace", fontSize: 12 }}
                  labelStyle={{ color: "#d4a72c" }}
                  formatter={(v, n) => [fmtL(v), n === "monthly" ? "This month" : "Cumulative"]}
                  labelFormatter={(m) => `Month ${m}`}
                />
                <ReferenceLine x={12} stroke="#d97d6a" strokeDasharray="3 3" label={{ value: "yr 1", fill: "#d97d6a", fontSize: 10, position: "top" }} />
                <Bar dataKey="monthly" fill="#d4a72c" radius={[2, 2, 0, 0]} maxBarSize={22} />
                <Line dataKey="cum" stroke="#7fb069" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
 
          <div style={{ marginTop: 14, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6, fontFamily: "var(--sans)", borderLeft: "2px solid var(--gold)", paddingLeft: 12 }}>
            {/* <strong style={{ color: "var(--ink-text)" }}>Read the trade-off:</strong> push <em>Share · project phase</em> toward 15% and watch the effective rate hit market — that's the "more cash, less equity" path. Or hold 10% and load <em>Equity granted</em> — the "I'm betting on this" path. The honest deal is one or the other, not low cash <em>and</em> vague equity. */}
          </div>
        </div>
      </div>
    </div>
  );
}
 
function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: 1.5, textTransform: "uppercase",
      color: "var(--gold)", margin: "20px 0 12px", paddingBottom: 6, borderBottom: "1px solid var(--line)",
    }}>{children}</div>
  );
}