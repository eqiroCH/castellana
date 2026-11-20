import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHero } from "@/components/sections/PageHero";
import { Prose } from "@/components/sections/Prose";

export const metadata: Metadata = {
  title: "Über uns",
  description: `Familienbetrieb seit ${site.history.since}: die Castellana Automobile AG in Thalwil – Direktimport und Verkauf von Luxus- und Sportfahrzeugen.`,
  alternates: { canonical: "/ueber-uns/" },
};

export default function UeberUnsPage() {
  return (
    <>
      <PageHero
        eyebrow="Über uns"
        title={
          <>
            Familienbetrieb <em>seit {site.history.since}.</em>
          </>
        }
        lead={`«${site.quote.text}» – ${site.quote.author}`}
        image="porsche-lake"
        imagePosition="55% 50%"
      />
      <Prose>
        <p>{site.about}</p>
      </Prose>
    </>
  );
}
