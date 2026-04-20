const CACHE_NAME = 'z-ai-pharmacy-v1'
const CDN_URL = 'https://cdn.z-ai-pharmacy.com'

// Assets to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/_next/static/css/',
  '/_next/static/js/',
  '/images/logo.svg',
  '/images/hero-bg.jpg',
  '/fonts/inter-var.woff2'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS)
      })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const request = event.request
  
  // Skip non-GET requests
  if (request.method !== 'GET') return
  
  // Skip API requests
  if (request.url.includes('/api/')) return
  
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response
        }
        
        // For CDN assets, try CDN first
        if (request.url.startsWith(CDN_URL)) {
          return fetch(request)
            .then((response) => {
              // Cache successful CDN responses
              if (response.ok) {
                const responseClone = response.clone()
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseClone)
                  })
              }
              return response
            })
            .catch(() => {
              // Fallback to original domain if CDN fails
              return fetch(request.url.replace(CDN_URL, ''))
            })
        }
        
        // Fetch from network
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.ok) {
              const responseClone = response.clone()
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseClone)
                })
            }
            return response
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/offline.html')
            }
          })
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Background sync for offline analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics())
  }
})

async function syncAnalytics() {
  // Get stored analytics data from IndexedDB
  const analyticsData = await getStoredAnalytics()
  
  // Send to server
  for (const data of analyticsData) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      // Remove sent data from storage
      await removeStoredAnalytics(data.id)
    } catch (error) {
      console.error('Failed to sync analytics:', error)
      break
    }
  }
}

// IndexedDB helpers for offline analytics storage
async function getStoredAnalytics() {
  return new Promise((resolve) => {
    const request = indexedDB.open('z-ai-pharmacy-analytics', 1)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      db.createObjectStore('analytics', { keyPath: 'id' })
    }
    
    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(['analytics'], 'readonly')
      const store = transaction.objectStore('analytics')
      const getAllRequest = store.getAll()
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result)
      }
    }
  })
}

async function removeStoredAnalytics(id) {
  return new Promise((resolve) => {
    const request = indexedDB.open('z-ai-pharmacy-analytics', 1)
    
    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction(['analytics'], 'readwrite')
      const store = transaction.objectStore('analytics')
      store.delete(id)
      
      transaction.oncomplete = () => resolve()
    }
  })
}
