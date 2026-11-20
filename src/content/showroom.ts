/**
 * Page copy for /showroom/. Facts come from `site.ts` / BRIEF.md.
 */
import type { MediaSlug } from "./media";
import { site } from "./site";

export type GalleryLayout = "feature" | "side" | "portrait" | "wide";

export type GalleryPhoto = {
  media: MediaSlug;
  layout: GalleryLayout;
  /** object-position for the cropped tile */
  position?: string;
  /** Overrides the default alt text from media.ts */
  alt?: string;
};

/** The client's own showroom photos (1024 px originals — tiles stay well below that width). */
export const showroomPhotos: GalleryPhoto[] = [
  { media: "showroom-lamborghini", layout: "feature", position: "50% 60%" },
  { media: "showroom-mclaren", layout: "side", position: "62% 50%" },
  { media: "showroom-detail", layout: "portrait", position: "28% 50%" },
  { media: "showroom-cockpit", layout: "portrait", position: "48% 50%" },
  { media: "showroom-aston-martin", layout: "portrait", position: "52% 50%" },
  { media: "showroom-maserati", layout: "wide", position: "50% 55%" },
];

export const showroomExpectations = [
  {
    title: "Showroom",
    text: "Regelmässig neue Fahrzeuge, präsentiert mit viel Glanz – und genug Ruhe, um sie in Ihrem Tempo zu entdecken.",
  },
  {
    title: `Lagerhalle mit ${site.stock.warehouse}+ Fahrzeugen`,
    text: `Direkt vor Ort warten über ${site.stock.warehouse} weitere aufbereitete Fahrzeuge. Gerne zeigen wir Ihnen auch Modelle, die gerade nicht im Showroom stehen.`,
  },
  {
    title: "Beratung & Probefahrt",
    text: "Wir nehmen uns Zeit für Ihre Fragen. Probefahrten vereinbaren Sie am einfachsten vorab – telefonisch oder über das Kontaktformular.",
  },
];

/**
 * Directions. Kept deliberately general — verified: Thalwil lies on the left shore of
 * Lake Zurich and has an S-Bahn station. No walking times or parking specifics until
 * confirmed by the client.
 */
export const showroomDirections = [
  {
    title: "Mit dem Auto",
    text: "Thalwil liegt am linken Zürichseeufer, rund 15 Autominuten von Zürich. Die Route öffnen Sie mit einem Klick in Google Maps oder Apple Karten.",
  },
  {
    title: "Mit dem Zug",
    text: "Mit der S-Bahn bis Bahnhof Thalwil – von dort sind es gut 20 Minuten zu Fuss oder wenige Minuten mit Bus oder Taxi.",
  },
];
