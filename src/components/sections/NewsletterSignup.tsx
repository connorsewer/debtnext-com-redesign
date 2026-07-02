"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { AttachedForm } from "@/components/ui/AttachedForm";

export interface NewsletterSignupProps {
  inputLabel: string;
  inputPlaceholder?: string;
  buttonLabel: string;
  className?: string;
}

/**
 * Newsletter capture band (currently /resources). There's no subscribe
 * endpoint or email-list provider wired up yet (Resend is configured only
 * for the /demo confirmation email). Rather than fake a success state,
 * this hands the validated email to /demo, prefilled, the same way the
 * homepage's attached-form pattern is documented to work
 * (see src/components/forms/DemoForm.tsx's `?email=` prefill). That's an
 * honest fallback: the visitor lands on a real form with a real submit
 * path instead of getting silence or a fabricated "subscribed" message.
 */
export function NewsletterSignup({
  inputLabel,
  inputPlaceholder,
  buttonLabel,
  className,
}: NewsletterSignupProps) {
  const router = useRouter();

  return (
    <AttachedForm
      inputLabel={inputLabel}
      inputPlaceholder={inputPlaceholder}
      buttonLabel={buttonLabel}
      formId="resources_newsletter"
      className={className}
      onSubmitEmail={(email) => {
        router.push(`/demo?email=${encodeURIComponent(email)}`);
      }}
    />
  );
}
