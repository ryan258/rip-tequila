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

Font Awesome is loaded by CDN as temporary stand-in artwork for product, character, merch, and glyph visuals.
