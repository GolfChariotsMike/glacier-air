export const GALLERY_SLOTS = [
  "hero",
  "projects",
  "services-ac",
  "services-ref",
  "services-mech",
  "about-main",
  "about-left",
  "about-right",
  "clients",
  "library",
] as const;

export type GallerySlot = (typeof GALLERY_SLOTS)[number];

export const MULTI_IMAGE_SLOTS = new Set<GallerySlot>(["projects", "clients", "library"]);

export const SINGLE_IMAGE_SLOTS = new Set<GallerySlot>([
  "hero",
  "services-ac",
  "services-ref",
  "services-mech",
  "about-main",
  "about-left",
  "about-right",
]);

export const SLOT_LABELS: Record<GallerySlot, string> = {
  hero: "Hero",
  projects: "Projects",
  "services-ac": "Services — Air conditioning",
  "services-ref": "Services — Refrigeration",
  "services-mech": "Services — Mechanical",
  "about-main": "About — main",
  "about-left": "About — left",
  "about-right": "About — right",
  clients: "Trusted clients",
  library: "Unused library",
};

export type GalleryImage = {
  id: string;
  slot: GallerySlot;
  url: string;
  alt: string;
  sort: number;
};

export type GalleryState = {
  images: GalleryImage[];
};

export const EMPTY_GALLERY: GalleryState = { images: [] };

export const HERO_FALLBACK = "/images/hero-bg.webp";

export const SERVICE_FALLBACKS: Record<string, string> = {
  "air-conditioning": "/images/tile-air-conditioning.webp",
  refrigeration: "/images/tile-refrigeration.webp",
  "mechanical-services": "/images/tile-mechanical.webp",
};

export const SERVICE_SLOT: Record<string, GallerySlot> = {
  "air-conditioning": "services-ac",
  refrigeration: "services-ref",
  "mechanical-services": "services-mech",
};

export const ABOUT_FALLBACKS = {
  main: { src: "/images/fremantle-16.webp", alt: "Glacier Air team at work" },
  left: { src: "/images/about-1.webp", alt: "Refrigeration installation" },
  right: { src: "/images/about-2.webp", alt: "AC installation" },
} as const;

export const CLIENT_GREY_TILES = new Set([
  "/clients/luna-palace.png",
  "/clients/tsokos.png",
  "/clients/raine-horne.png",
]);

export function imagesForSlot(state: GalleryState, slot: GallerySlot): GalleryImage[] {
  return state.images
    .filter((img) => img.slot === slot)
    .sort((a, b) => a.sort - b.sort);
}

export function firstUrl(state: GalleryState, slot: GallerySlot, fallback: string): string {
  return imagesForSlot(state, slot)[0]?.url ?? fallback;
}

export function firstAlt(state: GalleryState, slot: GallerySlot, fallback: string): string {
  return imagesForSlot(state, slot)[0]?.alt ?? fallback;
}

export function isGallerySlot(value: string): value is GallerySlot {
  return (GALLERY_SLOTS as readonly string[]).includes(value);
}

export function isDisplayableUrl(url: string): boolean {
  return (
    url.startsWith("https://") ||
    url.startsWith("http://") ||
    url.startsWith("/images/") ||
    url.startsWith("/clients/")
  );
}

export function normalizeGallery(input: unknown): GalleryState {
  if (!input || typeof input !== "object") return EMPTY_GALLERY;
  const images = Array.isArray((input as GalleryState).images)
    ? (input as GalleryState).images
    : [];
  return {
    images: images
      .filter(
        (img) =>
          img &&
          typeof img.id === "string" &&
          isGallerySlot(img.slot) &&
          typeof img.url === "string" &&
          isDisplayableUrl(img.url)
      )
      .map((img, i) => ({
        id: img.id,
        slot: img.slot,
        url: img.url,
        alt: typeof img.alt === "string" && img.alt.trim() ? img.alt.trim() : "Job photo",
        sort: Number.isFinite(img.sort) ? img.sort : i,
      })),
  };
}

export function displaceToLibrary(images: GalleryImage[], slot: GallerySlot, keepId?: string): GalleryImage[] {
  if (MULTI_IMAGE_SLOTS.has(slot)) return images;
  const displaced = images.filter((img) => img.slot === slot && img.id !== keepId);
  if (!displaced.length) return images;
  const libraryMax = images
    .filter((img) => img.slot === "library" || displaced.some((d) => d.id === img.id))
    .reduce((n, img) => Math.max(n, img.slot === "library" ? img.sort : -1), -1);
  let nextSort = libraryMax + 1;
  return images.map((img) => {
    if (img.slot === slot && img.id !== keepId) {
      return { ...img, slot: "library" as const, sort: nextSort++ };
    }
    return img;
  });
}

export function reassignImage(images: GalleryImage[], id: string, nextSlot: GallerySlot): GalleryImage[] {
  const current = images.find((img) => img.id === id);
  if (!current || current.slot === nextSlot) return images;
  const max = images.filter((img) => img.slot === nextSlot).reduce((n, img) => Math.max(n, img.sort), -1);
  const next = images.map((img) =>
    img.id === id ? { ...img, slot: nextSlot, sort: max + 1 } : img
  );
  return displaceToLibrary(next, nextSlot, id);
}
