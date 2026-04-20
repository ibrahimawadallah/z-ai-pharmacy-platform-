'use client'

import { useState } from 'react'
import { AlertCircle, Shield, FileText, Clock, ChevronDown, ChevronUp, ExternalLink, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function MedicalDisclaimerBanner() {
  return (
    <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 mb-4">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-700 dark:text-amber-400 text-sm font-semibold">
        Educational Content Only
      </AlertTitle>
      <AlertDescription className="text-xs text-amber-600 dark:text-amber-300 mt-1">
        This content is for educational purposes only and should not replace professional medical advice, 
        diagnosis, or treatment. Always consult a qualified healthcare provider for medical decisions.
      </AlertDescription>
    </Alert>
  )
}

export function MedicalDisclaimerFull() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
      <CardHeader className="py-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="flex items-center justify-between text-base text-amber-700 dark:text-amber-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Medical Disclaimer & Content Verification
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0 space-y-4 text-sm">
          {/* Disclaimer */}
          <div className="space-y-2">
            <h4 className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Educational Use Disclaimer
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1 ml-4">
              <li>• This platform is designed for <strong>educational purposes only</strong></li>
              <li>• Content should NOT be used as a substitute for professional medical advice</li>
              <li>• Always verify drug information with official databases before clinical use</li>
              <li>• Medical guidelines and recommendations are subject to change</li>
              <li>• Consult licensed healthcare professionals for patient care decisions</li>
            </ul>
          </div>

          {/* Sources */}
          <div className="space-y-2">
            <h4 className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <FileText className="w-3 h-3" /> Content Sources
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Badge variant="outline" className="justify-center text-xs">
                FDA Drug Database
              </Badge>
              <Badge variant="outline" className="justify-center text-xs">
                WHO EML
              </Badge>
              <Badge variant="outline" className="justify-center text-xs">
                Clinical Guidelines
              </Badge>
              <Badge variant="outline" className="justify-center text-xs">
                Peer-Reviewed Sources
              </Badge>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Content Last Reviewed: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <Button variant="link" size="sm" className="text-xs h-auto p-0" asChild>
              <a href="https://www.fda.gov/drugs" target="_blank" rel="noopener noreferrer">
                Verify on FDA.gov <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          </div>

          {/* Professional Review Notice */}
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>Notice:</strong> All medical content on this platform should be reviewed by 
              qualified pharmacists or physicians before being used for educational purposes. 
              Content creators are encouraged to have their materials professionally verified.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export function VerificationBadge({ 
  isVerified, 
  reviewedBy, 
  reviewDate 
}: { 
  isVerified: boolean
  reviewedBy?: string
  reviewDate?: string
}) {
  if (isVerified) {
    return (
      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Professionally Reviewed {reviewDate && `(${reviewDate})`}
      </Badge>
    )
  }
  
  return (
    <Badge variant="outline" className="border-amber-300 text-amber-600 dark:border-amber-700 dark:text-amber-400">
      <AlertCircle className="w-3 h-3 mr-1" />
      Pending Professional Review
    </Badge>
  )
}
