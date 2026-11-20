import type { Metadata } from "next";
import { addressLine, site } from "@/content/site";
import { PageHero } from "@/components/sections/PageHero";
import { Prose } from "@/components/sections/Prose";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum der ${site.legal.company}, ${addressLine}.`,
  alternates: { canonical: "/impressum/" },
};

export default function ImpressumPage() {
  return (
    <>
      <PageHero eyebrow="Rechtliches" title="Impressum" />
      <Prose>
        <p>
          <strong>{site.legal.company}</strong>
          <br />
          {addressLine}, {site.address.country}
          <br />
          Telefon <a href={site.phone.href} className="text-fg underline underline-offset-4">{site.phone.display}</a> · E-Mail{" "}
          <a href={site.email.href} className="text-fg underline underline-offset-4">{site.email.display}</a>
          <br />
          UID {site.legal.uid} · {site.legal.commercialRegister}
        </p>
        <p>
          Konzept, Design & Umsetzung:{" "}
          <a href={site.links.eqiro} className="text-fg underline underline-offset-4" target="_blank" rel="noopener noreferrer">
            Eqiro, eqiro.ch
          </a>
        </p>
      </Prose>
    </>
  );
}
