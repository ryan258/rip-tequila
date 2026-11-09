# Fonts for the brand SVG generator

Used only by `scripts/generate-brand-svgs.cjs`, which converts logo and application lettering into outlined paths so the downloadable SVGs render the same on any machine. The site itself does not serve these files; it loads Anton, Oswald, and Montserrat from Google Fonts.

| File | Source | Copyright |
|------|--------|-----------|
| `Anton-Regular.ttf` (170,812 bytes) | `google/fonts` → `ofl/anton/Anton-Regular.ttf` | Copyright 2020 The Anton Project Authors (https://github.com/googlefonts/AntonFont.git) |
| `Oswald.ttf` (172,088 bytes; variable font, outlines use the default weight 400) | `google/fonts` → `ofl/oswald/Oswald[wght].ttf` | Copyright 2016 The Oswald Project Authors (https://github.com/googlefonts/OswaldFont) |

Both are licensed under the SIL Open Font License, Version 1.1 (https://openfontlicense.org/); the license notice is embedded in each font's `name` table. The full `OFL.txt` is not vendored here — add it from the `google/fonts` repo if this repo is ever distributed beyond personal use. Downloaded 2026-11-08 from `raw.githubusercontent.com/google/fonts/main/ofl/`.
