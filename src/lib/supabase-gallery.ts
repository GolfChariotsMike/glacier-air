import {
  createGalleryReadClient,
  createServiceClient,
  GALLERY_BUCKET,
  supabaseConfigured,
  SUPABASE_URL,
} from "@/lib/supabase";
import {
  EMPTY_GALLERY,
  isGallerySlot,
  MULTI_IMAGE_SLOTS,
  normalizeGallery,
  type GalleryImage,
  type GalleryState,
} from "@/lib/gallery";

export { supabaseConfigured };

const IMAGES_TABLE = "glacier_air_gallery_images";
const SLOTS_TABLE = "glacier_air_image_slots";

type GalleryRow = {
  id: string;
  slot: string;
  url: string;
  alt: string;
  sort: number;
  storage_path: string | null;
};

export function isLockedSlot(slot: string): boolean {
  return slot === "hero" || slot.startsWith("hero");
}

export async function readGallery(): Promise<GalleryState> {
  const client = createGalleryReadClient();
  if (!client) return EMPTY_GALLERY;
  try {
    const { data, error } = await client
      .from(IMAGES_TABLE)
      .select("id, slot, url, alt, sort, storage_path")
      .order("sort", { ascending: true });
    if (error || !data) return EMPTY_GALLERY;
    return normalizeGallery({
      images: data.filter((row) => !isLockedSlot(row.slot)),
    });
  } catch {
    return EMPTY_GALLERY;
  }
}

async function readRows(): Promise<GalleryRow[]> {
  const client = createServiceClient();
  const { data, error } = await client
    .from(IMAGES_TABLE)
    .select("id, slot, url, alt, sort, storage_path")
    .order("sort", { ascending: true });
  if (error) throw new Error(error.message || "Could not load photos.");
  return (data ?? []).filter((row) => isGallerySlot(row.slot));
}

export async function writeGallery(state: GalleryState): Promise<GalleryState> {
  if (!supabaseConfigured()) {
    throw new Error("Photo storage is not connected.");
  }
  const next = normalizeGallery(state);
  if (next.images.some((img) => isLockedSlot(img.slot) || !isGallerySlot(img.slot))) {
    throw new Error("That slot cannot be changed.");
  }

  const prev = await readRows();
  const keepIds = new Set(next.images.map((img) => img.id));
  const prevById = new Map(prev.map((row) => [row.id, row]));

  for (const row of prev) {
    if (!keepIds.has(row.id)) {
      await deleteStoredObject(row.storage_path, row.url);
      const client = createServiceClient();
      const { error } = await client.from(IMAGES_TABLE).delete().eq("id", row.id);
      if (error) throw new Error(error.message || "Could not remove photo.");
    }
  }

  const client = createServiceClient();
  for (const img of next.images) {
    const existing = prevById.get(img.id);
    const { error } = await client.from(IMAGES_TABLE).upsert({
      id: img.id,
      slot: img.slot,
      url: img.url,
      alt: img.alt,
      sort: img.sort,
      storage_path: existing?.storage_path ?? pathFromPublicUrl(img.url),
    });
    if (error) throw new Error(error.message || "Could not save photos.");
  }

  return readGallery();
}

export async function uploadGalleryFile(file: File, slot: string, filename: string) {
  if (!supabaseConfigured()) {
    throw new Error("Photo storage is not connected.");
  }
  if (isLockedSlot(slot) || !isGallerySlot(slot)) {
    throw new Error("That slot cannot be changed.");
  }

  const client = createServiceClient();
  const { data: slotRow } = await client
    .from(SLOTS_TABLE)
    .select("id, locked")
    .eq("id", slot)
    .maybeSingle();
  if (slotRow?.locked) {
    throw new Error("That slot cannot be changed.");
  }

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
  replaceId?: string;
}): Promise<GalleryState> {
  const client = createServiceClient();
  const prev = await readRows();

  if (input.replaceId) {
    const existing = prev.find((row) => row.id === input.replaceId);
    if (existing?.storage_path && existing.storage_path !== input.storagePath) {
      await deleteStoredObject(existing.storage_path, existing.url);
    }
  } else if (!MULTI_IMAGE_SLOTS.has(input.slot)) {
    for (const row of prev.filter((img) => img.slot === input.slot)) {
      await deleteStoredObject(row.storage_path, row.url);
      const { error } = await client.from(IMAGES_TABLE).delete().eq("id", row.id);
      if (error) throw new Error(error.message || "Could not replace photo.");
    }
  }

  const { error } = await client.from(IMAGES_TABLE).upsert({
    id: input.id,
    slot: input.slot,
    url: input.url,
    alt: input.alt,
    sort: input.sort,
    storage_path: input.storagePath,
  });
  if (error) throw new Error(error.message || "Could not save photo.");

  return readGallery();
}

export async function deleteGalleryFile(url: string, storagePath?: string | null) {
  if (!supabaseConfigured()) return;
  await deleteStoredObject(storagePath, url);
}

async function deleteStoredObject(storagePath: string | null | undefined, url: string) {
  const path = storagePath || pathFromPublicUrl(url);
  if (!path) return;
  try {
    const client = createServiceClient();
    await client.storage.from(GALLERY_BUCKET).remove([path]);
  } catch {
    // Keep the table consistent even if the object is already gone.
  }
}

export function pathFromPublicUrl(url: string): string | null {
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
