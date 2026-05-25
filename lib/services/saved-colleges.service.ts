import { prisma } from "@/app/lib/prisma";

export class SavedCollegesService {
  /**
   * Get all saved colleges for a user
   */
  static async getUserSavedColleges(userId: string) {
    return await prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
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
            avgPackage: true,
            highestPackage: true,
            placementRate: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Check if a college is saved by user
   */
  static async isCollegeSaved(userId: string, collegeId: string) {
    const saved = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });
    return !!saved;
  }

  /**
   * Save a college for user
   */
  static async saveCollege(userId: string, collegeId: string, notes?: string) {
    // Check if college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      throw new Error("College not found");
    }

    // Check if already saved
    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    if (existing) {
      throw new Error("College already saved");
    }

    return await prisma.savedCollege.create({
      data: {
        userId,
        collegeId,
        notes,
      },
      include: {
        college: {
          select: {
            id: true,
            slug: true,
            name: true,
            type: true,
            city: true,
            state: true,
          },
        },
      },
    });
  }

  /**
   * Remove saved college
   */
  static async unsaveCollege(userId: string, collegeId: string) {
    const saved = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    if (!saved) {
      throw new Error("Saved college not found");
    }

    return await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });
  }

  /**
   * Get saved college IDs for a user (for quick lookup)
   */
  static async getSavedCollegeIds(userId: string): Promise<string[]> {
    const saved = await prisma.savedCollege.findMany({
      where: { userId },
      select: { collegeId: true },
    });
    return saved.map((s) => s.collegeId);
  }
}
