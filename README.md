# 🎓 IIT Discovery - College Predictor & Discovery Platform

A comprehensive college discovery and prediction platform built with Next.js, helping students find their dream IIT based on JEE Advanced ranks, compare colleges, and make informed decisions about their engineering education.

![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)

## ✨ Features

### 🔍 College Discovery
- Browse and search through 23+ IITs with detailed information
- Filter by location, NIRF ranking, fees, and placement statistics
- View comprehensive college profiles with:
  - Campus facilities and highlights
  - Placement statistics and packages
  - Student reviews and ratings
  - Official website links
  - Establishment year and NIRF rankings

### 🎯 College Predictor
- Predict admission chances based on JEE Advanced rank
- Filter by category (GENERAL, OBC-NCL, SC, ST, EWS)
- View opening and closing ranks for different branches
- Real-time course availability based on JOSAA data
- Detailed branch-wise cutoff information

### ⚖️ College Comparison
- Compare up to 3 colleges side-by-side
- Compare fees, placements, rankings, and facilities
- Interactive comparison table with key metrics
- Make informed decisions with comprehensive data

### 💾 Save & Bookmark
- Save favorite colleges for later review
- Personal dashboard for saved colleges
- Quick access to bookmarked institutions
- Add personal notes to saved colleges

### 👤 User Authentication
- Secure authentication with NextAuth.js
- Email/password based registration and login
- Protected routes and personalized experience
- User profile management

### 📊 Reviews & Ratings
- Read authentic student reviews
- View ratings across multiple categories:
  - Academics
  - Placements
  - Infrastructure
  - Faculty
  - Campus Life
- Overall college ratings and review counts

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16.2.6 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: React Icons (Feather Icons)
- **State Management**: React Hooks + NextAuth Session

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Authentication**: NextAuth.js 4.24
- **Password Hashing**: bcryptjs

### Database
- **Database**: PostgreSQL
- **ORM**: Prisma 7.8.0
- **Adapter**: Prisma PostgreSQL Adapter
- **Migrations**: Prisma Migrate

### Data
- **Source**: JOSAA Round 5 Data (3000+ course entries)
- **Format**: CSV parsing with csv-parse
- **Seeding**: Automated seed scripts

## 📁 Project Structure

```
college-predictor/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── colleges/             # College data endpoints
│   │   ├── compare/              # Comparison endpoint
│   │   ├── predict/              # Prediction endpoint
│   │   └── saved-colleges/       # Saved colleges endpoints
│   ├── auth/                     # Auth pages (login, signup)
│   ├── colleges/[slug]/          # Dynamic college pages
│   ├── compare/                  # Comparison page
│   ├── predictor/                # Predictor page
│   ├── saved-colleges/           # Saved colleges page
│   ├── lib/                      # Utility libraries
│   │   ├── auth.ts               # NextAuth configuration
│   │   ├── prisma.ts             # Prisma client
│   │   └── services/             # Service layer
│   └── generated/                # Prisma generated types
├── components/                   # React Components
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Layout components (Navbar)
│   ├── college/                  # College detail components
│   ├── comparison/               # Comparison components
│   ├── discovery/                # Discovery/listing components
│   ├── predictor/                # Predictor components
│   └── providers/                # Context providers
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed script
├── data/                         # Static data files
│   └── Josaa data - round 5 data.csv
├── public/                       # Static assets
│   ├── bg.png                    # Background image
│   └── iit-*.jpg                 # IIT campus images
└── lib/                          # Shared utilities
    └── utils.ts                  # Helper functions
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 20+ 
- PostgreSQL database
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd college-predictor
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/college_predictor?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/college_predictor?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

### Core Models
- **User**: User accounts and authentication
- **College**: IIT information and details
- **Course**: Course offerings with cutoffs
- **Review**: Student reviews and ratings
- **SavedCollege**: User's saved colleges

### Key Features
- Relational data with foreign keys
- Cascading deletes for data integrity
- Indexed fields for query performance
- Enum types for categories and branches

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach, works on all devices
- **Dark Mode Support**: Built-in dark theme
- **Modern UI**: Clean, professional SaaS-style interface
- **Smooth Animations**: Tailwind CSS animations
- **Accessible**: WCAG compliant components
- **Fast Loading**: Optimized images and lazy loading
- **SEO Friendly**: Meta tags and structured data

## 🔐 Authentication Flow

1. User signs up with email and password
2. Password is hashed using bcryptjs
3. User logs in with credentials
4. NextAuth creates a JWT session
5. Protected routes check session status
6. User can access personalized features

## 📈 Data Sources

### NIRF Rankings 2024
- Official NIRF Engineering Rankings
- Updated with latest 2024 data
- Accurate rankings for all IITs

### JOSAA Data
- Round 5 cutoff data
- 3000+ course entries
- Opening and closing ranks
- Category-wise cutoffs

### College Information
- Official IIT websites
- Establishment years
- Campus facilities
- Placement statistics

## 🚀 Deployment

### Vercel Deployment (Recommended)

This project is optimized for deployment on Vercel.

#### 1. Prerequisites
- Vercel account ([sign up here](https://vercel.com/signup))
- PostgreSQL database (Neon, Supabase, or Railway recommended)
- GitHub repository

#### 2. Database Setup
First, set up a PostgreSQL database:

**Option A: Neon (Recommended)**
1. Go to [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string

**Option B: Supabase**
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (use "Connection pooling" for DATABASE_URL)

**Option C: Railway**
1. Go to [Railway](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string

#### 3. Deploy to Vercel

**Via Vercel Dashboard:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure environment variables:
   ```
   DATABASE_URL=your_database_url
   DIRECT_URL=your_direct_database_url
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```
5. Click "Deploy"

**Via Vercel CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add NEXT_PUBLIC_APP_URL

# Deploy to production
vercel --prod
```

#### 4. Post-Deployment Setup

After deployment, run database migrations:

```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed
```

Or set up a GitHub Action for automatic migrations (see `.github/workflows/deploy.yml`).

#### 5. Environment Variables

Make sure to set these in Vercel Dashboard (Settings > Environment Variables):

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string (pooled) | `postgresql://user:pass@host/db?pgbouncer=true` |
| `DIRECT_URL` | Direct PostgreSQL connection (for migrations) | `postgresql://user:pass@host/db` |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app URL | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `https://your-app.vercel.app` |

#### 6. Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` environment variables

### Troubleshooting Deployment Issues

#### Prisma Client Not Found Error
If you see `Module not found: Can't resolve '@/app/generated/prisma/client'`:

**Solution:**
1. Ensure `postinstall` script is in package.json:
   ```json
   "postinstall": "prisma generate"
   ```
2. Ensure DATABASE_URL is set in Vercel environment variables
3. Redeploy the project

#### Database Connection Issues
If you see database connection errors:

**Solution:**
1. Check DATABASE_URL format:
   - For Neon: Use connection pooling URL
   - For Supabase: Use "Connection pooling" URL (port 6543)
2. Ensure DIRECT_URL is set for migrations
3. Check if database allows connections from Vercel IPs

#### Build Timeout
If build times out:

**Solution:**
1. Upgrade to Vercel Pro for longer build times
2. Optimize Prisma schema (remove unused models)
3. Use `prisma generate` in postinstall only

#### Migration Errors
If migrations fail during deployment:

**Solution:**
1. Run migrations manually after first deployment:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```
2. Or use GitHub Actions for automatic migrations

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## 📝 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
npm run db:seed          # Seed database with data
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **NIRF** for official ranking data
- **JOSAA** for admission cutoff data
- **shadcn/ui** for beautiful UI components
- **Radix UI** for accessible primitives
- **Vercel** for Next.js framework

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for aspiring engineers**
