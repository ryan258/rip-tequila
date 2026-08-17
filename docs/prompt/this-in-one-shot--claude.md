# Recreating RIP Tequila in One Shot (Claude version)

This is the prompt to hand Claude (or any frontier coding model) to regenerate the
**current** RIP Tequila site in a single pass. It supersedes
`this-in-one-shot--gemini.md`, which describes an earlier stage of the project — a
pure CSS/SVG build with no illustrated imagery and a five-page site. The live site
grew past that: it now ships hand-styled linocut/woodcut **illustration assets**
(hero posters, character portraits, cantina room scenes, bottle renders) alongside
the SVG glyph system, and it has ~20 routes, not 6.

Treat this file as documentation, not marketing copy — it's fine to name the
mechanism ("parody," "the joke") here even though the site's own body copy never
does that (see the voice rules in section 6).

---

## The One-Shot Prompt

```markdown
You are a senior frontend engineer and brand designer. Build a complete,
production-ready static site for a fictional parody tequila brand called
**RIP Tequila** — a premium spirits brand run by the deceased staff of an
afterlife cantina, "La Cantina del Último Trago."

Stack: **Hugo** (static site generator), modular **SCSS**, a small amount of
vanilla **TypeScript**, and a bespoke inline-SVG glyph system. No JS framework,
no CSS framework, no icon library, no photography, no AI-rendered "scenes."

---

### 1. The joke, precisely

RIP Tequila parodies ultra-premium spirits marketing — master-blender legacy
myths, three-generations-of-craft claims, solemn tasting notes, founder
mythology — by running that exact playbook through a cantina staffed entirely
by the dead, who take it exactly as seriously as a real luxury brand would.

The afterlife setting is the costume. The joke is that premium spirits
marketing already sounds unhinged, and this brand just says the quiet part
out loud. Every piece of copy should read as **real luxury-brand copy that
happens to be written by ghosts**, not as generic "spooky skull" humor. Fake
tasting notes, fake batch numbers, fake founder quotes, deadpan disclaimers —
yes. Horror-for-its-own-sake, jump scares, gore — no.

Voice rule: **the copy never explains itself.** Body copy, headlines, and nav
labels never use the words "parody," "fictional," "satire," or "joke" — the
brand plays it straight from inside its own world. Those words are allowed
only in two places: (a) `<meta>`/SEO/OG description tags, and (b) the
legal/responsibility pages (`/parody-disclaimer/`, `/terms/`,
`/privacy/`, `/responsible-language/`) and the small-print disclaimer
partial, where breaking character is the whole point.

---

### 2. Visual system

**Two coexisting visual languages, never mixed with anything else:**

1. **Inline SVG glyph system** (`layouts/partials/glyph.html`) — every icon on
   the site (nav, buttons, badges, category tags, footer) is a hand-built
   inline `<svg>` on a 24×24 grid, heavy 2px chiseled strokes, geometric
   woodblock linework. Zero icon-font or icon-CDN dependencies (no
   FontAwesome, no Lucide, no Heroicons). Build at minimum: `skull`, `bell`,
   `agave`, `monument`, `moon`, `cross`, `glass`, `lemon`, `cactus`, `barrel`,
   `eye`, `maracas`, `microphone`, `shovel`, `hat`, `shirt`, `card`,
   `stickers`, `coasters`, `scale`, `location`, `warning`, `book`, `door`,
   `crate`, `lock`, `people`, `arrow-right`, plus star variants
   (`star-burst`, `star-diamond`, `star-eight`, `star-cross`, `moon-star`)
   and social marks (`social-instagram`, `social-tiktok`, `social-youtube`).
   The partial takes a `name` and outputs a `<span class="rip-glyph
   rip-glyph--{name}">` wrapper so size/color are pure CSS modifiers.

2. **Illustrated linocut/woodblock artwork** — `.webp` hero backdrops,
   character portraits, and cantina room scenes, plus transparent `.png`
   bottle renders for the-lineup pages. These are full illustrations (not
   photography, not 3D renders, not stock art): flat woodblock/screenprint
   style, heavy shadows, restrained palette, vintage paper-grain texture
   layered on top via a `paper-texture` SCSS mixin. Every page-level hero
   section and every character/cantina-room card gets one of these as its
   art, not a CSS shape.

No photography anywhere. No gradients-and-drop-shadow "modern SaaS" look. No
rounded-corner soft-UI cards. Flat color fields, hard edges, heavy type.

**Color palette (fixed, do not invent variants):**
| Token | Hex | Use |
|---|---|---|
| Obsidian Black | `#0D0D0D` | primary dark / background |
| Bone Cream | `#F2EDE0` | primary light / background |
| Sangre Red | `#B22222` | CTAs, warnings, primary accent |
| Agave Green | `#2E7D4F` | secondary organic accent |
| Antique Gold | `#C6A24A` | premium/VIP, Social Club |
| Deep Green | `#0F3D3E` | secondary accent (El Vigía) |

**Type:**
- Display / posters / headlines: **Anton**, heavy uppercase.
- Eyebrows / labels / small caps: **Oswald**, semibold/bold.
- Body copy: **Montserrat**, regular/600/700/800.
No serif, no script, no gothic/horror display face — those were in the
original brand pitch and were deliberately dropped.

---

### 3. Site architecture

Generate this Hugo project layout:

\`\`\`
rip-tequila/
├── hugo.yaml
├── package.json                  # scripts: dev (hugo server), build (hugo --gc --minify)
├── data/
│   ├── navigation.yaml           # footer link columns + social links
│   ├── slogans.yaml               # glyph-paired slogan strip items
│   └── cantina.yaml               # 7 cantina room entries (title/image/desc/character)
├── content/
│   ├── _index.md                  # homepage front matter
│   ├── our-story/_index.md
│   ├── the-lineup/
│   │   ├── _index.md
│   │   ├── rip-blanco.md
│   │   ├── rip-reposado.md
│   │   ├── rip-anejo.md
│   │   ├── rip-extra-anejo.md
│   │   └── midnight-agave-reserve.md
│   ├── characters/
│   │   ├── _index.md
│   │   ├── don-muerte.md
│   │   ├── la-rosa-negra.md
│   │   ├── padre-proof.md          # role: Confessor (implied, not in this file)
│   │   ├── el-sepulturero.md
│   │   ├── cantina-jack.md
│   │   ├── campana-roja.md
│   │   ├── los-maracas.md
│   │   └── el-vigia.md
│   ├── merch/
│   │   ├── _index.md
│   │   ├── rest-in-proof-tee.md
│   │   ├── rip-tequila-hat.md
│   │   ├── bell-coaster-set.md
│   │   ├── glyph-sticker-sheet.md
│   │   └── social-club-card.md
│   ├── the-cantina/_index.md
│   ├── find-us/_index.md
│   ├── don-muerte-social-club/_index.md
│   ├── member-benefits/_index.md
│   ├── drops/_index.md
│   ├── faq/_index.md
│   ├── parody-disclaimer/_index.md
│   ├── responsible-language/_index.md
│   ├── privacy/_index.md
│   └── terms/_index.md
├── layouts/
│   ├── _default/{baseof,list,single}.html
│   ├── index.html
│   ├── 404.html
│   ├── robots.txt
│   ├── characters/{list,single}.html
│   ├── the-lineup/{list,single}.html
│   ├── merch/{list,single}.html
│   ├── the-cantina/list.html
│   ├── our-story/list.html
│   ├── find-us/list.html
│   └── partials/
│       ├── head.html
│       ├── header.html
│       ├── footer.html
│       ├── glyph.html
│       ├── page-hero.html
│       ├── character-card.html
│       ├── product-card.html
│       ├── json-ld.html
│       ├── social-meta.html
│       ├── scripts.html
│       └── sections/
│           ├── hero.html
│           ├── brand-intro.html
│           ├── product-preview.html
│           ├── merch-preview.html
│           ├── character-strip.html
│           ├── evidence-preview.html
│           ├── social-club.html
│           ├── slogan-band.html
│           └── disclaimer.html
├── archetypes/default.md
└── assets/
    ├── scss/
    │   ├── main.scss
    │   ├── abstracts/{_tokens,_mixins}.scss
    │   ├── base/_reset.scss
    │   ├── layout/{_header,_footer}.scss
    │   ├── components/{_buttons,_cards,_forms,_glyphs}.scss
    │   └── pages/{_home,_catalog,_detail,_merch,_cantina,_story,_find-us}.scss
    └── ts/
        └── main.ts
\`\`\`

Static assets go under `static/images/`: root-level page hero backdrops
(`hero-poster-bg.webp`, `lineup-hero-bg.webp`, `characters-hero-bg.webp`,
`merch-hero-bg.webp`, `cantina-archway-bg.webp`, `cantina-story-bg.webp`,
`social-club-bg.webp`, `404-bg.webp`, `paper-grain-bg.webp`), plus
subfolders `cast/` (8 character portraits), `cantina/` (7 room scenes +
portal hero + El Vigía desert scene), `bottles/` (5 transparent bottle PNGs
for the-lineup), and `merch/` (per-product shots + a hero montage + evidence
locker crate).

---

### 4. Configuration

`hugo.yaml`:
\`\`\`yaml
baseURL: "https://riptequila.com"
locale: "en-US"
title: "RIP Tequila"
disableKinds: [taxonomy, term]
enableRobotsTXT: true
markup:
  goldmark:
    renderer:
      unsafe: true   # owned content only — do not turn this on if you ever accept external markdown
menus:
  main:
    - {name: "Our Story", pageRef: "/our-story/", weight: 10}
    - {name: "The Lineup", pageRef: "/the-lineup/", weight: 20}
    - {name: "Characters", pageRef: "/characters/", weight: 30}
    - {name: "Merch", pageRef: "/merch/", weight: 40}
    - {name: "The Cantina", pageRef: "/the-cantina/", weight: 50}
    - {name: "Find Us", pageRef: "/find-us/", weight: 60}
params:
  description: "A premium parody tequila brand from La Cantina del Último Trago — the afterlife cantina behind RIP Tequila."
  tagline: "Rest In Proof"
  copyright: "RIP Tequila. La Cantina del Último Trago."
  googleFonts: "https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@400;600;700;800&family=Oswald:wght@500;700&display=swap"
  cta_label: "Enter the Cantina"
  cta_href: "/the-cantina/"
\`\`\`

`data/navigation.yaml` drives the footer: five link columns (The Brand, The
Lineup, Characters, Merch, Club/Info) plus a social-links block
(Instagram/TikTok/YouTube, each paired with a glyph name).

---

### 5. Content model (front matter you must support)

Every content type has its own front-matter schema — templates read these
fields directly, so keep them exact:

- **Page heroes** (`_index.md` for top-level sections): `eyebrow`, `headline`,
  `description`, `seo_title`, `seo_description`, `cta_label`, `cta_href`,
  `icon`. Body markdown renders in an `.editorial-section` below the hero.
- **Lineup products** (`the-lineup/*.md`): `weight`, `variant`, `accent`
  (color token name), `icon`, `line` (tagline), `descriptor`,
  `detail_headline`. Body includes an `## Concept tasting notes` section with
  Aroma/Palate/Finish/Pairing bullets — parody tasting-note copy, not real
  ABV/production claims.
- **Characters** (`characters/*.md`): `weight`, `role`, `accent`, `prop`
  (signature object), `icon`, `line` (catchphrase). Body ends with a "What he
  pours" / linked bottle callout.
- **Merch products** (`merch/*.md`): `weight`, `category`, `accent`, `icon`,
  `image`, `line`, `price`, `deckle_icon`, `deckle_quote`, `quote`,
  `built_for` (list of `{icon, text}`). `category` values in the current
  catalog: Apparel, Headwear, Barware, Stickers, Club Goods — **the merch
  list template must derive its category-filter tabs from these values at
  build time, never hardcode the tab list**, so a new category can't
  silently fall out of the filter UI.
- **Cantina rooms** (`data/cantina.yaml`, not content pages): `id`, `title`,
  `image`, `desc` (HTML allowed inline for `<strong>` character name
  emphasis), `character`, `character_href`.

Eight characters, five core bottles, five merch products (seed set) — one
character and one bottle should cross-reference each other (e.g. Don Muerte
→ RIP Añejo) so the "meet the host, buy the bottle he pours" loop is
discoverable without a search feature.

---

### 6. Page-by-page build list

- **Homepage** (`layouts/index.html`): stacked sections — hero (headline +
  illustrated poster art), brand intro (cantina origin story), product
  lineup preview (bottle grid linking to `the-lineup`), evidence-locker
  preview, character strip, social-club callout, slogan marquee band pulling
  from `data/slogans.yaml`.
- **The Lineup** (list + single): catalog of the 5 bottles; each single page
  gets its bottle art, tasting notes, and host-character quote.
- **Characters** (list + single): the 8-person afterlife staff, one card
  each with portrait, role, prop, catchphrase.
- **The Cantina**: room-by-room tour driven by `data/cantina.yaml` — each
  room maps to the character who owns it.
- **Merch** (list + single): hero, editorial body copy (`.Content`), value
  pillars, product grid with client-side category filter, evidence-locker
  showcase, social-club callout, disclaimer section, marquee band. The
  responsibility/legal disclaimer (`sections/disclaimer.html`) must render
  on this page specifically — it's the one page where a real transaction
  happens ("the merch can ship"), so don't let a redesign quietly drop it.
- **Find Us**: deadpan "no storefront" contact/press page with a stylized
  map/coordinates motif — press inquiries route through the Social Club, not
  a contact form.
- **Don Muerte Social Club** + **Member Benefits**: free "membership" pitch
  and perks ledger — no real payment flow, just an email-capture CTA.
- **Drops, FAQ**: standard content list pages using the shared hero +
  editorial-section pattern.
- **Legal/meta cluster** (`parody-disclaimer`, `responsible-language`,
  `privacy`, `terms`): the only pages where the site is allowed to say
  "parody," "fictional," and "please drink responsibly" outright.
- **404**: desert-crossroads themed, uses `404-bg.webp`.

---

### 7. Interactive scripting (`assets/ts/main.ts`)

Compile straight to vanilla JS, no framework:
1. Mobile nav toggle managing `aria-expanded`/`aria-hidden` with focus trap.
2. Newsletter/email-capture submit handler returning in-world copy (e.g. "The
   manifest opens on the next round. Watch the road for the bell.") — never a
   generic "Thanks for subscribing!"
3. Merch category filter: toggles `is-active` on filter buttons and
   shows/hides `.merch-product-card` elements by `data-category`, matching
   the categories the merch template derived from content in section 5.

Write every file completely — no stub comments, no `// TODO`, no partial
implementations. Run a Hugo build at the end and confirm zero errors before
calling it done.
\`\`\`

---

## Why this prompt works

1. **The joke is specified as a mechanism, not a vibe.** "Ultra-premium
   spirits marketing parody, played straight" gives the model a concrete
   filter for every line of copy it writes, instead of generic
   Halloween-skull humor.
2. **Two visual languages are named explicitly and never allowed to blur.**
   Glyphs are vector/geometric; hero and character art is illustrated
   linocut. A model left to improvise tends to reach for stock icon fonts or
   photorealistic renders — ruling both out by name is what keeps the poster
   aesthetic intact.
3. **The content model section prevents template/content drift.** Naming
   the exact front-matter fields each template reads (and calling out the
   category-filter derivation rule specifically) heads off the class of bug
   this repo has actually hit before: a template redesign that silently
   drops a field or a UI element nothing else notices is missing.
4. **The voice rule is a testable constraint.** "Never say parody/fictional
   in body copy, only in meta tags and the legal cluster" is something you
   can grep for after generation, not just a style suggestion.
