# Visual System

This document is the source of truth for how the RIP Tequila site looks. If something on a page contradicts this file, the page is wrong.

## The short version

- All artwork is **Font Awesome**, loaded via CDN (`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css`).
- Typography does the heavy lifting. Copy does the rest. Icons set tone, not detail.
- We do not use photography, illustration, AI-generated imagery, or any high-fidelity visual. By design.

## Why

RIP Tequila is a parody brand with a flat, poster-like aesthetic — think mid-century liquor poster that happens to be clickable. The brand voice is loud, dry, and absurd; the visual system has to be the same. The moment you drop a photograph of a tequila bottle or a detailed character portrait onto the page, two things happen at once:

1. The parody collapses — real product photography implies a real product, and the joke stops landing.
2. The visual hierarchy breaks — a high-fidelity image next to a flat icon reads as "the icon is the cheap one," and the whole composition slides toward generic.

The icon-only approach keeps everything at the same weight. Every visual is the same kind of mark, the same line weight, the same flatness. The brand reads as a **system of marks**, not a collection of assets.

This is the "salt bath" rule: the whole site sits in the same visual bath. Don't pull one element out into higher fidelity than the rest.

## What the icons are used for

- **Product bottles** (`layouts/partials/product-card.html`): a CSS-drawn bottle silhouette (neck + body + label) with one small FA glyph on the label. The glyph in `Params.icon` is also reused as a larger corner mark on the card. One icon does double duty.
- **Character cards** (`layouts/partials/character-card.html`): a single large FA icon sits where a portrait would normally go. The icon is the character. The name, role, prop, and tagline below it carry the personality.
- **Merch cards** (`layouts/partials/merch-card.html`): same pattern — one FA icon per item. A hat card has a hat icon, a shirt card has a shirt icon, a sticker sheet has an icons icon.
- **Slogan strip** (`data/slogans.yaml`): each slogan pairs with a small FA icon. The icons rotate the joke (skull, bell, lemon, martini glass) so the strip has rhythm.
- **Page icons** (frontmatter `icon:` on every section page): a single icon used as the page's visual anchor. A door for The Cantina, a location dot for Find Us, a scale for Responsible Language, etc.

## How icons get chosen

Each page sets `icon:` in its frontmatter, pointing at a Font Awesome class (`fa-solid fa-skull`, `fa-solid fa-bell`, etc.). The partial that renders the card just outputs `<i class="..."></i>` — the icon is the image, no further styling required.

When picking an icon, follow this order:

1. **Literal object first.** Hat → `fa-hat-cowboy`. Bell → `fa-bell`. Sticker sheet → `fa-icons`. If the thing exists in the FA set, use it.
2. **Semantic second.** Judgment → `fa-scale-balanced`. Disclaimer → `fa-circle-exclamation`. Use the abstract concept when no literal works.
3. **Brand-trope third.** Skull, cross, bell, monument, moon, seedling, martini glass, lemon — the iconography of "afterlife cantina" lives here. These are the rotation set for things that don't have a literal or a clean semantic.
4. **Never just decorative.** Every icon on the site is load-bearing — it stands in for an image and carries meaning. Don't add an icon "for vibe."

## The "no" list

These break the salt bath. Don't add them without rewriting this doc:

- Photographs of bottles, people, places, food, or product mockups.
- AI-generated hero images, even stylized ones.
- Detailed or character-driven illustration (Don Muerte as a fully-drawn figure, etc.).
- Realistic 3D renders, even of abstract shapes.
- Stock photography of any kind.
- Logos or marks downloaded from other brands, including for "parody" — the parody is in the *words*, not in stolen marks.
- Background images, textures, gradients that simulate depth, or anything that reads as "photo" or "painting" rather than "flat mark."

## The "yes" list

- CSS-drawn bottle silhouettes in the product card (already in place).
- FA icons as standalone visuals.
- Type-only compositions: large display type, stacked slogans, monospace numerics.
- Solid color blocks, hard rules, and the existing palette (Midnight Black, Bone White, Agave Green, Blood Orange, Grave Gold).
- Animated FA icons where the animation is in the icon itself (e.g. `fa-bell` ringing on hover) — the icon stays an icon, it just moves.

## When this might need to change

If a future page genuinely needs an image to communicate (a real recipe, a printable coaster, a mockup of a bottle label for download), the move is to:

1. Make the image itself flat — same line weight, same color palette, same salt bath as the rest of the site.
2. Treat it as a *deliverable*, not a *decoration* — it has a download button or a print function, and it earns its presence by being useful.
3. Update this doc to describe the exception so the rule doesn't get quietly relaxed.

## Related

- `layouts/partials/icon.html` — the wrapper that renders a single FA icon with the `icon-mark` class.
- `layouts/partials/product-card.html`, `character-card.html`, `merch-card.html` — the three card partials that all use the same one-icon-per-card rule.
- `hugo.yaml` — `params.fontAwesomeCdn` and `params.googleFonts` are the only external visual dependencies.
- `data/slogans.yaml` — the icon-bearing slogan strip.
