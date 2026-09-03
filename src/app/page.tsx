import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { readGallery } from "@/lib/blob-gallery";

export const revalidate = 30;

export default async function Home() {
  const gallery = await readGallery();
  return (
    <>
      <JsonLd />
      <Navbar />
      <Hero />
      <Services gallery={gallery} />
      <About gallery={gallery} />
      <Projects gallery={gallery} />
      <Clients />
      <Contact />
      <Footer />
    </>
  );
}
