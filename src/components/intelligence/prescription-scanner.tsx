'use client'

import React, { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, AlertTriangle, Loader2, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type ExtractedDrug = {
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  notes?: string;
}

export function PrescriptionScanner({ onScanComplete }: { onScanComplete?: (drugs: ExtractedDrug[]) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [results, setResults] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Ensure it's an image
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG)')
      return
    }

    setFile(selectedFile)
    setError(null)
    setResults(null)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleScan = async () => {
    if (!previewUrl) return

    setIsScanning(true)
    setError(null)

    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: previewUrl })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scan prescription')
      }

      setResults(data)
      if (onScanComplete && data.drugs) {
        onScanComplete(data.drugs)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during scanning')
    } finally {
      setIsScanning(false)
    }
  }

  const clearScan = () => {
    setFile(null)
    setPreviewUrl(null)
    setResults(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <Card className="p-6 border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> 
            Prescription Scanner
          </h3>
          <p className="text-sm text-slate-500">Upload a photo of a prescription to auto-extract medications.</p>
        </div>
        {previewUrl && (
          <Button variant="ghost" size="sm" onClick={clearScan} className="text-slate-500">
            <X className="w-4 h-4 mr-2" /> Clear
          </Button>
        )}
      </div>

      {!previewUrl ? (
        <div 
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="font-medium text-slate-700 dark:text-slate-300">Click to upload or drag and drop</p>
          <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-6 items-start">
            <div className="w-1/3 relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
              <img src={previewUrl} alt="Prescription Preview" className="w-full h-auto object-cover" />
              {isScanning && (
                <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-full shadow-xl">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            <div className="w-2/3 flex flex-col justify-center">
              {!results && !isScanning && !error && (
                <div className="text-center py-8">
                  <Button onClick={handleScan} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                    <Upload className="w-4 h-4 mr-2" /> Start OCR Extraction
                  </Button>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {results && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold">
                      <CheckCircle className="w-5 h-5" /> Extraction Complete
                    </div>
                    <div className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">
                      Confidence: {results.confidence}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {results.drugs?.map((drug: any, i: number) => (
                      <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 text-sm">
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-base">{drug.name}</div>
                        <div className="text-slate-600 dark:text-slate-400 mt-1">
                          {drug.dosage} • {drug.route} • {drug.frequency}
                        </div>
                        {drug.duration && <div className="text-xs text-slate-500 mt-1">Duration: {drug.duration}</div>}
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full" onClick={() => onScanComplete?.(results.drugs)}>
                    Import to Patient Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
