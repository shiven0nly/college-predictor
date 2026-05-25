import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../app/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function createTables() {
  console.log("🔄 Creating database tables...");

  try {
    // Create enums
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'MODERATOR');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "CollegeType" AS ENUM ('IIT', 'NIT', 'IIIT', 'GFTI', 'STATE', 'PRIVATE', 'DEEMED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "CourseCategory" AS ENUM ('GENERAL', 'EWS', 'OBC_NCL', 'SC', 'ST', 'DEFENCE', 'TFWS');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "CourseBranch" AS ENUM (
          'COMPUTER_SCIENCE', 'ELECTRONICS', 'ELECTRICAL', 'MECHANICAL', 'CIVIL',
          'CHEMICAL', 'AEROSPACE', 'BIOTECHNOLOGY', 'METALLURGY', 'MINING',
          'TEXTILE', 'PRODUCTION', 'INDUSTRIAL', 'INFORMATION_TECHNOLOGY',
          'ARTIFICIAL_INTELLIGENCE', 'DATA_SCIENCE', 'OTHER'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    console.log("✅ Enums created");

    // Create users table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "name" TEXT,
        "password" TEXT,
        "image" TEXT,
        "role" "UserRole" NOT NULL DEFAULT 'USER',
        "emailVerified" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
    `);

    console.log("✅ Users table created");

    // Create colleges table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "colleges" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "type" "CollegeType" NOT NULL,
        "city" TEXT NOT NULL,
        "state" TEXT NOT NULL,
        "country" TEXT NOT NULL DEFAULT 'India',
        "pincode" TEXT,
        "address" TEXT,
        "established" INTEGER,
        "website" TEXT,
        "email" TEXT,
        "phone" TEXT,
        "nirfRanking" INTEGER,
        "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "totalReviews" INTEGER NOT NULL DEFAULT 0,
        "feesMin" INTEGER,
        "feesMax" INTEGER,
        "avgPackage" INTEGER,
        "highestPackage" INTEGER,
        "medianPackage" INTEGER,
        "placementRate" DOUBLE PRECISION,
        "overview" TEXT,
        "highlights" TEXT[],
        "facilities" TEXT[],
        "imageUrl" TEXT,
        "logoUrl" TEXT,
        "bannerUrl" TEXT,
        "metaTitle" TEXT,
        "metaDescription" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "isFeatured" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "colleges_slug_idx" ON "colleges"("slug");
      CREATE INDEX IF NOT EXISTS "colleges_type_idx" ON "colleges"("type");
      CREATE INDEX IF NOT EXISTS "colleges_state_idx" ON "colleges"("state");
      CREATE INDEX IF NOT EXISTS "colleges_nirfRanking_idx" ON "colleges"("nirfRanking");
      CREATE INDEX IF NOT EXISTS "colleges_rating_idx" ON "colleges"("rating");
      CREATE INDEX IF NOT EXISTS "colleges_isActive_isFeatured_idx" ON "colleges"("isActive", "isFeatured");
    `);

    console.log("✅ Colleges table created");

    // Create courses table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "courses" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "collegeId" TEXT NOT NULL,
        "branch" "CourseBranch" NOT NULL,
        "branchName" TEXT NOT NULL,
        "category" "CourseCategory" NOT NULL,
        "duration" INTEGER NOT NULL DEFAULT 4,
        "degree" TEXT NOT NULL DEFAULT 'B.Tech',
        "openingRank" INTEGER NOT NULL,
        "closingRank" INTEGER NOT NULL,
        "totalSeats" INTEGER,
        "tuitionFee" INTEGER,
        "hostelFee" INTEGER,
        "otherFees" INTEGER,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "courses_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "courses_collegeId_branch_category_key" UNIQUE ("collegeId", "branch", "category")
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "courses_collegeId_idx" ON "courses"("collegeId");
      CREATE INDEX IF NOT EXISTS "courses_branch_idx" ON "courses"("branch");
      CREATE INDEX IF NOT EXISTS "courses_category_idx" ON "courses"("category");
      CREATE INDEX IF NOT EXISTS "courses_openingRank_idx" ON "courses"("openingRank");
      CREATE INDEX IF NOT EXISTS "courses_closingRank_idx" ON "courses"("closingRank");
    `);

    console.log("✅ Courses table created");

    // Create reviews table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "reviews" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "collegeId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "rating" DOUBLE PRECISION NOT NULL,
        "academicsRating" DOUBLE PRECISION,
        "placementRating" DOUBLE PRECISION,
        "infrastructureRating" DOUBLE PRECISION,
        "facultyRating" DOUBLE PRECISION,
        "campusLifeRating" DOUBLE PRECISION,
        "batch" INTEGER,
        "course" TEXT,
        "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
        "helpfulCount" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "reviews_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "reviews_collegeId_idx" ON "reviews"("collegeId");
      CREATE INDEX IF NOT EXISTS "reviews_userId_idx" ON "reviews"("userId");
      CREATE INDEX IF NOT EXISTS "reviews_status_idx" ON "reviews"("status");
      CREATE INDEX IF NOT EXISTS "reviews_rating_idx" ON "reviews"("rating");
    `);

    console.log("✅ Reviews table created");

    // Create saved_colleges table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "saved_colleges" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "collegeId" TEXT NOT NULL,
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "saved_colleges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "saved_colleges_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "saved_colleges_userId_collegeId_key" UNIQUE ("userId", "collegeId")
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "saved_colleges_userId_idx" ON "saved_colleges"("userId");
      CREATE INDEX IF NOT EXISTS "saved_colleges_collegeId_idx" ON "saved_colleges"("collegeId");
    `);

    console.log("✅ Saved colleges table created");

    console.log("✨ All tables created successfully!");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

createTables();
