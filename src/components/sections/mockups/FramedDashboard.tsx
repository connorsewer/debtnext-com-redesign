import * as React from "react";

import { cn } from "@/lib/utils";

interface FramedDashboardProps {
  children: React.ReactNode;
  /** Small label rendered in the window chrome bar */
  title?: string;
  className?: string;
}

/**
 * Shared "dark bezel" wrapper used by every Platform-tab mockup and by
 * the held-dashboard state at the end of the hero scrub. A subtle outer
 * border + traffic-light chrome bar + inner dark surface gives the
 * mockup a sense of being a product window without leaning into a heavy
 * stylized device frame.
 */
export function FramedDashboard({
  children,
  title,
  className,
}: FramedDashboardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-deep)]",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--card-alt)] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--text-tertiary)]/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--text-tertiary)]/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--text-tertiary)]/30" />
        {title ? (
          <span className="ml-2 text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            {title}
          </span>
        ) : null}
      </div>
      <div className="p-4 md:p-5">{children}</div>
    </div>
  );
}
