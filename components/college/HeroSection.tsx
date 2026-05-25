"use client";

import Link from "next/link";
import { FiMapPin, FiAward, FiCalendar, FiTarget } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/ui/SaveButton";

interface College {
  id: string;
  name: string;
  slug: string;
  type: string;
  city: string;
  state: string;
  established: number | null;
  nirfRanking: number | null;
  rating: number;
  bannerUrl: string | null;
}

interface HeroSectionProps {
  college: College;
  initialSaved?: boolean;
}

export function HeroSection({ college, initialSaved = false }: HeroSectionProps) {
  const location = `${college.city}, ${college.state}`;
  
  return (
    <section className="relative w-full border-b bg-muted/20">
      {college.bannerUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${college.bannerUrl})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-background/5 to-background/80" />
      <div className="container relative mx-auto px-4 py-16 md:px-8 lg:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center rounded-full border bg-background px-2.5 py-0.5 text-xs font-semibold text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              {college.type}
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {college.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground md:text-base">
              <div className="flex items-center">
                <FiMapPin className="mr-1.5 h-4 w-4" />
                {location}
              </div>
              {college.established && (
                <div className="flex items-center">
                  <FiCalendar className="mr-1.5 h-4 w-4" />
                  Est. {college.established}
                </div>
              )}
              {college.nirfRanking && (
                <div className="flex items-center text-primary font-medium">
                  <FiAward className="mr-1.5 h-4 w-4" />
                  NIRF Rank #{college.nirfRanking}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
            <Button size="lg" className="w-full sm:w-auto md:w-full gap-2" asChild>
              <Link href="/predictor">
                <FiTarget className="h-4 w-4" />
                Predict Chances
              </Link>
            </Button>
            <SaveButton 
              collegeId={college.id}
              initialSaved={initialSaved}
              size="lg"
              className="w-full sm:w-auto md:w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
