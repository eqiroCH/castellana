"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Cursor } from "./Cursor";
import { REDUCED_MOTION } from "./env";
import { getLenis, registerLenis, scrollToTarget } from "./scroll";

const isLocked = (el: HTMLElement) => {
  const overflow = getComputedStyle(el).overflowY;
  return overflow === "hidden" || overflow === "clip";
};

/**
 * Global motion layer, mounted once in the root layout:
 * - Lenis smooth scrolling (off for `prefers-reduced-motion` and touch-only devices), its rAF loop only runs while
 *   a scroll is in progress, and it pauses whenever <html>/<body> overflow is locked
 *   (mobile menu, lightbox, intro);
 * - same-page anchor links (#…) scroll smoothly with the header offset and move focus;
 * - the custom cursor + magnetic buttons (<Cursor>).
 * Page transitions live in <PageTransition> (wraps <main>).
 */
export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia(REDUCED_MOTION);
    let lenis: Lenis | null = null;
    let raf = 0;
    let running = false;
    let idleFrames = 0;
    let lockObserver: MutationObserver | null = null;

    const tick = (time: number) => {
      if (!lenis) return;
      lenis.raf(time);
      if (lenis.isScrolling) idleFrames = 0;
      else if (++idleFrames > 30) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!lenis || running) return;
      running = true;
      idleFrames = 0;
      lenis.time = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const syncLock = () => {
      if (!lenis) return;
      if (isLocked(document.documentElement) || isLocked(document.body)) lenis.stop();
      else lenis.start();
    };

    const start = () => {
      if (lenis) return;
      lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        stopInertiaOnNavigate: true,
        // Native scrolling inside dialogs (menu, lightbox) and anything opted out.
        prevent: (node) => node.nodeName === "DIALOG" || node.hasAttribute("data-native-scroll"),
      });
      lenis.on("virtual-scroll", wake);
      registerLenis(lenis, wake);
      lockObserver = new MutationObserver(syncLock);
      lockObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
      lockObserver.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] });
      syncLock();
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      running = false;
      lockObserver?.disconnect();
      lockObserver = null;
      lenis?.destroy();
      lenis = null;
      registerLenis(null);
    };

    // Touch-only devices keep native (momentum) scrolling: Lenis would add nothing there.
    const touchOnly = window.matchMedia("(hover: none) and (pointer: coarse)");
    const onMotionChange = () => (reduced.matches || touchOnly.matches ? stop() : start());
    onMotionChange();
    reduced.addEventListener("change", onMotionChange);
    touchOnly.addEventListener("change", onMotionChange);

    // Observers are registered from here on: CSS safety nets for un-hydrated pages switch off.
    document.documentElement.dataset.motion = "ready";

    // Same-page anchors: capture phase runs before next/link, which skips prevented events.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.hash.length < 2) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target || !getLenis()) return;
      event.preventDefault();
      scrollToTarget(target);
      if (window.location.hash !== url.hash) window.history.pushState(window.history.state, "", url.hash);
      if (!target.matches("a[href], button, input, select, textarea, [tabindex]")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    window.addEventListener("click", onClick, true);

    return () => {
      reduced.removeEventListener("change", onMotionChange);
      touchOnly.removeEventListener("change", onMotionChange);
      window.removeEventListener("click", onClick, true);
      stop();
    };
  }, []);

  // After a client-side navigation Next.js has already reset the scroll position:
  // drop any inertia that was still running and re-measure the new page.
  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;
    lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    lenis.resize();
  }, [pathname]);

  return <Cursor />;
}
