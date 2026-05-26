"use client";

import Image from "next/image";
import { FiTrendingUp, FiMapPin, FiAward, FiDollarSign, FiInfo, FiStar } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

interface ComparisonTableProps {
  colleges: ComparedCollege[];
}

// Map slug to image filename
const getCollegeImage = (name: string): string => {
  const slug = name.toLowerCase()
    .replace(/indian institute of technology\s*/i, "iit-")
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "");
  
  const imageMap: Record<string, string> = {
    "iit-bombay": "/iitBombay.jpg",
    "iit-delhi": "/iitDelhi.jpg",
    "iit-madras": "/iitMadras.jpg",
    "iit-kanpur": "/iitKanpur.jpg",
    "iit-kharagpur": "/iitKharagpur.JPG",
    "iit-roorkee": "/iitRoorkee.jpg",
    "iit-bhu-varanasi": "/iitBHU.jpg",
    "iit-gandhinagar": "/iitGandhinagar.jpg",
    "iit-bhubaneswar": "/iitBhubaneswar.jpg",
    "iit-dhanbad": "/iitDhanbad.jpg",
    "iit-dharwad": "/iitDharwad.jpg",
    "iit-bhilai": "/iitBhilai.jpg",
  };
  
  return imageMap[slug] || "/bg.png";
};

function fmt(val: number | null | undefined, prefix = "₹") {
  if (!val) return "N/A";
  if (val >= 100000) return `${prefix}${(val / 100000).toFixed(1)} LPA`;
  return `${prefix}${val.toLocaleString("en-IN")}`;
}

function pct(val: number | null | undefined) {
  if (!val) return "N/A";
  return `${val.toFixed(1)}%`;
}

type MetricRow = {
  label: string;
  icon: React.ReactNode;
  getValue: (c: ComparedCollege) => string | number | null;
  higherIsBetter?: boolean;
  lowerIsBetter?: boolean;
  tooltip?: string;
  renderValue?: (c: ComparedCollege) => React.ReactNode;
};

const metrics: MetricRow[] = [
  {
    label: "Location",
    icon: <FiMapPin className="h-4 w-4" />,
    getValue: (c) => `${c.city}, ${c.state}`,
  },
  {
    label: "NIRF Ranking",
    icon: <FiAward className="h-4 w-4" />,
    getValue: (c) => c.nirfRanking,
    lowerIsBetter: true,
  },
  {
    label: "Rating",
    icon: <FiStar className="h-4 w-4" />,
    getValue: (c) => c.rating,
    higherIsBetter: true,
    tooltip: "Overall rating based on student reviews and feedback",
    renderValue: (c) => {
      if (!c.rating) return "N/A";
      const fullStars = Math.floor(c.rating);
      const hasHalfStar = c.rating % 1 >= 0.5;
      return (
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={cn(
                  "h-3.5 w-3.5",
                  i < fullStars
                    ? "fill-yellow-400 text-yellow-400"
                    : i === fullStars && hasHalfStar
                    ? "fill-yellow-400/50 text-yellow-400"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({c.rating.toFixed(1)})</span>
        </div>
      );
    },
  },
  {
    label: "Fees (Min)",
    icon: <FiDollarSign className="h-4 w-4" />,
    getValue: (c) => c.feesMin || 100000,
    lowerIsBetter: true,
    tooltip: "Minimum annual tuition fees for B.Tech programs",
    renderValue: (c) => c.feesMin ? fmt(c.feesMin) : "₹1.0 LPA",
  },
  {
    label: "Fees (Max)",
    icon: <FiDollarSign className="h-4 w-4" />,
    getValue: (c) => c.feesMax || 150000,
    lowerIsBetter: true,
    tooltip: "Maximum annual tuition fees for B.Tech programs",
    renderValue: (c) => c.feesMax ? fmt(c.feesMax) : "₹1.5 LPA",
  },
  {
    label: "Avg Package",
    icon: <FiTrendingUp className="h-4 w-4" />,
    getValue: (c) => c.avgPackage,
    higherIsBetter: true,
    tooltip: "Average salary package offered during campus placements",
    renderValue: (c) => fmt(c.avgPackage),
  },
  {
    label: "Highest Package",
    icon: <FiTrendingUp className="h-4 w-4" />,
    getValue: (c) => c.highestPackage,
    higherIsBetter: true,
    tooltip: "Highest salary package offered during campus placements",
    renderValue: (c) => fmt(c.highestPackage),
  },
  {
    label: "Median Package",
    icon: <FiTrendingUp className="h-4 w-4" />,
    getValue: (c) => c.medianPackage,
    higherIsBetter: true,
    tooltip: "The middle value of all salaries, offering a more realistic picture than the average",
    renderValue: (c) => fmt(c.medianPackage),
  },
  {
    label: "Placement Rate",
    icon: <FiTrendingUp className="h-4 w-4" />,
    getValue: (c) => c.placementRate,
    higherIsBetter: true,
    tooltip: "Percentage of students who secured job offers during campus placements",
    renderValue: (c) => pct(c.placementRate),
  },
];

function getBestIndex(colleges: ComparedCollege[], metric: MetricRow): number | null {
  const raw = colleges.map((c) => metric.getValue(c));
  const nums = raw.map((v) => (typeof v === "number" ? v : null));
  if (nums.every((n) => n === null)) return null;

  let bestIdx = -1;
  let bestVal = metric.higherIsBetter ? -Infinity : Infinity;
  nums.forEach((n, i) => {
    if (n === null) return;
    if (metric.higherIsBetter && n > bestVal) { bestVal = n; bestIdx = i; }
    if (metric.lowerIsBetter && n < bestVal) { bestVal = n; bestIdx = i; }
  });
  return bestIdx >= 0 ? bestIdx : null;
}

export function ComparisonTable({ colleges }: ComparisonTableProps) {
  if (colleges.length === 0) return null;

  return (
    <TooltipProvider>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b bg-muted/50 backdrop-blur-sm">
              <th className="sticky left-0 bg-muted/50 backdrop-blur-sm p-4 text-left font-semibold text-muted-foreground w-36 md:w-44">
                Metric
              </th>
              {colleges.map((c) => (
                <th key={c.id} className="p-4 text-left font-semibold min-w-[200px]">
                  <div className="flex flex-col gap-2">
                    <div className="relative h-20 w-full rounded-lg overflow-hidden">
                      <Image
                        src={getCollegeImage(c.name)}
                        alt={c.name}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">{c.type}</span>
                    </div>
                    <span className="block text-base font-bold leading-tight">{c.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        <tbody>
          {metrics.map((metric, rowIdx) => {
            const bestIdx = getBestIndex(colleges, metric);
            return (
              <tr
                key={metric.label}
                className={cn("border-b last:border-0 transition-colors hover:bg-muted/30", rowIdx % 2 === 0 ? "" : "bg-muted/10")}
              >
                <td className="sticky left-0 bg-background p-4 font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground/60">{metric.icon}</span>
                    <span>{metric.label}</span>
                    {metric.tooltip && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                            <FiInfo className="h-3.5 w-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{metric.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </td>
                {colleges.map((c, colIdx) => {
                  const isBest = bestIdx === colIdx && (metric.higherIsBetter || metric.lowerIsBetter);
                  const displayValue = metric.renderValue ? metric.renderValue(c) : String(metric.getValue(c));
                  
                  return (
                    <td
                      key={c.id}
                      className={cn(
                        "p-4 font-medium",
                        isBest && "text-green-600 dark:text-green-400 font-semibold"
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        {displayValue}
                        {isBest && (
                          <span className="rounded-full bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 text-[10px] font-bold text-green-700 dark:text-green-400">
                            BEST
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </TooltipProvider>
  );
}
