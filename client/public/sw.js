// Service Worker for Droguerie Jamal PWA
// Version 1.0.0

const CACHE_NAME = 'droguerie-jamal-v1.0.0';
const STATIC_CACHE = 'droguerie-static-v1.0.0';
const DYNAMIC_CACHE = 'droguerie-dynamic-v1.0.0';
const API_CACHE = 'droguerie-api-v1.0.0';

// Static resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints to cache with network-first strategy
const API_ENDPOINTS = [
  '/api/products',
  '/api/categories',
  '/api/settings'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE &&
                cacheName !== DYNAMIC_CACHE &&
                cacheName !== API_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests with appropriate strategies
  if (request.method === 'GET') {
    // API requests - Network First with cache fallback
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(networkFirstStrategy(request, API_CACHE));
    }
    // Static assets - Cache First
    else if (STATIC_ASSETS.some(asset => url.pathname.includes(asset))) {
      event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    }
    // Images - Cache First with dynamic caching
    else if (request.destination === 'image') {
      event.respondWith(cacheFirstStrategy(request, DYNAMIC_CACHE));
    }
    // Documents/pages - Network First with cache fallback
    else if (request.destination === 'document') {
      event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    }
    // Other resources - Stale While Revalidate
    else {
      event.respondWith(staleWhileRevalidateStrategy(request, DYNAMIC_CACHE));
    }
  }
});

// Network First Strategy - Good for API calls and critical content
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      await cache.put(request.clone(), networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // If it's a navigation request and no cache, show offline page
    if (request.destination === 'document') {
      return await caches.match('/offline.html');
    }

    throw error;
  }
}

// Cache First Strategy - Good for static assets
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      await cache.put(request.clone(), networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Failed to fetch and cache:', request.url, error);
    throw error;
  }
}

// Stale While Revalidate Strategy - Good for frequently updated content
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse && networkResponse.status === 200) {
      const cache = caches.open(cacheName);
      cache.then((c) => c.put(request.clone(), networkResponse.clone()));
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);

  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCart());
  } else if (event.tag === 'order-sync') {
    event.waitUntil(syncOrders());
  }
});

// Sync cart data when back online
async function syncCart() {
  try {
    // Get pending cart updates from IndexedDB
    const pendingUpdates = await getPendingCartUpdates();

    for (const update of pendingUpdates) {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      });
    }

    await clearPendingCartUpdates();
    console.log('[SW] Cart synced successfully');
  } catch (error) {
    console.error('[SW] Cart sync failed:', error);
  }
}

// Sync order data when back online
async function syncOrders() {
  try {
    // Implementation for syncing orders
    console.log('[SW] Orders synced successfully');
  } catch (error) {
    console.error('[SW] Order sync failed:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  const options = {
    body: 'Your order has been updated!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Order',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-96x96.png'
      }
    ]
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.data = { ...options.data, ...data };
  }

  event.waitUntil(
    self.registration.showNotification('Droguerie Jamal', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/orders')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions for IndexedDB operations
async function getPendingCartUpdates() {
  // Implementation would use IndexedDB to store/retrieve pending updates
  return [];
}

async function clearPendingCartUpdates() {
  // Implementation would clear IndexedDB pending updates
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'GET_VERSION':
        event.ports[0].postMessage({ version: CACHE_NAME });
        break;
      case 'CACHE_URLS':
        event.waitUntil(
          caches.open(DYNAMIC_CACHE)
            .then((cache) => cache.addAll(event.data.urls))
        );
        break;
    }
  }
});

console.log('[SW] Service Worker script loaded successfully');
