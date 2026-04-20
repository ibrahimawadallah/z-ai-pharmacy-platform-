'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
// framer-motion removed for SSR compatibility
import { 
  Shield, Languages, Moon, Sun, User, LogIn, Info,
  Search, AlertTriangle, Users, TrendingDown, FileWarning, 
  Microscope, GraduationCap, Sparkles, Pill
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AuthModal } from '@/components/auth/auth-modal'
import { useApp } from '@/providers/AppProvider'
import { ClinicalAIChat } from '@/components/ai/ClinicalAIChat'
import { DrugEyeLogo } from '@/components/logo/DrugEyeLogo'

const navItems = [
  { id: 'search', label: 'Search', labelAr: 'بحث', icon: Search, href: '/search' },
  { id: 'interactions', label: 'Interactions', labelAr: 'تداخلات', icon: AlertTriangle, href: '/interactions' },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const { language, setLanguage, stats, t } = useApp()
  
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
     
    setMounted(true)
    const savedDisclaimer = localStorage.getItem('uae-drug-disclaimer-seen')
    if (savedDisclaimer === 'true') {
      setShowDisclaimer(false)
    }
  }, [])

  const dismissDisclaimer = () => {
    setShowDisclaimer(false)
    localStorage.setItem('uae-drug-disclaimer-seen', 'true')
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-cyan-500/30">
      {/* Medical Disclaimer Banner */}
      {showDisclaimer && (
          <div
            className="relative z-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-xl" />
            <Alert className="rounded-none border-x-0 border-t-0 bg-amber-500/10 border-amber-500/30 backdrop-blur-xl text-foreground">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <AlertTitle className="text-lg font-black italic uppercase">
                    {t.disclaimer}
                  </AlertTitle>
                  <AlertDescription className="text-muted-foreground mt-2">
                    {t.disclaimerText}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                        <Shield className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400">{t.verifiedByPharmacist}</span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={dismissDisclaimer}
                        className="rounded-xl bg-white/10 hover:bg-white/20 text-white border-0"
                      >
                        {language === 'en' ? 'I Understand' : 'فهمت'}
                      </Button>
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </div>
        )}

      {/* Bento-Grid Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/landing" className="flex items-center gap-3 group">
              <DrugEyeLogo size="md" showIcon={true} />
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">UAE MOH</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">APPROVED</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <Languages className="w-4 h-4" />
                <span className="ml-1 text-xs font-bold">{language === 'en' ? 'عربي' : 'EN'}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              
              {status === 'authenticated' ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAuthModal(true)}
                  className="rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground"
                >
                  <User className="w-4 h-4 mr-1" />
                  <span className="text-xs font-bold">{session?.user?.name?.split(' ')[0] || 'User'}</span>
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  onClick={() => setShowAuthModal(true)}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  <span className="text-xs font-bold uppercase tracking-wider">{t.signIn}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="border-b border-border bg-muted/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {[
                { label: language === 'en' ? 'Drugs' : 'دواء', value: stats.active.toLocaleString() },
                { label: 'Thiqa', value: stats.thiqa.toLocaleString() },
                { label: 'Basic', value: stats.basic.toLocaleString() },
                { label: language === 'en' ? 'Interactions' : 'تداخلات', value: stats.interactions.toLocaleString() },
                { label: 'ICD-10', value: stats.icd10Mappings > 0 ? stats.icd10Mappings.toLocaleString() : '...' },
              ].map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <div className="text-lg font-black italic text-cyan-400">{stat.value}</div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
            <Link href="/landing">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl bg-muted/50 border-border hover:bg-muted text-foreground"
              >
                <Info className="w-4 h-4 mr-2" />
                <span className="font-bold text-[10px] uppercase">{language === 'en' ? 'Help' : 'مساعدة'}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-8 py-8 flex-1 flex flex-col">
        {/* Sub-navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <div
                key={item.id}
              >
                <Link 
                  href={item.href} 
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-wider whitespace-nowrap hover:scale-105 active:scale-95 ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' 
                      : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted border border-border'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{language === 'en' ? item.label : item.labelAr}</span>
                </Link>
              </div>
            )
          })}
        </div>

        <div className="flex-1">
          {children}
        </div>
      </main>

      <ClinicalAIChat />

      {/* Bento-Grid Footer */}
      <footer className="border-t border-border bg-muted/30 backdrop-blur-xl py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <DrugEyeLogo size="md" showIcon={false} className="mb-2" />
              <p className="text-muted-foreground text-[10px] uppercase tracking-[0.5em]">Defining the pharmaceutical frontier</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { href: '/pricing', label: 'Pricing' },
                { href: '/safety', label: 'Safety' },
                { href: '/privacy', label: 'Privacy' },
                { href: '/compliance', label: 'Compliance' },
                { href: '/support', label: 'Support' }
              ].map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-cyan-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 mr-1" />
                Premium
              </Badge>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-black uppercase tracking-wider">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
              © 2026 DrugEye Pharmacy Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] border border-border bg-background/90 backdrop-blur-3xl text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-black italic uppercase">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span>{language === 'en' ? 'Account' : 'الحساب'}</span>
            </DialogTitle>
          </DialogHeader>
          <AuthModal language={language} onClose={() => setShowAuthModal(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
