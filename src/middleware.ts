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
    "/api/drugs/:path*",
    "/api/chat/:path*",
    "/api/reports/:path*",
    "/api/ai/:path*",
    "/api/admin/:path*",
  ],
};