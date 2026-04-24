'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton, SkeletonTable, SkeletonInline } from '@/components/ui/skeleton-enhanced'
import { LoadingSpinner } from '@/components/ui/progress-enhanced'
import { Plus, Users, Search, UserPlus, FolderOpen } from 'lucide-react'
import Link from 'next/link'

interface Patient {
  id: string
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: string
  mrn?: string
  _count?: { medications: number }
  createdAt: string
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => {
        setPatients(Array.isArray(data.patients) ? data.patients : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.mrn && p.mrn.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const calculateAge = (dob: string) => {
    const birth = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">Clinical Management</Badge>
              </div>
              <h1 className="text-xl font-semibold">Patient Records</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage patient medication histories and clinical profiles
              </p>
            </div>
            
            <Button className="h-10 px-5">
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Search */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name or MRN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{patients.length}</div>
                <div className="text-xs text-muted-foreground">Total Patients</div>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{patients.filter(p => p._count?.medications).length}</div>
                <div className="text-xs text-muted-foreground">With Medications</div>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{new Set(patients.map(p => p.gender)).size}</div>
                <div className="text-xs text-muted-foreground">Gender Groups</div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Patient Records</span>
              <Badge variant="secondary" className="text-xs">{filteredPatients.length}</Badge>
            </div>
          </div>
          
          {loading ? (
            <div className="p-8">
              <SkeletonInline className="mb-4" />
              <SkeletonTable rows={5} />
            </div>
          ) : filteredPatients.length === 0 ? (
            searchTerm ? (
              <EmptyState
                variant="search"
                title="No patients found"
                description="No patients match your search criteria. Try different keywords."
                action={{
                  label: "Clear search",
                  onClick: () => setSearchTerm('')
                }}
              />
            ) : (
              <EmptyState
                variant="patients"
                title="No patients yet"
                description="Add your first patient to start tracking clinical data."
                action={{
                  label: "Add Patient",
                  onClick: () => {}
                }}
              />
            )
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">MRN</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Name</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Gender</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Age</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Medications</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPatients.map(patient => (
                    <tr key={patient.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono">{patient.mrn || '-'}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {patient.firstName} {patient.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm">{patient.gender}</td>
                      <td className="px-6 py-4 text-sm">{calculateAge(patient.dateOfBirth)} years</td>
                      <td className="px-6 py-4 text-sm">
                        <Badge variant="outline" className="text-xs">
                          {patient._count?.medications || 0}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/patients/${patient.id}`}>
                          <Button variant="outline" size="sm" className="h-8">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}