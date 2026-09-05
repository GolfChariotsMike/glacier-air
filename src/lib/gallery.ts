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

export const UNASSIGNED_ID = "unassigned";

export const PROJECT_IDS = [
  "daiwa",
  "henley",
  "new-west",
  "nikola",
  "primero",
  "shelf",
  "west-cape",
  "windsor",
  UNASSIGNED_ID,
] as const;

/** Kebab slug stored on gallery images and in glacier_air_projects.id */
export type ProjectId = string;

export const PROJECT_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type CatalogueProject = {
  id: ProjectId;
  title: string;
  publicTitle: string;
  description: string;
  heroRank: 1 | 2 | null;
  sortOrder: number;
};

export const PROJECT_GROUPS: { id: ProjectId; title: string; publicTitle: string }[] = [
  { id: "daiwa", title: "Daiwa Foods", publicTitle: "Daiwa Foods Cold Storage" },
  { id: "henley", title: "Henley Park Wines", publicTitle: "Henley Park Wines chiller upgrade" },
  { id: "new-west", title: "New West Foods", publicTitle: "New West Foods Cold Storage" },
  { id: "nikola", title: "Nikola Estate", publicTitle: "Nikola Estate Barn AC" },
  { id: "primero", title: "Primero", publicTitle: "Primero HVAC installation, Pilbara" },
  { id: "shelf", title: "Shelf Subsea", publicTitle: "Shelf Subsea Dive Chiller Overhaul" },
  { id: "west-cape", title: "West Cape Howe", publicTitle: "West Cape Howe winery chiller upgrade" },
  { id: "windsor", title: "Windsor Cinema", publicTitle: "Windsor Cinema AC upgrade" },
  { id: UNASSIGNED_ID, title: "Unassigned / other", publicTitle: "Other work" },
];

export function fallbackProjects(): CatalogueProject[] {
  return PROJECT_GROUPS.map((group, i) => ({
    id: group.id,
    title: group.title,
    publicTitle: group.publicTitle,
    description: "",
    heroRank: group.id === "daiwa" ? 1 : group.id === "henley" ? 2 : null,
    sortOrder: group.id === UNASSIGNED_ID ? 999 : (i + 1) * 10,
  }));
}

export type GalleryImage = {
  id: string;
  slot: GallerySlot;
  url: string;
  alt: string;
  sort: number;
  projectId?: ProjectId | null;
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

export function isProjectId(value: string | null | undefined): value is ProjectId {
  return Boolean(value && value.length <= 80 && PROJECT_ID_RE.test(value));
}

export function slugifyProjectId(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "project";
}

export function namedProjects(projects: CatalogueProject[]): CatalogueProject[] {
  return projects
    .filter((project) => project.id !== UNASSIGNED_ID)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

export function projectSectionId(projectId: string): string {
  return `project-${projectId}`;
}

export function imagesForSlot(state: GalleryState, slot: GallerySlot): GalleryImage[] {
  return state.images
    .filter((img) => img.slot === slot)
    .sort((a, b) => a.sort - b.sort);
}

export function imagesForProject(state: GalleryState, projectId: ProjectId): GalleryImage[] {
  return imagesForSlot(state, "projects")
    .filter((img) => (img.projectId ?? UNASSIGNED_ID) === projectId)
    .sort((a, b) => a.sort - b.sort);
}

export function inferProjectId(url: string, id?: string): ProjectId {
  const hay = `${id ?? ""} ${url}`.toLowerCase();
  if (hay.includes("daiwa")) return "daiwa";
  if (hay.includes("henley")) return "henley";
  if (hay.includes("new-west")) return "new-west";
  if (hay.includes("nikola")) return "nikola";
  if (hay.includes("primero")) return "primero";
  if (hay.includes("shelf")) return "shelf";
  if (hay.includes("west-cape")) return "west-cape";
  if (hay.includes("windsor")) return "windsor";
  return UNASSIGNED_ID;
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
      .map((img, i) => {
        const rawProject =
          typeof (img as GalleryImage).projectId === "string"
            ? (img as GalleryImage).projectId
            : typeof (img as { project_id?: string }).project_id === "string"
              ? (img as { project_id?: string }).project_id
              : null;
        return {
          id: img.id,
          slot: img.slot,
          url: img.url,
          alt: typeof img.alt === "string" && img.alt.trim() ? img.alt.trim() : "Job photo",
          sort: Number.isFinite(img.sort) ? img.sort : i,
          projectId:
            img.slot === "projects"
              ? isProjectId(rawProject)
                ? rawProject
                : inferProjectId(img.url, img.id)
              : null,
        };
      }),
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

export function moveToProject(images: GalleryImage[], id: string, projectId: ProjectId): GalleryImage[] {
  const current = images.find((img) => img.id === id);
  if (!current || current.slot !== "projects") return images;
  const siblings = images.filter(
    (img) => img.slot === "projects" && (img.projectId ?? UNASSIGNED_ID) === projectId && img.id !== id
  );
  const max = siblings.reduce((n, img) => Math.max(n, img.sort), -1);
  return images.map((img) =>
    img.id === id ? { ...img, slot: "projects" as const, projectId, sort: max + 1 } : img
  );
}

export function sendProjectPhotoToUnused(images: GalleryImage[], id: string): GalleryImage[] {
  return moveToProject(images, id, UNASSIGNED_ID);
}
