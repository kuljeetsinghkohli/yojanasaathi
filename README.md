# YojanaSaathi

*Find the government schemes you may already qualify for — in a 5-minute conversation, in Hindi or English.*

Built solo for the IBM SkillsBuild AI Hackathon 2026, using IBM Bob.

## The problem

Millions of Indian farmers are eligible for central government welfare and subsidy schemes they never discover, simply because there's no single place to check eligibility across dozens of overlapping schemes. Existing scheme portals assume the farmer already knows what to search for — they don't help someone figure out *which* schemes might apply to their specific situation.

## The solution

YojanaSaathi asks a farmer 7 simple questions about their situation (state, land size, farmer category, main crops, irrigation status, age, and free-text notes in Hindi or English), then matches them against a curated dataset of 16 real central government schemes using an LLM (Google Gemini) — explaining in plain language why they qualify, what they get, and what to do next.

## Architecture

- **Frontend**: Next.js (App Router) + Tailwind CSS v4 — a single-page form and results view.
- **Backend**: one Next.js API route (`/api/match`) that assembles a grounded prompt (scheme dataset + farmer profile), calls Google Gemini, and parses/validates the JSON response before returning it to the client.
- **Data**: a static, hand-curated dataset of 16 central schemes (`data/farmer_schemes_dataset.json`) with structured eligibility rules and official source links. The LLM is explicitly instructed to match only against this dataset — never invent a scheme or benefit amount.
- No database, no authentication — intentionally scoped for an MVP hackathon build.

**Tech stack**: Next.js 16, React 19, Tailwind CSS v4, Google Gemini (`@google/genai`), deployed on Vercel.

## Built with IBM Bob

This was a solo build, and IBM Bob was used as an active build partner at every stage:

- **Plan mode** — architecture design: deciding the frontend/backend split, the data flow from farmer input to LLM to display, and scoping the MVP deliberately (no DB/auth, 16 schemes only) before writing any code.
- **Agent mode** — implementing the backend (Gemini integration, prompt assembly, response parsing/validation) and the frontend (form, results UI, loading and error states), plus iterative debugging as issues came up.
- **Ask mode** — explaining unfamiliar concepts along the way (Next.js API routes, environment variables, git fundamentals), since this was built by someone new to full-stack development.
- Iterative, in-the-moment debugging with Bob across two Gemini SDK/model deprecations mid-build, environment setup issues (Node.js install, npm package-naming restrictions, Tailwind v4 config differences), and UI polish passes.

## Responsible AI

- **Anonymized data** — all testing used fictional farmer profiles; no real names, phone numbers, or Aadhaar-linked details anywhere in the app or its demo material.
- **Bias testing** — verified the matcher behaves sensibly across different states, farmer categories (including landless/livestock-only and pond-based), languages (Hindi script, Hindi-in-Roman-script, English), and ages — including correctly *excluding* schemes a farmer doesn't qualify for (PM-KISAN/PMFBY for landless farmers with no land records; the PM-KMY pension scheme for applicants over 40).
- **AI disclosure** — a persistent footer states that matches are AI-generated and must be verified on the official government portal before applying.
- **Human-in-the-loop** — the app only recommends; it never submits an application or makes a final eligibility decision on the farmer's behalf.
- **Secured API keys** — the Gemini API key lives only in `.env.local`, which has been git-ignored from the repository's very first commit (verified via `git log --all --full-history -- .env.local`, which returns nothing).
- **Verified outputs** — benefit figures shown by the app (PM-KISAN's ₹6,000/year, PMFBY's premium caps, KCC's loan terms, PMKSY-PDMC's subsidy range) were manually cross-checked against official sources (pmkisan.gov.in, PIB press releases) before demo day.

## Demo profiles used for testing

1. **Madhya Pradesh, small farmer, rain-fed** — 5 high-confidence matches.
2. **Punjab, landless (livestock-only)** — correctly excluded PM-KISAN/PMFBY (no landholding); matched livestock/dairy and allied schemes instead, with an honest note explaining the exclusion.
3. **Rajasthan, small farmer, age 45** — correctly excluded the PM-KMY pension scheme (eligible age range is 18–40); matched 5 other schemes.

## Running locally

```
git clone <repo-url>
cd YojanaSaathi
npm install
cp .env.local.example .env.local   # then edit .env.local and add your own GEMINI_API_KEY
npm run dev
```

Get a free Gemini API key at https://aistudio.google.com/apikey.

## Known limitations / what I'd improve with more time

- Covers 16 central schemes only — no state-specific schemes yet.
- No automated test suite; testing was manual, via the 3 demo profiles above plus ad-hoc edge cases.
- No rate limiting on the API route.
- KCC's interest subvention rate is renewed annually by the government budget — worth re-verifying each year rather than treating it as permanently fixed.

## Team

Built solo, as a human + AI collaboration: I was the domain thinker, tester, and decision-maker throughout every stage; IBM Bob was the build partner across planning, coding, and debugging. Team name for the hackathon: **Singularity (Human-in-the-Loop)** — one person, amplified by AI, with a human firmly in the loop at every step.
