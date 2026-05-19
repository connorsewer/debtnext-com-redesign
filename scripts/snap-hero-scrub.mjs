import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
const URL = "https://debtnext-website.vercel.app/";
const OUT = "./hero-snapshots";
const VIEWPORT = { width: 1440, height: 900 };
// Section is now 400vh; pinned scrub range = 4*900 - 900 = 2700.
const SCRUB_MAX = 4 * VIEWPORT.height - VIEWPORT.height;
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, reducedMotion: "no-preference" });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForFunction(() => { const v = document.querySelector("video"); return !v || v.readyState >= 1; });
await page.waitForTimeout(800);
const positions = [
  { name: "00-scrub-0",   pct: 0  },
  { name: "01-scrub-12",  pct: 12 },
  { name: "02-scrub-50",  pct: 50 },
  { name: "03-scrub-75",  pct: 75 },
  { name: "04-scrub-88",  pct: 88 },
  { name: "05-scrub-93-hold", pct: 93 },
  { name: "06-scrub-100", pct: 100 },
  { name: "07-handoff-section", scrollY: SCRUB_MAX + 900 },
  { name: "08-handoff-tabs-click", scrollY: SCRUB_MAX + 900, clickTab: "performance" },
];
for (const p of positions) {
  const y = p.scrollY ?? Math.round((SCRUB_MAX * p.pct) / 100);
  await page.evaluate(yy => new Promise(r => { window.scrollTo({ top: yy, behavior: "auto" }); requestAnimationFrame(() => requestAnimationFrame(r)); }), y);
  if (p.clickTab) {
    await page.click(`#platform-tab-${p.clickTab}`);
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${p.name}.png`, fullPage: false });
  console.log(`  ${p.name}  scrollY=${y}`);
}
await browser.close();
