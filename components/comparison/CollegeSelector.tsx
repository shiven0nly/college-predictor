"use client";

import { useState, useEffect, useCallback } from "react";
import { FiSearch, FiX, FiPlus } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CollegeOption {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  type: string;
}

interface CollegeSelectorProps {
  selected: CollegeOption[];
  onAdd: (college: CollegeOption) => void;
  onRemove: (id: string) => void;
  maxCount?: number;
}

export function CollegeSelector({ selected, onAdd, onRemove, maxCount = 3 }: CollegeSelectorProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CollegeOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/colleges?search=${encodeURIComponent(q)}&limit=8`);
      const json = await res.json();
      const alreadySelected = new Set(selected.map((c) => c.id));
      setResults((json.data || []).filter((c: CollegeOption) => !alreadySelected.has(c.id)));
    } finally {
      setLoading(false);
    }
  }, [selected]);

  useEffect(() => {
    const t = setTimeout(() => search(query), 300);
    return () => clearTimeout(t);
  }, [query, search]);

  return (
    <div className="space-y-3">
      {/* Selected chips */}
      <div className="flex flex-wrap gap-2">
        {selected.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-1.5 rounded-full border bg-muted px-3 py-1 text-sm font-medium"
          >
            <span className="max-w-[160px] truncate">{c.name}</span>
            <button
              onClick={() => onRemove(c.id)}
              className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
              aria-label={`Remove ${c.name}`}
            >
              <FiX className="h-3 w-3" />
            </button>
          </div>
        ))}
        {selected.length < maxCount && (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1 text-sm text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors"
          >
            <FiPlus className="h-3.5 w-3.5" />
            Add College
          </button>
        )}
      </div>

      {/* Dropdown search */}
      {open && (
        <div className="relative">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search colleges..."
              className="pl-9"
            />
          </div>
          {(results.length > 0 || loading) && (
            <div className="absolute top-full mt-1.5 w-full z-50 rounded-lg border bg-background shadow-lg overflow-hidden">
              {loading && (
                <div className="px-4 py-3 text-sm text-muted-foreground">Searching…</div>
              )}
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    onAdd(r);
                    setQuery("");
                    setResults([]);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors"
                >
                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold">{r.type}</span>
                  <span className="font-medium">{r.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{r.city}, {r.state}</span>
                </button>
              ))}
            </div>
          )}
          {!loading && query && results.length === 0 && (
            <div className="absolute top-full mt-1.5 w-full z-50 rounded-lg border bg-background px-4 py-3 shadow-lg text-sm text-muted-foreground">
              No colleges found for "{query}"
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 text-xs text-muted-foreground"
            onClick={() => { setOpen(false); setQuery(""); setResults([]); }}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
