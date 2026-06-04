"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const TONE = {
  live: "var(--status-focus)",
  success: "var(--status-success)",
} as const;

export interface LiveStatusProps {
  label: string;
  tone?: keyof typeof TONE;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
}

/** Pulsing-dot status pill (LIVE / EVALUATED / AUDITED). Pulse honors
 *  prefers-reduced-motion. */
export const LiveStatus = React.memo(function LiveStatus({
  label,
  tone = "live",
  className,
  ref,
}: LiveStatusProps) {
  const reduce = useReducedMotion();
  const color = TONE[tone];
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] px-2.5 py-1 text-[10px] font-[500] uppercase tracking-[0.08em] text-[var(--product-text-2)]",
        className,
      )}
    >
      <motion.span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 6px 1px ${color}` }}
        animate={
          reduce ? undefined : { opacity: [0.45, 1, 0.45], scale: [0.85, 1.15, 0.85] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      />
      {label}
    </span>
  );
});
