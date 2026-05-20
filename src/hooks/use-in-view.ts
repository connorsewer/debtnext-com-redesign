"use client";

import * as React from "react";

/**
 * Returns a ref + boolean that flips to true the first time the element
 * crosses into the viewport. Used to gate mount-time animations so they
 * fire as the user scrolls into the element, not all at once on initial
 * page render. One-shot — the observer disconnects after the first
 * intersection.
 */
export function useInView<T extends HTMLElement>(
  rootMargin: string = "0px 0px -15% 0px"
): [React.RefObject<T | null>, boolean] {
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, inView];
}
