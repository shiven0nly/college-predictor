"use client";

import Link from "next/link"
import Image from "next/image"
import { FiMapPin, FiBarChart2 } from "react-icons/fi"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SaveButton } from "@/components/ui/SaveButton"

export interface CollegeCardProps {
  id: string
  name: string
  slug: string
  location: string
  nirfRank: number
  established: number
  imageUrl?: string
  initialSaved?: boolean
}

// Map slug to image filename - hardcoded based on available images
const getCollegeImage = (slug: string): string => {
  // Exact mapping based on seed.ts slugs and available images
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

export function CollegeCard({
  id,
  name,
  slug,
  location,
  nirfRank,
  established,
  initialSaved = false,
}: CollegeCardProps) {
  const imageUrl = getCollegeImage(slug);
  
  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:shadow-md hover:border-border/80">
      <div className="relative h-32 w-full bg-muted overflow-hidden">
        <Image 
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        <div className="absolute top-2 right-2">
          <SaveButton 
            collegeId={id}
            initialSaved={initialSaved}
            variant="icon"
            className="bg-background/40 backdrop-blur-md hover:bg-background/60 transition-all"
            style={{ backdropFilter: 'blur(4px)' }}
          />
        </div>
      </div>
      <CardHeader className="p-4 pb-2">
        <h3 className="font-semibold text-lg line-clamp-2 leading-tight" title={name}>
          <Link href={`/colleges/${slug}`} className="hover:underline">
            {name}
          </Link>
        </h3>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <FiMapPin className="mr-1 h-3.5 w-3.5" />
          {location}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-1">
        <div className="flex items-center space-x-4 text-sm mt-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">NIRF Rank</span>
            <span className="font-medium flex items-center">
              <FiBarChart2 className="mr-1 h-3.5 w-3.5 text-primary" />
              #{nirfRank}
            </span>
          </div>
          <div className="flex flex-col border-l pl-4">
            <span className="text-xs text-muted-foreground">Established</span>
            <span className="font-medium">{established}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t mt-auto flex gap-2">
        <Button variant="default" className="w-1/2 text-xs" size="sm" asChild>
          <Link href={`/colleges/${slug}`}>
            View Details
          </Link>
        </Button>
        <Button variant="outline" className="w-1/2 text-xs" size="sm" asChild>
          <Link href='/compare'>
            Compare
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
