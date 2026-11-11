"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { Mascot } from "@/components/mascot/Mascot";
import { MASCOT_STATE_LABEL, type MascotState } from "@/components/mascot/sprite";
import AICitations from "@/components/vendor/kokonutui/ai-citations";
import { TextEffect } from "@/components/vendor/motion-primitives/text-effect";
import ThoughtLine from "@/components/vendor/react-bits/ThoughtLine";
import { matchQuestion } from "@/features/agent/match";
import { runScript } from "@/features/agent/run";
import { QUESTIONS } from "@/features/agent/script";
import type { RunFrame, ScriptedQuestion } from "@/features/agent/types";
import { useReducedMotion } from "@/features/prefs/use-prefs";
import { cn } from "@/lib/utils";

type Conversation =
  | { kind: "empty" }
  | { kind: "unknown"; input: string }
  | { kind: "run"; question: ScriptedQuestion; frame: RunFrame };

const CHIP_DOT: Record<MascotState, string> = {
  idle: "bg-ok",
  thinking: "bg-star",
  reading: "bg-cyan",
  debugging: "bg-destructive",
};

function StatusChip({ state }: { state: MascotState }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-3 py-1.5 font-pixel text-base text-white">
      <span aria-hidden="true" className={cn("size-2.5", CHIP_DOT[state])} />
      <span className="first-letter:uppercase">{MASCOT_STATE_LABEL[state]}</span>
    </span>
  );
}

export function AgentConsole({ title, lead }: { title: string; lead: string }) {
  const [conversation, setConversation] = useState<Conversation>({ kind: "empty" });
  const [input, setInput] = useState("");
  const controller = useRef<AbortController | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => () => controller.current?.abort(), []);

  function ask(question: ScriptedQuestion) {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    runScript(question, {
      signal: current.signal,
      speed: reducedMotion ? 0 : 1,
      onFrame: (frame) => setConversation({ kind: "run", question, frame }),
    }).catch(() => {
      // Aborted because a newer question replaced this one.
    });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    const question = matchQuestion(text, QUESTIONS);
    if (question) {
      ask(question);
    } else {
      controller.current?.abort();
      setConversation({ kind: "unknown", input: text });
    }
  }

  const mascot: MascotState = conversation.kind === "run" ? conversation.frame.mascot : "idle";
  const answered = conversation.kind === "run" && conversation.frame.finished;
  const frameSteps = conversation.kind === "run" ? conversation.frame.steps : [];
  const running = frameSteps.find((step) => step.status === "running");
  const started = frameSteps.filter((step) => step.status !== "pending");

  return (
    <section aria-label="Presentación" className="flex flex-col gap-7">
      <div className="flex items-end gap-4">
        <Mascot state={mascot} size={92} decorative />
        <StatusChip state={mascot} />
      </div>

      <div className="flex flex-col gap-4">
        <TextEffect
          as="h1"
          per="word"
          preset="fade-in-blur"
          speedReveal={1.6}
          className="max-w-[17ch] font-display text-[clamp(2.4rem,6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
        >
          {title}
        </TextEffect>
        <p className="max-w-[58ch] text-lg text-muted-foreground">{lead}</p>
      </div>

      <form onSubmit={submit} className="flex max-w-2xl flex-col gap-3">
        <label htmlFor="agent-input" className="font-medium">
          Pregunta al agente por mi trabajo
        </label>
        <div className="flex items-center gap-2 rounded-2xl border border-input bg-card p-2 shadow-[0_1px_0_rgb(0_0_0/0.04),0_12px_32px_-18px_rgb(20_22_27/0.35)] focus-within:border-foreground">
          <input
            id="agent-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Por ejemplo: ¿cómo evalúas un RAG?"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-base outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="shrink-0 cursor-pointer rounded-xl bg-brand px-4 py-2.5 font-semibold text-brand-foreground transition-transform active:scale-[0.97]"
          >
            Preguntar
          </button>
        </div>
        <ul aria-label="Preguntas sugeridas" className="flex flex-wrap gap-2">
          {QUESTIONS.map((question) => (
            <li key={question.id}>
              <button
                type="button"
                onClick={() => {
                  setInput(question.prompt);
                  ask(question);
                }}
                className="cursor-pointer rounded-full border bg-card px-3.5 py-1.5 text-sm transition-colors hover:border-foreground"
              >
                {question.prompt}
              </button>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Las respuestas están preparadas a partir del contenido de este sitio: todavía no hay un
          modelo detrás.
        </p>
      </form>

      <div aria-live="polite" className="flex max-w-2xl flex-col gap-4 empty:hidden">
        {conversation.kind === "unknown" ? (
          <p className="rounded-2xl border bg-card p-4">
            No tengo una respuesta preparada para «{conversation.input}». Prueba con una de las
            preguntas sugeridas.
          </p>
        ) : null}
        {conversation.kind === "run" ? (
          <>
            <ThoughtLine
              key={conversation.question.id}
              working={!answered}
              label={`${running?.label ?? "Trabajando"}…`}
              doneLabel="Resuelto en"
              steps={started.map((step) => step.label)}
              collapseOnSettle
              glyph="sparkle"
              color="var(--muted-foreground)"
              glyphColor="var(--brand)"
              fontSize={16}
            />
            {answered ? (
              <div className="rounded-2xl border bg-card p-5 text-[1.0625rem] leading-relaxed">
                <AICitations
                  className="max-w-none"
                  parts={conversation.question.answer}
                  sources={conversation.question.sources}
                />
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
