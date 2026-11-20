import type { ReactNode } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

function Block({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("border-t border-line pt-6", className)}>
      <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-subtle">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

/** Dark contact card: phone, e-mail, address, opening hours, languages and routes. */
export function ContactDetails({ className }: { className?: string }) {
  return (
    <div className={cn("tone-dark bg-ink px-7 py-9 sm:px-10 sm:py-11", className)}>
      <Eyebrow>Direkt erreichbar</Eyebrow>

      <div className="mt-7 space-y-1">
        <a
          href={site.phone.href}
          className="flex min-h-11 items-center font-display text-[2.125rem] leading-tight tracking-tight text-fg underline-offset-[6px] decoration-1 hover:underline tabular sm:text-[2.5rem]"
        >
          {site.phone.display}
        </a>
        <a
          href={site.email.href}
          className="inline-flex min-h-11 items-center text-lead text-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
        >
          {site.email.display}
        </a>
      </div>

      <div className="mt-8 space-y-7">
        <Block title="Adresse">
          <address className="not-italic leading-relaxed">
            <span className="block text-fg">{site.name}</span>
            <span className="block text-muted">{site.address.street}</span>
            <span className="block text-muted">
              {site.address.zip} {site.address.city}
            </span>
          </address>
        </Block>

        <Block title="Öffnungszeiten">
          <dl className="space-y-3 text-[0.9375rem] tabular">
            {site.hours.map((h) => (
              <div key={h.label} className="flex justify-between gap-6">
                <dt className="text-muted">{h.label}</dt>
                <dd className="text-right text-fg">
                  {h.slots.length === 0
                    ? "Geschlossen"
                    : h.slots.map(([from, to]) => (
                        <span key={from} className="block">
                          {from} – {to}
                        </span>
                      ))}
                </dd>
              </div>
            ))}
          </dl>
          {site.hoursNote.enabled && <p className="mt-3 text-sm text-muted">{site.hoursNote.text}</p>}
        </Block>

        <Block title="Wir beraten Sie auf">
          <ul className="flex flex-wrap gap-2" aria-label="Sprachen">
            {site.languages.map((language) => (
              <li key={language} className="border border-line-strong px-3 py-1 text-[0.8125rem] text-fg">
                {language}
              </li>
            ))}
          </ul>
        </Block>
      </div>

      <div className="mt-9 flex flex-col gap-3">
        <ButtonLink href={site.links.googleRoute} size="sm" className="w-full">
          Route in Google Maps
        </ButtonLink>
        <ButtonLink href={site.links.appleMaps} variant="outline" size="sm" className="w-full">
          Route in Apple Karten
        </ButtonLink>
      </div>
    </div>
  );
}
