'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Analytics and Monitoring Hook
export const useAnalytics = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Only run in production or when analytics is enabled
    if (typeof window === 'undefined' || !window.gtag) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')

    // Track page view
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_path: url,
      custom_map: {
        custom_parameter_1: 'user_role',
        custom_parameter_2: 'subscription_tier'
      }
    })

    // Track custom events
    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: url,
      user_role: getUserRole(),
      subscription_tier: getSubscriptionTier()
    })
  }, [pathname, searchParams])

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window === 'undefined' || !window.gtag) return

    window.gtag('event', eventName, {
      ...parameters,
      custom_map: {
        user_role: getUserRole(),
        subscription_tier: getSubscriptionTier()
      }
    })
  }

  const trackError = (error: Error, context?: string) => {
    if (typeof window === 'undefined' || !window.gtag) return

    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      custom_map: {
        context: context || 'unknown',
        user_role: getUserRole(),
        subscription_tier: getSubscriptionTier()
      }
    })
  }

  const trackPerformance = (metricName: string, value: number) => {
    if (typeof window === 'undefined' || !window.gtag) return

    window.gtag('event', 'performance_metric', {
      metric_name: metricName,
      value: value,
      custom_map: {
        user_role: getUserRole(),
        subscription_tier: getSubscriptionTier()
      }
    })
  }

  const trackUserInteraction = (action: string, element: string, value?: string) => {
    trackEvent('user_interaction', {
      action,
      element,
      value,
      interaction_type: 'click'
    })
  }

  return {
    trackEvent,
    trackError,
    trackPerformance,
    trackUserInteraction
  }
}

// Performance Monitoring Hook
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          window.gtag?.('event', 'web_vital', {
            name: 'LCP',
            value: Math.round(entry.startTime),
            event_category: 'Web Vitals'
          })
        } else if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming
          window.gtag?.('event', 'web_vital', {
            name: 'FID',
            value: Math.round(fidEntry.processingStart - fidEntry.startTime),
            event_category: 'Web Vitals'
          })
        } else if (entry.entryType === 'layout-shift') {
          if (!(entry as any).hadRecentInput) {
            window.gtag?.('event', 'web_vital', {
              name: 'CLS',
              value: Math.round((entry as any).value * 1000),
              event_category: 'Web Vitals'
            })
          }
        }
      }
    })

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
    } catch (e) {
      // PerformanceObserver not supported
    }

    return () => observer.disconnect()
  }, [])
}

// Error Reporting Hook
export const useErrorReporting = () => {
  const reportError = (error: Error, context?: string, severity: 'low' | 'medium' | 'high' = 'medium') => {
    // Send to error reporting service
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        context,
        severity,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        userRole: getUserRole(),
        subscriptionTier: getSubscriptionTier()
      })
    }).catch(() => {
      // Silent fail for error reporting
    })

    // Also track in analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'error_reported', {
        error_name: error.name,
        error_message: error.message,
        context,
        severity
      })
    }
  }

  return { reportError }
}

// User Session Tracking
export const useSessionTracking = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Track session start
    const sessionStart = Date.now()
    
    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User left the page
        const sessionDuration = Date.now() - sessionStart
        window.gtag?.('event', 'session_end', {
          session_duration: Math.round(sessionDuration / 1000),
          session_length: 'medium'
        })
      } else {
        // User returned to the page
        window.gtag?.('event', 'session_resume')
      }
    }

    // Track before unload
    const handleBeforeUnload = () => {
      const sessionDuration = Date.now() - sessionStart
      window.gtag?.('event', 'session_end', {
        session_duration: Math.round(sessionDuration / 1000),
        session_length: 'medium'
      })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])
}

// Helper functions
const getUserRole = (): string => {
  if (typeof window === 'undefined') return 'unknown'
  try {
    return localStorage.getItem('userRole') || 'guest'
  } catch {
    return 'guest'
  }
}

const getSubscriptionTier = (): string => {
  if (typeof window === 'undefined') return 'unknown'
  try {
    return localStorage.getItem('subscriptionTier') || 'free'
  } catch {
    return 'free'
  }
}

// Custom Analytics Events
export const AnalyticsEvents = {
  // User actions
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_REGISTER: 'user_register',
  
  // Feature usage
  SEARCH_PERFORMED: 'search_performed',
  DRUG_VIEWED: 'drug_viewed',
  INTERACTION_CHECK: 'interaction_check',
  FAVORITE_ADDED: 'favorite_added',
  FAVORITE_REMOVED: 'favorite_removed',
  
  // Clinical features
  DOSAGE_CALCULATOR: 'dosage_calculator',
  PREGNANCY_CHECK: 'pregnancy_check',
  ADR_REPORT: 'adr_report',
  
  // Subscription events
  SUBSCRIPTION_UPGRADE: 'subscription_upgrade',
  SUBSCRIPTION_DOWNGRADE: 'subscription_downgrade',
  PAYMENT_COMPLETED: 'payment_completed',
  PAYMENT_FAILED: 'payment_failed',
  
  // Performance events
  PAGE_LOAD: 'page_load',
  COMPONENT_RENDER: 'component_render',
  API_CALL: 'api_call',
  
  // Error events
  JAVASCRIPT_ERROR: 'javascript_error',
  NETWORK_ERROR: 'network_error',
  API_ERROR: 'api_error'
}

export default useAnalytics
