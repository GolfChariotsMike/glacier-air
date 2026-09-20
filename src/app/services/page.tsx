import type { Metadata } from "next";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import ServicesPage from "@/components/ServicesPage";
import { readGallery } from "@/lib/supabase-gallery";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Services | Glacier Air",
  description:
    "Air conditioning, refrigeration, and mechanical services from Glacier Air — design, install, and maintenance for residential, commercial, and industrial sites across WA.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Glacier Air",
    description:
      "Air conditioning, refrigeration and mechanical services across Perth and regional WA.",
    url: "https://glacierair.com.au/services",
  },
};

export default async function ServicesRoute() {
  const gallery = await readGallery();

  return (
    <>
      <SiteNavbar />
      <ServicesPage gallery={gallery} />
      <Contact />
      <Footer />
    </>
  );
}
