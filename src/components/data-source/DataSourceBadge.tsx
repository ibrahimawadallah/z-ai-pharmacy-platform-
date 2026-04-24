'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

type BadgeData = {
  moh: { lastSynced: string | null; drugCount: number }
}

function formatSyncDate(iso: string | null): string {
  if (!iso) return 'never'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'unknown'
  return d.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Compact, client-side provenance badge shown on every clinical surface.
 * Reads `/api/data-source` (1h CDN cache), so renders are cheap.
 * Degrades gracefully: if the endpoint fails, the badge simply doesn't
 * render — we never want it to block the surrounding clinical content.
 */
export function DataSourceBadge({
  variant = 'inline',
  className = '',
}: {
  variant?: 'inline' | 'footer'
  className?: string
}) {
  const [data, setData] = useState<BadgeData | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/data-source', { cache: 'force-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled || !json) return
        setData(json)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (!data) return null

  const synced = formatSyncDate(data.moh.lastSynced)
  const count = data.moh.drugCount.toLocaleString()

  if (variant === 'footer') {
    return (
      <div
        className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>
          Powered by UAE MOH registry · {count} drugs · last synced{' '}
          <span className="font-medium text-foreground">{synced}</span> ·{' '}
          <Link href="/data-source" className="underline hover:text-foreground">
            sources
          </Link>
        </span>
      </div>
    )
  }

  return (
    <Link
      href="/data-source"
      className={`inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors ${className}`}
      title="Data sources & freshness"
    >
      <ShieldCheck className="w-3 h-3 text-emerald-500" />
      <span>
        MOH registry · synced <span className="font-medium">{synced}</span>
      </span>
    </Link>
  )
}
