// Import Firebase libraries
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Your Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBm1qr9EER9PV8U8L6RqdeEIR7njNK0uxM",
  authDomain: "ikigai-app-5987b.firebaseapp.com",
  projectId: "ikigai-app-5987b",
  storageBucket: "ikigai-app-5987b.firebasestorage.app",
  messagingSenderId: "8611888107",
  appId: "1:8611888107:web:09670e70ade6ad63c237ae"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get messaging service
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Received background message:', payload);
  const notificationTitle = payload.notification.title || '🌸 Ikigai Reminder';
  const notificationOptions = {
    body: payload.notification.body || 'Time to log your activities!',
    icon: 'data:image/svg+xml,🌸',
    badge: 'data:image/svg+xml,🌸',
    tag: 'ikigai-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Open App'
      }
    ]
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client)
          return client.focus();
      }
      if (clients.openWindow)
        return clients.openWindow('/');
    })
  );
});

// Cache management
const CACHE_NAME = 'ikigai-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/firebase-config.js',
  '/razorpay-config.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('✅ Cache opened');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => new Response('Offline - Please check your connection'))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.navigate(client.url));
  });
});
