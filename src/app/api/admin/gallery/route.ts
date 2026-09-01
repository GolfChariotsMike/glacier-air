import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, sessionValid } from "@/lib/admin-auth";
import { blobConfigured, deleteGalleryFile, readGallery, writeGallery } from "@/lib/blob-gallery";
import { isGallerySlot, normalizeGallery, type GalleryImage } from "@/lib/gallery";

async function requireAdmin() {
  const jar = await cookies();
  return sessionValid(jar.get(ADMIN_COOKIE)?.value);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  const gallery = await readGallery();
  return NextResponse.json({
    ok: true,
    gallery,
    blobConfigured: blobConfigured(),
  });
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!blobConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Set BLOB_READ_WRITE_TOKEN on Vercel to save photos." },
      { status: 503 }
    );
  }

  let body: { images?: GalleryImage[] };
  try {
    body = (await request.json()) as { images?: GalleryImage[] };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const next = normalizeGallery({ images: body.images ?? [] });
  if (next.images.some((img) => !isGallerySlot(img.slot))) {
    return NextResponse.json({ ok: false, error: "Invalid slot." }, { status: 400 });
  }

  const prev = await readGallery();
  const keep = new Set(next.images.map((img) => img.url));
  for (const img of prev.images) {
    if (!keep.has(img.url)) await deleteGalleryFile(img.url);
  }

  await writeGallery(next);
  return NextResponse.json({ ok: true, gallery: next });
}
