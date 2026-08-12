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

All artwork on this site is **Font Awesome** loaded via CDN. This is intentional, not a placeholder. Bottles are CSS shapes with a small FA glyph on the label; characters, merch, and product visuals are single FA icons inside a card; the slogan strip uses FA icons per line. The full philosophy and rules live in `docs/visual-system.md`.

In short: typography and copy carry the brand, icons set the tone, no high-fidelity imagery is used. The flat, poster-like aesthetic breaks the moment photography or detailed illustration enters the picture, so we don't add any.
