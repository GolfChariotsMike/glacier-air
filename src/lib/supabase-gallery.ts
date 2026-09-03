import { createAnonClient, GALLERY_BUCKET, supabaseConfigured, SUPABASE_URL } from "@/lib/supabase";
import { SEED_IMAGES } from "@/lib/gallery-seed";
import {
  inferProjectId,
  isGallerySlot,
  isProjectId,
  MULTI_IMAGE_SLOTS,
  normalizeGallery,
  type GalleryImage,
  type GalleryState,
  type ProjectId,
} from "@/lib/gallery";

export { supabaseConfigured };

const IMAGES_TABLE = "glacier_air_gallery_images";

type GalleryRow = {
  id: string;
  slot: string;
  url: string;
  alt: string;
  sort: number;
  storage_path: string | null;
  project_id: string | null;
};

function rowPayload(img: GalleryImage, storagePath: string | null) {
  return {
    id: img.id,
    slot: img.slot,
    url: img.url,
    alt: img.alt,
    sort: img.sort,
    storage_path: storagePath,
    project_id: img.slot === "projects" ? (img.projectId ?? inferProjectId(img.url, img.id)) : null,
  };
}

async function fetchRows(): Promise<GalleryRow[]> {
  const client = createAnonClient();
  const { data, error } = await client
    .from(IMAGES_TABLE)
    .select("id, slot, url, alt, sort, storage_path, project_id")
    .order("sort", { ascending: true });
  if (error) throw new Error(error.message || "Could not load photos.");
  return (data ?? []).filter((row) => isGallerySlot(row.slot));
}

function fromRows(rows: GalleryRow[]): GalleryState {
  if (!rows.length) return normalizeGallery({ images: SEED_IMAGES });
  return normalizeGallery({ images: rows });
}

export async function readGallery(): Promise<GalleryState> {
  if (!supabaseConfigured()) return normalizeGallery({ images: SEED_IMAGES });
  try {
    return fromRows(await fetchRows());
  } catch {
    return normalizeGallery({ images: SEED_IMAGES });
  }
}

export async function ensureSeeded(): Promise<GalleryState> {
  if (!supabaseConfigured()) return normalizeGallery({ images: SEED_IMAGES });
  const rows = await fetchRows();
  if (rows.length) {
    const client = createAnonClient();
    const missing = rows.filter((row) => row.slot === "projects" && !isProjectId(row.project_id));
    for (const row of missing) {
      await client
        .from(IMAGES_TABLE)
        .update({ project_id: inferProjectId(row.url, row.id) })
        .eq("id", row.id);
    }
    return fromRows(missing.length ? await fetchRows() : rows);
  }

  const client = createAnonClient();
  const { error } = await client.from(IMAGES_TABLE).upsert(SEED_IMAGES.map((img) => rowPayload(img, null)));
  if (error) return normalizeGallery({ images: SEED_IMAGES });
  return normalizeGallery({ images: SEED_IMAGES });
}

export async function writeGallery(state: GalleryState): Promise<GalleryState> {
  if (!supabaseConfigured()) {
    throw new Error("Photo storage is not connected.");
  }
  const next = normalizeGallery(state);
  if (next.images.some((img) => !isGallerySlot(img.slot))) {
    throw new Error("That slot cannot be changed.");
  }

  const prev = await fetchRows();
  const keepIds = new Set(next.images.map((img) => img.id));
  const prevById = new Map(prev.map((row) => [row.id, row]));
  const client = createAnonClient();

  for (const row of prev) {
    if (!keepIds.has(row.id)) {
      await deleteStoredObject(row.storage_path, row.url);
      const { error } = await client.from(IMAGES_TABLE).delete().eq("id", row.id);
      if (error) throw new Error(error.message || "Could not remove photo.");
    }
  }

  for (const img of next.images) {
    const existing = prevById.get(img.id);
    const { error } = await client.from(IMAGES_TABLE).upsert(
      rowPayload(img, existing?.storage_path ?? pathFromPublicUrl(img.url))
    );
    if (error) throw new Error(error.message || "Could not save photos.");
  }

  return readGallery();
}

export async function uploadGalleryFile(file: File, slot: string, filename: string) {
  if (!supabaseConfigured()) {
    throw new Error("Photo storage is not connected.");
  }
  if (!isGallerySlot(slot)) {
    throw new Error("That slot cannot be changed.");
  }

  const client = createAnonClient();
  const path = `glacier-air/${slot}/${filename}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await client.storage.from(GALLERY_BUCKET).upload(path, buffer, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw new Error(error.message || "Could not upload photo.");

  const { data } = client.storage.from(GALLERY_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, storagePath: path };
}

export async function assignGalleryImage(input: {
  id: string;
  slot: GalleryImage["slot"];
  url: string;
  alt: string;
  sort: number;
  storagePath: string;
  projectId?: ProjectId | null;
}): Promise<GalleryState> {
  await ensureSeeded();
  const client = createAnonClient();
  const prev = await fetchRows();
  const working = normalizeGallery({ images: prev.length ? prev : SEED_IMAGES }).images;

  if (!MULTI_IMAGE_SLOTS.has(input.slot)) {
    for (const row of working.filter((img) => img.slot === input.slot && img.id !== input.id)) {
      const { error } = await client.from(IMAGES_TABLE).upsert({
        id: row.id,
        slot: "library",
        url: row.url,
        alt: row.alt,
        sort: row.sort,
        storage_path: prev.find((p) => p.id === row.id)?.storage_path ?? null,
        project_id: null,
      });
      if (error) throw new Error(error.message || "Could not move the previous photo to the library.");
    }
  }

  const projectId =
    input.slot === "projects" ? (input.projectId ?? inferProjectId(input.url, input.id)) : null;
  const { error } = await client.from(IMAGES_TABLE).upsert({
    id: input.id,
    slot: input.slot,
    url: input.url,
    alt: input.alt,
    sort: input.sort,
    storage_path: input.storagePath,
    project_id: projectId,
  });
  if (error) throw new Error(error.message || "Could not save photo.");

  return readGallery();
}

async function deleteStoredObject(storagePath: string | null | undefined, url: string) {
  const path = storagePath || pathFromPublicUrl(url);
  if (!path) return;
  try {
    const client = createAnonClient();
    await client.storage.from(GALLERY_BUCKET).remove([path]);
  } catch {
    // Keep the table consistent even if the object is already gone.
  }
}

export function pathFromPublicUrl(url: string): string | null {
  if (!url.startsWith("http")) return null;
  const marker = `/storage/v1/object/public/${GALLERY_BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  try {
    return decodeURIComponent(url.slice(i + marker.length));
  } catch {
    return url.slice(i + marker.length);
  }
}

export function publicObjectUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${GALLERY_BUCKET}/${path}`;
}
