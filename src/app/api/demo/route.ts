import { NextResponse } from "next/server";

import { sendDemoConfirmation } from "@/lib/email";
import { demoRequestSchema } from "@/lib/validation/demo-schema";
import { postLeadToZoho } from "@/lib/zoho";

export const runtime = "nodejs";

/**
 * In-memory IP rate limit + recent-email cache. Good enough for v1.
 * Upgrade to Upstash if Vercel deploys span regions (M4).
 */
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 5;
const ipHits = new Map<string, number[]>();

const recentEmails = new Map<string, number>();
const DUP_WINDOW_MS = 24 * 60 * 60 * 1000;

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "0.0.0.0";
}

function hitRateLimit(ip: string): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) {
    ipHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return false;
}

function isDuplicateEmail(email: string): boolean {
  const now = Date.now();
  const last = recentEmails.get(email.toLowerCase());
  if (last && now - last < DUP_WINDOW_MS) return true;
  recentEmails.set(email.toLowerCase(), now);
  return false;
}

export async function POST(req: Request) {
  const ip = clientIp(req);

  if (hitRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = demoRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // Honeypot
  if (parsed.data.websiteUrl && parsed.data.websiteUrl.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (isDuplicateEmail(parsed.data.workEmail)) {
    return NextResponse.json(
      {
        error:
          "We've already received a request from this email. We'll be in touch shortly.",
      },
      { status: 409 }
    );
  }

  const meta = {
    ip,
    userAgent: req.headers.get("user-agent") ?? "",
    referer: req.headers.get("referer") ?? "",
  };

  const [zoho, email] = await Promise.all([
    postLeadToZoho(parsed.data, meta),
    sendDemoConfirmation(parsed.data),
  ]);

  if (!zoho.ok || !email.ok) {
    console.error("[/api/demo] partial failure", { zoho, email });
    return NextResponse.json(
      {
        error:
          "Something went wrong on our end. Please try again, or email demo@debtnext.com directly.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
