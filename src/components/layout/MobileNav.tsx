"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { addressLine, formatSlots, navigation, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";

/** Stagger index for the line-by-line entrance (globals.css → .menu-rise / .menu-fade). */
const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Full-screen mobile menu (< 1280px) built on the native modal <dialog>:
 * focus is trapped and the page behind is inert, Esc closes, focus returns to the toggle.
 * Items rise line by line in big italic serif on ink with a faint red glow.
 */
export function MobileNav() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = useCallback(() => dialogRef.current?.close(), []);

  const openMenu = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    setOpen(true);
  };

  // Sync state when the dialog closes (Esc, link click, close button).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setOpen(false);
      toggleRef.current?.focus();
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  // Lock page scroll while open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Close when the route changes.
  useEffect(() => {
    close();
  }, [pathname, close]);

  const weekday = site.hours[0];
  const saturday = site.hours[1];

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={openMenu}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Menü öffnen"
        className="-mr-2.5 inline-flex size-11 items-center justify-center text-fg xl:hidden"
      >
        <MenuIcon className="size-6" />
      </button>

      <dialog ref={dialogRef} id="mobile-menu" aria-label="Menü" className="menu-dialog tone-dark xl:hidden" data-lenis-prevent="">
        <div className="flex min-h-full flex-col">
          <Container className="flex h-header shrink-0 items-center justify-between border-b border-line">
            <Link href="/" onClick={close} className="-m-2 inline-flex min-h-11 items-center p-2 text-fg" aria-label="Castellana Automobile AG – zur Startseite">
              <Logo className="h-[18px] w-auto sm:h-5" />
            </Link>
            <button
              type="button"
              onClick={close}
              aria-label="Menü schliessen"
              className="-mr-2.5 inline-flex size-11 items-center justify-center text-fg"
              autoFocus
            >
              <CloseIcon className="size-6" />
            </button>
          </Container>

          <Container className="flex flex-1 flex-col justify-between gap-12 py-8">
            <nav aria-label="Hauptnavigation mobil">
              <ul>
                {navigation.map((item, index) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <li key={item.href} className="border-b border-line" style={stagger(index)}>
                      <Link
                        href={item.href}
                        onClick={close}
                        aria-current={active ? "page" : undefined}
                        className="group flex min-h-14 items-baseline gap-5 py-2.5 sm:min-h-16 sm:py-3"
                      >
                        <span className="menu-fade w-6 text-[0.6875rem] font-medium text-subtle tabular">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="menu-line">
                          <span
                            className={cn(
                              "menu-rise inline-block font-display text-[2.375rem] italic leading-[1.05] tracking-tight transition-[color,translate] duration-500 ease-out-expo group-hover:translate-x-2 sm:text-6xl",
                              active ? "text-fg" : "text-fg/75 group-hover:text-fg",
                            )}
                          >
                            {item.label}
                            {active && <span aria-hidden="true" className="ml-3 inline-block size-2 -translate-y-1 bg-brand align-middle" />}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="menu-fade grid gap-8 text-sm sm:grid-cols-2" style={stagger(navigation.length)}>
              <div className="space-y-1.5">
                <a href={site.phone.href} className="block font-display text-3xl tracking-tight text-fg tabular">
                  {site.phone.display}
                </a>
                <a href={site.email.href} className="inline-block py-1 text-muted underline-offset-4 hover:text-fg hover:underline">
                  {site.email.display}
                </a>
                <p className="text-muted">{addressLine}</p>
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-muted tabular">
                <dt>{weekday.label}</dt>
                <dd className="text-fg">{formatSlots(weekday.slots)}</dd>
                <dt>{saturday.label}</dt>
                <dd className="text-fg">{formatSlots(saturday.slots)}</dd>
              </dl>
              <ButtonLink href="/fahrzeuge/" icon="arrow" className="sm:col-span-2" onClick={close}>
                Alle Fahrzeuge entdecken
              </ButtonLink>
            </div>
          </Container>
        </div>
      </dialog>
    </>
  );
}
