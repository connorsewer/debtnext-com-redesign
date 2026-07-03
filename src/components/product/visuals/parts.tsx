"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { DUR_BAR, EASE_ENTRANCE } from "@/components/product/motion";

const INDIGO_SHADES = ["#5266EB", "#4456C8", "#3949B5", "#2E3A93"];

/** Horizontal allocation bar split into graduated-indigo segments, with the
 *  percentage label rendered inside each segment. */
export const SegmentedBar = React.memo(function SegmentedBar({
  segments,
  className,
}: {
  segments: number[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  // Observe the un-clipped outer wrapper, not the clipped inner element:
  // clip-path zeroes the inner element's intersectionRatio, which would
  // deadlock useInView({ amount }) and leave the bar permanently hidden.
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const shown = reduce || inView;
  return (
    <div
      ref={ref}
      className={cn("h-5 w-full overflow-hidden rounded-[5px]", className)}
      role="img"
      aria-label={`Allocation: ${segments.map((s) => `${s}%`).join(", ")}`}
    >
      <motion.div
        className="flex h-full w-full"
        initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: shown ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
        transition={{ duration: DUR_BAR, ease: EASE_ENTRANCE }}
      >
        {segments.map((pct, i) => (
          <div
            key={i}
            className="flex items-center justify-center text-[9.5px] font-[500] tabular-nums text-white/90"
            style={{
              width: `${pct}%`,
              backgroundColor: INDIGO_SHADES[i % INDIGO_SHADES.length],
            }}
          >
            {pct}%
          </div>
        ))}
      </motion.div>
    </div>
  );
});

/** Single-value progress bar with a tone color.
 *
 *  `value` is a 0..100 CSS-percent fill width (the atom's explicit contract).
 *  When the fill is a true percentage of some whole (a vendor-allocation share,
 *  a match rate), the default aria-label announces it as a percent. When the
 *  fill is a proportional length derived from a non-percentage value (an account
 *  count scaled to the series max), pass `ariaValueLabel` so the accessible name
 *  describes the series member instead of announcing a made-up percentage
 *  (SOL-3: the old `${value}%` label was a screen-reader lie for count bars). */
export const ValueBar = React.memo(function ValueBar({
  value,
  tone = "indigo",
  ariaValueLabel,
  className,
}: {
  value: number;
  tone?: "indigo" | "success" | "warning";
  ariaValueLabel?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const shown = reduce || inView;
  const color =
    tone === "success"
      ? "var(--status-success)"
      : tone === "warning"
        ? "var(--status-warning)"
        : "var(--primary)";
  return (
    <div
      ref={ref}
      className={cn("h-1.5 w-full rounded-full bg-white/10", className)}
      role="img"
      aria-label={ariaValueLabel ?? `${value}%`}
    >
      <motion.div
        className="h-full origin-left rounded-full"
        style={{ width: `${value}%`, backgroundColor: color }}
        initial={reduce ? false : { scaleX: 0 }}
        animate={{ scaleX: shown ? 1 : 0 }}
        transition={{ duration: DUR_BAR, ease: EASE_ENTRANCE }}
      />
    </div>
  );
});

/** N vertical bars; the last one is solid indigo. */
export const Sparkline = React.memo(function Sparkline({
  bars,
  className,
}: {
  bars: number[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const shown = reduce || inView;
  return (
    <div ref={ref} className={cn("flex h-8 items-end gap-1", className)} aria-hidden="true">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-1.5 origin-bottom rounded-sm"
          style={{
            height: `${Math.max(8, h * 100)}%`,
            backgroundColor:
              i === bars.length - 1 ? "var(--primary)" : "rgba(255,255,255,0.18)",
          }}
          initial={reduce ? false : { scaleY: 0 }}
          animate={{ scaleY: shown ? 1 : 0 }}
          transition={{ duration: 0.45, ease: EASE_ENTRANCE, delay: i * 0.05 }}
        />
      ))}
    </div>
  );
});

/** Smooth indigo area-fill line chart with a glowing end dot. Static SVG. */
export const AreaLine = React.memo(function AreaLine({
  points,
  className,
}: {
  points: number[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const shown = reduce || inView;
  const uid = React.useId();
  const fillId = `al-fill-${uid}`;
  const glowId = `al-glow-${uid}`;
  const w = 100;
  const h = 40;
  const step = points.length > 1 ? w / (points.length - 1) : w;
  const coords = points.map((p, i) => [
    Number((i * step).toFixed(1)),
    Number((h - p * h).toFixed(1)),
  ]);
  const line = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  const last = coords[coords.length - 1] ?? [w, h];
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={cn("h-12 w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(82,102,235,0.35)" />
          <stop offset="100%" stopColor="rgba(82,102,235,0)" />
        </linearGradient>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="rgba(82,102,235,0.6)" />
          <stop offset="100%" stopColor="rgba(82,102,235,0)" />
        </radialGradient>
      </defs>
      <motion.path
        d={area}
        fill={`url(#${fillId})`}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: shown ? 1 : 0 }}
        transition={{ duration: DUR_BAR, ease: EASE_ENTRANCE, delay: 0.2 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: shown ? 1 : 0 }}
        transition={{ duration: DUR_BAR, ease: EASE_ENTRANCE }}
      />
      <motion.circle
        cx={last[0]}
        cy={last[1]}
        r="4"
        fill={`url(#${glowId})`}
        initial={reduce ? false : { opacity: 0 }}
        animate={
          reduce
            ? { opacity: 0.45 }
            : { opacity: shown ? [0.3, 0.65, 0.3] : 0 }
        }
        transition={
          reduce
            ? undefined
            : shown
              ? { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: DUR_BAR }
              : { duration: 0.3 }
        }
      />
      <motion.circle
        cx={last[0]}
        cy={last[1]}
        r="2.2"
        fill="#fff"
        stroke="var(--primary)"
        strokeWidth="1.5"
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={reduce ? { scale: 1, opacity: 1 } : { scale: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
        transition={{ duration: DUR_BAR, ease: EASE_ENTRANCE }}
        style={{ transformOrigin: `${last[0]}px ${last[1]}px` }}
      />
    </svg>
  );
});

/* --------------------------------------------------------------------------
 * DualTrend: a purpose-built two-series area + line chart for the reporting
 * showcase (inventory vs liquidation). Unlike two layered AreaLine atoms, this
 * renders both series in ONE SVG so it can:
 *   - give each series a distinct sanctioned token color (primary blue for the
 *     lead series, success green for the recovery series) instead of the same
 *     blue at two opacities,
 *   - solid strokes with gradient area fills (no dashed look; the "dashes" in
 *     the old layered version came from pathLength dash animation reading as
 *     broken where two same-color lines crossed),
 *   - keep endpoint dots fully inside the viewBox via an explicit inset margin
 *     so the white-in-color marker never clips the right/top edge,
 *   - stack fills so they never muddy: the lower (green) fill sits under the
 *     lead (blue) fill, both low-alpha, no mix-blend.
 *
 * The viewBox aspect (320x100 -> 3.2:1) is tuned to the rendered container so
 * preserveAspectRatio="none" keeps the endpoint circles near-round. Decorative:
 * aria-hidden; the ChartFrame parent owns the text alternative.
 * ------------------------------------------------------------------------- */

/** Build a smooth cubic-Bézier path through points using a Catmull-Rom spline,
 *  with a gentle tension so the curve stays honest (no big overshoots). */
function smoothPath(coords: [number, number][], tension = 0.85): string {
  if (coords.length === 0) return "";
  if (coords.length === 1) return `M${coords[0][0]},${coords[0][1]}`;
  const t = tension / 6;
  let d = `M${coords[0][0]},${coords[0][1]}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i - 1] ?? coords[i];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2] ?? coords[i + 1];
    const c1x = p1[0] + (p2[0] - p0[0]) * t;
    const c1y = p1[1] + (p2[1] - p0[1]) * t;
    const c2x = p2[0] - (p3[0] - p1[0]) * t;
    const c2y = p2[1] - (p3[1] - p1[1]) * t;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
}

type TrendSeries = {
  points: number[]; // 0..1
  stroke: string; // CSS color / token
  fillFrom: string; // top of the gradient (near the line)
  lead?: boolean; // the primary series draws slightly heavier + on top
};

export const DualTrend = React.memo(function DualTrend({
  series,
  className,
}: {
  series: TrendSeries[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const shown = reduce || inView;
  const uid = React.useId();

  // viewBox + inset margins. The plot area is inset on every side so the line,
  // its endpoint marker (r up to ~4), and the peak all sit fully inside bounds.
  const W = 320;
  const H = 100;
  const padX = 8; // left/right inset -> last point at x = W - padX = 312 (dot r4 -> 316 < 320)
  const padTop = 9; // top headroom so a peak (value 1) never clips the top edge
  const padBottom = 6; // baseline headroom for the area fill + a low point
  const plotW = W - padX * 2;
  const plotH = H - padTop - padBottom;

  const toCoords = (pts: number[]): [number, number][] => {
    const step = pts.length > 1 ? plotW / (pts.length - 1) : plotW;
    return pts.map((p, i) => [
      Number((padX + i * step).toFixed(2)),
      Number((padTop + (1 - Math.max(0, Math.min(1, p))) * plotH).toFixed(2)),
    ]);
  };

  // Draw non-lead series first (underneath), lead series last (on top).
  const ordered = [...series].sort((a, b) => Number(a.lead) - Number(b.lead));

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <defs>
        {ordered.map((s, si) => (
          <linearGradient
            key={`grad-${si}`}
            id={`dt-fill-${uid}-${si}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={s.fillFrom} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        ))}
      </defs>

      {/* Faint horizontal gridlines for read-off; token-tinted, decorative. */}
      {[0.25, 0.5, 0.75].map((g) => {
        const y = padTop + (1 - g) * plotH;
        return (
          <line
            key={`grid-${g}`}
            x1={padX}
            x2={W - padX}
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}

      {ordered.map((s, si) => {
        const coords = toCoords(s.points);
        const line = smoothPath(coords);
        const area = `${line} L${(W - padX).toFixed(2)},${H - padBottom} L${padX},${H - padBottom} Z`;
        const last = coords[coords.length - 1] ?? [W - padX, padTop];
        return (
          <g key={`series-${si}`}>
            <motion.path
              d={area}
              fill={`url(#dt-fill-${uid}-${si})`}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: shown ? 1 : 0 }}
              transition={{ duration: DUR_BAR, ease: EASE_ENTRANCE, delay: 0.15 + si * 0.06 }}
            />
            <motion.path
              d={line}
              fill="none"
              stroke={s.stroke}
              strokeWidth={s.lead ? 2 : 1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: shown ? 1 : 0 }}
              transition={{ duration: DUR_BAR, ease: EASE_ENTRANCE, delay: si * 0.06 }}
            />
            {/* Endpoint marker: filled halo in the series color + a white core
                ring, fully inside the inset plot area so it never clips. */}
            <motion.circle
              cx={last[0]}
              cy={last[1]}
              r="4"
              fill={s.stroke}
              opacity={s.lead ? 0.22 : 0.18}
              initial={reduce ? false : { scale: 0, opacity: 0 }}
              animate={reduce ? { scale: 1 } : { scale: shown ? 1 : 0 }}
              transition={{ duration: DUR_BAR, ease: EASE_ENTRANCE, delay: DUR_BAR * 0.6 }}
              style={{ transformOrigin: `${last[0]}px ${last[1]}px` }}
            />
            <motion.circle
              cx={last[0]}
              cy={last[1]}
              r="2.4"
              fill="#fff"
              stroke={s.stroke}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              initial={reduce ? false : { scale: 0, opacity: 0 }}
              animate={reduce ? { scale: 1, opacity: 1 } : { scale: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
              transition={{ duration: DUR_BAR, ease: EASE_ENTRANCE, delay: DUR_BAR * 0.6 }}
              style={{ transformOrigin: `${last[0]}px ${last[1]}px` }}
            />
          </g>
        );
      })}
    </svg>
  );
});

const TAG_TONE = {
  success: "var(--status-success)",
  warning: "var(--status-warning)",
  breach: "var(--status-breach)",
  special: "var(--status-special)",
  neutral: "var(--product-text-3)",
} as const;

export type ToneKey = keyof typeof TAG_TONE;

function tintBg(color: string) {
  return `color-mix(in srgb, ${color} 16%, transparent)`;
}

/** Small colored category tag (HIGH/MID/LOW, On time, etc.). */
export const Tag = React.memo(function Tag({
  label,
  tone = "neutral",
  className,
}: {
  label: string;
  tone?: ToneKey;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[5px] px-1.5 py-0.5 text-[9.5px] font-[600] uppercase tracking-[0.04em]",
        className,
      )}
      style={{ color: TAG_TONE[tone], backgroundColor: tintBg(TAG_TONE[tone]) }}
    >
      {label}
    </span>
  );
});

/** Issue/exception type chip with a leading dot, used to lead a row. */
export const TypeChip = React.memo(function TypeChip({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: ToneKey;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-[5px] px-1.5 py-0.5 text-[9.5px] font-[600] uppercase tracking-[0.04em]"
      style={{ color: TAG_TONE[tone], backgroundColor: tintBg(TAG_TONE[tone]) }}
    >
      <span
        aria-hidden="true"
        className="h-1 w-1 rounded-full"
        style={{ backgroundColor: TAG_TONE[tone] }}
      />
      {label}
    </span>
  );
});
