import type { Metadata } from "next";
import { BrandMarquee } from "@/components/motion/BrandMarquee";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { Hero } from "@/components/sections/Hero";
import { ImportGlobe } from "@/components/sections/ImportGlobe";
import { QualityPromise } from "@/components/sections/QualityPromise";
import { RatingBand } from "@/components/sections/RatingBand";
import { Services } from "@/components/sections/Services";
import { ShowroomGallery } from "@/components/sections/ShowroomGallery";
import { VehicleHighlights } from "@/components/sections/VehicleHighlights";
import { VisitBand } from "@/components/sections/VisitBand";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandMarquee />
      <VehicleHighlights />
      <QualityPromise />
      <Services />
      <ImportGlobe />
      <AboutTeaser />
      <ShowroomGallery />
      <RatingBand />
      <VisitBand />
    </>
  );
}
