/**
 * Rate Limiting Utility for UAE Drug Database API
 * 
 * Implements sliding window rate limiting using Prisma
 * Tracks requests by IP address or user ID
 */

import { db } from './db'

// Rate limit configuration per endpoint
export const RATE_LIMITS = {
  '/api/drugs/search': { requests: 60, window: 60 },        // 60 per minute
  '/api/drugs/interactions': { requests: 30, window: 60 },  // 30 per minute
  '/api/auth/signup': { requests: 5, window: 900 },         // 5 per 15 min
  '/api/auth/login': { requests: 10, window: 900 },         // 10 per 15 min
  '/api/favorites': { requests: 30, window: 60 },           // 30 per minute
  '/api/courses': { requests: 20, window: 60 },             // 20 per minute
  '/api/icd10': { requests: 60, window: 60 },               // 60 per minute
  'default': { requests: 100, window: 900 }                 // 100 per 15 min
} as const

export type RateLimitEndpoint = keyof typeof RATE_LIMITS

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetAt: Date
  retryAfter?: number // seconds until reset
}

export interface RateLimitConfig {
  requests: number
  window: number // window in seconds
}

/**
 * Get rate limit configuration for an endpoint
 */
export function getRateLimitConfig(endpoint: string): RateLimitConfig {
  // Check for exact match first
  if (endpoint in RATE_LIMITS) {
    return RATE_LIMITS[endpoint as RateLimitEndpoint]
  }
  
  // Check for prefix match (e.g., /api/drugs/search?q=test matches /api/drugs/search)
  const baseEndpoint = Object.keys(RATE_LIMITS).find(key => 
    key !== 'default' && endpoint.startsWith(key)
  )
  
  if (baseEndpoint) {
    return RATE_LIMITS[baseEndpoint as RateLimitEndpoint]
  }
  
  return RATE_LIMITS.default
}

/**
 * Check rate limit for an identifier (IP or user ID) on an endpoint
 */
export async function checkRateLimit(
  identifier: string,
  endpoint: string
): Promise<RateLimitResult> {
  const config = getRateLimitConfig(endpoint)
  const now = new Date()
  const windowStart = new Date(now.getTime() - config.window * 1000)
  
  try {
    // Try to find existing rate limit record
    const existing = await db.rateLimit.findUnique({
      where: {
        identifier_endpoint: {
          identifier,
          endpoint
        }
      }
    })
    
    if (!existing) {
      // Create new record
      await db.rateLimit.create({
        data: {
          identifier,
          endpoint,
          requests: 1,
          windowStart: now
        }
      })
      
      return {
        success: true,
        limit: config.requests,
        remaining: config.requests - 1,
        resetAt: new Date(now.getTime() + config.window * 1000)
      }
    }
    
    // Check if window has expired - reset if so
    if (existing.windowStart < windowStart) {
      await db.rateLimit.update({
        where: { id: existing.id },
        data: {
          requests: 1,
          windowStart: now
        }
      })
      
      return {
        success: true,
        limit: config.requests,
        remaining: config.requests - 1,
        resetAt: new Date(now.getTime() + config.window * 1000)
      }
    }
    
    // Window is still active - check if limit exceeded
    if (existing.requests >= config.requests) {
      const resetAt = new Date(existing.windowStart.getTime() + config.window * 1000)
      const retryAfter = Math.ceil((resetAt.getTime() - now.getTime()) / 1000)
      
      return {
        success: false,
        limit: config.requests,
        remaining: 0,
        resetAt,
        retryAfter
      }
    }
    
    // Increment request count
    await db.rateLimit.update({
      where: { id: existing.id },
      data: {
        requests: { increment: 1 }
      }
    })
    
    return {
      success: true,
      limit: config.requests,
      remaining: config.requests - existing.requests - 1,
      resetAt: new Date(existing.windowStart.getTime() + config.window * 1000)
    }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    // On error, allow the request (fail open)
    return {
      success: true,
      limit: config.requests,
      remaining: 1,
      resetAt: new Date(now.getTime() + config.window * 1000)
    }
  }
}

/**
 * Clean up expired rate limit entries
 * Should be called periodically (e.g., via cron job or on each request occasionally)
 */
export async function cleanupExpiredRateLimits(): Promise<number> {
  const now = new Date()
  // Delete entries older than the maximum window (15 minutes + buffer)
  const maxWindow = 900 + 60 // 15 minutes + 1 minute buffer
  const cutoff = new Date(now.getTime() - maxWindow * 1000)
  
  try {
    const result = await db.rateLimit.deleteMany({
      where: {
        windowStart: { lt: cutoff }
      }
    })
    
    return result.count
  } catch (error) {
    console.error('Rate limit cleanup failed:', error)
    return 0
  }
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.floor(result.resetAt.getTime() / 1000)),
    ...(result.retryAfter ? { 'Retry-After': String(result.retryAfter) } : {})
  }
}

/**
 * Higher-order function to apply rate limiting to API routes
 */
export function withRateLimit(
  endpoint: string,
  getIdentifier: (request: Request) => string | Promise<string>
) {
  return async function rateLimitedHandler(
    request: Request,
    handler: () => Promise<Response>
  ): Promise<Response> {
    const identifier = await getIdentifier(request)
    const result = await checkRateLimit(identifier, endpoint)
    
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`,
          retryAfter: result.retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...getRateLimitHeaders(result)
          }
        }
      )
    }
    
    const response = await handler()
    
    // Add rate limit headers to response
    const headers = getRateLimitHeaders(result)
    for (const [key, value] of Object.entries(headers)) {
      response.headers.set(key, value)
    }
    
    return response
  }
}

/**
 * Combined identifier getter - uses user ID if authenticated, otherwise IP
 */
export async function getIdentifierFromRequest(
  request: Request,
  userId?: string | null
): Promise<string> {
  if (userId) {
    return `user:${userId}`
  }
  
  const ip = getClientIP(request)
  return `ip:${ip}`
}

/**
 * Extract client IP from request headers
 */
export function getClientIP(request: Request): string {
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP.trim()
  }
  
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  if (cfConnectingIP) {
    return cfConnectingIP.trim()
  }
  
  // Fallback to a default (should not happen in production)
  return 'unknown'
}

/**
 * Middleware-style rate limit check for use in API routes
 */
export async function applyRateLimit(
  request: Request,
  endpoint: string,
  userId?: string | null
): Promise<{ allowed: true } | { allowed: false; response: Response }> {
  const identifier = await getIdentifierFromRequest(request, userId)
  const result = await checkRateLimit(identifier, endpoint)
  
  if (!result.success) {
    return {
      allowed: false,
      response: new Response(
        JSON.stringify({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`,
          retryAfter: result.retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...getRateLimitHeaders(result)
          }
        }
      )
    }
  }
  
  return { allowed: true }
}

// Run cleanup occasionally (1 in 100 requests)
let cleanupCounter = 0
export async function maybeCleanupRateLimits(): Promise<void> {
  cleanupCounter++
  if (cleanupCounter >= 100) {
    cleanupCounter = 0
    await cleanupExpiredRateLimits()
  }
}
