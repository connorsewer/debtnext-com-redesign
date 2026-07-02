// src/components/motion/useHydrated.ts
// Fail-open reveal gate (audit Batch E: SOL-6 / PLT-4 / TXT-5).
//
// Scroll-reveal primitives SSR content at opacity 0 and only reveal it once
// framer-motion hydrates AND the IntersectionObserver fires. In the post-load
// window (this site's TBT is hydration-bound) a fast scroll outruns arming and
// whole bands render blank; content also fails closed for crawlers, print,
// find-in-page, and capture tools.
//
// The fix: content is visible in server-rendered HTML by default. The hidden
// initial state and the entrance animation are armed only once JS is actually
// in control. `useHydrated` returns false during SSR and the first client
// render (so both produce identical markup, no hydration mismatch), then flips
// to true in a mount effect. Consumers gate `initial="hidden"` on it: before
// hydration `initial` is left off (element renders at its natural, visible
// resting state); after hydration the reveal arms, elements below the viewport
// start hidden and fade up on scroll-in, elements already on screen fade up
// once. `once: true` semantics and the prefers-reduced-motion path are
// untouched.
"use client";

import * as React from "react";

// A no-op subscribe: the value never changes after the initial commit, so there
// is nothing to subscribe to. `useSyncExternalStore` returns the server
// snapshot (false) for SSR + the hydration render, then the client snapshot
// (true) once React commits on the client. This gives the SSR-false /
// client-true signal without a setState-in-effect cascade.
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * False during SSR and the initial hydration render, true once the component
 * has committed on the client. Use to gate motion `initial` states so content
 * is present and visible in the pre-hydration DOM (fail open), then animate
 * only once hydration confirms JS is running.
 */
export function useHydrated(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
}
