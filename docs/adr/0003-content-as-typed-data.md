# 0003 · Content is typed data

Status: accepted (2026-11-11)

## Context

The same content (profile, projects, experience) is rendered by more than one design, and
it will also feed the agent's answers. Copy scattered through components would drift, and
a portfolio must not state anything about a project that its repository does not back.

## Decision

All content lives in `src/content` as TypeScript data. Each collection has a Zod schema
and is parsed when the module is imported, so invalid content fails the build and the
tests. Rules that matter are encoded in the schema where possible; for example, a project
whose repository is private has no URL field at all, so it cannot be linked by mistake.

## Consequences

- Designs consume the same data, which makes prototypes comparable on design alone.
- Editing content needs no knowledge of the components.
- Long-form case studies are out of scope for now. If they are added, MDX files validated
  by the same schemas are the expected next step.
