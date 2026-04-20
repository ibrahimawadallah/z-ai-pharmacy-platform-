'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Pill, Activity, AlertTriangle, ShieldAlert, Loader2, X, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

import { PrescriptionScanner } from '@/components/intelligence/prescription-scanner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function PatientDetailPage({ params }: { params: Promise<{ patientId: string }> }) {
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkingInteractions, setCheckingInteractions] = useState(false)
  const [interactions, setInteractions] = useState<any[]>([])
  const [showInteractions, setShowInteractions] = useState(false)
  const [patientId, setPatientId] = useState<string | null>(null)

  const [showAddMed, setShowAddMed] = useState(false)
  const [isAddingMed, setIsAddingMed] = useState(false)
  const [newMed, setNewMed] = useState({
    drugName: '',
    dosage: '',
    frequency: '',
    route: '',
    startDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    params.then(resolved => {
      setPatientId(resolved.patientId)
    })
  }, [params])

  const fetchPatient = () => {
    if (!patientId) return
    fetch(`/api/patients/${patientId}`)
      .then(res => res.json())
      .then(data => {
        setPatient(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to load patient", err)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (patientId) {
      fetchPatient()
    }
  }, [patientId])

  const runInteractionCheck = async () => {
    if (!patient?.medications || patient.medications.length < 2) {
      alert("Need at least 2 active medications to run an interaction check.");
      return;
    }

    setCheckingInteractions(true);
    setShowInteractions(true);
    
    try {
      const drugIds = patient.medications.map((m: any) => m.drugId).filter(Boolean).join(',');
      const res = await fetch(`/api/drugs/interactions?drugs=${drugIds}`);
      const data = await res.json();
      setInteractions(data.interactions || []);
    } catch (error) {
      console.error("Interaction check failed", error);
    } finally {
      setCheckingInteractions(false);
    }
  }

  const handleAddMedication = async () => {
    if (!newMed.drugName || !newMed.dosage || !newMed.frequency) {
      alert("Please fill in the required fields (Name, Dosage, Frequency).")
      return
    }

    setIsAddingMed(true)
    try {
      const res = await fetch(`/api/patients/${patientId}/medications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newMed,
          drugId: `custom-${Date.now()}` // Fallback if not selected from DB
        })
      })

      if (!res.ok) throw new Error("Failed to add medication")
      
      setShowAddMed(false)
      setNewMed({
        drugName: '',
        dosage: '',
        frequency: '',
        route: '',
        startDate: new Date().toISOString().split('T')[0]
      })
      fetchPatient() // Refresh the list
    } catch (err) {
      console.error(err)
      alert("Error adding medication")
    } finally {
      setIsAddingMed(false)
    }
  }

  const handleBatchImport = async (drugs: any[]) => {
    try {
      for (const drug of drugs) {
        await fetch(`/api/patients/${patientId}/medications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            drugName: drug.name,
            dosage: drug.dosage,
            frequency: drug.frequency,
            route: drug.route || 'Oral',
            startDate: new Date().toISOString().split('T')[0],
            drugId: `ocr-${Date.now()}`
          })
        })
      }
      alert(`Successfully imported ${drugs.length} medications!`)
      fetchPatient()
    } catch (err) {
      console.error("Batch import failed", err)
      alert("Failed to import some medications. Please try manually.")
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="lg:col-span-2 h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!patient) return <div>Patient not found.</div>

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            Patient profile & medication history
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold tracking-tight mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Vitals & Info
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-baseline py-1.5">
                <span className="text-slate-500">MRN</span>
                <span className="font-medium font-mono text-slate-900 dark:text-slate-50">
                  {patient.mrn || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-baseline py-1.5">
                <span className="text-slate-500">DOB</span>
                <span className="font-medium text-slate-900 dark:text-slate-50">
                  {format(new Date(patient.dateOfBirth), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex justify-between items-baseline py-1.5">
                <span className="text-slate-500">Gender</span>
                <span className="font-medium capitalize text-slate-900 dark:text-slate-50">
                  {patient.gender}
                </span>
              </div>
              <div className="flex justify-between items-baseline py-1.5">
                <span className="text-slate-500">Weight</span>
                <span className="font-medium text-slate-900 dark:text-slate-50">
                  {patient.weightKg ? `${patient.weightKg} kg` : '--'}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold tracking-tight mb-4 flex items-center gap-2 text-red-700 dark:text-red-400">
              <ShieldAlert className="w-5 h-5" />
              Clinical alerts
            </h3>
            {patient.allergies?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy: string) => (
                  <span
                    key={allergy}
                    className="px-2 py-1 bg-red-100/90 text-red-800 dark:bg-red-900/40 dark:text-red-300 rounded text-xs font-semibold"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No known allergies recorded.</p>
            )}
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <PrescriptionScanner onScanComplete={handleBatchImport} />

          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-semibold tracking-tight flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-600" /> Active Medications
              </h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className={`text-amber-700 border-amber-200 hover:bg-amber-50 ${
                    checkingInteractions ? 'opacity-80 cursor-default' : ''
                  }`}
                  onClick={runInteractionCheck}
                  disabled={checkingInteractions || patient.medications?.length < 2}
                >
                  {checkingInteractions ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 mr-2" />
                  )}
                  Check Interactions
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowAddMed(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Add Med
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {showInteractions && (
                <div
                  className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-900 dark:text-amber-300" /> 
                      Global interaction report
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowInteractions(false)}
                      className="h-6 w-6 p-0 rounded-full"
                    >
                      <X className="w-4 h-4 text-amber-800" />
                    </Button>
                  </div>
                  
                  {checkingInteractions ? (
                    <div className="flex items-center gap-2 text-sm text-amber-700">
                      <Loader2 className="w-4 h-4 animate-spin" /> Analyzing {patient.medications.length} medications...
                    </div>
                  ) : interactions.length === 0 ? (
                    <div className="text-sm text-emerald-700 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> No known severe interactions found between active medications.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {interactions.map((int, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border text-sm ${
                            int.severity === 'severe'
                              ? 'bg-red-100 text-red-900 border-red-200'
                              : int.severity === 'moderate'
                              ? 'bg-amber-100 text-amber-900 border-amber-200'
                              : 'bg-sky-100 text-sky-900 border-sky-200'
                          }`}
                        >
                          <div className="font-semibold mb-1">
                            {int.drug1} + {int.drug2}
                          </div>
                          <div>{int.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>

            {patient.medications?.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed rounded-xl border-slate-200 dark:border-slate-800">
                <p className="text-slate-500">No active medications for this patient.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {patient.medications.map((med: any) => (
                  <div
                    key={med.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                        {med.drugName}
                      </h4>
                      <p className="text-xs md:text-sm text-slate-500 mt-1">
                        {med.dosage} • {med.route} • {med.frequency}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-slate-400 bg-white dark:bg-slate-950 px-2 py-1 rounded shadow-sm border border-slate-100 dark:border-slate-800">
                        Started {format(new Date(med.startDate), 'MMM d')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <Dialog open={showAddMed} onOpenChange={setShowAddMed}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Medication</DialogTitle>
            <DialogDescription>
              Add a new active medication to this patient's profile.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="drugName" className="text-right">Drug Name</Label>
              <Input 
                id="drugName" 
                value={newMed.drugName} 
                onChange={(e) => setNewMed({...newMed, drugName: e.target.value})} 
                className="col-span-3" 
                placeholder="e.g. Lisinopril"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosage" className="text-right">Dosage</Label>
              <Input 
                id="dosage" 
                value={newMed.dosage} 
                onChange={(e) => setNewMed({...newMed, dosage: e.target.value})} 
                className="col-span-3" 
                placeholder="e.g. 10mg"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="route" className="text-right">Route</Label>
              <Select value={newMed.route} onValueChange={(val) => setNewMed({...newMed, route: val})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Oral">Oral</SelectItem>
                  <SelectItem value="IV">Intravenous (IV)</SelectItem>
                  <SelectItem value="IM">Intramuscular (IM)</SelectItem>
                  <SelectItem value="Subcutaneous">Subcutaneous</SelectItem>
                  <SelectItem value="Topical">Topical</SelectItem>
                  <SelectItem value="Inhalation">Inhalation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">Frequency</Label>
              <Select value={newMed.frequency} onValueChange={(val) => setNewMed({...newMed, frequency: val})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QD (Once daily)">QD (Once daily)</SelectItem>
                  <SelectItem value="BID (Twice daily)">BID (Twice daily)</SelectItem>
                  <SelectItem value="TID (Three times daily)">TID (Three times daily)</SelectItem>
                  <SelectItem value="QID (Four times daily)">QID (Four times daily)</SelectItem>
                  <SelectItem value="PRN (As needed)">PRN (As needed)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">Start Date</Label>
              <Input 
                id="startDate" 
                type="date"
                value={newMed.startDate} 
                onChange={(e) => setNewMed({...newMed, startDate: e.target.value})} 
                className="col-span-3" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMed(false)}>Cancel</Button>
            <Button onClick={handleAddMedication} disabled={isAddingMed}>
              {isAddingMed && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Medication
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
