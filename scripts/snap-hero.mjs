// Captures the cinematic hero at key scroll positions so we can review
// the desktop scroll-scrub behavior from any device.
// Usage:  node scripts/snap-hero.mjs [url]

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const URL = process.argv[2] ?? "https://debtnext-website.vercel.app/";
const OUT = "./hero-snapshots";
const VIEWPORT = { width: 1440, height: 900 };
// The hero outer section is 300vh tall (= 3 × viewport height) on desktop.
const SECTION_PX = VIEWPORT.height * 3;

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 1,
  reducedMotion: "no-preference",
});
const page = await context.newPage();

console.log(`→ ${URL} at ${VIEWPORT.width}×${VIEWPORT.height}`);
await page.goto(URL, { waitUntil: "networkidle" });

// Wait for the hero video metadata to load so GSAP can wire scrub.
await page.waitForFunction(() => {
  const v = document.querySelector('video[data-slot=""], video');
  return !v || v.readyState >= 1;
});
// Let GSAP register ScrollTriggers (one frame is usually enough; give it more).
await page.waitForTimeout(500);

const positions = [
  { name: "00-0pct-start", pct: 0 },
  { name: "01-10pct", pct: 10 },
  { name: "02-25pct", pct: 25 },
  { name: "03-50pct", pct: 50 },
  { name: "04-75pct", pct: 75 },
  { name: "05-90pct-handoff-start", pct: 90 },
  { name: "06-95pct-handoff-mid", pct: 95 },
  { name: "07-100pct-handoff-end", pct: 100 },
  { name: "08-section2", pct: 110 }, // past the hero into the handoff section
];

for (const { name, pct } of positions) {
  const targetY = Math.round((SECTION_PX * pct) / 100);
  await page.evaluate(
    (y) =>
      new Promise((resolve) => {
        window.scrollTo({ top: y, behavior: "auto" });
        // Two frames to flush, then settle for scrub:0.5 lerp
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      }),
    targetY
  );
  // GSAP scrub lerp of 0.5s plus a bit of cushion for the video to seek.
  await page.waitForTimeout(900);
  const path = `${OUT}/${name}.png`;
  await page.screenshot({ path, fullPage: false });
  console.log(`  ${name}  scrollY=${targetY}  →  ${path}`);
}

await browser.close();
console.log("done");
