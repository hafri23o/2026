// Inspired by:
// https://whatwebcando.today/articles/handling-service-worker-updates/

// Vite service worker virtual module
import swURL from 'service-worker:./sw'

/* ------------------------------------------------------------------ */
/* Utilities                                                          */
/* ------------------------------------------------------------------ */

const waitForPageToLoad = async (): Promise<void> => {
  if (document.readyState === 'loading') {
    await new Promise<void>((resolve) => {
      window.addEventListener('load', () => resolve(), { once: true })
    })
  }
}

/* ------------------------------------------------------------------ */
/* Public API                                                         */
/* ------------------------------------------------------------------ */

export interface RegisterSWOptions {
  onNeedRefresh: (updateSW: () => void) => void
}

export const registerServiceWorker = async (
  options: RegisterSWOptions,
): Promise<void> => {
  // Optional: disable SW in dev if needed
  // if (import.meta.env.DEV) return

  if (!('serviceWorker' in navigator)) {
    return
  }

  await waitForPageToLoad()

  const registration = await navigator.serviceWorker.register(swURL, {
    scope: '/',
  })

  const promptForRefresh = (reg: ServiceWorkerRegistration) => {
    const updateSW = () => {
      const waiting = reg.waiting
      if (waiting) {
        waiting.postMessage({ type: 'SKIP_WAITING' })
      }
    }

    options.onNeedRefresh(updateSW)
  }

  // Handle already-waiting SW (missed updatefound case)
  if (registration.waiting) {
    promptForRefresh(registration)
  }

  let isFirstInstall = false

  registration.addEventListener('updatefound', () => {
    const installing = registration.installing
    if (!installing) return

    installing.addEventListener('statechange', () => {
      if (installing.state === 'installed' && registration.waiting) {
        if (navigator.serviceWorker.controller) {
          // Existing SW → prompt user
          promptForRefresh(registration)
        } else {
          // First install → no refresh needed
          isFirstInstall = true
        }
      }
    })
  })

  let isRefreshing = false

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (isFirstInstall) {
      isFirstInstall = false
      return
    }

    if (!isRefreshing) {
      isRefreshing = true
      window.location.reload()
    }
  })
}
