"use client";
import { Hero } from "@/components/LandingPage/1-Hero";
import { CareerCarousel } from "@/components/LandingPage/2-CareerCarousel";
import { MapPreview } from "@/components/LandingPage/3-MapPreview";
import { HowItWorks } from "@/components/LandingPage/4-HowItWorks";
import { useState } from "react";

export default function HomePage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col gap-18 md:gap-24">
      <Hero search={search} setSearch={setSearch} />
      <CareerCarousel search={search} />
      <MapPreview />
      <HowItWorks />
    </div>
  );
}
