import Navbar, { type NavbarProject } from "@/components/Navbar";
import { namedProjects } from "@/lib/gallery";
import { readProjects } from "@/lib/supabase-projects";

export async function loadNavProjects(): Promise<NavbarProject[]> {
  const projects = await readProjects();
  return namedProjects(projects).map(({ id, publicTitle }) => ({ id, publicTitle }));
}

/** Shared server wrapper so every public page gets the named project catalogue. */
export default async function SiteNavbar({
  projects,
}: {
  projects?: NavbarProject[];
} = {}) {
  const navProjects = projects ?? (await loadNavProjects());
  return <Navbar projects={navProjects} />;
}
