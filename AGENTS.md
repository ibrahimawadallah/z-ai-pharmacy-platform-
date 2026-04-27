# DrugEye Clinical Command Center - Agent Configuration

## Project Overview
Healthcare/pharmacy platform for clinical decision support with drug interaction checking, ICD-10 disease mapping, and UAE drug formulary integration.

## Tech Stack
- **Frontend**: React, TypeScript, Next.js
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Data Sources**: FDA, DailyMed, UAE drug formulary
- **Build Tool**: npm (not bun)

## Key Commands
```bash
# Development
npm run dev

# Build
npm run build

# Database operations
npx prisma migrate dev
npx prisma generate
npx prisma studio

# Data import
cd database/data-engine
node import-drugs.js
```

## Project Structure
- `app/` - Next.js app router pages
- `components/` - React components
- `lib/` - Utility functions and helpers
- `database/` - Database schema and data
- `public/data/` - Public data files
- `database/data-engine/` - Data import scripts

## Important Notes
- Use npm only (bun.lock removed)
- Drug interaction data in `database/drug-interactions.json`
- ICD-10 mappings in `database/data/uae-drugs-complete-icd10-mappings.json`
- Clinical data includes pregnancy categories, G6PD warnings, dosing info
- 1075+ drugs with comprehensive clinical data

## Development Workflow
1. Follow existing component patterns
2. Validate all clinical data
3. Test drug interaction scenarios
4. Maintain healthcare data standards
5. Use pharmacy-development skill for clinical features
