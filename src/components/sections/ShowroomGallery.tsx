import type { CSSProperties } from "react";
import type { MediaSlug } from "@/content/media";
import { cn } from "@/lib/cn";
import { SpotlightGrid } from "@/components/motion/SpotlightGrid";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "./SectionHeader";

const tiles: Array<{ media: MediaSlug; className: string; sizes: string }> = [
  { media: "showroom-lamborghini", className: "col-span-2 lg:col-span-7 lg:row-span-2", sizes: "(min-width: 1024px) 56vw, 100vw" },
  { media: "showroom-mclaren", className: "lg:col-span-5 lg:aspect-auto", sizes: "(min-width: 1024px) 40vw, 50vw" },
  { media: "showroom-aston-martin", className: "lg:col-span-5 lg:aspect-auto", sizes: "(min-width: 1024px) 40vw, 50vw" },
  { media: "showroom-detail", className: "lg:col-span-4", sizes: "(min-width: 1024px) 32vw, 50vw" },
  { media: "showroom-cockpit", className: "lg:col-span-4", sizes: "(min-width: 1024px) 32vw, 50vw" },
  { media: "showroom-maserati", className: "col-span-2 lg:col-span-4", sizes: "(min-width: 1024px) 32vw, 100vw" },
];

/**
 * Bento grid of the client's own showroom photos. The tiles switch on like showroom lights
 * when the grid enters the viewport; on desktop a flashlight follows the pointer.
 */
export function ShowroomGallery() {
  return (
    <Section tone="dark" aria-labelledby="showroom-title">
      <Container>
        <SectionHeader
          id="showroom-title"
          index={6}
          eyebrow="Showroom Thalwil"
          title={
            <>
              Klein, aber fein. <em>Mit heimischer Atmosphäre.</em>
            </>
          }
          lead="Luxuriöse Fahrzeuge, höchste Technik und viel Glanz – dazu eine Lagerhalle mit über 100 weiteren aufbereiteten Fahrzeugen direkt vor Ort."
          action={
            <ButtonLink href="/showroom/" variant="outline" icon="arrow">
              Showroom entdecken
            </ButtonLink>
          }
        />
        <SpotlightGrid className="mt-14 md:mt-20">
          <ul className="grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-12">
            {tiles.map((tile, i) => (
              <li
                key={tile.media}
                style={{ "--i": i } as CSSProperties}
                className={cn("lights-tile group relative aspect-[3/2] overflow-hidden bg-surface", tile.className)}
              >
                <Photo
                  media={tile.media}
                  sizes={tile.sizes}
                  className="absolute inset-0 size-full object-cover brightness-[0.92] saturate-[0.85] transition-transform duration-[1400ms] ease-out-quart group-hover:scale-[1.03]"
                />
              </li>
            ))}
          </ul>
        </SpotlightGrid>
      </Container>
    </Section>
  );
}
