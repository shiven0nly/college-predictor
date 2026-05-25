import { FiCheckCircle, FiDollarSign, FiTrendingUp, FiUsers, FiGlobe } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface College {
  overview: string | null;
  highlights: string[];
  facilities: string[];
  feesMin: number | null;
  feesMax: number | null;
  avgPackage: number | null;
  highestPackage: number | null;
  medianPackage: number | null;
  placementRate: number | null;
  rating: number;
  totalReviews: number;
  website: string | null;
}

interface OverviewSectionProps {
  college: College;
}

export function OverviewSection({ college }: OverviewSectionProps) {
  return (
    <section id="overview" className="scroll-mt-28 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {college.feesMin && college.feesMax && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FiDollarSign className="h-4 w-4" />
                Annual Fees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{(college.feesMin / 100000).toFixed(1)}L - ₹{(college.feesMax / 100000).toFixed(1)}L
              </div>
            </CardContent>
          </Card>
        )}

        {college.avgPackage && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FiTrendingUp className="h-4 w-4" />
                Avg Package
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{(college.avgPackage / 100000).toFixed(1)}L
              </div>
            </CardContent>
          </Card>
        )}

        {college.highestPackage && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FiTrendingUp className="h-4 w-4" />
                Highest Package
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{(college.highestPackage / 100000).toFixed(1)}L
              </div>
            </CardContent>
          </Card>
        )}

        {college.placementRate && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FiUsers className="h-4 w-4" />
                Placement Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {college.placementRate}%
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Overview Text */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Overview</h2>
        {college.overview ? (
          <p className="text-muted-foreground leading-relaxed">
            {college.overview}
          </p>
        ) : (
          <p className="text-muted-foreground italic">No overview available for this institute.</p>
        )}
        
        {/* Website Link */}
        {college.website && (
          <div className="mt-4 flex items-center gap-2">
            <FiGlobe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Official Website:</span>
            <a 
              href={college.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline font-medium"
            >
              {college.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
      </div>

      {/* Highlights and Facilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {college.highlights.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Key Highlights</h3>
            <ul className="space-y-2">
              {college.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start">
                  <FiCheckCircle className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {college.facilities.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Campus Facilities</h3>
            <ul className="space-y-2">
              {college.facilities.map((facility, idx) => (
                <li key={idx} className="flex items-start">
                  <FiCheckCircle className="mr-2 h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">{facility}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
