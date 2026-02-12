/**
 * Service Worker for PWA
 * Handles offline caching and push notifications
 */

// Bump this value whenever you change static assets so clients don't get stuck
// on stale cached CSS/JS.
const CACHE_NAME = 'medical-orientation-v34';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/style.css',
    '/css/test-design.css',
    '/css/smooth-theme.css',
    '/css/advanced-ui.css',
    '/css/app-design.css',
    '/css/google-style.css',
    '/css/animations.css',
    '/css/organs-biochem.css',
    '/css/chem-lab.css',
    '/js/ai-tutor.js?v=34',
    '/js/organs-biochem.js?v=34',
    '/js/organs-3d-models.js?v=34',
    '/js/chem-lab.js?v=34',
    '/js/questions-database.js?v=34',
    '/js/app.js?v=34',
    '/js/gamification.js',
    '/js/mobile-pwa.js',
    '/js/international.js',
    '/js/premium-interactions.js',
    'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Cache installation failed:', error);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const req = event.request;

    if (req.method !== 'GET') {
        return;
    }

    const url = new URL(req.url);
    const sameOrigin = url.origin === self.location.origin;

    // Treat CSS/JS as network-first to prevent “stuck on old styles/scripts” after deploys.
    const isCssOrJs = sameOrigin && (
        req.destination === 'style' ||
        req.destination === 'script' ||
        url.pathname.endsWith('.css') ||
        url.pathname.endsWith('.js')
    );

    // Navigations should also be network-first (fresh app shell), with offline fallback.
    const isNavigation = req.mode === 'navigate';

    if (isCssOrJs || isNavigation) {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    if (sameOrigin && res && res.status === 200) {
                        const resToCache = res.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, resToCache));
                    }
                    return res;
                })
                .catch(() => {
                    if (isNavigation) return caches.match('/index.html');
                    return caches.match(req);
                })
        );
        return;
    }

    // Default: cache-first for other requests.
    event.respondWith(
        caches.match(req).then((cached) => {
            if (cached) return cached;
            return fetch(req).then((res) => {
                if (!sameOrigin || !res || res.status !== 200) return res;
                const resToCache = res.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(req, resToCache));
                return res;
            });
        })
    );
});

// Push notification event
self.addEventListener('push', (event) => {
    // TODO: Localize notification text based on user language preference
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Medical Orientation'; // Default title
    const body = data.body || 'New notification'; // Default body
    
    const options = {
        body: body,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'medical-notification',
        requireInteraction: false,
        data: data,
        actions: [
            {
                action: 'open',
                title: data.actionOpen || 'Open' // Localized by backend
            },
            {
                action: 'close',
                title: data.actionClose || 'Close' // Localized by backend
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Background sync event
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

// Sync offline data
async function syncData() {
    try {
        const cache = await caches.open('offline-data');
        const requests = await cache.keys();
        
        for (const request of requests) {
            const response = await cache.match(request);
            const data = await response.json();
            
            // Send to server
            await fetch(request.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            // Remove from cache after successful sync
            await cache.delete(request);
        }
    } catch (error) {
        console.error('Sync failed:', error);
    }
}

// Message event - handle messages from client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

