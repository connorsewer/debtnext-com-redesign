"use client";

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
 * `w-full` + `min-h-[56px]` (with the sub-label) keep every node in a row the
 * same footprint so edges, which anchor to the row's shared center line, never
 * enter a box above or below its actual text. The background is opaque enough
 * (`--product-card`-family surface, not a near-transparent gradient) that an
 * edge routed behind the node layer can never show through the label text,
 * even if the geometry is ever wrong; boundary-correct edge geometry (see
 * Schematic.tsx) is the primary fix, this is the backstop.
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
        "flex w-full min-h-[52px] flex-col justify-center gap-0.5 rounded-[10px] border border-[rgba(255,255,255,0.08)] px-3 py-2.5",
        className,
      )}
      style={{
        backgroundColor: "var(--product-card)",
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tone} 22%, transparent)`,
      }}
    >
      <span className="flex items-center gap-1.5 text-[12px] font-[500] leading-tight text-[var(--product-text)]">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: tone }}
        />
        {label}
      </span>
      {sub ? (
        <span className="text-balance text-[10.5px] leading-snug text-[var(--product-text-3)]">
          {sub}
        </span>
      ) : null}
    </div>
  );
});
