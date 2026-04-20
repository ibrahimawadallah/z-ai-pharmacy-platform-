# Production Setup Guide

## 🚀 Error Boundaries, Monitoring & CDN Setup

This guide covers the production-ready features we've implemented for the Z-AI Pharmacy Platform.

## 📋 Features Implemented

### ✅ **Error Boundaries**
- Global error boundary with premium UI
- Route-specific error handling
- Async error boundary for promises
- Error reporting to monitoring services
- Graceful fallbacks with recovery options

### ✅ **Analytics & Monitoring**
- Google Analytics integration
- Custom event tracking
- Performance monitoring (Core Web Vitals)
- User session tracking
- Error reporting with context
- Real-time performance metrics

### ✅ **CDN Configuration**
- Static asset CDN optimization
- Image optimization with WebP/AVIF
- Service worker for offline caching
- Asset preloading for critical resources
- Fallback strategies for CDN failures

## 🛠️ Setup Instructions

### 1. Environment Configuration

Copy the production environment template:
```bash
cp PRODUCTION_ENV.md .env.production
```

Update these key variables in your production environment:

```env
# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_SENTRY_DSN="https://your-sentry-dsn"

# CDN
NEXT_PUBLIC_CDN_URL="https://cdn.z-ai-pharmacy.com"

# Error Reporting
ERROR_WEBHOOK_URL="https://your-webhook-url/errors"
ERROR_SLACK_WEBHOOK="https://hooks.slack.com/..."

# Performance
PERFORMANCE_WEBHOOK_URL="https://your-webhook-url/perf"
```

### 2. CDN Setup

#### Option A: Vercel Edge Network (Recommended)
```bash
# Vercel automatically provides CDN
# Just set assetPrefix in next.config.js
```

#### Option B: Custom CDN (Cloudflare/AWS CloudFront)
```env
NEXT_PUBLIC_CDN_URL="https://cdn.your-domain.com"
```

Update `next.config.js`:
```javascript
assetPrefix: process.env.NEXT_PUBLIC_CDN_URL
```

### 3. Analytics Services Setup

#### Google Analytics
1. Create GA4 property
2. Get Measurement ID
3. Add to environment: `NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"`

#### Sentry (Error Tracking)
1. Create Sentry project
2. Get DSN
3. Add to environment: `NEXT_PUBLIC_SENTRY_DSN="https://your-sentry-dsn"`

#### Hotjar (User Behavior)
1. Create Hotjar account
2. Get Site ID
3. Add to environment: `NEXT_PUBLIC_HOTJAR_ID="1234567"`

### 4. Error Reporting Setup

#### Slack Notifications
```bash
# Create Slack webhook
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Error notification setup"}' \
  $ERROR_SLACK_WEBHOOK
```

#### Custom Webhook
```javascript
// Your webhook endpoint should accept POST requests with:
{
  "service": "z-ai-pharmacy",
  "environment": "production",
  "error": { "message": "...", "stack": "..." },
  "context": "user_interaction",
  "severity": "medium"
}
```

### 5. Performance Monitoring

#### Core Web Vitals
Automatically tracked:
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

#### Custom Metrics
```javascript
import { useAnalytics } from '@/hooks/use-analytics'

const { trackPerformance } = useAnalytics()

// Track custom performance
trackPerformance('api_response_time', 150)
trackPerformance('component_render_time', 45)
```

## 📊 Monitoring Dashboard

### Available Endpoints

#### Performance Analytics
```bash
GET /api/performance
```

Response:
```json
{
  "averagePageLoad": 1.2,
  "averageAPIResponse": 150,
  "errorRate": 0.02,
  "uptime": 99.9,
  "activeUsers": 1250,
  "topErrors": [
    { "message": "Network timeout", "count": 15 }
  ]
}
```

#### Error Reporting
```bash
POST /api/errors
```

### Real-time Monitoring

#### Browser Console
```javascript
// Check analytics is working
window.gtag('event', 'test_event', { test: true })

// Check error reporting
window.dispatchEvent(new ErrorEvent('error', {
  error: new Error('Test error')
}))
```

#### Network Tab
Monitor:
- `/api/errors` - Error logging
- `/api/performance` - Performance metrics
- Google Analytics requests

## 🔧 Implementation Details

### Error Boundary Structure
```typescript
// Global error boundary in app/layout.tsx
<ErrorBoundary>
  <AnalyticsProvider>
    {children}
  </AnalyticsProvider>
</ErrorBoundary>

// Route-specific boundaries
<RouteErrorBoundary>
  <PageComponent />
</RouteErrorBoundary>
```

### Analytics Events
```typescript
// Predefined events
AnalyticsEvents.USER_LOGIN
AnalyticsEvents.SEARCH_PERFORMED
AnalyticsEvents.DRUG_VIEWED
AnalyticsEvents.INTERACTION_CHECK

// Custom events
trackEvent('custom_action', {
  parameter: 'value',
  category: 'user_behavior'
})
```

### CDN Asset Flow
```
User Request → CDN Check → Cache Hit/Miss → Origin Fallback
     ↓
Service Worker → Cache Storage → Offline Support
```

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Configure all environment variables
- [ ] Set up CDN domain
- [ ] Configure analytics services
- [ ] Test error reporting endpoints
- [ ] Verify performance monitoring

### Post-deployment
- [ ] Test error boundaries
- [ ] Verify analytics tracking
- [ ] Check CDN asset delivery
- [ ] Monitor Core Web Vitals
- [ ] Test offline functionality

## 📈 Performance Targets

### Core Web Vitals
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### Custom Metrics
- **API Response**: < 200ms
- **Page Load**: < 1.5s
- **Error Rate**: < 1%
- **Uptime**: > 99.9%

## 🔒 Security Considerations

### CSP Headers
```javascript
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' https://www.googletagmanager.com
```

### Error Data Sanitization
- No PII in error reports
- Sanitized stack traces
- Rate limiting on error endpoints

### Analytics Privacy
- Anonymized IP addresses
- No sensitive data in events
- GDPR compliant tracking

## 🐛 Troubleshooting

### Common Issues

#### Analytics Not Working
```javascript
// Check gtag is available
console.log(window.gtag)

// Verify GA ID
console.log(process.env.NEXT_PUBLIC_GA_ID)
```

#### CDN Assets Not Loading
```javascript
// Check CDN URL
console.log(process.env.NEXT_PUBLIC_CDN_URL)

// Test asset fetch
fetch('https://cdn.your-domain.com/image.jpg')
```

#### Error Reporting Not Working
```javascript
// Test error endpoint
fetch('/api/errors', {
  method: 'POST',
  body: JSON.stringify({ test: true })
})
```

## 📞 Support

For issues with:
- **Error Boundaries**: Check browser console
- **Analytics**: Verify network requests
- **CDN**: Check asset URLs and headers
- **Performance**: Use browser dev tools

---

Your Z-AI Pharmacy Platform is now production-ready with comprehensive monitoring, error handling, and CDN optimization! 🎉
