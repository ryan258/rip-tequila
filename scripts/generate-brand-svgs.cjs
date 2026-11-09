const fs = require("fs");
const path = require("path");

// Output root; `npm run check:brand` passes a temp dir to compare against the committed files.
const OUT = process.argv[2] || "static/brand";

// Glyph geometry lives in layouts/partials/glyph.html, which is what the site
// renders. Parse it here so the downloadable SVGs can't drift from the site.
const GLYPHS = (() => {
  const tpl = fs.readFileSync("layouts/partials/glyph.html", "utf8");
  const branch = /\{\{ (?:else )?if (?:eq \$name "([a-z-]+)"|or \(eq \$name "([a-z-]+)"\) \(eq \$name "[a-z-]+"\)) \}\}([\s\S]*?)(?=\{\{ else|\{\{ end \}\})/g;
  const out = {};
  for (const m of tpl.matchAll(branch)) {
    const name = m[1] || m[2];
    let body = m[3].replace(/\{\{\/\*[\s\S]*?\*\/\}\}/g, "").split("\n").map((l) => l.trim()).filter(Boolean).join("\n");
    // Standalone files can't resolve the site's CSS variables; use their fallback color.
    body = body.replace(/var\(--[a-z-]+, *(#[0-9a-f]{3,8})\)/gi, "$1");
    if (body.includes("{{")) throw new Error(`glyph.html: template logic inside "${name}" - extend the parser`);
    out[name] = body;
  }
  return out;
})();

// Logos and applications are written with <text> for readability, then every
// <text> is converted to filled paths, so a downloaded file renders identically
// anywhere with no fonts installed. Fonts: scripts/fonts/ (SIL OFL, see its README).
const opentype = require("opentype.js");
const loadFont = (file) => {
  const b = fs.readFileSync(path.join("scripts/fonts", file));
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};
const FONTS = { Anton: loadFont("Anton-Regular.ttf"), Oswald: loadFont("Oswald.ttf") };

// Own layout (cmap + advance + kern) instead of font.getPath(): opentype.js 2.0's
// GSUB pass throws on Oswald's contextual lookups, and caps-only logo text needs none.
function layoutRun(font, str, size, track) {
  const k = size / font.unitsPerEm;
  const glyphs = [];
  let x = 0, prev = null;
  for (const ch of str) {
    const g = font.charToGlyph(ch);
    if (g.index === 0) throw new Error(`outline: no glyph for "${ch}"`);
    if (prev) x += font.getKerningValue(prev, g) * k;
    glyphs.push({ g, x });
    x += g.advanceWidth * k + track;
    prev = g;
  }
  return { glyphs, width: x }; // width includes the trailing track
}

function outline(svg) {
  return svg.replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/g, (_, attrs, body) => {
    const a = Object.fromEntries([...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
    const key = Object.keys(FONTS).find((k) => (a["font-family"] || "").startsWith(k));
    if (!key) throw new Error(`outline: unsupported font-family "${a["font-family"]}"`);
    const font = FONTS[key];
    const size = +a["font-size"];
    const track = +(a["letter-spacing"] || 0);
    // Plain text, or <tspan fill="..."> runs (the red cross in the monogram).
    const runs = [...body.matchAll(/<tspan fill="([^"]*)">([^<]*)<\/tspan>|([^<]+)/g)]
      .map((m) => ({ fill: m[1] || a.fill, ...layoutRun(font, m[1] ? m[2] : m[3], size, track) }));
    let x = +a.x;
    if (a["text-anchor"] === "middle") x -= (runs.reduce((w, r) => w + r.width, 0) - track) / 2; // centre the ink, not the trailing track
    return runs.map((r) => {
      const d = r.glyphs.map(({ g, x: gx }) => g.getPath(x + gx, +a.y, size).toPathData(2)).join("");
      x += r.width;
      return `<path d="${d}" fill="${r.fill}"${a.opacity ? ` opacity="${a.opacity}"` : ""}/>`;
    }).join("");
  });
}

function glyphSvg(name, inner) {
  return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${name}">
  ${inner}
</svg>
`;
}

const glyphDir = path.join(OUT, "glyphs");
fs.mkdirSync(glyphDir, { recursive: true });

for (const [name, inner] of Object.entries(GLYPHS)) {
  const svg = glyphSvg(name, inner);
  fs.writeFileSync(path.join(glyphDir, `${name}.svg`), svg);
}

console.log(`Glyphs written: ${Object.keys(GLYPHS).length}`);

// ---- Logos ----
const BLACK = "#0D0D0D", CREAM = "#F2EDE0", RED = "#B22222", GREEN = "#2E7D4F", GOLD = "#C6A24A";

function primaryLogo({ fg = BLACK, bg = CREAM, accent = GOLD, crossColor = RED, width = 640, height = 520 }) {
  return `<svg viewBox="0 0 640 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="RIP Tequila logo">
<rect width="640" height="520" fill="${bg}"/>
<!-- Cross accent -->
<path d="M304 28H336V72H380V104H336V148H304V104H260V72H304V28Z" fill="${crossColor}"/>
<!-- Agave flanks -->
<path d="M196 108 L214 156 L196 204 L178 156 Z" fill="${GREEN}" opacity="0.9"/>
<path d="M444 108 L462 156 L444 204 L426 156 Z" fill="${GREEN}" opacity="0.9"/>
<!-- RIP -->
<text x="320" y="296" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="172" letter-spacing="8" fill="${fg}">RIP</text>
<!-- TEQUILA -->
<text x="320" y="362" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="56" letter-spacing="18" fill="${fg}">TEQUILA</text>
<!-- Rule -->
<rect x="190" y="386" width="260" height="4" fill="${accent}"/>
<!-- REST IN PROOF -->
<text x="320" y="428" text-anchor="middle" font-family="Oswald, sans-serif" font-size="24" letter-spacing="8" fill="${fg}">REST IN PROOF</text>
<!-- Micro footer -->
<text x="320" y="486" text-anchor="middle" font-family="Oswald, sans-serif" font-size="12" letter-spacing="4" fill="${fg}" opacity="0.6">FICTIONAL PARODY BRAND</text>
</svg>
`;
}

function horizontalLogo({ fg = BLACK, bg = CREAM }) {
  const w = Math.ceil(100 + layoutRun(FONTS.Anton, "RIP TEQUILA", 72, 4).width - 4 + 32);
  return `<svg viewBox="0 0 ${w} 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="RIP Tequila horizontal logo">
<rect width="${w}" height="160" fill="${bg}"/>
<path d="M48 32H60V52H76V64H60V92H48V64H32V52H48V32Z" fill="${RED}"/>
<text x="100" y="92" font-family="Anton, Impact, sans-serif" font-size="72" letter-spacing="4" fill="${fg}">RIP TEQUILA</text>
<text x="100" y="128" font-family="Oswald, sans-serif" font-size="16" letter-spacing="6" fill="${fg}">REST IN PROOF</text>
</svg>
`;
}

function badgeLogo({ fg = BLACK, bg = CREAM, ring = BLACK }) {
  return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="RIP Tequila badge">
<rect width="400" height="400" fill="${bg}"/>
<circle cx="200" cy="200" r="172" fill="none" stroke="${ring}" stroke-width="6"/>
<circle cx="200" cy="200" r="150" fill="none" stroke="${ring}" stroke-width="2"/>
<text x="200" y="96" text-anchor="middle" font-family="Oswald, sans-serif" font-size="18" letter-spacing="4" fill="${fg}">RIP TEQUILA</text>
<text x="200" y="186" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="88" fill="${fg}">RIP</text>
<path d="M194 196H206V212H222V224H206V240H194V224H178V212H194V196Z" fill="${RED}"/>
<text x="200" y="272" text-anchor="middle" font-family="Oswald, sans-serif" font-size="18" letter-spacing="5" fill="${fg}">REST IN PROOF</text>
<text x="200" y="300" text-anchor="middle" font-family="Oswald, sans-serif" font-size="9" letter-spacing="1.5" fill="${fg}">LA CANTINA DEL ÚLTIMO TRAGO</text>
</svg>
`;
}

function monogramLogo({ fg = BLACK, bg = CREAM }) {
  return `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="RIP monogram">
<rect width="240" height="240" fill="${bg}"/>
<text x="120" y="140" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="96" letter-spacing="2" fill="${fg}">R<tspan fill="${RED}">†</tspan>P</text>
<text x="120" y="190" text-anchor="middle" font-family="Oswald, sans-serif" font-size="16" letter-spacing="6" fill="${fg}">RIP TEQUILA</text>
</svg>
`;
}

function neckSealLogo({ fg = BLACK, bg = CREAM, stripe = GOLD }) {
  return `<svg viewBox="0 0 200 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="RIP Tequila neck seal">
<rect width="200" height="480" fill="${bg}"/>
<rect x="0" y="0" width="200" height="28" fill="${stripe}"/>
<text x="100" y="120" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="64" fill="${fg}">RIP</text>
<text x="100" y="168" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="24" letter-spacing="6" fill="${fg}">TEQUILA</text>
<path d="M96 196H104V222H130V230H104V256H96V230H70V222H96V196Z" fill="${RED}"/>
<text x="100" y="306" text-anchor="middle" font-family="Oswald, sans-serif" font-size="15" letter-spacing="3" fill="${fg}">REST IN PROOF</text>
<text x="100" y="340" text-anchor="middle" font-family="Oswald, sans-serif" font-size="13" letter-spacing="4" fill="${fg}">BATCH 013</text>
<text x="100" y="372" text-anchor="middle" font-family="Oswald, sans-serif" font-size="11" letter-spacing="3" fill="${fg}">THE BELL RANG</text>
<rect x="0" y="452" width="200" height="28" fill="${fg}"/>
<text x="100" y="471" text-anchor="middle" font-family="Oswald, sans-serif" font-size="11" letter-spacing="3" fill="${bg}">FICTIONAL PARODY</text>
</svg>
`;
}

function faviconLogo() {
  return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="RIP favicon">
<rect width="64" height="64" rx="10" fill="#0D0D0D"/>
<text x="32" y="46" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="40" fill="#F2EDE0">R†P</text>
</svg>
`;
}

const logos = {
  "rip-primary.svg": primaryLogo({}),
  "rip-primary-reverse.svg": primaryLogo({ fg: CREAM, bg: BLACK, accent: GOLD }),
  "rip-primary-gold.svg": primaryLogo({ fg: BLACK, bg: CREAM, accent: GOLD, crossColor: GOLD }),
  "rip-horizontal.svg": horizontalLogo({}),
  "rip-horizontal-reverse.svg": horizontalLogo({ fg: CREAM, bg: BLACK }),
  "rip-badge.svg": badgeLogo({}),
  "rip-badge-reverse.svg": badgeLogo({ fg: CREAM, bg: BLACK, ring: CREAM }),
  "rip-monogram.svg": monogramLogo({}),
  "rip-monogram-reverse.svg": monogramLogo({ fg: CREAM, bg: BLACK }),
  "rip-neck-seal.svg": neckSealLogo({}),
  "rip-favicon.svg": faviconLogo(),
};

fs.mkdirSync(path.join(OUT, "logo"), { recursive: true });
for (const [file, svg] of Object.entries(logos)) fs.writeFileSync(path.join(OUT, "logo", file), outline(svg));
console.log(`Logos written: ${Object.keys(logos).length}`);

// ---- Patterns ----
// Build patterns by inlining simplified glyph shapes on a grid
const patterns = {
  "pattern-ritual.svg": { bg: "#F2EDE0", fg: "#0D0D0D", glyphs: ["glass", "lemon", "bottle", "agave"] },
  "pattern-afterlife.svg": { bg: "#0D0D0D", fg: "#F2EDE0", glyphs: ["skull", "monument", "cross", "moon"] },
  "pattern-cantina.svg": { bg: "#F2EDE0", fg: "#B22222", glyphs: ["bell", "microphone", "maracas", "rose"] },
  "pattern-desert.svg": { bg: "#0F3D3E", fg: "#C6A24A", glyphs: ["cactus", "moon", "sun", "eye"] },
};

for (const [file, opts] of Object.entries(patterns)) {
  const cells = [];
  const positions = [[40,40],[160,40],[280,40],[40,160],[160,160],[280,160],[40,280],[160,280],[280,280]];
  positions.forEach(([x,y], i) => {
    const g = opts.glyphs[i % opts.glyphs.length];
    const inner = GLYPHS[g];
    cells.push(`<g transform="translate(${x} ${y}) scale(1.33)" color="${opts.fg}">${inner}</g>`);
  });
  const svg = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${file}">
<rect width="400" height="400" fill="${opts.bg}"/>
${cells.join("\n")}
</svg>
`;
  fs.mkdirSync(path.join(OUT, "patterns"), { recursive: true });
  fs.writeFileSync(path.join(OUT, "patterns", file), svg);
}
console.log(`Patterns written: ${Object.keys(patterns).length}`);

// ---- Applications ----
const apps = {
  "application-coaster.svg": `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Coaster template">
<rect width="600" height="600" fill="#F2EDE0"/>
<circle cx="300" cy="300" r="260" fill="none" stroke="#0D0D0D" stroke-width="6"/>
<circle cx="300" cy="300" r="230" fill="none" stroke="#0D0D0D" stroke-width="2"/>
<text x="300" y="120" text-anchor="middle" font-family="Oswald, sans-serif" font-size="20" letter-spacing="6" fill="#0D0D0D">RIP TEQUILA</text>
<text x="300" y="270" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="110" fill="#0D0D0D">RIP</text>
<text x="300" y="330" text-anchor="middle" font-family="Oswald, sans-serif" font-size="28" letter-spacing="8" fill="#0D0D0D">REST IN PROOF</text>
<text x="300" y="460" text-anchor="middle" font-family="Oswald, sans-serif" font-size="14" letter-spacing="4" fill="#0D0D0D">FICTIONAL PARODY BRAND</text>
</svg>`,
  "application-tshirt.svg": `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="T-shirt template">
<rect width="600" height="600" fill="#0D0D0D"/>
<text x="300" y="180" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="120" fill="#F2EDE0">RIP</text>
<text x="300" y="240" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="40" letter-spacing="12" fill="#F2EDE0">TEQUILA</text>
<rect x="200" y="260" width="200" height="4" fill="#C6A24A"/>
<text x="300" y="320" text-anchor="middle" font-family="Oswald, sans-serif" font-size="28" letter-spacing="8" fill="#F2EDE0">REST IN PROOF</text>
<text x="300" y="420" text-anchor="middle" font-family="Oswald, sans-serif" font-size="14" letter-spacing="4" fill="#F2EDE0" opacity="0.7">ONE HERO GLYPH + ONE PHRASE</text>
</svg>`,
  "application-bottle-label.svg": `<svg viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bottle label template">
<rect width="600" height="800" fill="#F2EDE0"/>
<path d="M292 60H308V92H340V108H308V140H292V108H260V92H292V60Z" fill="#B22222"/>
<text x="300" y="240" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="84" fill="#0D0D0D">RIP</text>
<text x="300" y="290" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="36" letter-spacing="10" fill="#0D0D0D">TEQUILA</text>
<text x="300" y="360" text-anchor="middle" font-family="Oswald, sans-serif" font-size="22" letter-spacing="6" fill="#0D0D0D">AÑEJO</text>
<text x="300" y="420" text-anchor="middle" font-family="Oswald, sans-serif" font-size="26" letter-spacing="7" fill="#0D0D0D">REST IN PROOF</text>
<text x="300" y="470" text-anchor="middle" font-family="Oswald, sans-serif" font-size="18" letter-spacing="3" fill="#0D0D0D">SAVE WATER, DRINK TEQUILA!</text>
<text x="300" y="640" text-anchor="middle" font-family="Oswald, sans-serif" font-size="13" letter-spacing="3" fill="#0D0D0D" opacity="0.7">FICTIONAL PARODY SPIRIT · 750 ML</text>
<text x="300" y="670" text-anchor="middle" font-family="Oswald, sans-serif" font-size="11" letter-spacing="2" fill="#0D0D0D" opacity="0.6">DRINK RESPONSIBLY. HAUNT RESPONSIBLY.</text>
</svg>`,
  "application-matchbook.svg": `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Matchbook template">
<rect width="600" height="400" fill="#0D0D0D"/>
<text x="300" y="110" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="64" fill="#F2EDE0">RIP TEQUILA</text>
<text x="300" y="190" text-anchor="middle" font-family="Oswald, sans-serif" font-size="24" letter-spacing="5" fill="#F2EDE0">LIGHT THE CANDLE. RING THE BELL.</text>
<rect x="120" y="240" width="360" height="3" fill="#C6A24A"/>
<text x="300" y="300" text-anchor="middle" font-family="Oswald, sans-serif" font-size="14" letter-spacing="4" fill="#F2EDE0" opacity="0.7">LA CANTINA DEL ÚLTIMO TRAGO</text>
</svg>`,
  "application-social-avatar.svg": `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Social avatar template">
<rect width="400" height="400" rx="80" fill="#0D0D0D"/>
<text x="200" y="220" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="120" fill="#F2EDE0">R†P</text>
<text x="200" y="290" text-anchor="middle" font-family="Oswald, sans-serif" font-size="18" letter-spacing="5" fill="#C6A24A">REST IN PROOF</text>
</svg>`,
  "application-neck-seal.svg": neckSealLogo({}),
  "application-sticker-sheet.svg": `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sticker sheet template">
<rect width="600" height="600" fill="#F2EDE0"/>
<circle cx="120" cy="120" r="70" fill="none" stroke="#0D0D0D" stroke-width="4"/>
<text x="120" y="130" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="44" fill="#0D0D0D">RIP</text>
<rect x="240" y="60" width="140" height="120" rx="10" fill="none" stroke="#0D0D0D" stroke-width="4"/>
<text x="310" y="130" text-anchor="middle" font-family="Oswald, sans-serif" font-size="16" letter-spacing="3" fill="#0D0D0D">PROOF YOU LIVED</text>
<rect x="410" y="60" width="140" height="120" rx="10" fill="#B22222"/>
<text x="480" y="130" text-anchor="middle" font-family="Oswald, sans-serif" font-size="16" letter-spacing="3" fill="#F2EDE0">THE BELL RANG</text>
<text x="300" y="420" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="52" fill="#0D0D0D">REST IN PROOF</text>
<text x="300" y="480" text-anchor="middle" font-family="Oswald, sans-serif" font-size="18" letter-spacing="5" fill="#0D0D0D">FICTIONAL PARODY BRAND</text>
</svg>`,
};

fs.mkdirSync(path.join(OUT, "applications"), { recursive: true });
for (const [file, svg] of Object.entries(apps)) fs.writeFileSync(path.join(OUT, "applications", file), outline(svg));
console.log(`Applications written: ${Object.keys(apps).length}`);
console.log("Done.");
