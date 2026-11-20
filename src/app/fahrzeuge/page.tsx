import type { Metadata } from "next";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { Prose } from "@/components/sections/Prose";
import { VisitBand } from "@/components/sections/VisitBand";

export const metadata: Metadata = {
  title: "Fahrzeuge",
  description: `Über ${site.stock.cars} Premium-, Luxus- und Sportfahrzeuge im Bestand: Porsche, Ferrari, Mercedes-AMG, Lamborghini und mehr – unfallfrei, ab MFK und servicegepflegt.`,
  alternates: { canonical: "/fahrzeuge/" },
};

export default function FahrzeugePage() {
  return (
    <>
      <PageHero
        eyebrow="Fahrzeuge"
        title={
          <>
            {site.stock.cars} Fahrzeuge. <em>Eines davon ist Ihres.</em>
          </>
        }
        lead="Porsche, Ferrari, Mercedes-AMG, Lamborghini und viele mehr – sorgfältig ausgewählt und bereit für die Übergabe."
        image="ferrari-front"
        imagePosition="50% 78%"
      >
        <ButtonLink href={site.links.autoscout}>Bestand auf AutoScout24</ButtonLink>
      </PageHero>
      <Prose>
        <p>
          <strong>{site.quality.statement}</strong> Unser gesamter Bestand ist jederzeit aktuell auf AutoScout24 einsehbar –
          für eine Probefahrt oder ein persönliches Angebot sind wir gerne für Sie da.
        </p>
      </Prose>
      <VisitBand />
    </>
  );
}
