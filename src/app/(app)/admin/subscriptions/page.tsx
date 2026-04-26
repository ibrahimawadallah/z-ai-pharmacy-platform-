'use client'

import React, { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { 
  Users, CreditCard, TrendingUp, ShieldCheck, Search,
  Crown, Target, Zap, ArrowUpRight
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

const GlassCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <div 
    className={`relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-3xl p-8 shadow-2xl ${className}`} 
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
    <div className="relative z-10">{children}</div>
  </div>
)

const Badge2 = ({ children, color = "cyan" }: { children: React.ReactNode, color?: "cyan" | "purple" | "pink" | "emerald" | "orange" | "amber" }) => {
  const colors = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border uppercase ${colors[color]}`}>
      {children}
    </span>
  );
};

export default function AdminSubscriptionsPage() {
  const { data: session, status } = useSession()
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Fetch subscriptions from API
  const fetchSubscriptions = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/subscriptions')
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions')
      }
      const data = await response.json()
      setSubscriptions(data.subscriptions || [])
    } catch (err) {
      console.error('Error fetching subscriptions:', err)
      setError('Failed to load subscriptions data')
      setSubscriptions([])
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  React.useEffect(() => {
    fetchSubscriptions()
  }, [])

  // Check authentication and authorization
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/login')
    }
  }, [status])

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#000] text-white">Loading...</div>
  }
  
// Check if user is admin
  if (session?.user?.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center bg-[#000] text-white">Access Denied</div>
  }

  const totalRevenue = subscriptions.reduce((sum, s) => sum + (s.revenue || 0), 0)
  const activeUsers = subscriptions.filter(s => s.status === 'active').length

  return (
    <div className="min-h-screen bg-[#000] text-white font-sans selection:bg-cyan-500/30">
      
      <div className="pt-8 pb-12 px-8 max-w-7xl mx-auto">
        <div
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
        >
          <div>
            <Badge2 color="purple">Admin Portal</Badge2>
            <h1 className="mt-4 text-5xl md:text-6xl font-black leading-[0.9] tracking-tighter italic uppercase">
              Subscription <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">Management</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="px-8 pb-12 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <GlassCard >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-cyan-500/20">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <div className="text-3xl font-black italic">{subscriptions.length}</div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Total Users</div>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard delay={0.2}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/20">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-3xl font-black italic">{activeUsers}</div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Active</div>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard delay={0.3}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-purple-500/20">
                <CreditCard className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-3xl font-black italic">${totalRevenue}</div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Monthly Revenue</div>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard delay={0.4}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/20">
                <TrendingUp className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="text-3xl font-black italic">+12%</div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Growth</div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Search */}
        <GlassCard className="mb-8">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 h-14 bg-white/5 border-white/10 rounded-2xl text-white focus-visible:ring-2 focus-visible:ring-purple-500"
              />
            </div>
          </div>
        </GlassCard>

        {/* Table */}
        <GlassCard>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-gray-500 uppercase text-[10px] font-black tracking-widest">User</TableHead>
                <TableHead className="text-gray-500 uppercase text-[10px] font-black tracking-widest">Plan</TableHead>
                <TableHead className="text-gray-500 uppercase text-[10px] font-black tracking-widest">Status</TableHead>
                <TableHead className="text-gray-500 uppercase text-[10px] font-black tracking-widest">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions
                .filter(s => s.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((sub) => (
                <TableRow key={sub.id} className="border-white/5 hover:bg-white/[0.02]">
                  <TableCell>
                    <div>
                      <div className="font-bold text-white">{sub.user.name}</div>
                      <div className="text-sm text-gray-500">{sub.user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge2 color={sub.planId === 'enterprise' ? 'purple' : sub.planId === 'pro' ? 'cyan' : 'emerald'}>
                      {sub.planId.charAt(0).toUpperCase() + sub.planId.slice(1)}
                    </Badge2>
                  </TableCell>
                  <TableCell>
                    <Badge2 color={sub.status === 'active' ? 'emerald' : 'orange'}>
                      {sub.status}
                    </Badge2>
                  </TableCell>
                  <TableCell className="font-bold">${sub.amount}/mo</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GlassCard>
      </div>
    </div>
  )
}
