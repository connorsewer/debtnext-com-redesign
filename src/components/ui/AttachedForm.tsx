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
      className={cn(
        "container-form flex w-full max-w-md flex-col gap-2 @sm/form:flex-row @sm/form:items-stretch @sm/form:gap-0 @sm/form:rounded-[var(--radius-xl)] @sm/form:bg-[var(--card)] @sm/form:p-1",
        className,
      )}
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
        className="min-h-touch w-full min-w-0 rounded-[var(--radius-xl)] border border-[var(--foreground)] bg-transparent px-5 text-[var(--text-body-strong)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none @sm/form:h-[46px] @sm/form:min-h-0 @sm/form:flex-1 @sm/form:rounded-[var(--radius-xl)] @sm/form:border-0 @sm/form:bg-transparent @sm/form:pl-5 @sm/form:pr-3"
      />
      <button
        type="submit"
        aria-label={buttonAriaLabel ?? buttonLabel}
        className="min-h-touch inline-flex w-full items-center justify-center rounded-[var(--radius-xl)] bg-[var(--primary)] px-5 text-[var(--text-body-strong)] font-[420] text-white transition-colors duration-[var(--duration-instant)] hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] @sm/form:h-[46px] @sm/form:min-h-0 @sm/form:w-auto @sm/form:rounded-[var(--radius-xl)]"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
