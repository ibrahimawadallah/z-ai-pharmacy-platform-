import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import { db } from '@/lib/db';
import { checkRateLimit, getClientIP, getRateLimitHeaders } from '@/lib/rate-limit';

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

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export async function POST(request: NextRequest) {
  // Apply rate limiting (5 requests/15 min for signup)
  const clientIP = getClientIP(request)
  const rateLimitResult = await checkRateLimit(clientIP, '/api/auth/signup')
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too Many Requests', message: `Rate limit exceeded. Try again in ${rateLimitResult.retryAfter} seconds.` },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
    )
  }
  
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
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser) {
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
    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name,
        role: 'user',
        isVerified: false,
        licenseNumber: body.licenseNumber || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        createdAt: true,
      }
    });

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
  }
}
