/**
 * Service Registry - Client for connecting to mini-services
 * Ports:
 * - 3001: AI Drug Analysis
 * - 3002: Clinical Alert Service (WebSocket)
 * - 3003: Audit Processor
 * - 3004: FHIR Sync
 * - 3005: Report Generator
 */

const SERVICE_BASE_URL = process.env.MINI_SERVICES_URL || 'http://localhost'

interface ServiceConfig {
  name: string
  port: number
  healthPath: string
}

const services: Record<string, ServiceConfig> = {
  aiDrugAnalysis: { name: 'AI Drug Analysis', port: 3001, healthPath: '/health' },
  clinicalAlert: { name: 'Clinical Alert', port: 3002, healthPath: '/health' },
  auditProcessor: { name: 'Audit Processor', port: 3003, healthPath: '/health' },
  fhirSync: { name: 'FHIR Sync', port: 3004, healthPath: '/health' },
  reportGenerator: { name: 'Report Generator', port: 3005, healthPath: '/health' }
}

export async function checkServiceHealth(serviceName: keyof typeof services): Promise<boolean> {
  const service = services[serviceName]
  try {
    const response = await fetch(`${SERVICE_BASE_URL}:${service.port}${service.healthPath}`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    })
    return response.ok
  } catch {
    return false
  }
}

export async function checkAllServices(): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {}
  for (const [name, config] of Object.entries(services)) {
    results[name] = await checkServiceHealth(name as keyof typeof services)
  }
  return results
}

// AI Drug Analysis Service
export async function submitDrugAnalysis(
  drugs: Array<{ name: string; dosage?: string; frequency?: string }>,
  patientContext?: {
    age?: number
    weight?: number
    conditions?: string[]
    allergies?: string[]
  },
  analysisType: 'interactions' | 'safety' | 'efficacy' | 'complete' = 'complete'
): Promise<{ success: boolean; jobId?: string; error?: string }> {
  try {
    const response = await fetch(`${SERVICE_BASE_URL}:3001/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drugs, patientContext, analysisType })
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: 'Service unavailable' }
  }
}

export async function getAnalysisResult(jobId: string) {
  try {
    const response = await fetch(`${SERVICE_BASE_URL}:3001/analyze/${jobId}`)
    return await response.json()
  } catch {
    return { success: false, error: 'Service unavailable' }
  }
}

// Clinical Alert Service
export async function generateAlert(alert: {
  type: 'contraindication' | 'interaction' | 'allergy' | 'dosage' | 'duplicate'
  severity: 'critical' | 'warning' | 'info'
  patientId: string
  message: string
  details?: Record<string, unknown>
}): Promise<{ success: boolean; alert?: unknown }> {
  try {
    const response = await fetch(`${SERVICE_BASE_URL}:3002/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert)
    })
    return await response.json()
  } catch {
    return { success: false }
  }
}

export async function getPatientAlerts(patientId: string, includeAcknowledged = false) {
  try {
    const response = await fetch(
      `${SERVICE_BASE_URL}:3002/alerts/patient/${patientId}?all=${includeAcknowledged}`
    )
    return await response.json()
  } catch {
    return { success: false, data: [] }
  }
}

// Audit Processor Service
export async function ingestAuditLog(log: {
  userId?: string
  action: string
  resource?: string
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  createdAt?: string
}): Promise<void> {
  try {
    await fetch(`${SERVICE_BASE_URL}:3003/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log)
    })
  } catch {
    // Silently fail - audit logs should not break main flow
  }
}

export async function analyzeAuditLogs(params: {
  analysisType?: 'summary' | 'anomalies' | 'security' | 'compliance'
  startDate?: string
  endDate?: string
  userId?: string
  action?: string
}) {
  try {
    const response = await fetch(`${SERVICE_BASE_URL}:3003/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    return await response.json()
  } catch {
    return { success: false, error: 'Service unavailable' }
  }
}

// FHIR Sync Service
export async function syncFHIRData(
  hospitalId: string,
  patientId: string,
  fhirUrl: string,
  accessToken?: string
): Promise<{ success: boolean; jobId?: string }> {
  try {
    const response = await fetch(`${SERVICE_BASE_URL}:3004/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hospitalId, patientId, fhirUrl, accessToken })
    })
    return await response.json()
  } catch {
    return { success: false }
  }
}

export async function getFHIRSyncStatus(jobId: string) {
  try {
    const response = await fetch(`${SERVICE_BASE_URL}:3004/sync/${jobId}`)
    return await response.json()
  } catch {
    return { success: false }
  }
}

// Report Generator Service
export async function generateReport(params: {
  type: 'pdf' | 'csv'
  title: string
  data: unknown[]
  columns?: Array<{ header: string; dataKey: string }>
}): Promise<{ success: boolean; jobId?: string }> {
  try {
    const response = await fetch(`${SERVICE_BASE_URL}:3005/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    return await response.json()
  } catch {
    return { success: false }
  }
}

export async function getReportStatus(jobId: string) {
  try {
    const response = await fetch(`${SERVICE_BASE_URL}:3005/jobs/${jobId}`)
    return await response.json()
  } catch {
    return { success: false }
  }
}

// WebSocket connection for real-time alerts
export function createAlertWebSocket(
  onMessage: (data: unknown) => void,
  onConnect?: () => void,
  onDisconnect?: () => void
): WebSocket {
  const ws = new WebSocket(`ws://localhost:3002/ws`)

  ws.onopen = () => {
    console.log('[AlertWS] Connected')
    onConnect?.()
  }

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      onMessage(data)
    } catch {
      console.error('[AlertWS] Invalid message:', event.data)
    }
  }

  ws.onclose = () => {
    console.log('[AlertWS] Disconnected')
    onDisconnect?.()
    // Auto-reconnect after 5 seconds
    setTimeout(() => createAlertWebSocket(onMessage, onConnect, onDisconnect), 5000)
  }

  ws.onerror = (error) => {
    console.error('[AlertWS] Error:', error)
  }

  return ws
}
