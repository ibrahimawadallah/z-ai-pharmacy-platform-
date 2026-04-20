'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, FileText, MessageCircle } from 'lucide-react'

const supportOptions = [
  { 
    icon: Mail, 
    title: 'Email Support', 
    desc: 'Get answers within 24 hours for non-urgent inquiries',
    action: 'Send Email',
    color: 'bg-primary/10 text-primary'
  },
  { 
    icon: Phone, 
    title: 'Phone Support', 
    desc: '24/7 emergency hotline for urgent clinical questions',
    action: 'Call Now',
    color: 'bg-success/10 text-success'
  },
  { 
    icon: FileText, 
    title: 'Documentation', 
    desc: 'Browse guides, tutorials, and API documentation',
    action: 'View Docs',
    color: 'bg-amber-500/10 text-amber-500'
  },
  { 
    icon: MessageCircle, 
    title: 'Live Chat', 
    desc: 'Chat with our clinical support team in real-time',
    action: 'Start Chat',
    color: 'bg-violet-500/10 text-violet-500'
  }
]

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">Help Center</Badge>
            </div>
            <h1 className="text-xl font-semibold">Clinical Support</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Need assistance? Our support team is here to help
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {supportOptions.map((option, i) => (
            <div key={option.title} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${option.color}`}>
                  <option.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium mb-2">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{option.desc}</p>
                  <Button variant="outline" size="sm">
                    {option.action}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}