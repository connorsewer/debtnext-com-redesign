import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
const URL = "https://debtnext-website.vercel.app/";
const OUT = "./hero-snapshots";
const VIEWPORT = { width: 1440, height: 900 };
const SCRUB_MAX = 4.5 * VIEWPORT.height - VIEWPORT.height; // 450vh outer
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, reducedMotion: "no-preference" });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForFunction(() => { const v = document.querySelector("video"); return !v || v.readyState >= 1; });
await page.waitForTimeout(800);
const positions = [
  { name: "00-scrub-0", pct: 0 },
  { name: "01-scrub-50", pct: 50 },
  { name: "02-scrub-80", pct: 80 },
  { name: "03-scrub-90-framed-dash", pct: 90 },
  { name: "04-scrub-95-hold", pct: 95 },
  { name: "05-scrub-100-handoff", pct: 100 },
  { name: "06-handoff-placement", scrollY: SCRUB_MAX + 700 },
  { name: "07-handoff-performance", scrollY: SCRUB_MAX + 700, clickTab: "performance" },
  { name: "08-handoff-issues", scrollY: SCRUB_MAX + 700, clickTab: "issues" },
  { name: "09-handoff-reporting", scrollY: SCRUB_MAX + 700, clickTab: "reporting" },
];
for (const p of positions) {
  const y = p.scrollY ?? Math.round((SCRUB_MAX * p.pct) / 100);
  await page.evaluate(yy => new Promise(r => { window.scrollTo({ top: yy, behavior: "auto" }); requestAnimationFrame(() => requestAnimationFrame(r)); }), y);
  if (p.clickTab) { await page.click(`#platform-tab-${p.clickTab}`); await page.waitForTimeout(400); }
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${p.name}.png`, fullPage: false });
  console.log(`  ${p.name}  scrollY=${y}`);
}
await browser.close();
