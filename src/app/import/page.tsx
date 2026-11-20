import type { Metadata } from "next";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { Prose } from "@/components/sections/Prose";

const why = site.importFaq.find((item) => item.question === "Warum ein Auto importieren?");

export const metadata: Metadata = {
  title: "Direktimport",
  description:
    "Direktimport von Luxus- und Sportfahrzeugen aus der EU und den USA: Dokumente, Transport, Verzollung, MFK und schlüsselfertige Übergabe aus einer Hand.",
  alternates: { canonical: "/import/" },
};

export default function ImportPage() {
  return (
    <>
      <PageHero
        eyebrow="Direktimport"
        title={
          <>
            Ihr Wunschfahrzeug. <em>Importiert zu Top-Preisen.</em>
          </>
        }
        lead="Von den Dokumenten über Transport und Verzollung bis zur MFK – wir übernehmen den gesamten Import und übergeben Ihnen das Fahrzeug schlüsselfertig."
        image="porsche-gt3-rear"
        imagePosition="50% 60%"
      >
        <ButtonLink href="/kontakt/" icon="arrow">
          Import anfragen
        </ButtonLink>
      </PageHero>
      {why && (
        <Prose>
          <p>{why.answer}</p>
        </Prose>
      )}
    </>
  );
}
