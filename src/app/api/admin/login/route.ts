import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  checkPinRateLimit,
  clearPinFailures,
  cookieOptions,
  createSessionValue,
  pinMatches,
  rateLimitKey,
  recordPinFailure,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const ip = rateLimitKey(request);
  const limited = checkPinRateLimit(ip);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: `Too many attempts. Try again in ${limited.retryAfter} seconds.` },
      { status: 429 }
    );
  }

  let pin = "";
  try {
    const body = (await request.json()) as { pin?: string };
    pin = String(body.pin ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!pinMatches(pin)) {
    recordPinFailure(ip);
    return NextResponse.json({ ok: false, error: "Wrong PIN." }, { status: 401 });
  }

  clearPinFailures(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createSessionValue(), cookieOptions());
  return res;
}
