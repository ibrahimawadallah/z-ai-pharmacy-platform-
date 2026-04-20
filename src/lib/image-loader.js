// Custom image loader for CDN optimization
export default function customImageLoader({ src, width, quality }) {
  // For production, use CDN
  if (process.env.NODE_ENV === 'production') {
    return `https://cdn.drugeye.com/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`
  }
  
  // For development, use default Next.js loader
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`
}

// CDN URL generator for static assets
export const getCdnUrl = (path: string): string => {
  const cdnBaseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://cdn.drugeye.com'
    : ''
  
  return `${cdnBaseUrl}${path}`
}

// Asset optimization helper
export const getOptimizedImageUrl = (
  src: string, 
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'jpg' | 'png'
  } = {}
): string => {
  const { width, height, quality = 75, format = 'webp' } = options
  
  if (process.env.NODE_ENV === 'production') {
    const params = new URLSearchParams({
      url: src,
      w: width?.toString() || '',
      h: height?.toString() || '',
      q: quality.toString(),
      f: format
    })
    
    return `https://cdn.drugeye.com/_next/image?${params.toString()}`
  }
  
  // Development fallback
  return src
}

// Preload critical assets
export const preloadCriticalAssets = () => {
  if (typeof window === 'undefined') return
  
  const criticalAssets = [
    '/images/logo.svg',
    '/images/hero-bg.jpg',
    '/fonts/inter-var.woff2'
  ]
  
  criticalAssets.forEach(asset => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = getCdnUrl(asset)
    
    if (asset.endsWith('.woff2')) {
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
    } else if (asset.endsWith('.jpg') || asset.endsWith('.png') || asset.endsWith('.webp')) {
      link.as = 'image'
    }
    
    document.head.appendChild(link)
  })
}

// Service Worker for CDN caching
export const registerServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
  
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker registered:', registration)
    })
    .catch(error => {
      console.log('Service Worker registration failed:', error)
    })
}
