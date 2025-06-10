// Service Worker for IGS-Pharma E-commerce App
// Provides offline support, caching, and performance optimizations

const CACHE_NAME = 'igs-pharma-v1.0.0';
const STATIC_CACHE_NAME = 'igs-pharma-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'igs-pharma-dynamic-v1.0.0';

// Resources to cache immediately when service worker installs
const STATIC_ASSETS = [
  '/',
  '/assets/index.js',
  '/assets/index.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  // Add more critical assets as needed
];

// Resources that can be cached dynamically
const DYNAMIC_CACHE_PATTERNS = [
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/fonts\.gstatic\.com/,
  /^https:\/\/api\.igs-pharma\.com/,
  /\/assets\//,
  /\/images\//,
  /\.(png|jpg|jpeg|gif|webp|svg|ico)$/,
];

// Resources to exclude from caching
const CACHE_BLACKLIST = [
  /\/admin/,
  /\/api\/auth/,
  /\/api\/payments/,
  /chrome-extension:/,
];

// Maximum cache size and age
const MAX_CACHE_SIZE = 100;
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      cleanupOldCaches(),
      // Claim all clients immediately
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip blacklisted resources
  if (CACHE_BLACKLIST.some(pattern => pattern.test(url.pathname))) {
    return;
  }

  // Handle different types of requests
  if (STATIC_ASSETS.some(asset => url.pathname.endsWith(asset))) {
    // Static assets - cache first strategy
    event.respondWith(cacheFirst(request));
  } else if (DYNAMIC_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    // Dynamic content - network first strategy
    event.respondWith(networkFirst(request));
  } else if (url.pathname.startsWith('/api/')) {
    // API requests - network first with shorter timeout
    event.respondWith(networkFirstAPI(request));
  } else {
    // Default - stale while revalidate
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications (if needed in the future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/logo192.png',
      badge: '/logo192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };

    event.waitUntil(
      self.registration.showNotification('IGS-Pharma', options)
    );
  }
});

// Caching strategies
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Cache first failed:', error);
    return new Response('Service Unavailable', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request, { timeout: 3000 });
    if (response.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, response.clone());
      limitCacheSize(DYNAMIC_CACHE_NAME, MAX_CACHE_SIZE);
    }
    return response;
  } catch (error) {
    console.log('[SW] Network first fallback to cache:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

async function networkFirstAPI(request) {
  try {
    const response = await fetch(request, { timeout: 5000 });
    return response;
  } catch (error) {
    console.log('[SW] API request failed:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Add offline indicator to cached API responses
      const offlineResponse = cachedResponse.clone();
      offlineResponse.headers.set('X-Served-By', 'service-worker-cache');
      return offlineResponse;
    }
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const networkPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      cache.put(request, response.clone());
      limitCacheSize(DYNAMIC_CACHE_NAME, MAX_CACHE_SIZE);
    }
    return response;
  }).catch(() => cachedResponse);

  return cachedResponse || networkPromise;
}

// Utility functions
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const validCaches = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];
  
  return Promise.all(
    cacheNames
      .filter(cacheName => !validCaches.includes(cacheName))
      .map(cacheName => {
        console.log('[SW] Deleting old cache:', cacheName);
        return caches.delete(cacheName);
      })
  );
}

async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    const keysToDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
    console.log(`[SW] Cache ${cacheName} cleaned up, removed ${keysToDelete.length} items`);
  }
}

async function doBackgroundSync() {
  // Handle offline actions that were queued
  console.log('[SW] Performing background sync...');
  
  try {
    // Check if we're online
    const response = await fetch('/api/health');
    if (response.ok) {
      // Process any queued offline actions
      // This would typically involve sending stored form data, etc.
      console.log('[SW] Background sync completed successfully');
    }
  } catch (error) {
    console.log('[SW] Background sync failed, will retry later:', error);
    throw error; // This will cause the sync to be retried
  }
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_INFO') {
    getCacheInfo().then(info => {
      event.ports[0].postMessage(info);
    });
  }
});

async function getCacheInfo() {
  const cacheNames = await caches.keys();
  const cacheInfo = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    cacheInfo[cacheName] = {
      size: keys.length,
      keys: keys.map(key => key.url)
    };
  }
  
  return cacheInfo;
}

console.log('[SW] Service worker script loaded successfully');
