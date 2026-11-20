import { site } from "@/content/site";
import { curatedVehicles, exampleVehicles } from "@/content/vehicles";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ExampleVehicleCard, VehicleCard } from "@/components/vehicles/VehicleCard";
import { SectionHeader } from "./SectionHeader";

export function VehicleHighlights() {
  return (
    <Section tone="dark" aria-labelledby="highlights-title">
      <Container>
        <SectionHeader
          id="highlights-title"
          eyebrow="Aktuelle Highlights"
          title={
            <>
              Ausgewählt aus unserem Bestand. <em>Bereit für Sie.</em>
            </>
          }
          action={
            <ButtonLink href="/fahrzeuge/" variant="outline" icon="arrow">
              Alle {site.stock.cars} Fahrzeuge
            </ButtonLink>
          }
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

        <div className="mt-24 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <h3 className="font-display text-display-sm text-fg">Regelmässig bei uns.</h3>
            <p className="mt-4 max-w-sm text-muted">
              Ihr Wunschmodell ist gerade nicht im Bestand? Wir finden es für Sie – auch per Direktimport aus der EU oder
              den USA.
            </p>
            <ButtonLink href="/import/" variant="link" className="mt-4">
              So funktioniert der Import
            </ButtonLink>
          </Reveal>
          <ul className="lg:col-span-8 lg:col-start-5 lg:grid lg:grid-cols-1 [&>li:last-child>article]:border-b">
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
