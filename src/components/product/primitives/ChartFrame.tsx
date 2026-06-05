"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface ChartFrameAnnotation {
  /** Highlighted value (e.g. "47%", "$847.2M"). */
  value: string;
  /** Supporting caption for the annotation. */
  caption: string;
}

export interface ChartFrameProps {
  /**
   * Text alternative for the chart region. REQUIRED so the chart children
   * (AreaLine/Sparkline/bars), which are decorative SVG, get a programmatic
   * description (Pitfall 8 / T-10-05). Drives role="img" + aria-label.
   */
  ariaSummary: string;
  /** Optional caption rendered above the chart (title/eyebrow). */
  caption?: React.ReactNode;
  /** Optional annotation slot rendered beside/under the chart. */
  annotation?: ChartFrameAnnotation;
  /** The chart atom(s): AreaLine, Sparkline, bars, etc. */
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Data-story chart container. Wraps a chart atom with a caption slot, an optional
 * annotation ({value, caption}), and the required text alternative: the chart
 * region carries role="img" + aria-label={ariaSummary} so the underlying SVG
 * (which is aria-hidden in parts.tsx) is described for assistive tech.
 *
 * Token-driven container styling consistent with ProductCard. No layout-property
 * animation lives here — motion belongs to the chart atoms (Pitfall 5 / T-10-06).
 */
export const ChartFrame = React.memo(function ChartFrame({
  ariaSummary,
  caption,
  annotation,
  children,
  className,
  ref,
}: ChartFrameProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[14px] border border-[rgba(255,255,255,0.07)] p-[18px] shadow-[0_24px_44px_-18px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.028), rgba(255,255,255,0.008))",
      }}
    >
      {caption ? (
        <div className="mb-3 text-[11px] font-[500] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
          {caption}
        </div>
      ) : null}

      {/* Chart region: the text alternative for the decorative SVG children. */}
      <div role="img" aria-label={ariaSummary}>
        {children}
      </div>

      {annotation ? (
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-[18px] font-[500] leading-none tracking-[-0.022em] tabular-nums text-[var(--product-text)]">
            {annotation.value}
          </span>
          <span className="text-[11px] text-[var(--product-text-3)]">
            {annotation.caption}
          </span>
        </div>
      ) : null}
    </div>
  );
});
