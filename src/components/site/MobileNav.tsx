"use client";

import * as React from "react";
import dynamic from "next/dynamic";

const MobileNavDrawer = dynamic(
  () => import("./MobileNavDrawer").then((m) => m.MobileNavDrawer),
  { ssr: false },
);

function preloadDrawer() {
  void import("./MobileNavDrawer");
}

/**
 * Mobile navigation trigger. The drawer body (and its @radix-ui/react-dialog
 * dependency) is code-split and loaded on first open — with a preload on
 * pointer-down/focus so the open still feels instant — keeping radix off
 * every route's eager shell chunk. DESIGN.md §7.1.
 */
export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-haspopup="dialog"
        onPointerDown={preloadDrawer}
        onFocus={preloadDrawer}
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
        className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-xs)] text-[var(--foreground)] hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--focus)] md:hidden"
      >
        <svg
          width="20"
          height="14"
          viewBox="0 0 20 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1 1h18M1 7h18M1 13h18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {loaded ? <MobileNavDrawer open={open} onOpenChange={setOpen} /> : null}
    </>
  );
}
