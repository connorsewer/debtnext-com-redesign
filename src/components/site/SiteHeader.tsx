"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/site/MobileNav";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { platformSubNav, primaryCta, primaryNav } from "@/content/nav";

function isCurrentRoute(linkHref: string, pathname: string): boolean {
  if (linkHref === "/") return pathname === "/";
  return pathname === linkHref || pathname.startsWith(`${linkHref}/`);
}

/**
 * Top navigation. DESIGN.md §7.1:
 * - 72px height desktop, 64px tablet, 56px mobile
 * - Transparent over hero, solid (#171721) after scroll
 * - One filled primary CTA on the right
 * - Semantic <header> + <nav>; mobile drawer in MobileNav
 */
export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    // Stay transparent through the very start of scroll so the navbar
    // doesn't densify the instant a user starts touching the wheel. The
    // cinematic hero is the first viewport — solid nav comes once the
    // user has clearly committed to scrolling into the page.
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
        scrolled
          ? "bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/70 shadow-[var(--shadow-nav)]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-14 max-w-[var(--container-page)] items-center justify-between px-4 md:h-16 md:px-6 lg:h-18 lg:px-8">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-[var(--text-h4)] font-[480] tracking-tight text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
            aria-label="dPlat home"
          >
            dPlat
          </Link>
        </div>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 md:flex"
        >
          {primaryNav.map((link) => {
            const isActive = isCurrentRoute(link.href, pathname);
            const hasDropdown = link.href === "/platform";

            const linkClass = cn(
              "relative inline-flex items-center gap-1 text-[var(--text-body-strong)] font-[420] transition-colors duration-[var(--duration-instant)] hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--focus)] aria-[current=page]:text-white",
              isActive
                ? "after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:bg-[var(--primary)]"
                : "text-[var(--text-tertiary)]"
            );

            if (!hasDropdown) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={linkClass}
                >
                  {link.label}
                </Link>
              );
            }

            return (
              <div key={link.href} className="group relative">
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  aria-haspopup="menu"
                  className={linkClass}
                >
                  {link.label}
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    aria-hidden="true"
                    className="opacity-70 transition-transform duration-[var(--duration-instant)] group-hover:rotate-180 group-focus-within:rotate-180"
                  >
                    <path
                      d="M1 1l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </Link>
                <div
                  role="menu"
                  aria-label="Platform capabilities"
                  className="invisible absolute left-0 top-full z-40 mt-2 w-72 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-2 opacity-0 shadow-[var(--shadow-nav)] transition-[opacity,transform] duration-[var(--duration-instant)] -translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0"
                >
                  {platformSubNav.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      role="menuitem"
                      className="block rounded-[var(--radius-xs)] px-3 py-2 text-body-md text-[var(--text-tertiary)] hover:bg-[var(--accent)] hover:text-white focus-visible:bg-[var(--accent)] focus-visible:text-white focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <Button
              asChild
              variant="primary"
              size="md"
              onClick={() =>
                track({
                  event: "cta_primary_click",
                  location: "header",
                  label: primaryCta.label,
                })
              }
            >
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
