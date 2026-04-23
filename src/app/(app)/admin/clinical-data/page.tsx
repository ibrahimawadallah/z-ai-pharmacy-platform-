'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { 
  Search, Pill, AlertTriangle, Shield, Database,
  CheckCircle, XCircle, Clock, Filter, RefreshCw,
  AlertCircle, Info, ChevronDown, ChevronUp, Eye
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

interface DrugClinicalData {
  id: string
  packageName: string
  genericName: string
  pregnancyCategory: string | null
  pregnancyPrecautions: string | null
  breastfeedingSafety: string | null
  g6pdSafety: string | null
  baseDoseMgPerKg: number | null
  hasWarnings: boolean
  dataSource: string
}

const Badge2 = ({ children, color = "cyan" }: { children: React.ReactNode, color?: string }) => {
  const colors: Record<string, string> = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
  }
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border uppercase ${colors[color] || colors.cyan}`}>
      {children}
    </span>
  )
}

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-xl ${className}`}>
    {children}
  </div>
)

export default function ClinicalDataDashboard() {
  const { data: session, status } = useSession()
  const [drugs, setDrugs] = useState<DrugClinicalData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterDataSource, setFilterDataSource] = useState<string>('all')
  const [selectedDrug, setSelectedDrug] = useState<DrugClinicalData | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchClinicalData()
  }, [])

  const fetchClinicalData = async () => {
    try {
      const response = await fetch('/api/drugs/search?q=&limit=100')
      const data = await response.json()
      
      const enriched = await Promise.all((data.data || []).slice(0, 100).map(async (drug: any) => {
        let dataSource = 'UAE MOH'
        let hasWarnings = false
        
        if (drug.pregnancyCategory === 'X' || drug.pregnancyCategory === 'D') {
          hasWarnings = true
        }
        if (drug.g6pdSafety === 'Contraindicated' || drug.g6pdSafety === 'Caution') {
          hasWarnings = true
        }
        
        return {
          ...drug,
          hasWarnings,
          dataSource
        }
      }))
      
      setDrugs(enriched)
    } catch (error) {
      console.error('Error fetching clinical data:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    try {
      await fetch('/api/admin/populate-clinical?limit=500', { method: 'POST' })
      await fetchClinicalData()
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  if (status === 'loading') return null
  if (!session?.user?.role || session.user.role !== 'admin') {
    redirect('/')
  }

  const filteredDrugs = drugs.filter(drug => {
    const matchesSearch = !searchTerm || 
      drug.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = filterCategory === 'all' || 
      (filterCategory === 'missing' && !drug.pregnancyCategory) ||
      drug.pregnancyCategory === filterCategory
    
    const matchesSource = filterDataSource === 'all' || 
      drug.dataSource === filterDataSource
    
    return matchesSearch && matchesCategory && matchesSource
  })

  const stats = {
    total: drugs.length,
    withPregnancy: drugs.filter(d => d.pregnancyCategory).length,
    withG6PD: drugs.filter(d => d.g6pdSafety).length,
    missingData: drugs.filter(d => !d.pregnancyCategory).length,
    warnings: drugs.filter(d => d.hasWarnings).length,
  }

  const pregnancyColors: Record<string, string> = {
    A: 'emerald',
    B: 'cyan',
    C: 'amber',
    D: 'orange',
    X: 'red',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge2 color="purple">Admin Portal</Badge2>
              <span className="text-xs text-slate-400">Clinical Data Management</span>
            </div>
            <h1 className="text-3xl font-bold">Clinical Data Dashboard</h1>
            <p className="text-slate-400 mt-1">Review and validate drug safety data</p>
          </div>
          <Button 
            onClick={refreshData}
            disabled={refreshing}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-700">
                <Database className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats.total}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Total Drugs</div>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats.withPregnancy}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Pregnancy Data</div>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Shield className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats.withG6PD}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">G6PD Data</div>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats.missingData}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Missing Data</div>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats.warnings}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Warnings</div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Filters */}
        <GlassCard className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search drugs by name or generic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-slate-800 border-slate-700 rounded-xl"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-12 px-4 bg-slate-800 border-slate-700 rounded-xl text-sm"
            >
              <option value="all">All Categories</option>
              <option value="A">Category A</option>
              <option value="B">Category B</option>
              <option value="C">Category C</option>
              <option value="D">Category D</option>
              <option value="X">Category X</option>
              <option value="missing">Missing Data</option>
            </select>
          </div>
        </GlassCard>

        {/* Data Table */}
        <GlassCard>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-400 uppercase text-[10px] font-bold">Drug</TableHead>
                <TableHead className="text-slate-400 uppercase text-[10px] font-bold">Pregnancy</TableHead>
                <TableHead className="text-slate-400 uppercase text-[10px] font-bold">G6PD</TableHead>
                <TableHead className="text-slate-400 uppercase text-[10px] font-bold">Breastfeeding</TableHead>
                <TableHead className="text-slate-400 uppercase text-[10px] font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredDrugs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                    No drugs found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredDrugs.slice(0, 50).map((drug) => (
                  <TableRow key={drug.id} className="border-slate-700/50 hover:bg-slate-800/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{drug.packageName}</div>
                        <div className="text-sm text-slate-400">{drug.genericName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {drug.pregnancyCategory ? (
                        <Badge2 color={pregnancyColors[drug.pregnancyCategory] || 'cyan'}>
                          {drug.pregnancyCategory}
                        </Badge2>
                      ) : (
                        <span className="text-slate-500 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {drug.g6pdSafety ? (
                        <Badge2 color={
                          drug.g6pdSafety === 'Safe' ? 'emerald' :
                          drug.g6pdSafety === 'Caution' ? 'amber' : 'red'
                        }>
                          {drug.g6pdSafety}
                        </Badge2>
                      ) : (
                        <span className="text-slate-500 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {drug.breastfeedingSafety ? (
                        <span className="text-sm text-slate-300 truncate max-w-[200px] block">
                          {drug.breastfeedingSafety}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedDrug(drug)}
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {filteredDrugs.length > 50 && (
            <div className="text-center pt-4 text-slate-400 text-sm">
              Showing 50 of {filteredDrugs.length} drugs. Use search to filter further.
            </div>
          )}
        </GlassCard>

        {/* Detail Modal */}
        {selectedDrug && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <GlassCard className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold">{selectedDrug.packageName}</h2>
                  <p className="text-slate-400">{selectedDrug.genericName}</p>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedDrug(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium">Pregnancy Category</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge2 color={pregnancyColors[selectedDrug.pregnancyCategory || ''] || 'cyan'}>
                      {selectedDrug.pregnancyCategory || 'Not Set'}
                    </Badge2>
                    {selectedDrug.pregnancyPrecautions && (
                      <p className="text-sm text-slate-300">{selectedDrug.pregnancyPrecautions}</p>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="font-medium">G6PD Safety</span>
                  </div>
                  <Badge2 color={
                    selectedDrug.g6pdSafety === 'Safe' ? 'emerald' :
                    selectedDrug.g6pdSafety === 'Caution' ? 'amber' :
                    selectedDrug.g6pdSafety === 'Contraindicated' ? 'red' : 'cyan'
                  }>
                    {selectedDrug.g6pdSafety || 'Not Set'}
                  </Badge2>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-purple-400" />
                    <span className="font-medium">Breastfeeding Safety</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    {selectedDrug.breastfeedingSafety || 'Not Set'}
                  </p>
                </div>

                {selectedDrug.baseDoseMgPerKg && (
                  <div className="p-4 rounded-xl bg-slate-800/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="w-4 h-4 text-emerald-400" />
                      <span className="font-medium">Base Dose</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      {selectedDrug.baseDoseMgPerKg} mg/kg - {selectedDrug.baseDoseIndication}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                  <Database className="w-3 h-3" />
                  <span>Data Source: {selectedDrug.dataSource}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  )
}