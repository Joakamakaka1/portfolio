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

### The notebook

- Read [ADR 0007](docs/adr/0007-observation-notebook.md) before changing
  `src/features/notebook`. The rules of the book live in `book.ts`, without React; add a
  unit test when you change them.
- Inside a notebook page (`src/app/_components/pages.tsx`) size everything in `em`. A page
  takes its font size from its own width; `rem` and `px` break that.
- A page does not scroll and does not grow in book mode. After changing its copy, open it
  at 1280×720 and check that nothing is clipped; split the page if it no longer fits.
- The number of faces after the cover stays even.
- Links to a notebook page from the home page are plain `<a href="#id">`, not `<Link>`:
  the notebook follows the browser's `hashchange`.

### Artwork

- Pictures are public-domain works only. Each one has an entry in
  `src/content/artwork.json` with its Commons file, author, year and licence, and a row in
  `THIRD_PARTY_NOTICES.md`.
- Do not commit originals. Add the entry, run `pnpm artwork <id>` and commit the file it
  writes to `src/assets/artwork`, then add it to `src/components/collage/files.ts`.
- There is no mascot. Do not add one, or a photo of the owner, without being asked.

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
- The theme is a class on `<html>` set before first paint
  (`src/features/prefs/prefs.ts`). Do not read it from `localStorage` during render.

### Checks

- Run `pnpm check` before committing and `pnpm test:e2e` when a page changes.
- New logic comes with unit tests next to it (`*.test.ts`).
- Commits follow Conventional Commits; the hook rejects anything else.

### Boundaries

- Do not push, open pull requests, deploy or merge without the owner's explicit approval.
