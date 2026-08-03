const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

// Re-use the HTML builder from generate script
const genScript = require("./generate-datasheet-html.js");

// We need to manually build HTML — extract the function
// Actually, let's just read the products and generate HTML inline

const BASE = path.resolve(__dirname, "..");
const PUBLIC = path.join(BASE, "public");
const TS_FILE = path.join(BASE, "src", "lib", "products.ts");

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 794, height: 1123 });

  // Load the PDF as rendered HTML by re-generating HTML
  const htmlPath = path.join(PUBLIC, "datasheets", "falco-ck61180-verify.html");

  // Generate HTML for CK61180 by running the parser
  // Simpler: just load the generated PDF in browser won't work well
  // Instead, let's save the HTML during generation and screenshot that

  console.log("Generating HTML for screenshot...");

  // Quick inline HTML generation for CK61180
  const content = fs.readFileSync(TS_FILE, "utf-8");
  const idx = content.indexOf('slug: "falco-ck61180"');
  if (idx < 0) { console.log("Product not found"); return; }

  // Just screenshot the actual PDF using page.goto with pdf viewer
  const pdfPath = `file:///${path.join(PUBLIC, "datasheets", "falco-ck61180.pdf").replace(/\\/g, "/")}`;

  // Better approach: save HTML during generation
  console.log("Taking screenshot of generated PDF...");
  await page.goto(pdfPath);
  await page.waitForTimeout(5000);
  const ss = path.join(PUBLIC, "datasheets", "ck61180-screenshot.png");
  await page.screenshot({ path: ss });
  console.log(`Screenshot: ${ss}`);

  await browser.close();
}
main().catch(console.error);
