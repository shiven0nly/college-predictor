-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "CollegeType" AS ENUM ('IIT', 'NIT', 'IIIT', 'GFTI', 'STATE', 'PRIVATE', 'DEEMED');

-- CreateEnum
CREATE TYPE "CourseCategory" AS ENUM ('GENERAL', 'EWS', 'OBC_NCL', 'SC', 'ST', 'DEFENCE', 'TFWS');

-- CreateEnum
CREATE TYPE "CourseBranch" AS ENUM ('COMPUTER_SCIENCE', 'ELECTRONICS', 'ELECTRICAL', 'MECHANICAL', 'CIVIL', 'CHEMICAL', 'AEROSPACE', 'BIOTECHNOLOGY', 'METALLURGY', 'MINING', 'TEXTILE', 'PRODUCTION', 'INDUSTRIAL', 'INFORMATION_TECHNOLOGY', 'ARTIFICIAL_INTELLIGENCE', 'DATA_SCIENCE', 'OTHER');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colleges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colleges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_colleges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_colleges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "colleges_slug_key" ON "colleges"("slug");

-- CreateIndex
CREATE INDEX "colleges_slug_idx" ON "colleges"("slug");

-- CreateIndex
CREATE INDEX "colleges_type_idx" ON "colleges"("type");

-- CreateIndex
CREATE INDEX "colleges_state_idx" ON "colleges"("state");

-- CreateIndex
CREATE INDEX "colleges_nirfRanking_idx" ON "colleges"("nirfRanking");

-- CreateIndex
CREATE INDEX "colleges_rating_idx" ON "colleges"("rating");

-- CreateIndex
CREATE INDEX "colleges_isActive_isFeatured_idx" ON "colleges"("isActive", "isFeatured");

-- CreateIndex
CREATE INDEX "courses_collegeId_idx" ON "courses"("collegeId");

-- CreateIndex
CREATE INDEX "courses_branch_idx" ON "courses"("branch");

-- CreateIndex
CREATE INDEX "courses_category_idx" ON "courses"("category");

-- CreateIndex
CREATE INDEX "courses_openingRank_idx" ON "courses"("openingRank");

-- CreateIndex
CREATE INDEX "courses_closingRank_idx" ON "courses"("closingRank");

-- CreateIndex
CREATE UNIQUE INDEX "courses_collegeId_branch_category_key" ON "courses"("collegeId", "branch", "category");

-- CreateIndex
CREATE INDEX "reviews_collegeId_idx" ON "reviews"("collegeId");

-- CreateIndex
CREATE INDEX "reviews_userId_idx" ON "reviews"("userId");

-- CreateIndex
CREATE INDEX "reviews_status_idx" ON "reviews"("status");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE INDEX "saved_colleges_userId_idx" ON "saved_colleges"("userId");

-- CreateIndex
CREATE INDEX "saved_colleges_collegeId_idx" ON "saved_colleges"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_colleges_userId_collegeId_key" ON "saved_colleges"("userId", "collegeId");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_colleges" ADD CONSTRAINT "saved_colleges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_colleges" ADD CONSTRAINT "saved_colleges_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
