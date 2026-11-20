import type { Metadata } from "next";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { Prose } from "@/components/sections/Prose";

export const metadata: Metadata = {
  title: "Kommissionsverkauf",
  description:
    "Lassen Sie Ihr Fahrzeug von uns verkaufen: mit Leasing, Garantie und Eintausch, die Sie privat nicht anbieten können – Abwicklung von A bis Z.",
  alternates: { canonical: "/kommission/" },
};

export default function KommissionPage() {
  return (
    <>
      <PageHero
        eyebrow="Kommissionsverkauf"
        title={
          <>
            Wir verkaufen Ihr Fahrzeug. <em>Von A bis Z.</em>
          </>
        }
        lead={`«${site.commission.quote.text}» – ${site.commission.quote.author}`}
        image="amg-gt-wide"
        imagePosition="50% 65%"
      >
        <ButtonLink href="/kontakt/" icon="arrow">
          Fahrzeug anbieten
        </ButtonLink>
      </PageHero>
      <Prose>
        <p>{site.commission.intro}</p>
      </Prose>
    </>
  );
}
