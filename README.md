# Portfolio · Joaquín Castro Salas

Personal portfolio of a full stack AI developer (LLMs, agents and quality evaluation).

> **Status: choosing a direction.** Two prototypes with the same content and a different
> visual concept live side by side. One of them will become the site; the other will be
> removed. See [ADR 0005](docs/adr/0005-two-prototypes-before-choosing.md).

| Route           | Prototype               | Idea                                                                 |
| --------------- | ----------------------- | -------------------------------------------------------------------- |
| `/proto/agente` | A · Agent workspace     | The site behaves like an agent UI: ask, watch the steps, get an answer with citations. |
| `/proto/cosmos` | B · Illustrated cosmos  | Large type over a live background, with projects as a collection of covers. |

Both share a floating bar to switch prototype, theme (light or dark) and mascot (pixel art
or soft vector).

## Run it locally

Requirements: Node 24 and pnpm 11.

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:3000>.

## Checks

| Command         | What it does                                                    |
| --------------- | --------------------------------------------------------------- |
| `pnpm check`    | Everything below except the end-to-end tests, in order           |
| `pnpm lint`     | Biome: lint, format and import order                            |
| `pnpm typecheck`| Generates route types and runs `tsc`                            |
| `pnpm test`     | Unit tests (Vitest)                                             |
| `pnpm build`    | Production build                                                |
| `pnpm test:e2e` | Playwright on desktop and mobile, with axe accessibility checks |

`pnpm test:e2e` needs the browser once: `pnpm exec playwright install chromium`.

A pre-commit hook (lefthook) formats staged files, and a commit-msg hook enforces
[Conventional Commits](https://www.conventionalcommits.org). CI runs the same checks plus a
secret scan; see [.github/workflows/ci.yml](.github/workflows/ci.yml).

## How it is organised

```
src/
  app/                  Routes (App Router). Prototype-only components sit next to their page.
    proto/agente/       Prototype A
    proto/cosmos/       Prototype B
  content/              The site content as typed data, validated with Zod
  features/
    agent/              Scripted agent: question matching and step-by-step runs
    cosmos/             Generated SVG artwork (project covers, mascot badge)
    prefs/              Theme and mascot preferences, applied before first paint
  components/
    mascot/             The mascot in two drawings, with shared states
    proto/              Pieces that exist only while the prototypes are compared
    site/               Small shared pieces
    vendor/             Third-party components, copied in and left as they came
e2e/                    End-to-end and accessibility tests
docs/adr/               Architecture decision records
```

### Content

Everything the site says lives in [`src/content`](src/content). Each file is parsed against
its schema when imported, so a typo or a missing field fails the build instead of reaching
the page. Project claims come from each project's own repository; nothing is added that
the repository does not back.

### The agent is scripted

Prototype A answers from a script, not from a model, and says so on the page. The script
engine in [`src/features/agent`](src/features/agent) defines the contract (question in,
steps reported, answer with cited sources) that a real LLM backend will have to meet. See
[ADR 0006](docs/adr/0006-scripted-agent-first.md).

### Third-party components

Components from React Bits, Animate UI, Motion Primitives and KokonutUI are copied into
[`src/components/vendor`](src/components/vendor) through the shadcn CLI and are not edited,
linted or formatted. The few local changes, and every licence, are listed in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). See
[ADR 0002](docs/adr/0002-vendored-third-party-components.md).

## Decisions

- [0001 · Next.js 16 with the App Router](docs/adr/0001-nextjs-app-router.md)
- [0002 · Third-party components are vendored](docs/adr/0002-vendored-third-party-components.md)
- [0003 · Content is typed data](docs/adr/0003-content-as-typed-data.md)
- [0004 · Site in Spanish, repository in English](docs/adr/0004-site-in-spanish.md)
- [0005 · Two prototypes before choosing a direction](docs/adr/0005-two-prototypes-before-choosing.md)
- [0006 · A scripted agent before a real one](docs/adr/0006-scripted-agent-first.md)

## Licence

Source code under the [MIT License](LICENSE). The written content, the mascot and the
personal data are not: they are © Joaquín Castro Salas, all rights reserved.
