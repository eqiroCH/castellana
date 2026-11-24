"use client";

import { usePathname } from "next/navigation";
import { ViewTransition, type ReactNode } from "react";

/**
 * Page transitions for client-side navigations (React <ViewTransition>, View Transitions API).
 *
 * Next.js navigations are React transitions; keying the boundary by pathname turns every
 * navigation into an exit (old page) + enter (new page) pair, animated by
 * `::view-transition-old(.page-exit)` / `::view-transition-new(.page-enter)` in globals.css —
 * the same keyframes `@view-transition { navigation: auto }` uses for full document loads.
 * Renders the <main> landmark itself so the boundary has exactly one DOM node to capture.
 * Browsers without the API (or with reduced motion) simply swap the page.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="page-enter" exit="page-exit" update="none" default="none">
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
    </ViewTransition>
  );
}
