# Recreating RIP Tequila in One Shot

If you wanted to build the entire **RIP Tequila** site from scratch using a single prompt on a high-context, frontier AI model (such as Claude 3.5 Sonnet, Gemini 1.5 Pro, or GPT-4o), this document provides the exact prompt to use.

---

## The One-Shot Prompt

Copy and paste the entire block below into your AI assistant.

```markdown
You are a senior frontend engineer and creative designer. Your task is to build a complete, production-ready static site prototype for a fictional parody tequila brand called **RIP Tequila**.

The website is powered by **Hugo** (Static Site Generator) using modular SCSS, TypeScript, and a bespoke inline SVG glyph system. The branding blends premium spirits marketing conventions with absurd, dark comedy set around an afterlife tavern: "La Cantina del Último Trago."

---

### 1. Brand Guidelines & Visual System

You must strictly adhere to the following visual rules. Any deviation breaks the aesthetic.

*   **Color Palette (The Afterlife Palette):**
    *   `Midnight Obsidian Black`: `#0D0D0D` (Core background and primary dark color)
    *   `Bone Cream`: `#F2EDE0` (Core background and primary light text/card color)
    *   `Sangre Red`: `#B22222` (Primary brand accent, warning/alert outlines, CTAs)
    *   `Agave Green`: `#2E7D4F` (Secondary brand accent for organic elements)
    *   `Grave Gold`: `#C6A24A` (Premium/VIP styling, Social Club motifs)
    *   `Deep Green`: `#0F3D3E` (Accent for specific character components)
*   **The Aesthetic (Flat Linocut / Screenprint):**
    *   Zero external image CDNs, photo assets, or generic modern UI icon libraries (like FontAwesome or Lucide).
    *   Typography and copy carry the brand weight. Icons are built strictly from a chiseled 2px-stroke geometric vector glyph set.
    *   Images are linocut/woodblock illustrations with strong shadows and vintage paper grain overlays.
    *   **CSS Bottle Shapes:** To maintain the flat mid-century poster style, tequila bottles in the lineup must be drawn as CSS shapes (pure HTML/CSS) with custom gradient labels carrying their respective brand glyph marks.
*   **Typography:**
    *   Titles & Posters: A bold display font (e.g., `Anton` or `Oswald`) in heavy uppercase.
    *   Subheaders & Eyebrows: Compact display sans-serif (e.g., `Oswald` or `Montserrat` semibold/bold).
    *   Body Copy: Clean, legible sans-serif (e.g., `Montserrat` or `Inter` regular).

---

### 2. Project Directory Structure

Generate the project using this layout:

```
rip-tequila/
├── hugo.yaml
├── package.json
├── data/
│   ├── navigation.yaml
│   └── slogans.yaml
├── content/
│   ├── _index.md
│   ├── our-story/
│   │   └── _index.md
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
│   │   ├── el-sepulturero.md
│   │   └── la-rosa-negra.md
│   ├── merch/
│   │   ├── _index.md
│   │   ├── rest-in-proof-tee.md
│   │   ├── rip-tequila-hat.md
│   │   └── social-club-card.md
│   ├── the-cantina/
│   │   └── _index.md
│   └── find-us/
│       └── _index.md
├── layouts/
│   ├── _default/
│   │   ├── baseof.html
│   │   ├── list.html
│   │   └── single.html
│   ├── index.html
│   ├── 404.html
│   ├── partials/
│   │   ├── head.html
│   │   ├── header.html
│   │   ├── footer.html
│   │   ├── glyph.html
│   │   ├── page-hero.html
│   │   ├── scripts.html
│   │   └── sections/
│   │       ├── hero.html
│   │       ├── brand-intro.html
│   │       ├── product-preview.html
│   │       ├── character-strip.html
│   │       ├── evidence-preview.html
│   │       └── social-club.html
│   └── the-lineup/
│       ├── list.html
│       └── single.html
└── assets/
    ├── scss/
    │   ├── main.scss
    │   ├── abstracts/
    │   │   ├── _tokens.scss
    │   │   └── _mixins.scss
    │   ├── base/
    │   │   └── _reset.scss
    │   ├── layout/
    │   │   ├── _header.scss
    │   │   └── _footer.scss
    │   ├── components/
    │   │   ├── _buttons.scss
    │   │   ├── _cards.scss
    │   │   ├── _forms.scss
    │   │   └── _glyphs.scss
    │   └── pages/
    │       ├── _home.scss
    │       ├── _catalog.scss
    │       ├── _detail.scss
    │       ├── _merch.scss
    │       └── _cantina.scss
    └── ts/
        └── main.ts
```

---

### 3. Core File Implementations

Implement the following critical components of the system:

#### A. Configuration: `hugo.yaml`
Define the main configurations including parameters for the visual layout, active menus, and typography links:
```yaml
baseURL: "https://riptequila.com"
locale: "en-US"
title: "RIP Tequila"
disableKinds:
  - taxonomy
  - term
enableRobotsTXT: true
markup:
  goldmark:
    renderer:
      unsafe: true
menus:
  main:
    - name: "Our Story"
      pageRef: "/our-story/"
      weight: 10
    - name: "The Lineup"
      pageRef: "/the-lineup/"
      weight: 20
    - name: "Characters"
      pageRef: "/characters/"
      weight: 30
    - name: "Merch"
      pageRef: "/merch/"
      weight: 40
    - name: "The Cantina"
      pageRef: "/the-cantina/"
      weight: 50
    - name: "Find Us"
      pageRef: "/find-us/"
      weight: 60
params:
  description: "A premium parody tequila brand from La Cantina del Último Trago."
  tagline: "Rest In Proof"
  copyright: "RIP Tequila. La Cantina del Último Trago."
  googleFonts: "https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@400;600;700;800&family=Oswald:wght@500;700&display=swap"
  cta_label: "Enter the Cantina"
  cta_href: "/the-cantina/"
```

#### B. SVG Glyph Language Engine: `layouts/partials/glyph.html`
Write a template system matching names/aliases to inline responsive geometric SVG paths (all inside a wrapper `<span class="rip-glyph rip-glyph--{{ $name }}" ...>`). Ensure you implement at least these canonical glyphs:
*   `skull` (Don Muerte chiseled skull)
*   `bell` (Mission death bell)
*   `agave` (Spiky geometric agave plant)
*   `monument` (Arched tombstone)
*   `moon` (Crescent afterlife moon)
*   `cross` (Mission iron cross)
*   `glass` (Tasting copita + lime wedge)
*   `lemon` (Citrus slice)
*   `cactus` (Saguaro silhouette)
*   `barrel` (Aging cask)
*   `eye` (Mystic watcher eye for El Vigía)
*   `rose` (Afterlife rose for La Rosa Negra)
*   `star-burst`, `star-diamond`, `star-eight`, `star-cross`, `moon-star` (Product label stars)
*   `social-instagram`, `social-tiktok`, `social-youtube` (Social links)

#### C. SCSS Design Tokens: `assets/scss/abstracts/_tokens.scss`
Implement styling variables:
```scss
// Brand Colors
$color-black: #0d0d0d;
$color-cream: #f2ede0;
$color-red: #b22222;
$color-green: #2e7d4f;
$color-gold: #c6a24a;

// Typography Fonts
$font-title: 'Anton', sans-serif;
$font-accent: 'Oswald', sans-serif;
$font-body: 'Montserrat', sans-serif;

// Transitions & Spacing
$transition-fast: 0.15s ease-out;
$transition-base: 0.25s ease-out;
$space-xs: 0.5rem;
$space-sm: 1rem;
$space-md: 1.5rem;
$space-lg: 2rem;
$space-xl: 3rem;

$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
```

#### D. Base layout: `layouts/_default/baseof.html`
Provide a default wrapper enclosing `<head>`, global header navigation, a `<main id="main-content">` wrapper, footer, and scripts. Make sure there is a paper texture grain overlay mixin applied globally to the background:
```scss
@mixin paper-texture {
  background-image: url('/images/paper-grain-bg.webp');
  background-repeat: repeat;
}
```

---

### 4. Detailed Section Specifications

Please implement layouts and templates for the following pages:

*   **Homepage (`layouts/index.html`):** A composition of responsive, stacked blocks:
    1.  *Hero Section:* Left column displays bold typography ("DRINK TODAY. REST TOMORROW.") and brand taglines, right column displays a large geometric woodblock layout.
    2.  *Brand Intro:* Left-aligned narrative section with a large woodcut portal icon/illustration describing "La Cantina del Último Trago" as the origin point.
    3.  *Product Lineup Preview:* A grid featuring CSS bottle shapes with hover animations pointing to individual tequila markdown pages.
    4.  *Character Strip:* Horizontal row showing character card cards (e.g. Don Muerte, Padre Proof, El Sepulturero) with woodcut icons, titles, and hover transitions.
    5.  *Social Club Banner:* An eye-catching dark callout (Obsidian/Gold) prompting users to "Join the RIP Social Club for Early Access & Dispatches" with a sign-up form field.
*   **The Lineup (Tequila Catalog `layouts/the-lineup/list.html`):**
    *   Displays all 5 tequila products.
    *   Each bottle is represented via custom CSS shapes and gradients:
        *   *Blanco:* Crystal-clear shape with silver/green label and `star-burst` glyph.
        *   *Reposado:* Warm pale gold shape with green/cream label and `star-diamond` glyph.
        *   *Añejo:* Rich amber shape with black/gold label and `star-eight` glyph.
        *   *Extra Añejo:* Dark mahogany shape with red/gold label and `star-cross` glyph.
        *   *Midnight Agave Reserve:* Matte black shape with dark blue/gold label and `moon-star` glyph.
*   **Characters Page (`layouts/characters/list.html`):**
    *   An index of the afterlife cantina crew. Showcases each cast member with their name, role, signature tool/icon, and description in card layouts.
*   **Merch Page (`layouts/merch/list.html`):**
    *   Catalog displaying "Artifacts & Evidence" available for purchase (parody items).
    *   Must include a client-side JavaScript tab category filter ("All", "Apparel", "Barware", "Club Goods") and an "Evidence Locker" showcase.
*   **Find Us Page (`layouts/find-us/list.html`):**
    *    absurb, deadpan map locator instructing visitors on "How to find La Cantina del Último Trago." Uses woodcut landmark maps, custom desert compass pointers, and mock coordinates.

---

### 5. Interactive Scripting: `assets/ts/main.ts`

Ensure the script compiles to native JavaScript and contains robust logic for:
1.  **Mobile Navigation Toggle:** Accessible menu toggle that manages ARIA attributes (`aria-expanded`, `aria-hidden`) and traps tab focus inside the mobile overlay menu when open.
2.  **Newsletter Submission:** Intercept email sign-up form submits and output the parody response: *"The manifest opens on the next round. Watch the road for the bell."*
3.  **Client-Side Catalog Filtering:** In the merch page layout, manage button states (`is-active`) and show/hide product card items depending on the category dataset attributes.

Please write the entire, fully fleshed-out code files, layouts, configuration, and SCSS pages to form a complete, working prototype. Ensure no files are left with stub comments.
```

---

## Why This Prompt Works

1.  **Strict Boundary Conditions:** Specifying that the assistant cannot use external CDNs, photography, or icon libraries prevents it from injecting modern, generic styles that conflict with the linocut look.
2.  **Component blueprints:** Pre-defining `hugo.yaml`, token models, and SVG structures limits the model's variation, assuring proper Hugo architecture out-of-the-box.
3.  **Explicit Page Descriptions:** Directly defining the parody copy targets and CSS bottle shape details ensures the AI understands how to display bottle graphics without requiring heavy file uploads.
