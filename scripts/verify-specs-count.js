const fs = require("fs");
const path = require("path");

const TS = path.join(__dirname, "..", "src", "lib", "products.ts");
const content = fs.readFileSync(TS, "utf-8");
const SKIP = new Set(["cnc-aksesuarlari"]);

const slugMatches = [...content.matchAll(/slug:\s*"([^"]+)"/g)];
let issues = 0;

for (let si = 0; si < slugMatches.length; si++) {
  const pos = slugMatches[si].index;
  const slug = slugMatches[si][1];
  const end = si + 1 < slugMatches.length ? slugMatches[si + 1].index : pos + 6000;
  const block = content.slice(pos, end);

  const catM = block.match(/categorySlug:\s*"([^"]+)"/);
  if (!catM || SKIP.has(catM[1])) continue;

  // Count specs in source using bracket matching
  const specStart = block.indexOf("specs: [");
  if (specStart < 0) continue;
  let depth = 1, j = specStart + 8;
  while (j < block.length && depth > 0) {
    if (block[j] === "[") depth++;
    else if (block[j] === "]") depth--;
    j++;
  }
  const specRaw = block.slice(specStart + 8, j - 1);
  // Count both formats: label: { tr: "..." } and label: L.xxx
  const srcSpecs = (specRaw.match(/label:\s*(?:\{|L\.)/g) || []).length;

  // Count specs in generated HTML
  const htmlPath = path.join(__dirname, "..", "public", "datasheets", `${slug}.html`);
  if (!fs.existsSync(htmlPath)) {
    console.log(`  MISSING HTML: ${slug}`);
    issues++;
    continue;
  }
  const html = fs.readFileSync(htmlPath, "utf-8");
  const lblCount = (html.match(/class="lbl"/g) || []).length;

  if (lblCount !== srcSpecs) {
    console.log(`  MISMATCH: ${slug} — source=${srcSpecs} pdf=${lblCount}`);
    issues++;
  }
}

if (issues === 0) {
  console.log("ALL OK — every product has all specs in PDF");
} else {
  console.log(`\n${issues} issues found`);
}
