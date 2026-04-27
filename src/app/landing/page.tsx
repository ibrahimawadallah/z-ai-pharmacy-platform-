'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DrugEyeLogo } from '@/components/logo/DrugEyeLogo';
import { 
  Activity, 
  FileText, 
  Sparkles,
  Bell,
  Menu,
  Heart,
  Stethoscope,
  Shield,
  Brain,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Search
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Consultation',
    desc: '24/7 AI-powered health guidance with real-time drug interaction checking and personalized recommendations.',
    href: '/consultation',
    color: 'bg-primary/10 text-primary'
  },
  {
    icon: Search,
    title: 'Drug Search',
    desc: 'Search 19,000+ UAE-approved medications with detailed information on dosages, interactions, and side effects.',
    href: '/search',
    color: 'bg-primary/10 text-primary'
  },
  {
    icon: Activity,
    title: 'Drug Interactions',
    desc: 'Check potential interactions between multiple medications instantly with AI-powered analysis.',
    href: '/interactions',
    color: 'bg-primary/10 text-primary'
  },
  {
    icon: FileText,
    title: 'Health Reports',
    desc: 'Generate comprehensive health reports with drug analysis and personalized recommendations.',
    href: '/reports',
    color: 'bg-primary/10 text-primary'
  },
  {
    icon: Heart,
    title: 'Favorites',
    desc: 'Save and organize your frequently used medications for quick access.',
    href: '/favorites',
    color: 'bg-primary/10 text-primary'
  },
  {
    icon: Bell,
    title: 'Safety Alerts',
    desc: 'Stay updated with the latest drug safety warnings and recalls from UAE health authorities.',
    href: '/alerts',
    color: 'bg-primary/10 text-primary'
  }
]

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const itemsPerSlide = 3

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(features.length / itemsPerSlide))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? Math.ceil(features.length / itemsPerSlide) - 1 : prev - 1
    )
  }

  const currentFeatures = features.slice(
    currentSlide * itemsPerSlide, 
    (currentSlide + 1) * itemsPerSlide
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <DrugEyeLogo size="sm" variant="default" />
            </Link>
            
            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/consultation" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Consultation</Link>
              <Link href="/search" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Drugs</Link>
              <Link href="/interactions" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Interactions</Link>
              <Link href="/reports" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Reports</Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
                <Menu className="w-5 h-5" />
              </Button>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-md">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">UAE Ministry of Health Approved</span>
            </div>
            
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Clinical Intelligence<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                Powered by AI
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Access 19,000+ UAE-approved medications, check drug interactions instantly, 
              and make safer clinical decisions with AI-powered precision.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all">
                  Search Drugs
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Carousel */}
          <div className="relative mb-16">
            {/* Carousel Navigation */}
            <div className="flex justify-center gap-2 mb-8">
              {Array.from({ length: Math.ceil(features.length / itemsPerSlide) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === idx 
                      ? 'bg-primary w-8' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentFeatures.map((feature, idx) => (
                <Link key={idx} href={feature.href}>
                  <Card className="h-full bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-md cursor-pointer group">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-5">
                        <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md`}>
                          <feature.icon className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Arrow Navigation */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white/80 backdrop-blur-sm border-y border-border py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">19K+</div>
              <div className="text-sm font-medium text-muted-foreground mt-1">UAE Approved Drugs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">24/7</div>
              <div className="text-sm font-medium text-muted-foreground mt-1">AI Support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">500+</div>
              <div className="text-sm font-medium text-muted-foreground mt-1">Partner Pharmacies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">99.9%</div>
              <div className="text-sm font-medium text-muted-foreground mt-1">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-md border border-border">
              <Shield className="w-5 h-5 text-success" />
              <span className="text-sm font-semibold text-foreground">HIPAA Compliant</span>
            </div>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-md border border-border">
              <Stethoscope className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">UAE MOH Approved</span>
            </div>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-md border border-border">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">ISO 27001 Certified</span>
            </div>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-md border border-border">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">GDPR Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <DrugEyeLogo size="sm" variant="default" />
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/safety" className="hover:text-primary transition-colors">Safety</Link>
              <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2026 DrugEye Intelligence. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}