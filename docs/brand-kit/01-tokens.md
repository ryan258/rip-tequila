# 01 — Tokens (Colors, Type, Spacing, Motion)

Source: `assets/scss/abstracts/_tokens.scss` · `assets/scss/abstracts/_mixins.scss`

## Colors

| Token | Hex | Role | Use |
|-------|-----|------|-----|
| `$color-black` | `#0D0D0D` | Primary text, rules, reverse bg | Obsidian Black — main ground |
| `$color-cream` | `#F2EDE0` | Primary bg, reverse text | Bone Cream — paper, label stock |
| `$color-red` | `#B22222` | Primary accent | Sangre Red — headers, bells, CTAs |
| `$color-green` | `#2E7D4F` | Secondary accent | Agave Green — agave, ritual marks |
| `$color-gold` | `#C6A24A` | Premium accent | Antique Gold — reserve, seals |
| `$color-deep-green` | `#0F3D3E` | El Vigía accent | Deep Green — night desert |
| `$color-white` | `#FFFFFF` | Card stock | Paper cards only |
| `$color-gray` | `#6B6B6B` | Muted text | Captions, disclaimers |
| `$color-red-light` | `#E04A4A` | Red hover | Interactive red only |
| `$color-green-light` | `#4ED98A` | Green glow | Hover glow only |

Semantic roles: `$color-bg-primary: cream`, `$color-bg-inverse: black`, `$color-text-primary: black`, `$color-text-inverse: cream`, `$color-accent-primary: red`, `$color-accent-secondary: green`, `$color-accent-premium: gold`.

Card accents via `[data-accent="red|green|gold|black|deep-green"]` → `--card-accent`.

### Pairings

- Black on Bone Cream — default
- Bone Cream on Black — dark packaging, apparel, night sections
- Black + Red cross + Green agave — posters, labels, social
- Black + Gold — limited editions, seals, boxes
- One-color Black or Cream — stamps, embroidery, screenprint

Do not introduce purple, teal, neon, or gradients. Do not place glyphs on busy photo backgrounds.

## Typography

| Role | Face | Weight | Case | Use |
|------|------|--------|------|-----|
| Display | Anton (Impact fallback) | 400 | Uppercase | Headlines, poster titles, bottle names |
| Accent | Oswald | 500/700 | Uppercase, 0.14em tracking | Eyebrows, labels, small caps, seals |
| Body | Montserrat | 400/600/700/800 | Sentence case | Body copy, disclaimers, captions |

Scales (from mixins):
- Poster title: `clamp(3rem, 7vw, 7.5rem)`, line-height `0.92`, uppercase
- Hero stack title: `clamp(2.8rem, 6vw, 5.5rem)`
- Eyebrow: `0.8125rem`, 700, 0.14em, uppercase
- Body: `clamp(1rem, 1.2vw, 1.18rem)`, line-height `1.55`

Google Fonts: `Anton & Montserrat 400;600;700;800 & Oswald 500;700`

## Spacing & layout

`$space-2xs 4px → $space-4xl 96px`. Page gutter `clamp(20px, 4vw, 72px)`. Container max `1440px`, content max `1180px`, doc max `820px`. Section padding `clamp(72px, 9vw, 132px)`.

Paper card: white stock, 2px black rule, offset shadow `8–10px 8–10px 0 rgba(black, 0.12)`.

## Motion

`$ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1)`, fast `160ms`, base `240ms`. Glyphs: bell tolls, skull rattles, eye stares (gold glow). Hero motion poster defers under `saveData` and `prefers-reduced-motion`.

## Texture

Paper grain: `static/images/paper-grain-bg.webp` via `@mixin paper-texture`. Opacity `0.05` light. Grid lines `26px` baked into mixin. Backgrounds: woodcut / linocut WebPs only.
