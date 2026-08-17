# RIP Tequila — Site Spec (Gemini CSS/SVG Edition)

This document is the reference specification for the lightweight, pure CSS/SVG edition of the RIP Tequila website (the target build for `docs/prompt/this-in-one-shot--gemini.md`). 

Unlike the asset-heavy Claude edition which relies on external `.webp` and `.png` illustration/portrait assets, this specification defines a system where all bottle graphics are drawn using **pure CSS shapes and gradients**, and all iconography/illustrations are rendered via inline **SVG vector glyphs**.

---

## 1. Product Overview

**RIP Tequila** is a fictional parody spirits brand: the house label of "La Cantina del Último Trago," an afterlife cantina staffed by deceased characters who pour five bottles with the total sincerity of a real luxury spirits company. It is a static marketing/brand site—no real cart, checkout, or real product transactions.

**What it's parodying:** Ultra-premium spirits marketing conventions—master-blender legacy stories, small-batch mythology, craft claims, and celebrity-tequila gold rushes. The afterlife setting is the costume; the joke is that premium spirits marketing already sounds a little unhinged, and this brand just says the quiet part out loud.

**Gut-check for copy:**
*   **On target:** Fake tasting notes, mock founder/legacy claims, fake batch numbers/seals, and parodies of how premium brands market themselves.
*   **Off target:** Copy that is simply "spooky" or "skull" themed for its own sake with no premium-brand marketing parody underneath.

---

## 2. Voice Rules

*   The brand **never labels its own joke**. Body copy, headlines, and nav labels never use words like "parody," "fictional," "satire," or "joke"—it plays straight from inside its own world.
*   **Exceptions (where breaking character is required):** `<meta>` SEO/OG tags, and the legal/responsibility cluster (`/parody-disclaimer/`, `/terms/`, `/privacy/`, `/responsible-language/`). Only here does the copy state "No actual spirits are sold here."
*   Character voice is deadpan and dry, never typical horror. Don Muerte "has never confirmed the presence of a skull" under his sombrero.

---

## 3. Information Architecture

The Gemini edition features a compact 6-page site structure:

| Route | Purpose |
|---|---|
| `/` | Homepage — hero, brand intro, product preview, evidence-locker preview, character strip, social-club callout, slogan marquee |
| `/our-story/` | Cantina origin narrative |
| `/the-lineup/` + 5 single pages | The 5 core bottles (CSS-drawn): Blanco, Reposado, Añejo, Extra Añejo, Midnight Agave Reserve |
| `/characters/` + 3 single pages | Don Muerte, El Sepulturero, La Rosa Negra |
| `/merch/` + 3 single pages | Rest In Proof Tee, RIP Tequila Hat, Social Club Card |
| `/find-us/` | Deadpan "no storefront" contact page with coordinate mapping |
| `/404/` | Desert-crossroads themed error page |

*   **Main Navigation:** Our Story → The Lineup → Characters → Merch → Find Us.
*   **Footer Navigation:** Simple column layout (The Brand, The Lineup, Characters, Merch, Info) plus social links block (Instagram/TikTok/YouTube).

---

## 4. Content Model

All content is managed through Hugo content files with markdown and front-matter, with no external database/CMS.

*   **Homepage (`content/_index.md`):** Uses front-matter metadata to drive hero blocks and layouts.
*   **Lineup products (`content/the-lineup/*.md`):** Front-matter fields: `weight`, `variant`, `accent` (color token), `icon`, `line` (tagline), `descriptor`, `detail_headline`, plus SEO fields.
*   **Characters (`content/characters/*.md`):** Front-matter fields: `weight`, `role`, `accent`, `prop` (signature object), `icon`, `line` (catchphrase).
*   **Merch products (`content/merch/*.md`):** Front-matter fields: `weight`, `category` (Apparel, Headwear, Barware, Club Goods), `accent`, `icon`, `line`, `price`.

---

## 5. Pure CSS & SVG Design System

This edition is engineered to have **zero external asset dependencies** (no illustration image files or photography). The visual interface is entirely constructed from code:

### 1. Inline SVG Glyph Engine (`layouts/partials/glyph.html`)
Every icon on the site is an inline SVG drawn on a 24×24 grid with a consistent 2px chiseled stroke and geometric woodblock linework. The engine processes name/icon parameters and wraps them in a `<span class="rip-glyph rip-glyph--{name}">` wrapper for CSS manipulation.
*   **Canonical Glyph Set:** `skull`, `bell`, `agave`, `monument`, `moon`, `cross`, `glass`, `lemon`, `cactus`, `barrel`, `eye`, `rose`, `hat`, `shirt`, `card`, `stickers`, `coasters`, `scale`, `location`, `warning`, `book`, `door`, `crate`, `lock`, `people`, `arrow-right`, plus label-specific stars (`star-burst`, `star-diamond`, `star-eight`, `star-cross`, `moon-star`).

### 2. CSS-Generated Tequila Bottles
Tequila bottle graphics on `/the-lineup/` are built using layered HTML elements and CSS shapes, styled with specific CSS gradients and border radii:
*   **Blanco:** Crystal-clear glass shape, silver/green label, featuring the `star-burst` glyph.
*   **Reposado:** Light amber/pale gold shape, green/cream label, featuring the `star-diamond` glyph.
*   **Añejo:** Deep amber shape, black/gold label, featuring the `star-eight` glyph.
*   **Extra Añejo:** Dark mahogany shape, red/gold label, featuring the `star-cross` glyph.
*   **Midnight Agave Reserve:** Matte black obsidian shape, deep blue/gold label, featuring the `moon-star` glyph.

### 3. Color Tokens (`assets/scss/abstracts/_tokens.scss`)
The visual system utilizes five strict brand colors:
*   `Midnight Obsidian Black` (`#0D0D0D`): Core dark backgrounds.
*   `Bone Cream` (`#F2EDE0`): Core light fields & body text.
*   `Sangre Red` (`#B22222`): CTAs, alerts, active borders.
*   `Agave Green` (`#2E7D4F`): Organic brand accents.
*   `Grave Gold` (`#C6A24A`): Premium highlights & Social Club.

---

## 6. Template Inventory

```
layouts/
├── _default/
│   ├── baseof.html   # skip-link → header → <main> → footer → scripts
│   ├── list.html
│   └── single.html
├── index.html
├── 404.html
├── robots.txt
├── characters/
│   ├── list.html
│   └── single.html
├── the-lineup/
│   ├── list.html
│   └── single.html
├── merch/
│   ├── list.html
│   └── single.html
└── partials/
    ├── head.html
    ├── header.html
    ├── footer.html
    ├── glyph.html        # SVG glyph engine
    ├── page-hero.html
    ├── scripts.html
    └── sections/
        ├── hero.html
        ├── brand-intro.html
        ├── product-preview.html
        ├── character-strip.html
        ├── evidence-preview.html
        └── social-club.html
```

---

## 7. Tech Stack & Compilation

*   **Hugo:** Static site generator (extended edition) for handling compiled Sass.
*   **Sass (SCSS):** Compiled via Hugo's `css.Sass` pipeline. Uses traditional `@import` directives for libsass compatibility.
*   **TypeScript:** Compiles to ES6 vanilla JS managing:
    1.  *Mobile Navigation:* ARIA toggle states and modal-focus trapping.
    2.  *Newsletter Override:* Prevents default form submissions and returns deadpan mock responses.
    3.  *Merch Filter:* Client-side filtering script toggling active classes and visibility on `.merch-product-card` based on selected category datasets.

---

## 8. Guardrails & Non-Goals

*   **No photographic assets or external illustration WebPs:** Bottle renderings and page assets must remain code-defined (CSS shapes and SVG curves).
*   **No e-commerce transaction systems:** All merch cards link off-site.
*   **No literal ABV or distillation specifications:** ABV must remain parodied or unspecified.
