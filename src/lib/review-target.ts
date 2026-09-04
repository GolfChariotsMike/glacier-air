const TEXT_TAGS = new Set([
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "P",
  "LI",
  "SPAN",
  "A",
  "BUTTON",
  "LABEL",
  "STRONG",
  "EM",
  "SMALL",
  "BLOCKQUOTE",
  "FIGCAPTION",
  "DT",
  "DD",
]);

export const REVIEW_TEXT_SELECTOR = "h1,h2,h3,h4,h5,h6,p,li,span,a,button,label,strong,em,small,blockquote,figcaption";

export function normalizeQuote(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function visibleText(el: Element): string {
  if (!(el instanceof HTMLElement)) return "";
  return normalizeQuote(el.innerText || el.textContent || "");
}

function skipped(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return true;
  if (el.closest("[data-review-ui]")) return true;
  if (el.closest(".sr-only")) return true;
  if (el.classList.contains("sr-only")) return true;
  return false;
}

export function isAnnotatable(el: Element): el is HTMLElement {
  if (!(el instanceof HTMLElement)) return false;
  if (skipped(el)) return false;
  if (!TEXT_TAGS.has(el.tagName)) return false;
  return visibleText(el).length > 0;
}

export function findTextTarget(start: EventTarget | null): HTMLElement | null {
  let node: Element | null = start instanceof Element ? start : null;
  while (node && node !== document.documentElement) {
    if (isAnnotatable(node)) return node;
    node = node.parentElement;
  }
  return null;
}

function escapeIdent(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") return CSS.escape(value);
  return value.replace(/[^A-Za-z0-9_-]/g, "\\$&");
}

export function cssPath(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  for (let depth = 0; node && node !== document.body && depth < 14; depth += 1) {
    if (node.id && /^[A-Za-z][\w:-]*$/.test(node.id)) {
      parts.unshift(`#${escapeIdent(node.id)}`);
      break;
    }
    const tag = node.tagName.toLowerCase();
    const parent: Element | null = node.parentElement;
    if (!parent) {
      parts.unshift(tag);
      break;
    }
    const same = Array.from(parent.children).filter((child: Element) => child.tagName === node!.tagName);
    const nth = same.indexOf(node) + 1;
    parts.unshift(same.length > 1 ? `${tag}:nth-of-type(${nth})` : tag);
    node = parent;
  }
  return parts.join(" > ").slice(0, 500);
}

export function findNotedElement(root: ParentNode, selector: string | null, quote: string): HTMLElement | null {
  if (selector) {
    try {
      const el = root.querySelector(selector);
      if (el instanceof HTMLElement && !skipped(el)) return el;
    } catch {
      // Invalid selector from an older note — fall back to quote match.
    }
  }

  const needle = normalizeQuote(quote);
  if (!needle) return null;

  const candidates = root.querySelectorAll(REVIEW_TEXT_SELECTOR);
  let partial: HTMLElement | null = null;
  for (const el of candidates) {
    if (!(el instanceof HTMLElement) || skipped(el)) continue;
    const text = visibleText(el);
    if (text === needle) return el;
    if (!partial && needle.length >= 12 && text.includes(needle)) partial = el;
  }
  return partial;
}
