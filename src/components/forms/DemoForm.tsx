"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import {
  demoRequestSchema,
  INDUSTRY_OPTIONS,
  PORTFOLIO_SIZE_OPTIONS,
  type DemoRequest,
} from "@/lib/validation/demo-schema";

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

/**
 * /demo form. DESIGN.md §8.3 + content/pages/demo.md.
 *
 * - React Hook Form + zod resolver from src/lib/validation/demo-schema
 * - Required: firstName, lastName, workEmail (work domains only),
 *   company, jobTitle, industry
 * - Optional: portfolioSize, whatToSee
 * - Honeypot field (websiteUrl) hidden from humans, populated by bots
 * - All 7 states per DESIGN.md §7.7: default / hover / focus / active /
 *   disabled / loading / error
 */
export function DemoForm() {
  const [state, setState] = React.useState<SubmitState>({ kind: "idle" });
  const [hasInteracted, setHasInteracted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
    setValue,
  } = useForm<DemoRequest>({
    resolver: zodResolver(demoRequestSchema),
    mode: "onBlur",
  });

  // Pre-fill workEmail when arriving from the homepage hero attached form
  // via ?email=… Avoids useSearchParams + Suspense boundary requirement
  // by reading window.location.search directly post-mount.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    if (email) {
      setValue("workEmail", email, { shouldValidate: false, shouldDirty: true });
    }
  }, [setValue]);

  function onFirstInteraction() {
    if (hasInteracted) return;
    setHasInteracted(true);
    track({ event: "form_start", form_id: "demo_request" });
  }

  async function onSubmit(data: DemoRequest) {
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        track({ event: "form_submit", form_id: "demo_request" });
        setState({ kind: "success" });
        return;
      }
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        fields?: Record<string, string[]>;
      };
      // Focus first invalid field on validation failure
      if (json.fields) {
        const first = Object.keys(json.fields)[0];
        if (first) setFocus(first as keyof DemoRequest);
      }
      track({
        event: "form_error",
        form_id: "demo_request",
        error_type: res.status === 409 ? "duplicate" : "server",
      });
      setState({
        kind: "error",
        message:
          json.error ??
          "Something went wrong on our end. Please try again, or email demo@debtnext.com directly.",
      });
    } catch {
      track({
        event: "form_error",
        form_id: "demo_request",
        error_type: "network",
      });
      setState({
        kind: "error",
        message:
          "We couldn't reach our server. Please check your connection and try again.",
      });
    }
  }

  if (state.kind === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-8"
      >
        <h2 className="text-h3 font-[480] text-[var(--foreground)]">
          Thanks. We received your request.
        </h2>
        <p className="mt-4 text-body-md text-[var(--text-tertiary)]">
          A platform specialist will be in touch within one business day. If
          you&apos;d like to add context before we reach out, reply to the
          confirmation email we just sent.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onFocus={onFirstInteraction}
      noValidate
      className="space-y-6"
      aria-describedby={state.kind === "error" ? "demo-form-error" : undefined}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="First name"
          id="firstName"
          error={errors.firstName?.message}
          input={
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              {...register("firstName")}
              {...inputClasses(errors.firstName, "firstName")}
            />
          }
        />
        <Field
          label="Last name"
          id="lastName"
          error={errors.lastName?.message}
          input={
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              {...register("lastName")}
              {...inputClasses(errors.lastName, "lastName")}
            />
          }
        />
      </div>

      <Field
        label="Work email"
        id="workEmail"
        error={errors.workEmail?.message}
        input={
          <input
            id="workEmail"
            type="email"
            inputMode="email"
            autoComplete="email"
            {...register("workEmail")}
            {...inputClasses(errors.workEmail, "workEmail")}
          />
        }
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Company"
          id="company"
          error={errors.company?.message}
          input={
            <input
              id="company"
              type="text"
              autoComplete="organization"
              {...register("company")}
              {...inputClasses(errors.company, "company")}
            />
          }
        />
        <Field
          label="Job title"
          id="jobTitle"
          error={errors.jobTitle?.message}
          input={
            <input
              id="jobTitle"
              type="text"
              autoComplete="organization-title"
              {...register("jobTitle")}
              {...inputClasses(errors.jobTitle, "jobTitle")}
            />
          }
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Industry"
          id="industry"
          error={errors.industry?.message}
          input={
            <select
              id="industry"
              defaultValue=""
              {...register("industry")}
              {...inputClasses(errors.industry, "industry")}
            >
              <option value="" disabled>
                Choose one
              </option>
              {INDUSTRY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          }
        />
        <Field
          label="Portfolio size"
          hint="Optional"
          id="portfolioSize"
          error={errors.portfolioSize?.message}
          input={
            <select
              id="portfolioSize"
              defaultValue=""
              {...register("portfolioSize")}
              {...inputClasses(errors.portfolioSize, "portfolioSize")}
            >
              <option value="">Prefer not to say</option>
              {PORTFOLIO_SIZE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          }
        />
      </div>

      <Field
        label="What you'd like to see"
        hint="Optional · 500 characters max"
        id="whatToSee"
        error={errors.whatToSee?.message}
        input={
          <textarea
            id="whatToSee"
            rows={4}
            maxLength={500}
            {...register("whatToSee")}
            {...inputClasses(errors.whatToSee, "whatToSee")}
          />
        }
      />

      {/* Honeypot — invisible to humans, populated by bots */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label htmlFor="websiteUrl">Leave this field empty</label>
        <input
          id="websiteUrl"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("websiteUrl")}
        />
      </div>

      {state.kind === "error" ? (
        <p
          id="demo-form-error"
          role="alert"
          className="rounded-[var(--radius-xs)] border border-[var(--destructive)]/40 bg-[var(--destructive)]/10 px-4 py-3 text-body-sm text-[var(--destructive)]"
        >
          {state.message}
        </p>
      ) : null}

      <div className="space-y-3 [margin-bottom:env(safe-area-inset-bottom)]">
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting || state.kind === "submitting"}
          aria-busy={isSubmitting || state.kind === "submitting"}
          className="min-w-[180px]"
        >
          {isSubmitting || state.kind === "submitting"
            ? "Submitting…"
            : "Request a demo"}
        </Button>
        <p className="text-body-sm text-[var(--text-tertiary)]">
          We&apos;ll respond within one business day. Your information is used
          only to coordinate the demo and follow-up. See our privacy policy.
        </p>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  input: React.ReactNode;
}

function Field({ label, id, error, hint, input }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-body-sm font-[480] text-[var(--foreground)]"
      >
        {label}
        {hint ? (
          <span className="ml-2 text-[var(--text-tertiary)]">({hint})</span>
        ) : null}
      </label>
      {input}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-body-sm text-[var(--destructive)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClasses(error: unknown, id: string) {
  return {
    className: cn(
      "min-h-[44px] w-full rounded-[var(--radius-xs)] border bg-[var(--card)] px-4 py-2 text-body-md text-[var(--foreground)] transition-colors duration-[var(--duration-instant)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] focus:ring-3 focus:ring-[var(--focus)]/35",
      error
        ? "border-[var(--destructive)]"
        : "border-[var(--border)] hover:border-[var(--focus)]"
    ),
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  };
}
