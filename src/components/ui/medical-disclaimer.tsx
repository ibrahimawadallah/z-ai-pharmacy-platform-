'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface MedicalDisclaimerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept: () => void
}

export function MedicalDisclaimer({ open, onOpenChange, onAccept }: MedicalDisclaimerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Medical Disclaimer & Data Quality Notice
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">Important Medical Disclaimer</h3>
            <p className="text-sm text-amber-800">
              DrugEye Clinical Command Center is a clinical decision support tool designed to assist 
              healthcare professionals. It is NOT a substitute for professional clinical judgment, 
              official drug references, or primary medical literature.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Data Quality & Completeness</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Drug data completeness varies by medication</li>
              <li>Always verify information with official sources (FDA, EMA, UAE MOH)</li>
              <li>Data quality indicators show verification status for each drug</li>
              <li>Some drugs may have limited or incomplete clinical data</li>
              <li>Data is regularly updated but may not reflect the most recent changes</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2">Clinical Use Requirements</h3>
            <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
              <li>Only use this tool if you are a licensed healthcare professional</li>
              <li>Always verify critical information with primary sources</li>
              <li>Use professional judgment for all clinical decisions</li>
              <li>Report any data errors or inconsistencies immediately</li>
              <li>Do not rely solely on this tool for patient care</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Data Sources</h3>
            <p className="text-sm text-gray-700">
              Our data is sourced from UAE Ministry of Health drug database, FDA DailyMed, 
              EMA European Medicines Agency, and other official regulatory sources. 
              Data quality indicators show the verification status and source attribution for each drug.
            </p>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>
              By continuing to use DrugEye Clinical Command Center, you acknowledge that you are a 
              licensed healthcare professional and agree to use this tool as a supplementary resource only. 
              You assume full responsibility for all clinical decisions made with or without the use of this tool.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Decline
          </Button>
          <Button onClick={onAccept}>
            I Accept & Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
