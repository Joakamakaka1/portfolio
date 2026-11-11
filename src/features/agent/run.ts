import type { RunFrame, ScriptedQuestion, StepStatus } from "./types";

export type Wait = (ms: number, signal: AbortSignal) => Promise<void>;

/** Resolves after `ms`, or rejects as soon as the signal aborts. */
export const waitFor: Wait = (ms, signal) =>
  new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(signal.reason);
    }
    signal.addEventListener("abort", onAbort, { once: true });
  });

function frameAt(question: ScriptedQuestion, running: number): RunFrame {
  const finished = running >= question.steps.length;
  return {
    steps: question.steps.map((step, index) => {
      let status: StepStatus = "pending";
      if (index < running) status = "done";
      else if (index === running) status = "running";
      return { id: step.id, label: step.label, status, detail: step.detail };
    }),
    mascot: finished ? "idle" : question.steps[running].mascot,
    finished,
  };
}

/**
 * Plays a scripted question step by step, reporting a frame before each step
 * and a final one when the answer is ready. Rejects if the signal aborts.
 * `speed` scales the pauses: 0 skips them (used for reduced motion and tests).
 */
export async function runScript(
  question: ScriptedQuestion,
  options: {
    onFrame: (frame: RunFrame) => void;
    signal: AbortSignal;
    speed?: number;
    wait?: Wait;
  },
): Promise<void> {
  const { onFrame, signal, speed = 1, wait = waitFor } = options;
  for (let index = 0; index < question.steps.length; index += 1) {
    signal.throwIfAborted();
    onFrame(frameAt(question, index));
    await wait(question.steps[index].durationMs * speed, signal);
  }
  signal.throwIfAborted();
  onFrame(frameAt(question, question.steps.length));
}
