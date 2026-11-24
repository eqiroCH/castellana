"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { media, type MediaSlug } from "@/content/media";
import type { GalleryLayout, GalleryPhoto } from "@/content/showroom";
import { cn } from "@/lib/cn";
import { ArrowRight, CloseIcon } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import { SpotlightGrid } from "@/components/motion/SpotlightGrid";

type GalleryProps = {
  photos: readonly GalleryPhoto[];
  /** Accessible name of the lightbox, e.g. «Showroom-Galerie». */
  label: string;
  /** Optional editorial cell after the photos (lg: 4 columns next to the `wide` tile). */
  children?: ReactNode;
};

/**
 * 12-column editorial grid (2 columns on small screens). Every tile stays below ~850 CSS px,
 * so the 1024 px originals are never upscaled on desktop.
 */
const layouts: Record<GalleryLayout, { className: string; sizes: string }> = {
  feature: {
    className: "col-span-2 aspect-[3/2] lg:col-span-7",
    sizes: "(min-width: 1376px) 750px, (min-width: 1024px) 56vw, 100vw",
  },
  side: {
    className: "aspect-[4/5] lg:col-span-5 lg:aspect-auto",
    sizes: "(min-width: 1376px) 530px, (min-width: 1024px) 40vw, 50vw",
  },
  portrait: {
    className: "aspect-[4/5] lg:col-span-4",
    sizes: "(min-width: 1376px) 420px, (min-width: 1024px) 32vw, 50vw",
  },
  wide: {
    className: "col-span-2 aspect-[3/2] lg:col-span-8 lg:aspect-[16/9]",
    sizes: "(min-width: 1376px) 850px, (min-width: 1024px) 64vw, 100vw",
  },
};

const largestSrc = (slug: MediaSlug) => `/images/opt/${slug}-${media[slug].widths.at(-1)}.webp`;
const altOf = (photo: GalleryPhoto) => photo.alt ?? media[photo.media].alt;
const pad = (n: number) => String(n).padStart(2, "0");

function ExpandIcon() {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.25} aria-hidden="true" focusable="false">
      <path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" strokeLinecap="square" />
    </svg>
  );
}

const navButton =
  "inline-flex size-12 items-center justify-center border border-paper/25 text-paper transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper";

/**
 * Photo grid with an accessible lightbox built on the native modal <dialog>:
 * focus stays inside, the page behind is inert, Esc closes, ← / → (and swipe) navigate,
 * focus returns to the tile of the last viewed photo. Without JS the tiles link to the image.
 * Tiles switch on like showroom lights; on desktop a flashlight follows the pointer.
 */
export function Gallery({ photos, label, children }: GalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const tileRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const touchX = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const count = photos.length;
  const current = photos[index];

  const step = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);
  const close = useCallback(() => dialogRef.current?.close(), []);

  const openAt = (i: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab/window) through to the image link.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const dialog = dialogRef.current;
    if (!dialog || typeof dialog.showModal !== "function") return;
    event.preventDefault();
    setIndex(i);
    setOpen(true);
    dialog.showModal();
    closeRef.current?.focus();
  };

  // Native close (Esc, close button, backdrop): sync state and return focus.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setOpen(false);
      tileRefs.current[indexRef.current]?.focus();
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  // Lock page scroll while the lightbox is open.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Tab") {
      // Keep focus cycling inside the lightbox instead of escaping to the browser UI.
      const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>("button:not([disabled])")];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  };

  return (
    <>
      <SpotlightGrid>
        <ul className="grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-12">
          {photos.map((photo, i) => {
            const layout = layouts[photo.layout];
            return (
              <li
                key={photo.media}
                style={{ "--i": i } as CSSProperties}
                className={cn("lights-tile group relative overflow-hidden bg-surface", layout.className)}
              >
                <a
                  ref={(el) => {
                    tileRefs.current[i] = el;
                  }}
                  href={largestSrc(photo.media)}
                  onClick={openAt(i)}
                  aria-haspopup="dialog"
                  data-cursor="Öffnen"
                  className="absolute inset-0 block focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-paper"
                >
                  <Photo
                    media={photo.media}
                    alt={altOf(photo)}
                    sizes={layout.sizes}
                    position={photo.position}
                    className="absolute inset-0 size-full object-cover brightness-[0.92] saturate-[0.85] transition-[transform,filter] duration-[1400ms] ease-out-quart group-hover:scale-[1.03] group-hover:brightness-100 group-hover:saturate-100"
                  />
                  <span className="sr-only"> – vergrössern</span>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 right-3 grid size-10 place-items-center bg-ink/70 text-paper opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:bottom-4 md:right-4"
                  >
                    <ExpandIcon />
                  </span>
                </a>
              </li>
            );
          })}
          {/* Above the flashlight overlay (z-1): editorial text is never dimmed. */}
          {children && <li className="relative z-[2] col-span-2 lg:col-span-4">{children}</li>}
        </ul>
      </SpotlightGrid>

      <dialog
        ref={dialogRef}
        aria-label={label}
        data-lenis-prevent=""
        onKeyDown={onKeyDown}
        className="m-0 h-dvh max-h-none w-full max-w-none border-0 bg-ink p-0 text-paper opacity-0 transition-[opacity,overlay,display] transition-discrete duration-300 ease-out-quart backdrop:bg-ink/60 open:opacity-100 starting:open:opacity-0"
      >
        <div className="relative flex h-full flex-col">
          <div className="flex h-header shrink-0 items-center justify-between px-gutter">
            <p aria-hidden="true" className="text-eyebrow font-semibold uppercase text-paper/70 tabular">
              {pad(index + 1)} / {pad(count)}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Galerie schliessen"
              className="-mr-2.5 inline-flex size-11 items-center justify-center text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
            >
              <CloseIcon className="size-6" />
            </button>
          </div>

          <figure
            className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 px-gutter pb-4 md:px-28"
            onClick={(event) => event.target === event.currentTarget && close()}
            onTouchStart={(event) => {
              touchX.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              const start = touchX.current;
              const end = event.changedTouches[0]?.clientX;
              touchX.current = null;
              if (start === null || end === undefined || Math.abs(end - start) < 50) return;
              step(end < start ? 1 : -1);
            }}
          >
            {open && current && (
              <Photo
                key={current.media}
                media={current.media}
                alt={altOf(current)}
                sizes="(min-width: 1100px) 1024px, 100vw"
                priority
                className="h-auto max-h-[calc(100dvh-15rem)] w-auto max-w-[min(100%,1024px)] object-contain md:max-h-[calc(100dvh-11rem)]"
              />
            )}
            <figcaption className="max-w-xl text-center text-sm text-paper/75">{current ? altOf(current) : null}</figcaption>
          </figure>

          <div className="flex shrink-0 items-center justify-center gap-3 pb-8 md:contents">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Vorheriges Bild"
              className={cn(navButton, "md:absolute md:left-gutter md:top-1/2 md:-translate-y-1/2")}
            >
              <ArrowRight className="size-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Nächstes Bild"
              className={cn(navButton, "md:absolute md:right-gutter md:top-1/2 md:-translate-y-1/2")}
            >
              <ArrowRight className="size-4" />
            </button>
          </div>

          <p className="sr-only" aria-live="polite">
            {open && current ? `Bild ${index + 1} von ${count}` : ""}
          </p>
        </div>
      </dialog>
    </>
  );
}
