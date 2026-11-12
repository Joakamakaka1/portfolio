# 0001 · Next.js 16 with the App Router

Status: accepted (2026-11-11)

## Context

The site is mostly static content with a lot of client-side animation. It needs good SEO,
per-page metadata and social images, and it should be able to grow a server endpoint later
(a real chat backend; see ADR 0006). The component libraries chosen for the design are
distributed through the shadcn CLI and target React 19 with Tailwind.

Options considered:

- **Astro with React islands.** The lightest HTML, but page-wide effects (cursor trails,
  shared agent state, transitions between sections) cut across islands.
- **Vite with React Router and prerendering.** No server magic, but metadata, social
  images and a future endpoint would be assembled by hand.
- **Next.js 16 with the App Router.** Static generation by default, metadata and image
  routes built in, and the environment where shadcn-based libraries are most exercised.

## Decision

Use Next.js 16 with the App Router, React 19, TypeScript in strict mode and Tailwind 4.
Pages are Server Components; a file becomes a Client Component only when it needs state,
effects or a browser API.

## Consequences

- Deployment targets Vercel, where the current domain already points.
- Heavy client-only code (three.js, canvas effects) is loaded with `next/dynamic` and
  `ssr: false` so it stays out of the initial bundle.
- The framework moves fast: `AGENTS.md` tells agents to read the docs shipped in
  `node_modules/next/dist/docs` instead of relying on memory.
