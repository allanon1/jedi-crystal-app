// Simple cache-first service worker for offline MVP
const CACHE_NAME = 'jedi-habit-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE_NAME && caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then(res => res || fetch(evt.request))
  );
});
