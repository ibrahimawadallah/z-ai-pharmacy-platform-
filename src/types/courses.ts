// Enhanced course types with medical verification and citations

export interface Citation {
  id: string
  type: 'textbook' | 'guideline' | 'study' | 'database' | 'regulatory'
  title: string
  authors?: string
  source: string
  year: string
  url?: string
  doi?: string
  accessDate?: string
}

export interface GuidelineReference {
  organization: string
  title: string
  year: string
  url: string
  level: 'class-I' | 'class-IIa' | 'class-IIb' | 'class-III'
}

export interface DrugDatabaseReference {
  database: 'FDA' | 'WHO' | 'EMA' | 'NIH' | 'BNF'
  drugName: string
  lastUpdated: string
  url: string
}

export interface VerificationStatus {
  isVerified: boolean
  reviewedBy?: string
  reviewerCredentials?: string
  reviewDate?: string
  nextReviewDate?: string
  version: string
}

export interface ContentSource {
  citations: Citation[]
  guidelines: GuidelineReference[]
  drugDatabases: DrugDatabaseReference[]
  textReferences: string[]
}

export interface VideoResource {
  id: string
  title: string
  description: string
  duration: string
  source: string
  verifiedSource: boolean
  lastVerified?: string
}

export interface DiagramResource {
  url: string
  title: string
  description: string
  source: string
  license: string
  verifiedSource: boolean
}

export interface ModuleContent {
  id: number
  title: string
  icon: string
  color: string
  lastUpdated: string
  
  writtenContent: {
    introduction: string
    coreConcepts: string[]
    clinicalPearls: string[]
    warnings: string[]
  }
  
  undergraduate: {
    focus: string
    objectives: string[]
    keyPoints: string[]
    simplifiedExplanation: string
    memoryAids: string[]
  }
  
  postgraduate: {
    focus: string
    objectives: string[]
    keyPoints: string[]
    advancedConcepts: string
    evidenceBase: string[]
  }
  
  videos: VideoResource[]
  diagrams: DiagramResource[]
  
  sources: ContentSource
  verification: VerificationStatus
}

export interface CaseStudy {
  title: string
  patient: string
  presentation: string
  findings: string
  questions: string[]
  answers: string[]
  references?: string[]
}

export interface Course {
  id: string
  title: string
  shortTitle: string
  description: string
  icon: string
  color: string
  category: string
  totalModules: number
  duration: string
  level: string
  
  modules: ModuleContent[]
  
  caseStudies: {
    undergraduate: CaseStudy
    postgraduate: CaseStudy
  }
  
  courseSources: ContentSource
  courseVerification: VerificationStatus
}
