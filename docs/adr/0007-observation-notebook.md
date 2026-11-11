# 0007 · The site is an observation notebook

Status: superseded by [0009](0009-scroll-story-and-projects-board.md), which removes the
notebook; its look had already been replaced by [0008](0008-natural-history-collage.md).
Accepted 2026-11-11. Superseded [0005](0005-two-prototypes-before-choosing.md) and
[0006](0006-scripted-agent-first.md).

## Context

The two prototypes of ADR 0005 were compared in the running app. The owner chose B,
"Illustrated cosmos", with two objections: it still read as a typical portfolio (a stack of
sections), and its look could be pushed further. He brought new references: an open
notebook as the place to explain who he is, what he does, his experience and his projects,
and paper collages of antique engravings over flat colour. He also dropped the mascot
until one is designed on its own.

## Decision

- **Prototype A and the scripted agent are removed**, with the mascots and the prototype
  switcher.
- **The home page is a desk with a notebook.** The notebook is the content: it opens and
  its pages turn. The astronomy of the cosmos prototype stays as the subject (the author
  observes systems and measures them), now through antique astronomical plates.
- **Collage of public-domain engravings.** Only works in the public domain, each recorded
  in `src/content/artwork.json` with its source. Originals are not committed; a script
  downloads and prepares them.
- **Two surfaces, one of them constant.** The desk changes with the theme (khaki by day,
  slate blue with stars by night). Paper and inks do not.
- **One piece of motion.** Opening the notebook and turning a page, which answers the
  visitor's action. Nothing else moves on its own except the stars of the dark theme.
- **Every page has a URL.** The page on show is kept in the fragment (`/#proyectos`), so
  links, the browser's reload and the project files can point at a page.
- **Projects keep a page outside the notebook** (`/proyectos/[slug]`) for the detail that
  does not fit a notebook page.

### How the notebook is built

- A model without React (`book.ts`) answers which faces show; the component only applies
  it. That keeps the rules testable without a browser.
- Pages are server components passed to the client component as props. The client bundle
  carries the turning logic, not the content.
- One markup, two presentations chosen in CSS: a 3D book from 1024px and a scroll-snap
  pager below. A real book needs two pages side by side, which a phone cannot show at a
  readable size.
- A page derives its font size from its width and its content is sized in `em`. Fixed
  pages would otherwise need a breakpoint per viewport height.
- Hidden pages are `inert` in book mode. The disabled state of the turn buttons is
  `aria-disabled`, because a `disabled` button drops the focus and the arrow keys with it.

## Consequences

- No third-party component is left. The vendoring policy of ADR 0002 still applies to any
  that is added, and `three`, `gsap`, `motion` and the icon packages are gone.
- Content has to fit a page. A page that grows needs to be split, as "Qué hago" was. The
  end-to-end tests run axe on open spreads, but they do not detect clipped text: check the
  page in the browser after changing copy.
- Adding a page means adding a face in `src/app/page.tsx`. The count of faces after the
  cover must stay even, so the last leaf has a board behind it.
- An LLM-backed assistant is no longer planned. If it returns, it is a new decision.
- The mascot is pending and has no place reserved in the layout.
