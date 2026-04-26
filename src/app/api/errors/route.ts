import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

// Error logging API endpoint
export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json()
    
    // Log error details
    console.error('Client Error Report:', {
      timestamp: new Date().toISOString(),
      ...errorData
    })

    // Send to Sentry if configured
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(new Error(errorData.error?.message || 'Unknown client error'), {
        tags: {
          context: errorData.context,
          severity: errorData.severity
        },
        extra: errorData
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging failed:', error)
    return NextResponse.json({ error: 'Failed to log error' }, { status: 500 })
  }
}
