import { createHmac, randomBytes, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "ga_admin";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 8;

type Attempt = { count: number; resetAt: number };
const attempts = new Map<string, Attempt>();

function secret(): string {
  return process.env.ADMIN_PIN?.trim() || "1291";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createSessionValue(): string {
  const exp = Date.now() + SESSION_MS;
  const nonce = randomBytes(16).toString("hex");
  const payload = `${exp}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export function sessionValid(value: string | undefined): boolean {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [exp, nonce, mac] = parts;
  const payload = `${exp}.${nonce}`;
  const expected = sign(payload);
  try {
    const a = Buffer.from(mac, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  return Number(exp) > Date.now();
}

export function pinMatches(input: string): boolean {
  const pin = secret();
  if (!pin) return false;
  const a = Buffer.from(input.normalize("NFKC"));
  const b = Buffer.from(pin);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function rateLimitKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

export function checkPinRateLimit(key: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const row = attempts.get(key);
  if (!row || now > row.resetAt) {
    attempts.set(key, { count: 0, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (row.count >= MAX_FAILS) {
    return { ok: false, retryAfter: Math.ceil((row.resetAt - now) / 1000) };
  }
  return { ok: true };
}

export function recordPinFailure(key: string) {
  const now = Date.now();
  const row = attempts.get(key);
  if (!row || now > row.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  row.count += 1;
}

export function clearPinFailures(key: string) {
  attempts.delete(key);
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MS / 1000,
  };
}
