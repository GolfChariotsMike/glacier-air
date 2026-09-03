export const GALLERY_SLOTS = [
  "projects",
  "services-ac",
  "services-ref",
  "services-mech",
  "about-main",
  "about-left",
  "about-right",
] as const;

export type GallerySlot = (typeof GALLERY_SLOTS)[number];

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
          img.url.startsWith("http")
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
