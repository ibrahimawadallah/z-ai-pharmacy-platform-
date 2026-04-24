'use client'

import { useEffect, useState } from 'react'
import {
  Activity,
  Database,
  ExternalLink,
  FlaskConical,
  Pill,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Payload = {
  moh: {
    name: string
    url: string
    lastSynced: string | null
    drugCount: number
    activeDrugCount: number
    pregnancyCategoryCount: number
  }
  interactions: { source: string; count: number; drugPairCount: number }
  sideEffects: { source: string; count: number; drugCoverage: number }
  icd10: { source: string; mappingCount: number; diseaseCount: number }
  generatedAt: string
}

function fmt(n: number): string {
  return n.toLocaleString()
}

function fmtDate(iso: string | null): string {
  if (!iso) return 'Never synced'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'Unknown'
  return d.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function DataSourcePage() {
  const [data, setData] = useState<Payload | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/data-source', { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-sm text-rose-500">
              Failed to load data source metadata: {error}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <h1 className="text-2xl font-bold">Data Sources & Freshness</h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Every clinical answer in DrugEye is grounded in the datasets below.
          This page is the single source of truth for provenance and freshness —
          link to it from compliance audits, regulatory submissions, or
          procurement questionnaires.
        </p>
      </div>

      {/* MOH card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Pill className="w-4 h-4 text-cyan-500" />
            UAE MOH Drug Registry
            <Badge variant="outline" className="text-[10px] ml-auto">
              Primary formulary
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data ? (
            <>
              <p className="text-sm text-muted-foreground">{data.moh.name}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <Stat label="Drugs" value={fmt(data.moh.drugCount)} />
                <Stat label="Active" value={fmt(data.moh.activeDrugCount)} />
                <Stat
                  label="Pregnancy-tagged"
                  value={fmt(data.moh.pregnancyCategoryCount)}
                />
                <Stat label="Last synced" value={fmtDate(data.moh.lastSynced)} />
              </div>
              <a
                href={data.moh.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-500 hover:underline inline-flex items-center gap-1"
              >
                MOHAP registration portal
                <ExternalLink className="w-3 h-3" />
              </a>
            </>
          ) : (
            <Skeleton />
          )}
        </CardContent>
      </Card>

      {/* Interactions card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" />
            Drug–Drug Interactions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data ? (
            <>
              <p className="text-sm text-muted-foreground">
                {data.interactions.source}
              </p>
              <div className="grid grid-cols-2 gap-3 text-center">
                <Stat
                  label="Interaction records"
                  value={fmt(data.interactions.count)}
                />
                <Stat
                  label="Drugs with interaction data"
                  value={fmt(data.interactions.drugPairCount)}
                />
              </div>
            </>
          ) : (
            <Skeleton />
          )}
        </CardContent>
      </Card>

      {/* Side effects card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-rose-500" />
            Side Effects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data ? (
            <>
              <p className="text-sm text-muted-foreground">
                {data.sideEffects.source}
              </p>
              <div className="grid grid-cols-2 gap-3 text-center">
                <Stat
                  label="Side-effect records"
                  value={fmt(data.sideEffects.count)}
                />
                <Stat
                  label="Drugs with side-effect data"
                  value={fmt(data.sideEffects.drugCoverage)}
                />
              </div>
            </>
          ) : (
            <Skeleton />
          )}
        </CardContent>
      </Card>

      {/* ICD-10 card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-indigo-500" />
            ICD-10 & Disease Mapping
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data ? (
            <>
              <p className="text-sm text-muted-foreground">{data.icd10.source}</p>
              <div className="grid grid-cols-2 gap-3 text-center">
                <Stat label="ICD-10 mappings" value={fmt(data.icd10.mappingCount)} />
                <Stat label="Diseases tracked" value={fmt(data.icd10.diseaseCount)} />
              </div>
            </>
          ) : (
            <Skeleton />
          )}
        </CardContent>
      </Card>

      {/* Methodology */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="w-4 h-4" />
            Sync & Methodology
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">Refresh cadence.</strong>{' '}
            The MOHAP registry is re-ingested monthly. Interaction and
            side-effect datasets are refreshed quarterly; new entries are
            back-filled without overwriting clinician annotations.
          </p>
          <p>
            <strong className="text-foreground">Change tracking.</strong>{' '}
            Every ingested row carries a <code>lastChangeDate</code>. The
            &ldquo;last synced&rdquo; value above is the max of those dates —
            i.e. the most recent MOHAP update reflected in the database.
          </p>
          <p>
            <strong className="text-foreground">Clinical review.</strong>{' '}
            AI-generated answers are grounded in the above datasets and must
            never be treated as a substitute for a licensed clinician&rsquo;s
            judgement. DrugEye&rsquo;s consultation flow flags missing data
            rather than fabricating it.
          </p>
          {data && (
            <p className="text-xs">
              This page was generated at{' '}
              <code>{new Date(data.generatedAt).toISOString()}</code>.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/60 bg-muted/30 p-3">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="space-y-2">
      <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
      <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
    </div>
  )
}
