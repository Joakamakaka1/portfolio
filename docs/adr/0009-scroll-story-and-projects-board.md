# 0009 · A story told by the scroll and a board of projects

Status: accepted (2026-11-11). Supersedes [0007](0007-observation-notebook.md) and amends
[0008](0008-natural-history-collage.md): the collage, the inks and the type of 0008 stay;
its notebook goes.

## Context

The owner approved the collage direction of ADR 0008 and asked for a different structure:

- No notebook. The story should stay in place and change as the page scrolls, and the
  footer should not come up until the last part of it has been shown.
- The home page in one colour: no slate band.
- No hand-drawn underline in the headline.
- Projects on a page of their own, laid out as numbered columns divided by hairlines.
  Picking one opens it over the whole page; a button goes back.
- The footer keeps its landscape, without the strip of printed text, and with the footer's
  own text set inside the sky.
- No captions under the pictures of a project.

## Decision

### The story

- `src/features/story` pins a stage to the screen (`position: sticky`) inside a section as
  tall as the scroll it should take. A track of empty stretches, one per step, gives the
  section that height; the step on show is the last one whose stretch has started above
  the middle of the screen (`steps.ts`, unit tested).
- Every step stays in the document and in the accessibility tree; the component only
  decides which one is visible. Focus landing in a hidden step brings that step on, and
  without JavaScript the steps are plain sections one after another.
- Each stretch carries the step's id, so `/#ahora` opens the story there and the list of
  chapters is made of plain links.
- The scroll is followed with a passive listener and one measurement per frame. An
  `IntersectionObserver` was tried first and dropped: a jump from above the story to below
  it crosses no threshold, and the stage stayed on the first step.

### The projects board

- `/proyectos` is the board and `/proyectos/<slug>` is the board with that project open.
  Both routes render the same screen; which project is open is read from the URL and
  nothing else (`board.ts`, unit tested).
- With JavaScript the links change the URL in place (`history.pushState`, which the App
  Router mirrors into `usePathname`). The columns therefore stay mounted and slide: the
  open one grows, the others close. A reload, a shared link, the browser's back button and
  the no-JavaScript fallback all work because the two routes are real.
- Opening a project behaves as a page change: the tab title is updated, the page returns
  to the top and focus moves to the way back. Closing brings the column back into view
  and returns focus to it.
- Columns pushed aside are `inert`. The card of a column keeps one column's width
  (container query units), so nothing in it moves while the column grows.

### Components

- `marker-text` (the underline) and `StickerPeel` (the stickers on the notebook's desk) are
  removed with what they decorated, and `lucide-react` with them. In use: `image-comparison`,
  `HalftoneReveal`, `Noise` and `Ribbons`.

## Consequences

- The notebook, its model and its tests are gone; so are its URL fragments.
- An unknown project is answered with the not-found page but with status 200: the route's
  shell is sent before the slug is known. Next.js marks that page `noindex`.
- The board is not wrapped in `Suspense`. Both routes are prerendered with their pathname
  known, so `usePathname` does not suspend; a boundary there only made the board arrive as
  a streamed segment, which stays hidden without JavaScript. Only the guard that checks
  the slug sits behind `Suspense`, and it renders nothing.
- The story costs as much scroll as it has steps. Adding a step makes the page longer, and
  a step whose text does not fit a phone screen has to be shortened: the stage does not
  scroll inside.
