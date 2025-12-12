<<<<<<< HEAD
const CACHE_NAME = "particles-portfolio-v1";
const urlsToCache = [
  "/portfolio-particles/",
  "/portfolio-particles/index.html",
  "/portfolio-particles/styles.css",
  "/portfolio-particles/script.js",
  "/portfolio-particles/icons/icon-192.png",
  "/portfolio-particles/icons/icon-512.png"
];

// インストール時にキャッシュ
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// リクエストをキャッシュから返す
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// 古いキャッシュを削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
=======
const CACHE_NAME = "particles-portfolio-v1";
const urlsToCache = [
  "/portfolio-particles/",
  "/portfolio-particles/index.html",
  "/portfolio-particles/styles.css",
  "/portfolio-particles/script.js",
  "/portfolio-particles/icons/icon-192.png",
  "/portfolio-particles/icons/icon-512.png"
];

// インストール時にキャッシュ
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// リクエストをキャッシュから返す
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// 古いキャッシュを削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
>>>>>>> 2d7a18ab7888fbeb8da1c8af5af2a8e91bcc92b9
});