# folder_structure.md

# College Discovery Platform — Production-Oriented Folder Structure

Tech Stack:
- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- Prisma ORM
- PostgreSQL
- NextAuth/Auth.js
- Vercel Deployment

---

# High-Level Architecture

This project follows a scalable modular architecture focused on:

- separation of concerns
- reusable UI systems
- maintainable backend APIs
- scalable feature modules
- production-grade organization

The structure is designed to support:
- frontend rendering
- backend APIs
- authentication
- database integration
- future scalability

---

# Complete Folder Structure

```txt
college-discovery-platform/
│
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── api/
│   │   ├── auth/
│   │   ├── colleges/
│   │   ├── predictor/
│   │   ├── compare/
│   │   └── reviews/
│   │
│   ├── colleges/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── compare/
│   │   └── page.tsx
│   │
│   ├── predictor/
│   │   └── page.tsx
│   │
│   ├── saved/
│   │   └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── skeleton.tsx
│   │   └── badge.tsx
│   │
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   └── sidebar.tsx
│   │
│   ├── colleges/
│   │   ├── college-card.tsx
│   │   ├── college-grid.tsx
│   │   ├── college-filters.tsx
│   │   ├── college-search.tsx
│   │   ├── placement-section.tsx
│   │   ├── review-section.tsx
│   │   └── courses-section.tsx
│   │
│   ├── compare/
│   │   ├── compare-table.tsx
│   │   └── compare-selector.tsx
│   │
│   └── predictor/
│       ├── predictor-form.tsx
│       └── predictor-results.tsx
│
├── modules/
│   ├── colleges/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types.ts
│   │
│   ├── predictor/
│   │   ├── services/
│   │   ├── utils/
│   │   └── types.ts
│   │
│   └── compare/
│       ├── services/
│       └── types.ts
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── validations.ts
│   ├── constants.ts
│   ├── helpers.ts
│   └── db.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── data/
│   ├── colleges.csv
│   ├── iits.json
│   └── reviews.json
│
├── hooks/
│   ├── useDebounce.ts
│   ├── useCollegeFilters.ts
│   └── usePredictor.ts
│
├── services/
│   ├── college.service.ts
│   ├── predictor.service.ts
│   ├── compare.service.ts
│   └── auth.service.ts
│
├── types/
│   ├── college.ts
│   ├── predictor.ts
│   ├── review.ts
│   └── api.ts
│
├── utils/
│   ├── format-fees.ts
│   ├── rank-logic.ts
│   ├── calculate-rating.ts
│   └── pagination.ts
│
├── middleware.ts
├── .env
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

# Folder-by-Folder Explanation

---

# 1. app/

This is the main App Router directory in Next.js.

Contains:
- routes
- layouts
- API routes
- loading/error boundaries

---

## app/api/

Backend API layer.

Example APIs:
- GET colleges
- compare colleges
- predictor logic
- authentication
- reviews

Example:
```txt
/api/colleges
/api/colleges/[id]
/api/predictor
```

This keeps backend logic inside the same project.

---

## app/colleges/

College listing and detail pages.

Contains:
- college search page
- dynamic college detail page

Example:
```txt
/colleges
/colleges/iit-bombay
```

---

## app/compare/

Comparison system page.

Used for:
- selecting colleges
- rendering comparison table

---

## app/predictor/

Rank predictor tool.

Handles:
- exam selection
- category selection
- rank input
- recommended colleges

---

# 2. components/

Reusable UI components.

This is critical for scalability.

---

## components/ui/

Generic reusable UI elements.

Examples:
- buttons
- cards
- inputs
- modals
- skeleton loaders

These should be reusable across the application.

---

## components/colleges/

College-specific UI components.

Examples:
- college card
- placement section
- review section
- filter system

Separating domain-specific UI improves maintainability.

---

# 3. modules/

Feature-based modular architecture.

Each feature contains:
- services
- hooks
- utilities
- feature-specific types

This helps:
- scalability
- cleaner organization
- feature isolation

---

# 4. lib/

Core application utilities.

Contains:
- Prisma client
- authentication config
- helper utilities
- validation schemas

---

## prisma.ts

Singleton Prisma client instance.

Prevents:
- excessive DB connections
- hot reload issues

---

## auth.ts

Authentication configuration.

Handles:
- sessions
- providers
- protected routes

---

# 5. prisma/

Database layer.

Contains:
- Prisma schema
- migrations
- seed data

---

## schema.prisma

Defines:
- User model
- College model
- Review model
- Predictor-related models

---

## seed.ts

Seeds database with:
- IIT data
- reviews
- placement stats

Important for demo readiness.

---

# 6. data/

Static datasets.

Useful for:
- CSV imports
- JSON mock data
- temporary datasets

Helps separate raw data from application logic.

---

# 7. hooks/

Reusable React hooks.

Examples:
- debounced search
- filtering state
- predictor logic

Improves:
- code reuse
- readability

---

# 8. services/

Business logic layer.

Responsible for:
- database queries
- filtering logic
- predictor algorithms
- API communication

Important:
UI should NOT directly contain business logic.

---

# 9. types/

Centralized TypeScript types.

Examples:
- College
- Review
- PredictorResponse

Improves:
- type safety
- maintainability
- DX (Developer Experience)

---

# 10. utils/

Pure utility/helper functions.

Examples:
- fee formatting
- pagination logic
- rank calculations

Should contain:
- stateless functions
- reusable logic

---

# Authentication Flow

Recommended:
- NextAuth/Auth.js

Features:
- session handling
- route protection
- scalable auth system

Protected routes:
```txt
/saved
/profile
```

---

# Database Design

Recommended Models:
- User
- College
- Course
- Review
- SavedCollege

Use PostgreSQL + Prisma ORM.

---

# Deployment Architecture

Frontend:
- Vercel

Database:
- Neon PostgreSQL

Environment Variables:
```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

---

# Production-Oriented Practices

This architecture supports:
- reusable systems
- feature scalability
- API separation
- modular frontend
- maintainable codebase

Implemented engineering practices:
- loading states
- error boundaries
- reusable UI
- type safety
- modular services
- feature isolation
- scalable API structure

---

# Recommended Engineering Principles

1. Keep components small and reusable
2. Avoid business logic inside UI
3. Centralize types
4. Use feature-based architecture
5. Keep APIs consistent
6. Handle loading and error states
7. Use TypeScript strictly
8. Keep database queries inside services

---