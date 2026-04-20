'use client'

import { useState } from 'react'
import { SymptomChecker } from '@/components/medical/SymptomChecker'
import { SymptomDrugChecker } from '@/components/medical/SymptomDrugChecker'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DiagnosisPage() {
  const [currentSymptoms, setCurrentSymptoms] = useState<string[]>([])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            AI Diagnosis Assistant
          </h1>
          <p className="mt-1 text-sm md:text-base text-gray-600">
            Enter symptoms for AI-powered differential diagnosis and drug safety checking.
          </p>
        </div>

        <Tabs defaultValue="symptoms" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="symptoms">Symptom Analysis</TabsTrigger>
            <TabsTrigger value="drugs">Drug Safety Check</TabsTrigger>
          </TabsList>

          <TabsContent value="symptoms">
            <SymptomChecker />
          </TabsContent>

          <TabsContent value="drugs">
            <Card className="p-6">
              <SymptomDrugChecker 
                symptoms={currentSymptoms}
                patientConditions={[]}
                patientAllergies={[]}
              />
            </Card>
          </TabsContent>
        </Tabs>

        {/* Integration Note */}
        <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Integration Ready:</strong> Connect this to the AI Drug Analysis mini-service 
            for real-time drug interaction checking with your symptoms.
          </p>
        </Card>
      </div>
    </div>
  )
}
