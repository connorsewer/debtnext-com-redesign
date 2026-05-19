import { Resend } from "resend";

import type { DemoRequest } from "@/lib/validation/demo-schema";

/**
 * Resend confirmation email. Sends a short plain-text + HTML confirmation
 * to the requester so they have a record of their submission and a way
 * to reply with context before the demo specialist reaches out.
 *
 * Returns ok:true even if RESEND_API_KEY is missing so non-prod
 * environments don't fail. Verify with Connor before launch (M4 gate).
 */

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.DEMO_FROM_EMAIL ?? "demo@debtnext.com";
const resend = RESEND_KEY ? new Resend(RESEND_KEY) : null;

export async function sendDemoConfirmation(
  payload: DemoRequest
): Promise<{ ok: boolean; reason?: string }> {
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY not set — skipping confirmation email and returning ok"
    );
    return { ok: true };
  }

  const subject = "We received your dPlat demo request";
  const greeting = `Hi ${payload.firstName},`;
  const body = [
    greeting,
    "",
    "Thanks for the request. A platform specialist will reach out within one business day to schedule a walkthrough scoped to your portfolio.",
    "",
    "If you'd like to add context before then, reply to this email with anything you'd like us to focus on.",
    "",
    "If dPlat isn't the right answer for your situation, we'll tell you that on the call.",
    "",
    "— The dPlat team",
  ].join("\n");

  const html = `
    <div style="font-family: Inter, system-ui, sans-serif; font-size: 16px; line-height: 1.5; color: #171721; max-width: 560px;">
      <p>${greeting}</p>
      <p>Thanks for the request. A platform specialist will reach out within one business day to schedule a walkthrough scoped to your portfolio.</p>
      <p>If you'd like to add context before then, reply to this email with anything you'd like us to focus on.</p>
      <p>If dPlat isn't the right answer for your situation, we'll tell you that on the call.</p>
      <p style="color: #535461; font-size: 14px;">— The dPlat team</p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: `dPlat <${FROM}>`,
      to: payload.workEmail,
      subject,
      text: body,
      html,
    });
    if (error) {
      return { ok: false, reason: error.message };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "unknown email error",
    };
  }
}
