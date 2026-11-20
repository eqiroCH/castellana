import type { MediaSlug } from "./media";
import { site } from "./site";

/**
 * Curated vehicle highlights for the home page (and optionally /fahrzeuge).
 *
 * - `curated: true`  → real listings from AutoScout24 (as of 19.11.2026). Update by hand.
 * - `example: true`  → typical models for this dealer, NOT a specific listing.
 *   Never give examples a price, year or mileage.
 * - `image` photos are Unsplash stand-ins, so `imageIsSymbolic` must stay true until
 *   real photos of the actual car are available.
 */
export type Vehicle = {
  id: string;
  make: string;
  model: string;
  /** «07.2017» – first registration */
  firstRegistration: string | null;
  mileageKm: number | null;
  powerPs: number | null;
  priceChf: number | null;
  leasingFromChf: number | null;
  image: MediaSlug;
  imageIsSymbolic: boolean;
  url: string;
  curated: boolean;
  example: boolean;
};

export const vehicles: Vehicle[] = [
  {
    id: "ferrari-california-t",
    make: "Ferrari",
    model: "California T 3.9 V8",
    firstRegistration: "07.2016",
    mileageKm: 13000,
    powerPs: 560,
    priceChf: 124900,
    leasingFromChf: 1400,
    image: "vehicle-ferrari-california-t",
    imageIsSymbolic: true,
    url: site.links.autoscout,
    curated: true,
    example: false,
  },
  {
    id: "porsche-cayenne-s-coupe-e-hybrid",
    make: "Porsche",
    model: "Cayenne S Coupé E-Hybrid",
    firstRegistration: "03.2025",
    mileageKm: 13500,
    powerPs: 519,
    priceChf: 119900,
    leasingFromChf: 1500,
    image: "vehicle-porsche-cayenne-coupe",
    imageIsSymbolic: true,
    url: site.links.autoscout,
    curated: true,
    example: false,
  },
  {
    id: "mercedes-c63-s-amg",
    make: "Mercedes-Benz",
    model: "C 63 S AMG",
    firstRegistration: "07.2017",
    mileageKm: 57500,
    powerPs: 510,
    priceChf: 43900,
    leasingFromChf: 549,
    image: "vehicle-mercedes-c63",
    imageIsSymbolic: true,
    url: site.links.autoscout,
    curated: true,
    example: false,
  },
  {
    id: "example-porsche-911-gt3",
    make: "Porsche",
    model: "911 GT3",
    firstRegistration: null,
    mileageKm: null,
    powerPs: null,
    priceChf: null,
    leasingFromChf: null,
    image: "vehicle-porsche-911-gt3",
    imageIsSymbolic: true,
    url: site.links.autoscout,
    curated: false,
    example: true,
  },
  {
    id: "example-lamborghini-urus",
    make: "Lamborghini",
    model: "Urus",
    firstRegistration: null,
    mileageKm: null,
    powerPs: null,
    priceChf: null,
    leasingFromChf: null,
    image: "vehicle-lamborghini-urus",
    imageIsSymbolic: true,
    url: site.links.autoscout,
    curated: false,
    example: true,
  },
  {
    id: "example-mercedes-amg-g63",
    make: "Mercedes-AMG",
    model: "G 63",
    firstRegistration: null,
    mileageKm: null,
    powerPs: null,
    priceChf: null,
    leasingFromChf: null,
    image: "vehicle-mercedes-g63",
    imageIsSymbolic: true,
    url: site.links.autoscout,
    curated: false,
    example: true,
  },
];

export const curatedVehicles = vehicles.filter((v) => v.curated);
export const exampleVehicles = vehicles.filter((v) => v.example);
