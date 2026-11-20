import { addressLine, formatSlots, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/** Address, opening hours and routes — closes every key page before the footer. */
export function VisitBand() {
  return (
    <Section tone="dark" aria-labelledby="visit-title" className="overflow-hidden">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-6">
          <div className="relative aspect-[16/10] overflow-hidden bg-surface lg:aspect-[4/3]">
            <Photo media="fassade-schild" sizes="(min-width: 1024px) 50vw, 100vw" position="30% 50%" className="size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
          </div>
        </Reveal>

        <Reveal className="flex flex-col justify-center lg:col-span-5 lg:col-start-8" delay={100}>
          <Eyebrow>Besuchen Sie uns</Eyebrow>
          <Heading id="visit-title" className="mt-5">
            Willkommen <em>in Thalwil.</em>
          </Heading>
          <address className="mt-8 not-italic">
            <p className="text-lead text-fg">{site.name}</p>
            <p className="text-lead text-muted">{addressLine}</p>
          </address>

          <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-8 gap-y-2.5 border-t border-line pt-6 text-[0.9375rem] tabular">
            {site.hours.map((h) => (
              <div key={h.label} className="contents">
                <dt className="text-muted">{h.label}</dt>
                <dd className="text-fg">{formatSlots(h.slots)}</dd>
              </div>
            ))}
          </dl>
          {site.hoursNote.enabled && <p className="mt-3 text-sm text-muted">{site.hoursNote.text}</p>}

          <div className="mt-8 flex flex-col gap-x-8 gap-y-1 border-t border-line pt-6 sm:flex-row sm:flex-wrap">
            <a href={site.phone.href} className="inline-flex min-h-11 items-center text-fg underline-offset-4 hover:underline tabular">
              {site.phone.display}
            </a>
            <a href={site.email.href} className="inline-flex min-h-11 items-center text-fg underline-offset-4 hover:underline">
              {site.email.display}
            </a>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={site.links.googleRoute}>Route planen</ButtonLink>
            <ButtonLink href={site.links.appleMaps} variant="outline">
              Apple Karten
            </ButtonLink>
            <ButtonLink href="/kontakt/" variant="link" className="sm:ml-2">
              Kontaktformular
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
