import { Resend } from "resend";

export const DEFAULT_CONTACT_TO = ["service@glacierair.com.au"] as const;
export const DEFAULT_FROM = "Glacier Air Website <website@glacierair.com.au>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type Enquiry = {
  name: string;
  company: string;
  phone: string;
  email: string;
  type: string;
  message: string;
};

export function parseRecipients(raw: string | undefined): string[] {
  const list = (raw ?? "")
    .split(/[,;]/)
    .map((value) => value.trim())
    .filter((value) => EMAIL_RE.test(value));
  return list.length ? list : [...DEFAULT_CONTACT_TO];
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatEnquiryText(enquiry: Enquiry): string {
  return [
    `Name: ${enquiry.name}`,
    `Company: ${enquiry.company || "(not provided)"}`,
    `Phone: ${enquiry.phone}`,
    `Email: ${enquiry.email}`,
    `Type: ${enquiry.type}`,
    "",
    enquiry.message,
  ].join("\n");
}

export function formatEnquiryHtml(enquiry: Enquiry): string {
  const rows: [string, string][] = [
    ["Name", enquiry.name],
    ["Company", enquiry.company || "(not provided)"],
    ["Phone", enquiry.phone],
    ["Email", enquiry.email],
    ["Type", enquiry.type],
  ];
  const details = rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:4px 12px 4px 0;color:#64748b;font-size:12px;text-transform:uppercase;">${escapeHtml(label)}</th><td style="padding:4px 0;color:#0f172a;">${escapeHtml(value)}</td></tr>`
    )
    .join("");
  return `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#0f172a;">
<p>New website enquiry</p>
<table>${details}</table>
<p style="white-space:pre-wrap;margin-top:16px;">${escapeHtml(enquiry.message)}</p>
</div>`;
}

export async function sendEnquiryEmail(enquiry: Enquiry): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production" && process.env.CONTACT_DEV_LOG === "1") {
      console.info("[contact] CONTACT_DEV_LOG — not sending", enquiry);
      return { ok: true };
    }
    return { ok: false, error: "missing-key" };
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM?.trim() || DEFAULT_FROM,
    to: parseRecipients(process.env.CONTACT_TO),
    replyTo: enquiry.email,
    subject: `Website enquiry: ${enquiry.type} — ${enquiry.name}`,
    text: formatEnquiryText(enquiry),
    html: formatEnquiryHtml(enquiry),
    tags: [{ name: "source", value: "website-contact" }],
  });

  if (error || !data) {
    console.error("[contact] Resend error", error);
    return { ok: false, error: "resend" };
  }
  return { ok: true };
}
