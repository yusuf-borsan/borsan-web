const { chromium } = require("playwright");
const path = require("path");

async function main() {
  const pdfPath = path.resolve(__dirname, "..", "public", "datasheets", "falco-ck61180.pdf");
  const outPng = path.resolve(__dirname, "..", "public", "datasheets", "falco-ck61180-verify.png");

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 794, height: 1123 }); // A4 at 96dpi
  await page.goto(`file:///${pdfPath.replace(/\\/g, "/")}`, { waitUntil: "networkidle" });
  // Wait for PDF viewer to render
  await page.waitForTimeout(3000);
  await page.screenshot({ path: outPng, fullPage: true });
  console.log(`Screenshot saved: ${outPng}`);
  await browser.close();
}
main().catch(console.error);
