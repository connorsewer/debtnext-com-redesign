import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { HeaderState } from "@/components/site/HeaderState";
import { MobileNav } from "@/components/site/MobileNav";
import { Wordmark } from "@/components/site/Wordmark";
import { cn } from "@/lib/utils";
import hover from "@/components/motion/hover.module.css";
import type { NavLink } from "@/content/nav";
import {
  companySubNav,
  platformSubNav,
  primaryCta,
  primaryNav,
  solutionsSubNav,
  whyDplatSubNav,
} from "@/content/nav";

/** Top-level routes that open a hover/focus dropdown of related pages. */
const DROPDOWNS: Record<string, { items: NavLink[]; label: string }> = {
  "/platform": { items: platformSubNav, label: "Platform capabilities" },
  "/solutions": { items: solutionsSubNav, label: "Industry solutions" },
  "/why-dplat": { items: whyDplatSubNav, label: "Why dPlat" },
  "/company": { items: companySubNav, label: "Company" },
};

/**
 * Top navigation. DESIGN.md §7.1:
 * - 72px height desktop, 64px tablet, 56px mobile
 * - Transparent over hero, solid (#171721) after scroll
 * - One filled primary CTA on the right
 * - Semantic <header> + <nav>; mobile drawer in MobileNav
 *
 * Server Component: the markup never hydrates. The HeaderState client leaf
 * drives `data-scrolled` (solid nav) and `aria-current` (active link) via DOM
 * attributes, styled here with `data-[scrolled=true]:` and
 * `aria-[current=page]:` variants. The header CTA tracks via data-track-* +
 * the layout ClickTracker; desktop dropdowns were already pure CSS.
 */
export function SiteHeader() {
  return (
    <header
      data-site-header
      className={cn(
        // Fixed so the hero (and other section heroes) extend behind the
        // navbar — the dark body bg never shows above the hero. Padding
        // for non-home pages is added via PageHero.
        "fixed inset-x-0 top-0 z-30 bg-transparent transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
        "data-[scrolled=true]:bg-[var(--background)]/95 data-[scrolled=true]:supports-[backdrop-filter]:bg-[var(--background)]/70 data-[scrolled=true]:backdrop-blur data-[scrolled=true]:shadow-[var(--shadow-nav)]"
      )}
    >
      <HeaderState />
      <div className="mx-auto flex h-14 max-w-[var(--container-page)] items-center justify-between px-4 [padding-top:env(safe-area-inset-top)] [padding-left:max(env(safe-area-inset-left),1rem)] [padding-right:max(env(safe-area-inset-right),1rem)] md:h-16 md:px-6 lg:h-18 lg:px-8">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex min-h-touch min-w-touch items-center text-h4 focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
            aria-label="DebtNext home"
          >
            <Wordmark />
          </Link>
        </div>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 md:flex"
        >
          {primaryNav.map((link) => {
            const dropdown = DROPDOWNS[link.href];
            const hasDropdown = Boolean(dropdown);

            // Resting state is the tertiary link; aria-current="page" (set by
            // HeaderState) flips it to white and adds the primary underline.
            const linkClass = cn(
              "relative inline-flex items-center gap-1 text-body-strong font-[420] text-[var(--text-tertiary)] transition-colors duration-[var(--duration-instant)] hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--focus)]",
              hover.hoverUnderline,
              // Active link: white text + primary underline; suppress the
              // hoverUnderline wipe (it was skipped for the active link before).
              "aria-[current=page]:text-white aria-[current=page]:[background-image:none] aria-[current=page]:after:absolute aria-[current=page]:after:left-0 aria-[current=page]:after:right-0 aria-[current=page]:after:-bottom-1 aria-[current=page]:after:h-px aria-[current=page]:after:bg-[var(--primary)]"
            );

            if (!hasDropdown) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-nav-link
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
                  data-nav-link
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
                {/*
                  Hover bridge: the 8px gap between trigger and panel becomes
                  pt-2 inside the wrapper, so the mouse stays over a descendant
                  of `group` while crossing it. Without this, group-hover drops
                  the instant the cursor leaves the trigger.
                */}
                <div className="invisible absolute left-0 top-full z-40 pt-2 opacity-0 -translate-y-1 transition-[opacity,transform] duration-[var(--duration-instant)] group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0">
                  <div
                    role="menu"
                    aria-label={dropdown!.label}
                    className="w-72 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-2 shadow-[var(--shadow-nav)]"
                  >
                    {dropdown!.items.map((sub) => (
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
              data-track-event="cta_primary_click"
              data-track-location="header"
              data-track-label={primaryCta.label}
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
