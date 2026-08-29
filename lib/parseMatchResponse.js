/**
 * Strips markdown code fences from a string, then parses it as JSON.
 * Validates that the result has the expected { matches: [...] } shape.
 *
 * @param {string} rawText - Raw text returned by the Gemini API.
 * @returns {{ matches: Array, notes_for_farmer: string|null }}
 * @throws {Error} if the text cannot be parsed or the shape is invalid.
 */
export function parseMatchResponse(rawText) {
  // Defensively strip markdown code fences regardless of the prompt instruction.
  // Handles: ```json ... ```, ``` ... ```, and leading/trailing whitespace.
  let cleaned = rawText.trim();

  // Remove opening fence: ```json or ```
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
  // Remove closing fence: ```
  cleaned = cleaned.replace(/\s*```\s*$/, "");

  cleaned = cleaned.trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(
      `Failed to parse LLM response as JSON. Raw text was: ${rawText.slice(0, 300)}`
    );
  }

  // Shape validation: matches must exist and be an array.
  if (!parsed || !Array.isArray(parsed.matches)) {
    throw new Error(
      `LLM response JSON is missing the expected 'matches' array. Got: ${JSON.stringify(parsed).slice(0, 300)}`
    );
  }

  // Validate each match has the required fields; drop malformed entries rather than crashing.
  const requiredFields = ["scheme_id", "scheme_name", "why_you_qualify", "what_you_get", "next_step", "confidence"];
  const validMatches = parsed.matches.filter((m) => {
    return requiredFields.every((field) => typeof m[field] === "string" && m[field].length > 0);
  });

  return {
    matches: validMatches,
    notes_for_farmer: parsed.notes_for_farmer ?? null,
  };
}
