const CACHE = "orc-static-v13";
const ASSETS = ["/orc-styles.css", "/orc-script.js", "/images/favicon.svg", "/favicon.svg", "/favicon.png", "/icon-192.png", "/icon-512.png", "/manifest.json", "/offline.html"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      await Promise.allSettled(ASSETS.map(a => c.add(a)));
      await self.skipWaiting();
    })
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  // Page navigations: try the network, fall back to the offline page.
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).catch(() => caches.match("/offline.html")));
    return;
  }

  const isStatic = ASSETS.some(a => url.pathname === a || url.pathname.endsWith(a.replace(/^\//, "")));
  if (!isStatic) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res && res.status === 200) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
