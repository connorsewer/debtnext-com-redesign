"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Pill-attached input + button — DESIGN.md §8.3.
 * Built for M1 as the hero conversion pattern stand-in. In M3 the
 * real demo form lives at /demo; this component remains for the
 * email-capture hero variant if we use it on any v2 page.
 */
export interface AttachedFormProps {
  inputLabel: string;
  inputPlaceholder?: string;
  buttonLabel: string;
  buttonAriaLabel?: string;
  onSubmitEmail?: (email: string) => void;
  className?: string;
}

export function AttachedForm({
  inputLabel,
  inputPlaceholder,
  buttonLabel,
  buttonAriaLabel,
  onSubmitEmail,
  className,
}: AttachedFormProps) {
  const id = React.useId();
  const [email, setEmail] = React.useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitEmail?.(email);
      }}
      className={cn("flex w-full max-w-md items-stretch gap-0", className)}
    >
      <label htmlFor={id} className="sr-only">
        {inputLabel}
      </label>
      <input
        id={id}
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={inputPlaceholder}
        required
        className="h-[46px] min-w-0 flex-1 rounded-l-[var(--radius-md)] border border-[var(--foreground)] bg-transparent pl-5 pr-3 text-[var(--text-body-strong)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
      />
      <button
        type="submit"
        aria-label={buttonAriaLabel ?? buttonLabel}
        className="inline-flex h-[46px] items-center justify-center rounded-r-[var(--radius-md)] bg-[var(--primary)] px-5 text-[var(--text-body-strong)] font-[420] text-white transition-colors duration-[var(--duration-instant)] hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
