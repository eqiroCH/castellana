"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FINE_POINTER, REDUCED_MOTION, damp } from "./env";

type TiltProps = {
  children: ReactNode;
  /** Maximum rotation in degrees. */
  max?: number;
  className?: string;
};

/**
 * Pointer-following 3D tilt (perspective 1200 px) for cards. Sets `--mx`/`--my` (pointer
 * position in px from the card's top-left) for a specular sheen (`.tilt-sheen`, placed in a
 * box that starts at the card's top-left) and `data-tilt="on"` while hovered.
 * The outer box never transforms, so measurements stay stable. Mouse/trackpad only;
 * nothing happens on touch or with reduced motion.
 */
export function Tilt({ children, max = 6, className }: TiltProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    if (!window.matchMedia(FINE_POINTER).matches || window.matchMedia(REDUCED_MOTION).matches) return;

    let raf = 0;
    let last = 0;
    let hovering = false;
    let px = 0.5;
    let py = 0.5;
    let lx = 0;
    let ly = 0;
    let rx = 0;
    let ry = 0;
    let clientX = 0;
    let clientY = 0;

    const frame = (time: number) => {
      const dt = Math.min(64, last ? time - last : 16.667);
      last = time;
      if (hovering) {
        const r = outer.getBoundingClientRect();
        lx = clientX - r.left;
        ly = clientY - r.top;
        px = lx / r.width;
        py = ly / r.height;
      }
      const tx = hovering ? (0.5 - py) * 2 * max : 0;
      const ty = hovering ? (px - 0.5) * 2 * max : 0;
      const k = damp(0.12, dt);
      rx += (tx - rx) * k;
      ry += (ty - ry) * k;

      const settled = !hovering && Math.abs(rx) < 0.01 && Math.abs(ry) < 0.01;
      if (settled) {
        inner.style.transform = "";
        raf = 0;
        last = 0;
        return;
      }
      inner.style.transform = `perspective(1200px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`;
      inner.style.setProperty("--mx", `${lx.toFixed(1)}px`);
      inner.style.setProperty("--my", `${ly.toFixed(1)}px`);
      raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      hovering = true;
      clientX = event.clientX;
      clientY = event.clientY;
      inner.dataset.tilt = "on";
      kick();
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      clientX = event.clientX;
      clientY = event.clientY;
      kick();
    };
    const onLeave = () => {
      hovering = false;
      delete inner.dataset.tilt;
      kick();
    };

    outer.addEventListener("pointerenter", onEnter, { passive: true });
    outer.addEventListener("pointermove", onMove, { passive: true });
    outer.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      outer.removeEventListener("pointerenter", onEnter);
      outer.removeEventListener("pointermove", onMove);
      outer.removeEventListener("pointerleave", onLeave);
      inner.style.transform = "";
    };
  }, [max]);

  return (
    <div ref={outerRef} className={cn("tilt", className)}>
      <div ref={innerRef} className="tilt-inner h-full">
        {children}
      </div>
    </div>
  );
}
