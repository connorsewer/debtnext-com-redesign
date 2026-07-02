"use client";

import * as React from "react";
import { z } from "zod";

import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Pill-attached input + button — DESIGN.md §8.3.
 * Built for M1 as the hero conversion pattern stand-in. In M3 the
 * real demo form lives at /demo; this component remains for the
 * email-capture hero variant if we use it on any v2 page.
 *
 * Implements the 7-state contract (CLAUDE.md §10): default, hover,
 * focus-visible, active, disabled, loading, error. `onSubmitEmail` may
 * return a promise (or throw / return false) to drive the loading and
 * error states; a synchronous void handler is also accepted.
 */

const emailSchema = z.string().min(1, "Enter your email address").email("Enter a valid email address");

export interface AttachedFormProps {
  inputLabel: string;
  inputPlaceholder?: string;
  buttonLabel: string;
  buttonAriaLabel?: string;
  /**
   * Called with the validated email on submit. Return (or resolve to)
   * `false` to signal failure and show the generic error state; throw
   * or reject with an `Error` to show its message instead.
   */
  onSubmitEmail?: (email: string) => void | boolean | Promise<void | boolean>;
  /** Analytics form_id (CLAUDE.md §13). Defaults to "attached_form". */
  formId?: string;
  className?: string;
  disabled?: boolean;
}

type FormStatus = "idle" | "loading" | "error";

export function AttachedForm({
  inputLabel,
  inputPlaceholder,
  buttonLabel,
  buttonAriaLabel,
  onSubmitEmail,
  formId = "attached_form",
  className,
  disabled = false,
}: AttachedFormProps) {
  const id = React.useId();
  const errorId = `${id}-error`;
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const hasStarted = React.useRef(false);

  function handleFocus() {
    if (hasStarted.current) return;
    hasStarted.current = true;
    track({ event: "form_start", form_id: formId });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disabled || status === "loading") return;

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Enter a valid email address";
      setStatus("error");
      setErrorMessage(message);
      track({
        event: "form_error",
        form_id: formId,
        field: "email",
        error_type: "validation",
      });
      return;
    }

    if (!onSubmitEmail) {
      // No handler wired: fail honestly rather than pretending to submit.
      setStatus("error");
      setErrorMessage("This form isn't connected yet. Please try again later.");
      track({
        event: "form_error",
        form_id: formId,
        field: "email",
        error_type: "no_handler",
      });
      return;
    }

    setStatus("loading");
    try {
      const result = await onSubmitEmail(parsed.data);
      if (result === false) {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
        track({
          event: "form_error",
          form_id: formId,
          field: "email",
          error_type: "server",
        });
        return;
      }
      track({ event: "form_submit", form_id: formId });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      track({
        event: "form_error",
        form_id: formId,
        field: "email",
        error_type: "network",
      });
    }
  }

  const isLoading = status === "loading";
  const hasError = status === "error";

  return (
    <div className={cn("container-form w-full max-w-md", className)}>
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-describedby={hasError ? errorId : undefined}
        className="flex w-full flex-col gap-2 @sm/form:flex-row @sm/form:items-stretch @sm/form:gap-0 @sm/form:rounded-[var(--radius-xl)] @sm/form:bg-[var(--card)] @sm/form:p-1"
      >
        <label htmlFor={id} className="sr-only">
          {inputLabel}
        </label>
        <input
          id={id}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (hasError) {
              setStatus("idle");
              setErrorMessage("");
            }
          }}
          onFocus={handleFocus}
          placeholder={inputPlaceholder}
          required
          disabled={disabled || isLoading}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={hasError ? errorId : undefined}
          className={cn(
            "min-h-touch w-full min-w-0 rounded-[var(--radius-xl)] border bg-transparent px-5 text-body-strong text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] focus:ring-3 focus:ring-[var(--focus)]/35 disabled:pointer-events-none disabled:opacity-60 @sm/form:h-[46px] @sm/form:min-h-0 @sm/form:flex-1 @sm/form:rounded-[var(--radius-xl)] @sm/form:bg-transparent @sm/form:pl-5 @sm/form:pr-3",
            hasError
              ? "border-[var(--destructive)] @sm/form:border @sm/form:border-[var(--destructive)]"
              : "border-[var(--foreground)] @sm/form:border-0"
          )}
        />
        <button
          type="submit"
          aria-label={buttonAriaLabel ?? buttonLabel}
          aria-busy={isLoading}
          disabled={disabled || isLoading}
          className="min-h-touch inline-flex w-full items-center justify-center rounded-[var(--radius-xl)] bg-[var(--primary)] px-5 text-body-strong font-[420] text-white transition-colors duration-[var(--duration-instant)] hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] disabled:pointer-events-none disabled:opacity-60 aria-busy:cursor-progress @sm/form:h-[46px] @sm/form:min-h-0 @sm/form:w-auto @sm/form:rounded-[var(--radius-xl)]"
        >
          {isLoading ? "Sending…" : buttonLabel}
        </button>
      </form>
      {hasError ? (
        <p
          id={errorId}
          role="alert"
          className="mt-2 text-body-sm text-[var(--destructive)]"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
