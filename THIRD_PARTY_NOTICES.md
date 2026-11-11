# Third-party notices

The components under `src/components/vendor` were copied from the projects below with the
shadcn CLI. They keep their own licences and copyright.

| Folder              | Project                                                        | Licence              | Components                                                                                                                                  |
| ------------------- | -------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `react-bits/`       | [React Bits](https://github.com/DavidHDev/react-bits)          | MIT + Commons Clause | CircularText, CurvedLoop, HoloCard, Lanyard, LatticeLoader, MagicBento, Ribbons, Silk, SplitText, StarBorder, StatusMark, ThoughtLine, TrueFocus |
| `animate-ui/`       | [Animate UI](https://github.com/animate-ui/animate-ui)         | MIT + Commons Clause | Tabs (Base UI primitive) with its Highlight, AutoHeight and Slot helpers                                                                     |
| `motion-primitives/`| [Motion Primitives](https://github.com/ibelick/motion-primitives) | MIT               | InfiniteSlider, MorphingDialog, TextEffect                                                                                                   |
| `kokonutui/`        | [KokonutUI](https://github.com/kokonutui/kokonutui)            | MIT                  | AI Citations                                                                                                                                 |
| `hooks/`, `lib/`    | Support files installed with the components above              | As their component   | use-auto-height, use-controlled-state, useClickOutside, get-strict-context                                                                   |

The Commons Clause forbids selling the components themselves; using them in a site is
allowed.

## Local changes

Vendored files are otherwise left exactly as they came. These are the only edits:

- **Import paths** point to `@/components/vendor/...` instead of the paths each registry
  assumes.
- **Animate UI Tabs** imports `@base-ui/react/tabs`. The registry file targets the package's
  former name, `@base-ui-components/react`, which would add a second copy of Base UI.
- **Motion Primitives MorphingDialog**: removed the generated `aria-label` of the trigger
  (`Open dialog :r1:`), which hid the button's real content from screen readers, and
  translated the close button's label to Spanish.
- **React Bits Silk**: removed the forced `WEBGL_lose_context` call on cleanup. React's
  Strict Mode runs effects twice in development and the second run received a lost context,
  leaving a grey canvas.

To update a component, run the shadcn CLI again, move the file into its folder and reapply
the changes listed here.

## Fonts

Bricolage Grotesque, Instrument Sans, Pixelify Sans and JetBrains Mono are served through
`next/font` under the SIL Open Font License 1.1.
