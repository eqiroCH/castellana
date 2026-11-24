"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { IntroHandle } from "./controller";
import "./intro.css";

type IntroWindow = Window & { __castellanaIntro?: IntroHandle };

/**
 * Living hero shell (client): pointer parallax, scroll cue state and the scroll-progress fallback
 * for browsers without scroll-driven animations. The intro itself runs from <IntroScript />.
 *
 * Parallax layers are marked with `data-depth` (x amplitude in % of the viewport, sign = direction)
 * and optional `data-depth-y`.
 */
export function HeroScene({ children, labelledBy }: { children: ReactNode; labelledBy: string }) {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // React dev may reset <html> attributes on the Strict Mode remount — re-apply the intro state.
  useLayoutEffect(() => {
    (window as IntroWindow).__castellanaIntro?.sync();
  }, []);

  // Scroll: hide the cue after the first scroll; drive --hx-p where animation-timeline is missing.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timeline = typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()");
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (y > 8) setScrolled(true);
      if (!timeline) el.style.setProperty("--hx-p", Math.min(1, Math.max(0, y / el.offsetHeight)).toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Pointer parallax (mouse only, not while the intro runs, paused when the hero is off-screen).
  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]")).map((node) => {
      const x = Number(node.dataset.depth);
      return { node, x, y: Number(node.dataset.depthY ?? x) };
    });
    const html = document.documentElement;
    let w = window.innerWidth;
    let h = window.innerHeight;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let visible = true;

    const tick = () => {
      raf = 0;
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      for (const l of layers) {
        l.node.style.translate = `${((cx * l.x * w) / 100).toFixed(2)}px ${((cy * l.y * h) / 100).toFixed(2)}px`;
      }
      if (Math.abs(tx - cx) > 0.0004 || Math.abs(ty - cy) > 0.0004) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (!visible || e.pointerType !== "mouse" || html.dataset.intro === "running") return;
      tx = (e.clientX / w) * 2 - 1;
      ty = (e.clientY / h) * 2 - 1;
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };
    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    html.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      html.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      for (const l of layers) l.node.style.removeProperty("translate");
    };
  }, []);

  // After a real unmount (client navigation away), drop the finished-intro marker so the next
  // mount of the hero uses the quick fades. Deferred + DOM check: Strict Mode's simulated unmount
  // keeps the DOM, so it is ignored.
  useEffect(() => {
    return () => {
      window.setTimeout(() => {
        const ds = document.documentElement.dataset;
        if (ds.introSeq === "end" && !document.querySelector("[data-hero]")) delete ds.introSeq;
      }, 0);
    };
  }, []);

  return (
    <section
      ref={ref}
      data-hero=""
      data-scrolled={scrolled ? "" : undefined}
      aria-labelledby={labelledBy}
      className="hx-hero tone-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {children}
    </section>
  );
}
