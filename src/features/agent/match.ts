import type { ScriptedQuestion } from "./types";

/** Lowercases and strips accents so "Evaluación" matches "evaluacion". */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Routes free text to the scripted question that shares most keywords with it.
 * Returns null when nothing matches, so the UI can say so instead of guessing.
 */
export function matchQuestion(
  input: string,
  questions: readonly ScriptedQuestion[],
): ScriptedQuestion | null {
  const words = new Set(normalize(input).split(" ").filter(Boolean));
  if (words.size === 0) return null;

  let best: ScriptedQuestion | null = null;
  let bestScore = 0;
  for (const question of questions) {
    const score = question.keywords.filter((keyword) => words.has(normalize(keyword))).length;
    if (score > bestScore) {
      best = question;
      bestScore = score;
    }
  }
  return best;
}
