const CACHE_NAME = 'droguerie-jamal-v2.0.0';
const DATA_CACHE_NAME = 'droguerie-data-v1.0.0';

// Core app files to cache
const FILES_TO_CACHE = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/offline.html',
  // Arabic fonts
  'https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@100;200;300;400;500;600;700;800;900&display=swap',
  // Essential pages
  '/products',
  '/categories',
  '/cart',
  '/contact',
  // Essential icons
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints to cache for offline access
const API_CACHE_URLS = [
  '/api/products',
  '/api/categories',
  '/api/settings'
];

// Install event - cache core files
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page and core files');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[ServiceWorker] Pre-caching failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Ensure service worker takes control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      handleAPIRequest(event.request)
    );
    return;
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      handleNavigationRequest(event.request)
    );
    return;
  }

  // Handle other requests (assets, etc.)
  event.respondWith(
    handleAssetRequest(event.request)
  );
});

// Handle API requests with network-first strategy
async function handleAPIRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);

    if (response.status === 200) {
      // Cache successful API responses
      const cache = await caches.open(DATA_CACHE_NAME);
      cache.put(request.url, response.clone());
    }

    return response;
  } catch (error) {
    console.log('[ServiceWorker] API request failed, serving from cache:', request.url);

    // Fall back to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline API response for essential endpoints
    if (request.url.includes('/api/products')) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Offline mode - cached data not available',
        offline: true,
        data: []
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    throw error;
  }
}

// Handle navigation requests with cache-first for offline pages
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.log('[ServiceWorker] Navigation request failed, serving offline page');

    // Check if we have the specific page cached
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fall back to offline page
    return caches.match('/offline.html');
  }
}

// Handle asset requests with cache-first strategy
async function handleAssetRequest(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);

    // Cache successful asset responses
    if (response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('[ServiceWorker] Asset request failed:', request.url);

    // For image requests, return a placeholder
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">صورة غير متوفرة</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }

    throw error;
  }
}

// Background sync for orders
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync triggered:', event.tag);

  if (event.tag === 'sync-orders') {
    event.waitUntil(syncPendingOrders());
  }

  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCartData());
  }
});

// Sync pending orders when online
async function syncPendingOrders() {
  try {
    const pendingOrders = await getStoredData('pendingOrders') || [];

    for (const order of pendingOrders) {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(order)
        });

        if (response.ok) {
          // Remove synced order from pending list
          const updatedPendingOrders = pendingOrders.filter(o => o.id !== order.id);
          await storeData('pendingOrders', updatedPendingOrders);
          console.log('[ServiceWorker] Order synced successfully:', order.id);
        }
      } catch (error) {
        console.error('[ServiceWorker] Failed to sync order:', order.id, error);
      }
    }
  } catch (error) {
    console.error('[ServiceWorker] Background sync failed:', error);
  }
}

// Sync cart data
async function syncCartData() {
  try {
    const cartData = await getStoredData('cartData');

    if (cartData) {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartData)
      });

      if (response.ok) {
        console.log('[ServiceWorker] Cart data synced successfully');
      }
    }
  } catch (error) {
    console.error('[ServiceWorker] Failed to sync cart data:', error);
  }
}

// Push notifications for order updates
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received');

  const options = {
    body: 'تم تحديث حالة طلبك - Your order status has been updated',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'order-update',
    requireInteraction: true,
    actions: [
      {
        action: 'view-order',
        title: 'عرض الطلب',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'إغلاق',
        icon: '/icons/action-close.png'
      }
    ],
    data: {
      url: '/orders',
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.data.url = data.url || options.data.url;
  }

  event.waitUntil(
    self.registration.showNotification('دروغيري جمال', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification click received');

  event.notification.close();

  if (event.action === 'view-order') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Message handling for communication with main app
self.addEventListener('message', (event) => {
  console.log('[ServiceWorker] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_PRODUCTS') {
    event.waitUntil(cacheProducts(event.data.products));
  }

  if (event.data && event.data.type === 'STORE_ORDER') {
    event.waitUntil(storeOfflineOrder(event.data.order));
  }
});

// Cache products for offline access
async function cacheProducts(products) {
  try {
    const cache = await caches.open(DATA_CACHE_NAME);

    // Cache product images
    for (const product of products) {
      if (product.image_url) {
        try {
          await cache.add(product.image_url);
        } catch (error) {
          console.warn('[ServiceWorker] Failed to cache product image:', product.image_url);
        }
      }
    }

    console.log('[ServiceWorker] Products cached for offline access');
  } catch (error) {
    console.error('[ServiceWorker] Failed to cache products:', error);
  }
}

// Store order for later sync when online
async function storeOfflineOrder(order) {
  try {
    const pendingOrders = await getStoredData('pendingOrders') || [];
    pendingOrders.push({
      ...order,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      offline: true
    });

    await storeData('pendingOrders', pendingOrders);
    console.log('[ServiceWorker] Order stored for offline sync');

    // Register for background sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      await self.registration.sync.register('sync-orders');
    }
  } catch (error) {
    console.error('[ServiceWorker] Failed to store offline order:', error);
  }
}

// Helper functions for IndexedDB storage
async function storeData(key, data) {
  const cache = await caches.open(DATA_CACHE_NAME);
  const response = new Response(JSON.stringify(data));
  await cache.put(key, response);
}

async function getStoredData(key) {
  const cache = await caches.open(DATA_CACHE_NAME);
  const response = await cache.match(key);

  if (response) {
    return response.json();
  }

  return null;
}

// Network status detection
self.addEventListener('online', () => {
  console.log('[ServiceWorker] Network connection restored');
  // Trigger sync when coming back online
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    self.registration.sync.register('sync-orders');
    self.registration.sync.register('sync-cart');
  }
});

console.log('[ServiceWorker] Service Worker loaded for Droguerie Jamal PWA');
