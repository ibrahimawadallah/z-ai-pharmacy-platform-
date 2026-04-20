"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSecondaryPanel } from "@/components/intelligence/secondary-panel"

type SearchDrug = {
  id: string
  packageName: string
  genericName: string
  strength: string
  dosageForm: string
  status: string
}

export function IngredientSearchPanel({
  initialQuery,
  onSelectDrugId,
}: {
  initialQuery: string
  onSelectDrugId: (drugId: string) => void
}) {
  const { closePanel } = useSecondaryPanel()
  const [q, setQ] = React.useState(initialQuery)
  const [isLoading, setIsLoading] = React.useState(false)
  const [items, setItems] = React.useState<SearchDrug[]>([])
  const [error, setError] = React.useState<string | null>(null)

  const fetchResults = React.useCallback(async (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) {
      setItems([])
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/drugs/search?q=${encodeURIComponent(trimmed)}&limit=20`)
      const data = await res.json()
      setItems((data.data || []) as SearchDrug[])
    } catch {
      setError("Failed to search")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void fetchResults(initialQuery)
  }, [fetchResults, initialQuery])

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchResults(q)}
            placeholder="Search ingredient…"
            className="pl-10"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {isLoading ? "Searching…" : `${items.length} results`}
          </div>
          <Button type="button" size="sm" variant="outline" onClick={() => fetchResults(q)} disabled={isLoading}>
            Search
          </Button>
        </div>
        {error ? <div className="text-sm text-destructive">{error}</div> : null}
      </div>

      <ScrollArea className="h-[55vh]">
        <div className="space-y-2 pr-2">
          {items.map((drug) => (
            <button
              key={drug.id}
              type="button"
              className="w-full text-left rounded-lg border bg-white p-3 hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors"
              onClick={() => {
                onSelectDrugId(drug.id)
                closePanel()
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{drug.packageName}</div>
                  <div className="text-xs text-muted-foreground truncate">{drug.genericName}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {drug.strength} • {drug.dosageForm}
                  </div>
                </div>
                <div className="shrink-0">
                  <Badge variant={drug.status === "Active" ? "default" : "secondary"} className="text-[10px]">
                    {drug.status}
                  </Badge>
                </div>
              </div>
            </button>
          ))}
          {!isLoading && !items.length && !error ? (
            <div className="text-sm text-muted-foreground">No results</div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  )
}

