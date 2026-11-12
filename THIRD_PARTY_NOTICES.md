# Third-party notices

## Prints

The collages under `public/collage` are made from the public-domain works below, taken from
Wikimedia Commons and cut, torn, re-inked or screened by `scripts/collage`. The list mirrors
`src/content/artwork.json`, which is the source of truth and also feeds the `/creditos` page.

| Id                 | Work                                                                    | Author and year                              | Licence       | Source |
| ------------------ | ----------------------------------------------------------------------- | -------------------------------------------- | ------------- | ------ |
| `octopus-macropus` | _Octopus macropus_, from Giuseppe Jatta, _I Cefalopodi viventi nel Golfo di Napoli_ | Comingio Merculiano, 1896        | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Octopus_macropus_Merculiano.jpg) |
| `marbled-1735`     | Marbled endpaper of an _Œuvres d’Horace_, Paris                          | Anonymous, c. 1735                           | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:PaperMarbling005France1735.jpg) |
| `marbled-1720`     | Marbled endpaper of a Quintilian edited by Burmann, Leiden 1720          | Anonymous, 1720–1770                         | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Marbled_endpaper,_between_1720_and_1770,_from_Quintilian_ed._Burmann,_Leiden_1720.jpg) |
| `scales`           | Vignette with scales, Rijksmuseum RP-P-1909-2656                         | Anonymous, 1826–1870                         | CC0           | [Commons](https://commons.wikimedia.org/wiki/File:Vignet_met_weegschaal,_RP-P-1909-2656.jpg) |
| `microscope`       | Compound microscope, from René Descartes, _La Dioptrique_                | Anonymous, 1637                              | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Compound_microscope_as_rendered_by_artist_in_Descartes_%22La_Dioptrique%22_LCCN2006690473.jpg) |
| `printer`          | The printer, from _Das Ständebuch_                                       | Jost Amman, 1568                             | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Buchdrucker-1568.png) |
| `turk`             | The Turk, from _Ueber den Schachspieler des Herrn von Kempelen und dessen Nachbildung_ | Joseph Racknitz, 1789          | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Racknitz_-_The_Turk_1.jpg) |
| `bartisch`         | Portrait of Georg Bartisch, _Ophthalmodouleia_, leaf 4v                  | Georg Bartisch, 1583                         | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Bartisch-04v.jpg) |
| `magnolia`         | _Magnolia grandiflora_, from F. A. Michaux, _The North American Sylva_   | Pierre-Joseph Redouté (drawing), 1819        | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:NAS-051_Magnolia_grandiflora.png) |
| `phonograph-use`   | The phonograph in use, from Th. du Moncel, _Le téléphone, le microphone et le phonographe_ | Charles Laplante, 1880     | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Fig_99_Phonograph_in_use.jpg) |
| `phonograph-sheet` | A phonograph sheet, from the same book                                   | Charles Laplante, 1880                       | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Fig_103_A_phonograph_sheet.jpg) |
| `vaucanson`        | Vaucanson's automata, drawing, Paris Musées                              | Hubert-François Gravelot, 1747–1773          | CC0           | [Commons](https://commons.wikimedia.org/wiki/File:Les_automates_de_Vaucanson._D.4099.jpg) |
| `mical`            | The speaking heads of abbé Mical, reproduced in _Histoire des jouets_    | Anonymous, 18th century                      | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:T%C3%AAtes_parlantes_de_l%27abb%C3%A9_Mical.jpg) |
| `barometer`        | Man beside a barometer, Rijksmuseum RP-P-1911-3423                       | Anonymous, 1748–1877                         | CC0           | [Commons](https://commons.wikimedia.org/wiki/File:Man_bij_een_barometer,_RP-P-1911-3423.jpg) |
| `pigeons`          | Pigeon messengers, _Harper's New Monthly Magazine_ no. 275               | Anonymous, 1873                              | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Pigeon_Messengers_(Harper%27s_Engraving).png) |
| `balloons`         | Air-balloons, plate CCCXIV of an unidentified publication; Library of Congress | A. Bell (engraver), 1784               | Public domain | [Commons](https://commons.wikimedia.org/wiki/File:Air-balloons_LCCN2002722692.tif) |
| `icarus`           | Icarus, from _The Four Disgracers_, Rijksmuseum RP-P-OB-10.363           | Hendrick Goltzius after Cornelis van Haarlem, 1588 | CC0     | [Commons](https://commons.wikimedia.org/wiki/File:Icarus_De_vier_vallers_(serietitel),_RP-P-OB-10.363.jpg) |
| `albinus-text`     | Page of text, _Tabulae sceleti et musculorum corporis humani_            | Bernhard Siegfried Albinus, 1747             | CC0           | [Commons](https://commons.wikimedia.org/wiki/File:Tabulae_sceleti_et_musculorum_corporis_humani,_Albinus,_1747,_KU_Leuven_Libraries,_Maurits_Sabbe_Library,_P_Plano_155,_Folio_015v.jpg) |

## Fonts

Newsreader and Instrument Sans are served through `next/font` under the SIL Open Font
License 1.1.

## Components

Copied with the shadcn CLI into `src/components/vendor/<library>/` and wrapped from our own
code, unchanged; see [ADR 0002](docs/adr/0002-vendored-third-party-components.md).

| File                                 | Project                                                           | Licence              | Used for                              |
| ------------------------------------ | ----------------------------------------------------------------- | -------------------- | ------------------------------------- |
| `motion-primitives/image-comparison` | [Motion Primitives](https://github.com/ibelick/motion-primitives) | MIT                  | The reading line of the first collage |
| `react-bits/HalftoneReveal`          | [React Bits](https://github.com/DavidHDev/react-bits)             | MIT + Commons Clause | The plate of each project             |
| `react-bits/Noise`                   | React Bits                                                        | MIT + Commons Clause | The grain of the footer               |
| `react-bits/Ribbons`                 | React Bits                                                        | MIT + Commons Clause | The ribbons of the not-found page     |
