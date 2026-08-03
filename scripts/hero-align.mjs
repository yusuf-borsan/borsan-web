/**
 * Hero heading alignment + typography measurement.
 * Measures eyebrow / h1 / subtitle left offset and computed type styles on the
 * home hero vs Servis / Yatırım / Hakkımızda at 1366×768.
 * Run: node scripts/hero-align.mjs
 */
import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const b = await chromium.launch();
const p = await b.newPage();
await p.setViewportSize({ width: 1366, height: 768 });

const PAGES = [
  ["home", "/tr"],
  ["servis", "/tr/servis"],
  ["yatirim", "/tr/makine-yatirim-cozumleri"],
  ["hakkimizda", "/tr/hakkimizda"],
];

async function measure(url) {
  await p.goto(BASE + url, { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  // neutralize the entrance transform for a stable resting measurement
  await p.addStyleTag({ content: ".page-fade-in,.animate-fade-up{transform:none!important;animation:none!important;}" });
  await p.waitForTimeout(150);
  return p.evaluate(() => {
    const hero = document.querySelector("section");
    const pick = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        left: Math.round(r.left),
        fontSize: cs.fontSize, fontWeight: cs.fontWeight,
        letterSpacing: cs.letterSpacing, lineHeight: cs.lineHeight,
        fontFamily: cs.fontFamily.split(",")[0].replace(/["']/g, ""),
      };
    };
    const eyebrow = hero.querySelector(".eyebrow, [class*='eyebrow']");
    const h1 = hero.querySelector("h1");
    // subtitle = first <p> after h1 in the hero
    let sub = null;
    if (h1) { let n = h1.nextElementSibling; while (n && n.tagName !== "P") n = n.nextElementSibling; sub = n; }
    return { eyebrow: pick(eyebrow), h1: pick(h1), subtitle: pick(sub) };
  });
}

const data = {};
for (const [name, url] of PAGES) data[name] = await measure(url);
await b.close();

console.log(JSON.stringify(data, null, 2));

// Compare left offsets against home (≤2px tolerance)
const parts = ["eyebrow", "h1", "subtitle"];
let fails = 0;
for (const page of ["servis", "yatirim", "hakkimizda"]) {
  for (const part of parts) {
    const home = data.home[part], other = data[page][part];
    if (!home || !other) { console.log(`⚠️  ${page}.${part}: missing`); continue; }
    const dl = Math.abs(home.left - other.left);
    const okLeft = dl <= 2;
    const okFont =
      home.fontSize === other.fontSize &&
      home.fontWeight === other.fontWeight &&
      home.letterSpacing === other.letterSpacing &&
      home.lineHeight === other.lineHeight &&
      home.fontFamily === other.fontFamily;
    if (!okLeft || !okFont) fails++;
    console.log(`${okLeft && okFont ? "✅" : "❌"} ${page}.${part} left: home=${home.left} ${page}=${other.left} (Δ${dl}px)  | fontSize home=${home.fontSize} ${page}=${other.fontSize} | type ${okFont ? "MATCH" : "DIFF"}`);
  }
}
console.log(`\nleft-alignment failures (>2px): ${fails}`);
