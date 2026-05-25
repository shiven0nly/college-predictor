"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PredictionResultCard } from "./PredictionResultCard";
import { FiAlertCircle } from "react-icons/fi";

interface PredictionResult {
  id: string;
  branch: string;
  branchName: string;
  category: string;
  degree: string;
  openingRank: number;
  closingRank: number;
  totalSeats: number;
  tuitionFee: number | null;
  college: {
    id: string;
    slug: string;
    name: string;
    type: string;
    city: string;
    state: string;
    nirfRanking: number | null;
    rating: number;
    avgPackage: number | null;
  };
}

export function PredictorForm() {
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("OPEN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const rankNum = parseInt(rank, 10);
    if (!rankNum || rankNum <= 0) {
      setError("Please enter a valid rank");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/predict?rank=${rankNum}&category=${category}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to fetch predictions");
      }

      setResults(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Predict Your College</CardTitle>
          <CardDescription>
            Enter your JEE Advanced rank and category to see your chances.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePredict}>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rank">JEE Advanced Rank</Label>
                <Input
                  id="rank"
                  type="number"
                  placeholder="e.g. 1500"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">General (OPEN)</SelectItem>
                    <SelectItem value="OBC-NCL">OBC-NCL</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="ST">ST</SelectItem>
                    <SelectItem value="EWS">EWS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Predicting..." : "Predict Colleges"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Results Section */}
      {loading && (
        <div className="max-w-5xl mx-auto space-y-4">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30 px-5 py-4 text-sm text-red-700 dark:text-red-400">
            <FiAlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              <span className="font-semibold">Error:</span> {error}
            </div>
          </div>
        </div>
      )}

      {!loading && !error && hasSearched && results.length > 0 && (
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Predicted Colleges ({results.length})
            </h2>
            <div className="text-sm text-muted-foreground">
              For rank: <span className="font-semibold">{rank}</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((result) => (
              <PredictionResultCard
                key={result.id}
                result={result}
                userRank={parseInt(rank, 10)}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && !error && hasSearched && results.length === 0 && (
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FiAlertCircle className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="text-xl font-semibold">No colleges found</h3>
            <p className="mt-2 text-muted-foreground max-w-md">
              No colleges match your rank and category. Try adjusting your search criteria.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
