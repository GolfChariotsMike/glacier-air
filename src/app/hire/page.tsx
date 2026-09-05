import type { Metadata } from "next";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import HireCatalogue from "@/components/HireCatalogue";
import { readHireUnits } from "@/lib/supabase-hire";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Equipment Hire | Glacier Air",
  description:
    "Hire air conditioning and chillers from Glacier Air across Perth and regional WA. Enquire for available units and project dates.",
  alternates: { canonical: "/hire" },
  openGraph: {
    title: "Equipment Hire | Glacier Air",
    description:
      "Hire air conditioning and chillers across Perth and regional WA — enquire for available units.",
    url: "https://glacierair.com.au/hire",
  },
};

export default async function HirePage() {
  const units = await readHireUnits();
  return (
    <>
      <SiteNavbar />
      <HireCatalogue units={units} />
      <Footer />
    </>
  );
}
