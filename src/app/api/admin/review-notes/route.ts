import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, sessionValid } from "@/lib/admin-auth";
import { supabaseConfigured } from "@/lib/supabase";
import {
  createReviewNote,
  isReviewNoteStatus,
  listReviewNotes,
  updateReviewNoteStatus,
} from "@/lib/review-notes";

async function requireAdmin() {
  const jar = await cookies();
  return sessionValid(jar.get(ADMIN_COOKIE)?.value);
}

function clip(value: string, max: number): string {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Notes storage is not connected." }, { status: 503 });
  }

  const statusParam = new URL(request.url).searchParams.get("status") ?? "";
  const status = statusParam && isReviewNoteStatus(statusParam) ? statusParam : undefined;

  try {
    const notes = await listReviewNotes(status);
    return NextResponse.json({ ok: true, notes });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not load notes.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Notes storage is not connected." }, { status: 503 });
  }

  let body: { page_path?: string; selector?: string | null; quote?: string; note?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const quote = clip(String(body.quote ?? ""), 500);
  const note = clip(String(body.note ?? ""), 2000);
  const pagePath = clip(String(body.page_path ?? "/"), 200) || "/";
  const selectorRaw = body.selector == null ? "" : clip(String(body.selector), 500);

  if (!quote) {
    return NextResponse.json({ ok: false, error: "Select some text first." }, { status: 400 });
  }
  if (!note) {
    return NextResponse.json({ ok: false, error: "Write a note before saving." }, { status: 400 });
  }

  try {
    const saved = await createReviewNote({
      page_path: pagePath,
      selector: selectorRaw || null,
      quote,
      note,
    });
    return NextResponse.json({ ok: true, note: saved });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save note.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Notes storage is not connected." }, { status: 503 });
  }

  let body: { id?: string; status?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const id = String(body.id ?? "").trim();
  const status = String(body.status ?? "");
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing note." }, { status: 400 });
  }
  if (!isReviewNoteStatus(status)) {
    return NextResponse.json({ ok: false, error: "Invalid status." }, { status: 400 });
  }

  try {
    const saved = await updateReviewNoteStatus(id, status);
    return NextResponse.json({ ok: true, note: saved });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not update note.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
