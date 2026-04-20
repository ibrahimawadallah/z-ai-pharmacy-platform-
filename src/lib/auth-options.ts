import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`
}

// Define user role type
export type UserRole = "user" | "pharmacist" | "admin"

// Extend NextAuth types for session user
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
    email: string
    name?: string | null
    image?: string | null
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

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db as any),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        try {
          // Validate credentials exist
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required")
          }

          const normalizedEmail = credentials.email.toLowerCase().trim()

          // Find user by email using prisma
          const user = await db.user.findUnique({
            where: { email: normalizedEmail },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              role: true,
              isVerified: true,
              licenseNumber: true,
              password: true,
            }
          })

          if (!user) {
            console.error("User not found for email:", normalizedEmail)
            throw new Error("Invalid email or password")
          }

          // Check if user has password
          if (!user.password) {
            console.error("User exists but has no password set:", normalizedEmail)
            throw new Error("Invalid email or password")
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.error("Invalid password for user:", normalizedEmail)
            throw new Error("Invalid email or password")
          }

          // Update last login time
          await db.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          })

          // Return user object for session
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role as UserRole,
            isVerified: user.isVerified,
            licenseNumber: user.licenseNumber,
          }
        } catch (error) {
          // Log error for debugging
          console.error("Authentication error:", error)
          
          // Return null to indicate failed authentication
          throw error
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
    newUser: "/auth/register",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in - add user data to token
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        token.role = user.role
        token.isVerified = user.isVerified
        token.licenseNumber = user.licenseNumber
      }

      // Update token when session is updated
      if (trigger === "update" && session) {
        token.name = session.name
        token.image = session.image
      }

      return token
    },

    async session({ session, token }) {
      // Add token data to session
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
        session.user.image = token.picture
        session.user.role = token.role
        session.user.isVerified = token.isVerified
        session.user.licenseNumber = token.licenseNumber
      }

      return session
    },
  },

  events: {
    async signIn({ user }) {
      // User signed in successfully
    },
    async signOut({ token }) {
      // User signed out successfully
    },
  },

  debug: process.env.NODE_ENV === "development",
}
