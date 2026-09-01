import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/admin"] },
      { userAgent: "Googlebot", allow: "/", disallow: ["/admin", "/api/admin"] },
      { userAgent: "GPTBot", allow: "/", disallow: ["/admin", "/api/admin"] },
      { userAgent: "ChatGPT-User", allow: "/", disallow: ["/admin", "/api/admin"] },
      { userAgent: "ClaudeBot", allow: "/", disallow: ["/admin", "/api/admin"] },
      { userAgent: "Anthropic-AI", allow: "/", disallow: ["/admin", "/api/admin"] },
      { userAgent: "PerplexityBot", allow: "/", disallow: ["/admin", "/api/admin"] },
      { userAgent: "Google-Extended", allow: "/", disallow: ["/admin", "/api/admin"] },
      { userAgent: "Applebot-Extended", allow: "/", disallow: ["/admin", "/api/admin"] },
    ],
    sitemap: "https://glacierair.com.au/sitemap.xml",
    host: "https://glacierair.com.au",
  };
}
