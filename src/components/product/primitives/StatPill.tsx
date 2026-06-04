import * as React from "react";

import { cn } from "@/lib/utils";

const TONE = {
  neutral: "var(--product-text-3)",
  indigo: "var(--status-focus)",
  success: "var(--status-success)",
} as const;

export interface StatPillProps {
  label: string;
  tone?: keyof typeof TONE;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
}

/** Small inline metric pill used in visual footers. Static. */
export const StatPill = React.memo(function StatPill({
  label,
  tone = "neutral",
  className,
  ref,
}: StatPillProps) {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border border-[rgba(255,255,255,0.08)] px-2.5 py-1 text-[11px] tabular-nums",
        className,
      )}
      style={{ color: TONE[tone] }}
    >
      {label}
    </span>
  );
});
