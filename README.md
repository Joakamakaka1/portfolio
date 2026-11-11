# Portfolio · Joaquín Castro Salas

Personal portfolio of a full stack AI developer (LLMs, agents and quality evaluation).

The first screen is a collage: a plate of an octopus read as an agent and its tools. Under
it the story is told in five steps that stay in place while the page scrolls. The projects
have a page of their own: numbered columns, each of which opens over the whole page. Every
picture is a paper collage built from public-domain prints.

| Route               | What it is                                                              |
| ------------------- | ----------------------------------------------------------------------- |
| `/`                 | The collage and the story. `/#ahora` opens the story at that step.      |
| `/proyectos`        | The projects as columns.                                                |
| `/proyectos/[slug]` | The same board with one project open: problem, approach, figures, stack. |
| `/creditos`         | The prints the collages are cut from, with their sources.               |

## Run it locally

Requirements: Node 24 and pnpm 11.

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:3000>.

## Checks

| Command          | What it does                                                    |
| ---------------- | --------------------------------------------------------------- |
| `pnpm check`     | Everything below except the end-to-end tests, in order          |
| `pnpm lint`      | Biome: lint, format and import order                            |
| `pnpm typecheck` | Generates route types and runs `tsc`                            |
| `pnpm test`      | Unit tests (Vitest), the collage kit included                   |
| `pnpm build`     | Production build                                                |
| `pnpm test:e2e`  | Playwright on desktop and mobile, with axe accessibility checks |

`pnpm test:e2e` needs the browser once: `pnpm exec playwright install chromium`. It runs
against the dev server; with `CI=1` it runs against the production build (`pnpm build` first),
which is the only way to check a project page without JavaScript.

A pre-commit hook (lefthook) formats staged files, and a commit-msg hook enforces
[Conventional Commits](https://www.conventionalcommits.org). CI runs the same checks plus a
secret scan; see [.github/workflows/ci.yml](.github/workflows/ci.yml).

## How it is organised

```
src/
  app/                  Routes (App Router)
    _components/        The first screen
    proyectos/          The projects board and, under [slug], one project open
    creditos/           Credits of the prints
  content/              The site content as typed data, validated with Zod
  features/
    story/              The story that stays in place while the page scrolls
    projects/           The board of projects: columns that open over the page
    prefs/              Theme preference, applied before first paint
  components/
    collage/            A collage as a stack of pieces that answers the pointer
    site/               Header, footer and small shared pieces
    vendor/             Third-party components, as they came
scripts/collage/        Builds the pieces of every collage
public/collage/         The built pieces
e2e/                    End-to-end and accessibility tests
docs/adr/               Architecture decision records
```

### Content

Everything the site says lives in [`src/content`](src/content). Each file is parsed against
its schema when imported, so a typo or a missing field fails the build instead of reaching
the page. Project claims come from each project's own repository; nothing is added that
the repository does not back. The story is written in [`story.ts`](src/content/story.ts):
a title and a few lines per step.

### Collages

A collage is not a drawing: it is built from scans of old prints, the way one is made by
hand.

- [`scripts/collage/kit.mjs`](scripts/collage/kit.mjs) holds the operations: cut a figure
  out of its page, tear an edge, age a sheet of paper, reprint in one or two inks, screen
  through dots, slip the rows. They are plain functions over pixels, seeded and unit tested.
- A recipe per collage ([`scripts/collage/recipes`](scripts/collage/recipes)) turns prints
  into pieces, written to `public/collage`.
- Where each piece sits is content: [`src/content/collages.json`](src/content/collages.json).
- [`Collage`](src/components/collage/Collage.tsx) stacks the pieces as real layers, so they
  overlap, cast shadows and drift apart by depth when the pointer moves. To a screen reader
  it is one picture with one description.

```bash
pnpm collage                  # build every piece (downloads what is missing)
pnpm collage hero             # only that collage
pnpm collage hero --preview   # also flatten it to a PNG, to look at it
```

The prints are public-domain works from Wikimedia Commons, recorded in
[`src/content/artwork.json`](src/content/artwork.json) with title, author, year, licence and
source file. Originals stay in a cache outside the repository; only the built pieces are
committed.

### The story

[`src/features/story`](src/features/story) pins a stage to the screen and lets the scroll
choose which step is on it:

- `steps.ts` is the rule, with no React and no DOM: given where each step's stretch of
  scroll starts on the screen, which step is on show. It is unit tested.
- `Story.tsx` follows the scroll and marks one step as active. The steps themselves are
  server components passed in as props, so the content is static HTML, and all of them stay
  in the document: a screen reader reads the whole story, focus brings a hidden step on, and
  without JavaScript the steps are plain sections.
- `story.css` does the pinning with `position: sticky`; no scroll is hijacked.

Each step has an anchor, so `/#ahora` opens the story there.

### The projects board

[`src/features/projects`](src/features/projects) shows the projects as columns. Picking one
opens it over the whole board; the way back closes it.

- Which project is open is the URL: `/proyectos` is the board, `/proyectos/<slug>` a
  project. Both are real routes that render the same screen (`board.ts` holds that rule
  and is unit tested).
- With JavaScript the links only change the URL in place, so the columns stay mounted and
  slide instead of the page being replaced. Reloads, shared links, the back button and the
  no-JavaScript fallback work because the routes are real.

See [ADR 0009](docs/adr/0009-scroll-story-and-projects-board.md).

### Third-party components

Components from React Bits and Motion Primitives are copied into `src/components/vendor`,
left as they came and wrapped from our own code. What each one is used for and its licence
are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md); the policy is
[ADR 0002](docs/adr/0002-vendored-third-party-components.md).

## Decisions

- [0001 · Next.js 16 with the App Router](docs/adr/0001-nextjs-app-router.md)
- [0002 · Third-party components are vendored](docs/adr/0002-vendored-third-party-components.md)
- [0003 · Content is typed data](docs/adr/0003-content-as-typed-data.md)
- [0004 · Site in Spanish, repository in English](docs/adr/0004-site-in-spanish.md)
- [0005 · Two prototypes before choosing a direction](docs/adr/0005-two-prototypes-before-choosing.md) (superseded by 0007)
- [0006 · A scripted agent before a real one](docs/adr/0006-scripted-agent-first.md) (superseded by 0007)
- [0007 · The site is an observation notebook](docs/adr/0007-observation-notebook.md) (superseded by 0009)
- [0008 · Layered collage, a plain type pair and a notebook that tells a story](docs/adr/0008-natural-history-collage.md) (amended by 0009)
- [0009 · A story told by the scroll and a board of projects](docs/adr/0009-scroll-story-and-projects-board.md)

## Licence

Source code under the [MIT License](LICENSE). The written content and the personal data are
not: they are © Joaquín Castro Salas, all rights reserved. The prints the collages are made
from are in the public domain.
