import { z } from "zod";

/**
 * Demo request schema — shape per content/pages/demo.md:30-43.
 * Used for client-side react-hook-form validation AND server-side
 * /api/demo body validation. Single source of truth.
 */

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "ymail.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "protonmail.com",
  "proton.me",
  "msn.com",
  "comcast.net",
]);

export const INDUSTRY_OPTIONS = [
  "Utilities",
  "Financial services",
  "Telecom",
  "Fintech",
  "Healthcare",
  "Government",
  "Other",
] as const;

export const PORTFOLIO_SIZE_OPTIONS = [
  "Under $50M",
  "$50M-$250M",
  "$250M-$1B",
  "Over $1B",
  "Prefer not to say",
] as const;

export const demoRequestSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be 50 characters or fewer"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be 50 characters or fewer"),
  workEmail: z
    .string()
    .email("Enter a valid email address")
    .max(120, "Email is too long")
    .refine(
      (email) => {
        const domain = email.split("@")[1]?.toLowerCase() ?? "";
        return domain && !FREE_EMAIL_DOMAINS.has(domain);
      },
      "Please use your work email"
    ),
  company: z
    .string()
    .min(2, "Company is required")
    .max(100, "Company name must be 100 characters or fewer"),
  jobTitle: z
    .string()
    .min(2, "Job title is required")
    .max(100, "Job title must be 100 characters or fewer"),
  industry: z.enum(INDUSTRY_OPTIONS, {
    message: "Select an industry",
  }),
  portfolioSize: z
    .enum(PORTFOLIO_SIZE_OPTIONS)
    .optional()
    .or(z.literal("")),
  whatToSee: z
    .string()
    .max(500, "Please keep this under 500 characters")
    .optional()
    .or(z.literal("")),
  // Honeypot: bots fill this; humans don't see it
  websiteUrl: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type DemoRequest = z.infer<typeof demoRequestSchema>;
