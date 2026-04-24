'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Brain, Send, Sparkles, User, Copy,
  RefreshCw, ThumbsUp, ThumbsDown, AlertTriangle,
  Pill, Activity, FileText, MessageSquare, Wrench,
  UserPlus, X,
} from 'lucide-react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage } from 'ai'
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
        'Attach a patient using the **Attach patient** button above to get personalized, allergy- and interaction-aware recommendations.',
    },
  ],
}

type ChatMessage = {
  id: string
  role: 'system' | 'user' | 'assistant'
  parts: Array<Record<string, unknown> & { type: string }>
}

type PatientSummary = {
  id: string
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: string
  mrn?: string | null
  isPregnant?: boolean
  allergies?: string | null
  conditions?: string | null
  medicationCount?: number
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

function ageYears(dob: string): number {
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000))
}

export default function ConsultationPage() {
  // Patient-context state. The ref is what the transport body reads per-request,
  // so the active patient follows the user without having to rebuild the transport.
  const [activePatient, setActivePatient] = useState<PatientSummary | null>(null)
  const activePatientIdRef = useRef<string | null>(null)
  useEffect(() => {
    activePatientIdRef.current = activePatient?.id ?? null
  }, [activePatient])

  // Build the transport once and let its `body` callback read the latest patient id
  // out of the ref at request time. The ref indirection is intentional — it keeps the
  // transport stable across patient switches so useChat's internal stream isn't torn down.
  /* eslint-disable react-hooks/refs */
  const transport = useMemo(() => {
    const getBody = () => {
      const id = activePatientIdRef.current
      return id ? { patientContext: { id } } : {}
    }
    return new DefaultChatTransport({ api: '/api/chat', body: getBody })
  }, [])
  /* eslint-enable react-hooks/refs */

  const { messages, sendMessage, status, setMessages, error } = useChat({
    transport,
    messages: [INITIAL_GREETING as unknown as UIMessage],
  })

  const [input, setInput] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [patients, setPatients] = useState<PatientSummary[] | null>(null)
  const [patientsError, setPatientsError] = useState<string | null>(null)
  const [patientFilter, setPatientFilter] = useState('')

  // Lazy-load the patient list the first time the picker opens.
  useEffect(() => {
    if (!showPicker || patients !== null) return
    let cancelled = false
    fetch('/api/patients')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => {
        if (cancelled) return
        setPatients(Array.isArray(data.patients) ? data.patients : [])
      })
      .catch((e: Error) => {
        if (cancelled) return
        setPatientsError(e.message)
        setPatients([])
      })
    return () => {
      cancelled = true
    }
  }, [showPicker, patients])

  const filteredPatients = useMemo(() => {
    if (!patients) return []
    const q = patientFilter.trim().toLowerCase()
    if (!q) return patients
    return patients.filter(
      (p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        (p.mrn ?? '').toLowerCase().includes(q)
    )
  }, [patients, patientFilter])

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
    setMessages([INITIAL_GREETING as unknown as UIMessage])
  }

  const handleSelectPatient = (p: PatientSummary) => {
    setActivePatient(p)
    setShowPicker(false)
    setPatientFilter('')
  }

  const handleClearPatient = () => {
    setActivePatient(null)
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
            <div className="flex items-center gap-2">
              {!activePatient && (
                <Button
                  variant="outline"
                  onClick={() => setShowPicker(true)}
                  className="gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Attach patient
                </Button>
              )}
              <Button variant="outline" onClick={handleNewChat} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                New Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Active Patient Banner */}
        {activePatient && (
          <Card className="bg-emerald-50 border-emerald-200 mb-6">
            <CardContent className="py-3 px-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-emerald-900">
                    {activePatient.firstName} {activePatient.lastName}
                    {activePatient.mrn ? (
                      <span className="font-normal text-emerald-700 ml-2">MRN {activePatient.mrn}</span>
                    ) : null}
                  </div>
                  <div className="text-xs text-emerald-800 flex flex-wrap gap-x-3 gap-y-1">
                    <span>{ageYears(activePatient.dateOfBirth)}y · {activePatient.gender}</span>
                    {activePatient.isPregnant && (
                      <span className="text-rose-700 font-medium">Pregnant</span>
                    )}
                    {activePatient.allergies && (
                      <span>Allergies: {activePatient.allergies}</span>
                    )}
                    {typeof activePatient.medicationCount === 'number' && (
                      <span>{activePatient.medicationCount} active med{activePatient.medicationCount === 1 ? '' : 's'}</span>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClearPatient} className="gap-1 text-emerald-800 hover:text-emerald-900">
                <X className="w-3.5 h-3.5" />
                Detach
              </Button>
            </CardContent>
          </Card>
        )}

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
                placeholder={
                  activePatient
                    ? `Ask about ${activePatient.firstName}'s drugs, interactions, dosages…`
                    : 'Ask about drug interactions, dosages, contraindications...'
                }
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

      {/* Patient Picker Modal */}
      {showPicker && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setShowPicker(false)}
        >
          <Card
            className="bg-white shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Attach patient</h2>
                <p className="text-xs text-gray-500">Personalize every answer to this patient's chart.</p>
              </div>
              <button onClick={() => setShowPicker(false)} className="p-1 rounded hover:bg-gray-100" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-3 border-b border-gray-200">
              <Input
                placeholder="Search name or MRN…"
                value={patientFilter}
                onChange={(e) => setPatientFilter(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {patients === null && !patientsError && (
                <div className="p-6 text-sm text-gray-500">Loading patients…</div>
              )}
              {patientsError && (
                <div className="p-6 text-sm text-red-700">Could not load patients: {patientsError}</div>
              )}
              {patients && patients.length === 0 && !patientsError && (
                <div className="p-6 text-sm text-gray-500">
                  No patients yet. Create one from the Patients page, then come back here.
                </div>
              )}
              {filteredPatients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPatient(p)}
                  className="w-full text-left px-5 py-3 border-b border-gray-100 hover:bg-cyan-50 focus:bg-cyan-50 focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">
                      {p.firstName} {p.lastName}
                      {p.mrn ? <span className="text-gray-500 font-normal ml-2">MRN {p.mrn}</span> : null}
                    </div>
                    <div className="text-xs text-gray-500">
                      {ageYears(p.dateOfBirth)}y · {p.gender}
                    </div>
                  </div>
                  {(p.allergies || p.conditions) && (
                    <div className="mt-1 text-xs text-gray-600 line-clamp-1">
                      {p.allergies ? `Allergies: ${p.allergies}` : null}
                      {p.allergies && p.conditions ? ' · ' : ''}
                      {p.conditions ? `Hx: ${p.conditions}` : null}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
