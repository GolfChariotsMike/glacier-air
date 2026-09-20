/** Canonical public origin — apex only. Never emit www. */
export const SITE_ORIGIN = "https://glacierair.com.au";

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_ORIGIN;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}
