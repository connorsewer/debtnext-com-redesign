import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";
import hover from "@/components/motion/hover.module.css";

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
          "rounded-[var(--radius-lg)] bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)] aria-busy:cursor-progress",
        "secondary-dark":
          "rounded-[var(--radius-md)] bg-[rgba(156,180,232,0.2)] text-foreground hover:bg-[rgba(156,180,232,0.35)] hover:text-white",
        ghost:
          "rounded-[var(--radius-xs)] bg-transparent text-foreground hover:text-white hover:underline hover:decoration-[var(--primary)] hover:underline-offset-4",
        link: "rounded-[var(--radius-xs)] bg-transparent text-foreground underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] p-0",
      },
      size: {
        // Primary pill — 40px design height per DESIGN.md §8.1, with a 44px
        // touch floor (min-h-touch) so the rendered hit area satisfies the
        // a11y minimum from CLAUDE.md §11.
        // The `length:` data type hint disambiguates this from a color
        // utility for tailwind-merge, so the variant's text color is kept.
        md: "h-10 min-h-touch px-5 text-[length:var(--text-body-strong)] font-[480] leading-none",
        // Secondary dark — 32px
        sm: "h-8 px-3 text-[length:var(--text-body-sm)] font-[420] leading-none",
        // Ghost / link size — only sets padding/typography. Adds 44px
        // touch floor so secondary ghost CTAs satisfy the a11y minimum
        // (CLAUDE.md §11) without changing visual text size.
        text: "inline-flex h-auto min-h-touch items-center px-0 text-[length:var(--text-body-strong)] font-[480] leading-none",
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
      className={cn(
        buttonVariants({ variant, size, className }),
        (variant ?? "primary") === "primary" && hover.hoverButton
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
