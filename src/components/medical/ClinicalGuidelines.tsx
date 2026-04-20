'use client'

import { 
  Award, 
  ExternalLink, 
  Building2, 
  Calendar,
  Globe,
  FileText
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Guideline {
  organization: string
  title: string
  year: string
  url: string
  category: string
}

const clinicalGuidelines: Guideline[] = [
  // Infectious Disease Guidelines
  {
    organization: 'IDSA',
    title: 'Clinical Practice Guidelines for Community-Acquired Pneumonia',
    year: '2024',
    url: 'https://www.idsociety.org/practice-guideline/community-acquired-pneumonia/',
    category: 'Infectious Disease'
  },
  {
    organization: 'IDSA',
    title: 'Guidelines for Antimicrobial Treatment of Urinary Tract Infections',
    year: '2024',
    url: 'https://www.idsociety.org/practice-guideline/uti/',
    category: 'Infectious Disease'
  },
  {
    organization: 'WHO',
    title: 'WHO Clinical Guidelines for Antimicrobial Use',
    year: '2023',
    url: 'https://www.who.int/publications/i/item/9789241548764',
    category: 'Infectious Disease'
  },
  {
    organization: 'CDC',
    title: 'Antibiotic Prescribing and Use Guidelines',
    year: '2024',
    url: 'https://www.cdc.gov/antibiotic-use/index.html',
    category: 'Infectious Disease'
  },
  
  // Cardiovascular Guidelines
  {
    organization: 'ACC/AHA',
    title: 'Guideline for the Management of Hypertension in Adults',
    year: '2017',
    url: 'https://www.ahajournals.org/doi/10.1161/HYP.0000000000000065',
    category: 'Cardiovascular'
  },
  {
    organization: 'ACC/AHA',
    title: 'Guideline for the Management of Heart Failure',
    year: '2022',
    url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000001063',
    category: 'Cardiovascular'
  },
  {
    organization: 'ESC',
    title: 'Guidelines for the Diagnosis and Treatment of Acute Heart Failure',
    year: '2021',
    url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Acute-Heart-Failure',
    category: 'Cardiovascular'
  },
  {
    organization: 'ACC/AHA',
    title: 'Guideline for the Management of Patients With Atrial Fibrillation',
    year: '2023',
    url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000001191',
    category: 'Cardiovascular'
  },
  
  // CNS Guidelines
  {
    organization: 'AAN',
    title: 'Practice Guideline for Treatment of Depression',
    year: '2023',
    url: 'https://www.aan.com/Guidelines/Home/GuidelineDetail/1188',
    category: 'CNS'
  },
  {
    organization: 'NICE',
    title: 'Epilepsy: Diagnosis and Management Guidelines',
    year: '2022',
    url: 'https://www.nice.org.uk/guidance/cg137',
    category: 'CNS'
  },
  
  // Oncology Guidelines
  {
    organization: 'NCCN',
    title: 'Clinical Practice Guidelines in Oncology',
    year: '2024',
    url: 'https://www.nccn.org/professionals/physician_gls/default.aspx',
    category: 'Oncology'
  },
  {
    organization: 'ASCO',
    title: 'Guidelines for Cancer Treatment',
    year: '2024',
    url: 'https://www.asco.org/practice-policies/guidelines',
    category: 'Oncology'
  },
  
  // Endocrine Guidelines
  {
    organization: 'ADA',
    title: 'Standards of Care in Diabetes',
    year: '2024',
    url: 'https://diabetesjournals.org/care/issue/47/Supplement_1',
    category: 'Endocrine'
  },
  {
    organization: 'AACE',
    title: 'Clinical Practice Guidelines for Thyroid Disease',
    year: '2023',
    url: 'https://www.aace.com/clinical-guidelines',
    category: 'Endocrine'
  },
  
  // Respiratory Guidelines
  {
    organization: 'GINA',
    title: 'Global Strategy for Asthma Management and Prevention',
    year: '2024',
    url: 'https://ginasthma.org/gina-reports/',
    category: 'Respiratory'
  },
  {
    organization: 'GOLD',
    title: 'Global Strategy for COPD Diagnosis, Management, and Prevention',
    year: '2024',
    url: 'https://goldcopd.org/2024-gold-report/',
    category: 'Respiratory'
  }
]

const organizationColors: Record<string, string> = {
  'IDSA': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'WHO': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'CDC': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'ACC/AHA': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  'ESC': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'AAN': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  'NICE': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'NCCN': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'ASCO': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'ADA': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  'AACE': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'GINA': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  'GOLD': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
}

export function ClinicalGuidelinesPanel({ category }: { category?: string }) {
  const filteredGuidelines = category 
    ? clinicalGuidelines.filter(g => g.category === category)
    : clinicalGuidelines

  return (
    <Card className="shadow-lg">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Award className="w-4 h-4 text-purple-600" />
          Clinical Practice Guidelines
          <Badge variant="outline" className="ml-auto text-xs">
            {filteredGuidelines.length} Guidelines
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[350px] pr-2">
          <div className="space-y-2">
            {filteredGuidelines.map((guideline, index) => (
              <div key={index}>
                <div className="p-3 rounded-lg border bg-white dark:bg-slate-800/50 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${organizationColors[guideline.organization] || 'bg-slate-100 text-slate-700'}`}
                        >
                          <Building2 className="w-3 h-3 mr-1" />
                          {guideline.organization}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {guideline.year}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm line-clamp-2">{guideline.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{guideline.category}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0" asChild>
                      <a href={guideline.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                {index < filteredGuidelines.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer Links */}
        <div className="mt-4 pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-2">More Guidelines:</p>
          <div className="flex flex-wrap gap-1">
            <Button variant="outline" size="sm" className="text-xs h-7" asChild>
              <a href="https://www.ahajournals.org/guidelines" target="_blank" rel="noopener noreferrer">
                <Globe className="w-3 h-3 mr-1" />
                AHA Guidelines
              </a>
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-7" asChild>
              <a href="https://www.idsociety.org/practice-guideline/" target="_blank" rel="noopener noreferrer">
                <Globe className="w-3 h-3 mr-1" />
                IDSA Guidelines
              </a>
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-7" asChild>
              <a href="https://www.nice.org.uk/guidance" target="_blank" rel="noopener noreferrer">
                <Globe className="w-3 h-3 mr-1" />
                NICE Guidelines
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Compact version for sidebar
export function GuidelinesQuickLinks() {
  return (
    <div className="space-y-2">
      {clinicalGuidelines.slice(0, 5).map((guideline, index) => (
        <a
          key={index}
          href={guideline.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs"
        >
          <FileText className="w-3 h-3 text-muted-foreground" />
          <span className="flex-1 truncate">{guideline.title}</span>
          <ExternalLink className="w-3 h-3 text-muted-foreground" />
        </a>
      ))}
    </div>
  )
}
