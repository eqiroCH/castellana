import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHero } from "@/components/sections/PageHero";
import { Prose } from "@/components/sections/Prose";
import { VisitBand } from "@/components/sections/VisitBand";

export const metadata: Metadata = {
  title: "Showroom",
  description: `Unser Showroom in Thalwil: rund ${site.stock.onSite} Fahrzeuge vor Ort, davon über ${site.stock.warehouse} weitere aufbereitete Fahrzeuge in der Lagerhalle.`,
  alternates: { canonical: "/showroom/" },
};

export default function ShowroomPage() {
  return (
    <>
      <PageHero
        eyebrow="Showroom Thalwil"
        title={
          <>
            Klein, aber fein. <em>Mit heimischer Atmosphäre.</em>
          </>
        }
        lead={`Rund ${site.stock.onSite} Fahrzeuge vor Ort – im Showroom und in unserer Lagerhalle.`}
        image="showroom-nacht"
        imagePosition="50% 60%"
      />
      <Prose>
        <p>{site.showroom}</p>
      </Prose>
      <VisitBand />
    </>
  );
}
