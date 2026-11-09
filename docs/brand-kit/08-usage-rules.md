# 08 — Usage Rules (Cross-Cutting)

## Do

1. Use approved colors, Anton/Oswald/Montserrat, and the glyph library consistently.
2. Keep one hero glyph per layout, short copy, generous clear space.
3. Run every claim through the gut-check: does it parody premium-spirits marketing, or is it just spooky?
4. Mark every surface as fictional parody with responsible language.
5. Use paper texture, linocut backdrops, and flat poster logic — clickable poster, not glossy brand.

## Don't

1. Never print real ABV %, proof, “100% agave”, fake seals, or certification marks.
2. No photography, realistic renders, thin-line icons, gradients, drop shadows, random clipart, or stock skulls.
3. No stretching, recoloring, rotating, or overcrowding the logo. No busy backgrounds behind marks.
4. No sacred/religious imagery as punchline. No scary skulls. No death-joke-every-line.
5. No binge encouragement. No false production claims. No real-label mimicry without parody disclaimer.

## Accessibility

Glyphs are `aria-hidden` by default; meaningful ones carry `role="img"` + label. All `<img>` via `partials/image.html` (real width/height, no layout shift). Focus rings: 3px red, 4px offset. Hero motion respects `prefers-reduced-motion` and `saveData`.

## Receivables

- New glyph → add a branch to `glyph.html` (the single source), list it in `03-glyph-library.md`, then run `node scripts/generate-brand-svgs.cjs` to refresh `static/brand/`.
- New slogan → add it inline where it is used; there is no slogans data file.
- New character/bottle → no template edits needed; homepage ranges over `content/` by `numword.html`.

## Verification

```sh
npm run check
```

Expected: the alcohol-claims grep prints nothing, brand colors and `static/brand/` match their sources, a fresh build has no missing images or glyphs, and the party tests pass. CI runs the same checks before deploying.
