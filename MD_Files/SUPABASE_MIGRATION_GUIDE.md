# Supabase Migration Guide

## Step 1: Create Database Tables

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy the entire contents of `prisma/schema.sql`
6. Paste it into the SQL Editor
7. Click "Run" or press `Ctrl+Enter`

You should see: "Success. No rows returned"

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Run the migration
supabase db push --file prisma/schema.sql
```

---

## Step 2: Verify Tables Created

In Supabase Dashboard:
1. Go to "Table Editor"
2. You should see these tables:
   - users
   - colleges
   - courses
   - reviews
   - saved_colleges

---

## Step 3: Seed the Database

Once tables are created, run the seed script:

```bash
npm run db:seed
```

This will:
- ✅ Create 23 IIT colleges with complete details
- ✅ Parse JOSAA CSV data (3000+ courses)
- ✅ Insert opening/closing ranks for all branches and categories
- ✅ Create sample users and reviews

Expected output:
```
🌱 Starting seed...
🧹 Cleaning existing data...
🏫 Creating colleges...
✅ Created 23 colleges
📊 Reading JOSAA data...
📈 Found 3029 course entries
📚 Creating courses...
📝 Creating 2500+ unique courses...
✅ Created 2500+ courses
👥 Creating sample users...
✅ Created 2 users
⭐ Creating sample reviews...
✅ Created 2 reviews
✨ Seed completed successfully!
```

---

## Step 4: Verify Data

### Check in Supabase Dashboard

1. Go to "Table Editor"
2. Click on "colleges" - should see 23 IITs
3. Click on "courses" - should see 2500+ courses
4. Click on "users" - should see 2 users
5. Click on "reviews" - should see 2 reviews

### Or use Prisma Studio

```bash
npm run prisma:studio
```

This opens a GUI at http://localhost:5555 where you can browse all your data.

---

## Troubleshooting

### Issue: "relation already exists"
**Solution**: Tables already created. Skip to Step 3 (Seed).

### Issue: "type already exists"
**Solution**: Enums already created. This is fine, continue.

### Issue: Connection refused during seed
**Solution**: 
1. Check your `.env` file has correct Supabase URLs
2. Verify DATABASE_URL uses port 6543 (pooler)
3. Verify DIRECT_URL uses port 5432

### Issue: Seed script fails
**Solution**:
1. Make sure tables are created first (Step 1)
2. Check CSV files exist in `data/` folder
3. Run with more logging: `tsx prisma/seed.ts`

---

## What Gets Seeded

### Colleges (23 IITs)
- IIT Bombay, Delhi, Madras, Kanpur, Kharagpur, Roorkee
- IIT Guwahati, Hyderabad, BHU Varanasi, Indore
- IIT ISM Dhanbad, Bhubaneswar, Gandhinagar, Ropar
- IIT Mandi, Jodhpur, Patna, Bhilai, Goa
- IIT Palakkad, Tirupati, Jammu, Dharwad

Each college includes:
- Complete location details (city, state, pincode)
- NIRF ranking
- Fees range (₹2-2.5 lakhs/year)
- Placement statistics (avg, highest, median packages)
- Placement rate (94-99%)
- Rating (4.4-4.8)
- Overview paragraph
- Highlights array
- Facilities array
- Image URLs

### Courses (2500+)
From JOSAA Round 5 CSV data:
- All engineering branches (CSE, ECE, EE, ME, CE, etc.)
- All categories (GENERAL, EWS, OBC-NCL, SC, ST)
- Opening and closing ranks
- Gender-neutral entries
- Fee structure

### Users (2)
- Admin user: admin@iitpredictor.com
- Sample student: student@example.com

### Reviews (2)
- Sample reviews for IIT Bombay and IIT Delhi
- With category ratings (academics, placement, infrastructure, etc.)

---

## Next Steps After Seeding

### 1. Test the Data

```typescript
import { prisma } from "@/app/lib/prisma";

// Get all IITs
const iits = await prisma.college.findMany({
  where: { type: "IIT" },
  orderBy: { nirfRanking: "asc" },
});

// Test rank predictor
const eligibleCourses = await prisma.course.findMany({
  where: {
    category: "GENERAL",
    openingRank: { lte: 5000 },
    closingRank: { gte: 5000 },
  },
  include: { college: true },
});
```

### 2. Build API Routes

Create these API endpoints:
- `GET /api/colleges` - List colleges with filters
- `GET /api/colleges/[slug]` - College details
- `POST /api/predictor` - Rank prediction
- `GET /api/compare` - Compare colleges
- `POST /api/reviews` - Submit review

### 3. Build Frontend Pages

- `/colleges` - College listing with filters
- `/colleges/[slug]` - College detail page
- `/predictor` - Rank predictor tool
- `/compare` - Comparison page
- `/saved` - Saved colleges

---

## Database Schema Summary

```
users (Authentication)
├── id, email, name, password, role
├── → reviews (one-to-many)
└── → saved_colleges (one-to-many)

colleges (IIT Details)
├── id, name, slug, type, location
├── nirfRanking, rating, fees, packages
├── → courses (one-to-many)
├── → reviews (one-to-many)
└── → saved_colleges (one-to-many)

courses (JOSAA Cutoffs)
├── id, collegeId, branch, category
├── openingRank, closingRank, seats
└── → college (many-to-one)

reviews (User Feedback)
├── id, collegeId, userId
├── title, content, ratings, status
├── → college (many-to-one)
└── → user (many-to-one)

saved_colleges (Bookmarks)
├── id, userId, collegeId, notes
├── → user (many-to-one)
└── → college (many-to-one)
```

---

## Useful Commands

```bash
# Test database connection
npm run db:test

# Generate Prisma Client
npm run prisma:generate

# Seed database
npm run db:seed

# Open Prisma Studio (GUI)
npm run prisma:studio

# Start development server
npm run dev
```

---

## Support

If you encounter issues:
1. Check Supabase Dashboard → Database → Tables
2. Check Supabase Dashboard → Database → Logs
3. Verify `.env` file has correct URLs
4. Ensure tables are created before seeding

---

**Status**: Ready to migrate! 🚀
**Database**: PostgreSQL (Supabase)
**ORM**: Prisma 7.8.0
