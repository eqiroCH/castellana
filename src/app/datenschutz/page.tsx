import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHero } from "@/components/sections/PageHero";
import { Prose } from "@/components/sections/Prose";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: `Datenschutzerklärung der ${site.legal.company} gemäss Schweizer Datenschutzgesetz (DSG).`,
  alternates: { canonical: "/datenschutz/" },
};

export default function DatenschutzPage() {
  return (
    <>
      <PageHero eyebrow="Rechtliches" title="Datenschutz" />
      <Prose>
        <p>
          Der Schutz Ihrer Personendaten ist uns wichtig. Die {site.legal.company} bearbeitet Personendaten gemäss dem
          Schweizer Datenschutzgesetz (DSG). Diese Website setzt keine Analyse- oder Tracking-Cookies ein. Bei Fragen zum
          Datenschutz erreichen Sie uns unter{" "}
          <a href={site.email.href} className="text-fg underline underline-offset-4">
            {site.email.display}
          </a>
          .
        </p>
      </Prose>
    </>
  );
}
