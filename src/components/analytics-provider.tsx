import { ErrorBoundary } from '@/components/error-boundary'
import { useAnalytics, usePerformanceMonitoring, useSessionTracking } from '@/hooks/use-analytics'
import { useEffect } from 'react'

// Extend Window interface for analytics
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

// Analytics Provider Component
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useAnalytics()
  usePerformanceMonitoring()
  useSessionTracking()

  return <>{children}</>
}

// Root Layout with Error Boundary and Analytics
export default function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Initialize Google Analytics
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
      const script = document.createElement('script')
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`
      script.async = true
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      window.gtag = (...args: any[]) => {
        window.dataLayer.push(args)
      }
      window.gtag('js', new Date())
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        send_page_view: false,
        anonymize_ip: true,
        cookie_flags: 'SameSite=Lax;Secure'
      })
    }
  }, [])

  return (
    <ErrorBoundary>
      <AnalyticsProvider>
        {children}
      </AnalyticsProvider>
    </ErrorBoundary>
  )
}
