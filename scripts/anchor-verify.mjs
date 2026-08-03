/**
 * Anchor / hash-link inventory test — real clicks, verifies the target lands
 * just under the fixed header (or is at least in view), on the correct element.
 * Requires dev server on localhost:3000.
 */
import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const results = [];
let failures = 0;
const check = (ok, label, detail) => { results.push(ok); if (!ok) failures++; console.log(`${ok ? "✅" : "❌"} ${label}${detail ? "  " + detail : ""}`); };

const b = await chromium.launch();
const p = await b.newPage();
await p.setViewportSize({ width: 1366, height: 768 });

async function clickAnchorTest(url, selector, targetId, label) {
  await p.goto(BASE + url, { waitUntil: "networkidle" });
  await p.waitForTimeout(1400);
  await p.evaluate(() => window.__lenis.scrollTo(0, { immediate: true }));
  await p.waitForTimeout(400);
  const el = p.locator(selector).first();
  await el.click();
  await p.waitForTimeout(1800);
  const r = await p.evaluate((id) => {
    const t = document.querySelector(id);
    const rect = t.getBoundingClientRect();
    return { top: Math.round(rect.top), hash: location.hash, inView: rect.top < window.innerHeight && rect.bottom > 0 };
  }, targetId);
  check(r.hash === targetId, `${label}: hash correct`, r.hash);
  check(r.inView, `${label}: target in view`, `top=${r.top}`);
  check(r.top >= 30 && r.top <= 140, `${label}: target under header (not mid/offscreen)`, `top=${r.top}`);
  // after anchor, first wheel up responds
  const y0 = await p.evaluate(() => Math.round(window.scrollY));
  await p.mouse.move(700, 400);
  await p.mouse.wheel(0, -150);
  await p.waitForTimeout(500);
  const y1 = await p.evaluate(() => Math.round(window.scrollY));
  check(y1 < y0, `${label}: first wheel-up after anchor responds`, `${y0}->${y1}`);
}

// 1. Servis hero CTA → #servis-formu
await clickAnchorTest("/tr/servis", 'a[href="#servis-formu"]', "#servis-formu", "servis #servis-formu");

// 2. Servis EN
await clickAnchorTest("/en/servis", 'a[href="#servis-formu"]', "#servis-formu", "servis-en #servis-formu");

// 3. Product detail → #teklif
await clickAnchorTest("/tr/urunler/cnc-tornalar/falco-ck6152", 'a[href="#teklif"]', "#teklif", "product #teklif");

// 4. Investment hero → #yatirim-formu
await clickAnchorTest("/tr/makine-yatirim-cozumleri", 'a[href="#yatirim-formu"]', "#yatirim-formu", "investment #yatirim-formu");

// 5. Cross-navigation: Europe "Partnerlik Talebi Gönder" (query + hash) navigates then scrolls
await p.goto(BASE + "/tr/makine-yatirim-cozumleri", { waitUntil: "networkidle" });
await p.waitForTimeout(1200);
const partner = p.locator('a[href*="type=partner"]').first();
await partner.click();
await p.waitForTimeout(2200);
const pr = await p.evaluate(() => {
  const t = document.querySelector("#yatirim-formu");
  const rect = t.getBoundingClientRect();
  return { top: Math.round(rect.top), hash: location.hash, search: location.search, inView: rect.top < window.innerHeight && rect.bottom > 0 };
});
check(pr.hash === "#yatirim-formu", "partner link: hash correct", pr.hash + pr.search);
check(pr.inView, "partner link: form in view after cross-nav", `top=${pr.top}`);

await b.close();
console.log(`\n=== ANCHOR SUMMARY: ${results.length - failures}/${results.length} passed, ${failures} failed ===`);
process.exit(failures === 0 ? 0 : 1);
