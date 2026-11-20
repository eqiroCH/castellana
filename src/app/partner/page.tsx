import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Prose } from "@/components/sections/Prose";

export const metadata: Metadata = {
  title: "Partner",
  description:
    "Unsere Partner: Alphera Financial Services für Leasing und Finanzierung, Mercedes-Benz Automobile AG, The RE/MAX Collection und SEESICHT Media AG.",
  alternates: { canonical: "/partner/" },
};

export default function PartnerPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner"
        title={
          <>
            Starke Partner. <em>Für Ihr nächstes Fahrzeug.</em>
          </>
        }
        lead="Leasing, Finanzierung und mehr – mit Partnern, denen wir seit Jahren vertrauen."
        image="porsche-cockpit-wide"
        imagePosition="50% 40%"
      />
      <Prose>
        <p>
          Für Leasing und Finanzierung arbeiten wir mit <strong>Alphera Financial Services</strong> (BMW Group) zusammen.
          Zu unserem Netzwerk gehören zudem die Mercedes-Benz Automobile AG in Stäfa, The RE/MAX Collection in Bäch und die
          SEESICHT Media AG in Thalwil.
        </p>
      </Prose>
    </>
  );
}
