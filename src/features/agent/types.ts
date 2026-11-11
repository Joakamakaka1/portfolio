import type { MascotState } from "@/components/mascot/sprite";

/**
 * The portfolio "agent" answers from a script, not from a model. These types
 * are the contract a real LLM backend will have to meet when it replaces the
 * script: a question comes in, steps are reported while it works, and the
 * answer arrives as text fragments that cite their sources.
 */

export type Source = {
  id: string;
  title: string;
  url: string;
  site?: string;
  snippet?: string;
};

export type AnswerPart = {
  text: string;
  /** Ids of the sources that back this fragment. */
  cite?: string[];
};

export type ScriptStep = {
  id: string;
  label: string;
  /** Log lines shown under the step while it runs. */
  detail: string[];
  /** What the mascot does during this step. */
  mascot: MascotState;
  durationMs: number;
};

export type ScriptedQuestion = {
  id: string;
  /** The question as shown on its suggestion chip. */
  prompt: string;
  /** Words that route free text to this question; compared without accents or case. */
  keywords: string[];
  steps: ScriptStep[];
  answer: AnswerPart[];
  sources: Source[];
};

export type StepStatus = "pending" | "running" | "done";

export type RunFrame = {
  steps: { id: string; label: string; status: StepStatus; detail: string[] }[];
  mascot: MascotState;
  finished: boolean;
};
