import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import Home from "../page";

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
    url: absoluteUrl("/projects"),
  },
};

export default Home;
