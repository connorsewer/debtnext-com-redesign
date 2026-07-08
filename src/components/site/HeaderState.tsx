"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

function isCurrentRoute(linkHref: string, pathname: string): boolean {
  if (linkHref === "/") return pathname === "/";
  return pathname === linkHref || pathname.startsWith(`${linkHref}/`);
}

/**
 * The header's only client code. Renders nothing; drives two pieces of
 * header state via DOM attributes so the header markup itself can stay a
 * Server Component:
 *
 * - `data-scrolled` on `[data-site-header]` — transparent-over-hero to
 *   solid nav once the user commits to scrolling (styled via Tailwind
 *   `data-[scrolled=true]:` variants on the header).
 * - `aria-current="page"` on `a[data-nav-link]` — active-route highlight,
 *   updated on every client-side navigation (styled via
 *   `aria-[current=page]:` variants). Pre-hydration/no-JS renders without
 *   the highlight, which is cosmetic-only.
 */
export function HeaderState() {
  const pathname = usePathname() ?? "/";

  React.useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    if (!header) return;
    // Stay transparent through the very start of scroll so the navbar
    // doesn't densify the instant a user starts touching the wheel. The
    // cinematic hero is the first viewport — solid nav comes once the
    // user has clearly committed to scrolling into the page.
    const onScroll = () => {
      header.dataset.scrolled = String(window.scrollY > 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>(
      "[data-site-header] a[data-nav-link]",
    );
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      if (isCurrentRoute(href, pathname)) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, [pathname]);

  return null;
}
