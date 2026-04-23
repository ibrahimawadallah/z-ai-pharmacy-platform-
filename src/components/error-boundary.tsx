'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

// Premium Glass Card Component
const PremiumGlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`glass-card rounded-3xl p-1 shadow-premium-lg hover-lift ${className}`}>
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6">
      {children}
    </div>
  </div>
)

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo })
    
    // Log error to monitoring service
    this.logErrorToService(error, errorInfo)
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo)
  }

  private logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo)
      return
    }

    // In production, send to monitoring service
    try {
      // This would integrate with your monitoring service (Sentry, LogRocket, etc.)
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
          description: error.message,
          fatal: false,
          custom_map: {
            component_stack: errorInfo.componentStack,
            error_stack: error.stack
          }
        })
      }

      // You could also send to your own API
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name
          },
          errorInfo: {
            componentStack: errorInfo.componentStack
          },
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {
        // Silent fail for error logging
      })
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError)
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  private handleGoHome = () => {
    this.handleReset()
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} reset={this.handleReset} />
    }

    return this.props.children
  }
}

// Default Error Fallback Component
const DefaultErrorFallback: React.FC<{ error?: Error; reset: () => void }> = ({ error, reset }) => {
  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }
  
  return (
  <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
    <div
      className="w-full max-w-md"
    >
      <PremiumGlassCard>
        <div className="text-center space-y-6">
          <div
            className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-red-500 to-pink-600 shadow-glow flex items-center justify-center"
          >
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          
          <div className="space-y-4">
            <h1 className="display-2 gradient-text-primary">Oops!</h1>
            <p className="body text-muted-foreground">
              Something went wrong. We've been notified and are working on a fix.
            </p>
            
            {process.env.NODE_ENV === 'development' && error && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200/50">
                <p className="micro font-mono text-red-600 dark:text-red-400 text-left">
                  {error.message}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={reset}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-glow hover-lift font-bold"
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Try Again
              </div>
            </Button>
            
            <Button 
              onClick={handleGoHome}
              variant="outline"
              className="h-14 px-8 rounded-2xl border-slate-200/50 hover:bg-slate-50 font-bold"
            >
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Go Home
              </div>
            </Button>
          </div>
        </div>
      </PremiumGlassCard>
    </div>
  </div>
  )
}

// Async Error Boundary for handling async errors
export const AsyncErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Handle async errors specifically
        console.error('Async Error:', error, errorInfo)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

// Route Error Boundary for Next.js app directory
export const RouteErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <div className="min-h-screen flex items-center justify-center p-4">
          <PremiumGlassCard>
            <div className="text-center space-y-6">
              <h1 className="display-2 gradient-text-primary">Route Error</h1>
              <p className="body text-muted-foreground">
                This page encountered an error. Please try refreshing.
              </p>
              <Button onClick={reset} className="h-14 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-glow hover-lift font-bold">
                Refresh Page
              </Button>
            </div>
          </PremiumGlassCard>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary
