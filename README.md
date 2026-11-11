# Portfolio · Joaquín Castro Salas

Personal portfolio of a full stack AI developer (LLMs, agents and quality evaluation).

The first screen is a collage: a plate of an octopus read as an agent and its tools. Under
it a notebook lies on a desk; it opens, its pages turn and it tells the story in ten short
pages. Each project also has a file of its own. Every picture is a paper collage built from
public-domain prints.

| Route               | What it is                                                           |
| ------------------- | -------------------------------------------------------------------- |
| `/`                 | The collage and the notebook. `/#proyectos` opens it at that page.   |
| `/proyectos/[slug]` | The file of one project: problem, approach, figures and stack.       |
| `/creditos`         | The prints the collages are cut from, with their sources.            |

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

`pnpm test:e2e` needs the browser once: `pnpm exec playwright install chromium`.

A pre-commit hook (lefthook) formats staged files, and a commit-msg hook enforces
[Conventional Commits](https://www.conventionalcommits.org). CI runs the same checks plus a
secret scan; see [.github/workflows/ci.yml](.github/workflows/ci.yml).

## How it is organised

```
src/
  app/                  Routes (App Router)
    _components/        The first screen and the pages of the notebook
    proyectos/[slug]/   The file of each project
    creditos/           Credits of the prints
  content/              The site content as typed data, validated with Zod
  features/
    notebook/           The notebook: a pure model, the component and its styles
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
the repository does not back. The notebook is written in [`story.ts`](src/content/story.ts):
a title and a few lines per page.

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

### The notebook

[`src/features/notebook`](src/features/notebook) has three parts:

- `book.ts` is the model, with no React and no DOM: faces, leaves, which faces show for a
  given number of turned leaves, and which face a URL fragment names. It is unit tested.
- `Notebook.tsx` decides which faces are showing. The pages themselves are server
  components passed in as props, so the content is static HTML.
- `notebook.css` draws it. From 1024px up it is a book whose leaves turn in 3D, two pages
  at a time; below that the same markup is a horizontal pager. In both, an index lays every
  page out as a grid, and the pages travel there with a view transition.

A page sets its font size from its own width and everything inside it is sized in `em`, so
a page scales like a picture: the thumbnails of the index are the real pages, smaller.

The page on show is mirrored in the URL fragment, which makes every page linkable. Pages
that are not showing are `inert` in book mode, and without JavaScript all of them are still
in the document. See ADRs [0007](docs/adr/0007-observation-notebook.md) and
[0008](docs/adr/0008-natural-history-collage.md).

### Third-party components

Components from React Bits, Motion Primitives and KokonutUI are copied into
`src/components/vendor`, left as they came and wrapped from our own code. What each one is
used for, its licence and the one local change are in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md); the policy is
[ADR 0002](docs/adr/0002-vendored-third-party-components.md).

## Decisions

- [0001 · Next.js 16 with the App Router](docs/adr/0001-nextjs-app-router.md)
- [0002 · Third-party components are vendored](docs/adr/0002-vendored-third-party-components.md)
- [0003 · Content is typed data](docs/adr/0003-content-as-typed-data.md)
- [0004 · Site in Spanish, repository in English](docs/adr/0004-site-in-spanish.md)
- [0005 · Two prototypes before choosing a direction](docs/adr/0005-two-prototypes-before-choosing.md) (superseded by 0007)
- [0006 · A scripted agent before a real one](docs/adr/0006-scripted-agent-first.md) (superseded by 0007)
- [0007 · The site is an observation notebook](docs/adr/0007-observation-notebook.md) (look superseded by 0008)
- [0008 · Layered collage, a plain type pair and a notebook that tells a story](docs/adr/0008-natural-history-collage.md)

## Licence

Source code under the [MIT License](LICENSE). The written content and the personal data are
not: they are © Joaquín Castro Salas, all rights reserved. The prints the collages are made
from are in the public domain.
