# 0005 · Two prototypes before choosing a direction

Status: accepted (2026-11-11). Will be superseded by the ADR that records the choice.

## Context

Two visual concepts fit the brief and the reference board, and a description is not enough
to choose between them:

- **A · Agent workspace.** The site behaves like the interface of an AI agent.
- **B · Illustrated cosmos.** Large type over a live background, projects as a collection.

The same question applies to the mascot: pixel art or soft vector.

## Decision

Build both concepts as real pages, `/proto/agente` and `/proto/cosmos`, with the same
content and sections, and both mascots. A floating bar switches prototype, theme and
mascot so every combination can be seen in the running app.

Code that exists only for the comparison is kept apart: the prototype pages with their
colocated components, and `src/components/proto`.

## Consequences

- The repository temporarily carries two designs and more vendor components than the
  final site will need.
- Once a direction is chosen: the other prototype, the unused mascot, the prototype bar
  and the vendor components that only the discarded design used are deleted, and the
  chosen page moves to `/`.
