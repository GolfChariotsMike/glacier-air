import type { Metadata } from "next";
import Home from "../page";

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

export default Home;
