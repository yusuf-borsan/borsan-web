/**
 * Hakkımızda (About) page verification. Requires dev server on :3000.
 * Checks overflow, header collision, logo/welcome fit, video placement and
 * reduced-motion across the required breakpoints; saves screenshots.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "test-results", "responsive-final");
mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3000";

const VPS = [
  [360, 640], [390, 844], [430, 932], [768, 1024],
  [1024, 768], [1280, 800], [1440, 900], [1920, 1080],
];
const results = [];
let fails = 0;
const check = (ok, label, d) => { results.push(ok); if (!ok) fails++; console.log(`${ok ? "✅" : "❌"} ${label}${d ? "  " + d : ""}`); };

const b = await chromium.launch();

for (const [w, h] of VPS) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(`${BASE}/tr/hakkimizda`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);

  const top = await page.evaluate(() => {
    const sec = document.querySelector("section");
    const logo = sec.querySelector("img[src*='borsan-logo']");
    const r = logo.getBoundingClientRect();
    const welcome = [...sec.querySelectorAll("p")].find((p) => /hoşgeldiniz/i.test(p.textContent || ""));
    return {
      sw: document.documentElement.scrollWidth, iw: window.innerWidth, ih: window.innerHeight,
      heroH: Math.round(sec.getBoundingClientRect().height),
      logoLeft: Math.round(r.left), logoRight: Math.round(r.right), logoTop: Math.round(r.top), logoW: Math.round(r.width),
      welcomeText: welcome ? welcome.textContent.trim() : null,
      welcomeTop: welcome ? Math.round(welcome.getBoundingClientRect().top) : null,
      headerH: (() => { const hd = document.querySelector("header"); return hd ? Math.round(hd.getBoundingClientRect().height) : 0; })(),
    };
  });
  const vloc = await page.evaluate(() => {
    const secs = document.querySelectorAll("section");
    return {
      heroHasVideo: !!secs[0]?.querySelector("video"),
      textHasVideo: !!secs[1]?.querySelector("video"),
    };
  });
  const wantVideo = w >= 768;
  check(vloc.heroHasVideo === wantVideo, `[${w}] hero video ${wantVideo ? "present" : "absent (mobile fallback)"}`, `hero=${vloc.heroHasVideo}`);
  check(vloc.textHasVideo === false, `[${w}] text section has NO video`, `textHasVideo=${vloc.textHasVideo}`);
  check(top.sw <= top.iw + 1, `[${w}] no h-overflow`, `sw=${top.sw} iw=${top.iw}`);
  check(top.logoLeft >= 0 && top.logoRight <= top.iw + 1, `[${w}] logo within viewport width`, `left=${top.logoLeft} right=${top.logoRight} w=${top.logoW}`);
  check(Math.abs(top.heroH - top.ih) <= 2, `[${w}] hero == one screen`, `heroH=${top.heroH} ih=${top.ih}`);
  check(top.logoTop > top.headerH, `[${w}] logo below fixed header (no collision)`, `logoTop=${top.logoTop} headerH=${top.headerH}`);
  check(top.welcomeText === "Hoşgeldiniz", `[${w}] "Hoşgeldiniz" present below logo`, `text=${top.welcomeText}`);
  check(top.welcomeTop !== null && top.welcomeTop > top.logoTop, `[${w}] welcome sits under the logo`, `welcomeTop=${top.welcomeTop}`);

  // Scroll to bottom: about copy + footer reachable.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(500);
  const bottom = await page.evaluate(() => {
    const f = document.querySelector("footer");
    const paras = [...document.querySelectorAll("section")][1].querySelectorAll("p");
    const last = paras[paras.length - 1].getBoundingClientRect();
    return { footerInView: f ? f.getBoundingClientRect().top < window.innerHeight : false, lastParaReadable: last.top < window.innerHeight };
  });
  check(bottom.footerInView, `[${w}] footer reachable`);
  check(bottom.lastParaReadable, `[${w}] full about text reachable`);
  check(errors.filter((e) => !/favicon|404|Failed to load resource/i.test(e)).length === 0, `[${w}] no console errors`, errors.slice(0, 1).join(""));

  if ([360, 390, 768, 1280, 1920].includes(w)) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(OUT, `about-hero_${w}x${h}.png`) });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(OUT, `about-text_${w}x${h}.png`) });
  }
  await page.close();
  await ctx.close();
}

// Reduced-motion: logo visible, no video (static navy fallback).
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/tr/hakkimizda`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const vis = await page.evaluate(() => {
    const logo = document.querySelector("section img[src*='borsan-logo']");
    const cs = getComputedStyle(logo);
    return { opacity: cs.opacity, hasVideo: !!document.querySelector("video") };
  });
  check(Number(vis.opacity) >= 0.99, "reduced-motion: logo fully visible", `opacity=${vis.opacity}`);
  check(vis.hasVideo === false, "reduced-motion: video not rendered (static navy fallback)", `hasVideo=${vis.hasVideo}`);
  await page.close();
  await ctx.close();
}

await b.close();
console.log(`\n=== ABOUT SUMMARY: ${results.length - fails}/${results.length} passed, ${fails} failed ===`);
process.exit(fails === 0 ? 0 : 1);
