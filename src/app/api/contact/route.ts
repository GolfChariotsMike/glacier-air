import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ENQUIRY_TYPES = [
  "Air Conditioning",
  "Refrigeration",
  "Mechanical Services",
  "Service & Maintenance",
  "Other",
] as const;

type Enquiry = {
  name: string;
  company: string;
  phone: string;
  email: string;
  type: string;
  message: string;
};

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const honeypot = String(body.website ?? "").trim();
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const enquiry: Enquiry = {
    name: String(body.name ?? "").trim(),
    company: String(body.company ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    email: String(body.email ?? "").trim(),
    type: String(body.type ?? body.subject ?? "").trim(),
    message: String(body.message ?? "").trim(),
  };

  if (!enquiry.name || !enquiry.phone || !enquiry.email || !enquiry.type || !enquiry.message) {
    return NextResponse.json(
      { ok: false, error: "Please fill in name, phone, email, enquiry type and message." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(enquiry.email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (!(ENQUIRY_TYPES as readonly string[]).includes(enquiry.type)) {
    return NextResponse.json(
      { ok: false, error: "Please choose an enquiry type." },
      { status: 400 }
    );
  }
  if (enquiry.name.length > 120 || enquiry.message.length > 5000 || enquiry.phone.length > 40) {
    return NextResponse.json({ ok: false, error: "That looks too long — try shortening it." }, { status: 400 });
  }

  try {
    await deliver(enquiry);
  } catch (err) {
    if (err instanceof Error && err.message === "browser-forward") {
      return NextResponse.json({ ok: false, code: "browser-forward" }, { status: 202 });
    }
    return NextResponse.json(
      {
        ok: false,
        error: "Could not send just now. Call (08) 9242 3111 or email service@glacierair.com.au.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

function formatBody(enquiry: Enquiry) {
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

async function deliver(enquiry: Enquiry) {
  const resendKey = process.env.RESEND_API_KEY;
  const formspreeId = process.env.FORMSPREE_ID;

  if (resendKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? "Glacier Air Website <onboarding@resend.dev>",
        to: ["service@glacierair.com.au"],
        reply_to: enquiry.email,
        subject: `Website enquiry: ${enquiry.type} — ${enquiry.name}`,
        text: formatBody(enquiry),
      }),
    });
    if (!res.ok) throw new Error("resend");
    return;
  }

  if (formspreeId) {
    const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        ...enquiry,
        _subject: `Website enquiry: ${enquiry.type}`,
      }),
    });
    if (!res.ok) throw new Error("formspree");
    return;
  }

  const res = await fetch("https://formsubmit.co/ajax/service@glacierair.com.au", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: enquiry.name,
      email: enquiry.email,
      _replyto: enquiry.email,
      _subject: `Glacier Air website enquiry: ${enquiry.type}`,
      _template: "table",
      company: enquiry.company || "(not provided)",
      phone: enquiry.phone,
      type: enquiry.type,
      message: enquiry.message,
    }),
  });

  const raw = await res.text();
  let data: { success?: string | boolean } | null = null;
  try {
    data = JSON.parse(raw) as { success?: string | boolean };
  } catch {
    // Cloudflare challenge on datacenter IPs — browser will forward instead.
    throw new Error("browser-forward");
  }
  if (!res.ok || data?.success === "false" || data?.success === false) {
    throw new Error("formsubmit");
  }
}
