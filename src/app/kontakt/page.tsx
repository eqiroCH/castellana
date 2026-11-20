import type { Metadata } from "next";
import { addressLine, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { Prose } from "@/components/sections/Prose";
import { VisitBand } from "@/components/sections/VisitBand";

export const metadata: Metadata = {
  title: "Kontakt",
  description: `Kontakt & Anfahrt: ${site.name}, ${addressLine}. Telefon ${site.phone.display}, ${site.email.display}.`,
  alternates: { canonical: "/kontakt/" },
};

export default function KontaktPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title={
          <>
            Wir freuen uns <em>auf Ihren Besuch.</em>
          </>
        }
        lead={`${addressLine} · ${site.phone.display}`}
        image="fassade-schild"
        imagePosition="30% 50%"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={site.phone.href}>Jetzt anrufen</ButtonLink>
          <ButtonLink href={site.email.href} variant="outline">
            E-Mail schreiben
          </ButtonLink>
        </div>
      </PageHero>
      <Prose>
        <p>
          Vereinbaren Sie eine Probefahrt, einen Rückruf oder ein persönliches Beratungsgespräch – telefonisch unter{" "}
          <a href={site.phone.href} className="text-fg underline underline-offset-4">
            {site.phone.display}
          </a>
          , per E-Mail an{" "}
          <a href={site.email.href} className="text-fg underline underline-offset-4">
            {site.email.display}
          </a>{" "}
          oder direkt bei uns in Thalwil. Wir beraten Sie auf {site.languages.slice(0, -1).join(", ")} und{" "}
          {site.languages.at(-1)}.
        </p>
      </Prose>
      <VisitBand />
    </>
  );
}
