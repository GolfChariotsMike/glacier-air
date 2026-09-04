import type { MetadataRoute } from "next";

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
    sitemap: "https://glacierair.com.au/sitemap.xml",
    host: "https://glacierair.com.au",
  };
}
