# RIP Tequila — Site Spec

A single reference spec for the RIP Tequila site: what it is, how it's
organized, and the rules that keep a rebuild (or a redesign) from drifting
off-brand or breaking the template/content contract. Unlike
`docs/prompt/this-in-one-shot--claude.md`, this isn't phrased as instructions
to an AI — it's the spec that prompt (or any engineer) should build against.

---

## 1. Product overview

**RIP Tequila** is a fictional parody spirits brand: the house label of "La
Cantina del Último Trago," an afterlife cantina staffed by eight deceased
characters who pour five bottles with the total sincerity of a real luxury
spirits company. It's a static marketing/brand site — no cart, no checkout,
no real product. The "merch" pages are the one place a real transaction can
happen (external, off-site).

**What it's parodying:** ultra-premium spirits marketing conventions —
master-blender legacy stories, small-batch mythology, three-generations-of-
craft claims, celebrity-tequila gold rushes, solemn tasting notes. The
afterlife setting is the costume; the joke is that premium spirits marketing
already sounds a little unhinged, and this brand just says the quiet part
out loud.

**Gut-check for any new copy or page:**
- On target: fake tasting notes, mock founder/legacy claims, fake batch
  numbers or seals, anything that parodies how real premium brands sell
  themselves.
- Off target: copy that's just "spooky"/"skull" for its own sake with no
  wink at premium-brand marketing conventions underneath it.

---

## 2. Voice rules

- The brand **never labels its own joke**. Body copy, headlines, and nav
  labels never use "parody," "fictional," "satire," or "joke" — it plays
  straight from inside its own world.
- Exceptions, where breaking character is the point: `<meta>`/SEO/OG
  description tags, and the legal/responsibility cluster — `/parody-
  disclaimer/`, `/terms/`, `/privacy/`, `/responsible-language/`, and the
  `sections/disclaimer.html` partial. Only there does the copy say things
  like "No actual spirits are sold here."
- Site copy is written for visitors, in-world, at all times — it never
  surfaces brand-book or design-system commentary (no "we chose Anton
  because..." on a live page).
- Character voice is deadpan, not horror. Don Muerte "has never confirmed
  the presence of a skull" under his sombrero — the joke is restraint, not
  gore.

---

## 3. Information architecture

| Route | Purpose |
|---|---|
| `/` | Homepage — hero, brand intro, bottle preview, evidence-locker preview, character strip, social-club callout, slogan marquee |
| `/our-story/` | Cantina origin narrative |
| `/the-lineup/` + 5 single pages | The 5 core bottles: Blanco, Reposado, Añejo, Extra Añejo, Midnight Agave Reserve |
| `/characters/` + 8 single pages | Don Muerte, La Rosa Negra, Padre Proof, El Sepulturero, Cantina Jack, Campana Roja, Los Maracas, El Vigía |
| `/the-cantina/` | Room-by-room tour of the cantina, driven by `data/cantina.yaml` |
| `/merch/` + 5 single pages | Rest In Proof Tee, RIP Tequila Hat, Bell Coaster Set, Glyph Sticker Sheet, Social Club Card |
| `/find-us/` | Deadpan "no storefront" press/collab contact page |
| `/don-muerte-social-club/` | Free membership pitch |
| `/member-benefits/` | Membership perks ledger |
| `/drops/` | Limited-release listing |
| `/faq/` | Deadpan Q&A, including the one page allowed to say plainly what the brand is |
| `/parody-disclaimer/`, `/responsible-language/`, `/privacy/`, `/terms/` | Legal/meta cluster — see voice rules |
| `/404/` | Desert-crossroads themed error page |

Main nav (weighted, `hugo.yaml`): Our Story → The Lineup → Characters →
Merch → The Cantina → Find Us. Footer nav (`data/navigation.yaml`) adds five
columns: The Brand, The Lineup, Characters, Merch, Club/Info, plus a social
links block (Instagram/TikTok/YouTube).

One character and one bottle cross-reference each other in content (Don
Muerte ↔ RIP Añejo is the shipped example) so "meet the host, buy what he
pours" is discoverable without a search feature.

---

## 4. Content model

Hugo content, no CMS. Front matter fields are load-bearing — templates read
them directly, so a missing field is a silent visual gap, not a build error.

**Section hero front matter** (`_index.md` files): `eyebrow`, `headline`,
`description`, `seo_title`, `seo_description`, `cta_label`, `cta_href`,
`icon`. Markdown body renders below the hero inside `.editorial-section` via
`{{ if .Content }}...{{ end }}` — every list template that has body copy
below its hero must render `.Content`, or that copy silently disappears.

**Lineup products** (`content/the-lineup/*.md`): `weight`, `variant`,
`accent` (color token name), `icon`, `line` (tagline), `descriptor`,
`detail_headline`, plus SEO fields. Body includes a `## Concept tasting
notes` section (Aroma/Palate/Finish/Pairing) — parody tasting-note copy,
never real ABV or production claims.

**Characters** (`content/characters/*.md`): `weight`, `role`, `accent`,
`prop` (signature object), `icon`, `line` (catchphrase), plus SEO fields.
Body ends with a "what he/she pours" callout linking to their bottle.

**Merch products** (`content/merch/*.md`): `weight`, `category`, `accent`,
`icon`, `image`, `line`, `price`, `deckle_icon`, `deckle_quote`, `quote`,
`built_for` (list of `{icon, text}`), plus SEO fields. Current `category`
values: Apparel, Headwear, Barware, Stickers, Club Goods.

> **Contract:** the merch list template derives its category-filter tabs
> from the `category` values present in content at build time — it must
> never hardcode the tab list. A hardcoded list silently drops a new/renamed
> category out of the filter UI the next time a product is added, with no
> build error to catch it.

**Cantina rooms** (`data/cantina.yaml`, not content pages — no per-room SEO
needed): `id`, `title`, `image`, `desc` (inline HTML allowed, for
`<strong>` character-name emphasis), `character`, `character_href`.

**Front-matter fields must stay live.** If a template rewrite stops reading
a field (e.g. a `feature: true` flag that used to drive `merch-card--
feature` styling), remove the field from content in the same change —
don't leave dead metadata that future editors will assume still does
something.

---

## 5. Design system

Two visual languages, deliberately kept separate — no third (no icon
fonts/CDNs, no photography, no 3D renders, no gradient/soft-UI "SaaS" look):

1. **Inline SVG glyph system** — `layouts/partials/glyph.html`. Every icon
   (nav, buttons, badges, category tags, footer, marquee dividers) is a
   hand-built inline `<svg>` on a 24×24 grid, ~2px chiseled strokes,
   geometric woodblock linework, wrapped in `<span class="rip-glyph
   rip-glyph--{name}">` so size/color are pure CSS modifiers
   (`assets/scss/components/_glyphs.scss`). Canonical set: `skull`, `bell`,
   `agave`, `monument`, `moon`, `cross`, `glass`, `lemon`, `cactus`,
   `barrel`, `eye`, `maracas`, `microphone`, `shovel`, `hat`, `shirt`,
   `card`, `stickers`, `coasters`, `scale`, `location`, `warning`, `book`,
   `door`, `crate`, `lock`, `people`, `arrow-right`, star variants
   (`star-burst`, `star-diamond`, `star-eight`, `star-cross`, `moon-star`),
   social marks (`social-instagram`, `social-tiktok`, `social-youtube`).
2. **Illustrated linocut/woodcut artwork** — `.webp` hero backdrops,
   character portraits, cantina room scenes, plus transparent `.png` bottle
   renders. Flat woodblock/screenprint style, heavy shadow, restrained
   palette, vintage paper-grain texture layered on top via the
   `paper-texture` mixin (`assets/scss/abstracts/_mixins.scss`, source
   `static/images/paper-grain-bg.webp`). Every page-level hero and every
   character/room card uses one of these — never a CSS-drawn shape standing
   in for real art.

**Color tokens** (`assets/scss/abstracts/_tokens.scss`):

| Token | Hex | Use |
|---|---|---|
| Obsidian Black | `#0D0D0D` | primary dark / background |
| Bone Cream | `#F2EDE0` | primary light / background |
| Sangre Red | `#B22222` | CTAs, warnings, primary accent |
| Agave Green | `#2E7D4F` | secondary organic accent |
| Antique Gold | `#C6A24A` | premium/VIP, Social Club |
| Deep Green | `#0F3D3E` | secondary accent (El Vigía) |

**Type:** Anton (display/posters/headlines, heavy uppercase) · Oswald
(eyebrows/labels/small caps) · Montserrat (body, 400/600/700/800). No serif,
no script, no horror/gothic display face — an earlier brand pitch called for
both; the shipped system intentionally uses two flat sans-serifs and one
condensed sans instead.

---

## 6. Template & partial inventory

\`\`\`
layouts/
├── _default/{baseof,list,single}.html   # baseof: skip-link → header → <main id="main-content"> → footer → scripts
├── index.html
├── 404.html
├── robots.txt
├── characters/{list,single}.html
├── the-lineup/{list,single}.html
├── merch/{list,single}.html
├── the-cantina/list.html
├── our-story/list.html
├── find-us/list.html
└── partials/
    ├── head.html, header.html, footer.html
    ├── glyph.html                        # the SVG glyph engine
    ├── page-hero.html                    # shared hero for simple content pages
    ├── character-card.html, product-card.html
    ├── json-ld.html, social-meta.html
    ├── scripts.html
    └── sections/
        ├── hero.html, brand-intro.html
        ├── product-preview.html, merch-preview.html
        ├── character-strip.html, evidence-preview.html
        ├── social-club.html, slogan-band.html
        └── disclaimer.html               # must render on /merch/ — see §4 contract note below
\`\`\`

`sections/disclaimer.html` renders the "No Actual Spirits. All the Spirit."
callout. It belongs on `/merch/` specifically, directly under the product
grid — that's the one page where a real purchase happens, so a merch-page
redesign must not quietly drop it in favor of the smaller sitewide footer
disclaimer alone.

---

## 7. Tech stack & build

- **Hugo** static site generator (extended, for SCSS pipeline).
- **SCSS**, compiled via Hugo's `css.Sass` (libsass under the hood — see the
  `@import` note below).
- **TypeScript** → vanilla JS for: mobile nav toggle (`aria-expanded`/
  `aria-hidden` + focus trap), newsletter/email-capture submit handler
  (returns in-world copy, e.g. "The manifest opens on the next round. Watch
  the road for the bell." — never a generic "Thanks for subscribing!"), and
  the merch category filter (toggles `is-active`, shows/hides
  `.merch-product-card` by `data-category`).
- No JS framework, no CSS framework, no icon library, no CMS.

\`\`\`json
// package.json
"scripts": {
  "dev": "hugo server --bind 127.0.0.1 --port 1313 --disableFastRender",
  "build": "hugo --gc --minify"
}
\`\`\`

**Sass transpiler gotcha:** `assets/scss/main.scss` uses `@import`, not
`@use`, on purpose. Hugo's `css.Sass` defaults to libsass, which never
implemented `@use` — it silently passes it through as literal CSS, the build
still exits 0, and you ship a ~285-byte stylesheet with no visible error.
Upgrade path if you ever need `@use` (module privacy, less global
namespace pollution): `npm install`, add `"transpiler": "dartsass"` to
`$sassOptions` in `head.html`, put `dart-sass` on `PATH` in CI, and add
explicit `@use` of tokens/mixins to every partial (`@use` is not
transitive). Until then, `@import` is correct, not legacy debt.

`markup.goldmark.renderer.unsafe: true` is set in `hugo.yaml` to allow raw
HTML in Markdown (used for inline `<strong>` emphasis in `cantina.yaml`
descriptions and similar). This is safe only because all content is owned —
revisit before ever accepting external/user-submitted Markdown.

---

## 8. Deployment

GitHub Actions (`.github/workflows/deploy.yml`) → GitHub Pages, on push to
`main` or manual dispatch:
1. Checkout (full history).
2. `actions/configure-pages` resolves the base URL.
3. Hugo extended (latest) build: `hugo --gc --minify --baseURL
   "<pages-base-url>/"`, with `HUGO_ENVIRONMENT=production`.
4. Upload `./public` as the Pages artifact, deploy.

No staging environment, no preview deploys, no build-time content
validation beyond Hugo's own build failing on broken template syntax.

---

## 9. Non-goals / guardrails

- No real e-commerce: merch pages link out, they don't take payment on-site.
- No real alcohol claims: no ABV, no production/distillation claims, no
  claims that would need real alcohol-marketing legal review.
- No photography, no stock icons, no 3D/AI-rendered "photoreal" scenes —
  breaks the linocut aesthetic and the parody's premise in one move.
- No copy that explains the joke outside the legal/meta cluster (§2).
- No template change that stops rendering `.Content` or a disclaimer partial
  without an equivalent replacement — both have silently regressed before
  during a redesign; treat their presence as testable, not just reviewable.
