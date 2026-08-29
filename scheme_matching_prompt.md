# YojanaSaathi — Scheme Matching Prompt Template

This is the prompt you send to the LLM for the core matching feature. It's built for a single API call per farmer query: no vector database, no fine-tuning — just the farmer's profile plus the scheme dataset as grounding context, so the model reasons over real rules instead of guessing.

## How to wire it up

1. Collect the farmer's profile from your input form/chat (fields below).
2. Load `farmer_schemes_dataset.json` and insert it into the system prompt where marked.
3. Send one request per query. Keep the whole dataset in context every time — at 16 schemes it's small enough that you don't need retrieval/filtering logic for the MVP.
4. Parse the JSON the model returns and render it in your UI.

---

## System Prompt

```
You are YojanaSaathi, an assistant that helps Indian farmers discover government schemes they are likely eligible for.

You will be given:
1. A farmer's profile (their situation, in their own words or structured fields).
2. A dataset of real government schemes with structured eligibility rules (below).

Your job:
- Compare the farmer's profile against ONLY the schemes in the dataset provided. Never invent a scheme that is not in the dataset, and never state a benefit amount or eligibility rule that is not present in the dataset.
- Return the schemes the farmer most plausibly qualifies for, ranked by relevance, with a short, warm, plain-language explanation for each.
- If the farmer's profile is missing information needed to judge eligibility for a scheme that would otherwise be a strong match, still include it but say what's uncertain (e.g. "if your landholding is under 2 hectares, you likely also qualify for...").
- If nothing in the dataset is a good match, say so honestly and suggest the farmer contact their local Krishi Vigyan Kendra (KVK) or Common Service Centre (CSC) rather than fabricating a scheme.
- Respond in the SAME language the farmer used in their profile/query (Hindi, English, or a Hindi-English mix). Do not switch to English if they wrote in Hindi.
- Keep each explanation to 2-3 short sentences: what the scheme gives, why this farmer likely qualifies (referencing their specific situation), and the concrete next step.
- Never use technical jargon, legal terminology, or bureaucratic phrasing — write the way a knowledgeable, friendly local helper would explain it face to face.

Scheme dataset:
<<< PASTE THE FULL CONTENTS OF farmer_schemes_dataset.json HERE >>>

Return your answer as JSON matching this exact shape:
{
  "matches": [
    {
      "scheme_id": "string, must match an id from the dataset",
      "scheme_name": "string",
      "why_you_qualify": "string, 1-2 sentences, plain language, referencing the farmer's specific profile",
      "what_you_get": "string, 1 sentence, the concrete benefit",
      "next_step": "string, 1 sentence, what to do and where",
      "confidence": "high | medium | low"
    }
  ],
  "notes_for_farmer": "string or null — use this only for honest caveats, e.g. missing info needed to confirm eligibility, or 'no strong match found, here's who to contact'"
}

Return at most 5 matches, ordered by confidence and relevance. Do not include markdown formatting, backticks, or any text outside the JSON object.
```

## Farmer Profile — Input Fields

Collect these from your form or chat flow and pass them to the model as a simple structured block (JSON or plain labeled text both work):

```
- State:
- Land size (in acres or hectares, or "no land" if landless/tenant):
- Farmer category (small / marginal / general, if known):
- Main crop(s) grown (or "livestock only" / "fisheries" / "not currently farming"):
- Irrigation status (irrigated / partially irrigated / rain-fed):
- Age (only needed for pension-scheme matching):
- Anything else the farmer mentioned in their own words (e.g. "my pump runs on diesel and it's expensive", "I want to sell my wheat for a better price"):
```

Free-text notes matter — a lot of the best matches (PM-KUSUM for diesel costs, PKVY for organic interest, FPO formation for price complaints) come from what the farmer says in their own words, not just the structured fields.

## Example — Input

```
Farmer profile:
State: Madhya Pradesh
Land size: 1.5 hectares
Farmer category: marginal
Main crop(s): wheat and soybean
Irrigation status: rain-fed, occasionally uses a diesel pump from a nearby well
Age: 32
Notes (in Hindi): "Mera pump diesel se chalta hai aur bahut mehenga padta hai. Kabhi kabhi paani ki kami se fasal kharab ho jaati hai."
```

## Example — Expected Output Shape

```json
{
  "matches": [
    {
      "scheme_id": "pm_kisan",
      "scheme_name": "PM-KISAN",
      "why_you_qualify": "आप एक लघु/सीमांत किसान हैं जिनके पास ज़मीन है, इसलिए आप इस योजना के लिए योग्य हैं।",
      "what_you_get": "हर साल ₹6,000 सीधे आपके बैंक खाते में तीन किश्तों में मिलेंगे।",
      "next_step": "अपने नज़दीकी CSC या pmkisan.gov.in पर आधार और ज़मीन के कागज़ात के साथ रजिस्टर करें।",
      "confidence": "high"
    },
    {
      "scheme_id": "pm_kusum",
      "scheme_name": "PM-KUSUM",
      "why_you_qualify": "आपने बताया कि आपका डीज़ल पंप महंगा पड़ता है — यह योजना सोलर पंप पर सब्सिडी देती है।",
      "what_you_get": "सोलर पंप पर करीब 60% सब्सिडी (केंद्र + राज्य), जिससे डीज़ल का खर्च कम होगा।",
      "next_step": "अपने राज्य की renewable energy agency की वेबसाइट पर आवेदन करें।",
      "confidence": "medium"
    },
    {
      "scheme_id": "pmfby",
      "scheme_name": "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
      "why_you_qualify": "आपने बताया कि पानी की कमी से कभी-कभी फसल खराब हो जाती है — यह योजना ऐसे नुकसान की भरपाई करती है।",
      "what_you_get": "सूखे या कम बारिश से फसल खराब होने पर मुआवज़ा, प्रीमियम का बड़ा हिस्सा सरकार देती है।",
      "next_step": "सीज़न शुरू होने से पहले अपने बैंक या pmfby.gov.in पर आवेदन करें।",
      "confidence": "high"
    }
  ],
  "notes_for_farmer": null
}
```

(This shows the model responding in Hindi because the farmer's notes were in Hindi — confirm your app's UI can render Devanagari script correctly.)

## Guardrails to keep in mind while building

- **Ground everything in the dataset.** The prompt explicitly forbids inventing schemes or numbers — this is the main defense against hallucination. Don't remove that instruction under time pressure.
- **Pre-test with fixed profiles before the demo.** LLM output can vary slightly between calls; for your live demo, use the same 2-3 profiles you tested during Day 5 rather than improvising with the judges' own details, so you know the output is good.
- **Low-confidence matches are a feature, not a bug.** Showing "medium" or "low" confidence with an honest caveat is more credible to judges than a wall of "high confidence" matches for everything.
- **Double-check figures before demo day.** The dataset flags this too, but especially for numbers you say out loud in the pitch (subsidy percentages, rupee amounts), do one quick pass against the official links first.
