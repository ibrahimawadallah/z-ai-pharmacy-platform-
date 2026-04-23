import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const createPrismaClient = () => {
  // Use DIRECT_URL for local dev (postgres://) and DATABASE_URL for production (prisma://)
  const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL
  
  // If URL starts with prisma://, we can't use it with regular PrismaClient in local dev
  // In that case, we need to use DIRECT_URL
  const effectiveUrl = dbUrl?.startsWith('prisma://') ? process.env.DIRECT_URL : dbUrl
  
  return new PrismaClient({
    datasources: {
      db: {
        url: effectiveUrl
      }
    }
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
