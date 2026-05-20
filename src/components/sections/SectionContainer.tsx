import * as React from "react";

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
}

export function SectionContainer({
  surface = "dark",
  containerSize = "content",
  as: As = "section",
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
        "py-[var(--space-section-mobile)] md:py-[var(--space-section-tablet)] lg:py-[var(--space-section-desktop)]",
        className
      )}
      {...rest}
    >
      <div className={cn("container-section mx-auto px-4 md:px-6 lg:px-8", containerClass)}>
        {children}
      </div>
    </As>
  );
}
