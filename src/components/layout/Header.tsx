"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { subscribeScroll } from "@/components/motion/scroll";
import { ButtonLink } from "@/components/ui/Button";
import { PhoneIcon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { MobileNav } from "./MobileNav";
import { PromoBar } from "./PromoBar";

/** Items shown inline on desktop — «Fahrzeuge» is the primary button instead. */
const desktopItems = navigation.filter((item) => item.href !== "/fahrzeuge/");

/** Below this scroll position the header is always shown. */
const REVEAL_ZONE = 120;
/** Scroll distance in one direction before the header hides / reappears. */
const HYSTERESIS = 10;
/** How long the home page waits for an intro to announce itself via html[data-intro]. */
const INTRO_GRACE = 300;
const INTRO_MAX = 9000;

function isActive(pathname: string, href: string) {
  return pathname === href.replace(/\/$/, "") || pathname.startsWith(href);
}

/**
 * Wait for the home intro before showing the header (initial load of «/» only):
 * - html[data-intro="running"] → wait for "done" (CSS also hides the header meanwhile);
 * - no attribute after 300 ms → there is no intro, show it;
 * - safety net after 9 s.
 */
function useIntroGate(initiallyReady: boolean) {
  const [ready, setReady] = useState(initiallyReady);

  useEffect(() => {
    if (ready) return;
    const html = document.documentElement;
    const open = () => setReady(true);
    const observer = new MutationObserver(() => {
      if (html.dataset.intro === "done") open();
    });
    observer.observe(html, { attributes: true, attributeFilter: ["data-intro"] });
    const grace = window.setTimeout(() => {
      if (!html.dataset.intro || html.dataset.intro === "done") open();
    }, INTRO_GRACE);
    const safety = window.setTimeout(open, INTRO_MAX);
    if (html.dataset.intro === "done") open();
    return () => {
      observer.disconnect();
      window.clearTimeout(grace);
      window.clearTimeout(safety);
    };
  }, [ready]);

  return ready;
}

/**
 * Fixed header. Transparent over the dark hero; once scrolled it turns into solid blurred
 * ink, hides while scrolling down (after 120 px) and comes back on the slightest scroll up.
 * Scroll state is written straight to data attributes — no React re-render per frame.
 * On the home page it fades in only after the intro (see useIntroGate).
 */
export function Header() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const ready = useIntroGate(pathname !== "/");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let scrolled: boolean | null = null;
    let hidden = false;
    let anchorY = 0;
    let lastDirection = 0;

    return subscribeScroll(({ y, direction }) => {
      const nextScrolled = y > 24;
      if (nextScrolled !== scrolled) {
        scrolled = nextScrolled;
        el.dataset.scrolled = String(scrolled);
      }
      if (direction !== lastDirection) {
        lastDirection = direction;
        anchorY = y;
      }
      let nextHidden = hidden;
      if (y < REVEAL_ZONE) nextHidden = false;
      else if (direction === 1 && y - anchorY > HYSTERESIS) nextHidden = true;
      else if (direction === -1 && anchorY - y > HYSTERESIS) nextHidden = false;
      if (nextHidden !== hidden) {
        hidden = nextHidden;
        el.dataset.hidden = String(hidden);
      }
    });
  }, []);

  return (
    <header ref={ref} data-ready={String(ready)} className="site-header fixed inset-x-0 top-0 z-50">
      <PromoBar />
      <div className="relative">
        <div aria-hidden="true" className="site-header-shade" />
        <div aria-hidden="true" className="site-header-solid" />
        <Container className="relative flex h-header items-center justify-between gap-6">
          <Link
            href="/"
            className="group/logo -m-2 inline-flex min-h-11 items-center p-2 text-fg"
            aria-label="Castellana Automobile AG – zur Startseite"
          >
            <Logo className="h-[18px] w-auto sm:h-5" />
          </Link>

          <nav aria-label="Hauptnavigation" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {desktopItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative inline-flex min-h-11 items-center gap-2 px-3.5 text-[0.8125rem] font-medium tracking-[0.02em] transition-colors duration-300",
                        active ? "text-fg" : "text-muted hover:text-fg",
                      )}
                    >
                      {active && <span aria-hidden="true" className="size-[5px] shrink-0 bg-brand" />}
                      {item.label}
                      {/* Draws in from the left, leaves to the right. */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-3.5 bottom-2 h-px bg-current transition-transform duration-500 ease-out-expo",
                          active ? "origin-left scale-x-0" : "origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={site.phone.href}
              className="group hidden min-h-11 items-center gap-2.5 text-[0.8125rem] font-medium text-muted transition-colors hover:text-fg lg:inline-flex tabular"
            >
              <PhoneIcon className="size-4 transition-transform duration-500 ease-out-expo group-hover:-rotate-12" />
              <span>{site.phone.display}</span>
            </a>
            <ButtonLink href="/fahrzeuge/" size="sm" className="hidden sm:inline-flex">
              Fahrzeuge
            </ButtonLink>
            <MobileNav />
          </div>
        </Container>
      </div>
    </header>
  );
}
