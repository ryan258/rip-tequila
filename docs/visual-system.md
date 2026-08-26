# Visual System

This document is the source of truth for how the RIP Tequila site looks. If something on a page contradicts this file, the page is wrong.

## The short version

- All brand iconography uses a **bespoke inline SVG glyph language** rendered via `layouts/partials/glyph.html` (zero external icon CDNs).
- Typography does the heavy lifting. Copy does the rest.
- Background imagery and textures follow a strict vintage screenprint / linocut woodblock aesthetic adhering to the 5 brand colors (Midnight Black, Bone Cream, Blood Red, Agave Green, Grave Gold).
- We do not use photography, realistic 3D renders, or modern glossy visuals.

## Why

RIP Tequila is a parody brand with a flat, poster-like aesthetic — think mid-century liquor poster that happens to be clickable. The brand voice is loud, dry, and absurd; the visual system has to be the same. The moment you drop a photograph of a tequila bottle or a generic generic UI icon onto the page, two things happen at once:

1. The parody collapses — real product photography implies a real product, and the joke stops landing.
2. The visual hierarchy breaks — an off-the-shelf icon library clashes with the handcrafted woodcut aesthetic.

Every visual mark on the site is an authentic, chiseled vector glyph engineered on a 24x24 grid with heavy 2px strokes and geometric woodblock linework.

## SVG Glyph Set

- `skull`: Don Muerte chiseled cranium with square sockets and cheekbones.
- `bell`: Heavy mission bell with tolling clapper and crown loop.
- `agave`: Spiky geometric agave fronds with central heart.
- `monument`: Arched tombstone monolith with engraved cross.
- `moon`: Crescent afterlife moon flanked by radiant stars.
- `cross`: Heavy Spanish ironwork mission cross.
- `glass`: Copita / tasting goblet with perched lime wedge.
- `lemon`: Faceted chiseled citrus slice.
- `cactus`: Ribbed saguaro silhouette with ground line.
- `barrel`: Charred oak aging cask with double iron hoops.
- `eye`: Mystic watcher eye with radiant lashes (El Vigía).
- `maracas`: Crossed festive woodblock maracas (Los Maracas).
- `microphone`: Vintage 1940s ribbon microphone (La Rosa Negra).
- `shovel`: Cemetery spade with T-handle (El Sepulturero).
- `hat`: Wide-brim ranchero cowboy hat.
- `shirt`: Heavyweight graphic tee with skull crest.
- `card`: Don Muerte Social Club membership seal.
- `stickers`: Geometric glyph sticker assortment.
- `coasters`: Stacked diamond beverage coaster set.
- `scale`: Scales of judgment & proof (Responsible Language).
- `location`: Desert compass landmark marker (Find Us).
- `warning`: Chiseled triangular caution mark (Parody Disclaimer).
- `book`: The afterlife chronicles ledger (Our Story).
- `door`: Heavy-timber cantina portal (The Cantina).
- `crate`: Secret drop delivery box (Drops).
- `lock`: Heavy brass padlock with chiseled shackle.
- `people`: Afterlife cast duo silhouette.
- `arrow-right`: Chiseled woodblock navigation pointer.

## Visual system assets

- **Homepage motion poster** (`/assets/images/home-hero-poster-motion.webp`): a subtle looping WebP with wind-swept agaves and pulsing supernatural desert radiance. Its matching static reduced-motion frame is `/assets/images/home-hero-poster-motion-still.webp`.
- **Hero poster backdrop** (`/assets/images/hero-poster-bg.webp`): woodblock desert backdrop under a stylized blood-red sun with silhouette agaves.
- **Cantina archway** (`/assets/images/cantina-archway-bg.webp`): linocut illustration of the afterlife cantina entrance with warm lantern glow for the Brand Intro.
- **Social Club texture** (`/assets/images/social-club-bg.webp`): dark engraved woodcut relief pattern of bells, skulls, and agaves in antique gold and midnight black.
- **Paper grain** (`/static/images/paper-grain-bg.webp`): subtle letterpress paper texture layered across section backgrounds via `@mixin paper-texture`.
- **The Lineup hero backdrop** (`/assets/images/lineup-hero-bg.webp`): linocut tequila distillery and desert agave fields under a blazing sun.
- **Characters hero backdrop** (`/assets/images/characters-hero-bg.webp`): linocut cantina porch under lanterns and stars.
- **Merch hero backdrop** (`/assets/images/merch-hero-bg.webp`): afterlife trading post linocut artwork.
- **Cantina Story hero backdrop** (`/assets/images/cantina-story-bg.webp`): canyon ridge afterlife cantina landscape.
- **404 Desert Crossroads backdrop** (`/assets/images/404-bg.webp`): midnight desert signpost under a red crescent moon.

## Related

- `layouts/partials/glyph.html` — the SVG glyph engine supporting all brand marks with automatic aliasing and accessible metadata.
- `assets/scss/components/_glyphs.scss` — SCSS sizing, color modifiers, and hover micro-animations.
- `data/slogans.yaml` — the glyph-bearing slogan strip.
