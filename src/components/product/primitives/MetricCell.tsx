import * as React from "react";

import { cn } from "@/lib/utils";

const DELTA_TONE = {
  success: "var(--status-success)",
  breach: "var(--status-breach)",
  neutral: "var(--product-text-3)",
} as const;

export interface MetricCellProps {
  label: string;
  value: string;
  /** Optional unit rendered smaller after the value (e.g. "%", "M"). */
  unit?: string;
  delta?: string;
  deltaTone?: keyof typeof DELTA_TONE;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

/** KPI cell: label, value (with optional unit suffix), colored delta. Static. */
export const MetricCell = React.memo(function MetricCell({
  label,
  value,
  unit,
  delta,
  deltaTone = "neutral",
  className,
  ref,
}: MetricCellProps) {
  return (
    <div ref={ref} className={cn("flex flex-col gap-1", className)}>
      <span className="text-[10.5px] font-[500] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
        {label}
      </span>
      <span className="text-[18px] font-[500] leading-none tracking-[-0.022em] tabular-nums text-[var(--product-text)]">
        {value}
        {unit ? (
          <span className="ml-0.5 text-[12px] text-[var(--product-text-2)]">
            {unit}
          </span>
        ) : null}
      </span>
      {delta ? (
        <span
          className="text-[11px] tabular-nums"
          style={{ color: DELTA_TONE[deltaTone] }}
        >
          {delta}
        </span>
      ) : null}
    </div>
  );
});
