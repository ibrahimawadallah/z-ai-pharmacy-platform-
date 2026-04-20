import { getServerSession } from "next-auth"
import { authOptions } from "./auth-options"

// Export auth function for server-side use
export const auth = async () => {
  return await getServerSession(authOptions)
}

// Re-export auth options for use elsewhere
export { authOptions }

// Helper function to check if user is authenticated
export async function getAuthSession() {
  return await getServerSession(authOptions)
}

// Helper function to require authentication
export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Authentication required")
  }
  
  return session
}

// Helper function to check user role
export async function requireRole(roles: ("user" | "pharmacist" | "admin")[]) {
  const session = await requireAuth()
  
  if (!roles.includes(session.user?.role as any)) {
    throw new Error("Insufficient permissions")
  }
  
  return session
}

// Helper function to check if user is admin
export async function requireAdmin() {
  return requireRole(["admin"])
}

// Helper function to check if user is pharmacist or admin
export async function requirePharmacistOrAdmin() {
  return requireRole(["pharmacist", "admin"])
}
