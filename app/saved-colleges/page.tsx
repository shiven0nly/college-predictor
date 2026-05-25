"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiBookmark, FiMapPin, FiBarChart2, FiTrendingUp, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SavedCollege {
  id: string;
  createdAt: string;
  college: {
    id: string;
    slug: string;
    name: string;
    type: string;
    city: string;
    state: string;
    nirfRanking: number | null;
    established: number | null;
    rating: number;
    avgPackage: number | null;
    highestPackage: number | null;
    placementRate: number | null;
    imageUrl: string | null;
  };
}

export default function SavedCollegesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/saved-colleges");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchSavedColleges();
    }
  }, [status]);

  const fetchSavedColleges = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/saved-colleges");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch saved colleges");
      }

      setSavedColleges(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (collegeId: string) => {
    setRemovingId(collegeId);

    try {
      const res = await fetch(`/api/saved-colleges/${collegeId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to remove college");
      }

      setSavedColleges((prev) => prev.filter((sc) => sc.college.id !== collegeId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove college");
    } finally {
      setRemovingId(null);
    }
  };

  const getCollegeImage = (slug: string): string => {
    const imageMap: Record<string, string> = {
      "iit-bombay": "/iitBombay.jpg",
      "iit-delhi": "/iitDelhi.jpg",
      "iit-madras": "/iitMadras.jpg",
      "iit-kanpur": "/iitKanpur.jpg",
      "iit-kharagpur": "/iitKharagpur.JPG",
      "iit-roorkee": "/iitRoorkee.jpg",
      "iit-bhu": "/iitBHU.jpg",
      "iit-gandhinagar": "/iitGandhinagar.jpg",
      "iit-bhubaneswar": "/iitBhubaneswar.jpg",
      "iit-dhanbad": "/iitDhanbad.jpg",
      "iit-dharwad": "/iitDharwad.jpg",
      "iit-bhilai": "/iitBhilai.jpg",
    };
    return imageMap[slug] || "/bg.png";
  };

  if (status === "loading" || (status === "unauthenticated" && !error)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b bg-muted/20 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FiBookmark className="h-4 w-4" />
              Your Collection
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Saved Colleges
            </h1>
            <p className="mt-3 text-muted-foreground">
              Colleges you've bookmarked for future reference
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-8 md:px-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchSavedColleges} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : savedColleges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FiBookmark className="mb-4 h-16 w-16 text-muted-foreground/40" />
            <h2 className="text-2xl font-semibold">No saved colleges yet</h2>
            <p className="mt-2 text-muted-foreground max-w-md">
              Start exploring and save colleges you're interested in to keep track of them here.
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Explore Colleges</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {savedColleges.length} {savedColleges.length === 1 ? "College" : "Colleges"}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {savedColleges.map((saved) => (
                <Card key={saved.id} className="group overflow-hidden transition-all hover:shadow-md">
                  <div className="relative h-32 w-full bg-muted overflow-hidden">
                    <Image
                      src={getCollegeImage(saved.college.slug)}
                      alt={saved.college.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={() => handleRemove(saved.college.id)}
                      disabled={removingId === saved.college.id}
                    >
                      <FiX className="h-4 w-4" />
                    </Button>
                  </div>

                  <CardHeader className="p-4 pb-2">
                    <h3 className="font-semibold text-lg line-clamp-1" title={saved.college.name}>
                      <Link href={`/colleges/${saved.college.slug}`} className="hover:underline">
                        {saved.college.name}
                      </Link>
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <FiMapPin className="mr-1 h-3.5 w-3.5" />
                      {saved.college.city}, {saved.college.state}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-2">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {saved.college.nirfRanking && (
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">NIRF Rank</span>
                          <span className="font-medium flex items-center">
                            <FiBarChart2 className="mr-1 h-3.5 w-3.5 text-primary" />
                            #{saved.college.nirfRanking}
                          </span>
                        </div>
                      )}
                      {saved.college.avgPackage && (
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Avg Package</span>
                          <span className="font-medium flex items-center">
                            <FiTrendingUp className="mr-1 h-3.5 w-3.5 text-primary" />
                            ₹{(saved.college.avgPackage / 100000).toFixed(1)}L
                          </span>
                        </div>
                      )}
                    </div>

                    <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                      <Link href={`/colleges/${saved.college.slug}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
