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

## Admin User

The platform ships with an idempotent admin bootstrap. Configure these
environment variables on your deployment:

```env
ADMIN_API_KEY="<long-random-string>"
ADMIN_EMAIL="admin@drugeye.com"        # optional, default shown
ADMIN_PASSWORD="Admin123456!"           # optional, default shown
```

You can seed (or reset) the admin account in three ways:

1. **CLI** (locally, with a `DIRECT_URL` in `.env`):
   ```bash
   npm run db:seed:admin
   ```
2. **HTTP** (production / Vercel):
   ```bash
   curl -X POST https://<your-domain>/api/seed-admin \
     -H "x-admin-api-key: $ADMIN_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{}'
   ```
   Response confirms the admin email and that the password was set.
3. **Auto-bootstrap on first sign-in**: when a sign-in attempt matches
   `ADMIN_EMAIL` and **no user with that email exists yet**, the configured
   admin is created automatically with `ADMIN_PASSWORD`. This makes it safe to
   redeploy against a fresh database without losing access. The configured
   admin email is also reserved on the signup endpoint, so it cannot be
   self-registered before the bootstrap fires. If a user with the admin email
   already exists but is not an admin, auto-bootstrap is a no-op — use the
   `/api/seed-admin` endpoint to grant or reset admin access deliberately.

Sign in at `/auth/login` with the configured email and password.

## Deployment

Deploy to Vercel or any Node.js hosting platform.

```bash
npm run build
npm run start
```

---

DrugEye - UAE MOH Approved Pharmaceutical Intelligence Platform