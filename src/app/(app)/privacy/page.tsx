'use client'

import React from 'react'
import { Lock, EyeOff, ShieldCheck, Database, Server, FileCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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

export default function PrivacyPage() {
  const privacyFeatures = [
    { icon: ShieldCheck, title: 'End-to-End Encryption', desc: 'All data is encrypted using AES-256 both in transit and at rest', color: 'bg-emerald-500/20 text-emerald-400' },
    { icon: EyeOff, title: 'No Data Sharing', desc: 'Your clinical data is never shared with third parties', color: 'bg-cyan-500/20 text-cyan-400' },
    { icon: Database, title: 'UAE Data Residency', desc: 'All data stored within UAE borders on certified servers', color: 'bg-purple-500/20 text-purple-400' },
    { icon: Server, title: 'Secure Infrastructure', desc: 'ISO 27001 certified data centers with 24/7 monitoring', color: 'bg-amber-500/20 text-amber-400' },
    { icon: FileCheck, title: 'PDPL Compliant', desc: 'Full compliance with UAE Personal Data Protection Law', color: 'bg-pink-500/20 text-pink-400' },
    { icon: Lock, title: 'Role-Based Access', desc: 'Granular permissions ensure data access only to authorized personnel', color: 'bg-orange-500/20 text-orange-400' },
  ]

  return (
    <div className="min-h-screen bg-[#000] text-white font-sans selection:bg-cyan-500/30">
      
      <div className="pt-8 pb-12 px-8 max-w-7xl mx-auto">
        <div
          className="text-center"
        >
          <Badge2 color="emerald">Data Protection</Badge2>
          <h1 className="mt-4 text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter italic uppercase">
            Privacy <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500">Policy</span>
          </h1>
          <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
            How we protect your data and ensure patient confidentiality in line with UAE Federal Laws
          </p>
        </div>
      </div>

      <div className="px-8 pb-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {privacyFeatures.map((feature, i) => (
            <div
              key={feature.title}
            >
              <GlassCard className="flex items-start gap-4 h-full" >
                <div className={`p-3 rounded-2xl shrink-0 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black italic uppercase mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm">{feature.desc}</p>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
