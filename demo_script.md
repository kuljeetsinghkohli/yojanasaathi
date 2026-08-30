# YojanaSaathi — Demo Script

*Structure: Introduction → Solution Walkthrough → Live Demo → Impact Statement (per the hackathon's Week 4 guidance). Rehearse out loud at least twice, with a timer, before Aug 31.*

## 1. Introduction (~30-45 sec)

"Meet Ramesh — a small farmer in Madhya Pradesh with 2 acres of rain-fed land growing cotton. Somewhere across dozens of central government schemes, there's real money and support he likely qualifies for: income support, crop insurance, a low-interest loan, an irrigation subsidy. But he doesn't know which schemes apply to *him*, and the official portals assume he already knows what to search for. That's the gap YojanaSaathi closes."

## 2. Solution Walkthrough (~30-45 sec)

"YojanaSaathi asks a farmer 7 simple questions — in Hindi or English. That profile, together with a curated dataset of 16 real central government schemes, goes to an LLM that's explicitly instructed to match only against real schemes in that dataset — never invent one. It comes back with plain-language matches: why you qualify, what you get, and what to do next."

*(Optionally show a quick architecture diagram or just describe: form → API route → Gemini + dataset → parsed results.)*

## 3. Live Demo (~60-90 sec)

- Run **Test 1** (Madhya Pradesh, small farmer, rain-fed, cotton) live — show matches appear within a few seconds.
- Run **Test 2** (Punjab, landless/livestock-only) — point out that PM-KISAN/PMFBY are *correctly excluded* because there's no landholding, and livestock/dairy schemes are matched instead, with an honest note explaining why.
- If time allows, show the **Devanagari test** (Hindi-script notes in, Hindi-script response out) to demonstrate genuine bilingual handling, not just transliteration.

## 4. Impact Statement (~20-30 sec)

"16 real central schemes covered. A 5-minute conversation replaces a trip to a government office or Common Service Centre just to ask 'what am I even eligible for.' Every match is grounded in real scheme data — the AI is instructed never to invent a benefit — and every result carries a clear disclosure to verify before applying."

---

## Q&A prep — anticipated judge questions

- **"Who's on your team?"** — Solo build. IBM Bob was the AI build partner across planning, coding, and debugging — this is a human + AI collaboration by design, not a one-person shortcut.
- **"How do you handle bias or hallucination?"** — The prompt is grounded strictly in the 16-scheme dataset (the model is told never to invent a scheme). Tested across different states, farmer categories, languages, and ages. Every output carries an AI-disclosure footer, and the app never auto-applies on the farmer's behalf.
- **"Is this production-ready?"** — No, it's an MVP scoped for the hackathon: no database, no authentication, 16 central schemes only, no rate limiting yet.
- **"Are these numbers current?"** — Spot-checked against official sources (pmkisan.gov.in, PIB) before demo day. One caveat: KCC's interest subvention rate is renewed annually by the government budget, so it's worth re-verifying each year rather than treating it as permanently fixed — an honest answer if asked.
- **"What would you add with more time?"** — State-specific schemes (beyond the 16 central ones), an automated test suite, rate limiting on the API, and a fully localized UI (currently the form labels are English; only the free-text notes field accepts Hindi).
