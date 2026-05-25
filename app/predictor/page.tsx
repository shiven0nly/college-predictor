"use client";

import { PredictorForm } from "@/components/predictor/PredictorForm";
import { FiTarget } from "react-icons/fi";

export default function PredictorPage() {
  return (
    <div className="min-h-screen">
      {/* Page header */}
      <section className="border-b bg-muted/20 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FiTarget className="h-4 w-4" />
              College Predictor
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Predict Your College
            </h1>
            <p className="mt-3 text-muted-foreground">
              Enter your JEE Advanced rank and category to discover which IITs you can get into.
            </p>
          </div>
        </div>
      </section>

      {/* Form section */}
      <section className="container mx-auto px-4 py-12 md:px-8">
        <PredictorForm />
      </section>
    </div>
  );
}
