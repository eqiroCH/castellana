"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** Global installed by hci.current.js — `run()` re-scans the page for `.hci-container`. */
declare global {
  interface Window {
    hci?: { run: () => void };
  }
}

type Status = "loading" | "ready" | "fallback";

/** Show the fallback if the widget has not reported any content after this time. */
const TIMEOUT_MS = 8000;
/** Fixed header height + breathing room; the widget scrolls to its top minus this offset. */
const HEADER_OFFSET = 96;
const FRAME_TITLE = "Fahrzeugbestand der Castellana Automobile AG (AutoScout24)";

let scriptPromise: Promise<void> | null = null;

/** Inserts the HCI script once per page life — safe across client-side navigations. */
function loadHciScript(src: string): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => {
        script.remove();
        scriptPromise = null; // allow a retry on the next visit
        reject(new Error("AutoScout24 script blocked or unreachable"));
      },
      { once: true },
    );
    document.body.appendChild(script);
  });
  return scriptPromise;
}

/**
 * AutoScout24 host integration (HCI v2). The vendor script *replaces* `.hci-container`
 * with an auto-resizing iframe, so the container is created imperatively inside a host
 * element React never renders children into. Readiness is detected via the iframe's
 * `getScrollHeight` postMessage; without it after 8 s (blocked, offline, bot check) a
 * fallback card links to the dealer page. Without JavaScript the <noscript> card shows.
 */
export function AutoScoutWidget({ className }: { className?: string }) {
  const { configId, language, entryPoint, script } = site.autoscoutWidget;
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let active = true;
    const widgetOrigin = new URL(script).origin;

    const container = document.createElement("div");
    container.className = "hci-container";
    container.dataset.configId = configId;
    container.dataset.language = language;
    container.dataset.entryPoint = entryPoint;
    container.dataset.headerOffset = String(HEADER_OFFSET);
    host.replaceChildren(container);

    // The generated iframe has no accessible name — add one as soon as it appears.
    const observer = new MutationObserver(() => {
      const frame = host.querySelector("iframe");
      if (frame && !frame.title) frame.title = FRAME_TITLE;
    });
    observer.observe(host, { childList: true });

    const timer = window.setTimeout(() => {
      if (active) setStatus((s) => (s === "loading" ? "fallback" : s));
    }, TIMEOUT_MS);

    // The widget reports its content height once it has rendered — our «ready» signal.
    // A late report still switches from fallback to the widget.
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== widgetOrigin) return;
      const frame = host.querySelector("iframe");
      if (!frame || event.source !== frame.contentWindow) return;
      const data: unknown = event.data;
      if (
        typeof data === "object" &&
        data !== null &&
        "action" in data &&
        data.action === "getScrollHeight" &&
        "scrollHeight" in data &&
        Number(data.scrollHeight) > 0
      ) {
        window.clearTimeout(timer);
        setStatus("ready");
      }
    };
    window.addEventListener("message", onMessage);

    if (window.hci) {
      window.hci.run(); // script already loaded on an earlier visit
    } else {
      loadHciScript(script).catch(() => {
        window.clearTimeout(timer);
        if (active) setStatus("fallback");
      });
    }

    return () => {
      active = false;
      window.clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("message", onMessage);
      // Leaving while the widget is in its full-screen mode would keep the page locked.
      if (host.querySelector<HTMLIFrameElement>("iframe")?.style.position === "fixed") {
        document.body.style.removeProperty("overflow");
      }
      host.replaceChildren();
    };
  }, [configId, language, entryPoint, script]);

  return (
    <div
      className={cn(
        "relative",
        // White panel = the widget's own page colour, framed by a hairline (only when JS runs).
        status !== "fallback" && "in-[.js]:border in-[.js]:border-line in-[.js]:bg-white",
        status === "loading" && "in-[.js]:min-h-[52rem] md:in-[.js]:min-h-[60rem]",
        className,
      )}
    >
      <div
        ref={hostRef}
        aria-busy={status === "loading"}
        // Invisible until it reports content: keep it out of the tab order and the a11y tree.
        inert={status !== "ready"}
        className={cn(
          "transition-opacity duration-700 ease-out-quart [&>iframe]:block",
          status === "ready" ? "opacity-100" : "opacity-0",
          status === "fallback" && "pointer-events-none absolute inset-x-0 top-0 h-0 overflow-hidden",
        )}
      />
      {status === "loading" && <WidgetSkeleton />}
      {status === "fallback" && <WidgetFallback reason="blocked" />}
      <noscript>
        <WidgetFallback reason="noscript" />
      </noscript>
    </div>
  );
}

/** Calm placeholder in the shape of the AutoScout24 search (filters + result rows). */
function WidgetSkeleton() {
  const block = "bg-ink/[0.07] motion-safe:animate-pulse";
  return (
    <div className="absolute inset-x-0 top-0 hidden px-5 pt-8 sm:px-8 md:pt-11 in-[.js]:block">
      <p role="status" className="sr-only">
        Fahrzeugbestand wird geladen …
      </p>
      <div aria-hidden="true" className="mx-auto max-w-[64rem]">
        <div className="flex items-center justify-between gap-6">
          <div className={cn(block, "h-9 w-48 md:w-56")} />
          <div className="hidden gap-4 md:flex">
            <div className={cn(block, "h-5 w-32")} />
            <div className={cn(block, "h-5 w-32")} />
            <div className={cn(block, "h-5 w-40")} />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-2 gap-y-5 md:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className={cn(i > 3 && "max-md:hidden")}>
              <div className={cn(block, "h-3.5 w-20")} />
              <div className="mt-2 h-12 border border-ink/10 bg-white/50" />
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-ink/10">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex flex-col gap-5 border-b border-ink/10 py-8 sm:flex-row">
              <div className={cn(block, "aspect-[4/3] w-full sm:w-60 sm:shrink-0")} />
              <div className="flex-1 space-y-3">
                <div className={cn(block, "h-5 w-3/4")} />
                <div className={cn(block, "h-3.5 w-full")} />
                <div className={cn(block, "mt-5 h-7 w-36")} />
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className={cn(block, "h-3.5 w-24")} />
                  <div className={cn(block, "h-3.5 w-32")} />
                  <div className={cn(block, "h-3.5 w-20")} />
                  <div className={cn(block, "h-3.5 w-28")} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Shown when the widget cannot load (blocked/slow/offline) or JavaScript is disabled. */
function WidgetFallback({ reason }: { reason: "blocked" | "noscript" }) {
  return (
    <div className="grid gap-12 border border-line-strong bg-white/70 px-6 py-12 sm:px-10 md:px-16 md:py-20 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-7">
        <Eyebrow as="div">AutoScout24</Eyebrow>
        <h3 className="mt-5 font-display text-display-md text-fg">
          Alle {site.stock.cars} Fahrzeuge – <em className="italic text-fg/70">direkt auf AutoScout24.</em>
        </h3>
        <p className="mt-5 text-lead text-muted">
          {reason === "noscript"
            ? "Für die Live-Suche wird JavaScript benötigt."
            : "Die Live-Suche konnte hier gerade nicht geladen werden – etwa wegen eines Content-Blockers oder einer langsamen Verbindung."}{" "}
          Unseren kompletten Bestand mit Fotos, Preisen und Ausstattung finden Sie jederzeit auf unserer Händlerseite.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink href={site.links.autoscout}>Bestand auf AutoScout24</ButtonLink>
          <ButtonLink href={site.phone.href} variant="outline" icon="none">
            {site.phone.display}
          </ButtonLink>
        </div>
      </div>
      <div className="border-t border-line-strong pt-8 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
        <p className="text-eyebrow font-semibold uppercase text-muted">Typisch in unserem Bestand</p>
        <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-1 font-display text-[1.375rem] leading-snug text-fg">
          {site.stock.brands.map((brand, i) => (
            <li key={brand}>
              {brand}
              {i < site.stock.brands.length - 1 && (
                <span aria-hidden="true" className="ml-2 text-subtle">
                  ·
                </span>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">Preise von rund {site.stock.priceRange}</p>
      </div>
    </div>
  );
}
