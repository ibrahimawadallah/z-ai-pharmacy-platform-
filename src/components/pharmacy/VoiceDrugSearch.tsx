'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Mic, MicOff, Search, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface VoiceInputProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function VoiceDrugSearch({ onSearch, placeholder = 'Say drug name or ask question...' }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') return
      setError(event.error)
      setIsListening(false)
    }

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript)
        onSearch(finalTranscript.trim())
        recognition.stop()
      } else if (interimTranscript) {
        setTranscript(interimTranscript)
      }
    }

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
    }
  }, [onSearch])

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      setTranscript('')
      recognitionRef.current.start()
    }
  }, [isListening])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (transcript.trim()) {
      onSearch(transcript.trim())
    }
  }

  if (!isSupported) {
    return (
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-center gap-2 text-amber-700">
          <MicOff className="h-5 w-5" />
          <span className="text-sm">Voice search not supported in this browser</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-4 transition-all duration-300 ${isListening ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'}`}>
      <form onSubmit={handleManualSubmit} className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
          {isListening && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75" />
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150" />
            </div>
          )}
        </div>
        <Button
          type="button"
          onClick={toggleListening}
          variant={isListening ? 'destructive' : 'default'}
          size="lg"
          className="h-12 px-4"
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
      </form>
      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>Error: {error}</span>
        </div>
      )}
      {isListening && (
        <p className="mt-2 text-blue-600 text-sm animate-pulse">
          Listening... Speak drug names or ask questions
        </p>
      )}
    </Card>
  )
}

// Add type declaration for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}
