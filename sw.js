// ============================================================
// SERVICE WORKER — Froidepannagebar "Glace"
// Version : 1.0.0
// Gère : cache offline, mises à jour automatiques, sécurité
// ============================================================

const APP_VERSION = 'glace-v1.0.0';
const CACHE_NAME = `froidepannage-${APP_VERSION}`;

// Fichiers à mettre en cache pour fonctionner offline
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap'
];

// ============================================================
// INSTALLATION — mise en cache des fichiers essentiels
// ============================================================
self.addEventListener('install', (event) => {
  console.log(`[SW] Installation version ${APP_VERSION}`);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Mise en cache des fichiers essentiels');
      return cache.addAll(FILES_TO_CACHE).catch((err) => {
        console.warn('[SW] Certains fichiers non cachés (normal au premier lancement) :', err);
      });
    }).then(() => {
      // Force activation immédiate sans attendre la fermeture de l'app
      return self.skipWaiting();
    })
  );
});

// ============================================================
// ACTIVATION — suppression des anciens caches
// ============================================================
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activation version ${APP_VERSION}`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('froidepannage-') && name !== CACHE_NAME)
          .map((name) => {
            console.log(`[SW] Suppression ancien cache : ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // Prend le contrôle immédiatement sur tous les onglets ouverts
      return self.clients.claim();
    })
  );
});

// ============================================================
// FETCH — stratégie de cache intelligente
// Network First pour les données, Cache First pour les assets
// ============================================================
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignorer les requêtes non-GET et les APIs externes
  if (event.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // Stratégie : Network First (toujours tenter le réseau d'abord)
  // Si le réseau échoue → fallback sur le cache (mode offline)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Mise en cache de la réponse fraîche
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Réseau indisponible → utiliser le cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Offline — chargement depuis le cache :', event.request.url);
            return cachedResponse;
          }
          // Page d'accueil comme fallback final
          return caches.match('/');
        });
      })
  );
});

// ============================================================
// NOTIFICATIONS PUSH — pour les commandes (future intégration)
// ============================================================
self.addEventListener('push', (event) => {
  let data = { title: 'Froidepannagebar "Glace"', body: 'Nouvelle notification', icon: '/icons/icon-192x192.png' };
  try { data = event.data.json(); } catch(e) {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
      data: data.url ? { url: data.url } : {}
    })
  );
});

// Clic sur une notification → ouvrir l'app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ============================================================
// MESSAGE — communication avec l'app (ex: forcer une mise à jour)
// ============================================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Mise à jour forcée par l\'application');
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: APP_VERSION });
  }
});
