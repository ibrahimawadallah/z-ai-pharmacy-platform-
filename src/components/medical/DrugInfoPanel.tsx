'use client'

import { useState } from 'react'
import { 
  Search, 
  Database, 
  AlertCircle, 
  ExternalLink, 
  Loader2, 
  Pill,
  FileText,
  AlertTriangle,
  Activity,
  Syringe,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DrugInfoResult {
  brandNames: string[]
  genericNames: string[]
  substanceName: string
  manufacturer: string
  productType: string
  routes: string[]
  pharmacologicClass: string[]
  mechanisms: string[]
  purpose: string[]
  indications: string
  contraindications: string
  warnings: string
  adverseReactions: string
  dosage: string
  mechanismOfAction: string
  pharmacokinetics: string
}

interface DrugAPIResponse {
  success: boolean
  source: string
  lastUpdated: string
  disclaimer: string
  officialLinks: {
    fda: string
    nih: string
  }
  results: DrugInfoResult[]
  error?: string
  fallbackLinks?: {
    fda: string
    nih: string
    who?: string
  }
}

export function DrugInfoPanel() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [drugInfo, setDrugInfo] = useState<DrugAPIResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const searchDrug = async () => {
    if (!searchTerm.trim()) return

    setIsLoading(true)
    setError(null)
    setDrugInfo(null)

    try {
      const response = await fetch(`/api/drug-info?drug=${encodeURIComponent(searchTerm)}`)
      const data: DrugAPIResponse = await response.json()
      setDrugInfo(data)
    } catch (err) {
      setError('Failed to fetch drug information. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Database className="w-4 h-4 text-emerald-600" />
          Real-Time Drug Database
          <Badge variant="outline" className="ml-auto text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Live FDA Data
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Enter drug name (e.g., Amoxicillin, Lisinopril)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchDrug()}
              className="pl-9 h-9"
            />
          </div>
          <Button 
            onClick={searchDrug} 
            disabled={isLoading || !searchTerm.trim()}
            size="sm"
            className="h-9"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>

        {/* Disclaimer */}
        <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <AlertCircle className="h-3 w-3 text-blue-600" />
          <AlertDescription className="text-xs text-blue-700 dark:text-blue-300">
            Data sourced from OpenFDA. Always verify with official sources before clinical use.
          </AlertDescription>
        </Alert>

        {/* Results */}
        {drugInfo && (
          <div className="space-y-3">
            {/* Source Info */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-3 h-3" />
                <span>Source: {drugInfo.source}</span>
              </div>
              <span className="text-muted-foreground">
                Updated: {new Date(drugInfo.lastUpdated).toLocaleString()}
              </span>
            </div>

            {drugInfo.success && drugInfo.results && drugInfo.results.length > 0 ? (
              <ScrollArea className="h-[400px] pr-2">
                <div className="space-y-3">
                  {drugInfo.results.map((result, index) => (
                    <DrugResultCard key={index} result={result} />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-4">
                <AlertCircle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  {drugInfo.error || 'Drug not found in database'}
                </p>
                {drugInfo.fallbackLinks && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button variant="outline" size="sm" asChild>
                      <a href={drugInfo.fallbackLinks.fda} target="_blank" rel="noopener noreferrer">
                        <Database className="w-3 h-3 mr-1" />
                        Search FDA.gov
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={drugInfo.fallbackLinks.nih} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-3 h-3 mr-1" />
                        Search NIH
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Official Links */}
            {drugInfo.officialLinks && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
                  <a href={drugInfo.officialLinks.fda} target="_blank" rel="noopener noreferrer">
                    <Database className="w-3 h-3 mr-1" />
                    Official FDA Page
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
                  <a href={drugInfo.officialLinks.nih} target="_blank" rel="noopener noreferrer">
                    <FileText className="w-3 h-3 mr-1" />
                    NIH Drug Portal
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Quick Links */}
        {!drugInfo && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Quick Drug Lookups:</p>
            <div className="flex flex-wrap gap-1">
              {['Amoxicillin', 'Lisinopril', 'Metformin', 'Atorvastatin'].map((drug) => (
                <Button
                  key={drug}
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    setSearchTerm(drug)
                    setTimeout(searchDrug, 100)
                  }}
                >
                  {drug}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DrugResultCard({ result }: { result: DrugInfoResult }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardContent className="py-3 space-y-3">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-sm flex items-center gap-1">
                <Pill className="w-4 h-4 text-emerald-600" />
                {result.genericNames[0] || result.substanceName || 'Unknown Drug'}
              </h4>
              {result.brandNames.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Brand: {result.brandNames.slice(0, 3).join(', ')}
                </p>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {result.productType}
            </Badge>
          </div>
        </div>

        {/* Pharmacologic Class */}
        {result.pharmacologicClass.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {result.pharmacologicClass.slice(0, 2).map((pc, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {pc}
              </Badge>
            ))}
          </div>
        )}

        {/* Routes */}
        {result.routes.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <Syringe className="w-3 h-3 text-muted-foreground" />
            <span>Routes: {result.routes.join(', ')}</span>
          </div>
        )}

        {/* Expandable Details */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-7 text-xs"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <><ChevronUp className="w-3 h-3 mr-1" /> Show Less</>
          ) : (
            <><ChevronDown className="w-3 h-3 mr-1" /> Show Full Details</>
          )}
        </Button>

        {isExpanded && (
          <div className="space-y-3 pt-2">
            {/* Indications */}
            {result.indications && (
              <DetailSection
                title="Indications"
                icon={<Activity className="w-3 h-3 text-blue-600" />}
                content={result.indications}
              />
            )}

            {/* Mechanism */}
            {result.mechanismOfAction && (
              <DetailSection
                title="Mechanism of Action"
                icon={<Activity className="w-3 h-3 text-purple-600" />}
                content={result.mechanismOfAction}
              />
            )}

            {/* Contraindications */}
            {result.contraindications && (
              <DetailSection
                title="Contraindications"
                icon={<AlertTriangle className="w-3 h-3 text-red-600" />}
                content={result.contraindications}
                variant="warning"
              />
            )}

            {/* Warnings */}
            {result.warnings && (
              <DetailSection
                title="Warnings"
                icon={<AlertTriangle className="w-3 h-3 text-amber-600" />}
                content={result.warnings}
                variant="warning"
              />
            )}

            {/* Dosage */}
            {result.dosage && (
              <DetailSection
                title="Dosage & Administration"
                icon={<FileText className="w-3 h-3 text-emerald-600" />}
                content={result.dosage}
              />
            )}

            {/* Adverse Reactions */}
            {result.adverseReactions && (
              <DetailSection
                title="Adverse Reactions"
                icon={<AlertCircle className="w-3 h-3 text-amber-600" />}
                content={result.adverseReactions}
              />
            )}

            {/* Pharmacokinetics */}
            {result.pharmacokinetics && (
              <DetailSection
                title="Pharmacokinetics"
                icon={<Activity className="w-3 h-3 text-teal-600" />}
                content={result.pharmacokinetics}
              />
            )}

            {/* Manufacturer */}
            <div className="text-xs text-muted-foreground">
              Manufacturer: {result.manufacturer}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DetailSection({ 
  title, 
  icon, 
  content, 
  variant = 'default' 
}: { 
  title: string
  icon: React.ReactNode
  content: string
  variant?: 'default' | 'warning'
}) {
  const bgClass = variant === 'warning' 
    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' 
    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'

  return (
    <div className={`p-2 rounded border ${bgClass}`}>
      <h5 className="font-medium text-xs flex items-center gap-1 mb-1">
        {icon}
        {title}
      </h5>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {content.length > 300 ? content.substring(0, 300) + '...' : content}
      </p>
    </div>
  )
}
