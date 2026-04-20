'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-config'
import { toast } from '@/hooks/use-toast'
import { Crown, Check, Zap, ArrowRight, Loader2 } from 'lucide-react'

const GlassCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className={`relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-3xl p-8 shadow-2xl ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
    <div className="relative z-10">{children}</div>
  </motion.div>
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

export default function PricingPage() {
  const { data: session } = useSession()
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    if (!session) {
      toast({ title: 'Please sign in first', variant: 'destructive' })
      return
    }
    setProcessingId(planId)
    await new Promise(r => setTimeout(r, 1500))
    toast({ title: 'Subscription updated!' })
    setProcessingId(null)
  }

  return (
    <div className="min-h-screen bg-[#000] text-white font-sans selection:bg-cyan-500/30">
      
      <div className="pt-8 pb-12 px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Badge2 color="purple">Subscription Plans</Badge2>
          <h1 className="mt-4 text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter italic uppercase">
            Choose Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">Plan</span>
          </h1>
          <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
            Unlock the full potential of AI-powered pharmaceutical intelligence
          </p>
        </motion.div>
      </div>

      <div className="px-8 pb-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className={`h-full ${i === 1 ? 'border-purple-500/30' : ''}`} delay={0}>
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-2xl ${i === 1 ? 'bg-purple-500/20' : 'bg-white/5'}`}>
                      {i === 1 ? <Crown className="w-6 h-6 text-purple-400" /> : <Zap className="w-6 h-6 text-cyan-400" />}
                    </div>
                    {i === 1 && <Badge2 color="purple">Popular</Badge2>}
                  </div>
                  
                  <h3 className="text-2xl font-black italic uppercase mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-black italic">${plan.price}</span>
                    <span className="text-gray-500 text-sm">/{plan.interval}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-emerald-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={processingId === plan.id}
                    className={`w-full h-14 rounded-xl font-bold uppercase tracking-widest text-[10px] ${
                      i === 1 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {processingId === plan.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <><ArrowRight className="w-4 h-4 mr-2" /> Subscribe</>
                    )}
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
