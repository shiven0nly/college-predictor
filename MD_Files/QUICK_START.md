# 🚀 Quick Start - College Predictor Setup

## ✅ What's Ready

- ✅ Prisma schema with 5 models (User, College, Course, Review, SavedCollege)
- ✅ Supabase connection configured
- ✅ Seed script with 23 IITs + JOSAA data
- ✅ SQL migration file ready

---

## 📋 3-Step Setup

### Step 1: Create Tables in Supabase

1. Open Supabase Dashboard → SQL Editor
2. Copy contents from `prisma/schema.sql`
3. Paste and Run

**Expected**: "Success. No rows returned"

### Step 2: Seed the Database

```bash
npm run db:seed
```

**Expected**: 
- 23 colleges created
- 2500+ courses created
- 2 users created
- 2 reviews created

### Step 3: Verify

```bash
npm run prisma:studio
```

Opens GUI at http://localhost:5555

---

## 📊 What You'll Get

### 23 IIT Colleges
- Complete details (location, fees, placements)
- NIRF rankings
- Ratings and reviews
- Images and logos

### 2500+ Courses
- All branches (CSE, ECE, EE, ME, etc.)
- All categories (GENERAL, EWS, OBC-NCL, SC, ST)
- Opening/closing ranks from JOSAA Round 5
- Fee structure

### Sample Data
- 2 users (admin + student)
- 2 reviews with ratings

---

## 🎯 Key Features Supported

✅ **College Listings** - Filter by type, state, ranking
✅ **College Details** - Complete info with courses
✅ **Rank Predictor** - Find eligible colleges by rank
✅ **Comparison** - Compare multiple colleges
✅ **Reviews** - User reviews with moderation
✅ **Bookmarks** - Save favorite colleges

---

## 📁 Important Files

```
prisma/
├── schema.prisma      # Database schema
├── schema.sql         # SQL migration (run in Supabase)
└── seed.ts           # Seed script

app/lib/
└── prisma.ts         # Prisma client singleton

data/
├── Josaa data - round 1 data.csv
└── Josaa data - round 5 data.csv

.env                  # Supabase connection URLs
```

---

## 🔧 Useful Commands

```bash
# Test connection
npm run db:test

# Generate Prisma Client
npm run prisma:generate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run prisma:studio

# Start dev server
npm run dev
```

---

## 📖 Full Documentation

- `SUPABASE_MIGRATION_GUIDE.md` - Detailed migration steps
- `prisma/SCHEMA_DOCUMENTATION.md` - Complete schema docs
- `PRISMA_SETUP_COMPLETE.md` - Setup summary

---

## 🆘 Troubleshooting

**Connection fails?**
→ Check `.env` has correct Supabase URLs

**Seed fails?**
→ Make sure tables are created first (Step 1)

**Tables already exist?**
→ Skip Step 1, go directly to Step 2

---

## 🎉 You're Ready!

After seeding, you can:
1. Browse data in Prisma Studio
2. Build API routes in `app/api/`
3. Create frontend pages in `app/`
4. Test rank predictor queries

**Happy Coding!** 🚀
