import type { MetadataRoute } from "next";
import { legalNavigation, navigation, site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", ...navigation.map((n) => n.href), ...legalNavigation.map((n) => n.href)];
  return pages.map((href) => ({
    url: new URL(href, site.url).toString(),
    changeFrequency: href === "/" || href === "/fahrzeuge/" ? "daily" : "monthly",
    priority: href === "/" ? 1 : legalNavigation.some((l) => l.href === href) ? 0.2 : 0.7,
  }));
}
