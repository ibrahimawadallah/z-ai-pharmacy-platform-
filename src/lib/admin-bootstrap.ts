import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

/**
 * Default credentials for the bootstrap admin account. These can be overridden
 * via environment variables on the deployment.
 */
export const DEFAULT_ADMIN_EMAIL = "admin@drugeye.com"
export const DEFAULT_ADMIN_PASSWORD = "Admin123456!"
export const DEFAULT_ADMIN_NAME = "System Administrator"

const BCRYPT_ROUNDS = 12

export interface AdminCredentials {
  email: string
  password: string
  name?: string
}

export function getConfiguredAdminCredentials(): AdminCredentials {
  const email = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL)
    .toLowerCase()
    .trim()
  const password = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME || DEFAULT_ADMIN_NAME
  return { email, password, name }
}

/**
 * Idempotently create or update the admin user with the given credentials.
 * Existing users keep their password unless `resetPassword` is true.
 */
export async function upsertAdminUser(
  credentials: AdminCredentials,
  options: { resetPassword?: boolean } = {},
) {
  const email = credentials.email.toLowerCase().trim()
  const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_ROUNDS)

  const existing = await db.user.findUnique({ where: { email } })

  if (!existing) {
    return db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: credentials.name || DEFAULT_ADMIN_NAME,
        role: "admin",
        isVerified: true,
        verifiedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    })
  }

  return db.user.update({
    where: { email },
    data: {
      role: "admin",
      isVerified: true,
      ...(options.resetPassword ? { password: hashedPassword } : {}),
      ...(credentials.name ? { name: credentials.name } : {}),
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  })
}

/**
 * Ensure the configured admin account exists. Used on first sign-in attempt to
 * self-heal deployments that were never explicitly seeded.
 *
 * Only creates the row when it is missing AND the incoming sign-in attempt
 * matches the configured admin email. Existing rows are never modified —
 * promoting an existing self-registered user to admin would be a privilege
 * escalation vector since the signup endpoint is open. To grant admin to an
 * existing account, use the explicit `/api/seed-admin` or `/api/create-admin`
 * endpoints (both gated by `ADMIN_API_KEY`).
 */
export async function ensureAdminUser(attemptedEmail: string): Promise<void> {
  const configured = getConfiguredAdminCredentials()
  if (attemptedEmail.toLowerCase().trim() !== configured.email) return

  const existing = await db.user.findUnique({
    where: { email: configured.email },
    select: { id: true },
  })

  if (existing) return

  await upsertAdminUser(configured, { resetPassword: true })
}

/**
 * True when the given email matches the configured admin email. Used by the
 * signup endpoint to refuse self-registration of the bootstrap admin address.
 */
export function isConfiguredAdminEmail(email: string): boolean {
  if (!email) return false
  return email.toLowerCase().trim() === getConfiguredAdminCredentials().email
}
