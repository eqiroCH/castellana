import Link from "next/link";
import type { ReactNode } from "react";
import { addressLine, formatSlots, legalNavigation, navigation, site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { ArrowUpRight } from "@/components/ui/Icons";
import { FooterWordmark } from "@/components/motion/FooterWordmark";
import { NewsletterForm } from "./NewsletterForm";

const linkClass = "inline-flex min-h-9 items-center text-muted transition-colors hover:text-fg";

function ColumnTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-5 text-eyebrow font-semibold uppercase text-subtle">{children}</h2>;
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="tone-dark border-t border-line bg-ink-900" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Fusszeile
      </h2>
      <Container className="grid gap-14 py-20 md:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:py-24">
        {/* Brand */}
        <div className="lg:col-span-4">
          <Link href="/" className="group/logo inline-flex text-fg" aria-label="Castellana Automobile AG – zur Startseite">
            <Logo className="h-5 w-auto" />
          </Link>
          <p className="mt-8 max-w-xs font-display text-[1.75rem] leading-[1.15] tracking-tight text-fg">
            Premium- und Sportwagen am Zürichsee. <em className="text-fg/65">Persönlich seit {site.history.since}.</em>
          </p>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
            Wir beraten Sie auf {site.languages.slice(0, -1).join(", ")} und {site.languages.at(-1)}.
          </p>
        </div>

        {/* Navigation */}
        <nav aria-label="Fusszeilennavigation" className="lg:col-span-2">
          <ColumnTitle>Navigation</ColumnTitle>
          <ul className="space-y-0.5 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact + hours */}
        <div className="lg:col-span-3">
          <ColumnTitle>Kontakt</ColumnTitle>
          <address className="space-y-0.5 text-sm not-italic">
            <p className="text-fg">{site.name}</p>
            <p className="text-muted">{addressLine}</p>
            <p>
              <a href={site.phone.href} className={`${linkClass} tabular`}>
                {site.phone.display}
              </a>
            </p>
            <p>
              <a href={site.email.href} className={linkClass}>
                {site.email.display}
              </a>
            </p>
          </address>
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-sm tabular">
            {site.hours.map((h) => (
              <div key={h.label} className="contents">
                <dt className="text-subtle">{h.label}</dt>
                <dd className="text-muted">
                  {h.slots.length === 0
                    ? formatSlots(h.slots)
                    : h.slots.map(([from, to]) => (
                        <span key={from} className="block">
                          {from} – {to}
                        </span>
                      ))}
                </dd>
              </div>
            ))}
          </dl>
          {site.hoursNote.enabled && <p className="mt-3 text-xs text-muted">{site.hoursNote.text}</p>}
        </div>

        {/* Newsletter + links */}
        <div className="lg:col-span-3">
          <ColumnTitle>Neu eingetroffen</ColumnTitle>
          <NewsletterForm />
          <ul className="mt-6 space-y-0.5 text-sm">
            <li>
              <a href={site.links.autoscout} target="_blank" rel="noopener noreferrer" className={`${linkClass} gap-1.5`}>
                Bestand auf AutoScout24 <ArrowUpRight className="size-3.5" />
                <span className="sr-only">(öffnet in neuem Fenster)</span>
              </a>
            </li>
            <li>
              <a href={site.links.googleMaps} target="_blank" rel="noopener noreferrer" className={`${linkClass} gap-1.5`}>
                Google-Bewertungen ({site.rating.value} ★) <ArrowUpRight className="size-3.5" />
                <span className="sr-only">(öffnet in neuem Fenster)</span>
              </a>
            </li>
            <li>
              <Link href="/partner/" className={linkClass}>
                Partner & Finanzierung
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-4 py-6 text-xs text-subtle md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legal.company} · UID {site.legal.uid}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {legalNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-9 items-center transition-colors hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={site.links.eqiro}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center transition-colors hover:text-fg"
              >
                Website: Eqiro
              </a>
            </li>
          </ul>
        </Container>
      </div>

      <FooterWordmark />
    </footer>
  );
}
