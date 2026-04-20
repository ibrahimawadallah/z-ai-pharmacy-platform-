/**
 * Security Utilities for UAE Drug Database API
 * 
 * Provides CSRF protection, input sanitization, IP extraction, and logging
 */

import { db } from './db'
import { randomBytes, createHash } from 'crypto'

// ============================================
// CSRF TOKEN MANAGEMENT
// ============================================

const CSRF_TOKEN_LENGTH = 32
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000 // 1 hour

interface CsrfToken {
  token: string
  expiresAt: Date
}

// In-memory store for CSRF tokens (use Redis in production)
const csrfTokenStore = new Map<string, { token: string; expiresAt: number }>()

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCsrfToken(sessionId?: string): CsrfToken {
  const randomToken = randomBytes(CSRF_TOKEN_LENGTH).toString('hex')
  const timestamp = Date.now()
  const expiresAt = new Date(timestamp + CSRF_TOKEN_EXPIRY)
  
  // Create a hash combining random token with session ID if available
  const tokenData = sessionId 
    ? `${randomToken}:${sessionId}:${timestamp}`
    : `${randomToken}:${timestamp}`
  
  const token = createHash('sha256').update(tokenData).digest('hex')
  
  // Store the token
  csrfTokenStore.set(token, {
    token: randomToken,
    expiresAt: expiresAt.getTime()
  })
  
  // Cleanup expired tokens
  cleanupExpiredCsrfTokens()
  
  return { token, expiresAt }
}

/**
 * Validate a CSRF token
 */
export function validateCsrfToken(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false
  }
  
  const stored = csrfTokenStore.get(token)
  
  if (!stored) {
    return false
  }
  
  // Check if token has expired
  if (stored.expiresAt < Date.now()) {
    csrfTokenStore.delete(token)
    return false
  }
  
  return true
}

/**
 * Consume a CSRF token (validate and remove)
 * Use for one-time tokens
 */
export function consumeCsrfToken(token: string): boolean {
  const isValid = validateCsrfToken(token)
  
  if (isValid) {
    csrfTokenStore.delete(token)
  }
  
  return isValid
}

/**
 * Cleanup expired CSRF tokens
 */
function cleanupExpiredCsrfTokens(): void {
  const now = Date.now()
  let cleaned = 0
  
  for (const [token, data] of csrfTokenStore.entries()) {
    if (data.expiresAt < now) {
      csrfTokenStore.delete(token)
      cleaned++
    }
  }
}

// ============================================
// INPUT SANITIZATION
// ============================================

/**
 * Sanitize a string input by removing dangerous characters and patterns
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  return input
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize unicode
    .normalize('NFKC')
    // Trim whitespace
    .trim()
    // Limit length to prevent DoS
    .slice(0, 10000)
}

/**
 * Sanitize HTML content by escaping dangerous characters
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Sanitize for SQL LIKE queries (escape special characters)
 */
export function sanitizeLikeQuery(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  return input
    .replace(/[%_\\]/g, '\\$&')  // Escape LIKE wildcards
    .replace(/[;'"\\]/g, '')     // Remove potentially dangerous chars
}

/**
 * Sanitize an object recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    // Sanitize the key
    const sanitizedKey = sanitizeString(key)
    
    if (typeof value === 'string') {
      result[sanitizedKey] = sanitizeString(value)
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[sanitizedKey] = sanitizeObject(value as Record<string, unknown>)
    } else if (Array.isArray(value)) {
      result[sanitizedKey] = value.map(item => {
        if (typeof item === 'string') {
          return sanitizeString(item)
        }
        if (typeof item === 'object' && item !== null) {
          return sanitizeObject(item as Record<string, unknown>)
        }
        return item
      })
    } else {
      result[sanitizedKey] = value
    }
  }
  
  return result as T
}

/**
 * Check for potential SQL injection patterns
 */
export function detectSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)/i,
    /(--)|(\/\*)|(\*\/)/,  // SQL comments
    /(\bOR\b|\bAND\b)\s*['"]?\d+['"]?\s*=\s*['"]?\d+/,  // OR 1=1 patterns
    /(['";]\s*)+(SELECT|INSERT|UPDATE|DELETE|DROP)/i,
    /\bEXEC\b|\bEXECUTE\b/i,
    /\bXP_\w+/i,  // Extended stored procedures
    /WAITFOR\s+DELAY/i,
    /BENCHMARK\s*\(/i,
    /SLEEP\s*\(/i
  ]
  
  return sqlPatterns.some(pattern => pattern.test(input))
}

/**
 * Check for potential XSS patterns
 */
export function detectXss(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,  // Event handlers like onclick=
    /<iframe\b/gi,
    /<object\b/gi,
    /<embed\b/gi,
    /<img\b[^>]*onerror/gi,
    /<svg\b[^>]*onload/gi,
    /data:/gi,
    /vbscript:/gi
  ]
  
  return xssPatterns.some(pattern => pattern.test(input))
}

/**
 * Validate and sanitize input for safety
 */
export function validateInputSafety(input: string): { 
  safe: boolean
  sanitized: string
  threats: string[] 
} {
  const threats: string[] = []
  
  if (detectSqlInjection(input)) {
    threats.push('Potential SQL injection detected')
  }
  
  if (detectXss(input)) {
    threats.push('Potential XSS detected')
  }
  
  return {
    safe: threats.length === 0,
    sanitized: sanitizeString(input),
    threats
  }
}

// ============================================
// IP ADDRESS EXTRACTION
// ============================================

/**
 * Extract client IP address from request headers
 * Handles various proxy configurations
 */
export function getClientIP(request: Request): string {
  // Priority order for IP headers
  const ipHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',      // Cloudflare
    'fastly-client-ip',      // Fastly
    'x-client-ip',           // General
    'x-cluster-client-ip',   // GKE
    'x-original-forwarded-for',
    'forwarded-for',
    'forwarded',
    'true-client-ip'         // Akamai
  ]
  
  for (const header of ipHeaders) {
    const value = request.headers.get(header)
    
    if (value) {
      // Handle comma-separated list (X-Forwarded-For can have multiple IPs)
      const ips = value.split(',').map(ip => ip.trim())
      
      // Find the first non-private IP
      for (const ip of ips) {
        if (isValidPublicIP(ip)) {
          return ip
        }
      }
      
      // If no public IP found, return the first one
      if (ips.length > 0 && ips[0]) {
        return ips[0]
      }
    }
  }
  
  // Fallback for development/localhost
  return '127.0.0.1'
}

/**
 * Check if an IP is a valid public IP address
 */
export function isValidPublicIP(ip: string): boolean {
  // IPv4 validation
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.').map(Number)
    
    // Check valid range
    if (parts.some(part => part < 0 || part > 255)) {
      return false
    }
    
    // Exclude private IP ranges
    if (parts[0] === 10) return false                    // 10.0.0.0/8
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return false  // 172.16.0.0/12
    if (parts[0] === 192 && parts[1] === 168) return false  // 192.168.0.0/16
    if (parts[0] === 127) return false                   // Loopback
    if (parts[0] === 169 && parts[1] === 254) return false  // Link-local
    
    return true
  }
  
  // IPv6 validation (basic)
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  if (ipv6Regex.test(ip)) {
    // Exclude loopback and link-local
    if (ip.startsWith('::1') || ip.startsWith('fe80:')) {
      return false
    }
    return true
  }
  
  return false
}

/**
 * Hash an IP address for privacy-safe storage
 */
export function hashIP(ip: string): string {
  const salt = process.env.IP_HASH_SALT || 'uae-drug-db-default-salt'
  return createHash('sha256')
    .update(ip + salt)
    .digest('hex')
    .slice(0, 16)
}

// ============================================
// REQUEST LOGGING
// ============================================

export interface RequestLog {
  timestamp: Date
  method: string
  path: string
  query?: string
  statusCode: number
  duration: number
  ip: string
  userAgent: string
  userId?: string
  error?: string
}

/**
 * Log a request to the database
 */
export async function logRequest(
  request: Request,
  statusCode: number,
  duration: number,
  userId?: string,
  error?: string
): Promise<void> {
  const ip = getClientIP(request)
  const url = new URL(request.url)
  
  const logData: RequestLog = {
    timestamp: new Date(),
    method: request.method,
    path: url.pathname,
    query: url.search.slice(1) || undefined,
    statusCode,
    duration,
    ip: hashIP(ip), // Store hashed IP for privacy
    userAgent: request.headers.get('user-agent')?.slice(0, 500) || 'unknown',
    userId,
    error
  }
  
  // Log to console in development
  if (process.env.NODE_ENV !== 'production' && process.env.DEBUG_LOGS === 'true') {
    console.log('[Request]', JSON.stringify(logData))
  }
  
  // Optionally store in database (uncomment if needed)
  // await db.analyticsEvent.create({
  //   data: {
  //     eventType: 'api_request',
  //     category: 'api',
  //     data: JSON.stringify(logData),
  //     userId
  //   }
  // })
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(
  userId: string | null,
  action: string,
  resource: string | null,
  details: Record<string, unknown> | null,
  request: Request
): Promise<void> {
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent')?.slice(0, 500)
  
  try {
    await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        details: details ? JSON.stringify(details) : null,
        ipAddress: hashIP(ip),
        userAgent
      }
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
  }
}

// ============================================
// SECURITY HEADERS
// ============================================

/**
 * Get security headers for responses
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'"
    ].join('; '),
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  }
}

/**
 * Apply security headers to a response
 */
export function applySecurityHeaders(response: Response): Response {
  const headers = getSecurityHeaders()
  
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value)
  }
  
  return response
}

// ============================================
// REQUEST TIMING
// ============================================

/**
 * Measure request duration
 */
export function createTimer(): () => number {
  const start = performance.now()
  return () => Math.round(performance.now() - start)
}

// ============================================
// COMBINED SECURITY MIDDLEWARE
// ============================================

export interface SecurityContext {
  ip: string
  ipHash: string
  userAgent: string
  startTime: number
  getDuration: () => number
}

/**
 * Create security context for a request
 */
export function createSecurityContext(request: Request): SecurityContext {
  const ip = getClientIP(request)
  const startTime = Date.now()
  
  return {
    ip,
    ipHash: hashIP(ip),
    userAgent: request.headers.get('user-agent') || 'unknown',
    startTime,
    getDuration: () => Date.now() - startTime
  }
}

/**
 * Validate request origin for CSRF protection
 */
export function validateRequestOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  
  // Allow requests with no origin (like mobile apps or curl)
  if (!origin) {
    return true
  }
  
  // Check if origin matches host
  if (host) {
    const allowedOrigins = [
      `https://${host}`,
      `http://${host}`,
      // Add production domains
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined
    ].filter(Boolean)
    
    return allowedOrigins.includes(origin)
  }
  
  return false
}

/**
 * Check if request is from a known bot/crawler
 */
export function isBot(userAgent: string): boolean {
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python-requests/i,
    /postman/i,
    /insomnia/i
  ]
  
  return botPatterns.some(pattern => pattern.test(userAgent))
}
