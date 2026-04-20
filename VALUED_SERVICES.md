# Valued Services Module (Subscriptions & Billing)

## Overview
The Valued Services module is a comprehensive subscription management system designed for the UAE healthcare market. It provides tiered access to clinical intelligence, institutional integrations, and advanced pharmacological analytics.

## Architecture

### 1. Data Model
Defined in `prisma/schema.prisma`:
- **Subscription**: Tracks the current plan, status, feature flags, and gateway identifiers.
- **Payment**: Stores transaction history, amounts, and billing reasons.

### 2. Subscription Tiers
Configured in `src/lib/subscription-config.ts`:
- **Clinician Basic (Free)**: Core MOH drug registry access.
- **Pharmacist Pro (149 AED/mo)**: Advanced analytics, unlimited storage, and priority support.
- **Hospital Enterprise (999 AED/mo)**: Institutional HIS/EMR integrations and SLA-backed support.

### 3. API Endpoints
- `GET /api/user/subscription`: Retrieves the authenticated clinician's current plan and features.
- `POST /api/user/subscription`: Processes plan upgrades and mock payment generation.
- `GET /api/admin/subscriptions`: Admin-only endpoint for revenue analytics and user distribution.

## UI Components

### Pricing Workstation
Located at `/pricing`:
- Responsive plan comparison cards.
- Real-time "Active Workspace" detection.
- Glassmorphic design with clinical iconography.

### Admin Dashboard
Located at `/admin/subscriptions`:
- Revenue tracking metrics.
- Plan distribution charts.
- Searchable clinician workspace list.

## Integration Guide

### Checking for Premium Features
To check if a user has access to a premium feature (e.g., Clinical Analytics):
```tsx
const { subscription } = await fetch('/api/user/subscription').then(r => r.json());
if (subscription.analyticsAccess) {
  // Render premium chart
}
```

### Mock Payment System
For development, the platform uses a high-fidelity mock payment processor. To integrate a real gateway like Stripe:
1. Update `src/app/api/user/subscription/route.ts`.
2. Replace the mock `db.payment.create` with a Stripe Checkout Session.
3. Configure the webhook in `src/app/api/webhooks/route.ts` to listen for `checkout.session.completed`.

## Security & Compliance
- All billing endpoints are protected by `getServerSession`.
- Administrative access is restricted via role-based access control (RBAC).
- Payment events are logged in the global Audit Log for regulatory compliance.
