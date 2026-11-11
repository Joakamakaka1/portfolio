# Third-party notices

## Engravings

The pictures under `src/assets/artwork` are public-domain works taken from Wikimedia
Commons, cropped and, for line engravings, converted to ink on a transparent background by
`scripts/artwork.mjs`. The list below mirrors `src/content/artwork.json`, which is the
source of truth.

| File             | Work                                                                                   | Author and year                     | Licence       | Source |
| ---------------- | -------------------------------------------------------------------------------------- | ----------------------------------- | ------------- | ------ |
| `cygnus.webp`    | Cygnus, from _Firmamentum Sobiescianum sive Uranographia_                              | Johannes Hevelius, 1690             | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Johannes_Hevelius_-_Cygnus.jpg) |
| `lyra.webp`      | Lyra, from the same atlas                                                              | Johannes Hevelius, 1690             | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Johannes_Hevelius_-_Lyra.jpg) |
| `ursa-minor.webp`| Ursa Minor, from the same atlas                                                        | Johannes Hevelius, 1690             | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Johannes_Hevelius_-_Ursa_Minor.jpg) |
| `flammarion.webp`| Wood engraving from Camille Flammarion, _L'atmosphère: météorologie populaire_         | Anonymous, 1888                     | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:FlammarionWoodcut.jpg) |
| `moon.webp`      | Map of the Moon, from _Selenographia_                                                  | Johannes Hevelius, 1647             | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Hevelius_Map_of_the_Moon_1647.jpg) |
| `turk.webp`      | The Turk, from _Ueber den Schachspieler des Herrn von Kempelen und dessen Nachbildung_ | Joseph Friedrich zu Racknitz, 1789  | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Racknitz_-_The_Turk_1.jpg) |
| `microscope.webp`| Compound microscope, from René Descartes, _La Dioptrique_                              | Anonymous, 1637                     | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Compound_microscope_as_rendered_by_artist_in_Descartes_%22La_Dioptrique%22_LCCN2006690473.jpg) |
| `jupiter.webp`   | Jupiter, from _The Trouvelot Astronomical Drawings_                                    | Étienne Léopold Trouvelot, 1881     | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Trouvelot_-_Jupiter_-_1880.jpg) |
| `pigeons.webp`   | Pigeon messengers, from _Harper's New Monthly Magazine_                                | Anonymous, 1873                     | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Pigeon_Messengers_(Harper%27s_Engraving).png) |
| `printer.webp`   | The printer, from _Das Ständebuch_                                                     | Jost Amman, 1568                    | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Buchdrucker-1568.png) |
| `barometer.webp` | Man beside a barometer, Rijksmuseum RP-P-1911-3423                                     | Anonymous, 1748–1877                | CC0           | [Commons](https://commons.wikimedia.org/wiki/File:Man_bij_een_barometer,_RP-P-1911-3423.jpg) |
| `scales.webp`    | Vignette with scales, Rijksmuseum RP-P-1909-2656                                       | Anonymous, 1826–1870                | CC0           | [Commons](https://commons.wikimedia.org/wiki/File:Vignet_met_weegschaal,_RP-P-1909-2656.jpg) |

## Fonts

Bricolage Grotesque, Instrument Sans and Shantell Sans are served through `next/font` under
the SIL Open Font License 1.1.

## Components

No third-party component is vendored at the moment. When one is added, its folder under
`src/components/vendor`, its project, its licence and any local change are listed here; see
[ADR 0002](docs/adr/0002-vendored-third-party-components.md).
