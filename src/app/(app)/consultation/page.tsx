'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Brain, Send, Sparkles, User, Copy,
  RefreshCw, ThumbsUp, ThumbsDown, AlertTriangle,
  Pill, Activity, FileText, MessageSquare, Wrench
} from 'lucide-react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { classifyIntent, extractDrugEntities, getIntentDescription } from '@/lib/nlp'

const suggestedQueries = [
  'What are the contraindications for Metformin in renal impairment?',
  'Check interactions between Warfarin and Aspirin',
  'What is the pediatric dosing for Amoxicillin?',
  'Compare efficacy of Atorvastatin vs Rosuvastatin',
  'What are the side effects of SSRIs?',
  'Drugs to avoid in pregnancy',
]

const INITIAL_GREETING = {
  id: 'greeting',
  role: 'assistant' as const,
  parts: [
    {
      type: 'text' as const,
      text:
        "Hello! I'm your AI Clinical Assistant powered by DrugEye Intelligence. I can help you with:\n\n" +
        '• **Drug Interactions** - Check for harmful combinations\n' +
        '• **Dosage Guidance** - Calculate appropriate doses\n' +
        '• **Contraindications** - Identify safety concerns\n' +
        '• **Side Effects** - Review adverse reactions\n' +
        '• **Therapeutic Alternatives** - Compare treatment options\n\n' +
        'How can I assist you today?',
    },
  ],
}

type ChatMessage = {
  id: string
  role: 'system' | 'user' | 'assistant'
  parts: Array<Record<string, unknown> & { type: string }>
}

function getMessageText(message: ChatMessage): string {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text' && typeof (p as { text?: unknown }).text === 'string')
    .map((p) => p.text)
    .join('')
}

function getToolCalls(message: ChatMessage): string[] {
  return message.parts
    .filter((p) => typeof p.type === 'string' && p.type.startsWith('tool-'))
    .map((p) => p.type.replace(/^tool-/, ''))
}

export default function ConsultationPage() {
  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/chat' }), [])
  const { messages, sendMessage, status, setMessages, error } = useChat({
    transport,
    messages: [INITIAL_GREETING as any],
  })

  const [input, setInput] = useState('')

  const nlp = useMemo(() => {
    if (!input.trim()) return { intent: '', drugs: [] as string[] }
    const intent = classifyIntent(input)
    const drugs = extractDrugEntities(input).map((d) => d.name)
    return { intent: intent.intent, drugs }
  }, [input])

  const isBusy = status === 'submitted' || status === 'streaming'

  const handleSend = () => {
    if (!input.trim() || isBusy) return
    sendMessage({ text: input.trim() })
    setInput('')
  }

  const handleSuggestionClick = (query: string) => {
    setInput(query)
  }

  const handleNewChat = () => {
    setMessages([INITIAL_GREETING as any])
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
        {(nlp.intent || nlp.drugs.length > 0) && (
          <Card className="bg-blue-50 border-blue-200 mb-6">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-4 text-sm flex-wrap">
                {nlp.intent && (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 font-medium">Intent:</span>
                    <Badge variant="default" className="bg-blue-600">
                      {getIntentDescription(nlp.intent)}
                    </Badge>
                  </div>
                )}
                {nlp.drugs.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 font-medium">Drugs:</span>
                    <div className="flex gap-1 flex-wrap">
                      {nlp.drugs.map((drug, idx) => (
                        <Badge key={idx} variant="outline" className="border-blue-600 text-blue-700">
                          {drug}
                        </Badge>
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
            {(messages as unknown as ChatMessage[]).map((message) => {
              const text = getMessageText(message)
              const tools = getToolCalls(message)
              return (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      message.role === 'user'
                        ? 'bg-cyan-100 text-cyan-600'
                        : 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white'
                    }`}
                  >
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                  </div>
                  <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                    {tools.length > 0 && message.role === 'assistant' && (
                      <div className="mb-2 flex flex-wrap gap-1 justify-start">
                        {tools.map((t, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-cyan-300 text-cyan-700">
                            <Wrench className="w-3 h-3 mr-1" />
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {text && (
                      <div
                        className={`inline-block max-w-[80%] p-4 rounded-2xl ${
                          message.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{text}</p>
                      </div>
                    )}
                    {message.role === 'assistant' && text && (
                      <div className="mt-2 flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded" aria-label="Helpful">
                          <ThumbsUp className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" aria-label="Not helpful">
                          <ThumbsDown className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded"
                          aria-label="Copy"
                          onClick={() => navigator.clipboard?.writeText(text)}
                        >
                          <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {isBusy && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white flex items-center justify-center">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-4">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 text-sm">
                  {error.message || 'Something went wrong. Please try again.'}
                </div>
              </div>
            )}
          </CardContent>

          {/* Suggested Queries */}
          {messages.length <= 1 && (
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                className="flex-1"
                disabled={isBusy}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isBusy}
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
                  <FileText className="w-5 h-5 text-rose-600" />
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
