import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, sessionValid } from "@/lib/admin-auth";
import { supabaseConfigured } from "@/lib/supabase";
import {
  createProject,
  deleteProject,
  ensureProjectsSeeded,
  setProjectHeroRank,
  updateProject,
} from "@/lib/supabase-projects";

async function requireAdmin() {
  const jar = await cookies();
  return sessionValid(jar.get(ADMIN_COOKIE)?.value);
}

function refreshPublic() {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/about-us");
  revalidatePath("/services");
  revalidatePath("/hire");
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  const projects = await ensureProjectsSeeded();
  return NextResponse.json({ ok: true, projects, supabaseConfigured: supabaseConfigured() });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Photo storage is not connected." }, { status: 503 });
  }

  let body: { title?: string; publicTitle?: string };
  try {
    body = (await request.json()) as { title?: string; publicTitle?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  try {
    const projects = await createProject({
      title: String(body.title ?? ""),
      publicTitle: body.publicTitle != null ? String(body.publicTitle) : undefined,
    });
    refreshPublic();
    return NextResponse.json({ ok: true, projects });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not add project.";
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
    publicTitle?: string;
    description?: string;
    heroRank?: 1 | 2 | null;
    showInNav?: boolean;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const id = String(body.id ?? "").trim();
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing project." }, { status: 400 });
  }

  try {
    let projects;
    if (body.heroRank !== undefined) {
      const rank = body.heroRank === 1 || body.heroRank === 2 ? body.heroRank : null;
      projects = await setProjectHeroRank(id, rank);
    }
    if (
      body.title !== undefined ||
      body.publicTitle !== undefined ||
      body.description !== undefined ||
      typeof body.showInNav === "boolean"
    ) {
      projects = await updateProject(id, {
        title: body.title,
        publicTitle: body.publicTitle,
        description: body.description,
        showInNav: typeof body.showInNav === "boolean" ? body.showInNav : undefined,
      });
    }
    if (!projects) {
      projects = await updateProject(id, {});
    }
    refreshPublic();
    return NextResponse.json({ ok: true, projects });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save project.";
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
    return NextResponse.json({ ok: false, error: "Missing project." }, { status: 400 });
  }

  try {
    const result = await deleteProject(id);
    refreshPublic();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not delete project.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
