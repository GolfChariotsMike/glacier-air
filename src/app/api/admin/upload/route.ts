import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, sessionValid } from "@/lib/admin-auth";
import { blobConfigured, readGallery, uploadGalleryFile, writeGallery } from "@/lib/blob-gallery";
import { isGallerySlot, type GalleryImage } from "@/lib/gallery";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const jar = await cookies();
  if (!sessionValid(jar.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!blobConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Set BLOB_READ_WRITE_TOKEN on Vercel to upload photos." },
      { status: 503 }
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  const slot = String(form.get("slot") ?? "");
  const alt = String(form.get("alt") ?? "").trim() || "Job photo";
  const replaceId = String(form.get("replaceId") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Choose a photo." }, { status: 400 });
  }
  if (!isGallerySlot(slot) || slot.startsWith("hero")) {
    return NextResponse.json({ ok: false, error: "That slot cannot be changed." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ ok: false, error: "Use a JPG, PNG or WebP." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Photo is too large (max 8 MB)." }, { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const blob = await uploadGalleryFile(file, `${slot}-${Date.now()}.${ext}`);
  const gallery = await readGallery();

  const image: GalleryImage = {
    id: replaceId || crypto.randomUUID(),
    slot,
    url: blob.url,
    alt,
    sort: 0,
  };

  let images = gallery.images;
  if (replaceId) {
    const existing = images.find((img) => img.id === replaceId);
    image.sort = existing?.sort ?? 0;
    images = images.filter((img) => img.id !== replaceId);
  } else if (slot !== "projects") {
    images = images.filter((img) => img.slot !== slot);
  } else {
    const max = images.filter((img) => img.slot === "projects").reduce((n, img) => Math.max(n, img.sort), -1);
    image.sort = max + 1;
  }

  images = [...images, image];
  const next = { images };
  await writeGallery(next);
  return NextResponse.json({ ok: true, image, gallery: next });
}
