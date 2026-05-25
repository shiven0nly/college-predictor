import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SavedCollegesService } from "@/lib/services/saved-colleges.service";
import { HeroSection } from "@/components/college/HeroSection";
import { OverviewSection } from "@/components/college/OverviewSection";
import { StickyTabs } from "@/components/college/StickyTabs";
import { ReviewsSection } from "@/components/college/ReviewsSection";

async function getCollege(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/colleges/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return null;
  }

  const json = await res.json();
  return json.data;
}

export default async function CollegePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const college = await getCollege(slug);

  if (!college) {
    notFound();
  }

  // Check if college is saved by current user
  const session = await getServerSession(authOptions);
  let isSaved = false;
  
  if (session?.user?.id) {
    try {
      isSaved = await SavedCollegesService.isCollegeSaved(session.user.id, college.id);
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  }

  return (
    <div className="min-h-screen">
      <HeroSection college={college} initialSaved={isSaved} />
      <StickyTabs />
      <div className="container mx-auto px-4 md:px-8 py-8 space-y-12">
        <OverviewSection college={college} />
        <ReviewsSection 
          reviews={college.reviews || []} 
          averageRating={college.rating || 0}
          totalReviews={college.totalReviews || 0}
        />
      </div>
    </div>
  );
}
