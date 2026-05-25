import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SavedCollegesService } from "@/lib/services/saved-colleges.service";
import { z } from "zod";

const saveCollegeSchema = z.object({
  collegeId: z.string().min(1, "College ID is required"),
  notes: z.string().optional(),
});

/**
 * GET /api/saved-colleges
 * Get all saved colleges for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const savedColleges = await SavedCollegesService.getUserSavedColleges(
      session.user.id
    );

    return NextResponse.json({
      data: savedColleges,
      meta: { total: savedColleges.length },
    });
  } catch (error) {
    console.error("GET /api/saved-colleges error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved colleges" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/saved-colleges
 * Save a college for authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = saveCollegeSchema.parse(body);

    const savedCollege = await SavedCollegesService.saveCollege(
      session.user.id,
      validatedData.collegeId,
      validatedData.notes
    );

    return NextResponse.json(
      {
        message: "College saved successfully",
        data: savedCollege,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message === "College not found") {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      if (error.message === "College already saved") {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }
    }

    console.error("POST /api/saved-colleges error:", error);
    return NextResponse.json(
      { error: "Failed to save college" },
      { status: 500 }
    );
  }
}
