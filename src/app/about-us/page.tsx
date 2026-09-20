import type { Metadata } from "next";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import AboutPage from "@/components/AboutPage";
import { readGallery } from "@/lib/supabase-gallery";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "About Us | Glacier Air",
  description:
    "Meet Glacier Air — a WA-owned HVAC contractor delivering air conditioning, refrigeration, and mechanical services across Perth, the South West, and Great Southern.",
  alternates: { canonical: "/about-us" },
  openGraph: {
    title: "About Us | Glacier Air",
    description:
      "WA-owned air conditioning, refrigeration and mechanical services across Perth, the South West and Great Southern.",
    url: "https://glacierair.com.au/about-us",
  },
};

export default async function AboutUsRoute() {
  const gallery = await readGallery();

  return (
    <>
      <SiteNavbar />
      <AboutPage gallery={gallery} />
      <Contact />
      <Footer />
    </>
  );
}
