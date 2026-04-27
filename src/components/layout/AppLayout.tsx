'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
// framer-motion removed for SSR compatibility
import { 
  Shield, Languages, Moon, Sun, User, LogIn, Info,
  Search, Settings, HelpCircle, FileText, Sparkles,
  AlertTriangle, Activity, Pill, Stethoscope, BookOpen,
  Calculator, Bell, ChevronDown, Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AuthModal } from '@/components/auth/auth-modal'
import { useApp } from '@/providers/AppProvider'
import { ClinicalAIChat } from '@/components/ai/ClinicalAIChat'
import { DrugEyeLogo } from '@/components/logo/DrugEyeLogo'

const navItems = [
  { id: 'settings', label: 'Settings', labelAr: 'الإعدادات', icon: Settings, href: '/settings' },
  { id: 'support', label: 'Support', labelAr: 'الدعم', icon: HelpCircle, href: '/support' },
  { id: 'about', label: 'About', labelAr: 'حول', icon: FileText, href: '/about' },
]

const quickTools = [
  { id: 'interactions', label: 'Drug Interactions', labelAr: 'تداخلات الأدوية', icon: Activity, href: '/interactions' },
  { id: 'search', label: 'Drug Search', labelAr: 'بحث الأدوية', icon: Search, href: '/search' },
  { id: 'consultation', label: 'AI Consultation', labelAr: 'استشارة الذكاء الاصطناعي', icon: Stethoscope, href: '/consultation' },
  { id: 'calculator', label: 'Dosage Calculator', labelAr: 'حاسبة الجرعات', icon: Calculator, href: '/calculator' },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const { language, setLanguage, stats, t } = useApp()
  
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [showQuickTools, setShowQuickTools] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

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

      {/* Enhanced Medical Blue Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row - Logo, Search, User Controls */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/landing" className="flex items-center gap-3 group flex-shrink-0">
              <DrugEyeLogo size="md" showIcon={true} />
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">UAE MOH</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary">APPROVED</span>
              </div>
            </Link>
            
            {/* Global Search Bar - Center */}
            <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search drugs, interactions, warnings..." 
                  className="w-full pl-10 h-10 bg-muted/50 border-border rounded-xl text-sm"
                  onFocus={() => window.location.href = '/search'}
                  readOnly
                />
              </div>
            </div>
            
            {/* Right Side Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Language Toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
                title="Toggle Language"
              >
                <Languages className="w-4 h-4" />
                <span className="ml-1 text-xs font-bold hidden sm:inline">{language === 'en' ? 'عربي' : 'EN'}</span>
              </Button>
              
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
                title="Toggle Theme"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              
              {/* Notification Bell */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </Button>
              
              {/* User Menu */}
              {status === 'authenticated' ? (
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
                  >
                    <User className="w-4 h-4 mr-1" />
                    <span className="text-xs font-bold hidden sm:inline">{session?.user?.name?.split(' ')[0] || 'User'}</span>
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-50">
                      <div className="p-2">
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4 text-primary" />
                          <span className="font-medium">{language === 'en' ? 'Settings' : 'الإعدادات'}</span>
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4 text-primary" />
                          <span className="font-medium">{language === 'en' ? 'Profile' : 'الملف الشخصي'}</span>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-destructive/10 text-destructive"
                          onClick={() => {
                            setShowUserMenu(false)
                            // Add sign out logic
                          }}
                        >
                          <LogIn className="w-4 h-4" />
                          <span className="font-medium">{language === 'en' ? 'Sign Out' : 'تسجيل الخروج'}</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  size="sm" 
                  onClick={() => setShowAuthModal(true)}
                  className="rounded-lg bg-primary hover:bg-primary/90 text-white font-bold"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">{t.signIn}</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* Bottom Row - Navigation */}
          <div className="flex items-center justify-between py-2 border-t border-border/50">
            {/* Quick Tools */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuickTools(!showQuickTools)}
                className="rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <Menu className="w-4 h-4 mr-2" />
                <span className="text-xs font-bold">{language === 'en' ? 'Quick Tools' : 'أدوات سريعة'}</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              
              {showQuickTools && (
                <div className="absolute left-0 top-full mt-1 ml-0 w-56 bg-card border border-border rounded-xl shadow-lg z-50">
                  <div className="p-2">
                    {quickTools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={tool.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors"
                        onClick={() => setShowQuickTools(false)}
                      >
                        <tool.icon className="w-4 h-4 text-primary" />
                        <span className="font-medium">{language === 'en' ? tool.label : tool.labelAr}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Navigation Links */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{language === 'en' ? item.label : item.labelAr}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Stats Bar - Medical Blue */}
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
                  <div className="text-lg font-black italic text-primary">{stat.value}</div>
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
        <div className="flex-1">
          {children}
        </div>
      </main>

      <ClinicalAIChat />

      {/* Enhanced Medical Blue Footer */}
      <footer className="border-t border-border bg-muted/30 backdrop-blur-xl py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <DrugEyeLogo size="md" showIcon={false} className="mb-3" />
              <p className="text-muted-foreground text-[10px] uppercase tracking-[0.5em] mb-4">Defining the pharmaceutical frontier</p>
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
                <Badge className="bg-success/10 text-success border-success/20 text-[10px] font-black uppercase tracking-wider">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
            
            {/* Quick Access */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-foreground">{language === 'en' ? 'Quick Access' : 'وصول سريع'}</h3>
              <div className="flex flex-col gap-2">
                {quickTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <tool.icon className="w-3 h-3" />
                    {language === 'en' ? tool.label : tool.labelAr}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Resources */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-foreground">{language === 'en' ? 'Resources' : 'الموارد'}</h3>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <item.icon className="w-3 h-3" />
                    {language === 'en' ? item.label : item.labelAr}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-foreground">{language === 'en' ? 'Legal' : 'قانوني'}</h3>
              <div className="flex flex-col gap-2">
                <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}
                </Link>
                <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}
                </Link>
                <Link href="/disclaimer" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {language === 'en' ? 'Medical Disclaimer' : 'إخلاء مسؤولية طبية'}
                </Link>
                {status === 'authenticated' && (
                  <Link href="/settings" className="text-xs text-primary hover:text-primary/80 transition-colors">
                    {language === 'en' ? 'My Account' : 'حسابي'}
                  </Link>
                )}
              </div>
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
