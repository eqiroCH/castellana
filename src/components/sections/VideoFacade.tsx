"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type VideoFacadeProps = {
  /** YouTube video ID */
  id: string;
  /** Used for the play button label and the iframe title. */
  title: string;
  /** Extra zoom for posters with letterboxing baked in (e.g. 1.3). */
  posterScale?: number;
  className?: string;
};

/** YouTube serves a 120×90 grey placeholder when a thumbnail does not exist. */
const isPlaceholder = (img: HTMLImageElement) => img.naturalWidth > 0 && img.naturalWidth <= 120;

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true" focusable="false" className="translate-x-[1px]">
      <path d="M7 4.5v15l12.5-7.5L7 4.5Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Privacy-friendly YouTube embed: shows the poster and a play button; the iframe
 * (youtube-nocookie.com) is only created after a click. If the poster cannot be loaded,
 * a dark card with the title is shown instead.
 */
export function VideoFacade({ id, title, posterScale, className }: VideoFacadeProps) {
  const [active, setActive] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // The poster may have finished (or failed) before hydration — check once on mount.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && (img.naturalWidth === 0 || isPlaceholder(img))) setPosterFailed(true);
  }, []);

  // Keep keyboard focus on the player once it replaces the button.
  useEffect(() => {
    if (active) iframeRef.current?.focus();
  }, [active]);

  return (
    <div className={cn("relative aspect-video overflow-hidden bg-ink-800", className)}>
      {active ? (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Video abspielen: ${title}`}
          className="group/video absolute inset-0 block size-full cursor-pointer text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-paper"
        >
          {posterFailed ? (
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-ink-700 via-ink-800 to-ink">
              <span className="absolute left-5 top-5 size-[7px] bg-brand" />
              <span className="absolute inset-x-5 top-11 font-display text-[1.5rem] leading-tight text-paper/80">{title}</span>
            </span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- remote YouTube poster, size chosen via srcset
            <img
              ref={imgRef}
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              srcSet={`https://i.ytimg.com/vi/${id}/hqdefault.jpg 480w, https://i.ytimg.com/vi/${id}/sddefault.jpg 640w`}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
              alt=""
              width={480}
              height={360}
              loading="lazy"
              decoding="async"
              onError={() => setPosterFailed(true)}
              onLoad={(e) => isPlaceholder(e.currentTarget) && setPosterFailed(true)}
              style={posterScale ? { scale: String(posterScale) } : undefined}
              className="absolute inset-0 size-full object-cover brightness-[0.72] saturate-[0.75] transition-[filter] duration-700 ease-out-quart group-hover/video:brightness-90 group-hover/video:saturate-100"
            />
          )}
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/20" />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper/95 text-ink shadow-[0_8px_30px_rgb(0_0_0/0.35)] transition-[background-color,color,scale] duration-300 ease-out-quart group-hover/video:scale-105 group-hover/video:bg-brand group-hover/video:text-white"
          >
            <PlayIcon />
          </span>
        </button>
      )}
    </div>
  );
}
