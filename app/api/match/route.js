import { GoogleGenAI } from "@google/genai";
import { buildPrompt } from "../../../lib/buildPrompt";
import { parseMatchResponse } from "../../../lib/parseMatchResponse";

// POST /api/match
// Body (JSON): { state, landSize, farmerCategory, mainCrops, irrigationStatus, age, notes }
// Returns (JSON): { matches: [...], notes_for_farmer: string|null }
//               | { error: string } on failure
export async function POST(request) {
  // 1. Parse the incoming farmer profile from the request body.
  let farmerProfile;
  try {
    farmerProfile = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON in request body." }, { status: 400 });
  }

  // 2. Verify the API key is present (fail fast — never expose the key itself).
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "REPLACE_ME") {
    return Response.json(
      { error: "GEMINI_API_KEY is not configured. Set it in .env.local and restart the dev server." },
      { status: 500 }
    );
  }

  // 3. Build the prompt.
  const { systemPrompt, userMessage } = buildPrompt(farmerProfile);

  // 4. Call Gemini.
  let rawText;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `${systemPrompt}\n\n${userMessage}`,
    });
    rawText = response.text;
  } catch (err) {
    console.error("[YojanaSaathi] Gemini API error:", err);
    return Response.json(
      { error: "The AI service returned an error. Please try again." },
      { status: 502 }
    );
  }

  // 5. Parse and validate the JSON response.
  let parsed;
  try {
    parsed = parseMatchResponse(rawText);
  } catch (err) {
    console.error("[YojanaSaathi] Response parse error:", err.message);
    console.error("[YojanaSaathi] Raw LLM output:", rawText);
    return Response.json(
      {
        error:
          "The AI response could not be parsed. Please try again, or contact your local KVK or Common Service Centre for help.",
      },
      { status: 500 }
    );
  }

  // 6. Return the structured matches to the frontend.
  return Response.json(parsed, { status: 200 });
}
