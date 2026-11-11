<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules

Personal portfolio of Joaquín Castro Salas. Read [README.md](README.md) for the layout and
[docs/adr](docs/adr) before changing a decision recorded there.

### Language

- Site content is in Spanish only. Code, comments, commits and docs are in English.

### Content

- All copy lives in `src/content` and is validated with Zod. Do not hard-code copy that
  belongs there.
- A claim about a project must be backed by that project's repository. Do not round up,
  extrapolate or invent figures.
- Never link to a private repository or show personal details of its users. Twochi is
  private.
- Work for Air Europa is mentioned as in `src/content/profile.ts`: the employer and the
  role, never internal projects or the tools used there.

### Third-party components

- Files under `src/components/vendor` are copied from other projects. Do not edit, lint or
  format them. If an edit is unavoidable, record it in `THIRD_PARTY_NOTICES.md`.
- Wrap a vendor component from your own code instead of changing it.
- Add one with `pnpm dlx shadcn@latest add <registry item>`, then move it to
  `src/components/vendor/<library>/` and fix its import paths.
- Do not add paid ("Pro") components.

### Motion and accessibility

- Anything that moves on its own must stop under `prefers-reduced-motion`; see
  `useReducedMotion` in `src/features/prefs/use-prefs.ts`.
- WebGL and canvas effects load with `next/dynamic` and `ssr: false`, and never carry
  content.
- Theme and mascot are attributes on `<html>` set before first paint
  (`src/features/prefs/prefs.ts`). Do not read them from `localStorage` during render.

### Checks

- Run `pnpm check` before committing and `pnpm test:e2e` when a page changes.
- New logic comes with unit tests next to it (`*.test.ts`).
- Commits follow Conventional Commits; the hook rejects anything else.

### Boundaries

- Do not push, open pull requests, deploy or merge without the owner's explicit approval.
