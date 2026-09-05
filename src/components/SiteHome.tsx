import SiteNavbar from "@/components/SiteNavbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { firstAlt, firstUrl, HERO_FALLBACK, namedProjects } from "@/lib/gallery";
import { readGallery } from "@/lib/supabase-gallery";
import { readProjects } from "@/lib/supabase-projects";

export default async function SiteHome() {
  const [gallery, projects] = await Promise.all([readGallery(), readProjects()]);
  const navProjects = namedProjects(projects).map(({ id, publicTitle }) => ({
    id,
    publicTitle,
  }));
  return (
    <>
      <JsonLd />
      <SiteNavbar projects={navProjects} />
      <Hero
        imageSrc={firstUrl(gallery, "hero", HERO_FALLBACK)}
        imageAlt={firstAlt(gallery, "hero", "Rooftop air conditioning")}
      />
      <Services gallery={gallery} />
      <About gallery={gallery} />
      <Projects gallery={gallery} projects={projects} />
      <Clients gallery={gallery} />
      <Contact />
      <Footer />
    </>
  );
}
