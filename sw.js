const CACHE_NAME = "cristian-cv-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/img/foto_cam.jpg",
  "/img/1750330836227.jpg",
  "/img/icons/apple-touch-icon.png",
  "/img/icons/favicon-32x32.png",
  "/img/icons/favicon-16x16.png",
  "/img/icons/favicon.ico",
  "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
  "https://cdn.emailjs.com/dist/email.min.js"
];

// Instalación del service worker y cache inicial
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activación y limpieza de caches antiguas
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => {
          if(key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Interceptar peticiones y servir del cache si existe
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => {
        // Opcional: fallback si no hay conexión (ej. un mensaje)
        if(event.request.destination === "document") return caches.match("/index.html");
      })
  );
});