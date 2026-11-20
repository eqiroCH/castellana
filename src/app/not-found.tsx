import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  description: "Die gesuchte Seite existiert nicht (mehr). Entdecken Sie unsere Fahrzeuge oder kontaktieren Sie uns.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="tone-dark relative isolate flex min-h-[100svh] items-end overflow-hidden" aria-labelledby="nf-title">
      <div className="absolute inset-0 -z-10">
        {/* Not `priority`: the root not-found tree ships in every page's payload, and an eager
            image here would be preloaded (fetchpriority=high) on every route. */}
        <Photo media="ferrari-wheel-wide" alt="" sizes="100vw" position="50% 50%" className="size-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink to-transparent" />
      </div>
      <Container className="pb-16 pt-40 md:pb-24">
        <Eyebrow>Fehler 404</Eyebrow>
        <h1 id="nf-title" className="mt-6 max-w-3xl font-display text-display-xl text-fg">
          Diese Seite ist nicht <em className="text-fg/70">(mehr) verfügbar.</em>
        </h1>
        <p className="mt-6 max-w-xl text-lead text-paper/80">
          Vielleicht wurde sie verschoben – oder das gesuchte Fahrzeug hat bereits einen neuen Besitzer gefunden.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/fahrzeuge/" icon="arrow">
            Fahrzeuge entdecken
          </ButtonLink>
          <ButtonLink href="/" variant="outline">
            Zur Startseite
          </ButtonLink>
          <ButtonLink href="/kontakt/" variant="link" className="sm:ml-3">
            Kontakt
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
