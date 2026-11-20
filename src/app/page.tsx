import type { Metadata } from "next";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { Hero } from "@/components/sections/Hero";
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
      <VehicleHighlights />
      <QualityPromise />
      <Services />
      <AboutTeaser />
      <ShowroomGallery />
      <RatingBand />
      <VisitBand />
    </>
  );
}
