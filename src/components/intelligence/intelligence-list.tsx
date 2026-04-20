"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSecondaryPanel, type SecondaryPanelConfig } from "@/components/intelligence/secondary-panel"

export interface IntelligenceListProps<TItem> {
  title: string
  items: TItem[]
  getKey: (item: TItem) => string
  getLabel: (item: TItem) => string
  renderLabel?: (item: TItem) => React.ReactNode
  renderBadges?: (item: TItem) => React.ReactNode
  getPanel: (item: TItem) => SecondaryPanelConfig
  getAllPanel?: (items: TItem[]) => SecondaryPanelConfig
  headerActions?: React.ReactNode
  initialVisibleCount?: number
  className?: string
}

export function IntelligenceList<TItem>({
  title,
  items,
  getKey,
  getLabel,
  renderLabel,
  renderBadges,
  getPanel,
  getAllPanel,
  headerActions,
  initialVisibleCount = 6,
  className,
}: IntelligenceListProps<TItem>) {
  const { openPanel } = useSecondaryPanel()

  if (!items?.length) return null

  const visibleItems = items.slice(0, initialVisibleCount)
  const canExpand = items.length > initialVisibleCount && Boolean(getAllPanel)

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold">{title}</h4>
        {headerActions ? <div className="flex items-center gap-1">{headerActions}</div> : null}
      </div>
      <div className="space-y-2">
        {visibleItems.map(item => {
          const key = getKey(item)
          const label = getLabel(item)
          return (
            <div
              key={key}
              className="flex items-start justify-between gap-2 rounded-lg border bg-white p-3 dark:bg-slate-900"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{renderLabel ? renderLabel(item) : label}</div>
                {renderBadges ? (
                  <div className="mt-1 flex flex-wrap gap-1">{renderBadges(item)}</div>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                aria-label={`Open ${title} options for ${label}`}
                onClick={() => openPanel(getPanel(item))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )
        })}
        {canExpand ? (
          <div className="flex items-center justify-between gap-2 rounded-lg border bg-white p-3 dark:bg-slate-900">
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate">{`View all (${items.length})`}</div>
              <div className="text-xs text-muted-foreground">Opens in a side panel</div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              aria-label={`View all ${title}`}
              onClick={() => openPanel(getAllPanel!(items))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
