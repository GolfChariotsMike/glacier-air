import type { MetadataRoute } from "next";
import { SITE_ORIGIN, absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/review", "/api/admin"] },
      { userAgent: "Googlebot", allow: "/", disallow: ["/admin", "/review", "/api/admin"] },
      { userAgent: "GPTBot", allow: "/", disallow: ["/admin", "/review", "/api/admin"] },
      { userAgent: "ChatGPT-User", allow: "/", disallow: ["/admin", "/review", "/api/admin"] },
      { userAgent: "ClaudeBot", allow: "/", disallow: ["/admin", "/review", "/api/admin"] },
      { userAgent: "Anthropic-AI", allow: "/", disallow: ["/admin", "/review", "/api/admin"] },
      { userAgent: "PerplexityBot", allow: "/", disallow: ["/admin", "/review", "/api/admin"] },
      { userAgent: "Google-Extended", allow: "/", disallow: ["/admin", "/review", "/api/admin"] },
      { userAgent: "Applebot-Extended", allow: "/", disallow: ["/admin", "/review", "/api/admin"] },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_ORIGIN,
  };
}
