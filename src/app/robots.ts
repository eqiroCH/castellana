import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // /__forms.html only registers the Netlify form at deploy time.
    rules: { userAgent: "*", allow: "/", disallow: ["/__forms.html"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
