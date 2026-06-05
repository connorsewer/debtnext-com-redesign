"use client";

import * as React from "react";

import { AnimatedNumber } from "@/components/product/motion";
import { SegmentedBar, Tag, TypeChip, ValueBar } from "@/components/product/visuals/parts";
import type { ToneKey } from "@/components/product/visuals/parts";
import { cn } from "@/lib/utils";

/** Bar spec for the row's middle column. One segment renders as a single
 *  ValueBar (scaleX-animated); multiple segments render as a SegmentedBar
 *  (clipPath-animated). Both are compositor-only — no width/height animation. */
export interface WorklistBarSpec {
  segments: number[];
  /** Tone for the single-segment ValueBar case (ignored for SegmentedBar). */
  tone?: "indigo" | "success" | "warning";
}

/** Trailing value. When `animate:"count"` the value counts up via the shared
 *  motion barrel (AnimatedNumber); otherwise the static string renders. */
export interface WorklistTrailing {
  value: number | string;
  animate?: "count" | "none";
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export interface WorklistRowProps {
  /** Primary label (e.g. tier name, account id, exception type). */
  primary: string;
  /** Optional secondary line under the primary. */
  secondary?: string;
  /** Optional leading status chip — label-paired by construction (Pitfall 8). */
  lead?: { label: string; tone?: ToneKey; dot?: boolean };
  /** Optional middle-column allocation/value bar. */
  bar?: WorklistBarSpec;
  /** Optional trailing value (right-aligned, tabular). */
  trailing?: WorklistTrailing;
  /** Optional trailing status tag — label-paired by construction (Pitfall 8). */
  tag?: { label: string; tone?: ToneKey };
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Console row atom. Generalizes the inline `grid-cols-[1.1fr_2fr_0.6fr]` row in
 * PlacementMatrix/IssuesWorklist into a single token-driven atom so the Console
 * archetype (Phase 10-05) composes rows without per-page styling.
 *
 * Status is always label-paired: `lead` and `tag` carry a text label with their
 * tone, so a color-only state cannot be constructed (Pitfall 8 / T-10-05).
 *
 * All motion is compositor-only — bars delegate to parts.tsx (ValueBar scaleX /
 * SegmentedBar clipPath) and the trailing count delegates to AnimatedNumber. No
 * width/height/top animation (Pitfall 5 / T-10-06).
 */
export const WorklistRow = React.memo(function WorklistRow({
  primary,
  secondary,
  lead,
  bar,
  trailing,
  tag,
  className,
  ref,
}: WorklistRowProps) {
  const multi = bar ? bar.segments.length > 1 : false;
  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-[1.1fr_2fr_0.6fr] items-center gap-x-4 gap-y-1",
        className,
      )}
    >
      {/* Primary / secondary + optional leading chip */}
      <div className="min-w-0">
        {lead ? (
          lead.dot ? (
            <TypeChip label={lead.label} tone={lead.tone} />
          ) : (
            <Tag label={lead.label} tone={lead.tone} className="mb-1" />
          )
        ) : null}
        <p className="truncate text-[12.5px] font-[500] text-[var(--product-text)]">
          {primary}
        </p>
        {secondary ? (
          <p className="truncate text-[10.5px] text-[var(--product-text-3)]">
            {secondary}
          </p>
        ) : null}
      </div>

      {/* Middle: optional bar (delegated, compositor-only) */}
      <div className="self-center">
        {bar ? (
          multi ? (
            <SegmentedBar segments={[...bar.segments]} />
          ) : (
            <ValueBar value={bar.segments[0] ?? 0} tone={bar.tone} />
          )
        ) : null}
      </div>

      {/* Trailing: value + optional label-paired tag */}
      <div className="flex flex-col items-end gap-1 self-center text-right">
        {trailing ? (
          <span className="text-[12.5px] tabular-nums text-[var(--product-text)]">
            {trailing.animate === "count" && typeof trailing.value === "number" ? (
              <AnimatedNumber
                value={trailing.value}
                decimals={trailing.decimals ?? 0}
                prefix={trailing.prefix ?? ""}
                suffix={trailing.suffix ?? ""}
              />
            ) : (
              `${trailing.prefix ?? ""}${trailing.value}${trailing.suffix ?? ""}`
            )}
          </span>
        ) : null}
        {tag ? <Tag label={tag.label} tone={tag.tone} /> : null}
      </div>
    </div>
  );
});
