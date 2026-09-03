import type { Metadata } from "next";
import Home from "../page";

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

export default Home;
