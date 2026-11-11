# 0008 · Layered collage, a plain type pair and a notebook that tells a story

Status: accepted (2026-11-11). Amended by [0009](0009-scroll-story-and-projects-board.md),
which replaces the notebook with a story told by the scroll and drops two of the components
listed below. Supersedes the look and the content plan of
[0007](0007-observation-notebook.md).

## Context

The owner reviewed the notebook of ADR 0007 in the running app and rejected its look:

- It read as childish. His references are mature and vintage: pictures laid over each
  other until they make a new picture. The site had loose, single images over large flat
  colours.
- The type (a condensed display face and a bouncy handwriting face) was wrong; he asked for
  something plain, as Anthropic's or as in his references.
- It carried leftovers of the earlier "cosmos" prototype (stars, a comet, the giant name).
- The third-party components he chose had been dropped; he wants them used, and used with
  some invention.
- The notebook explained too much. He wants a story; detail belongs in the repositories.
- The footer copied one reference picture instead of learning from it.

## Decision

- **Collages are built, not drawn.** `scripts/collage` cuts, tears, re-inks and screens
  public-domain prints into pieces (`kit.mjs`), following a recipe per collage. Where each
  piece sits is content (`src/content/collages.json`). A collage is a stack of real layers
  in the page, so pieces overlap, cast shadows and drift apart with the pointer.
- **One subject: natural history read by a machine.** Plates of animals and plants, early
  speaking and thinking machines, and the marks of a measurement over them. The first
  picture is an octopus as "an agent and its tools".
- **Colour is ink.** Vermilion, cobalt and leaf green appear only as the second colour of
  a print or as a thin drawn mark, over aged paper.
- **Two typefaces.** Newsreader (serif) for anything read, Instrument Sans for the
  interface. No handwriting face: the hand is in the red underline and in the coloured
  lines of the notebook.
- **The notebook tells the story** in ten short pages, each with one small collage. It
  gains depth (leaning halves, the pile of pages, marbled boards) and an index that lays
  every page on the desk. Capabilities, tools and dates left the notebook.
- **Third-party components are back, each with a job:**
  - Motion Primitives `image-comparison`: the line between the print and its reading.
  - KokonutUI `marker-text`: the underline drawn by hand in the headline.
  - React Bits `StickerPeel`: loose cut-outs on the desk.
  - React Bits `HalftoneReveal`: the plate of each project file.
  - React Bits `Noise`: the grain of the footer. `Ribbons`: the not-found page.
- **The footer is its own landscape**, made of the same scraps (marbled paper for hills, a
  page of text for the ground).

## Consequences

- Pictures cost a build step: after changing a recipe run `pnpm collage <id>` and commit
  the files it writes. `pnpm collage <id> --preview` flattens a collage to a PNG to look at
  it without the browser.
- Every print is credited on `/creditos` and in `THIRD_PARTY_NOTICES.md`, both written from
  `src/content/artwork.json`.
- `motion` is a dependency again, and four WebGL canvases can be alive on the home page
  (three stickers on wide screens, none on phones).
- `StickerPeel` carries one local change, listed in `THIRD_PARTY_NOTICES.md`.
- The reading line of the first picture follows the pointer only; it has no keyboard
  equivalent. Both sides show the same print, so no content depends on it.
- The dark theme darkens the wall and nothing else: paper pieces keep their colour.
