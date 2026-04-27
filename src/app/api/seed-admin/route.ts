import { NextResponse } from "next/server"
import {
  getConfiguredAdminCredentials,
  upsertAdminUser,
} from "@/lib/admin-bootstrap"

/**
 * Idempotently create or update the admin account.
 *
 * Protected by `ADMIN_API_KEY`; the secret may be supplied via the
 * `x-admin-api-key` header or in the JSON body as `secret`.
 *
 * If the body omits credentials, falls back to `ADMIN_EMAIL`/`ADMIN_PASSWORD`
 * from the environment (or the default `admin@drugeye.com` / `Admin123456!`).
 */
export async function POST(req: Request) {
  try {
    const adminApiKey = process.env.ADMIN_API_KEY
    if (!adminApiKey) {
      return NextResponse.json(
        {
          error:
            "Admin seeding is disabled. Set ADMIN_API_KEY in the environment to enable this endpoint.",
        },
        { status: 503 },
      )
    }

    const body = await req.json().catch(() => ({}))
    const headerSecret = req.headers.get("x-admin-api-key")
    const providedSecret = headerSecret || body.secret

    if (providedSecret !== adminApiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const fallback = getConfiguredAdminCredentials()
    const email = (body.email || fallback.email).toLowerCase().trim()
    const password = body.password || fallback.password
    const name = body.name || fallback.name
    const resetPassword = body.resetPassword !== false

    const user = await upsertAdminUser(
      { email, password, name },
      { resetPassword },
    )

    return NextResponse.json({
      success: true,
      message: resetPassword
        ? "Admin user created or updated with the provided password."
        : "Admin user ensured (existing password preserved).",
      user,
    })
  } catch (error) {
    console.error("Seed admin error:", error)
    const message =
      error instanceof Error ? error.message : "Failed to seed admin user"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
