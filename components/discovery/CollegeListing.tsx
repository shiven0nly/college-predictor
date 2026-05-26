"use client";

import React, { useState, useEffect, useCallback } from "react"
import { SearchInput } from "./SearchInput"
import { FilterSidebar } from "./FilterSidebar"
import { CollegeCard } from "./CollegeCard"
import { EmptyState } from "./EmptyState"
import { Pagination } from "@/components/ui/Pagination"
import { Skeleton } from "@/components/ui/skeleton"

interface College {
  id: string
  slug: string
  name: string
  location: string
  nirfRanking: number | null
  established: number
  imageUrl?: string
  type: string
}

export function CollegeListing() {
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // Filters
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedRanking, setSelectedRanking] = useState<string>("all")

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset page on new search
    }, 400)
    return () => clearTimeout(handler)
  }, [search])

  const fetchColleges = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
      })

      if (debouncedSearch) params.append("search", debouncedSearch)
      if (selectedRanking !== "all") params.append("nirfRanking", selectedRanking)
      selectedTypes.forEach(t => params.append("type", t))

      const res = await fetch(`/api/colleges?${params.toString()}`)
      const json = await res.json()

      if (json.data) {
        setColleges(json.data)
        setTotalPages(json.meta.totalPages)
        setTotalItems(json.meta.total)
      }
    } catch (error) {
      console.error("Failed to fetch colleges:", error)
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, selectedTypes, selectedRanking])

  useEffect(() => {
    fetchColleges()
  }, [fetchColleges])

  const handleTypeChange = (type: string, checked: boolean) => {
    setSelectedTypes(prev => 
      checked ? [...prev, type] : prev.filter(t => t !== type)
    )
    setPage(1)
  }

  const handleRankingChange = (ranking: string) => {
    setSelectedRanking(ranking)
    setPage(1)
  }

  const handleReset = () => {
    setSelectedTypes([])
    setSelectedRanking("all")
    setSearch("")
    setPage(1)
  }

  return (
    <div className="flex flex-1 flex-col pb-16">
      {/* Hero Section */}
      <section className="relative border-b bg-muted/20 py-12 md:py-16 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: 'url(/bg.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/95" />
        
        <div className="container relative mx-auto px-4 md:px-8">
          <div className="mx-auto flex max-w-[800px] flex-col items-center text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Find Your Dream College
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Discover, compare, and predict your chances for the premier engineering institutes of India.
            </p>
            <SearchInput value={search} onChange={setSearch} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto flex flex-1 flex-col gap-8 px-4 pt-8 md:px-8 md:flex-row lg:gap-12">
        <FilterSidebar 
          selectedTypes={selectedTypes}
          onTypeChange={handleTypeChange}
          selectedRanking={selectedRanking}
          onRankingChange={handleRankingChange}
          onReset={handleReset}
        />
        
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Institutes</h2>
            <div className="text-sm text-muted-foreground">
              {loading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                `Showing ${totalItems} results`
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[125px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : colleges.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {colleges.map((college) => (
                  <CollegeCard 
                    key={college.id}
                    id={college.id}
                    slug={college.slug}
                    name={college.name}
                    location={college.location}
                    nirfRank={college.nirfRanking || 999}
                    established={college.established}
                  />
                ))}
              </div>
              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
              />
            </>
          ) : (
            <EmptyState onClearFilters={handleReset} />
          )}
        </main>
      </section>
    </div>
  )
}
