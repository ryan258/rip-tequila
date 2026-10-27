# RIP Tequila Hugo Site

A modular Hugo prototype for the fictional RIP Tequila parody brand.

The checked-in configuration intentionally keeps commerce and Social Club
enrollment disabled. Merchandise is presented as concept work, and the Social
Club is forthcoming; see `params.features` in `hugo.yaml` and the release
requirements in `docs/specs/spec--claude.md` before enabling either capability.

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

## Verification & Tests

Run the targeted client unit test suite (validates party roster and storage fallback warning):

```sh
npm run build
RIP_PARTY_JS=$(ls -t public/ts/party.*.js | head -n 1) node --test tests/party-storage.test.cjs
```

Verify compliance with the standing alcohol-claims rule (must return no matches):

```sh
grep -rnE '[0-9]+ ?% ?ABV|[0-9]+ Proof|100% [A-Za-z ]*[Aa]gave' content layouts data
```

## Structure

- `content/the-lineup/` product family and product detail pages
- `content/characters/` cast index and character detail pages
- `content/merch/` merch index and merch detail pages
- `content/party/` + `layouts/party/` + `assets/ts/party.ts` the printable Halloween party kit (guest list, Social Club cards, bell coasters, cast placards); US Letter, drawn at real paper size
- `layouts/partials/sections/` reusable homepage sections
- `layouts/partials/image.html` the only way to emit an `<img>` — see below
- `layouts/partials/glyph.html` the inline SVG glyph set
- `assets/scss/` SCSS design system tokens, components, layout, and page styles
- `assets/ts/main.ts` mobile menu, merch category filter, signup placeholder
- `data/navigation.yaml` global navigation and footer links
- `data/cantina.yaml` cantina geography cards

### Images

Artwork lives in `assets/images/` and is emitted through `partials/image.html`, which
reads each file's real dimensions and writes `width`/`height` onto the tag so pages
don't shift as images load. Add new `<img>` tags through that partial, not by hand.

`static/` holds only the assets CSS references by URL (the paper-grain texture);
Hugo publishes `assets/` files on demand, and a `url()` in a stylesheet is not a
reference it can see.

### Homepage cast and lineup

The homepage cast strip and bottle grid range over `content/characters/` and
`content/the-lineup/`, and their headline counts are spelled by
`partials/numword.html`. Adding a character or an expression needs no template
edit — do not reintroduce a hardcoded second copy.

## Visual system

All brand iconography on this site is a **bespoke SVG glyph language** rendered inline via `layouts/partials/glyph.html`. Bottles are CSS shapes with a custom glyph mark on the label; characters, merch, and product visuals are signature woodcut-style glyphs; and pages are backed by optimized WebP linocut screenprint artwork. The full philosophy and rules live in `docs/visual-system.md`.

In short: typography and copy carry the brand, handcrafted vector glyphs set the tone, and rich linocut textures establish the afterlife cantina atmosphere with zero external icon CDN dependencies.
