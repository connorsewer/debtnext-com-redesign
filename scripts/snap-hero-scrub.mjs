import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
const URL = "https://debtnext-website.vercel.app/";
const OUT = "./hero-snapshots";
const VIEWPORT = { width: 1440, height: 900 };
// Pinned scrub range: scrollY 0 → (sectionHeight - viewportHeight) = 1800.
const SCRUB_MAX = 2700 - VIEWPORT.height;
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, reducedMotion: "no-preference" });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForFunction(() => { const v = document.querySelector("video"); return !v || v.readyState >= 1; });
await page.waitForTimeout(800);
const positions = [
  { name: "00-scrub-0",   pct: 0  },
  { name: "01-scrub-15",  pct: 15 },
  { name: "02-scrub-40",  pct: 40 },
  { name: "03-scrub-65",  pct: 65 },
  { name: "04-scrub-85",  pct: 85 },
  { name: "05-scrub-95",  pct: 95 },
  { name: "06-scrub-100", pct: 100 },
  { name: "07-past-unpin", scrollY: SCRUB_MAX + 250 },
  { name: "08-handoff-section", scrollY: SCRUB_MAX + 900 },
  { name: "09-trust-band", scrollY: SCRUB_MAX + 1700 },
];
for (const p of positions) {
  const y = p.scrollY ?? Math.round((SCRUB_MAX * p.pct) / 100);
  await page.evaluate(yy => new Promise(r => { window.scrollTo({ top: yy, behavior: "auto" }); requestAnimationFrame(() => requestAnimationFrame(r)); }), y);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${p.name}.png`, fullPage: false });
  console.log(`  ${p.name}  scrollY=${y}`);
}
await browser.close();
