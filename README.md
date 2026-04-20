# DrugEye - Clinical Command Center

A high-performance, intelligent pharmaceutical intelligence platform for UAE healthcare professionals. 

## Features

- **Drug Search** - Comprehensive search across 21,885+ MOH-approved drugs
- **Pregnancy Safety** - FDA pregnancy categories (A, B, C, D, X) with clinical precautions
- **G6PD Safety Alerts** - High-visibility alerts for G6PD-deficient patients
- **Drug Interactions** - Check interactions between multiple drugs
- **Weight-Based Dosing** - Transparent dose calculations (mg/kg)
- **ICD-10 Mapping** - Drug-to-diagnosis mapping

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- shadcn/ui

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database

The platform uses Prisma ORM with PostgreSQL. Update `.env` with your database URL:

```env
DATABASE_URL="postgresql://..."
```

Run migrations:
```bash
npx prisma migrate dev
```

## Deployment

Deploy to Vercel or any Node.js hosting platform.

```bash
npm run build
npm run start
```

---

DrugEye - UAE MOH Approved Pharmaceutical Intelligence Platform