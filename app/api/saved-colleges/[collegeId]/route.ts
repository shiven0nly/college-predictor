import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SavedCollegesService } from "@/lib/services/saved-colleges.service";

/**
 * DELETE /api/saved-colleges/[collegeId]
 * Remove a saved college for authenticated user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ collegeId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { collegeId } = await params;

    await SavedCollegesService.unsaveCollege(session.user.id, collegeId);

    return NextResponse.json({
      message: "College removed from saved list",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Saved college not found") {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    console.error("DELETE /api/saved-colleges/[collegeId] error:", error);
    return NextResponse.json(
      { error: "Failed to remove saved college" },
      { status: 500 }
    );
  }
}
