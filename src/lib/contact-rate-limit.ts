const WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS = 5;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function contactClientKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

export function checkContactRateLimit(
  key: string
): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const row = buckets.get(key);
  if (!row || now > row.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (row.count >= MAX_SUBMISSIONS) {
    return { ok: false, retryAfter: Math.ceil((row.resetAt - now) / 1000) };
  }
  row.count += 1;
  return { ok: true };
}
