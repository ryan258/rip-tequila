# RIP Tequila Roadmap & Capability Ledger

This document tracks current capabilities, active prototype gates, and future milestones for the RIP Tequila site and brand world.

---

## Current State

RIP Tequila is a fully static Hugo site presenting a parody spirits brand centered on **La Cantina del Último Trago**. The project is built with zero runtime framework dependencies, custom SCSS/TypeScript pipelines, and an inline SVG glyph language.

### Core Completed Capabilities

1. **The Lineup**
   - Five distinct bottle expressions: Blanco, Reposado, Añejo, Extra Añejo, and Midnight Agave Reserve.
   - Parody tasting notes, service rituals, and officially unverifiable technical manifests.
   - Strict regulatory compliance: zero real ABV percentages, proof numbers, or 100% agave claims.

2. **The Cantina & Character Dossiers**
   - Eight afterlife cantina characters: Don Muerte, La Rosa Negra, Padre Proof, El Sepulturero, Cantina Jack, Campana Roja, Los Maracas, and El Vigía.
   - Cross-linked geography cards connecting rooms to character dossiers (`data/cantina.yaml`).
   - Party duty assignments for party guest roles.

3. **Halloween Party Kit (`/party/`)**
   - Offline party preparation hub: in-browser guest list input and randomized character role shuffle.
   - Printable US Letter layouts with `@media print` stylesheets:
     - Don Muerte Social Club membership cards (10/sheet).
     - Bell coasters (6 designs/sheet).
     - Cast placards assigning guests to characters and duties.
   - Resilient client storage: graceful warning cues when browser storage is blocked or volatile (`assets/ts/party.ts`).
   - Targeted Node unit test suite (`tests/party-storage.test.cjs`).

4. **Visual System & Motion Engine**
   - Bespoke 27+ inline SVG glyph set rendered via `layouts/partials/glyph.html`.
   - Rich linocut and vintage screenprint textures.
   - Hero looping motion poster with automatic deferral under `saveData` and `prefers-reduced-motion` compliance.

5. **Tooling & Code Intelligence**
   - GitNexus code intelligence index and skills (`.claude/skills/gitnexus-*/`).
   - Pinned CI Hugo extended deployment workflow (`0.166.0`).

---

## Active Prototype Gates

The site configuration in `hugo.yaml` explicitly enforces prototype feature gates to keep marketing copy and UI aligned with reality:

```yaml
params:
  features:
    commerce: false
    social_club_enrollment: false
```

- **`commerce: false`**: Merch and drops are labeled as concept artifacts. Prices are marked as concept estimates, and ordering pathways remain dormant.
- **`social_club_enrollment: false`**: Email collection forms are replaced with preview CTAs. No visitor email addresses are captured, stored, or transmitted.

---

## Future Milestones

### Milestone 1: External Commerce Integration
- [ ] Connect confirmed external merchandise production and fulfillment partner (e.g. screenprinted posters, pins, tees).
- [ ] Update shipping, return, and order terms in `content/terms/_index.md`.
- [ ] Link merch single pages directly to external checkout endpoints.
- [ ] Enable `params.features.commerce: true`.

### Milestone 2: Social Club Newsletter Pipeline
- [ ] Select external privacy-compliant email service provider.
- [ ] Implement secure double opt-in submission endpoint.
- [ ] Update `content/privacy/_index.md` with explicit data controller, retention, and unsubscribe mechanisms.
- [ ] Enable `params.features.social_club_enrollment: true`.

### Milestone 3: Sass Modernization (Dart Sass)
- [ ] Migrate `assets/scss/` from legacy libsass `@import` to modular Dart Sass `@use` and `@forward` rules.
- [ ] Configure `dartsass` transpiler options in Hugo pipeline before libsass is deprecated in upstream Hugo releases.

### Milestone 4: Expanded Cantina Lore & Interactive Audio
- [ ] Interactive Bolero jukebox preview featuring La Rosa Negra's afterlife tracks.
- [ ] Secret room riddles unlocked via the bell coaster glyph combinations.
