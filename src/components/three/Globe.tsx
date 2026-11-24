"use client";

import { useEffect, useRef, useState } from "react";
import { importDestination, importGlobeLabel, importRoutes, type GeoPlace } from "@/content/import";
import { cn } from "@/lib/cn";
import type { GlobeEngine } from "./globe-engine";
import "./globe.css";

const focusPlaces = { thalwil: importDestination } satisfies Record<string, GeoPlace>;

type GlobeProps = {
  className?: string;
  /** Where the globe eases to (from the USA) when it scrolls into view. */
  focus?: keyof typeof focusPlaces;
  /** Route arcs USA → Thalwil and Germany → Thalwil, with their origin markers. */
  showRoutes?: boolean;
  /** HTML legend with both routes and delivery times (bottom left). */
  legend?: boolean;
};

type Status = "loading" | "ready" | "fallback";

/**
 * Dark WebGL globe (cobe, ~5 KB) with animated import routes to Thalwil.
 *
 * - Square and fluid: size it with the parent / `className` (e.g. `max-w-[40rem]`).
 * - cobe + the engine load only when the globe is within 400 px of the viewport; rendering
 *   pauses off screen and everything is disposed on unmount.
 * - Until WebGL is ready (or when it is unavailable) a CSS sphere is shown in its place.
 * - Drag to rotate (inertia); `prefers-reduced-motion`: static framing on Thalwil, drag only.
 */
export function Globe({ className, focus = "thalwil", showRoutes = true, legend = true }: GlobeProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const surface = surfaceRef.current;
    const host = hostRef.current;
    const overlay = overlayRef.current;
    if (!surface || !host || !overlay) return;

    let engine: GlobeEngine | null = null;
    let disposed = false;
    let seen = { inView: false, ratio: 0 };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const init = async () => {
      try {
        const [{ default: createGlobe }, { startGlobeEngine }] = await Promise.all([
          import("cobe"),
          import("./globe-engine"),
        ]);
        if (disposed) return;
        engine = startGlobeEngine({
          createGlobe,
          surface,
          host,
          overlay,
          label: labelRef.current,
          destination: focusPlaces[focus],
          routes: showRoutes ? importRoutes : [],
          reducedMotion,
          onReady: () => {
            if (!disposed) setStatus("ready");
          },
        });
        if (!engine) {
          setStatus("fallback");
          return;
        }
        engine.setVisibility(seen.inView, seen.ratio);
      } catch {
        if (!disposed) setStatus("fallback");
      }
    };

    const near = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          near.disconnect();
          void init();
        }
      },
      { rootMargin: "400px 0px" },
    );
    const view = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1];
        seen = { inView: e.isIntersecting, ratio: e.intersectionRatio };
        engine?.setVisibility(seen.inView, seen.ratio);
      },
      { threshold: [0, 0.3, 0.6] },
    );
    near.observe(surface);
    view.observe(surface);

    return () => {
      disposed = true;
      near.disconnect();
      view.disconnect();
      engine?.destroy();
      engine = null;
    };
  }, [focus, showRoutes]);

  return (
    <div
      ref={surfaceRef}
      role="img"
      aria-label={importGlobeLabel}
      data-state={status}
      // native grab/grabbing cursor while dragging (honoured by the site's custom cursor)
      data-native-cursor=""
      className={cn(
        "relative aspect-square w-full select-none touch-pan-y",
        status === "ready" && "cursor-grab data-dragging:cursor-grabbing",
        className,
      )}
    >
      <div aria-hidden="true" className="globe-placeholder" />
      <div ref={hostRef} aria-hidden="true" className="globe-host" />
      <canvas ref={overlayRef} aria-hidden="true" className="globe-overlay" />
      <div ref={labelRef} aria-hidden="true" className="globe-tag">
        <span>{focusPlaces[focus].name}</span>
      </div>

      {legend && showRoutes && (
        <ul
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 space-y-2.5 text-[0.625rem] font-semibold uppercase leading-none tracking-[0.2em] text-muted"
        >
          {importRoutes.map((route) => (
            <li key={route.region} className="flex items-center gap-3">
              <span className={cn("globe-swatch", route.region === "usa" && "globe-swatch--dashed")} />
              <span>
                {route.label} → {focusPlaces[focus].name}
                <span className="px-2 text-subtle">·</span>
                <span className="text-fg">{route.duration}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
