import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session replay in production only
  replaysSessionSampleRate: 0.0,
  replaysOnErrorSampleRate: process.env.NODE_ENV === 'production' ? 1.0 : 0.0,
  
  // Filter out common non-critical errors
  beforeSend(event, hint) {
    const error = hint.originalException as Error
    if (error?.message?.includes('Network Error')) {
      return null
    }
    if (error?.message?.includes('CORS')) {
      return null
    }
    return event
  },
  
  // Disable in dev to reduce noise
  enabled: !!process.env.SENTRY_DSN,
})

export async function register() {
  // This runs at build time - logging that Sentry is initialized
  console.log('[Sentry] Monitoring:', process.env.SENTRY_DSN ? 'Enabled' : 'Disabled (no DSN)')
}