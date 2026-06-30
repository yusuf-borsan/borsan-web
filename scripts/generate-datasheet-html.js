/**
 * Borsan Teknoloji — HTML→PDF Datasheet Generator
 * Uses Playwright to render HTML template to A4 PDF.
 * Normal CSS flow — no manual y coordinates, no overlap possible.
 */

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const BASE = path.resolve(__dirname, "..");
const PUBLIC = path.join(BASE, "public");
const LOGO_PATH = "/branding/borsan-logo-pdf.png";
const OUT_DIR = path.join(PUBLIC, "datasheets");
const TS_FILE = path.join(BASE, "src", "lib", "products.ts");

const SKIP_CATS = new Set(["cnc-aksesuarlari"]);

// No spec limit — all data preserved. Pages auto-break.
const MAX_HIGHLIGHTS = 5;

function phi(s) {
  return s.replace(/Φ/g, "Ø").replace(/φ/g, "Ø");
}

function parseProducts() {
  const content = fs.readFileSync(TS_FILE, "utf-8");

  // Parse the reusable L = { ... } label object
  const lMap = {};
  const lBlock = content.match(/const L\s*=\s*\{([\s\S]*?)\n\};/);
  if (lBlock) {
    const entries = [...lBlock[1].matchAll(/(\w+):\s*\{\s*tr:\s*"([^"]+)"/g)];
    for (const e of entries) {
      lMap[e[1]] = e[2];
    }
  }

  const slugMatches = [...content.matchAll(/slug:\s*"([^"]+)"/g)];
  const products = [];

  for (let si = 0; si < slugMatches.length; si++) {
    const pos = slugMatches[si].index;
    const slug = slugMatches[si][1];
    const end = si + 1 < slugMatches.length ? slugMatches[si + 1].index : pos + 6000;
    const block = content.slice(pos, end);

    const catM = block.match(/categorySlug:\s*"([^"]+)"/);
    if (!catM || SKIP_CATS.has(catM[1])) continue;

    const modM = block.match(/model:\s*"([^"]+)"/);
    const nmM = block.match(/name:\s*\{[^}]*tr:\s*"([^"]+)"/);
    const smM = block.match(/summary:\s*\{[^}]*tr:\s*"([^"]+)"/);
    const imgM = block.match(/image:\s*"([^"]+)"/);
    if (!modM || !nmM) continue;

    const hlBlock = block.match(/highlights:\s*\[([\s\S]*?)\]/);
    const hls = hlBlock
      ? [...hlBlock[1].matchAll(/\{\s*tr:\s*"([^"]*)"/g)].map((m) => phi(m[1]))
      : [];

    // Parse specs with bracket matching
    const specStart = block.indexOf("specs: [");
    let specs = [];
    if (specStart >= 0) {
      let depth = 1,
        j = specStart + 8;
      while (j < block.length && depth > 0) {
        if (block[j] === "[") depth++;
        else if (block[j] === "]") depth--;
        j++;
      }
      const specRaw = block.slice(specStart + 8, j - 1);
      // Match both formats:
      //   label: { tr: "..." }, value: { tr: "..." }
      //   label: L.xxx,         value: { tr: "..." }
      const specRe = /label:\s*(?:\{\s*tr:\s*"([^"]*)"[^}]*\}|L\.(\w+))\s*,\s*value:\s*\{\s*tr:\s*"([^"]*)"/g;
      let m;
      while ((m = specRe.exec(specRaw))) {
        const label = m[1] || lMap[m[2]] || m[2] || "?";
        specs.push({ label: phi(label), value: phi(m[3]) });
      }
    }

    // Split name: line 1 = brand + model, line 2 = machine type
    const name = nmM[1];
    let title1, title2;
    // JIANKE format: "JIANKE - DT38-5 II CNC Kayar Otomat"
    const jiankeMatch = name.match(/^(JIANKE\s*-\s*.+?)\s+(CNC\s+.*)$/);
    // BT format: "BT-VMC850 CNC ..."
    const btMatch = name.match(/^(BT-\S+)\s+(.*)/);
    // FALCO FL-125 ATC format: brand + model + ATC suffix (3 words)
    const flMatch = name.match(/^(FALCO\s+FL-\d+\s+ATC)\s+(.*)/);
    if (flMatch) {
      title1 = flMatch[1];
      title2 = flMatch[2];
    } else if (jiankeMatch) {
      title1 = jiankeMatch[1];
      title2 = jiankeMatch[2];
    } else if (btMatch) {
      title1 = btMatch[1];
      title2 = btMatch[2];
    } else {
      // FALCO format: first 2 words = brand + model
      const words = name.split(/\s+/);
      title1 = words.slice(0, 2).join(" ");
      title2 = words.slice(2).join(" ");
    }

    // ALL specs preserved — pages auto-break if needed
    const mid = Math.ceil(specs.length / 2);
    products.push({
      slug, title1, title2,
      image: imgM ? imgM[1] : "",
      summary: phi(smM ? smM[1] : ""),
      highlights: hls.slice(0, MAX_HIGHLIGHTS),
      specsLeft: specs.slice(0, mid),
      specsRight: specs.slice(mid),
    });
  }
  return products;
}

function buildHTML(p) {
  const logoFile = path.join(PUBLIC, LOGO_PATH.replace(/^\//, ""));
  const logoB64 = fs.existsSync(logoFile) ? `data:image/png;base64,${fs.readFileSync(logoFile).toString("base64")}` : "";
  const imgFile = p.image ? path.join(PUBLIC, p.image.replace(/^\//, "")) : "";
  const imgB64 = imgFile && fs.existsSync(imgFile) ? `data:image/png;base64,${fs.readFileSync(imgFile).toString("base64")}` : "";

  const logoSrc = logoB64;
  const imgSrc = imgB64;

  const hlItems = p.highlights
    .map((h) => `<li>${h}</li>`)
    .join("\n");

  function specRows(specs) {
    return specs
      .map(
        (s, i) =>
          `<tr class="${i % 2 === 0 ? "even" : ""}"><td class="lbl">${s.label}</td><td class="val">${s.value}</td></tr>`
      )
      .join("\n");
  }

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: Arial, sans-serif;
    color: #1a1a1a;
    width: 210mm;
    padding: 10mm 14mm 8mm 14mm;
  }

  /* ─── HEADER ─── */
  .header {
    display: flex;
    align-items: flex-start;
    gap: 4mm;
    margin-bottom: 4mm;
    padding-bottom: 4mm;
    border-bottom: 0.5px solid #ccc;
  }
  .logo { width: 72mm; flex-shrink: 0; }
  .logo img { width: 100%; height: auto; display: block; }
  .title-block { padding-top: 3mm; }
  .title1 {
    font-size: 24pt;
    font-weight: 900;
    color: #1F4488;
    line-height: 1.1;
    margin-bottom: 1mm;
  }
  .title2 {
    font-size: 13pt;
    font-weight: 700;
    color: #1F4488;
    line-height: 1.2;
  }

  /* ─── HERO ─── */
  .hero {
    display: flex;
    gap: 4mm;
    margin-bottom: 4mm;
  }
  .hero-img {
    width: 50%;
    flex-shrink: 0;
  }
  .hero-img img {
    width: 100%;
    height: auto;
    display: block;
  }
  .highlights {
    width: 50%;
    padding-top: 2mm;
  }
  .highlights h3 {
    font-size: 9pt;
    font-weight: 700;
    color: #1F4488;
    margin-bottom: 2mm;
    padding-bottom: 1.5mm;
    border-bottom: 1px solid #1F4488;
    display: inline-block;
  }
  .highlights ul {
    list-style: none;
    padding: 0;
  }
  .highlights li {
    font-size: 6.5pt;
    line-height: 1.45;
    margin-bottom: 2mm;
    padding-left: 3mm;
    position: relative;
  }
  .highlights li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 1.8px;
    width: 3px;
    height: 3px;
    background: #1F4488;
  }

  /* ─── SUMMARY ─── */
  .summary {
    font-size: 7.5pt;
    color: #6B7280;
    line-height: 1.5;
    margin-bottom: 5mm;
  }

  /* ─── SPECS ─── */
  .specs-title {
    font-size: 10pt;
    font-weight: 700;
    color: #1F4488;
    margin-bottom: 2mm;
    padding-bottom: 1.5mm;
    border-bottom: 1.2px solid #1F4488;
  }
  .specs-grid {
    display: flex;
    gap: 3mm;
  }
  .specs-col { width: 50%; }
  .specs-col h4 {
    font-size: 6pt;
    font-weight: 700;
    color: white;
    background: #1F4488;
    padding: 1.5mm 2mm;
    margin-bottom: 0;
  }
  .specs-col table {
    width: 100%;
    border-collapse: collapse;
    font-size: 5.5pt;
  }
  .specs-col td {
    padding: 1mm 1.5mm;
    vertical-align: top;
    line-height: 1.3;
    border-bottom: 0.3px solid #E5E7EB;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  .specs-col tr { page-break-inside: avoid; }
  .specs-col tr.even td {
    background: #F0F3F7;
  }
  .specs-col .lbl {
    width: 45%;
    color: #1a1a1a;
  }
  .specs-col .val {
    width: 55%;
    font-weight: 700;
    color: #1a1a1a;
  }

  /* ─── FOOTER ─── */
  .footer {
    padding-top: 2mm;
    border-top: 0.3px solid #ccc;
    font-size: 6pt;
    color: #6B7280;
    line-height: 1.6;
    page-break-inside: avoid;
    position: fixed;
    bottom: 8mm;
    left: 14mm;
    right: 14mm;
  }
  .footer strong {
    font-size: 7pt;
    color: #1a1a1a;
    display: block;
    margin-bottom: 0.5mm;
  }
  .footer .note {
    font-size: 5pt;
    color: #9CA3AF;
    margin-top: 1mm;
  }
</style>
</head>
<body>

<div class="header">
  <div class="logo"><img src="${logoSrc}" alt="Borsan Teknoloji"></div>
  <div class="title-block">
    <div class="title1">${p.title1}</div>
    <div class="title2">${p.title2}</div>
  </div>
</div>

<div class="hero">
  <div class="hero-img">
    ${imgSrc ? `<img src="${imgSrc}" alt="${p.title1}">` : ""}
  </div>
  <div class="highlights">
    <h3>ÖNE ÇIKAN ÖZELLİKLER</h3>
    <ul>${hlItems}</ul>
  </div>
</div>

<div class="summary">${p.summary}</div>

<div class="specs-title">TEKNİK ÖZELLİKLER</div>
<div class="specs-grid">
  <div class="specs-col">
    <h4>GENEL ÖZELLİKLER</h4>
    <table>${specRows(p.specsLeft)}</table>
  </div>
  <div class="specs-col">
    <h4>HAREKET VE DONANIM</h4>
    <table>${specRows(p.specsRight)}</table>
  </div>
</div>

<div class="footer">
  <strong>BORSAN TEKNOLOJİ VE MAKİNA TİCARETİ A.Ş.</strong>
  Topçular Mah. Maltepe Cd. No: 4/1 D 18 Eyüpsultan - İstanbul &nbsp;|&nbsp;
  info@borsanteknoloji.com &nbsp;|&nbsp; www.borsanteknoloji.com
  <div class="note">Teknik özellikler üretici katalog verilerine göre hazırlanmıştır. Haber verilmeksizin değiştirilebilir.</div>
</div>

</body>
</html>`;
}

async function generatePDF(product) {
  const html = buildHTML(product);
  const outPath = path.join(OUT_DIR, `${product.slug}.pdf`);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.pdf({
    path: outPath,
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  await browser.close();
  return outPath;
}

async function main() {
  // Parse only the target product first for testing
  const targetSlug = process.argv[2] || null;
  const allProducts = parseProducts();
  const products = targetSlug
    ? allProducts.filter((p) => p.slug === targetSlug)
    : allProducts;

  console.log(`Found ${products.length} products to generate`);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();

  for (const p of products) {
    try {
      const html = buildHTML(p);
      const outPath = path.join(OUT_DIR, `${p.slug}.pdf`);
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle" });
      await page.pdf({
        path: outPath,
        format: "A4",
        printBackground: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
      });
      // Save HTML + screenshot for verification
      const htmlOut = outPath.replace(".pdf", ".html");
      fs.writeFileSync(htmlOut, html, "utf-8");
      const ssOut = outPath.replace(".pdf", "-preview.png");
      await page.setViewportSize({ width: 794, height: 1123 });
      await page.screenshot({ path: ssOut, fullPage: false });
      await page.close();
      console.log(`  OK: ${p.slug}`);
    } catch (e) {
      console.error(`  ERR: ${p.slug} -> ${e.message}`);
    }
  }

  await browser.close();
  console.log("Done.");
}

main().catch(console.error);
