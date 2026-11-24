"use client";

import { introController } from "./controller";
import { introConfig } from "./timeline";

const html = `(${introController.toString()})(${JSON.stringify(introConfig)})`;

/**
 * Inline script that decides and drives the home intro while the HTML is parsed — before first
 * paint, before hydration. On client-side navigations it renders as an inert `text/plain` block
 * (React never executes scripts it creates), so the intro only ever plays on a real page load.
 * Pattern: node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
 */
export function IntroScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
