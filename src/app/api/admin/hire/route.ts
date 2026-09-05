import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, sessionValid } from "@/lib/admin-auth";
import { supabaseConfigured } from "@/lib/supabase";
import {
  createHireUnit,
  deleteHireUnit,
  readHireUnits,
  reorderHireUnits,
  updateHireUnit,
} from "@/lib/supabase-hire";

async function requireAdmin() {
  const jar = await cookies();
  return sessionValid(jar.get(ADMIN_COOKIE)?.value);
}

function refreshPublic() {
  revalidatePath("/hire");
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  const units = await readHireUnits();
  return NextResponse.json({ ok: true, units, supabaseConfigured: supabaseConfigured() });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Photo storage is not connected." }, { status: 503 });
  }

  let body: { title?: string; description?: string };
  try {
    body = (await request.json()) as { title?: string; description?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  try {
    const units = await createHireUnit({
      title: String(body.title ?? ""),
      description: body.description != null ? String(body.description) : undefined,
    });
    refreshPublic();
    return NextResponse.json({ ok: true, units });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not add hire unit.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Photo storage is not connected." }, { status: 503 });
  }

  let body: {
    id?: string;
    title?: string;
    description?: string;
    orderedIds?: string[];
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  try {
    let units;
    if (Array.isArray(body.orderedIds)) {
      units = await reorderHireUnits(body.orderedIds.map((id) => String(id)));
    } else {
      const id = String(body.id ?? "").trim();
      if (!id) {
        return NextResponse.json({ ok: false, error: "Missing hire unit." }, { status: 400 });
      }
      units = await updateHireUnit(id, {
        title: body.title,
        description: body.description,
      });
    }
    refreshPublic();
    return NextResponse.json({ ok: true, units });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save hire unit.";
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
    return NextResponse.json({ ok: false, error: "Missing hire unit." }, { status: 400 });
  }

  try {
    const units = await deleteHireUnit(id);
    refreshPublic();
    return NextResponse.json({ ok: true, units });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not delete hire unit.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
