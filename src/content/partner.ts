/**
 * Page copy for /partner/. Facts come from `site.ts`, `vehicles.ts` and BRIEF.md.
 */
import { curatedVehicles } from "./vehicles";

export const financePoints = [
  {
    title: "Leasing",
    text: "Monatliche Raten statt des vollen Kaufpreises – über Alphera Financial Services, den Finanzdienstleister der BMW Group.",
  },
  {
    title: "Finanzierung",
    text: "Sie möchten das Fahrzeug besitzen und den Kauf trotzdem aufteilen? Auch dafür stellen wir Ihnen eine passende Lösung zusammen.",
  },
  {
    title: "Eintausch",
    text: "Ihr bisheriges Fahrzeug nehmen wir gerne in Zahlung – und rechnen es direkt in Ihre Offerte ein.",
  },
];

/** Real listings with a published leasing rate (vehicles.ts, `curated: true`), cheapest first. */
export const leasingExamples = curatedVehicles
  .filter((v): v is typeof v & { leasingFromChf: number; priceChf: number } => v.leasingFromChf !== null && v.priceChf !== null)
  .sort((a, b) => a.leasingFromChf - b.leasingFromChf);

/** Mandatory notice for consumer-credit advertising in Switzerland (Art. 3 Abs. 1 lit. n UWG). */
export const creditNotice = "Die Kreditvergabe ist verboten, falls sie zur Überschuldung der Konsumentin oder des Konsumenten führt.";

/** Intrinsic sizes of the (small) partner logos in /public/images/partners — for width/height attributes. */
export const partnerLogoSizes: Record<string, { width: number; height: number }> = {
  "/images/partners/1-mercedes-benz-automobile-ag.jpg": { width: 262, height: 185 },
  "/images/partners/2-alphera-financial-services.jpg": { width: 316, height: 233 },
  "/images/partners/3-seesicht-media-ag.jpg": { width: 316, height: 233 },
  "/images/partners/6-the-re-max-collection.png": { width: 316, height: 233 },
};
