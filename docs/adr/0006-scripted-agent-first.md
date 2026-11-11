# 0006 · A scripted agent before a real one

Status: accepted (2026-11-11)

## Context

Prototype A opens with a prompt where visitors ask about the author's work. Backing it
with an LLM means a recurring cost, a server-side key, rate limiting and guardrails
against abuse, and it would delay comparing the two designs.

## Decision

The agent answers from a script for now:

- `src/features/agent/script.ts` holds a few questions whose answers are assembled from
  `src/content`, each with the sources it cites.
- Free text is routed to a question by keyword overlap. When nothing matches, the page
  says it has no prepared answer instead of guessing.
- The page states that the answers are prepared and that no model is behind them.

The types in `src/features/agent/types.ts` are the contract for a future backend: a
question comes in, steps are reported while it works, and the answer arrives as fragments
that cite their sources.

## Consequences

- The site stays static and free to run.
- If prototype A is chosen, the real backend is a separate piece of work with its own
  evaluation set, cost measurement, rate limits and guardrails.
- If prototype B is chosen, `src/features/agent` is deleted with it.
