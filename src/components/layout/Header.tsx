"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { PhoneIcon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { MobileNav } from "./MobileNav";
import { PromoBar } from "./PromoBar";

/** Items shown inline on desktop — «Fahrzeuge» is the primary button instead. */
const desktopItems = navigation.filter((item) => item.href !== "/fahrzeuge/");

function isActive(pathname: string, href: string) {
  return pathname === href.replace(/\/$/, "") || pathname.startsWith(href);
}

/**
 * Fixed header. Transparent over the dark hero, solid + blurred once the page scrolls.
 * Every page starts with a dark hero (PageHero / Hero), so light text is always legible.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <PromoBar />
      <div
        className={cn(
          "border-b transition-[background-color,border-color,backdrop-filter] duration-500 ease-out-quart",
          scrolled
            ? "border-line bg-ink/80 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-gradient-to-b from-ink/70 to-transparent",
        )}
      >
        <Container className="flex h-header items-center justify-between gap-6">
          <Link
            href="/"
            className="-m-2 inline-flex min-h-11 items-center p-2 text-fg"
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
                        "group relative inline-flex min-h-11 items-center px-3.5 text-[0.8125rem] font-medium tracking-[0.02em] transition-colors duration-300",
                        active ? "text-fg" : "text-muted hover:text-fg",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-3.5 bottom-2 h-px origin-left bg-current transition-transform duration-500 ease-out-quart",
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
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
              className="hidden min-h-11 items-center gap-2.5 text-[0.8125rem] font-medium text-muted transition-colors hover:text-fg lg:inline-flex tabular"
            >
              <PhoneIcon className="size-4" />
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
