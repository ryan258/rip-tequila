# RIP Tequila Hugo Site

A modular Hugo prototype for the fictional RIP Tequila parody brand.

## Run

```sh
npm install
npm run dev
```

Production build:

```sh
npm run build
```

Set the production base URL when building for deployment so canonical URLs, sitemap entries, and absolute links point at the deployed domain:

```sh
hugo --gc --minify --baseURL "https://example.com/"
```

## Structure

- `content/the-lineup/` product family and product detail pages
- `content/characters/` cast index and character detail pages
- `content/merch/` merch index and merch detail pages
- `layouts/partials/sections/` reusable homepage sections
- `assets/scss/` SCSS design system tokens, components, layout, and page styles
- `assets/ts/main.ts` mobile menu, signup validation placeholder, and interactive card behavior
- `data/navigation.yaml` global navigation and footer links
- `data/slogans.yaml` campaign slogan strip

## Visual system

All brand iconography on this site is a **bespoke SVG glyph language** rendered inline via `layouts/partials/glyph.html`. Bottles are CSS shapes with a custom glyph mark on the label; characters, merch, and product visuals are signature woodcut-style glyphs; the slogan strip uses animated glyph marks; and pages are backed by optimized WebP linocut screenprint artwork. The full philosophy and rules live in `docs/visual-system.md`.

In short: typography and copy carry the brand, handcrafted vector glyphs set the tone, and rich linocut textures establish the afterlife cantina atmosphere with zero external icon CDN dependencies.
