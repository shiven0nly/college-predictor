import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma, CourseCategory } from "@/app/generated/prisma/client";

// Map frontend category values to database enum values
const categoryMap: Record<string, CourseCategory> = {
  "OPEN": CourseCategory.GENERAL,
  "GENERAL": CourseCategory.GENERAL,
  "OBC-NCL": CourseCategory.OBC_NCL,
  "OBC_NCL": CourseCategory.OBC_NCL,
  "SC": CourseCategory.SC,
  "ST": CourseCategory.ST,
  "EWS": CourseCategory.EWS,
  "DEFENCE": CourseCategory.DEFENCE,
  "TFWS": CourseCategory.TFWS,
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const rank = parseInt(searchParams.get("rank") || "0", 10);
  const categoryParam = searchParams.get("category") || "GENERAL";
  const branch = searchParams.get("branch") || "";

  if (!rank || rank <= 0) {
    return NextResponse.json({ error: "A valid rank is required" }, { status: 400 });
  }

  try {
    // Map the category to the correct enum value
    const category = categoryMap[categoryParam] || CourseCategory.GENERAL;

    const where: Prisma.CourseWhereInput = {
      isActive: true,
      closingRank: { gte: rank },
      category: category,
    };

    if (branch) {
      // @ts-ignore - branch filtering if needed
      where.branch = branch;
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: [{ closingRank: "asc" }],
      take: 50,
      select: {
        id: true,
        branch: true,
        branchName: true,
        category: true,
        degree: true,
        openingRank: true,
        closingRank: true,
        totalSeats: true,
        tuitionFee: true,
        college: {
          select: {
            id: true,
            slug: true,
            name: true,
            type: true,
            city: true,
            state: true,
            nirfRanking: true,
            rating: true,
            avgPackage: true,
          },
        },
      },
    });

    return NextResponse.json({ data: courses, meta: { rank, category: categoryParam, branch, total: courses.length } });
  } catch (error) {
    console.error("API /predict error:", error);
    return NextResponse.json({ 
      error: "Failed to run prediction", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
