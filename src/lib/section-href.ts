/** Homepage section hashes stay in-page; other routes prefix `/` so they land on `/#…`. */
export function sectionHref(pathname: string, hash: string): string {
  const normalized = hash.startsWith("#") ? hash : `#${hash}`;
  return pathname === "/" ? normalized : `/${normalized}`;
}

/** Resolve a nav href: hashes go through `sectionHref`; path links (e.g. `/hire`) are unchanged. */
export function navHref(pathname: string, href: string): string {
  if (href.startsWith("#")) return sectionHref(pathname, href);
  return href;
}
