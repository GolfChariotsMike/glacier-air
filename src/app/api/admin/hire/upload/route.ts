import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, sessionValid } from "@/lib/admin-auth";
import { supabaseConfigured } from "@/lib/supabase";
import { addHireImage, uploadHireFile } from "@/lib/supabase-hire";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 8 * 1024 * 1024;

function safeFilename(ext: string) {
  return `hire-${Date.now()}.${ext}`;
}

export async function POST(request: Request) {
  const jar = await cookies();
  if (!sessionValid(jar.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const unitId = String(form.get("unitId") ?? "").trim();
  const alt = String(form.get("alt") ?? "").trim() || "Hire unit photo";

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Choose a photo." }, { status: 400 });
  }
  if (!unitId) {
    return NextResponse.json({ ok: false, error: "Missing hire unit." }, { status: 400 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Photo storage is not connected." }, { status: 503 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ ok: false, error: "Use a JPG, PNG or WebP." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Photo is too large (max 8 MB)." }, { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";

  try {
    const uploaded = await uploadHireFile(file, unitId, safeFilename(ext));
    const units = await addHireImage({
      unitId,
      url: uploaded.url,
      path: uploaded.storagePath,
      alt,
    });
    revalidatePath("/hire");
    return NextResponse.json({ ok: true, units });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save photo.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
