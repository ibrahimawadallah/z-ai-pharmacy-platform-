# =============================================================================
# DrugEye Production Deployment Checklist
# =============================================================================

## Pre-Deployment ✓ DONE

### Dependencies Installed
- ✅ @sentry/nextjs installed via npm install --legacy-peer-deps
- ✅ All other dependencies up to date

### Code Changes Applied
- ✅ /src/middleware.ts - Route protection
- ✅ /src/instrumentation.ts - Sentry init
- ✅ /src/lib/env.ts - Env validation
- ✅ API routes: requireAuth(), rate limiting, AuditLog
- ✅ Dashboard: Real DB stats (no Math.random)
- ✅ Analytics: Real AuditLog queries
- ✅ Admin subscriptions: Real DB fetch
- ✅ CI/CD: .github/workflows/ci.yml
- ✅ Health endpoint: /api/health
- ✅ Shared UI: glass-card.tsx, badge2.tsx
- ✅ PWA: offline.html, runtime caching

## Vercel Deployment

### 1. Environment Variables to Set
```
DATABASE_URL=postgresql://... (Neon)
DIRECT_URL=postgresql://... (Neon)
NEXTAUTH_SECRET=generated_random_32_chars
NEXTAUTH_URL=https://drugeye.ae
GROQ_API_KEY=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
SENTRY_DSN= (optional)
SENTRY_AUTH_TOKEN= (optional)
NEXT_PUBLIC_GA_ID= (optional)
```

### 2. Vercel Project Settings
- Build Command: npm run build
- Install Command: npm install --legacy-peer-deps
- Output Directory: .next
- Node Version: 20

### 3. Deploy Steps
```bash
git add .
git commit -m "Production ready - Phase 1-3 complete"
git push origin main
# Vercel auto-deploys on push
```

## Post-Deployment (Manual)

- [ ] Clinical pharmacist sign-off on drug data accuracy
- [ ] Legal disclaimer review and approval  
- [ ] Privacy policy page verification
- [ ] Terms of service page verification
- [ ] Test password reset email flow
- [ ] Load test AI chat (10 concurrent, <3s p95)
- [ ] Verify Sentry error capturing
- [ ] Set up UptimeRobot for /api/health