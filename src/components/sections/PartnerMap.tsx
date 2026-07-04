import * as React from "react";

import { CountUp } from "@/components/sections/CountUp";
import {
  MAP_ARCS_RAW,
  MAP_DOTS_RAW,
  MAP_PINS_RAW,
} from "@/components/sections/partnerMapData";
import { cn } from "@/lib/utils";

export interface PartnerMapProps {
  eyebrow?: string;
  heading?: string;
  body?: string;
  /** Small honest framing line below the stats. */
  caption?: string;
  className?: string;
}

const VIEWBOX = "0 0 1000 629";

// Background dots: flat "x,y,x,y,..." pairs forming the US silhouette.
const DOTS: Array<[number, number]> = (() => {
  const nums = MAP_DOTS_RAW.split(",").map(Number);
  const out: Array<[number, number]> = [];
  for (let i = 0; i < nums.length; i += 2) out.push([nums[i], nums[i + 1]]);
  return out;
})();

// Pins: "x,y,size;..." — size/10 is the core radius.
const PINS: Array<[number, number, number]> = MAP_PINS_RAW.split(";").map(
  (s) => s.split(",").map(Number) as [number, number, number]
);

// Arcs: "x1,y1,x2,y2;..." rendered as a quadratic curve bowed upward.
const ARCS: string[] = MAP_ARCS_RAW.split(";").map((s) => {
  const [x1, y1, x2, y2] = s.split(",").map(Number);
  const mx = (x1 + x2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const cy = Math.min(y1, y2) - dist * 0.32;
  return `M ${x1} ${y1} Q ${mx} ${cy} ${x2} ${y2}`;
});

// [CLAIMS REVIEW] The stat row is illustrative. "500+" is the softened public
// form of the partner count (Connor, 2026-07-04); "placements routed today" is
// a representative figure, not a live feed.
const STATS: Array<{ value: number | string; label: string; count?: boolean; suffix?: string }> = [
  { value: 500, label: "Agency and legal partners", count: true, suffix: "+" },
  { value: "50", label: "States covered" },
  { value: 2847, label: "Placements routed today", count: true },
];

/**
 * Coast-to-coast partner-reach map. The US silhouette is drawn from a field of
 * low-opacity dots; highlighted pins mark network points, with a few arcs and
 * traveling pulses suggesting placement routing. All motion is declarative
 * (CSS halo + SVG pulses) and disabled under prefers-reduced-motion via CSS,
 * so this stays a server component. The SVG is decorative (aria-hidden); the
 * heading, body, stats, and caption carry the meaning.
 */
export function PartnerMap({
  eyebrow,
  heading,
  body,
  caption,
  className,
}: PartnerMapProps) {
  return (
    <section
      className={cn(
        "dn-c2c py-[var(--space-section-mobile)] text-[var(--foreground)] md:py-[var(--space-section-tablet)] lg:py-[var(--space-section-desktop)]",
        className
      )}
    >
      <div className="dn-c2c-grid" aria-hidden="true" />

      <div className="relative z-[2] mx-auto max-w-[var(--container-content)] px-4 md:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left column: copy + stats */}
          <div>
            {eyebrow ? (
              <p className="text-caption font-[480] uppercase tracking-wider text-[var(--accent-text-dark)]">
                {eyebrow}
              </p>
            ) : null}
            {heading ? (
              <h2 className="mt-3 text-h2 font-[480] text-[var(--foreground)]">
                {heading}
              </h2>
            ) : null}
            {body ? (
              <p className="mt-4 max-w-xl text-body-lg text-[var(--text-tertiary)]">
                {body}
              </p>
            ) : null}

            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-6 border-t border-[var(--border)] pt-7">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-h3 font-[480] tabular-nums text-[var(--foreground)]">
                    {stat.count ? (
                      <CountUp to={stat.value as number} suffix={stat.suffix} />
                    ) : (
                      stat.value
                    )}
                  </dt>
                  <dd className="mt-1 text-body-sm text-[var(--text-tertiary)]">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>

            {caption ? (
              <p className="mt-5 text-body-sm text-[var(--text-tertiary)]">
                {caption}
              </p>
            ) : null}
          </div>

          {/* Right column: map */}
          <div className="relative z-[1] w-full">
            <svg
              viewBox={VIEWBOX}
              preserveAspectRatio="xMidYMid meet"
              className="block h-auto w-full overflow-visible"
              aria-hidden="true"
              role="presentation"
            >
              {DOTS.map(([cx, cy], i) => (
                <circle key={`d${i}`} cx={cx} cy={cy} r={2} className="dn-c2c-dot" />
              ))}

              {ARCS.map((d, i) => (
                <path key={`a${i}`} d={d} className="dn-c2c-arc" />
              ))}

              {PINS.map(([cx, cy, size], i) => {
                const core = size / 10;
                return (
                  <g
                    key={`p${i}`}
                    className={i % 5 === 0 ? "dn-c2c-pin-active" : undefined}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={core * 2.4}
                      className="dn-c2c-pin-halo"
                    />
                    <circle cx={cx} cy={cy} r={core} className="dn-c2c-pin-core" />
                  </g>
                );
              })}

              {ARCS.map((d, i) => (
                <circle key={`pulse${i}`} r={3.2} className="dn-c2c-pulse">
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={d}
                    begin={`${i * 0.6}s`}
                    rotate="0"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.1;0.85;1"
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${i * 0.6}s`}
                  />
                </circle>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
