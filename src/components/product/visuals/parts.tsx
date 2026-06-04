import * as React from "react";

import { cn } from "@/lib/utils";

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
  return (
    <div
      className={cn("flex h-5 w-full overflow-hidden rounded-[5px]", className)}
      role="img"
      aria-label={`Allocation: ${segments.map((s) => `${s}%`).join(", ")}`}
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
    </div>
  );
});

/** Single-value progress bar with a tone color. */
export const ValueBar = React.memo(function ValueBar({
  value,
  tone = "indigo",
  className,
}: {
  value: number;
  tone?: "indigo" | "success" | "warning";
  className?: string;
}) {
  const color =
    tone === "success"
      ? "var(--status-success)"
      : tone === "warning"
        ? "var(--status-warning)"
        : "var(--primary)";
  return (
    <div
      className={cn("h-1.5 w-full rounded-full bg-white/10", className)}
      role="img"
      aria-label={`${value}%`}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, backgroundColor: color }}
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
  return (
    <div className={cn("flex h-8 items-end gap-1", className)} aria-hidden="true">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm"
          style={{
            height: `${Math.max(8, h * 100)}%`,
            backgroundColor:
              i === bars.length - 1 ? "var(--primary)" : "rgba(255,255,255,0.18)",
          }}
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
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={cn("h-12 w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="al-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(82,102,235,0.35)" />
          <stop offset="100%" stopColor="rgba(82,102,235,0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#al-fill)" />
      <path
        d={line}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={last[0]}
        cy={last[1]}
        r="2.2"
        fill="#fff"
        stroke="var(--primary)"
        strokeWidth="1.5"
      />
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
