# RIP Tequila — Brand Kit

**Source of truth:** `docs/brand-kit/` + `docs/visual-system.md` + `assets/scss/abstracts/_tokens.scss` + `layouts/partials/glyph.html`
**Live board:** `/brand-kit/` — internal and unlisted (`noindex`, no footer link, not in the sitemap); reachable by URL only. Hugo page from `content/brand-kit/_index.md`.
**Downloadable SVGs:** `/brand/` in `static/brand/` (logos, glyphs, patterns, applications)
**Regenerate downloads:** `npm install` once, then `node scripts/generate-brand-svgs.cjs`. Glyph geometry is read from `glyph.html`; logo and application lettering is converted to outlines with the fonts in `scripts/fonts/`. `npm run check:brand` (also run in CI) fails if `static/brand/` is stale; `npm run check:tokens` fails if a hex in the board, these docs, or the generator is not a token in `_tokens.scss`.

## What this is

RIP Tequila is a fictional premium-tequila parody brand from **La Cantina del Último Trago** — the afterlife cantina where the bell rings once and the dead start dancing. The brand makes fun of ultra-premium spirits marketing by taking it exactly as seriously as a real brand would.

Tagline: **“Rest In Proof.”**
Companions in rotation: “Proof You Lived.”, “The Bell Rang. You’re In.”, “No Actual Spirits. All the Spirit.”, “Born in Agave. Buried in Legend.”, “Save Water, Drink Tequila!”, “Here Lies Your Judgment.”

Mission: Bold, darkly funny brand that turns nightlife, hangovers, and “famous last words” drinking culture into a memorable, shareable experience. Cast of eight, five core bottles, one cantina.

## Kit contents

| # | File | Covers |
|---|------|--------|
| 1 | `01-tokens.md` | Colors, typography, spacing, motion, CSS tokens |
| 2 | `02-logo-system.md` | Lockups, clear space, minimum sizes, color versions, do/don't |
| 3 | `03-glyph-library.md` | 47 glyphs, construction, categories, lockups |
| 4 | `04-voice-and-copy.md` | Voice, taglines, tasting notes, disclaimers, gut-check |
| 5 | `05-world-and-product.md` | 8 characters, 5 core bottles, variants, cantina geography |
| 6 | `06-applications.md` | Packaging hierarchy, merch, social, party kit, coasters |
| 7 | `07-patterns.md` | 4 repeating patterns and where to use them |
| 8 | `08-usage-rules.md` | Cross-cutting do/don't, accessibility, responsible parody |

## Quick reference

**Colors:** Obsidian Black `#0D0D0D`, Bone Cream `#F2EDE0`, Sangre Red `#B22222`, Agave Green `#2E7D4F`, Antique Gold `#C6A24A`, Deep Green `#0F3D3E`

**Type:** Display `Anton` (headlines, poster titles) · Accent `Oswald` (eyebrows, labels, small caps) · Body `Montserrat` (copy, disclaimers, captions)

**Logo:** Flat display wordmark — `RIP` stacked over `TEQUILA`. No illustrated tombstone, halo, or skeletal-hand icon. Horizontal `RIP TEQUILA` on one line for tight spaces.

**Glyphs:** Flat, bold, woodcut-line SVGs on a 24×24 grid, 2px strokes, `currentColor`, rendered inline via `partials/glyph.html`. Zero external icon CDNs.

**Imagery:** No photography, no realistic 3D, no glossy renders. Flat linocut / screenprint textures (`paper-grain-bg.webp`), WebP backdrops, SVG glyphs.

## Folder map

```
docs/brand-kit/          — markdown source (this kit)
content/brand-kit/       — Hugo page source (/brand-kit/)
layouts/brand-kit/       — Hugo board template
assets/scss/pages/_brand-kit.scss — board styles
static/brand/logo/       — downloadable logo SVGs
static/brand/glyphs/     — downloadable glyph SVGs (47)
static/brand/patterns/   — downloadable pattern SVGs (4)
static/brand/applications/ — downloadable application SVGs (7)
```

## Rules that never bend

- Never claim real ABV %, proof, or “100% agave” — compliance grep must stay clean.
- Every physical-facing surface carries: **Fictional parody brand. Drink responsibly. Haunt responsibly.**
- One hero glyph per layout. Short copy. Heavy fills, simple negative space.
- If it contradicts `docs/visual-system.md`, the page is wrong.
