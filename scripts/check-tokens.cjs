// Brand colors are written out by hand in the brand-kit board, its docs, and the
// SVG generator. Fail when any of them drifts from assets/scss/abstracts/_tokens.scss.
const fs = require("fs");

const tokens = fs.readFileSync("assets/scss/abstracts/_tokens.scss", "utf8");
const hex = (text) => [...text.matchAll(/#[0-9a-f]{6}\b/gi)].map((m) => m[0].toLowerCase());
const known = new Set([...tokens.matchAll(/^\$color-[a-z-]+: (#[0-9a-f]{6});/gim)].map((m) => m[1].toLowerCase()));
const core = ["black", "cream", "red", "green", "gold", "deep-green"]
  .map((n) => tokens.match(new RegExp(`^\\$color-${n}: (#[0-9a-f]{6});`, "im"))[1].toLowerCase());

const problems = [];
const files = ["layouts/brand-kit/list.html", "scripts/generate-brand-svgs.cjs",
  ...fs.readdirSync("docs/brand-kit").map((f) => `docs/brand-kit/${f}`)];
for (const file of files) {
  for (const h of new Set(hex(fs.readFileSync(file, "utf8")))) {
    if (!known.has(h)) problems.push(`${file}: ${h} is not a token in _tokens.scss`);
  }
}
const board = hex(fs.readFileSync("layouts/brand-kit/list.html", "utf8"));
for (const h of core) if (!board.includes(h)) problems.push(`layouts/brand-kit/list.html: no swatch for ${h}`);
const doc = hex(fs.readFileSync("docs/brand-kit/01-tokens.md", "utf8"));
for (const h of known) if (!doc.includes(h)) problems.push(`docs/brand-kit/01-tokens.md: token ${h} is not documented`);

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`tokens ok: ${known.size} colors, ${files.length} files checked`);
