import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, sessionValid } from "@/lib/admin-auth";
import { isGallerySlot, normalizeGallery, type GalleryImage } from "@/lib/gallery";
import { ensureSeeded, supabaseConfigured, writeGallery } from "@/lib/supabase-gallery";

async function requireAdmin() {
  const jar = await cookies();
  return sessionValid(jar.get(ADMIN_COOKIE)?.value);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  const gallery = await ensureSeeded();
  return NextResponse.json({
    ok: true,
    gallery,
    supabaseConfigured: supabaseConfigured(),
  });
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Photo storage is not connected." }, { status: 503 });
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

  try {
    const gallery = await writeGallery(next);
    return NextResponse.json({ ok: true, gallery });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save photos.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
