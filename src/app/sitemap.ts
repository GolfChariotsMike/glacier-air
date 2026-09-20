import type { MetadataRoute } from "next";
import { SITE_ORIGIN, absoluteUrl } from "@/lib/site";

const LAST_MOD = new Date("2026-09-20");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_ORIGIN, lastModified: LAST_MOD, changeFrequency: "monthly", priority: 1 },
    {
      url: absoluteUrl("/about-us"),
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/services"),
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/projects"),
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/hire"),
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
