import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const b = await chromium.launch();
const p = await b.newPage();
await p.setViewportSize({ width: 1366, height: 768 });
const pages = [
  ["servis-tr", "/tr/servis"],
  ["servis-en", "/en/servis"],
  ["yatirim-tr", "/tr/makine-yatirim-cozumleri"],
  ["yatirim-en", "/en/makine-yatirim-cozumleri"],
];
for (const [name, path] of pages) {
  await p.goto(BASE + path, { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  await p.addStyleTag({ content: ".page-fade-in,.animate-fade-up{transform:none!important;animation:none!important;}" });
  await p.waitForTimeout(150);
  const m = await p.evaluate(() => {
    const sec = document.querySelector("section");
    const h1 = sec.querySelector("h1");
    const eyebrow = sec.querySelector(".eyebrow,[class*='eyebrow']");
    const cs = getComputedStyle(sec);
    return {
      sectionH: Math.round(sec.getBoundingClientRect().height),
      display: cs.display, alignItems: cs.alignItems,
      eyebrowTop: eyebrow ? Math.round(eyebrow.getBoundingClientRect().top) : null,
      h1Top: Math.round(h1.getBoundingClientRect().top),
      h1Bottom: Math.round(h1.getBoundingClientRect().bottom),
      h1Lines: Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight)),
    };
  });
  console.log(name.padEnd(11), JSON.stringify(m));
}
await b.close();
