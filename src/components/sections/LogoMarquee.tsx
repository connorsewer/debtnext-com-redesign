import * as React from "react";

import { Marquee } from "@/components/sections/Marquee";
import { cn } from "@/lib/utils";

export interface LogoMarqueeProps {
  eyebrow?: string;
  /** Platform / partner names rendered as typographic chips. */
  logos: string[];
  durationSeconds?: number;
  className?: string;
}

/**
 * A scrolling logo wall built from typographic chips (no image assets needed).
 * Credentializing band under the integrations hero. Honors reduced-motion via
 * the shared .dn-marquee rules.
 */
export function LogoMarquee({
  eyebrow,
  logos,
  durationSeconds = 35,
  className,
}: LogoMarqueeProps) {
  return (
    <section
      className={cn(
        "bg-[var(--background)] py-10 text-[var(--foreground)] md:py-12",
        className
      )}
    >
      {eyebrow ? (
        <div className="mx-auto mb-6 max-w-[var(--container-content)] px-4 md:px-6 lg:px-8">
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            {eyebrow}
          </p>
        </div>
      ) : null}

      <Marquee durationSeconds={durationSeconds} ariaLabel="Integration partners">
        {logos.map((name) => (
          <span
            key={name}
            className="mx-2 whitespace-nowrap rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-body-strong font-[480] text-[var(--text-tertiary)]"
          >
            {name}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
