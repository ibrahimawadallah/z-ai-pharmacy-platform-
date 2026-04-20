import "next-auth"
import "next-auth/jwt"

// User roles for the UAE Drug Database application
export type UserRole = "user" | "pharmacist" | "admin"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: UserRole
      isVerified: boolean
      licenseNumber?: string | null
    }
  }

  interface User {
    id: string
    role: UserRole
    isVerified: boolean
    licenseNumber?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name?: string | null
    picture?: string | null
    role: UserRole
    isVerified: boolean
    licenseNumber?: string | null
  }
}
