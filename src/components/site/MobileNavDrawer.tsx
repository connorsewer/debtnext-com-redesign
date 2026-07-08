"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/site/Wordmark";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { primaryCta, primaryNav } from "@/content/nav";

function isCurrentRoute(linkHref: string, pathname: string): boolean {
  if (linkHref === "/") return pathname === "/";
  return pathname === linkHref || pathname.startsWith(`${linkHref}/`);
}

export interface MobileNavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Mobile navigation drawer body. Pattern from DESIGN.md §7.1 (mobile open):
 * - Panel uses elevated dark surface (#20212d)
 * - Escape closes; focus returns to the trigger automatically (radix
 *   restores the previously focused element)
 * - 44px touch targets per a11y floor
 *
 * Split from the trigger (MobileNav.tsx) and loaded on first open so the
 * @radix-ui/react-dialog bundle stays off every route's eager shell chunk.
 */
export function MobileNavDrawer({ open, onOpenChange }: MobileNavDrawerProps) {
  const pathname = usePathname() ?? "/";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[var(--background)]/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 top-0 z-50 flex h-[100dvh] flex-col bg-[var(--card)] data-[state=open]:animate-in data-[state=open]:slide-in-from-top data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top md:hidden"
        >
          <Dialog.Title className="sr-only">Site navigation</Dialog.Title>
          <div className="flex h-14 items-center justify-between px-4">
            <Link
              href="/"
              onClick={() => onOpenChange(false)}
              aria-label="DebtNext home"
              className="text-h4 focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
            >
              <Wordmark />
            </Link>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-xs)] text-[var(--foreground)] hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 2l12 12M14 2L2 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          <nav
            aria-label="Mobile primary"
            className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 pt-4 pb-8"
          >
            {primaryNav.map((link) => {
              const isActive = isCurrentRoute(link.href, pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex h-12 items-center text-h4 font-[480] hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--focus)]",
                    isActive
                      ? "text-white"
                      : "text-[var(--foreground)]"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mr-3 inline-block h-1 w-3 rounded-[var(--radius-xs)]",
                      isActive
                        ? "bg-[var(--primary)]"
                        : "bg-transparent"
                    )}
                  />
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-6">
              <Button
                asChild
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  track({
                    event: "cta_primary_click",
                    location: "mobile_nav",
                    label: primaryCta.label,
                  });
                  onOpenChange(false);
                }}
              >
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
