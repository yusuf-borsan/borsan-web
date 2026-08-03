/**
 * Scroll behaviour verification (real Playwright wheel gestures + anchor click).
 * Requires the dev server on http://localhost:3000 and window.__lenis exposed.
 * Run: node scripts/scroll-verify.mjs
 *
 * Verifies the measured root cause is fixed:
 *  - lenis.limit matches the real document max scroll (no stale/zero height)
 *  - the footer is reachable by real wheel gestures
 *  - the FIRST wheel-up after scrolling down moves the page (SORUN 3)
 *  - "Yatırım Talebi Gönder" anchor lands on the real form (SORUN 2)
 *  - no scroll bounce-back
 */
import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const results = [];
let failures = 0;
function check(ok, label, detail) {
  results.push({ ok, label, detail });
  if (!ok) failures++;
  console.log(`${ok ? "✅" : "❌"} ${label}${detail ? "  " + detail : ""}`);
}

const snap = (page) =>
  page.evaluate(() => {
    const L = window.__lenis;
    return {
      scrollY: Math.round(window.scrollY),
      docMax: document.documentElement.scrollHeight - window.innerHeight,
      limit: L ? Math.round(L.limit) : null,
      animated: L ? Math.round(L.animatedScroll) : null,
      target: L ? Math.round(L.targetScroll) : null,
      isStopped: L ? L.isStopped : null,
    };
  });

async function settle(page, ms = 900) {
  await page.waitForTimeout(ms);
}

// Wheel down until the page reaches the real bottom. Requires several
// consecutive stalled reads before giving up (Lenis momentum can briefly
// plateau between wheel deltas, which must not be mistaken for the bottom).
async function wheelToBottom(page) {
  await page.mouse.move(700, 400);
  let last = -1;
  let stalls = 0;
  for (let i = 0; i < 60; i++) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(260);
    const { y, max } = await page.evaluate(() => ({
      y: Math.round(window.scrollY),
      max: document.documentElement.scrollHeight - window.innerHeight,
    }));
    if (y >= max - 5) break; // reached the real bottom
    if (Math.abs(y - last) <= 1) { stalls++; if (stalls >= 4) break; } else stalls = 0;
    last = y;
  }
  await settle(page);
}

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1366, height: 768 });

  // ── Investment page: the reported problem page ──
  await page.goto(`${BASE}/tr/makine-yatirim-cozumleri`, { waitUntil: "networkidle" });
  await settle(page, 1500);

  const s0 = await snap(page);
  check(
    s0.limit !== null && Math.abs(s0.limit - s0.docMax) <= 3,
    "investment: lenis.limit matches real docMax",
    `limit=${s0.limit} docMax=${s0.docMax} diff=${s0.limit - s0.docMax}`,
  );

  // Reach footer by real wheel gestures.
  await wheelToBottom(page);
  const footer = await page.evaluate(() => {
    const f = document.querySelector("footer");
    const r = f.getBoundingClientRect();
    return { top: Math.round(r.top), inView: r.top < window.innerHeight, scrollY: Math.round(window.scrollY), docMax: document.documentElement.scrollHeight - window.innerHeight };
  });
  check(footer.inView, "investment: footer reachable by wheel", `footerTop=${footer.top} scrollY=${footer.scrollY}/${footer.docMax}`);
  check(Math.abs(footer.scrollY - footer.docMax) <= 30, "investment: wheel reaches real bottom", `scrollY=${footer.scrollY} docMax=${footer.docMax}`);

  // SORUN 3: first wheel-up at the bottom must move the page immediately.
  const yBeforeUp = await page.evaluate(() => Math.round(window.scrollY));
  await page.mouse.wheel(0, -300);
  await page.waitForTimeout(500);
  const yAfterUp = await page.evaluate(() => Math.round(window.scrollY));
  check(yAfterUp < yBeforeUp - 20, "investment: FIRST wheel-up moves page", `before=${yBeforeUp} after=${yAfterUp}`);

  // Touchpad-like small deltas: several down, then a single reverse up.
  await settle(page);
  for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, 80); await page.waitForTimeout(120); }
  await settle(page, 700);
  const yPreReverse = await page.evaluate(() => Math.round(window.scrollY));
  await page.mouse.wheel(0, -80);
  await page.waitForTimeout(500);
  const yPostReverse = await page.evaluate(() => Math.round(window.scrollY));
  check(yPostReverse < yPreReverse, "investment: small touchpad reverse moves on first delta", `pre=${yPreReverse} post=${yPostReverse}`);

  // No bounce-back: land mid-page and confirm it stays.
  await page.evaluate(() => window.__lenis.scrollTo(2000, { immediate: true }));
  await page.waitForTimeout(600);
  const mid = await page.evaluate(() => Math.round(window.scrollY));
  check(Math.abs(mid - 2000) <= 40, "investment: no bounce-back at mid", `y=${mid}`);

  // ── SORUN 2: "Yatırım Talebi Gönder" anchor lands on the real form ──
  await page.evaluate(() => window.__lenis.scrollTo(0, { immediate: true }));
  await settle(page, 600);
  const btn = page.locator('a[href="#yatirim-formu"]').first();
  await btn.click();
  await settle(page, 1600);
  const anchorRes = await page.evaluate(() => {
    const form = document.querySelector("#yatirim-formu");
    const r = form.getBoundingClientRect();
    const hasFormFields = !!form.querySelector("form, input, textarea, select");
    return { top: Math.round(r.top), hash: location.hash, hasFormFields, vh: window.innerHeight };
  });
  check(anchorRes.hash === "#yatirim-formu", "investment: anchor updates URL hash", anchorRes.hash);
  check(anchorRes.hasFormFields, "investment: #yatirim-formu contains the real form");
  check(
    anchorRes.top >= 40 && anchorRes.top <= 130,
    "investment: form top sits just under fixed header (not mid-page)",
    `formTop=${anchorRes.top}`,
  );

  // After anchor scroll, first up AND first down must both respond.
  const yA = await page.evaluate(() => Math.round(window.scrollY));
  await page.mouse.move(700, 400);
  await page.mouse.wheel(0, -120);
  await page.waitForTimeout(500);
  const yUp = await page.evaluate(() => Math.round(window.scrollY));
  check(yUp < yA, "investment: after-anchor first wheel-up responds", `y=${yA}->${yUp}`);
  await settle(page);
  const yB = await page.evaluate(() => Math.round(window.scrollY));
  await page.mouse.wheel(0, 120);
  await page.waitForTimeout(500);
  const yDown = await page.evaluate(() => Math.round(window.scrollY));
  check(yDown > yB, "investment: after-anchor first wheel-down responds", `y=${yB}->${yDown}`);

  // ── Bidirectional footer test on other long pages ──
  const pages = [
    ["home-tr", "/tr"],
    ["servis-tr", "/tr/servis"],
    ["about-tr", "/tr/hakkimizda"],
    ["contact-tr", "/tr/iletisim"],
    ["products-tr", "/tr/urunler"],
    ["category-tr", "/tr/urunler/cnc-tornalar"],
    ["product-tr", "/tr/urunler/cnc-tornalar/falco-ck6152"],
    ["servis-en", "/en/servis"],
    ["investment-en", "/en/makine-yatirim-cozumleri"],
  ];
  for (const [name, path] of pages) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await settle(page, 1400);
    const sp = await snap(page);
    check(sp.limit !== null && Math.abs(sp.limit - sp.docMax) <= 3, `${name}: limit==docMax`, `limit=${sp.limit} docMax=${sp.docMax}`);
    await wheelToBottom(page);
    const f = await page.evaluate(() => {
      const ft = document.querySelector("footer");
      const r = ft.getBoundingClientRect();
      return { inView: r.top < window.innerHeight, scrollY: Math.round(window.scrollY), docMax: document.documentElement.scrollHeight - window.innerHeight };
    });
    check(f.inView, `${name}: footer reachable by wheel`, `scrollY=${f.scrollY}/${f.docMax}`);
    const yb = await page.evaluate(() => Math.round(window.scrollY));
    await page.mouse.wheel(0, -300);
    await page.waitForTimeout(500);
    const ya = await page.evaluate(() => Math.round(window.scrollY));
    check(ya < yb - 15, `${name}: first wheel-up moves page`, `${yb}->${ya}`);
  }

  await browser.close();
  console.log(`\n=== SCROLL SUMMARY: ${results.length - failures}/${results.length} passed, ${failures} failed ===`);
  process.exit(failures === 0 ? 0 : 1);
}

run().catch((e) => { console.error(e); process.exit(2); });
