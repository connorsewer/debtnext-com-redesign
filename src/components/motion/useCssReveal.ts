"use client";

import * as React from "react";

/**
 * Arms a CSS scroll-reveal (globals.css `[data-reveal]` / `[data-reveal-group]`
 * rules) and flips it on first intersection.
 *
 * The hidden "armed" state is applied only after mount and only when reduced
 * motion is off, so SSR markup, no-JS visitors, crawlers, and reduced-motion
 * users always see the content visible (fail-open, DESIGN.md motion guidance).
 * This replaces the framer-motion `whileInView` reveals so the section markup
 * itself can stay a Server Component.
 */
export function useCssReveal<T extends HTMLElement>(
  attr: "data-reveal" | "data-reveal-group",
  rootMargin = "0px",
  threshold = 0,
) {
  const ref = React.useRef<T | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let release = 0;
    el.setAttribute(attr, "armed");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          el.setAttribute(attr, "in");
          io.disconnect();
          // Drop the attribute once the entrance has run so the reveal's
          // transition (and its stagger delay) stops competing with element
          // hover transitions (hover.module.css .hoverCard). The revealed
          // values equal the resting defaults, so removal is visually inert.
          release = window.setTimeout(() => el.removeAttribute(attr), 2000);
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(release);
    };
  }, [attr, rootMargin, threshold]);

  return ref;
}
