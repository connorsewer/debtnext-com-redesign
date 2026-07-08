import * as React from "react";

import { cn } from "@/lib/utils";

export interface MarqueeProps {
  /** Items rendered once; the component duplicates them for a seamless loop. */
  children: React.ReactNode;
  /** Seconds for one full pass. Slower for fewer, larger items. */
  durationSeconds?: number;
  /** Accessible label for the scrolling region. */
  ariaLabel?: string;
  className?: string;
}

/**
 * Seamless auto-scrolling row. Pure CSS (see .dn-marquee in globals.css), so
 * it renders as a server component with no client JS. Renders two identical
 * sets; the track translates one set width and loops. Honors
 * prefers-reduced-motion by collapsing to a static, scrollable row.
 *
 * Used by StatMarquee (annual activity numbers) and the integrations logo wall.
 */
export function Marquee({
  children,
  durationSeconds = 40,
  ariaLabel,
  className,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "dn-marquee focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]",
        className,
      )}
      role="group"
      aria-label={ariaLabel}
      // Under prefers-reduced-motion the marquee collapses to a static
      // overflow-x:auto row (globals.css), which keyboard users must be able
      // to focus to scroll (axe scrollable-region-focusable). tabIndex is
      // unconditional because the server can't know the motion preference;
      // for motion-on users it's one labeled-group tab stop.
      tabIndex={0}
    >
      <div
        className="dn-marquee__track"
        style={{ ["--dn-marquee-duration" as string]: `${durationSeconds}s` }}
      >
        <div className="dn-marquee__set">{children}</div>
        <div className="dn-marquee__set" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
