import { del, get, put } from "@vercel/blob";
import { EMPTY_GALLERY, normalizeGallery, type GalleryState } from "@/lib/gallery";

const CATALOG_PATH = "gallery/catalog.json";

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function readGallery(): Promise<GalleryState> {
  if (!blobConfigured()) return EMPTY_GALLERY;
  try {
    const result = await get(CATALOG_PATH, { access: "public", useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) return EMPTY_GALLERY;
    const text = await new Response(result.stream).text();
    return normalizeGallery(JSON.parse(text));
  } catch {
    return EMPTY_GALLERY;
  }
}

export async function writeGallery(state: GalleryState): Promise<void> {
  if (!blobConfigured()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set");
  }
  await put(CATALOG_PATH, JSON.stringify(normalizeGallery(state)), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function uploadGalleryFile(file: File, filename: string) {
  if (!blobConfigured()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set");
  }
  return put(`gallery/${filename}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type || "image/jpeg",
  });
}

export async function deleteGalleryFile(url: string) {
  if (!blobConfigured() || !url.startsWith("http")) return;
  try {
    await del(url);
  } catch {
    // Keep the catalog consistent even if the blob is already gone.
  }
}
