import { NextRequest, NextResponse } from 'next/server'

/**
 * Edge middleware that applies a baseline set of security headers on every
 * response. Mirrors `getSecurityHeaders()` in `src/lib/security.ts` but is
 * inlined here because middleware runs in the Edge runtime and cannot import
 * modules that pull in Node APIs (Prisma, crypto, etc.).
 *
 * CSP is intentionally *not* applied here: Next.js dev and the app's own
 * inline scripts require careful policy tuning, so we ship the non-controversial
 * headers first. Add CSP in a follow-up once the allow-list is known.
 */
const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

export function middleware(_req: NextRequest) {
  const response = NextResponse.next()
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(k, v)
  }
  return response
}

export const config = {
  // Apply to every route except Next internals and static assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|drugeye-logo.png|manifest.json).*)'],
}
