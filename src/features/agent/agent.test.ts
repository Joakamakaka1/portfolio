import { describe, expect, it } from "vitest";
import { matchQuestion, normalize } from "./match";
import { runScript, type Wait } from "./run";
import { QUESTIONS } from "./script";
import type { RunFrame } from "./types";

const instant: Wait = () => Promise.resolve();

describe("normalize", () => {
  it("drops accents, case and punctuation", () => {
    expect(normalize("¿Cómo EVALÚAS un RAG?")).toBe("como evaluas un rag");
  });
});

describe("matchQuestion", () => {
  it.each([
    ["enséñame tus proyectos", "proyectos"],
    ["¿Cómo haces la evaluación de calidad?", "evaluacion"],
    ["qué stack usas, python o typescript", "stack"],
    ["quiero contactar por correo", "contacto"],
  ])("routes %j to %s", (input, expected) => {
    expect(matchQuestion(input, QUESTIONS)?.id).toBe(expected);
  });

  it("returns null when nothing matches", () => {
    expect(matchQuestion("¿cuál es tu color favorito?", QUESTIONS)).toBeNull();
    expect(matchQuestion("   ", QUESTIONS)).toBeNull();
  });
});

describe("script", () => {
  it("only cites sources that the question declares", () => {
    for (const question of QUESTIONS) {
      const ids = new Set(question.sources.map((source) => source.id));
      for (const part of question.answer) {
        for (const cited of part.cite ?? []) {
          expect(ids.has(cited), `${question.id} cites ${cited}`).toBe(true);
        }
      }
    }
  });

  it("matches each question from its own prompt", () => {
    for (const question of QUESTIONS) {
      expect(matchQuestion(question.prompt, QUESTIONS)?.id).toBe(question.id);
    }
  });
});

describe("runScript", () => {
  const question = QUESTIONS[0];

  it("runs the steps in order and finishes idle", async () => {
    const frames: RunFrame[] = [];
    await runScript(question, {
      onFrame: (frame) => frames.push(frame),
      signal: new AbortController().signal,
      wait: instant,
    });

    expect(frames).toHaveLength(question.steps.length + 1);
    expect(frames[0].steps.map((step) => step.status)).toEqual(["running", "pending", "pending"]);
    expect(frames[1].steps.map((step) => step.status)).toEqual(["done", "running", "pending"]);
    const last = frames.at(-1);
    expect(last?.finished).toBe(true);
    expect(last?.mascot).toBe("idle");
    expect(last?.steps.every((step) => step.status === "done")).toBe(true);
  });

  it("scales the pauses with the speed", async () => {
    const waits: number[] = [];
    await runScript(question, {
      onFrame: () => {},
      signal: new AbortController().signal,
      speed: 0,
      wait: (ms) => {
        waits.push(ms);
        return Promise.resolve();
      },
    });
    expect(waits.every((ms) => ms === 0)).toBe(true);
  });

  it("stops when aborted", async () => {
    const controller = new AbortController();
    const frames: RunFrame[] = [];
    const run = runScript(question, {
      onFrame: (frame) => {
        frames.push(frame);
        controller.abort(new Error("stopped"));
      },
      signal: controller.signal,
    });
    await expect(run).rejects.toThrow("stopped");
    expect(frames).toHaveLength(1);
  });
});
