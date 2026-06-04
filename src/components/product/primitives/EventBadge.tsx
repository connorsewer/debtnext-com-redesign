"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface EventBadgeProps {
  label: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

/** Floating event notification, anchored top-right of the canvas. Long-dwell
 *  cycle (mostly hidden, brief appearance). Under reduced motion it renders
 *  statically visible. */
export const EventBadge = React.memo(function EventBadge({
  label,
  className,
  ref,
}: EventBadgeProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={cn(
        "absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(27,27,39,0.85)] px-2.5 py-1 text-[10.5px] tabular-nums text-[var(--product-text-2)] backdrop-blur-md",
        className,
      )}
      initial={reduce ? false : { opacity: 0, y: -6 }}
      animate={
        reduce
          ? { opacity: 1, y: 0 }
          : { opacity: [0, 0, 1, 1, 0], y: [-6, -6, 0, 0, -6] }
      }
      transition={
        reduce
          ? undefined
          : {
              duration: 15,
              times: [0, 0.5, 0.58, 0.92, 1],
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
    >
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--status-focus)] shadow-[0_0_6px_1px_var(--status-focus)]"
      />
      {label}
    </motion.div>
  );
});
