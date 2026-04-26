import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

const APP_VERSION = '1.0.0'

// GET /api/health - Health check endpoint with DB ping
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Test database connection
    const dbStart = Date.now()
    await db.$queryRaw`SELECT 1`
    const dbLatency = Date.now() - dbStart

    // Get uptime (approximate since server started)
    const uptime = process.uptime()

    return NextResponse.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'DrugEye Pharmacy Platform',
      version: APP_VERSION,
      uptime: `${Math.floor(uptime)}s`,
      checks: {
        database: {
          status: 'healthy',
          latency: `${dbLatency}ms`
        },
        api: {
          status: 'healthy',
          latency: `${Date.now() - startTime}ms`
        }
      }
    })
  } catch (error: any) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 503 })
  }
}