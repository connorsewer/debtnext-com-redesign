import * as React from "react";

import { AmbientField } from "@/components/ambient/AmbientField";
import { CursorGlow } from "@/components/motion/CursorGlow";
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
  /** Render the decorative ambient layer (AmbientField + CursorGlow) behind the
   *  content. Defaults to on for dark / elevated-dark bands and off for light
   *  bands (the indigo field is tuned for the dark canvas). Pass `ambient={false}`
   *  to opt a dark band out (e.g. one that has its own dense backdrop). When on,
   *  the section becomes relative/isolate/overflow-hidden and the content is
   *  lifted into a relative z-10 layer so it sits above the field. */
  ambient?: boolean;
}

export function SectionContainer({
  surface = "dark",
  containerSize = "content",
  as: As = "section",
  ambient,
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

  // Ambient layer rides every dark band by default; light bands opt out (the
  // field's indigo particles are tuned for the dark canvas). Vary the seed by
  // surface so vertically-adjacent fields don't share an identical layout.
  const showAmbient = ambient ?? surface !== "light";
  const ambientSeed = surface === "elevated-dark" ? 911 : 538;

  return (
    <As
      data-surface={surface}
      className={cn(
        surface === "light" && "theme-light",
        "bg-[var(--background)] text-[var(--foreground)]",
        surface === "elevated-dark" && "bg-[var(--card)]",
        showAmbient && "relative isolate overflow-hidden",
        "py-[var(--space-section-mobile)] md:py-[var(--space-section-tablet)] lg:py-[var(--space-section-desktop)]",
        className
      )}
      {...rest}
    >
      {showAmbient ? (
        <>
          <AmbientField seed={ambientSeed} />
          <CursorGlow />
        </>
      ) : null}
      <div
        className={cn(
          "container-section mx-auto px-4 md:px-6 lg:px-8",
          showAmbient && "relative z-10",
          containerClass
        )}
      >
        {children}
      </div>
    </As>
  );
}
