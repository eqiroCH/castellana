import type { Metadata } from "next";
import { addressLine, formatSlots, site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { showroomDirections, showroomExpectations, showroomPhotos } from "@/content/showroom";
import { CtaBand } from "@/components/sections/CtaBand";
import { Gallery } from "@/components/sections/Gallery";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const description = `Besuchen Sie unseren Showroom in Thalwil am Zürichsee: rund ${site.stock.onSite} Fahrzeuge vor Ort, eine Lagerhalle mit über ${site.stock.warehouse} aufbereiteten Fahrzeugen, persönliche Beratung und Probefahrt. Öffnungszeiten und Anfahrt.`;

export const metadata: Metadata = pageMetadata({
  title: "Showroom in Thalwil",
  description,
  path: "/showroom/",
});

const testDrive = "/kontakt/?anliegen=probefahrt";

export default function ShowroomPage() {
  return (
    <>
      <PageHero
        eyebrow="Showroom Thalwil"
        title={
          <>
            Ein Showroom <em>zum Wohlfühlen.</em>
          </>
        }
        lead={`Rund ${site.stock.onSite} Fahrzeuge vor Ort, persönliche Beratung und Probefahrten – in Thalwil am Zürichsee.`}
        image="showroom-nacht"
        imagePosition="50% 60%"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={testDrive} icon="arrow">
            Probefahrt vereinbaren
          </ButtonLink>
          <ButtonLink href="#besuch" variant="outline">
            Öffnungszeiten & Anfahrt
          </ButtonLink>
        </div>
      </PageHero>

      {/* Intro + what to expect ----------------------------------------- */}
      <Section tone="light" aria-labelledby="intro-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-5">
              <Eyebrow>Der Showroom</Eyebrow>
              <Heading id="intro-title" className="mt-5">
                Klein, aber fein. <em>Mit heimischer Atmosphäre.</em>
              </Heading>
            </Reveal>
            <Reveal className="lg:col-span-6 lg:col-start-7 lg:pt-11" delay={100}>
              <p className="text-lead text-muted">{site.showroom}</p>
            </Reveal>
          </div>

          <h3 className="mt-20 flex items-center gap-3 text-eyebrow font-semibold uppercase text-muted md:mt-28">
            <span aria-hidden="true" className="size-[7px] shrink-0 bg-brand" />
            Was Sie erwartet
          </h3>
          <ol className="mt-8 grid gap-x-8 md:grid-cols-3">
            {showroomExpectations.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 90} className="border-t border-line-strong py-8">
                <span className="font-display text-lg text-subtle tabular" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="mt-4 font-display text-display-sm text-fg">{item.title}</h4>
                <p className="mt-3 max-w-sm text-[0.9375rem] text-muted">{item.text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Gallery ---------------------------------------------------------- */}
      <Section tone="dark" aria-labelledby="gallery-title">
        <Container>
          <SectionHeader
            id="gallery-title"
            eyebrow="Galerie"
            title={
              <>
                Einblicke <em>in den Showroom.</em>
              </>
            }
            lead="Ein Auszug aus unserem Alltag in Thalwil – wählen Sie ein Bild, um es zu vergrössern."
          />
          <div className="mt-14 md:mt-20">
            <Gallery photos={showroomPhotos} label="Showroom-Galerie">
              <Reveal className="flex h-full flex-col justify-between gap-8 border-t border-line-strong pt-6 max-lg:mt-10 lg:ml-5 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-1">
                <div>
                  <p className="font-display text-display-sm text-fg">
                    Regelmässig neue Fahrzeuge. <em className="italic text-fg/70">Schauen Sie vorbei.</em>
                  </p>
                  <p className="mt-4 max-w-sm text-[0.9375rem] text-muted">
                    Was gerade bei uns steht, sehen Sie jederzeit im Online-Bestand – aktuell {site.stock.cars} Fahrzeuge.
                  </p>
                </div>
                <ButtonLink href="/fahrzeuge/" variant="outline" icon="arrow" className="self-start">
                  Zum Bestand
                </ButtonLink>
              </Reveal>
            </Gallery>
          </div>
        </Container>
      </Section>

      {/* Visit ------------------------------------------------------------ */}
      <Section tone="light" id="besuch" aria-labelledby="visit-title">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:order-2 lg:col-span-4 lg:col-start-9">
            <Eyebrow>Besuchen Sie uns</Eyebrow>
            <Heading id="visit-title" className="mt-5">
              So finden <em>Sie uns.</em>
            </Heading>
            <address className="mt-8 not-italic">
              <p className="text-lead text-fg">{site.name}</p>
              <p className="text-lead text-muted">{addressLine}</p>
            </address>

            <h3 className="sr-only">Öffnungszeiten</h3>
            <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-8 gap-y-2.5 border-t border-line-strong pt-6 text-[0.9375rem] tabular">
              {site.hours.map((h) => (
                <div key={h.label} className="contents">
                  <dt className="text-muted">{h.label}</dt>
                  <dd className="text-fg">{formatSlots(h.slots)}</dd>
                </div>
              ))}
            </dl>
            {site.hoursNote.enabled && <p className="mt-3 text-sm text-muted">{site.hoursNote.text}</p>}

            <div className="mt-6 flex flex-col gap-x-8 border-t border-line-strong pt-4 sm:flex-row sm:flex-wrap">
              <a href={site.phone.href} className="inline-flex min-h-11 items-center text-fg underline-offset-4 hover:underline tabular">
                {site.phone.display}
              </a>
              <a href={site.email.href} className="inline-flex min-h-11 items-center text-fg underline-offset-4 hover:underline">
                {site.email.display}
              </a>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <ButtonLink href={site.links.googleRoute}>Route in Google Maps</ButtonLink>
              <ButtonLink href={site.links.appleMaps} variant="outline">
                Apple Karten
              </ButtonLink>
            </div>
          </Reveal>

          <div className="lg:order-1 lg:col-span-7">
            <Reveal>
              <figure>
                <div className="relative aspect-[1170/441] overflow-hidden bg-surface">
                  <Photo media="fassade-schild" sizes="(min-width: 1376px) 740px, (min-width: 1024px) 56vw, 100vw" className="size-full object-cover" />
                </div>
                <figcaption className="mt-4 flex items-start gap-4 text-sm text-muted">
                  <span aria-hidden="true" className="mt-2.5 h-px w-8 shrink-0 bg-fg/40" />
                  <span>Erkennbar am roten Quadrat: unser beleuchtetes Schild an der Fassade.</span>
                </figcaption>
              </figure>
            </Reveal>

            <h3 className="mt-14 font-display text-display-sm text-fg">Anfahrt</h3>
            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {showroomDirections.map((item, i) => (
                <Reveal as="li" key={item.title} delay={i * 90} className="border-t border-line-strong py-6">
                  <h4 className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-fg">{item.title}</h4>
                  <p className="mt-3 max-w-sm text-[0.9375rem] text-muted">{item.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow="Probefahrt"
        title={
          <>
            Erleben Sie Ihr Wunschfahrzeug. <em>Auf der Strasse.</em>
          </>
        }
        lead="Vereinbaren Sie Ihren Termin für eine Probefahrt – telefonisch oder über das Kontaktformular."
      >
        <ButtonLink href={testDrive} icon="arrow">
          Probefahrt vereinbaren
        </ButtonLink>
        <ButtonLink href="/fahrzeuge/" variant="outline">
          Fahrzeuge ansehen
        </ButtonLink>
      </CtaBand>
    </>
  );
}
