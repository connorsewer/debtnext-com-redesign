import * as React from "react";

import { AmbientField } from "@/components/ambient/AmbientField";
import { cn } from "@/lib/utils";

/**
 * Shared section wrapper.
 * DESIGN.md §4.3: 72-96px vertical padding desktop, 32-48px mobile.
 * Surfaces: dark canvas (default), elevated dark card, or opt-in light band
 * (the .theme-light wrapper redeclares the relevant CSS vars).
 */
export type SectionSurface = "dark" | "elevated-dark" | "light";

interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  surface?: SectionSurface;
  containerSize?: "content" | "page" | "readable" | "narrow";
  as?: "section" | "div";
  /** Render a decorative AmbientField behind the content (dark bands only).
   *  Adds relative/isolate/overflow-hidden to the section and lifts the
   *  content into a relative z-10 layer so it sits above the field. */
  ambient?: boolean;
}

export function SectionContainer({
  surface = "dark",
  containerSize = "content",
  as: As = "section",
  ambient = false,
  className,
  children,
  ...rest
}: SectionContainerProps) {
  const containerClass = {
    content: "max-w-[var(--container-content)]",
    page: "max-w-[var(--container-page)]",
    readable: "max-w-[var(--container-readable)]",
    narrow: "max-w-[var(--container-narrow)]",
  }[containerSize];

  return (
    <As
      data-surface={surface}
      className={cn(
        surface === "light" && "theme-light",
        "bg-[var(--background)] text-[var(--foreground)]",
        surface === "elevated-dark" && "bg-[var(--card)]",
        ambient && "relative isolate overflow-hidden",
        "py-[var(--space-section-mobile)] md:py-[var(--space-section-tablet)] lg:py-[var(--space-section-desktop)]",
        className
      )}
      {...rest}
    >
      {ambient ? <AmbientField /> : null}
      <div
        className={cn(
          "container-section mx-auto px-4 md:px-6 lg:px-8",
          ambient && "relative z-10",
          containerClass
        )}
      >
        {children}
      </div>
    </As>
  );
}
