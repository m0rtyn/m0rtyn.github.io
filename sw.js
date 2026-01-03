/**
 * Service Worker
 * Implements cache-first for static assets, stale-while-revalidate for HTML.
 */

const CACHE_NAME = 'm0rtyn-cc-v6';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/components/link-card/index.js',
  '/components/link-card/styles.css',
  '/components/link-card/template.html',
  '/components/site-logo/index.js',
  '/components/site-logo/styles.css',
  '/components/site-logo/template.html',
  '/assets/background-animation.js',
  '/assets/background-worker.js',
  '/assets/background-shared.js',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: stale-while-revalidate for HTML, cache-first for others
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  // Stale-while-revalidate for HTML (fresher content)
  const isHTML = url.pathname === '/' || url.pathname.endsWith('.html');
  
  if (isHTML) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        const fetchPromise = fetch(event.request).then((response) => {
          if (response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => cached);
        
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
