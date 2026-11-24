import Link from "next/link";
import { site } from "@/content/site";
import { curatedVehicles, exampleVehicles } from "@/content/vehicles";
import { cn } from "@/lib/cn";
import { CountUp } from "@/components/motion/CountUp";
import { DrawLine } from "@/components/motion/DrawLine";
import { ArrowRight } from "@/components/ui/Icons";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ExampleVehicleCard, VehicleCard } from "@/components/vehicles/VehicleCard";
import { SectionHeader } from "./SectionHeader";

/**
 * Curated listings as an editorial spread: one featured car (7 columns) next to the others as
 * compact cards (5 columns, set lower) and an oversized «175» link to the full stock, then
 * typical models «regularly in stock».
 */
export function VehicleHighlights() {
  const [lead, ...rest] = curatedVehicles;
  return (
    <Section tone="dark" aria-labelledby="highlights-title">
      <Container>
        <SectionHeader
          id="highlights-title"
          index={1}
          eyebrow="Aktuelle Highlights"
          title={
            <>
              Ausgewählt aus unserem Bestand. <em>Bereit für Sie.</em>
            </>
          }
        />

        <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-12 lg:grid-rows-[auto_auto_1fr] lg:gap-x-10 lg:gap-y-12">
          {lead && (
            <Reveal as="li" key={lead.id} className="sm:col-span-2 lg:col-span-7 lg:row-span-3">
              <VehicleCard vehicle={lead} variant="featured" sizes="(min-width: 1376px) 760px, (min-width: 1024px) 56vw, 100vw" />
            </Reveal>
          )}
          {rest.map((vehicle, i) => (
            <Reveal
              as="li"
              key={vehicle.id}
              delay={(i + 1) * 110}
              className={cn("lg:col-span-5 lg:col-start-8 lg:self-start", i === 0 && "lg:mt-24")}
            >
              <VehicleCard vehicle={vehicle} variant="compact" sizes="(min-width: 1024px) 230px, (min-width: 640px) 50vw, 100vw" />
            </Reveal>
          ))}
          {/* The section's call to action, set as an oversized figure under the compact cards. */}
          <Reveal as="li" delay={330} className="sm:col-span-2 lg:col-span-5 lg:col-start-8 lg:self-end">
            <Link
              href="/fahrzeuge/"
              className="group flex items-end justify-between gap-6 border-t border-line-strong pt-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg"
            >
              <span>
                <span className="block font-display text-[clamp(4.5rem,7.5vw,7rem)] leading-[0.78] tracking-[-0.035em] text-fg">
                  <CountUp value={String(site.stock.cars)} />
                </span>
                <span className="mt-4 block text-eyebrow font-semibold uppercase text-muted">Fahrzeuge im Bestand</span>
              </span>
              <span className="inline-flex items-center gap-4 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-fg">
                Alle ansehen
                <span
                  aria-hidden="true"
                  className="inline-flex size-12 items-center justify-center border border-line-strong transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white"
                >
                  <ArrowRight className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          </Reveal>
        </ul>
        <p className="mt-10 max-w-3xl text-[0.8125rem] leading-relaxed text-muted lg:mt-14">
          Leasingraten sind Beispiele aus den aktuellen Inseraten und abhängig von Laufzeit, Anzahlung und Bonität.
          Die Kreditvergabe ist verboten, falls sie zur Überschuldung der Konsumentin oder des Konsumenten führt
          (Art.&nbsp;3 UWG).
        </p>

        <DrawLine className="mt-20 lg:mt-28" accent={false} />
        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <h3 className="font-display text-display-md text-fg">
              Regelmässig <em className="italic text-fg/70">bei uns.</em>
            </h3>
            <p className="mt-5 max-w-sm text-muted">
              Ihr Wunschmodell ist gerade nicht im Bestand? Wir finden es für Sie – auch per Direktimport aus der EU oder
              den USA.
            </p>
            <ButtonLink href="/import/" variant="link" className="mt-4">
              So funktioniert der Import
            </ButtonLink>
          </Reveal>
          <ul className="lg:col-span-7 lg:col-start-6 lg:grid lg:grid-cols-1 [&>li:last-child>article]:border-b">
            {exampleVehicles.map((vehicle, i) => (
              <Reveal as="li" key={vehicle.id} delay={i * 70}>
                <ExampleVehicleCard vehicle={vehicle} />
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
