# 0004 · Site in Spanish, repository in English

Status: accepted (2026-11-11)

## Context

The site could be published in Spanish, in English or in both. Two languages double the
copy to maintain and add routing and metadata work. The repository itself is read by
developers and by coding agents.

## Decision

The site is published in Spanish only (`<html lang="es">`, no locale routing). Code,
comments, commit messages and documentation are written in English.

## Consequences

- No internationalisation layer. Copy sits directly in `src/content`.
- Vendor components that ship English strings need a Spanish label passed in, a wrapper,
  or a different component. One was replaced for this reason.
- Adding English later means introducing locale routing and a second set of content files;
  the content schemas are already separate from the components, which keeps that change
  contained.
