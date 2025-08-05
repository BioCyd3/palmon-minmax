// Service Worker for Palmon Website
// Optimized for InfinityFree hosting

const CACHE_NAME = 'palmon-v1';
const urlsToCache = [
  '/',
  '/css/style.css',
  '/js/main.js',
  '/js/app.js',
  '/palmon.json',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});