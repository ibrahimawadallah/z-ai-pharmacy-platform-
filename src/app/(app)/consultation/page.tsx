'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Brain, Send, Sparkles, User, Bot, Copy,
  RefreshCw, ThumbsUp, ThumbsDown, AlertTriangle,
  Pill, Activity, FileText, Heart, ChevronDown, MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { classifyIntent, extractDrugEntities, getIntentDescription } from '@/lib/nlp'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: string[]
}

const suggestedQueries = [
  "What are the contraindications for Metformin in renal impairment?",
  "Check interactions between Warfarin and Aspirin",
  "What is the pediatric dosing for Amoxicillin?",
  "Compare efficacy of Atorvastatin vs Rosuvastatin",
  "What are the side effects of SSRIs?",
  "Drugs to avoid in pregnancy"
]

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      // Format messages for the streaming API — include the new user message
      // (React state updates are async, so reading `messages` here would miss it).
      const apiMessages = [...messages, userMessage].map(m => ({
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Clinical Consultation</h1>
                <p className="text-sm text-gray-500">Powered by DrugEye Intelligence</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleNewChat} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              New Chat
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Info Banner */}
        <Card className="bg-cyan-50 border-cyan-200 mb-6">
          <CardContent className="py-4 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-cyan-600 shrink-0" />
            <div className="text-sm text-cyan-800">
              <strong>Clinical Decision Support:</strong> This AI assistant provides information for reference only.
              Always verify with official prescribing information and consult clinical guidelines.
            </div>
          </CardContent>
        </Card>

        {/* NLP Status Bar */}
        {(currentIntent || detectedDrugs.length > 0) && (
          <Card className="bg-blue-50 border-blue-200 mb-6">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-4 text-sm">
                {currentIntent && (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 font-medium">Intent:</span>
                    <Badge variant="default" className="bg-blue-600">{getIntentDescription(currentIntent)}</Badge>
                  </div>
                )}
                {detectedDrugs.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 font-medium">Drugs:</span>
                    <div className="flex gap-1">
                      {detectedDrugs.map((drug, idx) => (
                        <Badge key={idx} variant="outline" className="border-blue-600 text-blue-700">{drug}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Area */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-md min-h-[500px] flex flex-col">
          <CardContent className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[600px]">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-cyan-100 text-cyan-600' 
                    : 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white'
                }`}>
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                </div>
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block max-w-[80%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <ThumbsUp className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <ThumbsDown className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white flex items-center justify-center">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-4">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Suggested Queries */}
          {messages.length <= 2 && (
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-500 mb-3">Try asking:</p>
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
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <Input
                placeholder="Ask about drug interactions, dosages, contraindications..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isLoading}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Tools */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <Link href="/interactions">
            <Card className="bg-white/80 hover:bg-white transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-sm font-medium">Interactions</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dosage">
            <Card className="bg-white/80 hover:bg-white transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Pill className="w-5 h-5 text-violet-600" />
                </div>
                <span className="text-sm font-medium">Dosage Calc</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/search">
            <Card className="bg-white/80 hover:bg-white transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-cyan-600" />
                </div>
                <span className="text-sm font-medium">Drug Search</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/adr">
            <Card className="bg-white/80 hover:bg-white transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rose-600" />
                </div>
                <span className="text-sm font-medium">Side Effects</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href}>{children}</a>
}