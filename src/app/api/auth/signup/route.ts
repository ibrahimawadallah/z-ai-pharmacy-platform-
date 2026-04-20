import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import postgres from 'postgres';

// Validation schema for signup
const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

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

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export async function POST(request: NextRequest) {
  const sql = getSql()
  
  try {
    const body = await request.json();

    // Validate input
    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error.flatten().fieldErrors);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Validation failed: ' + Object.values(validationResult.error.flatten().fieldErrors).flat().join(', '),
          data: { errors: validationResult.error.flatten().fieldErrors },
        },
        { status: 400 }
      );
    }

    const { email, password, name } = validationResult.data;
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await sql`SELECT id FROM "User" WHERE email = ${normalizedEmail}`

    if (existingUser.length > 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'An account with this email already exists',
        },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);

    // Create user
    const insertResult = await sql`
      INSERT INTO "User" (id, email, password, name, role, "isVerified", "licenseNumber", "createdAt")
      VALUES (gen_random_uuid(), ${normalizedEmail}, ${hashedPassword}, ${name}, 'user', false, ${body.licenseNumber || null}, NOW())
      RETURNING id, email, name, role, "isVerified", "createdAt"
    `

    const user = insertResult[0];

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Account created successfully',
        data: { user },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: 'An error occurred during registration',
      },
      { status: 500 }
    );
  } finally {
    await sql.end()
  }
}
