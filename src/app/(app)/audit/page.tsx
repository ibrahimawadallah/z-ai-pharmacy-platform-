'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  Activity,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Filter,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type AuditUser = {
  id: string
  email: string | null
  name: string | null
  role: string | null
}

type AuditLog = {
  id: string
  userId: string | null
  action: string
  resource: string | null
  details: unknown
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  user: AuditUser | null
}

type AuditResponse = {
  success: boolean
  scope: 'admin' | 'self'
  data: AuditLog[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
  }
}

const ACTION_OPTIONS = [
  { value: 'all', label: 'All actions' },
  { value: 'ai_consultation', label: 'AI consultation' },
  { value: 'drug_search', label: 'Drug search' },
  { value: 'interaction_check', label: 'Interaction check' },
  { value: 'dosage_calculate', label: 'Dosage calculate' },
  { value: 'icd10_search', label: 'ICD-10 search' },
  { value: 'patient_create', label: 'Patient create' },
  { value: 'patient_view', label: 'Patient view' },
  { value: 'patient_update', label: 'Patient update' },
  { value: 'patient_delete', label: 'Patient delete' },
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
  { value: 'signup', label: 'Signup' },
  { value: 'audit_export', label: 'Audit export' },
]

const ACTION_COLORS: Record<string, string> = {
  ai_consultation: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/30',
  drug_search: 'bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30',
  interaction_check: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30',
  dosage_calculate: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
  patient_create: 'bg-green-500/15 text-green-600 dark:text-green-300 border-green-500/30',
  patient_view: 'bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30',
  patient_update: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border-indigo-500/30',
  patient_delete: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30',
  login: 'bg-teal-500/15 text-teal-600 dark:text-teal-300 border-teal-500/30',
  logout: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-300 border-zinc-500/30',
  signup: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30',
  audit_export: 'bg-orange-500/15 text-orange-600 dark:text-orange-300 border-orange-500/30',
}

export default function AuditLogPage() {
  const { data: session, status } = useSession()
  const role = session?.user?.role ?? null
  const isAdmin = role === 'admin'

  const [action, setAction] = useState<string>('all')
  const [searchText, setSearchText] = useState('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [page, setPage] = useState(1)
  const [limit] = useState(25)

  const [response, setResponse] = useState<AuditResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(limit))
    if (action && action !== 'all') params.set('action', action)
    if (searchText.trim()) params.set('search', searchText.trim())
    if (startDate) params.set('startDate', new Date(startDate).toISOString())
    if (endDate) {
      // End of day for inclusive range
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      params.set('endDate', end.toISOString())
    }
    return params.toString()
  }, [action, searchText, startDate, endDate, page, limit])

  const fetchLogs = useCallback(async () => {
    if (status !== 'authenticated') return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/audit?${queryString}`, { cache: 'no-store' })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const json = (await res.json()) as AuditResponse
      setResponse(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }, [queryString, status])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const onExport = () => {
    const url = `/api/audit?${queryString}&format=csv`
    window.location.href = url
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (status !== 'authenticated') {
    return (
      <div className="max-w-xl mx-auto mt-16">
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <ShieldCheck className="w-10 h-10 mx-auto text-cyan-500" />
            <h1 className="text-xl font-bold">Sign in to view audit logs</h1>
            <p className="text-sm text-muted-foreground">
              Your activity trail is private and accessible only after authentication.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const logs = response?.data ?? []
  const pagination = response?.pagination

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-cyan-500" />
            <h1 className="text-2xl font-bold">Audit Log</h1>
            <Badge variant="outline" className="text-xs">
              {isAdmin ? 'Organization-wide' : 'My activity'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? 'Every clinical action across your organization. Scoped by user, action or date; export a CSV for compliance review.'
              : 'A complete record of your actions in DrugEye. Useful for compliance reviews and tracing your own work.'}
          </p>
        </div>
        <Button
          onClick={onExport}
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={loading || (logs.length === 0 && !error)}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Action
              </label>
              <Select value={action} onValueChange={(v) => { setAction(v); setPage(1) }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Search resource / details
              </label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="e.g. warfarin, patient:abc"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setPage(1)
                      fetchLogs()
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                From
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1) }}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                To
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1) }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0 overflow-hidden">
          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-sm text-rose-500">Failed to load audit logs: {error}</p>
              <Button size="sm" variant="outline" onClick={fetchLogs}>
                Retry
              </Button>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <FileText className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No audit events match these filters.
              </p>
              {(action !== 'all' || searchText || startDate || endDate) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setAction('all')
                    setSearchText('')
                    setStartDate('')
                    setEndDate('')
                    setPage(1)
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold">When</th>
                    <th className="text-left px-4 py-2 font-semibold">Action</th>
                    <th className="text-left px-4 py-2 font-semibold">Resource</th>
                    {isAdmin && (
                      <th className="text-left px-4 py-2 font-semibold">User</th>
                    )}
                    <th className="text-left px-4 py-2 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.map((log) => {
                    const isExpanded = expandedId === log.id
                    const hasDetails = log.details !== null && log.details !== undefined
                    return (
                      <React.Fragment key={log.id}>
                        <tr
                          className="hover:bg-muted/30 cursor-pointer"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : log.id)
                          }
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                ACTION_COLORS[log.action] ?? 'bg-muted text-foreground'
                              }`}
                            >
                              {log.action}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[260px] truncate">
                            {log.resource ?? '—'}
                          </td>
                          {isAdmin && (
                            <td className="px-4 py-3 whitespace-nowrap">
                              {log.user ? (
                                <div className="flex items-center gap-2">
                                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                                  <div>
                                    <div className="text-xs font-medium">
                                      {log.user.name ?? log.user.email ?? '—'}
                                    </div>
                                    {log.user.role && (
                                      <div className="text-[10px] text-muted-foreground uppercase">
                                        {log.user.role}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground italic">
                                  anonymous
                                </span>
                              )}
                            </td>
                          )}
                          <td className="px-4 py-3 text-xs text-muted-foreground max-w-[320px] truncate">
                            {hasDetails ? (
                              <span className="underline decoration-dotted">
                                {isExpanded ? 'Hide' : 'View'}
                              </span>
                            ) : (
                              <span>—</span>
                            )}
                          </td>
                        </tr>
                        {isExpanded && hasDetails && (
                          <tr className="bg-muted/30">
                            <td
                              colSpan={isAdmin ? 5 : 4}
                              className="px-4 py-3 text-xs"
                            >
                              <pre className="whitespace-pre-wrap break-all font-mono bg-background border rounded-md p-3 text-foreground/80">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            Showing{' '}
            <span className="font-semibold text-foreground">
              {(pagination.page - 1) * pagination.limit + 1}
              {'–'}
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-foreground">
              {pagination.total.toLocaleString()}
            </span>{' '}
            events
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={!pagination.hasMore || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
