import { createAnonClient, supabaseConfigured } from "@/lib/supabase";
import {
  fallbackProjects,
  isProjectId,
  slugifyProjectId,
  UNASSIGNED_ID,
  type CatalogueProject,
} from "@/lib/gallery";
import { type GalleryState } from "@/lib/gallery";
import { readGallery } from "@/lib/supabase-gallery";

export { supabaseConfigured };

const PROJECTS_TABLE = "glacier_air_projects";
const IMAGES_TABLE = "glacier_air_gallery_images";

type ProjectRow = {
  id: string;
  title: string;
  public_title: string;
  description: string | null;
  hero_rank: number | null;
  sort_order: number;
  show_in_nav: boolean;
};

function asHeroRank(value: number | null | undefined): 1 | 2 | null {
  return value === 1 || value === 2 ? value : null;
}

export function fromProjectRow(row: ProjectRow): CatalogueProject {
  return {
    id: row.id,
    title: row.title,
    publicTitle: row.public_title,
    description: typeof row.description === "string" ? row.description : "",
    heroRank: asHeroRank(row.hero_rank),
    sortOrder: Number.isFinite(row.sort_order) ? row.sort_order : 0,
    showInNav: Boolean(row.show_in_nav),
  };
}

function sortProjects(projects: CatalogueProject[]): CatalogueProject[] {
  return [...projects].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

async function fetchProjectRows(): Promise<ProjectRow[]> {
  const client = createAnonClient();
  const { data, error } = await client
    .from(PROJECTS_TABLE)
    .select("id, title, public_title, description, hero_rank, sort_order, show_in_nav")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message || "Could not load projects.");
  return (data ?? []).filter((row) => isProjectId(row.id));
}

export async function readProjects(): Promise<CatalogueProject[]> {
  if (!supabaseConfigured()) return fallbackProjects();
  try {
    const rows = await fetchProjectRows();
    if (!rows.length) return fallbackProjects();
    return sortProjects(rows.map(fromProjectRow));
  } catch {
    return fallbackProjects();
  }
}

export async function ensureProjectsSeeded(): Promise<CatalogueProject[]> {
  if (!supabaseConfigured()) return fallbackProjects();
  try {
    const rows = await fetchProjectRows();
    if (rows.length) return sortProjects(rows.map(fromProjectRow));

    const client = createAnonClient();
    const seed = fallbackProjects();
    const { error } = await client.from(PROJECTS_TABLE).upsert(
      seed.map((project) => ({
        id: project.id,
        title: project.title,
        public_title: project.publicTitle,
        description: project.description,
        hero_rank: project.heroRank,
        sort_order: project.sortOrder,
        show_in_nav: project.showInNav,
      }))
    );
    if (error) return seed;
    return seed;
  } catch {
    return fallbackProjects();
  }
}

async function requireRows(): Promise<ProjectRow[]> {
  if (!supabaseConfigured()) {
    throw new Error("Photo storage is not connected.");
  }
  return fetchProjectRows();
}

export async function createProject(input: {
  title: string;
  publicTitle?: string;
}): Promise<CatalogueProject[]> {
  const title = input.title.trim();
  if (!title) throw new Error("Enter a project name.");
  const publicTitle = (input.publicTitle ?? "").trim() || title;
  const rows = await requireRows();
  const taken = new Set(rows.map((row) => row.id));
  let id = slugifyProjectId(title);
  if (taken.has(id)) {
    let n = 2;
    while (taken.has(`${id}-${n}`)) n += 1;
    id = `${id}-${n}`;
  }
  if (!isProjectId(id)) throw new Error("Could not make a project id from that name.");

  const maxSort = rows
    .filter((row) => row.id !== UNASSIGNED_ID)
    .reduce((n, row) => Math.max(n, row.sort_order), 0);

  const client = createAnonClient();
  const { error } = await client.from(PROJECTS_TABLE).insert({
    id,
    title,
    public_title: publicTitle,
    description: "",
    hero_rank: null,
    sort_order: maxSort + 10,
    show_in_nav: false,
  });
  if (error) throw new Error(error.message || "Could not add project.");
  return readProjects();
}

export async function updateProject(
  id: string,
  patch: { title?: string; publicTitle?: string; description?: string; showInNav?: boolean }
): Promise<CatalogueProject[]> {
  if (!isProjectId(id)) throw new Error("Unknown project.");
  const rows = await requireRows();
  if (!rows.some((row) => row.id === id)) throw new Error("Project not found.");

  const next: {
    title?: string;
    public_title?: string;
    description?: string;
    show_in_nav?: boolean;
  } = {};
  if (typeof patch.title === "string") {
    const title = patch.title.trim();
    if (!title) throw new Error("Enter a project name.");
    next.title = title;
  }
  if (typeof patch.publicTitle === "string") {
    const publicTitle = patch.publicTitle.trim();
    if (!publicTitle) throw new Error("Enter a site heading.");
    next.public_title = publicTitle;
  }
  if (typeof patch.description === "string") {
    next.description = patch.description.trim();
  }
  if (typeof patch.showInNav === "boolean") {
    if (id === UNASSIGNED_ID && patch.showInNav) {
      throw new Error("Unassigned cannot appear in the menu.");
    }
    next.show_in_nav = patch.showInNav;
  }
  if (!Object.keys(next).length) return readProjects();

  const client = createAnonClient();
  const { error } = await client.from(PROJECTS_TABLE).update(next).eq("id", id);
  if (error) throw new Error(error.message || "Could not save project.");
  return readProjects();
}

export async function setProjectHeroRank(
  id: string,
  rank: 1 | 2 | null
): Promise<CatalogueProject[]> {
  if (!isProjectId(id)) throw new Error("Unknown project.");
  if (id === UNASSIGNED_ID && rank != null) {
    throw new Error("Unassigned cannot be a homepage project.");
  }
  const rows = await requireRows();
  const target = rows.find((row) => row.id === id);
  if (!target) throw new Error("Project not found.");
  if (asHeroRank(target.hero_rank) === rank) return sortProjects(rows.map(fromProjectRow));

  const client = createAnonClient();
  if (rank === 1 || rank === 2) {
    const holder = rows.find((row) => row.hero_rank === rank && row.id !== id);
    if (holder) {
      const { error } = await client.from(PROJECTS_TABLE).update({ hero_rank: null }).eq("id", holder.id);
      if (error) throw new Error(error.message || "Could not update featured projects.");
    }
  }

  const { error } = await client.from(PROJECTS_TABLE).update({ hero_rank: rank }).eq("id", id);
  if (error) throw new Error(error.message || "Could not update featured projects.");
  return readProjects();
}

export async function deleteProject(id: string): Promise<{
  projects: CatalogueProject[];
  gallery: GalleryState;
}> {
  if (!isProjectId(id)) throw new Error("Unknown project.");
  if (id === UNASSIGNED_ID) throw new Error("Unassigned cannot be deleted.");
  const rows = await requireRows();
  if (!rows.some((row) => row.id === id)) throw new Error("Project not found.");

  const client = createAnonClient();
  const { error: moveError } = await client
    .from(IMAGES_TABLE)
    .update({ project_id: UNASSIGNED_ID })
    .eq("project_id", id);
  if (moveError) throw new Error(moveError.message || "Could not move photos.");

  const { error } = await client.from(PROJECTS_TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message || "Could not delete project.");

  return { projects: await readProjects(), gallery: await readGallery() };
}
