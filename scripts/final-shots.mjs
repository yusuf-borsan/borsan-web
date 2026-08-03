/**
 * Acceptance screenshots + overflow checks after hero standardization.
 * Saves to test-results/responsive-final/. Requires dev server on :3000.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "test-results", "responsive-final");
mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3000";

const results = [];
let fails = 0;
const check = (ok, label, d) => { results.push(ok); if (!ok) fails++; console.log(`${ok ? "✅" : "❌"} ${label}${d ? "  " + d : ""}`); };

const b = await chromium.launch();

// Full overflow sweep across the required viewports for the changed pages.
const VIEWPORTS = [
  [320,568],[360,800],[375,667],[390,844],[412,915],[430,932],
  [768,1024],[820,1180],[1024,768],[1280,720],[1366,768],[1440,900],
  [1536,864],[1920,1080],[2560,1440],
];
const OVERFLOW_PAGES = [
  ["home-tr","/tr"],["servis-tr","/tr/servis"],["yatirim-tr","/tr/makine-yatirim-cozumleri"],
  ["hakkimizda-tr","/tr/hakkimizda"],["iletisim-tr","/tr/iletisim"],["urunler-tr","/tr/urunler"],
  ["home-en","/en"],["servis-en","/en/servis"],["yatirim-en","/en/makine-yatirim-cozumleri"],
];
for (const [w,h] of VIEWPORTS) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, reducedMotion:"reduce" });
  for (const [name,path] of OVERFLOW_PAGES) {
    const page = await ctx.newPage();
    await page.goto(BASE+path,{waitUntil:"networkidle",timeout:45000});
    await page.addStyleTag({content:"*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important;}"});
    await page.waitForTimeout(120);
    const m = await page.evaluate(()=>({sw:document.documentElement.scrollWidth, iw:window.innerWidth}));
    check(m.sw<=m.iw+1, `[${w}x${h}] ${name} no h-overflow`, `sw=${m.sw} iw=${m.iw}`);
    await page.close();
  }
  await ctx.close();
}

// Acceptance screenshots at 1366 and 390.
async function shot(page, path, name, opts={}) {
  await page.goto(BASE+path,{waitUntil:"networkidle"});
  await page.waitForTimeout(1200);
  await page.addStyleTag({content:".page-fade-in,.animate-fade-up{transform:none!important;animation:none!important;}"});
  await page.waitForTimeout(150);
  if (opts.scrollToSelector) {
    await page.evaluate((sel)=>{const el=[...document.querySelectorAll(sel)].pop()||document.querySelector(sel); el&&el.scrollIntoView({block:"center"});}, opts.scrollToSelector);
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: join(OUT, name) });
}

for (const [w,h,suffix] of [[1366,768,"1366x768"],[390,844,"390x844"]]) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, reducedMotion:"reduce" });
  const page = await ctx.newPage();
  await shot(page, "/tr", `home-hero_${suffix}.png`);
  await shot(page, "/tr/servis", `servis-hero_${suffix}.png`);
  await shot(page, "/tr/makine-yatirim-cozumleri", `yatirim-hero_${suffix}.png`);
  await shot(page, "/tr/hakkimizda", `hakkimizda-hero_${suffix}.png`);
  await page.close();
  await ctx.close();
}

// Investment detail shots at 1366.
{
  const ctx = await b.newContext({ viewport:{width:1366,height:768}, reducedMotion:"reduce" });
  const page = await ctx.newPage();
  await shot(page, "/tr/makine-yatirim-cozumleri", "yatirim-europe_1366x768.png", { scrollToSelector:"h2" });
  // Europe section specifically
  await page.evaluate(()=>{const t=[...document.querySelectorAll('h2')].find(h=>/avrupa|iş birli/i.test(h.textContent||'')); t&&t.scrollIntoView({block:'center'});});
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(OUT, "yatirim-europe_1366x768.png") });
  // form
  await page.evaluate(()=>document.querySelector('#yatirim-formu').scrollIntoView({block:'center'}));
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(OUT, "yatirim-form_1366x768.png") });
  // after clicking the CTA
  await page.evaluate(()=>window.__lenis&&window.__lenis.scrollTo(0,{immediate:true}));
  await page.waitForTimeout(400);
  await page.locator('a[href="#yatirim-formu"]').first().click();
  await page.waitForTimeout(1800);
  await page.screenshot({ path: join(OUT, "yatirim-after-cta-click_1366x768.png") });
  // footer
  await page.evaluate(()=>window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(OUT, "yatirim-footer_1366x768.png") });
  await page.close();
  await ctx.close();
}

await b.close();
console.log(`\n=== FINAL SHOTS+OVERFLOW: ${results.length-fails}/${results.length} overflow checks passed, ${fails} failed ===`);
console.log(`Screenshots: ${OUT}`);
process.exit(fails===0?0:1);
