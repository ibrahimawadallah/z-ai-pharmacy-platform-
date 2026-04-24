import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth-options'
import { getOllamaService } from '@/lib/ollama'

// Validation schema for AI audit analysis
const analyzeAuditSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  userId: z.string().optional(),
  action: z.string().optional(),
  maxLogs: z.number().min(1).max(1000).default(100),
  analysisType: z.enum(['summary', 'anomalies', 'security', 'compliance']).default('summary')
})

// Validation schema for logging audit event
const logAuditSchema = z.object({
  action: z.string().min(1, 'Action is required'),
  resource: z.string().optional(),
  details: z.record(z.string(), z.unknown()).optional()
})

// PUT /api/audit/analyze - AI-powered audit log analysis (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const params = analyzeAuditSchema.parse(body)

    // Build where clause
    const where: any = {}
    if (params.action) where.action = params.action
    if (params.userId) where.userId = params.userId
    if (params.startDate || params.endDate) {
      where.createdAt = {}
      if (params.startDate) where.createdAt.gte = new Date(params.startDate)
      if (params.endDate) where.createdAt.lte = new Date(params.endDate)
    }

    // Fetch audit logs
    const logs = await db.auditLog.findMany({
      where,
      take: params.maxLogs,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true }
        }
      }
    })

    if (logs.length === 0) {
      return NextResponse.json({
        success: true,
        data: { analysis: 'No audit logs found for the specified criteria.', logsCount: 0 }
      })
    }

    // Prepare data for AI analysis
    const logsSummary = logs.map(log => ({
      action: log.action,
      resource: log.resource,
      user: log.user?.email || 'Anonymous',
      role: log.user?.role || 'unknown',
      timestamp: log.createdAt,
      ipAddress: log.ipAddress,
      details: log.details ? JSON.parse(log.details) : null
    }))

    // Generate system prompt based on analysis type
    const systemPrompts: Record<string, string> = {
      summary: `You are an audit analysis expert. Analyze the provided audit logs and provide:
1. A concise summary of user activities
2. Key patterns and trends
3. Notable events or actions
Be factual and specific.`,
      anomalies: `You are a security analyst. Examine the audit logs for:
1. Unusual activity patterns
2. Potential security concerns
3. Access anomalies or suspicious behavior
4. Failed actions or errors
Highlight anything that warrants investigation.`,
      security: `You are a cybersecurity expert. Analyze the audit logs for security posture:
1. Authentication patterns (logins, failed attempts)
2. Sensitive resource access
3. Privilege escalation attempts
4. Data access patterns
5. IP address anomalies
Provide security recommendations.`,
      compliance: `You are a compliance officer. Review the audit logs for:
1. Regulatory compliance indicators
2. Data handling practices
3. User access controls
4. Audit trail completeness
5. Policy adherence
Identify any compliance gaps.`
    }

    const systemPrompt = systemPrompts[params.analysisType]
    const userPrompt = `Analyze these ${logs.length} audit logs:\n\n${JSON.stringify(logsSummary, null, 2)}`

    // Call Ollama/Llama for analysis
    const ollama = getOllamaService()
    let analysis: string
    try {
      const isAvailable = await ollama.testConnection()
      if (isAvailable) {
        analysis = await ollama.generateResponse(userPrompt, systemPrompt)
      } else {
        throw new Error('Ollama not available')
      }
    } catch (ollamaErr) {
      console.error('Ollama not available:', ollamaErr)
      const failedCount = logs.filter((l) => {
        try {
          const d = l.details ? JSON.parse(l.details) : null
          return d && (d.error || d.failed === true)
        } catch {
          return false
        }
      }).length
      analysis = `AI analysis unavailable. Found ${logs.length} logs with ${failedCount} failed actions. Please review manually or ensure Ollama is running.`
    }

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        logsCount: logs.length,
        analysisType: params.analysisType,
        dateRange: { start: params.startDate, end: params.endDate }
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Audit analysis error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to analyze audit logs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/audit - Browse audit logs.
 *
 * Admins see every log. Authenticated non-admin users see only their own logs
 * (so clinicians can answer "what did I do last Tuesday?" for compliance) and
 * cannot spoof `userId` to read someone else's activity.
 *
 * Optional query params: page, limit, action, userId (admin only), startDate,
 * endDate, resource, search (matches resource/action/details substring),
 * format=csv (download a CSV of up to 5000 matching rows).
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const isAdmin = session.user.role === 'admin'
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25')))
    const action = searchParams.get('action')?.trim()
    const requestedUserId = searchParams.get('userId')?.trim()
    const resource = searchParams.get('resource')?.trim()
    const search = searchParams.get('search')?.trim()
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const format = (searchParams.get('format') || 'json').toLowerCase()
    const skip = (page - 1) * limit

    // Non-admins are always scoped to their own logs regardless of the requested userId
    const effectiveUserId = isAdmin ? (requestedUserId || undefined) : session.user.id

    type AuditWhere = {
      action?: string
      userId?: string
      resource?: { contains: string; mode: 'insensitive' }
      createdAt?: { gte?: Date; lte?: Date }
      OR?: Array<Record<string, unknown>>
    }
    const where: AuditWhere = {}

    if (action) where.action = action
    if (effectiveUserId) where.userId = effectiveUserId
    if (resource) where.resource = { contains: resource, mode: 'insensitive' }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    if (search) {
      where.OR = [
        { action: { contains: search, mode: 'insensitive' } },
        { resource: { contains: search, mode: 'insensitive' } },
        { details: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (format === 'csv') {
      const logs = await db.auditLog.findMany({
        where,
        take: 5000,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, email: true, name: true, role: true }
          }
        }
      })

      const header = 'timestamp,action,resource,user_email,user_name,user_role,ip_hash,user_agent,details\n'
      const escape = (v: unknown) => {
        if (v === null || v === undefined) return ''
        const s = typeof v === 'string' ? v : JSON.stringify(v)
        return '"' + s.replace(/"/g, '""') + '"'
      }
      const rows = logs.map((l) => {
        const details = l.details ? (() => {
          try { return JSON.parse(l.details) } catch { return l.details }
        })() : null
        return [
          l.createdAt.toISOString(),
          l.action,
          l.resource ?? '',
          l.user?.email ?? '',
          l.user?.name ?? '',
          l.user?.role ?? '',
          l.ipAddress ?? '',
          l.userAgent ?? '',
          details
        ].map(escape).join(',')
      }).join('\n')

      // Self-report the export action (admins downloading compliance data is
      // itself an auditable event).
      try {
        await db.auditLog.create({
          data: {
            userId: session.user.id,
            action: 'audit_export',
            resource: 'audit-csv',
            details: JSON.stringify({ rowCount: logs.length, filters: { action, userId: effectiveUserId, resource, search, startDate, endDate } })
          }
        })
      } catch (err) {
        console.error('audit_export self-log failed:', err)
      }

      return new NextResponse(header + rows, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="drugeye-audit-${new Date().toISOString().slice(0, 10)}.csv"`,
          'Cache-Control': 'no-store'
        }
      })
    }

    const [total, logs] = await Promise.all([
      db.auditLog.count({ where }),
      db.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, email: true, name: true, role: true }
          }
        }
      })
    ])

    return NextResponse.json({
      success: true,
      scope: isAdmin ? 'admin' : 'self',
      data: logs.map((log) => ({
        ...log,
        details: log.details ? (() => {
          try { return JSON.parse(log.details) } catch { return log.details }
        })() : null
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        hasMore: skip + limit < total
      }
    })
  } catch (error) {
    console.error('Get audit logs error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get audit logs' },
      { status: 500 }
    )
  }
}

// POST /api/audit - Log audit event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Allow logging even without session for anonymous actions
    const userId = session?.user?.id || null

    const body = await request.json()
    const validatedData = logAuditSchema.parse(body)

    // Get request metadata
    const headers = request.headers
    const ipAddress = headers.get('x-forwarded-for') || 
                      headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = headers.get('user-agent') || 'unknown'

    // Create audit log
    const auditLog = await db.auditLog.create({
      data: {
        userId,
        action: validatedData.action,
        resource: validatedData.resource,
        details: validatedData.details ? JSON.stringify(validatedData.details) : null,
        ipAddress: typeof ipAddress === 'string' ? ipAddress : ipAddress[0],
        userAgent
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: auditLog.id,
        action: auditLog.action,
        createdAt: auditLog.createdAt
      }
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Log audit error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to log audit event' },
      { status: 500 }
    )
  }
}
