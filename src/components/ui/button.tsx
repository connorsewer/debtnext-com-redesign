import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Buttons follow DESIGN.md §8.1.
 *
 * - primary: filled #5266EB pill, 40px tall, body-strong type. One per band.
 * - secondary-dark: soft blue overlay, 32px tall, body-sm type.
 * - ghost: transparent. Underline + brighten on hover.
 * - link: text-only inline action.
 */
const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center whitespace-nowrap font-sans transition-colors duration-[var(--duration-instant)] ease-[var(--ease-standard)] outline-none select-none touch-manipulation disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "rounded-[var(--radius-lg)] bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)] aria-busy:cursor-progress",
        "secondary-dark":
          "rounded-[var(--radius-md)] bg-[rgba(156,180,232,0.2)] text-[var(--foreground)] hover:bg-[rgba(156,180,232,0.35)] hover:text-white",
        ghost:
          "rounded-[var(--radius-xs)] bg-transparent text-[var(--foreground)] hover:text-white hover:underline hover:decoration-[var(--primary)] hover:underline-offset-4",
        link: "rounded-[var(--radius-xs)] bg-transparent text-[var(--foreground)] underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] p-0",
      },
      size: {
        // Primary pill — 40px height per DESIGN.md §8.1
        md: "h-10 px-5 text-[var(--text-body-strong)] font-[480] leading-none",
        // Secondary dark — 32px
        sm: "h-8 px-3 text-[var(--text-body-sm)] font-[420] leading-none",
        // Ghost / link size — only sets padding/typography
        text: "h-auto px-0 text-[var(--text-body-strong)] font-[480] leading-none",
        // Icon-only square (used in mobile nav)
        icon: "size-10 p-0",
      },
    },
    compoundVariants: [
      // Pair sensible default sizes with variants
      { variant: "primary", size: "md", class: "" },
      { variant: "secondary-dark", size: "sm", class: "" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? "primary"}
      data-size={size ?? "md"}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
