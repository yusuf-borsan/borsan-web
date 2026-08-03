/**
 * Responsive + scroll audit (Playwright).
 * Requires the dev server running on http://localhost:3000.
 * Run: node scripts/responsive-audit.mjs
 *
 * For every (page × viewport) it checks:
 *  - no horizontal overflow (scrollWidth <= innerWidth + 1)
 *  - no console errors
 * Home-page specific (desktop/laptop): hero fills the viewport, stats bar is
 * fully visible, and there is NO gap between the hero and the next section.
 * Investment-page specific: the "Europe partnerships" section and the footer
 * are reachable by scrolling, and the scroll position does not bounce back.
 *
 * Screenshots are written to test-results/responsive/.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "test-results", "responsive");
mkdirSync(OUT, { recursive: true });

const BASE = "http://localhost:3000";

const VIEWPORTS = [
  { w: 320, h: 568 }, { w: 360, h: 800 }, { w: 375, h: 667 },
  { w: 390, h: 844 }, { w: 412, h: 915 }, { w: 430, h: 932 },
  { w: 768, h: 1024 }, { w: 820, h: 1180 }, { w: 1024, h: 768 },
  { w: 1280, h: 720 }, { w: 1366, h: 768 }, { w: 1440, h: 900 },
  { w: 1536, h: 864 }, { w: 1920, h: 1080 }, { w: 2560, h: 1440 },
];

const PAGES = [
  { name: "home-tr", path: "/tr" },
  { name: "home-en", path: "/en" },
  { name: "servis-tr", path: "/tr/servis" },
  { name: "servis-en", path: "/en/servis" },
  { name: "investment-tr", path: "/tr/makine-yatirim-cozumleri" },
  { name: "investment-en", path: "/en/makine-yatirim-cozumleri" },
  { name: "about-tr", path: "/tr/hakkimizda" },
  { name: "contact-tr", path: "/tr/iletisim" },
  { name: "products-tr", path: "/tr/urunler" },
  { name: "category-tr", path: "/tr/urunler/cnc-tornalar" },
  { name: "product-tr", path: "/tr/urunler/cnc-tornalar/falco-ck6152" },
];

// Viewports for the full screenshot record (keeps file count sane).
const SHOT_VIEWPORTS = new Set(["1920x1080", "1366x768", "390x844"]);

const KILL_ANIM = `*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;transition-delay:0s!important;}`;

const results = [];
let failures = 0;

function record(ok, label, detail) {
  results.push({ ok, label, detail });
  if (!ok) failures++;
  console.log(`${ok ? "✅" : "❌"} ${label}${detail ? "  " + detail : ""}`);
}

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const key = `${vp.w}x${vp.h}`;
  const context = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    reducedMotion: "reduce", // deterministic resting layout + native scroll
    deviceScaleFactor: 1,
  });

  for (const pg of PAGES) {
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
    page.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message));

    try {
      await page.goto(BASE + pg.path, { waitUntil: "networkidle", timeout: 45000 });
      await page.addStyleTag({ content: KILL_ANIM });
      await page.waitForTimeout(150);

      const m = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        iw: window.innerWidth,
        ih: window.innerHeight,
      }));
      record(m.sw <= m.iw + 1, `[${key}] ${pg.name} no h-overflow`, `sw=${m.sw} iw=${m.iw}`);

      // filter out known-noise (favicon/font 404s aren't layout errors)
      const realErrors = consoleErrors.filter((e) => !/favicon|404|Failed to load resource/i.test(e));
      record(realErrors.length === 0, `[${key}] ${pg.name} no console errors`,
        realErrors.length ? realErrors.slice(0, 2).join(" | ") : "");

      // ---- Home-page hero system (laptop/desktop widths) ----
      if (pg.name.startsWith("home") && vp.w >= 1024) {
        const hero = await page.evaluate(() => {
          const secs = [...document.querySelectorAll("section")];
          const h = secs[0].getBoundingClientRect();
          const stats = [...secs[0].querySelectorAll("div")].find(
            (d) => /(30\+|%100)/.test(d.textContent || "") && d.className.includes("grid"));
          const s = stats.getBoundingClientRect();
          const next = secs[1].getBoundingClientRect();
          return {
            heroH: Math.round(h.height), vh: window.innerHeight,
            statsBottom: Math.round(s.bottom),
            gap: Math.round(next.top - h.bottom),
          };
        });
        record(Math.abs(hero.heroH - hero.vh) <= 2, `[${key}] ${pg.name} hero == viewport`, `heroH=${hero.heroH} vh=${hero.vh}`);
        record(hero.gap === 0, `[${key}] ${pg.name} no white strip after stats`, `gap=${hero.gap}`);
        record(hero.statsBottom <= hero.vh + 2, `[${key}] ${pg.name} stats fully visible`, `statsBottom=${hero.statsBottom} vh=${hero.vh}`);
      }

      // ---- Investment scroll reachability + no bounce ----
      if (pg.name === "investment-tr" && (key === "1366x768" || key === "390x844")) {
        const europe = await page.evaluate(async () => {
          const norm = (s) => (s || "").toLowerCase();
          const h2s = [...document.querySelectorAll("h2")];
          const target = h2s.find((h) => /avrupa|europe|partner|iş birli/i.test(norm(h.textContent)));
          if (!target) return { found: false };
          target.scrollIntoView({ block: "center" });
          await new Promise((r) => setTimeout(r, 200));
          const r = target.getBoundingClientRect();
          const inView = r.top >= 0 && r.top < window.innerHeight;
          return { found: true, inView, text: target.textContent.slice(0, 40) };
        });
        record(europe.found && europe.inView, `[${key}] investment Europe section reachable`, europe.text || "");

        const footerReach = await page.evaluate(async () => {
          const footer = document.querySelector("footer");
          if (!footer) return { found: false };
          window.scrollTo(0, document.documentElement.scrollHeight);
          await new Promise((r) => setTimeout(r, 200));
          const r = footer.getBoundingClientRect();
          return { found: true, inView: r.top < window.innerHeight };
        });
        record(footerReach.found && footerReach.inView, `[${key}] investment footer reachable`);

        // No bounce-back: scroll to a mid point, confirm it stays put.
        const noBounce = await page.evaluate(async () => {
          const mid = Math.round(document.documentElement.scrollHeight * 0.5);
          window.scrollTo(0, mid);
          await new Promise((r) => setTimeout(r, 400));
          return { mid, after: Math.round(window.scrollY) };
        });
        record(Math.abs(noBounce.after - noBounce.mid) <= 30, `[${key}] investment no scroll bounce-back`, `target=${noBounce.mid} after=${noBounce.after}`);
      }

      // ---- Snap instance count must be zero everywhere ----
      const snapEls = await page.evaluate(() => document.querySelectorAll("[data-lenis-snap]").length);
      record(snapEls === 0, `[${key}] ${pg.name} zero snap elements`, `count=${snapEls}`);

      // ---- Screenshots (record set) ----
      if (SHOT_VIEWPORTS.has(key)) {
        await page.screenshot({ path: join(OUT, `${pg.name}_${key}.png`) });
      }
      // Special: investment Europe section closeup at 1366
      if (pg.name === "investment-tr" && key === "1366x768") {
        await page.evaluate(() => {
          const h2s = [...document.querySelectorAll("h2")];
          const t = h2s.find((h) => /avrupa|europe|partner|iş birli/i.test((h.textContent || "").toLowerCase()));
          t && t.scrollIntoView({ block: "center" });
        });
        await page.waitForTimeout(200);
        await page.screenshot({ path: join(OUT, `investment-europe_${key}.png`) });
      }
    } catch (err) {
      record(false, `[${key}] ${pg.name} LOAD FAILED`, String(err).slice(0, 120));
    } finally {
      await page.close();
    }
  }
  await context.close();
}

await browser.close();

console.log(`\n=== SUMMARY: ${results.length - failures}/${results.length} checks passed, ${failures} failed ===`);
console.log(`Screenshots: ${OUT}`);
process.exit(failures === 0 ? 0 : 1);
