import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination params
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;

    // Search param
    const search = searchParams.get("search") || "";
    
    // Filter params
    const types = searchParams.getAll("type");
    // e.g. ?type=IIT&type=NIT

    const nirfRanking = searchParams.get("nirfRanking"); // 'top5', 'top10', 'all'

    // Build the Prisma where clause
    const where: Prisma.CollegeWhereInput = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { state: { contains: search, mode: "insensitive" } },
      ];
    }

    if (types && types.length > 0) {
      // @ts-ignore mapping string to enum if valid
      where.type = { in: types };
    }

    if (nirfRanking === "top5") {
      where.nirfRanking = { lte: 5, not: null };
    } else if (nirfRanking === "top10") {
      where.nirfRanking = { lte: 10, not: null };
    }

    // Run query and count in parallel
    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { nirfRanking: { sort: "asc", nulls: "last" } },
          { name: "asc" }
        ],
        select: {
          id: true,
          slug: true,
          name: true,
          city: true,
          state: true,
          nirfRanking: true,
          established: true,
          imageUrl: true,
          type: true,
        },
      }),
      prisma.college.count({ where }),
    ]);

    // Format location for frontend compatibility with existing component
    const formattedColleges = colleges.map(c => ({
      ...c,
      location: `${c.city}, ${c.state}`
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: formattedColleges,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error("API /colleges error:", error);
    return NextResponse.json(
      { error: "Failed to fetch colleges" },
      { status: 500 }
    );
  }
}
