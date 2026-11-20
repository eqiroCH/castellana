import type { MetadataRoute } from "next";
import { legalNavigation, navigation, site } from "@/content/site";

export const dynamic = "force-static";

/**
 * Last editorial change of the page content. Bump when texts change — not on every build,
 * so search engines get a meaningful <lastmod>. (The live stock on /fahrzeuge/ comes from the
 * AutoScout24 widget and is not part of the HTML.)
 */
const CONTENT_UPDATED = new Date("2026-11-20T00:00:00+01:00");

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", ...navigation.map((n) => n.href), ...legalNavigation.map((n) => n.href)];
  return pages.map((href) => ({
    url: new URL(href, site.url).toString(),
    lastModified: CONTENT_UPDATED,
    changeFrequency: href === "/" || href === "/fahrzeuge/" ? "daily" : "monthly",
    priority: href === "/" ? 1 : legalNavigation.some((l) => l.href === href) ? 0.2 : 0.7,
  }));
}
