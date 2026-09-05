import type { Metadata } from "next";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import HireCatalogue from "@/components/HireCatalogue";
import HireEnquiryForm from "@/components/HireEnquiryForm";
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

export default async function HirePage({
  searchParams,
}: {
  searchParams: Promise<{ unit?: string | string[] }>;
}) {
  const units = await readHireUnits();
  const params = await searchParams;
  const rawUnit = params.unit;
  const initialUnitId = Array.isArray(rawUnit) ? rawUnit[0] : rawUnit;

  return (
    <>
      <SiteNavbar />
      <HireCatalogue units={units} />
      <HireEnquiryForm
        key={initialUnitId ?? "not-sure"}
        units={units.map(({ id, title }) => ({ id, title }))}
        initialUnitId={initialUnitId}
      />
      <Footer />
    </>
  );
}
