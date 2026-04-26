'use client'

import React, { useState } from 'react'
import { 
  Baby, Search, Activity, Shield, HeartPulse, AlertCircle, CheckCircle
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useApp, UAEDrug } from '@/providers/AppProvider'
import { toast } from 'sonner'

const GlassCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <div 
    className={`relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-3xl p-8 shadow-2xl ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
    <div className="relative z-10">{children}</div>
  </div>
)

const Badge2 = ({ children, color = "cyan" }: { children: React.ReactNode, color?: "cyan" | "purple" | "pink" | "emerald" | "orange" | "amber" | "red" }) => {
  const colors = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border uppercase ${colors[color]}`}>
      {children}
    </span>
  );
};

const FDA_COLORS: Record<string, string> = {
  'A': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'B': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'C': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'D': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'X': 'bg-red-500/20 text-red-400 border-red-500/30',
  'N': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export default function PregnancyPage() {
  const { language, t } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [drugs, setDrugs] = useState<any[]>([])
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})

  const searchDrugs = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/drugs/pregnancy?category=${selectedCategory || ''}&q=${encodeURIComponent(searchTerm)}&limit=50`)
      const data = await res.json()
      setDrugs(data.data || [])
      if (data.counts) setCategoryCounts(data.counts)
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search drugs. Please try again.')
    }
    setIsLoading(false)
  }

  // Load counts on mount
  React.useEffect(() => {
    searchDrugs()
  }, [])

  return (
    <div className="min-h-screen bg-[#000] text-white font-sans selection:bg-cyan-500/30">
      
      <div className="pt-8 pb-12 px-8 max-w-7xl mx-auto">
        <div
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
        >
          <div>
            <Badge2 color="pink">Maternal Health</Badge2>
            <h1 className="mt-4 text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter italic uppercase">
              Pregnancy <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-500 to-orange-500">Safety</span>
            </h1>
            <p className="mt-4 text-gray-400 text-lg max-w-xl">
              FDA pregnancy categories and lactation safety for UAE medications
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 pb-12 max-w-7xl mx-auto">
        {/* FDA Categories */}
        <GlassCard className="mb-8">
          <h2 className="text-xl font-black italic uppercase mb-6">FDA Pregnancy Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['A', 'B', 'C', 'D', 'X', 'N'].map((cat, i) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); searchDrugs() }}
                className={`p-4 rounded-2xl border text-center cursor-pointer hover:scale-105 transition-transform ${FDA_COLORS[cat]} ${selectedCategory === cat ? 'ring-2 ring-white' : ''}`}
              >
                <div className="text-3xl font-black italic mb-1">{cat}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider">
                  {categoryCounts[cat] || 0} drugs
                </div>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Search */}
        <GlassCard className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-pink-500/20">
              <Baby className="w-6 h-6 text-pink-400" />
            </div>
            <h2 className="text-2xl font-black italic uppercase">Medication Search</h2>
          </div>
          
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
              <Input
                placeholder="Search medications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchDrugs()}
                className="pl-14 h-16 bg-white/5 border-white/10 rounded-2xl text-lg focus-visible:ring-2 focus-visible:ring-pink-500 text-white placeholder:text-gray-600"
              />
            </div>
            <Button 
              onClick={searchDrugs} 
              disabled={isLoading}
              className="h-16 w-16 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg shadow-pink-500/25"
            >
              {isLoading ? <Activity className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
            </Button>
          </div>
        </GlassCard>

        {/* Results */}
        {drugs.length > 0 && (
            <div
            >
              <div className="flex items-center gap-4 mb-6">
                <Badge2 color="pink">{drugs.length} Results</Badge2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drugs.filter(d => d.pregnancyCategory).map((drug, i) => (
                  <div
                    key={drug.id}
                  >
                    <GlassCard >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-black italic uppercase">{drug.packageName}</h3>
                          <p className="text-gray-500 text-sm">{drug.genericName}</p>
                        </div>
                        
                        <Badge className={`${FDA_COLORS[drug.pregnancyCategory || 'N']} font-bold text-lg px-4 py-2`}>
                          {drug.pregnancyCategory}
                        </Badge>
                      </div>
                    </GlassCard>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
