"use client";

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "placements", label: "Placements" },
  { id: "courses", label: "Courses" },
  { id: "fees", label: "Fees" },
  { id: "reviews", label: "Reviews" },
]

export function StickyTabs() {
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = tabs.map(tab => document.getElementById(tab.id))
      
      let currentActiveId = "overview"
      
      for (const el of sectionElements) {
        if (!el) continue
        const rect = el.getBoundingClientRect()
        // If the top of the section is near the top of the viewport (offset by header height)
        if (rect.top <= 140) {
          currentActiveId = el.id
        }
      }
      
      setActiveTab(currentActiveId)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const yOffset = -100 // offset for fixed header + sticky tabs
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <div className="sticky top-14 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollTo(tab.id)}
              className={cn(
                "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors hover:text-foreground",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
