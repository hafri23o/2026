import { createSignal, onCleanup } from 'solid-js'

/**
 * Reactive media query helper.
 * Safe for Vite build + strict TypeScript.
 */
export const createMediaQuery = (query: string): (() => boolean) => {
  // Guard for non-browser environments (Vite build, tests, etc.)
  if (typeof window === 'undefined' || !('matchMedia' in window)) {
    const [fallback] = createSignal(false)
    return fallback
  }

  const mql = window.matchMedia(query)
  const [matches, setMatches] = createSignal<boolean>(mql.matches)

  const onChange = (event: MediaQueryListEvent) => {
    setMatches(event.matches)
  }

  // Modern API
  if ('addEventListener' in mql) {
    mql.addEventListener('change', onChange)
    onCleanup(() => {
      mql.removeEventListener('change', onChange)
    })
  } else {
    // Legacy Safari fallback
    // eslint-disable-next-line deprecation/deprecation
    mql.addListener(onChange)
    onCleanup(() => {
      // eslint-disable-next-line deprecation/deprecation
      mql.removeListener(onChange)
    })
  }

  return matches
}
