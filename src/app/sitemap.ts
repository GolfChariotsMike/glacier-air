import type { MetadataRoute } from "next";

const SITE = "https://glacierair.com.au";
const LAST_MOD = "2026-09-01";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, lastModified: LAST_MOD, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE}/about-us`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE}/services`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE}/projects`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
