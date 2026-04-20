'use client'

import { useState } from 'react'
import { 
  BookOpen, 
  FileText, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  Database,
  Globe,
  Scale,
  Calendar,
  Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ContentSource, Citation, GuidelineReference, DrugDatabaseReference } from '@/types/courses'

interface SourcesAndCitationsProps {
  sources: ContentSource
  lastUpdated: string
  moduleTitle: string
}

export function SourcesAndCitations({ sources, lastUpdated, moduleTitle }: SourcesAndCitationsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="shadow-lg border-slate-200 dark:border-slate-700">
      <CardHeader 
        className="py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-600" />
            Sources & Citations
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {sources.citations.length + sources.guidelines.length} references
            </Badge>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0 space-y-4">
          {/* Last Updated */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Last Updated: {lastUpdated}</span>
          </div>

          <Separator />

          {/* Textbook Citations */}
          {sources.citations.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-blue-600" />
                Primary References
              </h4>
              <ScrollArea className="h-[200px] pr-2">
                <div className="space-y-2">
                  {sources.citations.map((citation) => (
                    <CitationItem key={citation.id} citation={citation} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <Separator />

          {/* Clinical Guidelines */}
          {sources.guidelines.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-1">
                <Scale className="w-3 h-3 text-purple-600" />
                Clinical Guidelines
              </h4>
              <div className="space-y-2">
                {sources.guidelines.map((guideline, index) => (
                  <GuidelineItem key={index} guideline={guideline} />
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Drug Databases */}
          {sources.drugDatabases.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-600" />
                Drug Database References
              </h4>
              <div className="space-y-2">
                {sources.drugDatabases.map((db, index) => (
                  <DrugDatabaseItem key={index} reference={db} />
                ))}
              </div>
            </div>
          )}

          {/* Verification Notice */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border text-xs">
            <p className="text-muted-foreground">
              <strong>Note:</strong> While we strive for accuracy, always verify drug information 
              with the original sources before making clinical decisions. Guidelines and recommendations 
              are updated regularly.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

function CitationItem({ citation }: { citation: Citation }) {
  const typeIcons = {
    textbook: <BookOpen className="w-3 h-3" />,
    guideline: <Scale className="w-3 h-3" />,
    study: <FileText className="w-3 h-3" />,
    database: <Database className="w-3 h-3" />,
    regulatory: <Building2 className="w-3 h-3" />
  }

  const typeColors = {
    textbook: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    guideline: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    study: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    database: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    regulatory: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }

  return (
    <div className="p-2 rounded border bg-white dark:bg-slate-800/50 text-xs">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-1">
            <Badge variant="outline" className={`text-[10px] px-1 py-0 ${typeColors[citation.type]}`}>
              {typeIcons[citation.type]}
              <span className="ml-1 capitalize">{citation.type}</span>
            </Badge>
            <span className="text-muted-foreground">• {citation.year}</span>
          </div>
          <p className="font-medium">{citation.title}</p>
          {citation.authors && (
            <p className="text-muted-foreground">{citation.authors}</p>
          )}
          <p className="text-muted-foreground italic">{citation.source}</p>
        </div>
        {citation.url && (
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
            <a href={citation.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}

function GuidelineItem({ guideline }: { guideline: GuidelineReference }) {
  const levelColors = {
    'class-I': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'class-IIa': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'class-IIb': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'class-III': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }

  return (
    <div className="p-2 rounded border bg-white dark:bg-slate-800/50 text-xs">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] px-1 py-0">
              <Building2 className="w-3 h-3 mr-1" />
              {guideline.organization}
            </Badge>
            <Badge variant="outline" className={`text-[10px] px-1 py-0 ${levelColors[guideline.level]}`}>
              {guideline.level.replace('class-', 'Class ').toUpperCase()}
            </Badge>
            <span className="text-muted-foreground">{guideline.year}</span>
          </div>
          <p className="font-medium">{guideline.title}</p>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
          <a href={guideline.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3 h-3" />
          </a>
        </Button>
      </div>
    </div>
  )
}

function DrugDatabaseItem({ reference }: { reference: DrugDatabaseReference }) {
  const dbColors = {
    FDA: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    WHO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    EMA: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    NIH: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    BNF: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  }

  return (
    <div className="p-2 rounded border bg-white dark:bg-slate-800/50 text-xs">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className={`text-[10px] px-1 py-0 ${dbColors[reference.database]}`}>
              <Database className="w-3 h-3 mr-1" />
              {reference.database}
            </Badge>
          </div>
          <p className="font-medium">{reference.drugName}</p>
          <p className="text-muted-foreground">Last Updated: {reference.lastUpdated}</p>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
          <a href={reference.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3 h-3" />
          </a>
        </Button>
      </div>
    </div>
  )
}

// Quick Reference Links Component
export function QuickReferenceLinks() {
  const references = [
    { name: 'FDA Drug Database', url: 'https://www.accessdata.fda.gov/scripts/cder/daf/', icon: Database },
    { name: 'WHO Essential Medicines', url: 'https://www.who.int/groups/expert-committee-on-selection-and-use-of-essential-medicines', icon: Globe },
    { name: 'NIH Drug Information', url: 'https://druginfo.nlm.nih.gov/', icon: FileText },
    { name: 'Clinical Guidelines', url: 'https://www.ahajournals.org/guidelines', icon: Award }
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {references.map((ref) => (
        <Button
          key={ref.name}
          variant="outline"
          size="sm"
          className="text-xs h-7"
          asChild
        >
          <a href={ref.url} target="_blank" rel="noopener noreferrer">
            <ref.icon className="w-3 h-3 mr-1" />
            {ref.name}
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </Button>
      ))}
    </div>
  )
}
