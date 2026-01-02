/// <reference lib="WebWorker" />

/**
 * IMPORTANT:
 * This file MUST NOT import or share code with the main app.
 * Vite bundles this as a standalone worker.
 */

declare const self: ServiceWorkerGlobalScope

// Injected by the Vite serviceWorker plugin at build time
declare const ASSETS: string[]
declare const VERSION: string

export type {} // Ensure this file is treated as a module

/* ------------------------------------------------------------------ */
/* Install                                                            */
/* ------------------------------------------------------------------ */

self.addEventListener('install', (event) => {
  self.skipWaiting()

  event.waitUntil(
    (async () => {
      const cache = await caches.open(VERSION)
      await cache.addAll(ASSETS)
    })(),
  )
})

/* ------------------------------------------------------------------ */
/* Activate                                                           */
/* ------------------------------------------------------------------ */

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()

      await Promise.all(
        keys.map((key) => {
          if (key !== VERSION) {
            return caches.delete(key)
          }
          return undefined
        }),
      )

      await self.clients.claim()
    })(),
  )
})

/* ------------------------------------------------------------------ */
/* Fetch                                                              */
/* ------------------------------------------------------------------ */

self.addEventListener('fetch', (event) => {
  const { request } = event

  // Only handle GET requests
  if (request.method !== 'GET') {
    return
  }

  const url = new URL(request.url)

  // Only cache same-origin requests
  if (url.origin !== self.location.origin) {
    return
  }

  event.respondWith(
    (async () => {
      // SPA navigation fallback
      const cacheKey =
        request.mode === 'navigate' ? '/index.html' : request

      const cached = await caches.match(cacheKey)
      if (cached) {
        return cached
      }

      const response = await fetch(request)

      // Cache successful responses only
      if (response.ok) {
        const cache = await caches.open(VERSION)
        await cache.put(request, response.clone())
      }

      return response
    })(),
  )
})

/* ------------------------------------------------------------------ */
/* Messages                                                           */
/* ------------------------------------------------------------------ */

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
