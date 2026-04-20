'use client'

import React, { useState } from 'react'
import { 
  BookOpen, Search, ChevronRight, Play, FileText, 
  MessageCircle, Mail, Phone, ExternalLink, Video,
  BookMarked, Lightbulb, Zap, Shield, Users, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface HelpCategory {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  articles: number
}

interface Article {
  id: string
  title: string
  category: string
  readTime: string
}

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories: HelpCategory[] = [
    { id: 'getting-started', title: 'Getting Started', description: 'Learn the basics', icon: <Zap className="w-5 h-5" />, articles: 8 },
    { id: 'drug-search', title: 'Drug Search', description: 'Search and find medications', icon: <Search className="w-5 h-5" />, articles: 12 },
    { id: 'interactions', title: 'Drug Interactions', description: 'Check drug interactions', icon: <Shield className="w-5 h-5" />, articles: 6 },
    { id: 'patients', title: 'Patient Management', description: 'Manage patient records', icon: <Users className="w-5 h-5" />, articles: 10 },
    { id: 'ai-features', title: 'AI Features', description: 'Using AI consultation', icon: <Lightbulb className="w-5 h-5" />, articles: 5 },
    { id: 'account', title: 'Account & Settings', description: 'Manage your account', icon: <BookMarked className="w-5 h-5" />, articles: 4 }
  ]

  const popularArticles: Article[] = [
    { id: '1', title: 'How to search for a drug in the database', category: 'Drug Search', readTime: '2 min' },
    { id: '2', title: 'Understanding drug interaction results', category: 'Interactions', readTime: '5 min' },
    { id: '3', title: 'How to calculate pediatric dosages', category: 'Dosage', readTime: '8 min' },
    { id: '4', title: 'Setting up patient records', category: 'Patients', readTime: '4 min' },
    { id: '5', title: 'Using AI consultation effectively', category: 'AI Features', readTime: '3 min' },
    { id: '6', title: 'Managing your account settings', category: 'Account', readTime: '2 min' }
  ]

  const tutorials = [
    { id: '1', title: 'Getting Started with DrugEye', duration: '3:45', thumbnail: '🎯' },
    { id: '2', title: 'Drug Search Basics', duration: '5:20', thumbnail: '🔍' },
    { id: '3', title: 'Checking Drug Interactions', duration: '4:15', thumbnail: '⚠️' },
    { id: '4', title: 'Patient Management Tutorial', duration: '6:30', thumbnail: '👥' }
  ]

  const faqs = [
    { q: 'How do I access the drug database?', a: 'Simply use the search bar on the main dashboard or navigate to /search. You can search by brand name, generic name, or drug code.' },
    { q: 'Is the drug database updated regularly?', a: 'Yes, our database is synchronized with the UAE Ministry of Health drug database and updated regularly.' },
    { q: 'How accurate are drug interaction warnings?', a: 'Our interaction data is sourced from FDA, MOH, and clinical databases. Always verify with official prescribing information.' },
    { q: 'Can I use this on mobile devices?', a: 'Yes, DrugEye is fully responsive and works on tablets and mobile phones.' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
            <p className="text-gray-500 mb-6">Find answers, guides, and tutorials</p>
            
            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Search for help articles, tutorials, FAQs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-lg bg-gray-50 border-gray-200"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Video Tutorials</h3>
              <p className="text-sm text-gray-500 mt-1">Watch step-by-step guides</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Contact Support</h3>
              <p className="text-sm text-gray-500 mt-1">Get help from our team</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900">API Documentation</h3>
              <p className="text-sm text-gray-500 mt-1">For developers</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Browse by Topic</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <Card 
                key={category.id} 
                className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all cursor-pointer group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                      <p className="text-sm text-gray-500">{category.description}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-cyan-600">
                        <span>{category.articles} articles</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Articles</h2>
          <Card className="bg-white/90 backdrop-blur-sm shadow-md">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {popularArticles.map(article => (
                  <div key={article.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{article.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Badge variant="outline" className="text-xs">{article.category}</Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Video Tutorials */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Video Tutorials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tutorials.map(tutorial => (
              <Card key={tutorial.id} className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center text-4xl relative">
                    {tutorial.thumbnail}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-5 h-5 text-cyan-600 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {tutorial.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900">{tutorial.title}</h4>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <Card className="bg-white/90 backdrop-blur-sm shadow-md">
            <CardContent className="p-6 space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx}>
                  <h4 className="font-medium text-gray-900 mb-2">{faq.q}</h4>
                  <p className="text-sm text-gray-600">{faq.a}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <Card className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Still need help?</h3>
            <p className="text-cyan-100 mb-4">Our support team is available 24/7</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-white text-cyan-600 hover:bg-cyan-50">
                <MessageCircle className="w-4 h-4 mr-2" />
                Live Chat
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}