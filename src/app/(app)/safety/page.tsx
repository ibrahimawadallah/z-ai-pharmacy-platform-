'use client'

import React from 'react'
import { ShieldCheck, Lock, Award, Server, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const certifications = [
  { icon: ShieldCheck, title: 'HIPAA Compliant', desc: 'Patient data protection standards' },
  { icon: Lock, title: 'End-to-End Encryption', desc: 'AES-256 encryption for all data' },
  { icon: Award, title: 'ISO 27001', desc: 'Information security management' },
  { icon: Server, title: 'UAE Data Residency', desc: 'All data stored within UAE borders' },
]

const stats = [
  { label: 'Uptime', value: '99.99%' },
  { label: 'Security Audits', value: '24/7' },
  { label: 'Data Backups', value: 'Hourly' },
  { label: 'Compliance', value: '100%' },
]

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">Security & Compliance</Badge>
              </div>
              <h1 className="text-xl font-semibold">Platform Safety</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Security measures and compliance certifications
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-semibold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-medium mb-6">Security Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                  <cert.icon className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">{cert.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Details */}
        <div className="mt-6 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Compliance Details</h2>
          <div className="space-y-4">
            {[
              'All user data is encrypted at rest using AES-256',
              'Data transmission uses TLS 1.3 encryption',
              'Regular third-party security audits',
              'Role-based access control (RBAC)',
              'Complete audit trail for all data access',
              'UAE data residency - no offshore data processing'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-success shrink-0" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}