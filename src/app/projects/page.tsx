import type { Metadata } from "next";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import ProjectsPage from "@/components/ProjectsPage";
import { readGallery } from "@/lib/supabase-gallery";
import { readProjects } from "@/lib/supabase-projects";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Projects | Glacier Air",
  description:
    "Recent Glacier Air HVAC projects across Perth and regional WA — offices, food production, wineries, and commercial fitouts.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Glacier Air",
    description:
      "Recent air conditioning and refrigeration projects across Perth and regional WA.",
    url: "https://glacierair.com.au/projects",
  },
};

export default async function ProjectsRoute() {
  const [gallery, projects] = await Promise.all([readGallery(), readProjects()]);

  return (
    <>
      <SiteNavbar />
      <ProjectsPage gallery={gallery} projects={projects} />
      <Contact />
      <Footer />
    </>
  );
}
