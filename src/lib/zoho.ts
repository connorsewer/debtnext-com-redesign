import type { DemoRequest } from "@/lib/validation/demo-schema";

/**
 * Zoho CRM lead webhook integration. Austin Johnson owns the webhook URL.
 *
 * If ZOHO_WEBHOOK_URL is not configured, the function logs and returns
 * a synthetic success so non-prod environments don't fail. Verify the
 * real integration with Austin before launch (M4 gate).
 */
export async function postLeadToZoho(
  payload: DemoRequest,
  meta: { ip?: string; userAgent?: string; referer?: string }
): Promise<{ ok: boolean; reason?: string }> {
  const url = process.env.ZOHO_WEBHOOK_URL;

  if (!url) {
    console.warn(
      "[zoho] ZOHO_WEBHOOK_URL not set — skipping CRM post and returning ok"
    );
    return { ok: true };
  }

  const body = {
    First_Name: payload.firstName,
    Last_Name: payload.lastName,
    Email: payload.workEmail,
    Company: payload.company,
    Title: payload.jobTitle,
    Industry: payload.industry,
    Lead_Source: "Website demo form",
    Description: payload.whatToSee || "",
    Portfolio_Size: payload.portfolioSize || "",
    UTM_Referer: meta.referer || "",
    Form_Submission_IP: meta.ip || "",
    Form_Submission_UA: meta.userAgent || "",
    Submitted_At: new Date().toISOString(),
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return { ok: false, reason: `Zoho returned ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "unknown zoho error",
    };
  }
}
