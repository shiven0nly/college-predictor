# College Discovery Platform - Prisma Schema Documentation

## Overview

This schema is designed for a scalable College Discovery Platform focused on IIT admissions through JOSAA counseling. It supports college listings, course details with rank cutoffs, reviews, comparisons, and a rank predictor tool.

---

## Database Models

### 1. User Model

**Purpose**: Authentication and user management

**Fields**:
- `id`: Unique identifier (cuid)
- `email`: User email (unique, indexed)
- `name`: Optional display name
- `password`: Hashed password (for credentials auth)
- `image`: Profile image URL
- `role`: USER | ADMIN | MODERATOR
- `emailVerified`: Email verification timestamp

**Relations**:
- One-to-Many with `Review`
- One-to-Many with `SavedCollege`

**Indexes**:
- `email` - Fast user lookup during authentication

---

### 2. College Model

**Purpose**: Store comprehensive college information

**Fields**:

#### Basic Information
- `id`: Unique identifier
- `name`: Full college name
- `slug`: URL-friendly identifier (unique, indexed)
- `type`: IIT | NIT | IIIT | GFTI | STATE | PRIVATE | DEEMED

#### Location
- `city`, `state`, `country`: Geographic location
- `pincode`, `address`: Detailed address

#### Rankings & Ratings
- `nirfRanking`: NIRF ranking (indexed for sorting)
- `rating`: Aggregate rating (0-5, indexed)
- `totalReviews`: Review count

#### Financial
- `feesMin`, `feesMax`: Fee range in INR
- `avgPackage`, `highestPackage`, `medianPackage`: Placement packages in INR
- `placementRate`: Percentage (0-100)

#### Content
- `overview`: Detailed description (TEXT)
- `highlights`: Array of key features
- `facilities`: Array of available facilities
- `imageUrl`, `logoUrl`, `bannerUrl`: Media assets

#### SEO
- `metaTitle`, `metaDescription`: Search engine optimization

#### Status
- `isActive`: Visibility control
- `isFeatured`: Homepage/featured listing flag

**Relations**:
- One-to-Many with `Course`
- One-to-Many with `Review`
- One-to-Many with `SavedCollege`

**Indexes**:
- `slug` - Fast college lookup by URL
- `type` - Filter by college type
- `state` - Geographic filtering
- `nirfRanking` - Ranking-based sorting
- `rating` - Rating-based sorting
- `(isActive, isFeatured)` - Composite for featured listings

---

### 3. Course Model

**Purpose**: Store branch-wise admission cutoffs from JOSAA data

**Fields**:

#### Identification
- `id`: Unique identifier
- `collegeId`: Foreign key to College

#### Course Details
- `branch`: Enum (COMPUTER_SCIENCE, ELECTRICAL, etc.)
- `branchName`: Display name
- `category`: GENERAL | EWS | OBC_NCL | SC | ST | DEFENCE | TFWS
- `duration`: Years (default 4)
- `degree`: "B.Tech", "M.Tech", etc.

#### Admission Criteria (JOSAA Data)
- `openingRank`: Highest rank admitted (indexed)
- `closingRank`: Lowest rank admitted (indexed)
- `totalSeats`: Available seats

#### Fees
- `tuitionFee`, `hostelFee`, `otherFees`: Cost breakdown in INR

**Relations**:
- Many-to-One with `College` (CASCADE delete)

**Indexes**:
- `collegeId` - Fast course lookup by college
- `branch` - Filter by engineering branch
- `category` - Filter by reservation category
- `openingRank`, `closingRank` - Rank-based predictor queries

**Unique Constraint**:
- `(collegeId, branch, category)` - Prevents duplicate entries

---

### 4. Review Model

**Purpose**: User-generated college reviews with moderation

**Fields**:

#### Identification
- `id`: Unique identifier
- `collegeId`, `userId`: Foreign keys

#### Content
- `title`: Review headline
- `content`: Detailed review (TEXT)
- `rating`: Overall rating (1-5)

#### Category Ratings (Optional)
- `academicsRating`: Academic quality (1-5)
- `placementRating`: Placement performance (1-5)
- `infrastructureRating`: Facilities quality (1-5)
- `facultyRating`: Teaching quality (1-5)
- `campusLifeRating`: Campus experience (1-5)

#### Metadata
- `batch`: Graduation year
- `course`: Branch studied

#### Moderation
- `status`: PENDING | APPROVED | REJECTED (indexed)

#### Engagement
- `helpfulCount`: Upvote counter

**Relations**:
- Many-to-One with `College` (CASCADE delete)
- Many-to-One with `User` (CASCADE delete)

**Indexes**:
- `collegeId` - Fast review lookup by college
- `userId` - User's review history
- `status` - Moderation queue filtering
- `rating` - Rating-based sorting

---

### 5. SavedCollege Model

**Purpose**: User's saved/bookmarked colleges

**Fields**:
- `id`: Unique identifier
- `userId`, `collegeId`: Foreign keys
- `notes`: Optional user notes

**Relations**:
- Many-to-One with `User` (CASCADE delete)
- Many-to-One with `College` (CASCADE delete)

**Indexes**:
- `userId` - Fast lookup of user's saved colleges
- `collegeId` - Track save count per college

**Unique Constraint**:
- `(userId, collegeId)` - Prevent duplicate saves

---

## Enums

### UserRole
- `USER`: Regular user
- `ADMIN`: Full system access
- `MODERATOR`: Review moderation access

### CollegeType
- `IIT`: Indian Institute of Technology
- `NIT`: National Institute of Technology
- `IIIT`: Indian Institute of Information Technology
- `GFTI`: Government Funded Technical Institute
- `STATE`: State government colleges
- `PRIVATE`: Private institutions
- `DEEMED`: Deemed universities

### CourseCategory (JOSAA Categories)
- `GENERAL`: Open category
- `EWS`: Economically Weaker Section
- `OBC_NCL`: Other Backward Classes (Non-Creamy Layer)
- `SC`: Scheduled Caste
- `ST`: Scheduled Tribe
- `DEFENCE`: Defence quota
- `TFWS`: Tuition Fee Waiver Scheme

### CourseBranch
Engineering branches including:
- COMPUTER_SCIENCE
- ELECTRONICS
- ELECTRICAL
- MECHANICAL
- CIVIL
- CHEMICAL
- AEROSPACE
- BIOTECHNOLOGY
- ARTIFICIAL_INTELLIGENCE
- DATA_SCIENCE
- And more...

### ReviewStatus
- `PENDING`: Awaiting moderation
- `APPROVED`: Published
- `REJECTED`: Hidden

---

## Relationships Explained

### One-to-Many Relationships

1. **College → Courses**
   - One college has many courses (different branches/categories)
   - Cascade delete: Deleting college removes all courses

2. **College → Reviews**
   - One college has many reviews
   - Cascade delete: Deleting college removes all reviews

3. **User → Reviews**
   - One user can write many reviews
   - Cascade delete: Deleting user removes their reviews

4. **User → SavedColleges**
   - One user can save many colleges
   - Cascade delete: Deleting user removes their saved list

5. **College → SavedColleges**
   - One college can be saved by many users
   - Cascade delete: Deleting college removes all saves

---

## Index Strategy

### Performance Optimization

1. **Lookup Indexes**
   - `User.email` - Authentication queries
   - `College.slug` - URL-based college pages
   - `Course.collegeId` - Course listings per college

2. **Filter Indexes**
   - `College.type` - Filter by college type
   - `College.state` - Geographic filtering
   - `Course.branch` - Branch-based filtering
   - `Course.category` - Category-based filtering
   - `Review.status` - Moderation filtering

3. **Sort Indexes**
   - `College.nirfRanking` - Ranking-based sorting
   - `College.rating` - Rating-based sorting
   - `Course.openingRank` - Rank predictor queries
   - `Course.closingRank` - Rank predictor queries
   - `Review.rating` - Review sorting

4. **Composite Indexes**
   - `(College.isActive, College.isFeatured)` - Featured listings query

---

## Seed Strategy

### Data Sources

1. **JOSAA CSV Files**
   - `Josaa data - round 1 data.csv` (3086 rows)
   - `Josaa data - round 5 data.csv` (3029 rows)
   - Contains: Institute, Program, Quota, Seat Type, Gender, Opening/Closing Ranks

2. **IIT Master Data**
   - 23 IITs with location, establishment year, NIRF ranking
   - Estimated placement data
   - Website URLs

### Seed Process

1. **Clean Database**
   - Delete all existing data (in dependency order)

2. **Create Colleges**
   - Insert 23 IITs with complete details
   - Set featured flag for top 10 IITs

3. **Parse JOSAA CSV**
   - Read round 5 data (latest cutoffs)
   - Map institute names to colleges
   - Normalize branch names to enums
   - Map seat types to categories

4. **Create Courses**
   - Extract unique (college, branch, category) combinations
   - Store opening/closing ranks
   - Add fee structure

5. **Create Sample Data**
   - 2 users (admin + student)
   - 2 sample reviews

### Running the Seed

```bash
npm run db:seed
```

---

## Query Patterns

### Common Queries

#### 1. Rank Predictor
```typescript
// Find colleges where user's rank falls between opening and closing
const eligibleCourses = await prisma.course.findMany({
  where: {
    category: userCategory,
    openingRank: { lte: userRank },
    closingRank: { gte: userRank },
  },
  include: {
    college: true,
  },
  orderBy: {
    college: {
      nirfRanking: 'asc',
    },
  },
});
```

#### 2. College Listing with Filters
```typescript
const colleges = await prisma.college.findMany({
  where: {
    isActive: true,
    type: 'IIT',
    state: { in: selectedStates },
    nirfRanking: { lte: 20 },
  },
  orderBy: {
    nirfRanking: 'asc',
  },
  take: 20,
  skip: page * 20,
});
```

#### 3. College Detail with Relations
```typescript
const college = await prisma.college.findUnique({
  where: { slug: 'iit-bombay' },
  include: {
    courses: {
      where: { isActive: true },
      orderBy: { openingRank: 'asc' },
    },
    reviews: {
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
  },
});
```

#### 4. User's Saved Colleges
```typescript
const savedColleges = await prisma.savedCollege.findMany({
  where: { userId: user.id },
  include: {
    college: {
      include: {
        courses: {
          where: { category: userCategory },
          orderBy: { closingRank: 'asc' },
          take: 1,
        },
      },
    },
  },
});
```

---

## Production Considerations

### 1. Data Integrity
- Unique constraints prevent duplicates
- Cascade deletes maintain referential integrity
- Required fields ensure data completeness

### 2. Performance
- Strategic indexes for common queries
- Composite indexes for complex filters
- Pagination support for large datasets

### 3. Scalability
- Normalized structure reduces redundancy
- Efficient relations for joins
- Enum types for categorical data

### 4. Maintainability
- Clear naming conventions
- Comprehensive documentation
- Logical model organization

### 5. Security
- Password hashing (application layer)
- Role-based access control
- Review moderation system

---

## Future Enhancements

### Potential Additions

1. **Comparison History**
   - Track user's college comparisons
   - Provide personalized recommendations

2. **Notifications**
   - Rank cutoff updates
   - New review alerts
   - Counseling round reminders

3. **Analytics**
   - Track popular colleges
   - Monitor search patterns
   - Placement trends

4. **Advanced Features**
   - Course prerequisites
   - Scholarship information
   - Alumni network
   - Virtual campus tours

---

## Migration Strategy

### Initial Setup
```bash
# Generate Prisma Client
npm run prisma:generate

# Create tables (manual SQL or migration tool)
# For Neon, use SQL editor or migration scripts

# Seed database
npm run db:seed
```

### Schema Updates
1. Modify `schema.prisma`
2. Generate new client: `npm run prisma:generate`
3. Create migration SQL
4. Apply to database
5. Update seed script if needed

---

## Support & Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **JOSAA**: https://josaa.nic.in
- **NIRF Rankings**: https://www.nirfindia.org

---

**Last Updated**: 2026-05-25
**Schema Version**: 1.0.0
**Database**: PostgreSQL (Neon)
