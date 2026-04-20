import { NextResponse } from 'next/server'
import postgres from 'postgres'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

// Create postgres client
const getSql = () => {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('No database connection string configured')
  }
  return postgres(connectionString, {
    ssl: 'require',
    max: 1,
  })
}

export async function POST(request: Request) {
  const sql = getSql()
  
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if user exists
    const userResult = await sql`SELECT id FROM "User" WHERE email = ${normalizedEmail}`

    if (userResult.length === 0) {
      return NextResponse.json(
        { message: 'If an account with that email exists, we have sent a password reset link.' },
        { status: 200 }
      )
    }

    // Delete existing tokens
    await sql`DELETE FROM "PasswordResetToken" WHERE email = ${normalizedEmail}`

    // Create new token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await sql`
      INSERT INTO "PasswordResetToken" (id, email, token, "expiresAt", "createdAt")
      VALUES (gen_random_uuid(), ${normalizedEmail}, ${token}, ${expiresAt}, NOW())
    `

    const baseUrl = process.env.NEXTAUTH_URL 
      ? process.env.NEXTAUTH_URL
      : process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000'
    
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`

    await sendPasswordResetEmail(normalizedEmail, resetUrl)

    return NextResponse.json(
      { message: 'If an account with that email exists, we have sent a password reset link.' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Forgot password error:', error)
    console.error('Error stack:', error?.stack)
    console.error('Error message:', error?.message)
    return NextResponse.json(
      { error: 'Failed to process request', details: error?.message },
      { status: 500 }
    )
  } finally {
    await sql.end()
  }
}
