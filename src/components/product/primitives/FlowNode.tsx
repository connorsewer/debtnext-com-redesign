"use client";

// PROVISIONAL (A2): there is no existing schematic implementation to extract
// from; SchematicData is MEDIUM confidence. Harden this shape in Phase 11
// against PlatformSystemMap.tsx + the real "how it works" data before locking it.

import * as React from "react";

import { cn } from "@/lib/utils";

const KIND_TONE = {
  source: "var(--product-text-3)",
  engine: "var(--primary)",
  vendor: "var(--status-focus)",
  sink: "var(--status-success)",
} as const;

export interface FlowNodeProps {
  label: string;
  sub?: string;
  kind?: keyof typeof KIND_TONE;
  /** Decorative nodes (pure diagram scaffolding) opt out of the a11y label. */
  decorative?: boolean;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Schematic node atom (node group). A token-styled rounded box with a label and
 * optional sub-label; the `kind` drives a tone accent via var(--*). Meaningful
 * nodes expose role="img" + aria-label so the diagram reads to assistive tech;
 * decorative nodes are aria-hidden.
 *
 * Static atom — no layout-property animation (Pitfall 5 / T-10-06).
 */
export const FlowNode = React.memo(function FlowNode({
  label,
  sub,
  kind = "source",
  decorative = false,
  className,
  ref,
}: FlowNodeProps) {
  const tone = KIND_TONE[kind];
  const a11y = decorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": sub ? `${label}, ${sub}` : label } as const);
  return (
    <div
      ref={ref}
      {...a11y}
      className={cn(
        "inline-flex flex-col rounded-[10px] border border-[rgba(255,255,255,0.08)] px-3 py-2",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.008))",
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tone} 22%, transparent)`,
      }}
    >
      <span className="flex items-center gap-1.5 text-[12px] font-[500] text-[var(--product-text)]">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: tone }}
        />
        {label}
      </span>
      {sub ? (
        <span className="mt-0.5 text-[10.5px] text-[var(--product-text-3)]">{sub}</span>
      ) : null}
    </div>
  );
});
