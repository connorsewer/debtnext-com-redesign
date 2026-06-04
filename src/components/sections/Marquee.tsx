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
      className={cn("dn-marquee", className)}
      role="group"
      aria-label={ariaLabel}
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
