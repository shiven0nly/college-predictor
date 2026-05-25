import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ids = searchParams.getAll("id");

  if (ids.length < 2 || ids.length > 3) {
    return NextResponse.json(
      { error: "Provide 2 or 3 college IDs for comparison" },
      { status: 400 }
    );
  }

  try {
    const colleges = await prisma.college.findMany({
      where: { id: { in: ids }, isActive: true },
      select: {
        id: true,
        slug: true,
        name: true,
        type: true,
        city: true,
        state: true,
        nirfRanking: true,
        established: true,
        rating: true,
        totalReviews: true,
        feesMin: true,
        feesMax: true,
        avgPackage: true,
        highestPackage: true,
        medianPackage: true,
        placementRate: true,
        overview: true,
        highlights: true,
        facilities: true,
        imageUrl: true,
      },
    });

    // Preserve the order as given in query params
    const ordered = ids.map((id) => colleges.find((c) => c.id === id)).filter(Boolean);

    return NextResponse.json({ data: ordered });
  } catch (error) {
    console.error("API /compare error:", error);
    return NextResponse.json({ error: "Failed to fetch comparison data" }, { status: 500 });
  }
}
