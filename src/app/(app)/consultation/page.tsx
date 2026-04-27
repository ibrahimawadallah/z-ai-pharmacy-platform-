'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Brain, Send, Sparkles, User, Bot, Copy,
  RefreshCw, ThumbsUp, ThumbsDown, AlertTriangle,
  Pill, Activity, FileText, Heart, ChevronDown, MessageSquare,
  Shield, Zap, Clock, CheckCircle, X, Keyboard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { classifyIntent, extractDrugEntities, getIntentDescription } from '@/lib/nlp'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: string[]
  severity?: 'info' | 'warning' | 'critical'
}

const suggestedQueries = [
  "What are the contraindications for Metformin in renal impairment?",
  "Check interactions between Warfarin and Aspirin",
  "What is the pediatric dosing for Amoxicillin?",
  "Compare efficacy of Atorvastatin vs Rosuvastatin",
  "What are the side effects of SSRIs?",
  "Drugs to avoid in pregnancy"
]

const clinicalTools = [
  { icon: AlertTriangle, label: 'Interactions', href: '/interactions', color: 'bg-primary/10 text-primary' },
  { icon: Pill, label: 'Dosage Calc', href: '/dosage', color: 'bg-primary/10 text-primary' },
  { icon: Activity, label: 'Drug Search', href: '/search', color: 'bg-primary/10 text-primary' },
  { icon: Heart, label: 'Side Effects', href: '/adr', color: 'bg-primary/10 text-primary' }
]

function formatClinicalContent(content: string): React.ReactNode {
  const lines = content.split('\n')
  const formatted: React.ReactNode[] = []
  let currentSection: string | null = null
  let currentList: string[] = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Skip empty lines
    if (!line) {
      if (currentList.length > 0) {
        formatted.push(
          <ul key={`list-${i}`} className="ml-4 space-y-1">
            {currentList.map((item, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{item.replace(/^[\+\*]\s*/, '')}</span>
              </li>
            ))}
          </ul>
        )
        currentList = []
      }
      continue
    }
    
    // Check for section headers (bold text with colon)
    if (line.match(/^\*\*.*?\*\*:/)) {
      // Flush any existing list
      if (currentList.length > 0) {
        formatted.push(
          <ul key={`list-${i}`} className="ml-4 space-y-1">
            {currentList.map((item, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{item.replace(/^[\+\*]\s*/, '')}</span>
              </li>
            ))}
          </ul>
        )
        currentList = []
      }
      
      currentSection = line.replace(/\*\*/g, '').replace(/:$/, '')
      formatted.push(
        <div key={`section-${i}`} className="mt-4 mb-2">
          <h4 className="text-sm font-bold text-primary uppercase tracking-wide">{currentSection}</h4>
        </div>
      )
      continue
    }
    
    // Check for list items
    if (line.match(/^[\+\*]\s+/)) {
      currentList.push(line)
      continue
    }
    
    // Regular text
    if (currentList.length > 0) {
      formatted.push(
        <ul key={`list-${i}`} className="ml-4 space-y-1">
          {currentList.map((item, idx) => (
            <li key={idx} className="text-sm flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>{item.replace(/^[\+\*]\s*/, '')}</span>
            </li>
          ))}
        </ul>
      )
      currentList = []
    }
    
    // Format bold text
    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    formatted.push(<p key={`text-${i}`} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />)
  }
  
  // Flush remaining list
  if (currentList.length > 0) {
    formatted.push(
      <ul key="list-final" className="ml-4 space-y-1">
        {currentList.map((item, idx) => (
          <li key={idx} className="text-sm flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>{item.replace(/^[\+\*]\s*/, '')}</span>
          </li>
        ))}
      </ul>
    )
  }
  
  return <div className="space-y-1">{formatted}</div>
}

export default function ConsultationPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Clinical Assistant powered by DrugEye Intelligence. I can help you with:\n\n• **Drug Interactions** - Check for harmful combinations\n• **Dosage Guidance** - Calculate appropriate doses\n• **Contraindications** - Identify safety concerns\n• **Side Effects** - Review adverse reactions\n• **Therapeutic Alternatives** - Compare treatment options\n\nHow can I assist you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentIntent, setCurrentIntent] = useState<string>('')
  const [detectedDrugs, setDetectedDrugs] = useState<string[]>([])
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        document.getElementById('consultation-input')?.focus()
      }
      if (e.key === 'Escape') {
        setInput('')
      }
      if (e.key === '?' && !e.shiftKey) {
        setShowKeyboardShortcuts(!showKeyboardShortcuts)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showKeyboardShortcuts])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    // NLP Analysis
    const intent = classifyIntent(input)
    const drugs = extractDrugEntities(input)
    setCurrentIntent(intent.intent)
    setDetectedDrugs(drugs.map(d => d.name))

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Format messages for the streaming API
      const apiMessages = messages.map(m => ({
        role: m.role,
        content: m.content
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      })

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`)
      }

      // Handle streaming response
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response body')

      let assistantContent = ''
      const assistantId = (Date.now() + 1).toString()

      // Add empty assistant message
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        assistantContent += chunk

        setMessages(prev => {
          const newMessages = [...prev]
          const lastIdx = newMessages.length - 1
          if (newMessages[lastIdx]?.id === assistantId) {
            newMessages[lastIdx] = {
              ...newMessages[lastIdx],
              content: assistantContent
            }
          }
          return newMessages
        })
      }

      // Final update with full content
      setMessages(prev => {
        const newMessages = [...prev]
        const lastIdx = newMessages.length - 1
        if (newMessages[lastIdx]?.id === assistantId) {
          newMessages[lastIdx] = {
            ...newMessages[lastIdx],
            content: assistantContent
          }
        }
        return newMessages
      })
    } catch (error: any) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again. If the issue persists, check your connection.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (query: string) => {
    setInput(query)
  }

  const handleNewChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your AI Clinical Assistant powered by DrugEye Intelligence. How can I assist you today?',
        timestamp: new Date()
      }
    ])
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Clinical Header */}
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Clinical Consultation</h1>
                <p className="text-sm text-muted-foreground">Clinical Decision Support Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
              >
                <Keyboard className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={handleNewChat} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                New Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      {showKeyboardShortcuts && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="px-6 py-3 max-w-7xl mx-auto">
            <div className="flex items-center gap-6 text-sm">
              <span className="font-medium text-blue-800">Shortcuts:</span>
              <span className="text-blue-700"><kbd className="px-2 py-1 bg-white rounded border border-blue-300">Ctrl+K</kbd> Focus input</span>
              <span className="text-blue-700"><kbd className="px-2 py-1 bg-white rounded border border-blue-300">Enter</kbd> Send</span>
              <span className="text-blue-700"><kbd className="px-2 py-1 bg-white rounded border border-blue-300">Esc</kbd> Clear</span>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* Clinical Safety Banner */}
        <Card className="bg-blue-50 border-blue-200 mb-6">
          <CardContent className="py-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="text-sm text-blue-800">
              <strong>Clinical Decision Support:</strong> This AI assistant provides information for reference only.
              Always verify with official prescribing information and consult clinical guidelines.
            </div>
          </CardContent>
        </Card>

        {/* NLP Status Bar */}
        {(currentIntent || detectedDrugs.length > 0) && (
          <Card className="bg-card border-border shadow-sm mb-6">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-4 text-sm">
                {currentIntent && (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground font-medium">Intent:</span>
                    <Badge variant="default" className="bg-primary">{getIntentDescription(currentIntent)}</Badge>
                  </div>
                )}
                {detectedDrugs.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground font-medium">Drugs:</span>
                    <div className="flex gap-1">
                      {detectedDrugs.map((drug, idx) => (
                        <Badge key={idx} variant="outline" className="border-primary text-primary">{drug}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Area */}
        <Card className="bg-card border-border shadow-sm min-h-[500px] flex flex-col">
          <CardContent className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[600px]">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-gradient-to-br from-primary to-blue-600 text-white'
                }`}>
                  {message.role === 'user' ? <User className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
                </div>
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block max-w-[80%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-muted text-foreground'
                  }`}>
                    {message.role === 'assistant' ? formatClinicalContent(message.content) : <p className="text-sm whitespace-pre-wrap">{message.content}</p>}
                  </div>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.sources.map((source, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <FileText className="w-3 h-3 mr-1" />
                          {source}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {message.role === 'assistant' && (
                    <div className="mt-2 flex items-center gap-2">
                      <button className="p-1 hover:bg-muted rounded">
                        <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded">
                        <ThumbsDown className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded">
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <div className="bg-muted rounded-2xl p-4">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Suggested Queries */}
          {messages.length <= 2 && (
            <div className="px-6 pb-4">
              <p className="text-sm text-muted-foreground mb-3">Common clinical questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((query, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleSuggestionClick(query)}
                  >
                    {query.length > 40 ? query.substring(0, 40) + '...' : query}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex gap-3">
              <Input
                id="consultation-input"
                placeholder="Ask about drug interactions, dosages, contraindications... (Ctrl+K)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 h-12 text-base"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isLoading}
                className="h-12 px-6 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <><Clock className="w-4 h-4 mr-2 animate-spin" /></>
                ) : (
                  <><Send className="w-4 h-4 mr-2" />Send</>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Clinical Tools */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {clinicalTools.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${tool.color} flex items-center justify-center`}>
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{tool.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}