"use client";

import { useState } from "react";
import HeroBanner from "@/components/HeroBanner";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const FARMER_CATEGORIES = [
  { value: "marginal", label: "Marginal (< 1 hectare)" },
  { value: "small", label: "Small (1–2 hectares)" },
  { value: "general", label: "General / Medium (> 2 hectares)" },
  { value: "landless (livestock-only)", label: "Landless — Livestock only" },
  { value: "landless (pond-based)", label: "Landless — Pond-based / Fisheries" },
  { value: "tenant", label: "Tenant / Sharecropper" },
];

const IRRIGATION_OPTIONS = [
  { value: "irrigated", label: "Fully irrigated" },
  { value: "partially irrigated", label: "Partially irrigated" },
  { value: "rain-fed", label: "Rain-fed only" },
];

const CONFIDENCE_STYLES = {
  high:   { badge: "bg-green-100 text-green-800 border border-green-200",   dot: "bg-green-500",  label: "High confidence" },
  medium: { badge: "bg-amber-100 text-amber-800 border border-amber-200",   dot: "bg-amber-400",  label: "Medium confidence" },
  low:    { badge: "bg-gray-100  text-gray-600  border border-gray-200",    dot: "bg-gray-400",   label: "Low confidence" },
};

function ConfidenceBadge({ level }) {
  const s = CONFIDENCE_STYLES[level] ?? CONFIDENCE_STYLES.low;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function MatchCard({ match }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-900 leading-snug">{match.scheme_name}</h3>
        <ConfidenceBadge level={match.confidence} />
      </div>

      <dl className="flex flex-col gap-2 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">
            Why you qualify
          </dt>
          <dd className="text-gray-800 leading-relaxed">{match.why_you_qualify}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">
            What you get
          </dt>
          <dd className="text-gray-800 leading-relaxed">{match.what_you_get}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">
            Next step
          </dt>
          <dd className="text-gray-800 leading-relaxed">{match.next_step}</dd>
        </div>
      </dl>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {hint && <span className="ml-1 font-normal text-gray-400 text-xs">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

const selectCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600";
const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600";

const INITIAL_FORM = {
  state: "",
  landSize: "",
  farmerCategory: "",
  mainCrops: "",
  irrigationStatus: "",
  age: "",
  notes: "",
};

export default function Home() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { matches, notes_for_farmer }
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setResult(null);
    setError(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero banner */}
      <HeroBanner />

      {/* Gradient bridge: blends the hero photo's bottom edge into the page texture */}
      <div
        aria-hidden="true"
        style={{
          height: "60px",
          background: "linear-gradient(to bottom, #4a6741, #f2ede4)",
        }}
      />

      {/* Main — textured background */}
      <main
        className="flex-1 px-4 py-8"
        style={{
          backgroundImage: "url('/images/page-bg-texture.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
        }}
      >
        <div className="mx-auto max-w-2xl flex flex-col gap-8">

          {/* Form */}
          {!result && !loading && (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-5">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Your Farmer Profile</h2>
                <p className="text-sm text-gray-500 mt-0.5">Fill in what you know — partial information is fine.</p>
              </div>

              <Field label="State" hint="required">
                <select name="state" value={form.state} onChange={handleChange} required className={selectCls}>
                  <option value="">Select your state…</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="Land size" hint="e.g. 1.5 hectares, 3 acres, or 'no land'">
                <input
                  type="text"
                  name="landSize"
                  value={form.landSize}
                  onChange={handleChange}
                  placeholder="e.g. 1.5 hectares"
                  className={inputCls}
                />
              </Field>

              <Field label="Farmer category">
                <select name="farmerCategory" value={form.farmerCategory} onChange={handleChange} className={selectCls}>
                  <option value="">Select category…</option>
                  {FARMER_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="Main crops grown" hint="or 'livestock only', 'fisheries', 'not currently farming'">
                <input
                  type="text"
                  name="mainCrops"
                  value={form.mainCrops}
                  onChange={handleChange}
                  placeholder="e.g. wheat and soybean"
                  className={inputCls}
                />
              </Field>

              <Field label="Irrigation status">
                <select name="irrigationStatus" value={form.irrigationStatus} onChange={handleChange} className={selectCls}>
                  <option value="">Select irrigation status…</option>
                  {IRRIGATION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="Age" hint="only needed for pension-scheme matching">
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  min="18"
                  max="100"
                  placeholder="e.g. 45"
                  className={inputCls}
                />
              </Field>

              <Field label="Anything else to mention" hint="in Hindi or English — the more detail, the better matches">
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder='e.g. "Mera pump diesel se chalta hai aur bahut mehenga padta hai." or "I want to sell my wheat at a better price."'
                  className={`${inputCls} resize-none`}
                />
              </Field>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !form.state}
                className="w-full rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition-colors"
              >
                {loading ? "Finding schemes…" : "Find Matching Schemes"}
              </button>
            </form>
          )}

          {/* Loading spinner */}
          {loading && (
            <div className="flex flex-col items-center gap-3 py-12 text-gray-500">
              <svg className="h-8 w-8 animate-spin text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm">Checking your profile against the scheme database…</p>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold text-gray-900">
                  {result.matches?.length > 0
                    ? `${result.matches.length} scheme${result.matches.length !== 1 ? "s" : ""} found for you`
                    : "No strong matches found"}
                </h2>
                <button
                  onClick={handleReset}
                  className="text-sm text-green-700 font-medium hover:underline focus:outline-none"
                >
                  ← New search
                </button>
              </div>

              {result.matches?.map((match) => (
                <MatchCard key={match.scheme_id} match={match} />
              ))}

              {result.notes_for_farmer && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-800 leading-relaxed">
                  <p className="font-semibold mb-1 text-xs uppercase tracking-wide text-blue-500">Note</p>
                  {result.notes_for_farmer}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-5 mt-auto">
        <div className="mx-auto max-w-2xl text-center text-xs text-gray-400 leading-relaxed">
          Scheme matches are AI-generated based on the information you provided and may not be fully accurate.
          Always verify your eligibility and benefits on the official government portal before applying.
          YojanaSaathi is not affiliated with any government body.
        </div>
      </footer>
    </div>
  );
}
