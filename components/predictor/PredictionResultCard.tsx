import Link from "next/link";
import { FiMapPin, FiTrendingUp, FiAward } from "react-icons/fi";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

interface PredictionResultCardProps {
  result: PredictionResult;
  userRank: number;
}

export function PredictionResultCard({ result, userRank }: PredictionResultCardProps) {
  const { college, branchName, degree, openingRank, closingRank, category } = result;
  
  // Calculate chance percentage based on rank position
  const rankRange = closingRank - openingRank;
  const userPosition = closingRank - userRank;
  const chancePercent = Math.min(100, Math.max(0, (userPosition / rankRange) * 100));
  
  let chanceLabel = "Low";
  let chanceBadgeClass = "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400";
  
  if (chancePercent >= 70) {
    chanceLabel = "High";
    chanceBadgeClass = "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400";
  } else if (chancePercent >= 40) {
    chanceLabel = "Moderate";
    chanceBadgeClass = "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400";
  }
  
  // Format average package to LPA (Lakhs Per Annum)
  const formatPackage = (amount: number | null) => {
    if (!amount) return null;
    const lpa = amount / 100000;
    return `₹${lpa.toFixed(1)} LPA`;
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md hover:border-border/80">
      <CardHeader className="p-4 pb-3 border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base line-clamp-1" title={college.name}>
              <Link href={`/colleges/${college.slug}`} className="hover:underline">
                {college.name}
              </Link>
            </h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <FiMapPin className="mr-1 h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{college.city}, {college.state}</span>
            </div>
          </div>
          <div className="flex flex-col items-end flex-shrink-0">
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${chanceBadgeClass}`}>
              {chanceLabel}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <div className="font-medium text-sm mb-1">{degree} - {branchName}</div>
          <div className="text-xs text-muted-foreground">Category: {category}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Opening Rank</span>
            <span className="font-medium">{openingRank.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Closing Rank</span>
            <span className="font-medium">{closingRank.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t">
          {college.nirfRanking && (
            <div className="flex items-center gap-1.5">
              <FiAward className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-muted-foreground">NIRF Rank</span>
                <span className="font-medium">#{college.nirfRanking}</span>
              </div>
            </div>
          )}
          {college.avgPackage && (
            <div className="flex items-center gap-1.5">
              <FiTrendingUp className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-muted-foreground">Avg Package</span>
                <span className="font-medium">{formatPackage(college.avgPackage)}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="pt-2">
          <Button variant="outline" size="sm" className="w-full">
            <Link href={`/colleges/${college.slug}`}>
              View College Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
