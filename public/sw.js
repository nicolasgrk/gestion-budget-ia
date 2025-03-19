const CACHE_NAME = 'budget-ai-v1';

// Liste des ressources à mettre en cache
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Ajoutez ici d'autres ressources statiques importantes
  '/api/analytics/monthly-stats',
  '/api/analytics/expenses-distribution',
  '/api/analytics/expenses-evolution',
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Stratégie de cache : Network First, fallback to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la requête réussit, mettre en cache et retourner la réponse
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        }
        throw new Error('Network response was not ok.');
      })
      .catch(() => {
        // En cas d'échec, essayer de récupérer depuis le cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // Si la ressource n'est pas dans le cache, retourner une page d'erreur
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            // Pour les autres ressources, retourner une réponse vide
            return new Response('', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Gestion des messages
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
}); 