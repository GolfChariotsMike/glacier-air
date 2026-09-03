import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, sessionValid } from "@/lib/admin-auth";
import { isGallerySlot, MULTI_IMAGE_SLOTS } from "@/lib/gallery";
import {
  assignGalleryImage,
  isLockedSlot,
  readGallery,
  supabaseConfigured,
  uploadGalleryFile,
} from "@/lib/supabase-gallery";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 8 * 1024 * 1024;

function safeFilename(slot: string, ext: string) {
  const slug = slot.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  return `${slug}-${Date.now()}.${ext}`;
}

export async function POST(request: Request) {
  const jar = await cookies();
  if (!sessionValid(jar.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Photo storage is not connected." }, { status: 503 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const slot = String(form.get("slot") ?? "");
  const alt = String(form.get("alt") ?? "").trim() || "Job photo";
  const replaceId = String(form.get("replaceId") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Choose a photo." }, { status: 400 });
  }
  if (!isGallerySlot(slot) || isLockedSlot(slot)) {
    return NextResponse.json({ ok: false, error: "That slot cannot be changed." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ ok: false, error: "Use a JPG, PNG or WebP." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Photo is too large (max 8 MB)." }, { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";

  try {
    const uploaded = await uploadGalleryFile(file, slot, safeFilename(slot, ext));
    const gallery = await readGallery();

    const image = {
      id: replaceId || crypto.randomUUID(),
      slot,
      url: uploaded.url,
      alt,
      sort: 0,
    };

    if (replaceId) {
      const existing = gallery.images.find((img) => img.id === replaceId);
      image.sort = existing?.sort ?? 0;
    } else if (MULTI_IMAGE_SLOTS.has(slot)) {
      const max = gallery.images
        .filter((img) => img.slot === slot)
        .reduce((n, img) => Math.max(n, img.sort), -1);
      image.sort = max + 1;
    }

    const next = await assignGalleryImage({
      id: image.id,
      slot,
      url: uploaded.url,
      alt: image.alt,
      sort: image.sort,
      storagePath: uploaded.storagePath,
      replaceId: replaceId || undefined,
    });
    return NextResponse.json({ ok: true, image, gallery: next });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save photo.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
