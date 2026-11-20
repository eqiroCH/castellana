import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static";

/** Web app manifest (→ /manifest.webmanifest). Icons are the files in src/app (`npm run icons`). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.claim,
    lang: "de-CH",
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#0B0B0D",
    theme_color: "#0B0B0D",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/favicon.ico", sizes: "48x48 32x32 16x16", type: "image/x-icon" },
    ],
  };
}
