import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/(app)/:path*",
    // Protect advanced drug features but allow basic search
    "/api/drugs/interactions/:path*",
    "/api/drugs/export",
    "/api/drugs/clinical-data",
    "/api/chat/:path*",
    "/api/reports/:path*",
    "/api/ai/:path*",
    "/api/admin/:path*",
    // User-specific endpoints
    "/api/user/:path*",
    "/api/favorites/:path*",
  ],
};