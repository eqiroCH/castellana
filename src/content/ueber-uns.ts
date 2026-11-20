/**
 * Page copy for /ueber-uns/. Facts come from `site.ts` / BRIEF.md — this file only
 * arranges them (timeline, values, video details, Leo's milestones).
 */
import { site } from "./site";

export type Milestone = { label: string; text: string };

/** Short history strip: 1983 → 2017 → today. */
export const aboutMilestones: Milestone[] = [
  { label: String(site.history.since), text: `${site.owner.name} startet in der Autobranche.` },
  { label: String(site.history.incorporated), text: `Aus der Einzelfirma wird die ${site.legal.company}.` },
  { label: "Heute", text: `Rund ${site.stock.onSite} Fahrzeuge vor Ort – im Showroom und in der Lagerhalle in Thalwil.` },
];

export type Value = { title: string; kicker: string; text: string };

/** «Was uns ausmacht» — four reasons, typographic list. */
export const aboutValues: Value[] = [
  {
    title: "Persönlich",
    kicker: "Freund statt Kunde",
    text: "Ein Familienbetrieb mit kurzen Wegen: Wir nehmen uns Zeit für Sie – vom ersten Gespräch bis zur Übergabe und darüber hinaus.",
  },
  {
    title: "Auswahl",
    kicker: `Rund ${site.stock.onSite} Fahrzeuge vor Ort`,
    text: `Im Showroom und in unserer Lagerhalle mit über ${site.stock.warehouse} weiteren aufbereiteten Fahrzeugen – von Porsche und Ferrari bis Mercedes-AMG und Lamborghini.`,
  },
  {
    title: "Import-Kompetenz",
    kicker: "Unser Kerngeschäft",
    text: "Top-Fahrzeuge zu Top-Preisen aus der EU und den USA. Bevor wir einen Import empfehlen, vergleichen wir die Preise – ehrlich und transparent.",
  },
  {
    title: "Mehrsprachig",
    kicker: `${site.languages.length} Sprachen im Betrieb`,
    text: `Wir beraten Sie auf ${site.languages.slice(0, -1).join(", ")} und ${site.languages.at(-1)}.`,
  },
];

/**
 * Titles/descriptions per YouTube ID, verified against the videos themselves (oEmbed title
 * and poster, 20.11.2026). Note: the titles in `site.videos` are assigned to the wrong IDs —
 * see the change request in the hand-over notes. Falls back to `site.videos` for unknown IDs.
 */
export const videoDetails: Record<string, { title: string; text: string; posterScale?: number }> = {
  "4r49EJO_irE": {
    title: "Castellana in der Automobil Revue",
    text: "TV-Beitrag der Automobil Revue aus dem Jahr 2011 – zu Besuch bei Castellana Automobile.",
  },
  NU1DGvBoPu0: {
    title: "Autoimport & Kommissionsverkauf",
    text: "Kurzfilm über unsere Kernleistungen: Direktimport und Kommissionsverkauf.",
    /** This poster has extra letterboxing inside the 16:9 frame. */
    posterScale: 1.32,
  },
  bVMyvLQfwQ8: {
    title: "Castellana Automobile – Firmenporträt",
    text: "Ein Blick in unseren Showroom in Thalwil und auf die Fahrzeuge vor Ort.",
    posterScale: 1.04,
  },
};

/** Leo's CV (BRIEF.md → Team). */
export const companionMilestones: Milestone[] = [
  { label: "6 Monate", text: "Welpen-Spielgruppe Langnau am Albis" },
  { label: "18 Monate", text: "Ausbildung zum Wachhund" },
];

/** Language codes on the team list → full German names (screen readers, tooltips). */
export const languageNames: Record<string, string> = {
  DE: "Deutsch",
  EN: "Englisch",
  FR: "Französisch",
  IT: "Italienisch",
  ES: "Spanisch",
  PT: "Portugiesisch",
  RU: "Russisch",
};

/** Prefilled application e-mail, e.g. «Bewerbung: Fahrzeugaufbereiter/in». */
export function applicationMailto(position?: string): string {
  const subject = position ? `Bewerbung: ${position}` : "Bewerbung";
  return `mailto:${site.email.display}?subject=${encodeURIComponent(subject)}`;
}

/** «sechs» — numbers up to twelve are written out in running text. */
export function numberWord(value: number): string {
  const words = ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"];
  return words[value] ?? String(value);
}
