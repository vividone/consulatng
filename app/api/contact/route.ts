import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { SITE } from "@/lib/constants";

export const runtime = "nodejs";

const schema = z.object({
  fullName: z.string().min(2).max(200),
  companyName: z.string().min(1).max(200),
  email: z.string().email(),
  fullPhone: z.string().max(50).optional().default(""),
  service: z.string().min(1).max(120),
  expatriates: z.string().min(1).max(20),
  message: z.string().max(4000).optional().default(""),
});

/**
 * POST /api/contact
 * Delivers a contact-form submission by email via Resend.
 *
 * Env vars:
 *   RESEND_API_KEY   — required. Resend API key.
 *   CONTACT_TO       — optional. Destination inbox (defaults to SITE.email).
 *   CONTACT_FROM     — optional. Verified sender address on your Resend
 *                      domain (defaults to "Consulat <onboarding@resend.dev>",
 *                      which is Resend's shared sandbox sender for testing).
 */
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[api/contact] RESEND_API_KEY is not set");
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const to = process.env.CONTACT_TO ?? SITE.email;
  const from = process.env.CONTACT_FROM ?? "Consulat Website <onboarding@resend.dev>";

  const html = renderEmail(data);
  const text = renderPlain(data);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `New enquiry from ${data.fullName} — ${data.service}`,
      html,
      text,
    });

    if (error) {
      console.error("[api/contact] Resend error:", error);
      return NextResponse.json(
        { error: "We couldn't send your message. Please try again shortly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact] Unexpected error:", err);
    return NextResponse.json(
      { error: "We couldn't send your message. Please try again shortly." },
      { status: 500 }
    );
  }
}

function esc(v: string) {
  return v
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderEmail(d: z.infer<typeof schema>) {
  const rows: [string, string][] = [
    ["Name", d.fullName],
    ["Company", d.companyName],
    ["Email", d.email],
    ["Phone", d.fullPhone || "—"],
    ["Service of interest", d.service],
    ["Delegation size", d.expatriates],
  ];
  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#6B7280;font-size:13px;">${esc(k)}</td><td style="padding:6px 0;color:#111827;font-size:14px;">${esc(v)}</td></tr>`
    )
    .join("");
  const messageBlock = d.message
    ? `<div style="margin-top:20px"><p style="margin:0 0 6px 0;color:#6B7280;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;">Message</p><p style="margin:0;color:#111827;font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(d.message)}</p></div>`
    : "";
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;">
    <h2 style="margin:0 0 6px 0;color:#0829A5;font-size:18px;">New enquiry</h2>
    <p style="margin:0 0 20px 0;color:#6B7280;font-size:13px;">Sent from the Consulat contact form.</p>
    <table style="border-collapse:collapse;">${tableRows}</table>
    ${messageBlock}
  </div>`;
}

function renderPlain(d: z.infer<typeof schema>) {
  return [
    `New enquiry from the Consulat contact form.`,
    ``,
    `Name:                 ${d.fullName}`,
    `Company:              ${d.companyName}`,
    `Email:                ${d.email}`,
    `Phone:                ${d.fullPhone || "—"}`,
    `Service of interest:  ${d.service}`,
    `Delegation size:      ${d.expatriates}`,
    ``,
    `Message:`,
    d.message || "(none)",
  ].join("\n");
}
