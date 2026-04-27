'use client'

import React, { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Brain, Send, X, MessageSquare, Shield, Activity, Sparkles, User, Pill, AlertTriangle, Baby, Stethoscope, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/providers/AppProvider'

interface Message {
  role: 'user' | 'assistant'
  content: string
  citations?: string[]
  category?: ClinicalCategory
}

type ClinicalCategory = 
  | 'drug-safety'
  | 'interactions'
  | 'dosage'
  | 'pregnancy'
  | 'general'
  | 'diagnosis'
  | 'guidelines'

const categoryConfig: Record<ClinicalCategory, { label: string; icon: any; color: string }> = {
  'drug-safety': { label: 'Drug Safety', icon: Shield, color: 'bg-red-50 text-red-600 border-red-200' },
  'interactions': { label: 'Interactions', icon: AlertTriangle, color: 'bg-amber-50 text-amber-600 border-amber-200' },
  'dosage': { label: 'Dosage', icon: Pill, color: 'bg-primary/10 text-primary border-primary/20' },
  'pregnancy': { label: 'Pregnancy', icon: Baby, color: 'bg-pink-50 text-pink-600 border-pink-200' },
  'general': { label: 'General', icon: MessageSquare, color: 'bg-muted text-muted-foreground border-border' },
  'diagnosis': { label: 'Diagnosis', icon: Stethoscope, color: 'bg-primary/10 text-primary border-primary/20' },
  'guidelines': { label: 'Guidelines', icon: FileText, color: 'bg-primary/10 text-primary border-primary/20' },
}

function detectCategory(content: string): ClinicalCategory {
  const lower = content.toLowerCase()
  
  if (lower.includes('interaction') || lower.includes('contraindication')) return 'interactions'
  if (lower.includes('pregnancy') || lower.includes('lactation') || lower.includes('breastfeeding')) return 'pregnancy'
  if (lower.includes('dosage') || lower.includes('dose') || lower.includes('mg') || lower.includes('administration')) return 'dosage'
  if (lower.includes('safety') || lower.includes('warning') || lower.includes('adverse') || lower.includes('side effect')) return 'drug-safety'
  if (lower.includes('diagnosis') || lower.includes('symptom') || lower.includes('condition')) return 'diagnosis'
  if (lower.includes('guideline') || lower.includes('protocol') || lower.includes('recommendation')) return 'guidelines'
  
  return 'general'
}

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

export function ClinicalAIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello, I am your Clinical Intelligence Assistant. You can ask me about drug safety, renal adjustments, or pregnancy categories from the UAE MOH database."
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { language } = useApp()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const pathname = usePathname()
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Check if we are on a patient page
    const patientMatch = pathname.match(/\/patients\/([a-zA-Z0-9_-]+)/)
    const patientId = patientMatch ? patientMatch[1] : null

    try {
      // Format messages for the API - include the new user message
      const apiMessages = [
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
      ]

      // Add user message to UI with category detection
      setMessages(prev => [...prev, { 
        role: 'user', 
        content: userMessage,
        category: detectCategory(userMessage)
      }])

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          patientContext: patientId ? { id: patientId } : undefined
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.details || 'Failed to get response')
      }

      // Handle streaming response with tools
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      let assistantContent = ''

      // Add empty assistant message that we'll stream into
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '',
        category: detectCategory(userMessage) // Use the user's question to categorize the response
      }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Decode the chunk
        const chunk = new TextDecoder().decode(value)
        assistantContent += chunk

        // Update the last message with new content
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: assistantContent
          }
          return newMessages
        })
      }
    } catch (error: any) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: error.message === 'Unauthorized'
          ? "Please sign in to access Clinical AI features."
          : `I'm sorry, I encountered an error: ${error.message}. Please try again.`
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <div 
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[60]"
      >
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          className={`h-12 w-12 sm:h-16 sm:w-16 rounded-2xl sm:rounded-3xl shadow-2xl ${isOpen ? 'bg-slate-900' : 'bg-primary hover:bg-primary/90'} text-white border-none relative group`}
        >
          {isOpen ? (
              <div>
                <X className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            ) : (
              <div>
                <Brain className="w-6 h-6 sm:w-8 sm:h-8" />
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-3 w-3 sm:h-5 sm:w-5 bg-success rounded-full border-2 sm:border-4 border-white dark:border-slate-950" />
              </div>
            )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
          <div
            className="fixed bottom-24 right-2 sm:right-4 lg:right-6 w-[calc(100vw-16px)] sm:w-[380px] md:w-[400px] h-[500px] sm:h-[550px] md:h-[600px] max-h-[80vh] z-[60] bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-primary to-blue-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="p-1.5 sm:p-2 bg-white/20 rounded-xl backdrop-blur-md shrink-0">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-xs sm:text-sm uppercase tracking-widest truncate">Clinical AI</h3>
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 bg-success rounded-full animate-pulse shrink-0" />
                    <span className="text-[9px] sm:text-[10px] font-bold text-blue-100 uppercase tracking-tighter truncate">DB Connected</span>
                  </div>
                </div>
              </div>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200 shrink-0 ml-2" />
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 min-h-0" viewportRef={scrollRef}>
              <div className="space-y-6 p-6">
                {messages.map((m, i) => (
                  <div 
                    key={i}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} gap-2`}>
                      {/* Category Badge for Assistant Messages */}
                      {m.role === 'assistant' && m.category && (() => {
                        const config = categoryConfig[m.category]
                        const IconComponent = config.icon
                        return (
                          <div className="flex items-center gap-2">
                            <Badge className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
                              <IconComponent className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                          </div>
                        )
                      })()}
                      
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        m.role === 'user' 
                          ? 'bg-primary text-white rounded-tr-none shadow-lg' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                      }`}>
                        {m.role === 'assistant' ? formatClinicalContent(m.content) : m.content}
                        
                        {m.citations && m.citations.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-wrap gap-2">
                            {m.citations.map(c => (
                              <Badge key={c} variant="outline" className="text-[10px] bg-white/50 dark:bg-slate-900/50 font-bold">
                                Ref: {c}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                        {m.role === 'user' ? <User className="w-3 h-3" /> : <Activity className="w-3 h-3 text-primary" />}
                        {m.role === 'user' ? 'Clinician' : 'MedSafe AI'}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex gap-2 relative">
                <Input 
                  placeholder="Ask a clinical question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl pr-12 focus-visible:ring-primary text-sm font-medium"
                />
                <Button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="absolute right-1 top-1 h-10 w-10 bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-lg shadow-primary/20"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[9px] text-center mt-4 text-slate-400 font-bold uppercase tracking-widest leading-none">
                Verify with official MOH protocols
              </p>
            </div>
          </div>
        )}
    </>
  )
}
