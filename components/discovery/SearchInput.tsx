"use client";

import { FiSearch } from "react-icons/fi"
import { Input } from "@/components/ui/input"

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative w-full max-w-2xl">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <FiSearch className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search IITs by name, location..."
        className="h-12 w-full rounded-full bg-muted/50 pl-10 pr-4 text-base border border-white/20 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary/50 transition-all md:text-sm"
      />
    </div>
  )
}
