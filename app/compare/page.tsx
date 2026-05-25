"use client";

import { useState, useCallback } from "react";
import { CollegeSelector } from "@/components/comparison/CollegeSelector";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";
import { Skeleton } from "@/components/ui/skeleton";
import { FiColumns } from "react-icons/fi";

interface CollegeOption {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  type: string;
}

interface ComparedCollege {
  id: string;
  name: string;
  type: string;
  city: string;
  state: string;
  nirfRanking: number | null;
  established: number | null;
  rating: number;
  totalReviews: number;
  feesMin: number | null;
  feesMax: number | null;
  avgPackage: number | null;
  highestPackage: number | null;
  medianPackage: number | null;
  placementRate: number | null;
}

export default function ComparePage() {
  const [selected, setSelected] = useState<CollegeOption[]>([]);
  const [comparedData, setComparedData] = useState<ComparedCollege[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = useCallback(async (ids: string[]) => {
    if (ids.length < 2) { setComparedData([]); return; }
    setLoading(true);
    setError(null);
    try {
      const params = ids.map((id) => `id=${id}`).join("&");
      const res = await fetch(`/api/compare?${params}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setComparedData(json.data || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAdd = (college: CollegeOption) => {
    const next = [...selected, college];
    setSelected(next);
    fetchComparison(next.map((c) => c.id));
  };

  const handleRemove = (id: string) => {
    const next = selected.filter((c) => c.id !== id);
    setSelected(next);
    fetchComparison(next.map((c) => c.id));
  };

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <section className="border-b bg-muted/20 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FiColumns className="h-4 w-4" />
              Side-by-Side Comparison
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Compare Colleges
            </h1>
            <p className="mt-3 text-muted-foreground">
              Select 2 or 3 colleges to compare fees, placements, rankings, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Selector */}
      <section className="border-b bg-background py-6">
        <div className="container mx-auto px-4 md:px-8">
          <CollegeSelector
            selected={selected}
            onAdd={handleAdd}
            onRemove={handleRemove}
            maxCount={3}
          />
        </div>
      </section>

      {/* Results area */}
      <section className="container mx-auto px-4 py-8 md:px-8">
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30 px-5 py-4 text-sm text-red-700 dark:text-red-400">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        {!loading && !error && comparedData.length >= 2 && (
          <ComparisonTable colleges={comparedData} />
        )}

        {!loading && !error && selected.length < 2 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FiColumns className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <h2 className="text-xl font-semibold">Select colleges to compare</h2>
            <p className="mt-2 text-muted-foreground">
              Search and add 2–3 colleges using the bar above.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
