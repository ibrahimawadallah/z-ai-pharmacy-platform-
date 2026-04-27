import { NextResponse } from "next/server"
import {
  getConfiguredAdminCredentials,
  upsertAdminUser,
} from "@/lib/admin-bootstrap"

export async function POST(req: Request) {
  try {
    const adminApiKey = process.env.ADMIN_API_KEY
    if (!adminApiKey) {
      return NextResponse.json(
        {
          error:
            "Admin creation is disabled. Set ADMIN_API_KEY in the environment to enable this endpoint.",
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

    const credentials = getConfiguredAdminCredentials()
    const admin = await upsertAdminUser(credentials, { resetPassword: true })

    return NextResponse.json({
      success: true,
      message: "Admin account is ready",
      admin,
      email: credentials.email,
      passwordSet: true,
    })
  } catch (error) {
    console.error("Create admin error:", error)
    const message =
      error instanceof Error ? error.message : "Failed to create admin"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
