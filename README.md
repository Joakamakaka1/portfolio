# Portfolio · Joaquín Castro Salas

Personal portfolio of a full stack AI developer (LLMs, agents and quality evaluation).

The home page is a desk with a notebook on it. The notebook opens and its pages turn: who
I am, what I do, where I have worked and what I have built. Each project also has a page of
its own. The look is a paper collage of public-domain engravings over flat colour.

| Route               | What it is                                                         |
| ------------------- | ------------------------------------------------------------------ |
| `/`                 | The desk and the notebook. `/#proyectos` opens it at that page.     |
| `/proyectos/[slug]` | The file of one project: problem, approach, figures and stack.      |

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
| `pnpm test`      | Unit tests (Vitest)                                             |
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
    _components/        The pages of the notebook and what lies on the desk
    proyectos/[slug]/   The file of each project
  assets/artwork/       Engravings, already processed (see "Artwork")
  content/              The site content as typed data, validated with Zod
  features/
    notebook/           The notebook: a pure model, the component and its styles
    prefs/              Theme preference, applied before first paint
  components/
    collage/            Engravings as components
    site/               Header, footer and small shared pieces
scripts/artwork.mjs     Downloads and prepares the engravings
e2e/                    End-to-end and accessibility tests
docs/adr/               Architecture decision records
```

### Content

Everything the site says lives in [`src/content`](src/content). Each file is parsed against
its schema when imported, so a typo or a missing field fails the build instead of reaching
the page. Project claims come from each project's own repository; nothing is added that
the repository does not back.

### The notebook

[`src/features/notebook`](src/features/notebook) has three parts:

- `book.ts` is the model, with no React and no DOM: faces, leaves, which faces show for a
  given number of turned leaves, and which face a URL fragment names. It is unit tested.
- `Notebook.tsx` decides which faces are showing. The pages themselves are server
  components passed in as props, so the content is static HTML.
- `notebook.css` draws it. From 1024px up it is a book whose leaves turn in 3D, two pages
  at a time; below that the same markup is a horizontal pager, one page at a time.

A page sets its font size from its own width and everything inside it is sized in `em`, so
a page scales like a picture: content that fits at one size fits at every size.

The page on show is mirrored in the URL fragment, which makes every page linkable. Pages
that are not showing are `inert` in book mode, and without JavaScript all of them are still
in the document. See [ADR 0007](docs/adr/0007-observation-notebook.md).

### Artwork

The engravings are public-domain works from Wikimedia Commons.
[`src/content/artwork.json`](src/content/artwork.json) records each one (title, author,
year, licence and source file), and the last page of the notebook and
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) are written from it.

```bash
pnpm artwork           # download what is missing and rebuild every image
pnpm artwork cygnus    # only that entry
```

The script keeps the originals in a cache folder outside the repository and writes small
WebP files to `src/assets/artwork`. Line engravings become black ink on a transparent
background, so they can sit on any colour block; coloured plates are only cropped.

### Third-party components

No third-party component is in use right now. The policy for adding one (copy it into
`src/components/vendor`, leave it as it came, record its licence) is in
[ADR 0002](docs/adr/0002-vendored-third-party-components.md).

## Decisions

- [0001 · Next.js 16 with the App Router](docs/adr/0001-nextjs-app-router.md)
- [0002 · Third-party components are vendored](docs/adr/0002-vendored-third-party-components.md)
- [0003 · Content is typed data](docs/adr/0003-content-as-typed-data.md)
- [0004 · Site in Spanish, repository in English](docs/adr/0004-site-in-spanish.md)
- [0005 · Two prototypes before choosing a direction](docs/adr/0005-two-prototypes-before-choosing.md) (superseded by 0007)
- [0006 · A scripted agent before a real one](docs/adr/0006-scripted-agent-first.md) (superseded by 0007)
- [0007 · The site is an observation notebook](docs/adr/0007-observation-notebook.md)

## Licence

Source code under the [MIT License](LICENSE). The written content and the personal data are
not: they are © Joaquín Castro Salas, all rights reserved. The engravings are in the public
domain.
