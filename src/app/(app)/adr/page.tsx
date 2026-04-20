'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ShieldAlert, Send, CheckCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function ADRReportingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ 
    drugName: '', 
    patientAge: '', 
    patientGender: '',
    reaction: '', 
    severity: 'moderate',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      toast({ title: 'ADR Report Submitted', description: 'Thank you for your report. It will be reviewed by our team.' })
    }, 1500)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans">
        <div className="px-6 py-8 max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Report Submitted</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Your adverse drug reaction report has been submitted successfully.
            </p>
            <Button onClick={() => setSubmitted(false)}>Submit Another Report</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">Pharmacovigilance</Badge>
              </div>
              <h1 className="text-xl font-semibold">Adverse Drug Reaction Reporting</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Report suspected adverse drug reactions
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drug Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-base font-medium mb-4">Drug Information</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Drug Name</Label>
                <Input
                  value={formData.drugName}
                  onChange={(e) => setFormData({...formData, drugName: e.target.value})}
                  placeholder="Enter drug name"
                  className="mt-1"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Patient Age</Label>
                  <Input
                    type="number"
                    value={formData.patientAge}
                    onChange={(e) => setFormData({...formData, patientAge: e.target.value})}
                    placeholder="Years"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Gender</Label>
                  <select
                    value={formData.patientGender}
                    onChange={(e) => setFormData({...formData, patientGender: e.target.value})}
                    className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Reaction Details */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-base font-medium mb-4">Reaction Details</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Adverse Reaction Description</Label>
                <Textarea
                  value={formData.reaction}
                  onChange={(e) => setFormData({...formData, reaction: e.target.value})}
                  placeholder="Describe the adverse reaction..."
                  className="mt-1"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label className="text-sm">Severity</Label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({...formData, severity: e.target.value})}
                  className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                  <option value="life-threatening">Life-threatening</option>
                </select>
              </div>
              
              <div>
                <Label className="text-sm">Additional Details (Optional)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Any other relevant information..."
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-11"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>

          {/* Info Note */}
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Reporting Guidelines</p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Report all suspected adverse drug reactions, including those to established medications. 
                  This helps improve drug safety for all patients.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}