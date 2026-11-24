import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/content/site";
import { curatedVehicles } from "@/content/vehicles";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { VisitBand } from "@/components/sections/VisitBand";
import { CountUp } from "@/components/scroll/CountUp";
import { AutoScoutWidget } from "@/components/vehicles/AutoScoutWidget";
import { VehicleCard } from "@/components/vehicles/VehicleCard";

const title = "Sportwagen & Luxusautos kaufen in Thalwil";
const description = `Rund ${site.stock.cars} Premium-, Luxus- und Sportfahrzeuge live im Bestand: Porsche, Ferrari, Mercedes-AMG, Lamborghini und mehr – garantiert unfallfrei, ab MFK, mit Werksgarantie oder 12 Monaten Garantie.`;

export const metadata: Metadata = pageMetadata({ title, description, path: "/fahrzeuge/" });

const trust = [
  { value: `${site.rating.value}`, suffix: "★", label: `Google · ${site.rating.count} Bewertungen` },
  { value: `${site.stock.cars}`, label: "Fahrzeuge live im Bestand" },
  { value: "Garantie", label: "Werksgarantie oder 12 Monate" },
  { value: "ab MFK", label: "Unfallfrei & servicegepflegt" },
];

export default function FahrzeugePage() {
  return (
    <>
      <PageHero
        eyebrow="Fahrzeugbestand"
        title={
          <>
            {site.stock.cars} Fahrzeuge in Thalwil. <em>Eines davon ist Ihres.</em>
          </>
        }
        lead={site.quality.statement}
        image="ferrari-front"
        imagePosition="50% 78%"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#bestand" icon="arrow">
            Zum Live-Bestand
          </ButtonLink>
          <ButtonLink href="/kontakt/?anliegen=probefahrt" variant="outline">
            Probefahrt vereinbaren
          </ButtonLink>
        </div>
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6 md:mt-16 md:grid-cols-4">
          {trust.map((item, i) => (
            <div key={item.label} className="flex flex-col-reverse justify-end gap-1.5">
              <dt className="text-[0.75rem] text-muted">{item.label}</dt>
              <dd className="font-display text-[1.75rem] leading-none tracking-tight text-fg tabular md:text-[2rem]">
                <CountUp value={item.value} delay={600 + i * 120} />
                {item.suffix && (
                  <span aria-hidden="true" className="ml-1 align-[0.35em] text-[0.55em] text-brand">
                    {item.suffix}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* Live stock — light surface so the third-party UI blends in */}
      <Section tone="light" id="bestand" aria-labelledby="bestand-title">
        <Container>
          <Reveal className="flex flex-col gap-6 border-b border-line-strong pb-10 md:flex-row md:items-end md:justify-between md:pb-12">
            <div className="max-w-2xl">
              <Eyebrow>Live-Bestand</Eyebrow>
              <Heading id="bestand-title" className="mt-5">
                Alle Fahrzeuge. <em>Filtern, vergleichen, anfragen.</em>
              </Heading>
            </div>
            <p className="flex items-center gap-3 text-sm text-muted md:pb-2">
              <span aria-hidden="true" className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-brand/60 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              Bestand wird live von AutoScout24 geladen
            </p>
          </Reveal>
          <AutoScoutWidget className="mt-10 md:mt-12" />
        </Container>
      </Section>

      {/* Curated highlights */}
      <Section tone="dark" aria-labelledby="highlights-title">
        <Container>
          <SectionHeader
            id="highlights-title"
            eyebrow="Aktuelle Highlights"
            title={
              <>
                Drei Fahrzeuge, <em>die wir Ihnen gerne zeigen.</em>
              </>
            }
            lead="Eine kleine Auswahl aus dem aktuellen Bestand – mit Leasingbeispiel. Vereinbaren Sie eine Probefahrt in Thalwil."
          />
          <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
            {curatedVehicles.map((vehicle, i) => (
              <Reveal as="li" key={vehicle.id} delay={i * 90}>
                <VehicleCard vehicle={vehicle} />
              </Reveal>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-[0.8125rem] leading-relaxed text-muted">
            Leasingraten sind Beispiele aus den aktuellen Inseraten und abhängig von Laufzeit, Anzahlung und Bonität.
            Die Kreditvergabe ist verboten, falls sie zur Überschuldung der Konsumentin oder des Konsumenten führt
            (Art.&nbsp;3 UWG).
          </p>
        </Container>
      </Section>

      {/* Import + financing */}
      <Section tone="light" aria-label="Import und Finanzierung">
        <Container className="grid gap-20 lg:grid-cols-2 lg:gap-8">
          <Reveal as="article" className="flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden bg-surface">
              <Photo media="porsche-lake" sizes="(min-width: 1024px) 50vw, 100vw" position="50% 60%" className="size-full object-cover" />
            </div>
            <Eyebrow className="mt-10">Direktimport</Eyebrow>
            <Heading size="md" className="mt-5">
              Nicht gefunden? <em>Wir importieren Ihr Wunschfahrzeug.</em>
            </Heading>
            <p className="mt-5 max-w-lg text-muted">
              Ihr Wunschmodell ist gerade nicht im Bestand? Wir suchen es für Sie in der Schweiz, der EU und den USA –
              und übernehmen Dokumente, Transport, Verzollung und MFK bis zur schlüsselfertigen Übergabe.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/kontakt/?anliegen=import" icon="arrow">
                Wunschfahrzeug anfragen
              </ButtonLink>
              <ButtonLink href="/import/" variant="link" className="sm:ml-3">
                So funktioniert der Import
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal as="article" className="flex flex-col lg:mt-32" delay={100}>
            <div className="relative aspect-[16/10] overflow-hidden bg-surface">
              <Photo media="porsche-cockpit-wide" sizes="(min-width: 1024px) 50vw, 100vw" className="size-full object-cover" />
            </div>
            <Eyebrow className="mt-10">Finanzierung & Leasing</Eyebrow>
            <Heading size="md" className="mt-5">
              Bequem finanziert. <em>Mit starkem Partner.</em>
            </Heading>
            <p className="mt-5 max-w-lg text-muted">
              Leasing und Finanzierung bieten wir über unseren Partner Alphera Financial Services (BMW Group) an. Ihr
              bisheriges Fahrzeug nehmen wir auf Wunsch gerne in Zahlung. Wir beraten Sie persönlich und erstellen Ihnen
              ein Angebot.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/kontakt/" variant="outline" icon="arrow">
                Angebot anfragen
              </ButtonLink>
              <ButtonLink href="/partner/" variant="link" className="sm:ml-3">
                Unsere Partner
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      <VisitBand />
    </>
  );
}
