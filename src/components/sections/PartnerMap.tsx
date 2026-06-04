import * as React from "react";

import { SectionContainer } from "@/components/sections/SectionContainer";

export interface PartnerMapProps {
  eyebrow?: string;
  heading?: string;
  body?: string;
  caption?: string;
}

/**
 * Illustrative US partner-reach map. A simplified continental-US outline
 * (used as a clipPath) holds ~600 glowing dots that "pop in" on scroll.
 * Two colors separate agency partners from client portfolios.
 *
 * This is a concept visual, not real geocoded data. The honest caption
 * carries that meaning; the SVG itself is decorative (aria-hidden), so the
 * heading + body + caption do the communicating for assistive tech.
 *
 * Server component by design: no "use client", no hooks. Dot positions come
 * from a module-scope seeded PRNG so server and client render identically,
 * and all motion is CSS (one shared keyframe + per-dot animation-delay).
 */

const VIEWBOX_WIDTH = 960;
const VIEWBOX_HEIGHT = 600;
const DOT_COUNT = 600;

// Simplified continental-US silhouette. Coarse on purpose: it only needs to
// read as "the US" and act as a clip region for the scattered dots.
const US_PATH =
  "M 110 150 L 250 140 L 360 120 L 470 108 L 590 104 L 700 120 L 760 150 " +
  "L 800 138 L 845 150 L 855 185 L 880 200 L 905 235 L 900 270 L 870 300 " +
  "L 845 330 L 835 372 L 810 400 L 770 432 L 740 470 L 700 500 L 660 520 " +
  "L 615 528 L 580 510 L 545 500 L 520 470 L 500 452 L 470 458 L 440 470 " +
  "L 410 460 L 388 430 L 360 412 L 330 405 L 300 388 L 270 372 L 245 345 " +
  "L 222 320 L 198 300 L 175 272 L 150 245 L 130 210 L 116 180 Z";

// mulberry32: tiny deterministic PRNG. Fixed seed => identical output on
// every server/client render, so dot coordinates are SSR-stable.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Dot {
  cx: number;
  cy: number;
  r: number;
  /** true = agency partner, false = client portfolio */
  isAgency: boolean;
  delayMs: number;
}

// Built once at module load, never re-randomized at render.
const DOTS: Dot[] = (() => {
  const rng = mulberry32(0x5266eb);
  const dots: Dot[] = [];

  for (let i = 0; i < DOT_COUNT; i += 1) {
    // Weight the horizontal distribution toward the eastern half so the
    // scatter reads as the US population spread. Squaring a [0,1] sample and
    // mixing with a uniform sample biases left-of-center (east) without
    // emptying the west.
    const eastBias = rng();
    const x =
      (0.35 * eastBias + 0.65 * eastBias * eastBias) * VIEWBOX_WIDTH * 0.92 +
      VIEWBOX_WIDTH * 0.04;
    const y = rng() * VIEWBOX_HEIGHT;

    dots.push({
      cx: Math.round(x * 100) / 100,
      cy: Math.round(y * 100) / 100,
      r: 1.6 + rng() * 1.8,
      // ~38% agencies, the rest clients, so both colors are clearly present.
      isAgency: rng() < 0.38,
      // Stagger the pop-in across ~1.6s for a wave that fills the map.
      delayMs: Math.round(rng() * 1600),
    });
  }

  return dots;
})();

export function PartnerMap({
  eyebrow,
  heading,
  body,
  caption,
}: PartnerMapProps) {
  return (
    <SectionContainer surface="dark" containerSize="content">
      {eyebrow ? (
        <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
          {eyebrow}
        </p>
      ) : null}
      {heading ? (
        <h2 className="mt-3 max-w-3xl text-h2 font-[480] text-[var(--foreground)]">
          {heading}
        </h2>
      ) : null}
      {body ? (
        <p className="mt-5 max-w-[var(--container-readable)] text-body-lg text-[var(--text-tertiary)]">
          {body}
        </p>
      ) : null}

      {/* Legend: the only on-screen key to the two dot colors. */}
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
        <span className="flex items-center gap-2.5 text-body-sm text-[var(--text-tertiary)]">
          <span
            aria-hidden="true"
            className="inline-block size-2.5 rounded-full bg-[var(--primary)]"
          />
          Agencies
        </span>
        <span className="flex items-center gap-2.5 text-body-sm text-[var(--text-tertiary)]">
          <span
            aria-hidden="true"
            className="inline-block size-2.5 rounded-full bg-[var(--accent-text-dark)]"
          />
          Clients
        </span>
      </div>

      <div className="mt-8 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)]">
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="h-auto w-full"
          role="presentation"
        >
          <defs>
            <clipPath id="dn-us-clip">
              <path d={US_PATH} />
            </clipPath>
          </defs>

          {/* Faint outline so the silhouette reads even where dots are sparse. */}
          <path
            d={US_PATH}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1.25}
          />

          {/* All dots clipped to the US shape; only in-shape dots show. */}
          <g clipPath="url(#dn-us-clip)">
            {DOTS.map((dot, i) => (
              <circle
                key={i}
                className="dn-pin"
                cx={dot.cx}
                cy={dot.cy}
                r={dot.r}
                fill={
                  dot.isAgency
                    ? "var(--primary)"
                    : "var(--accent-text-dark)"
                }
                style={
                  {
                    "--dn-pin-delay": `${dot.delayMs}ms`,
                  } as React.CSSProperties
                }
              />
            ))}
          </g>
        </svg>
      </div>

      {caption ? (
        <p className="mt-4 text-caption text-[var(--text-tertiary)]">
          {caption}
        </p>
      ) : null}
    </SectionContainer>
  );
}
