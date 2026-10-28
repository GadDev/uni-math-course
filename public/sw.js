/* Public reading cache only. Never cache private sessions, grading or PDFs. */
const RUNTIME = 'uni-math-public-v1';
const PACK = 'uni-math-pack-v1';
const publicPage = /^\/(?:fr|en)\/(?:lessons\/L\d{2}\/|chapters\/C0[234]\/|glossary\/|numbers\/|exercises\/|offline\/)?$/;
const publicAsset = /^\/(?:_astro|diagrams|fonts|icons)\//;

function cacheable(response) {
  return response.ok && !/(?:private|no-store)/i.test(response.headers.get('cache-control') || '');
}

async function cacheFile(cache, path) {
  const response = await fetch(path, { credentials: 'omit', cache: 'reload' });
  if (!cacheable(response)) throw new Error('Uncacheable resource');
  await cache.put(path, response);
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(RUNTIME);
    const shell = [
      '/fr/', '/en/', '/fr/offline/', '/en/offline/', '/offline-index.json',
      '/favicon.svg', '/manifest.webmanifest',
      '/icons/icon-192.png', '/icons/icon-512.png',
      '/fonts/anton-latin-400-normal.woff2',
    ];
    try {
      const response = await fetch('/offline-index.json', { cache: 'no-store' });
      if (response.ok) {
        const index = await response.json();
        // CSS for the reading shell; all scripts are included in the explicit pack.
        shell.push(...index.assets.filter((path) => /^\/_astro\/.*\.css$/.test(path)));
      }
    } catch {
      // Retry from the offline manager when online.
    }
    await Promise.allSettled(shell.map((path) => cacheFile(cache, path)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const path = url.pathname;

  if (request.mode === 'navigate' && publicPage.test(path)) {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (cacheable(response) && (response.headers.get('content-type') || '').includes('text/html')) {
          await (await caches.open(RUNTIME)).put(path, response.clone());
        }
        return response;
      } catch {
        const packed = await (await caches.open(PACK)).match(path);
        const visited = await (await caches.open(RUNTIME)).match(path);
        const fallback = await (await caches.open(RUNTIME)).match(
          path.startsWith('/en/') ? '/en/offline/' : '/fr/offline/',
        );
        return packed || visited || fallback || Response.error();
      }
    })());
    return;
  }

  if (publicAsset.test(path) || path === '/favicon.svg' || path === '/manifest.webmanifest') {
    event.respondWith((async () => {
      const packed = await (await caches.open(PACK)).match(path);
      const visited = await (await caches.open(RUNTIME)).match(path);
      if (packed || visited) return packed || visited;
      const response = await fetch(request);
      if (cacheable(response)) await (await caches.open(RUNTIME)).put(path, response.clone());
      return response;
    })());
  }
});
