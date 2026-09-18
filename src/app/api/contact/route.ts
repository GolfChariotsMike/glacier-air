import { NextResponse } from "next/server";
import { ENQUIRY_TYPE_VALUES } from "@/lib/enquiry-types";
import { sendEnquiryEmail, type Enquiry } from "@/lib/contact-mail";
import { checkContactRateLimit, contactClientKey } from "@/lib/contact-rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEND_ERROR =
  "Could not send just now. Call (08) 9242 3111 or email service@glacierair.com.au.";

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
  if (!(ENQUIRY_TYPE_VALUES as readonly string[]).includes(enquiry.type)) {
    return NextResponse.json(
      { ok: false, error: "Please choose an enquiry type." },
      { status: 400 }
    );
  }
  if (enquiry.name.length > 120 || enquiry.message.length > 5000 || enquiry.phone.length > 40) {
    return NextResponse.json({ ok: false, error: "That looks too long — try shortening it." }, { status: 400 });
  }

  const limited = checkContactRateLimit(contactClientKey(request));
  if (!limited.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: `Too many enquiries from this connection. Try again in ${limited.retryAfter} seconds, or call (08) 9242 3111.`,
      },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  const result = await sendEnquiryEmail(enquiry);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: SEND_ERROR }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
