"use client";

import { FiTrendingUp, FiMapPin, FiAward, FiDollarSign } from "react-icons/fi";
import { cn } from "@/lib/utils";

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

function fmt(val: number | null | undefined, prefix = "₹") {
  if (!val) return "—";
  if (val >= 100000) return `${prefix}${(val / 100000).toFixed(1)}L`;
  return `${prefix}${val.toLocaleString("en-IN")}`;
}

function pct(val: number | null | undefined) {
  if (!val) return "—";
  return `${val.toFixed(1)}%`;
}

type MetricRow = {
  label: string;
  icon: React.ReactNode;
  getValue: (c: ComparedCollege) => string | number | null;
  higherIsBetter?: boolean;
  lowerIsBetter?: boolean;
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
    icon: <FiTrendingUp className="h-4 w-4" />,
    getValue: (c) => c.rating ? `${c.rating.toFixed(1)} / 5` : "—",
    higherIsBetter: true,
  },
  {
    label: "Fees (Min)",
    icon: <FiDollarSign className="h-4 w-4" />,
    getValue: (c) => fmt(c.feesMin),
    lowerIsBetter: true,
  },
  {
    label: "Fees (Max)",
    icon: <FiDollarSign className="h-4 w-4" />,
    getValue: (c) => fmt(c.feesMax),
    lowerIsBetter: true,
  },
  {
    label: "Avg Package",
    icon: <FiTrendingUp className="h-4 w-4" />,
    getValue: (c) => fmt(c.avgPackage),
    higherIsBetter: true,
  },
  {
    label: "Highest Package",
    icon: <FiTrendingUp className="h-4 w-4" />,
    getValue: (c) => fmt(c.highestPackage),
    higherIsBetter: true,
  },
  {
    label: "Median Package",
    icon: <FiTrendingUp className="h-4 w-4" />,
    getValue: (c) => fmt(c.medianPackage),
    higherIsBetter: true,
  },
  {
    label: "Placement Rate",
    icon: <FiTrendingUp className="h-4 w-4" />,
    getValue: (c) => pct(c.placementRate),
    higherIsBetter: true,
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
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="sticky left-0 bg-muted/50 p-4 text-left font-semibold text-muted-foreground w-36 md:w-44">
              Metric
            </th>
            {colleges.map((c) => (
              <th key={c.id} className="p-4 text-left font-semibold min-w-[160px]">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">{c.type}</span>
                </div>
                <span className="mt-1 block text-base font-bold leading-tight">{c.name}</span>
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
                    {metric.label}
                  </div>
                </td>
                {colleges.map((c, colIdx) => {
                  const val = metric.getValue(c);
                  const isBest = bestIdx === colIdx && (metric.higherIsBetter || metric.lowerIsBetter);
                  return (
                    <td
                      key={c.id}
                      className={cn(
                        "p-4 font-medium",
                        isBest && "text-emerald-600 dark:text-emerald-400 font-semibold"
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        {String(val)}
                        {isBest && (
                          <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
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
  );
}
