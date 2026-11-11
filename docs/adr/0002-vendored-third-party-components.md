# 0002 · Third-party components are vendored

Status: accepted (2026-11-11)

## Context

The design uses components from React Bits, Animate UI, Motion Primitives and KokonutUI.
None of them is an npm package: each is source code copied into the project with the shadcn
CLI. Copied code tends to get edited in place, after which nobody can tell what came from
upstream, and it does not follow this repository's lint rules.

## Decision

- Copied components live under `src/components/vendor/<library>/`.
- They are excluded from Biome (lint, format and import sorting) so a diff against
  upstream stays clean.
- They are not edited. Our code wraps them. When an edit is unavoidable (a bug, an
  accessibility problem, an import path), it is listed in `THIRD_PARTY_NOTICES.md`.
- Only components that are actually used stay in the repository.
- Paid components are not used.

## Consequences

- Updating a component means re-running the CLI and reapplying the few listed changes.
- TypeScript still checks vendor files, so an incompatible update fails `pnpm typecheck`.
- Vendor components bring their own dependencies (gsap, three, motion). Each one is loaded
  only where its component is used.
- Licences differ per library (two use MIT with the Commons Clause) and are recorded in
  `THIRD_PARTY_NOTICES.md`.
