import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, sessionValid } from "@/lib/admin-auth";
import { supabaseConfigured } from "@/lib/supabase";
import { deleteHireImage, reorderHireImages } from "@/lib/supabase-hire";

async function requireAdmin() {
  const jar = await cookies();
  return sessionValid(jar.get(ADMIN_COOKIE)?.value);
}

function refreshPublic() {
  revalidatePath("/hire");
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Photo storage is not connected." }, { status: 503 });
  }

  let body: { unitId?: string; orderedIds?: string[] };
  try {
    body = (await request.json()) as { unitId?: string; orderedIds?: string[] };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const unitId = String(body.unitId ?? "").trim();
  const orderedIds = Array.isArray(body.orderedIds) ? body.orderedIds.map((id) => String(id)) : [];
  if (!unitId || !orderedIds.length) {
    return NextResponse.json({ ok: false, error: "Missing hire photos." }, { status: 400 });
  }

  try {
    const units = await reorderHireImages(unitId, orderedIds);
    refreshPublic();
    return NextResponse.json({ ok: true, units });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not reorder hire photos.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Photo storage is not connected." }, { status: 503 });
  }

  let body: { id?: string };
  try {
    body = (await request.json()) as { id?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const id = String(body.id ?? "").trim();
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing hire photo." }, { status: 400 });
  }

  try {
    const units = await deleteHireImage(id);
    refreshPublic();
    return NextResponse.json({ ok: true, units });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not remove hire photo.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
