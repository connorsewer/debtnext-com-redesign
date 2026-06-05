"use client";

import * as React from "react";

/**
 * Framer-free scroll reveal (FND-06: keeps framer-motion out of the eager `/`
 * chunk). An IntersectionObserver flips `data-dn-inview` once the element
 * scrolls into view; the visual transition is pure CSS (see `.dn-reveal` in
 * globals.css). Two usage shapes:
 *
 *   1. Stagger container — the observed element is a wrapper; each child carries
 *      `className="dn-reveal"` and `style={{ "--dn-reveal-i": index }}`:
 *        <RevealOnView as="ul" className="...">
 *          {items.map((it, i) => (
 *            <li key={it.id} className="dn-reveal" style={revealIndex(i)}>...</li>
 *          ))}
 *        </RevealOnView>
 *
 *   2. Single element — the observed element IS the animated one:
 *        <RevealOnView className="dn-reveal">...</RevealOnView>
 *
 * Reduced motion (handled in CSS) forces the rested, fully-visible state, so the
 * reveal always fails open. If IntersectionObserver is unavailable the element
 * reveals immediately.
 */

type RevealOnViewProps<T extends React.ElementType> = {
  as?: T;
  /** rootMargin for the observer; default reveals slightly before fully in view. */
  margin?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as">;

export function RevealOnView<T extends React.ElementType = "div">({
  as,
  margin = "0px 0px -10% 0px",
  children,
  ...rest
}: RevealOnViewProps<T>) {
  const Tag = (as ?? "div") as React.ElementType;
  const ref = React.useRef<HTMLElement | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return (
    <Tag ref={ref} data-dn-inview={inView ? "true" : "false"} {...rest}>
      {children}
    </Tag>
  );
}

/** Convenience for the per-child stagger index custom property. */
export function revealIndex(i: number): React.CSSProperties {
  return { ["--dn-reveal-i" as string]: i } as React.CSSProperties;
}
